import { computed } from "vue";
import { usePolicyStore } from "@/store/settings/policyStore";
import type { PolicyCreate } from "@/models/settings/policy";

export function usePolicy() {
  const store = usePolicyStore();

  // === FETCH ===
  const fetchPolicies = () => store.loadPolicies();
  const fetchPoliciesGroup = () => store.loadPoliciesGroup();
  const fetchViewPolicies = () => store.loadViewPolicies();

  // === ADD ===
  const addNewPolicy = (policy: PolicyCreate) => store.addNewPolicy(policy);
  const addNewPolicyGroup = (policy: PolicyCreate) => store.addNewPolicyGroup(policy);
  const addNewViewPolicy = (policy: PolicyCreate) => store.addNewViewPolicy(policy);

  // === REMOVE ===
  const removePolicy = (policy: PolicyCreate) => store.removeExistingPolicy(policy);
  const removePolicyGroup = (policy: PolicyCreate) => store.removeExistingPolicyGroup(policy);
  const removeViewPolicy = (policy: PolicyCreate) => store.removeExistingViewPolicy(policy);

  // === COMPUTED ===
  const policies = computed(() => store.policies);
  const policiesGroup = computed(() => store.policiesGroup);
  const viewPolicies = computed(() => store.viewPolicies);
  const loading = computed(() => store.loading);

  return {
    
    fetchPolicies,
    fetchPoliciesGroup,
    fetchViewPolicies,

    addNewPolicy,
    addNewPolicyGroup,
    addNewViewPolicy,

    removePolicy,
    removePolicyGroup,
    removeViewPolicy,

    policies,
    policiesGroup,
    viewPolicies,
    loading,
  };
}
