// composables/ws/useRealtimeWebSocket.ts
import { ref, onMounted, onBeforeUnmount } from "vue"

export function useRealtimeWebSocket<T = any>(
  path: string,
  {
    maxBackoff = 30000,
    heartbeatInterval = 30000,
    fatalCloseCodes = [1008, 1003, 4001, 4003, 4401, 4403]
  } = {}
) {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const backoff = ref(1000)
  const timeoutId = ref<number | undefined>()
  let hbTimer: number

  // Track whether handshake ever succeeded
  let handshakeDone = false

  const url = `${import.meta.env.VITE_WS_BASE}${path}`

  const connect = () => {
    const token = document.cookie.match(/_aid-atk_=([^;]+)/)?.[1]
    if (!token) {
      // console.warn(`[WS] ⛔ No token, skipping connection to ${path}`)
      return
    }

    handshakeDone = false
    ws.value = new WebSocket(`${url}?token=${encodeURIComponent(token)}`)

    ws.value.onopen = () => {
      // console.info(`[WS] ✅ Connected to ${path}`)
      handshakeDone = true
      isConnected.value = true
      backoff.value = 1000
      // Start heartbeat
      hbTimer = window.setInterval(() => {
        if (ws.value?.readyState === WebSocket.OPEN) {
          ws.value.send("__ping__")
        }
      }, heartbeatInterval)
    }

    ws.value.onmessage = event => {
      if (event.data === "__pong__") return
      try {
        const data = JSON.parse(event.data) as T
        handlers.forEach(h => h(data))
      } catch (err) {
        // console.error(`[WS] ❌ Invalid JSON on ${path}:`, err)
      }
    }

    ws.value.onclose = event => {
      // console.warn(`[WS] 🔌 Disconnected from ${path} (code: ${event.code})`)
      isConnected.value = false
      clearInterval(hbTimer)

      // If close happened before handshake or with non-fatal code, retry
      const nonFatal = !fatalCloseCodes.includes(event.code)
      if (nonFatal && handshakeDone) {
        timeoutId.value = window.setTimeout(connect, backoff.value)
        backoff.value = Math.min(backoff.value * 2, maxBackoff)
        // console.info(`[WS] 🔁 Reconnecting to ${path} in ${backoff.value}ms...`)
      } else if (nonFatal && !handshakeDone) {
        // console.warn(`[WS] 🛑 Handshake failed, not reconnecting to ${path}`)
      } else {
        // console.info(`[WS] 🛑 Fatal code ${event.code}, will not reconnect to ${path}`)
      }
    }

    ws.value.onerror = error => {
      // console.error(`[WS] ❌ Error on ${path}:`, error)
      // Close to trigger onclose
      ws.value?.close()
    }
  }

  const disconnect = () => {
    clearInterval(hbTimer)
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }
    ws.value?.close()
    ws.value = null
    isConnected.value = false
  }

  const handlers = new Set<(data: T) => void>()
  const onMessage = (fn: (data: T) => void) => {
    handlers.add(fn)
    return () => handlers.delete(fn)
  }

  onMounted(connect)
  onBeforeUnmount(disconnect)

  return {
    connect,
    disconnect,
    onMessage,
    isConnected,
  }
}
