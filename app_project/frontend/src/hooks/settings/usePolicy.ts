import { computed } from "vue";
import { usePolicyStore } from "@/store/settings/policyStore";
import type { PolicyCreate } from "@/models/settings/policy";

export function usePolicy() {
  const policyStore = usePolicyStore();

  // === FETCH ===
  const fetchPolicies = () => policyStore.loadPolicies();
  const fetchPoliciesGroup = () => policyStore.loadPoliciesGroup();
  const fetchViewPolicies = () => policyStore.loadViewPolicies();

  // === ADD ===
  const addNewPolicy = (policy: PolicyCreate) => policyStore.addNewPolicy(policy);
  const addNewPolicyGroup = (policy: PolicyCreate) => policyStore.addNewPolicyGroup(policy);
  const addNewViewPolicy = (policy: PolicyCreate) => policyStore.addNewViewPolicy(policy);

  // === REMOVE ===
  const removePolicy = (policy: PolicyCreate) => policyStore.removeExistingPolicy(policy);
  const removePolicyGroup = (policy: PolicyCreate) => policyStore.removeExistingPolicyGroup(policy);
  const removeViewPolicy = (policy: PolicyCreate) => policyStore.removeExistingViewPolicy(policy);

  // === COMPUTED ===
  const policies = computed(() => policyStore.policies);
  const policiesGroup = computed(() => policyStore.policiesGroup);
  const viewPolicies = computed(() => policyStore.viewPolicies);
  const loading = computed(() => policyStore.loading);

  return {
    policyStore,
    // Fetchers
    fetchPolicies,
    fetchPoliciesGroup,
    fetchViewPolicies,

    // Actions
    addNewPolicy,
    addNewPolicyGroup,
    addNewViewPolicy,
    removePolicy,
    removePolicyGroup,
    removeViewPolicy,

    // State
    policies,
    policiesGroup,
    viewPolicies,
    loading,
  };
}
