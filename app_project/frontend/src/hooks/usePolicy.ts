import { computed } from "vue";
import { usePolicyStore } from "@/store/policyStore";
import type { PolicyCreate } from "@/models/policy";

export function usePolicy() {
  const policyStore = usePolicyStore();

  const fetchPolicies = async () => {
    try {
      await policyStore.loadPolicies();
    } catch (error) {
      console.error("Failed to fetch policies:", error);
    }
  };

  const fetchPoliciesGroup = async () => {
    try {
      await policyStore.loadPoliciesGroup();
    } catch (error) {
      console.error("Failed to fetch policies:", error);
    }
  };

  const addNewPolicy = async (policy: PolicyCreate) => {
    try {
      const response = await policyStore.addNewPolicy(policy);
      return response;
    } catch (error) {
      console.error("Failed to add policy:", error);
      return { success: false, message: "An error occurred while adding the policy." };
    }
  };

  const addNewPolicyGroup = async (policy: PolicyCreate) => {
    try {
      const response = await policyStore.addNewPolicyGroup(policy);
      return response;
    } catch (error) {
      console.error("Failed to add policy:", error);
      return { success: false, message: "An error occurred while adding the policy." };
    }
  };

  const removePolicy = async (policy: PolicyCreate) => {
    try {
      const response = await policyStore.removeExistingPolicy(policy);
      return response;
    } catch (error) {
      console.error("Failed to remove policy:", error);
      return { success: false, message: "An error occurred while removing the policy." };
    }
  };

  const removePolicyGroup = async (policy: PolicyCreate) => {
    try {
      const response = await policyStore.removeExistingPolicyGroup(policy);
      return response;
    } catch (error) {
      console.error("Failed to remove policy:", error);
      return { success: false, message: "An error occurred while removing the policy." };
    }
  };

  return {
    fetchPolicies,
    fetchPoliciesGroup,
    addNewPolicy,
    removePolicy,
    addNewPolicyGroup,
    removePolicyGroup,
    policies: computed(() => policyStore.policies || []),
    policiesGroup: computed(() => policyStore.policiesGroup || []),
    loading: computed(() => policyStore.loading),
  };
}
