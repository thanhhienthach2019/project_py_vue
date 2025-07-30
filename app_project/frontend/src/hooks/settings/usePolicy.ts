import { computed } from 'vue'
import { usePolicyStore } from '@/store/settings/policyStore'
import type { PolicyCreate, PolicyItem } from '@/models/settings/policy'

export function usePolicy() {
  const store = usePolicyStore()

  // ============ State Getters ============
  const state = {
    policies: computed<PolicyItem[]>(() => store.policies),
    policiesGroup: computed<PolicyItem[]>(() => store.policiesGroup),
    viewPolicies: computed<PolicyItem[]>(() => store.viewPolicies),
    isLoading: computed<boolean>(() => store.isLoading),
    isLoadingPolicies: computed<boolean>(() => store.isLoadingPolicies),
    isLoadingGroups: computed<boolean>(() => store.isLoadingGroups),
    isLoadingViews: computed<boolean>(() => store.isLoadingViews),
    isCreating: computed<boolean>(() => store.isCreating),
    isDeleting: computed<boolean>(() => store.isDeleting),
    deletingKey: computed<string | null>(() => store.deletingKey),
  }

  // ============ Data Loading ============
  const loaders = {
    fetchPolicies: async () => {
      try {
        return await store.loadPolicies()
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to load policies' }
      }
    },
    fetchPolicyGroups: async () => {
      try {
        return await store.loadPoliciesGroup()
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to load group policies' }
      }
    },
    fetchViewPolicies: async () => {
      try {
        return await store.loadViewPolicies()
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to load view policies' }
      }
    },
  }

  // ============ Policy Operations ============
  const actions = {
    addPolicy: async (data: PolicyCreate) => {
      try {
        return await store.addNewPolicy(data)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to add policy' }
      }
    },
    addPolicyGroup: async (data: PolicyCreate) => {
      try {
        return await store.addNewPolicyGroup(data)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to add group policy' }
      }
    },
    addViewPolicy: async (data: PolicyCreate) => {
      try {
        return await store.addNewViewPolicy(data)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to add view policy' }
      }
    },
    removePolicy: async (data: PolicyCreate) => {
      try {
        return await store.removeExistingPolicy(data)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to remove policy' }
      }
    },
    removePolicyGroup: async (data: PolicyCreate) => {
      try {
        return await store.removeExistingPolicyGroup(data)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to remove group policy' }
      }
    },
    removeViewPolicy: async (data: PolicyCreate) => {
      try {
        return await store.removeExistingViewPolicy(data)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to remove view policy' }
      }
    },
  }

  // ============ Helper Getters ============
  const getters = {
    findPolicy: (key: string) =>
      store.policies.find(
        p => JSON.stringify({ ptype: p.ptype, v0: p.v0, v1: p.v1, v2: p.v2 }) === key
      ),
  }

  return {
    // State
    ...state,
    // Loaders
    ...loaders,
    // Actions
    ...actions,
    // Getters
    ...getters,
  }
}
