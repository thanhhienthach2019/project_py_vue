// composables/ws/useRealtimeWebSocket.ts
import { onMounted, onBeforeUnmount } from "vue"

type MessageHandler<T> = (data: T) => void

export function useRealtimeWebSocket<T = any>(
  path: string,
  handleMessage: MessageHandler<T>
) {
  let socket: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let manuallyClosed = false

  const connect = () => {
    const wsUrl = `${import.meta.env.VITE_WS_BASE}${path}`
    socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      console.info(`[WS] ✅ Connected to ${path}`)
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as T
        handleMessage(data)
      } catch (err) {
        console.error(`[WS] ❌ Failed to parse message on ${path}:`, err)
      }
    }

    socket.onclose = (event) => {
      socket = null
      if (!manuallyClosed) {
        console.warn(`[WS] 🔌 Disconnected (code: ${event.code}) from ${path} — Reconnecting in 1s`)
        reconnectTimer = setTimeout(connect, 1000)
      }
    }

    socket.onerror = (err) => {
      console.error(`[WS] ❌ Error on ${path}:`, err)
      socket?.close()
    }
  }

  const cleanup = () => {
    manuallyClosed = true
    reconnectTimer && clearTimeout(reconnectTimer)
    socket?.close()
    socket = null
  }

  onMounted(() => {
    manuallyClosed = false
    connect()
  })

  onBeforeUnmount(() => {
    cleanup()
  })
}
