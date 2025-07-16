import { defineStore } from "pinia";
import {
  fetchPolicies,
  addPolicy,
  deletePolicy,
  fetchPoliciesGroup,
  fetchViewPolicies,
} from "@/services/settings/policyService";
import type { PolicyItem, PolicyCreate } from "@/models/settings/policy";

interface PolicyState {
  policies: PolicyItem[];
  policiesGroup: PolicyItem[];
  viewPolicies: PolicyItem[]; 
  loading: boolean;
}

export const usePolicyStore = defineStore("policy", {
  state: (): PolicyState => ({
    policies: [],
    policiesGroup: [],
    viewPolicies: [],
    loading: false
  }),

  actions: {
    async loadPolicies() {
      this.loading = true;
      try {
        const response = await fetchPolicies();
        if (response.success && response.data) {
          this.policies = response.data;
        } else {
          // console.error(response.message);
        }
      } catch (error) {
        // console.error("An error occurred while fetching policies:", error);
      } finally {
        this.loading = false;
      }
    },

    async loadPoliciesGroup() {
      this.loading = true;
      try {
        const response = await fetchPoliciesGroup();
        if (response.success && response.data) {
          this.policiesGroup = response.data;
        } else {
          // console.error(response.message);
        }
      } catch (error) {
        // console.error("An error occurred while fetching policies:", error);
      } finally {
        this.loading = false;
      }
    },

    async loadViewPolicies() {
      this.loading = true;
      try {
        const response = await fetchViewPolicies(); 
        if (response.success && response.data) {
          this.viewPolicies = response.data;
        } else {
          // console.error(response.message);
        }
      } catch (error) {
        // console.error("An error occurred while fetching view policies:", error);
      } finally {
        this.loading = false;
      }
    },

    async addNewPolicy(newPolicy: PolicyCreate) {
      const tempId = -Date.now(); 
      const optimisticItem = { ...newPolicy, id: tempId } as PolicyItem;
      this.policies.push(optimisticItem);
      try {
        const response = await addPolicy(newPolicy);
        if (response.success && response.data) {
          const index = this.policies.findIndex(i => i.id === tempId);
          if (index !== -1) {
            this.policies.splice(index, 1, response.data); 
          }
        } else {
          this.policies = this.policies.filter(i => i.id !== tempId); // Rollback
        }
        return response;
      } catch (error) {
        this.policies = this.policies.filter(i => i.id !== tempId); // Rollback
        return { success: false, message: "Unexpected error when adding policy." };
      }
    },

    async addNewPolicyGroup(newPolicy: PolicyCreate) {
      const tempId = -Date.now(); 
      const optimisticItem = { ...newPolicy, id: tempId } as PolicyItem;
      this.policiesGroup.push(optimisticItem);

      try {
        const response = await addPolicy(newPolicy);
        if (response.success && response.data) {
          const index = this.policiesGroup.findIndex(i => i.id === tempId);
          if (index !== -1) {
            this.policiesGroup.splice(index, 1, response.data); 
          }
        } else {
          this.policiesGroup = this.policiesGroup.filter(i => i.id !== tempId); // Rollback
        }
        return response;
      } catch (err) {
        this.policiesGroup = this.policiesGroup.filter(i => i.id !== tempId); // Rollback
        return { success: false, message: "Unexpected error when adding policy." };
      }
    },

    async addNewViewPolicy(newPolicy: PolicyCreate) {
      const tempId = -Date.now(); 
      const optimisticItem = { ...newPolicy, id: tempId } as PolicyItem;
      this.viewPolicies.push(optimisticItem);

      try {
        const response = await addPolicy(newPolicy);
        if (response.success && response.data) {
          const index = this.viewPolicies.findIndex(i => i.id === tempId);
          if (index !== -1) {
            this.viewPolicies.splice(index, 1, response.data); 
          }
        } else {
          this.viewPolicies = this.viewPolicies.filter(i => i.id !== tempId); // Rollback
        }
        return response;
      } catch (err) {
        this.viewPolicies = this.viewPolicies.filter(i => i.id !== tempId); // Rollback
        return { success: false, message: "Unexpected error when adding policy." };
      }
    },

    async removeExistingPolicy(policy: PolicyCreate) {
     const backup = [...this.policies];
      this.policies = this.policies.filter(
        i => !(i.ptype === policy.ptype && i.v0 === policy.v0 && i.v1 === policy.v1 && i.v2 === policy.v2)
      );

      try {
        const response = await deletePolicy(policy);
        if (!response.success) {
          this.policies = backup;
        }
        return response;
      } catch (error) {
        this.policies = backup;
        return { success: false, message: "Unexpected error when deleting policy." };
      }
    },

    async removeExistingPolicyGroup(policy: PolicyCreate & { id?: string }) {
      const backup = [...this.policiesGroup];
      this.policiesGroup = this.policiesGroup.filter(
        i => !(i.ptype === policy.ptype && i.v0 === policy.v0 && i.v1 === policy.v1 && i.v2 === policy.v2)
      );

      try {
        const response = await deletePolicy(policy);
        if (!response.success) {
          this.policiesGroup = backup;
        }
        return response;
      } catch (error) {
        this.policiesGroup = backup;
        return { success: false, message: "Unexpected error when deleting policy." };
      }
    },

    async removeExistingViewPolicy(policy: PolicyCreate) {
      const backup = [...this.viewPolicies];
      this.viewPolicies = this.viewPolicies.filter(
        i => !(i.ptype === policy.ptype && i.v0 === policy.v0 && i.v1 === policy.v1 && i.v2 === policy.v2)
      );

      try {
        const response = await deletePolicy(policy);
        if (!response.success) {
          this.viewPolicies = backup;
        }
        return response;
      } catch (error) {
        this.viewPolicies = backup;
        return { success: false, message: "Unexpected error when deleting policy." };
      }
    }
  }
});
