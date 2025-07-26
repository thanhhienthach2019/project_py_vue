// src/composables/stateStatusRegistry.ts
import { reactive } from 'vue'
import type { Store } from 'pinia'

type AnyStore = Store<string, any, any, any>

const registry = reactive<AnyStore[]>([])

/**
 * Gọi ở setup() của mỗi page/component muốn track
 */
export function registerStateStatusStore(store: AnyStore) {
  if (!registry.includes(store)) {
    registry.push(store)
  }
}

/**
 * Dùng trong StateStatusPanel để biết list stores đang track
 */
export function useRegisteredStateStatusStores() {
  return registry
}
