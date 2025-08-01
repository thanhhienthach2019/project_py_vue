// composables/settings/useBindingRealtime.ts
import { usePermissionRouterStore } from "@/store/settings/permissionRouterStore"
import type { RouterPermissionResponse } from "@/models/settings/permissionRouter"
import { useRealtimeWebSocket } from "@/composables/ws/useRealtimeWebSocket"

type Message = {
  action: "create" | "update" | "delete"
  type: "binding"
  item: RouterPermissionResponse
}

export function useBindingRealtime() {
  const store = usePermissionRouterStore()
  const { onMessage, isConnected, connect, disconnect } = useRealtimeWebSocket<Message>(
    "/router-permissions/bindings"
  )

  const unsubscribe = onMessage(({ action, item }) => {
    const index = store.bindings.findIndex((b) => b.id === item.id)
    if (action === "create" && index === -1) store.bindings.push(item)
    else if (action === "update" && index !== -1) store.bindings.splice(index, 1, item)
    else if (action === "delete") store.bindings = store.bindings.filter((b) => b.id !== item.id)
  })

  return { isConnected, connect, disconnect, unsubscribe }
}
