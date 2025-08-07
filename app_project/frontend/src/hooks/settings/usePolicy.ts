import { computed } from 'vue'
import { usePolicyStore } from '@/store/settings/policyStore'
import type { PolicyCreate, PolicyItem } from '@/models/settings/policy'
import { createWithToastAction } from "@/utils/withToastAction";

export function usePolicy() {
  const store = usePolicyStore()
  const withToastAction = createWithToastAction();
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
    fetchPolicies: () => withToastAction(() => store.loadPolicies()),
    fetchPolicyGroups: () => withToastAction(() => store.loadPoliciesGroup()),
    fetchViewPolicies: () => withToastAction(() => store.loadViewPolicies())
  }

  // ============ Policy Operations ============
  const actions = {
    addPolicy: (data: PolicyCreate)  => withToastAction(() => store.addPolicy(data)),
    addPolicyGroup: (data: PolicyCreate) => withToastAction(() => store.addPolicy(data)),
    addViewPolicy: (data: PolicyCreate) => withToastAction(() => store.addPolicy(data)),
    removePolicy: (data: PolicyCreate) => withToastAction(() => store.removePolicy(data)),
    removePolicyGroup: (data: PolicyCreate) => withToastAction(() => store.removePolicy(data)),
    removeViewPolicy: (data: PolicyCreate) => withToastAction(() => store.removePolicy(data))
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
