// composables/settings/useMenuRealtime.ts
import { useMenuStore } from "@/store/settings/menuStore"
import type {
  MenuItemResponse
} from "@/models/settings/menu"
import { useRealtimeWebSocket } from "@/composables/ws/useRealtimeWebSocket"

type Message = {
  action: "create" | "update" | "delete"
  type: "menu" 
  item: MenuItemResponse
}

export function useMenuRealtime() {
  const store = useMenuStore()

  useRealtimeWebSocket<Message>("/api/v1/ws/menus", ({ action, type, item }) => {
    switch (type) {
      case "menu": {
        const r = item as MenuItemResponse
        const index = store.menus.findIndex((x) => x.id === r.id)
        if (action === "create") store.menus.push(r)
        else if (action === "update" && index !== -1) store.menus.splice(index, 1, r)
        else if (action === "delete") store.menus = store.menus.filter((x) => x.id !== r.id)
        break
      }      
    }
  })
}
