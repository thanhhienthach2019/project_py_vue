// composables/settings/usePermissionRouterRealtime.ts
import { useRouterRealtime } from "@/composables/settings/useRouterRealtime"
import { usePermissionRealtime } from "@/composables/settings/usePermissionRealtime"
import { useBindingRealtime } from "@/composables/settings/useBindingRealtime"
import { computed } from "vue"

export function usePermissionRouterRealtime() {
  const routerWS = useRouterRealtime()
  const permissionWS = usePermissionRealtime()
  const bindingWS = useBindingRealtime()

  const connect = () => {
    routerWS.connect()
    permissionWS.connect()
    bindingWS.connect()
  }

  const disconnect = () => {
    routerWS.disconnect()
    permissionWS.disconnect()
    bindingWS.disconnect()
  }

  const unsubscribe = () => {
    routerWS.unsubscribe()
    permissionWS.unsubscribe()
    bindingWS.unsubscribe()
  }

  const isConnected = computed(() =>
    routerWS.isConnected.value &&
    permissionWS.isConnected.value &&
    bindingWS.isConnected.value
  )

  return {
    connect,
    disconnect,
    unsubscribe,
    isConnected,
  }
}
