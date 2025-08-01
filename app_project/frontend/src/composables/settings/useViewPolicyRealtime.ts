// composables/settings/useViewPolicyRealtime.ts
import { usePolicyStore } from "@/store/settings/policyStore"
import type { PolicyItem } from "@/models/settings/policy"
import { useRealtimeWebSocket } from "@/composables/ws/useRealtimeWebSocket"

type Message = {
  action: "create" | "update" | "delete"
  type: "policy"
  item: PolicyItem
}

export function useViewPolicyRealtime() {
  const store = usePolicyStore()

  const { onMessage, isConnected, disconnect, connect } = useRealtimeWebSocket<Message>(
    "/policies/permission/view"
  )

  const off = onMessage(({ action, type, item }) => {
    if (type !== "policy" || item.ptype !== "v") return

    const key = `${item.ptype}-${item.v0}-${item.v1}-${item.v2}`
    const index = store.viewPolicies.findIndex(i => `${i.ptype}-${i.v0}-${i.v1}-${i.v2}` === key)

    switch (action) {
      case "create":
        if (index === -1) store.viewPolicies.push(item)
        break
      case "update":
        if (index !== -1) store.viewPolicies.splice(index, 1, item)
        break
      case "delete":
        if (index !== -1) store.viewPolicies.splice(index, 1)
        break
    }
  })

  return { isConnected, unsubscribe: off, connect, disconnect }
}
