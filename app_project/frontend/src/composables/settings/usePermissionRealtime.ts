// composables/settings/usePermissionRealtime.ts
import { usePermissionRouterStore } from "@/store/settings/permissionRouterStore"
import type { PermissionResponse } from "@/models/settings/permissionRouter"
import { useRealtimeWebSocket } from "@/composables/ws/useRealtimeWebSocket"

type Message = {
  action: "create" | "update" | "delete"
  type: "permission"
  item: PermissionResponse
}

export function usePermissionRealtime() {
  const store = usePermissionRouterStore()
  const { onMessage, isConnected, connect, disconnect } = useRealtimeWebSocket<Message>(
    "/router-permissions/permissions"
  )

  const unsubscribe = onMessage(({ action, item }) => {
    const index = store.permissions.findIndex((p) => p.id === item.id)
    if (action === "create" && index === -1) store.permissions.push(item)
    else if (action === "update" && index !== -1) store.permissions.splice(index, 1, item)
    else if (action === "delete") store.permissions = store.permissions.filter((p) => p.id !== item.id)
  })

  return { isConnected, connect, disconnect, unsubscribe }
}
