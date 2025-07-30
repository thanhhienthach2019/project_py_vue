// composables/settings/usePermissionRouterRealtime.ts
import { usePermissionRouterStore } from "@/store/settings/permissionRouterStore"
import type {
  RouterResponse,
  PermissionResponse,
  RouterPermissionResponse,
} from "@/models/settings/permissionRouter"
import { useRealtimeWebSocket } from "@/composables/ws/useRealtimeWebSocket"

type Message = {
  action: "create" | "update" | "delete"
  type: "router" | "permission" | "binding"
  item: RouterResponse | PermissionResponse | RouterPermissionResponse
}

export function usePermissionRouterRealtime() {
  const store = usePermissionRouterStore()

  useRealtimeWebSocket<Message>("/api/v1/ws/permission-routers", ({ action, type, item }) => {
    switch (type) {
      case "router": {
        const r = item as RouterResponse
        const index = store.routers.findIndex((x) => x.id === r.id)
        if (action === "create") store.routers.push(r)
        else if (action === "update" && index !== -1) store.routers.splice(index, 1, r)
        else if (action === "delete") store.routers = store.routers.filter((x) => x.id !== r.id)
        break
      }

      case "permission": {
        const p = item as PermissionResponse
        const index = store.permissions.findIndex((x) => x.id === p.id)
        if (action === "create") store.permissions.push(p)
        else if (action === "update" && index !== -1) store.permissions.splice(index, 1, p)
        else if (action === "delete") store.permissions = store.permissions.filter((x) => x.id !== p.id)
        break
      }

      case "binding": {
        const b = item as RouterPermissionResponse
        const index = store.bindings.findIndex((x) => x.id === b.id)
        if (action === "create") store.bindings.push(b)
        else if (action === "update" && index !== -1) store.bindings.splice(index, 1, b)
        else if (action === "delete") store.bindings = store.bindings.filter((x) => x.id !== b.id)
        break
      }
    }
  })
}
