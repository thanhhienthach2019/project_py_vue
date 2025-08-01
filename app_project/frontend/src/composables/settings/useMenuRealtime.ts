// composables/settings/useMenuRealtime.ts
import { useMenuStore } from "@/store/settings/menuStore"
import type { MenuItemResponse } from "@/models/settings/menu"
import { useRealtimeWebSocket } from "@/composables/ws/useRealtimeWebSocket"

type MenuMessage = {
  action: "create" | "update" | "delete"
  type: "menu"
  item: MenuItemResponse
}

export function useMenuRealtime() {
  const store = useMenuStore()

  const { onMessage, isConnected, disconnect, connect } =
    useRealtimeWebSocket<MenuMessage>("/menus")

  const off = onMessage(({ action, item, type }) => {
    if (type !== "menu") return
    const index = store.menus.findIndex(x => x.id === item.id)

    if (action === "create" && index < 0) {
      store.menus.push(item)
    } else if (action === "update" && index >= 0) {
      store.menus.splice(index, 1, item)
    } else if (action === "delete") {
      store.menus = store.menus.filter(x => x.id !== item.id)
    }
  })

  return {
    isConnected,
    connect,
    disconnect,
    unsubscribe: off,
  }
}
