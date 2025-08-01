// composables/settings/useRouterRealtime.ts
import { usePermissionRouterStore } from "@/store/settings/permissionRouterStore"
import type { RouterResponse } from "@/models/settings/permissionRouter"
import { useRealtimeWebSocket } from "@/composables/ws/useRealtimeWebSocket"

type Message = {
  action: "create" | "update" | "delete"
  type: "router"
  item: RouterResponse
}

export function useRouterRealtime() {
  const store = usePermissionRouterStore()
  const { onMessage, isConnected, connect, disconnect } = useRealtimeWebSocket<Message>(
    "/router-permissions/routers"
  )

  const unsubscribe = onMessage(({ action, item }) => {
    const index = store.routers.findIndex((r) => r.id === item.id)
    if (action === "create" && index === -1) store.routers.push(item)
    else if (action === "update" && index !== -1) store.routers.splice(index, 1, item)
    else if (action === "delete") store.routers = store.routers.filter((r) => r.id !== item.id)
  })

  return { isConnected, connect, disconnect, unsubscribe }
}
