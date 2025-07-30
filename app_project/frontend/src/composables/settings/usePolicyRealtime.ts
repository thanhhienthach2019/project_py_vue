import { usePolicyStore } from "@/store/settings/policyStore"
import type { PolicyItem } from "@/models/settings/policy"
import { useRealtimeWebSocket } from "@/composables/ws/useRealtimeWebSocket"

type Message = {
  action: "create" | "update" | "delete"
  type: "policy"
  item: PolicyItem
}

export function usePolicyRealtime() {
  const store = usePolicyStore()

  function handleRealtimePolicyUpdate(item: PolicyItem, action: "create" | "update" | "delete") {
    const key = `${item.ptype}-${item.v0}-${item.v1}-${item.v2}`

    const updateList = (list: PolicyItem[]) => {
      const index = list.findIndex(i =>
        `${i.ptype}-${i.v0}-${i.v1}-${i.v2}` === key
      )
      if (action === "create") {
        if (index === -1) return [...list, item]
        return list
      } else if (action === "update") {
        if (index !== -1) {
          const updated = [...list]
          updated[index] = item
          return updated
        }
        return list
      } else if (action === "delete") {
        if (index !== -1) {
          const updated = [...list]
          updated.splice(index, 1)
          return updated
        }
        return list
      }
      return list
    }

    if (item.ptype === "p") {
      store.policies = updateList(store.policies)
    } else if (item.ptype === "g") {
      store.policiesGroup = updateList(store.policiesGroup)
    } else if (item.ptype === "v") {
      store.viewPolicies = updateList(store.viewPolicies)
    } else {
      console.warn("Unknown ptype in policy item", item)
    }
  }

  useRealtimeWebSocket<Message>("/api/v1/ws/policies", ({ action, type, item }) => {
    if (type === "policy") {
      handleRealtimePolicyUpdate(item, action)
    }
  })
}
