import { defineStore } from "pinia";
import {
  fetchPolicies,
  addPolicy,
  deletePolicy,
  fetchPoliciesGroup
} from "@/services/policy";
import type { PolicyItem, PolicyCreate } from "@/models/policy";

interface PolicyState {
  policies: PolicyItem[];
  loading: boolean;
}

export const usePolicyStore = defineStore("policy", {
  state: (): PolicyState => ({
    policies: [],
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
          console.error(response.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching policies:", error);
      } finally {
        this.loading = false;
      }
    },

    async loadPoliciesGroup() {
      this.loading = true;
      try {
        const response = await fetchPoliciesGroup();
        if (response.success && response.data) {
          this.policies = response.data;
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching policies:", error);
      } finally {
        this.loading = false;
      }
    },

    async addNewPolicy(newPolicy: PolicyCreate) {
      try {
        const response = await addPolicy(newPolicy);
        if (response.success) {
          await this.loadPolicies();
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while adding policy:", error);
        return { success: false, message: "Unexpected error when adding policy." };
      }
    },

    async removeExistingPolicy(policy: PolicyCreate) {
      try {
        const response = await deletePolicy(policy);
        if (response.success) {
          await this.loadPolicies();
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while deleting policy:", error);
        return { success: false, message: "Unexpected error when deleting policy." };
      }
    }
  }
});
