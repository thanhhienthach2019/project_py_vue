// composables/auth/useUserRealtime.ts
import { useUserStore } from "@/store/auth/userStore"
import type { UserResponse } from "@/models/auth/user"
import { useRealtimeWebSocket } from "@/composables/ws/useRealtimeWebSocket"

type UserMessage = {
    action: "create" | "update" | "delete"
    type: "user"
    item: UserResponse
}

export function useUserRealtime() {
    const store = useUserStore()

    const { onMessage, isConnected, disconnect, connect } = 
    useRealtimeWebSocket<UserMessage>("/users")

    const off = onMessage(({ action, item, type }) => {
        if (type !== "user") return
        const index = store.users.findIndex(x => x.id === item.id)

        if (action === "create" && index < 0) {
            store.users.push(item)
        } else if (action === "update" && index >= 0) {
            store.users.splice(index, 1, item)
        } else if (action === "delete") {
            store.users = store.users.filter(x => x.id !== item.id)
        }
    })

    return {
        isConnected,
        connect,
        disconnect,
        unsubscribe: off,
    }
}