import { defineStore } from 'pinia'
import {
  fetchPolicies,
  fetchPoliciesGroup,
  fetchViewPolicies,
  addPolicy,
  deletePolicy,
} from '@/services/settings/policyService'
import type { PolicyItem, PolicyCreate } from '@/models/settings/policy'

interface PolicyState {
  policies: PolicyItem[]
  policiesGroup: PolicyItem[]
  viewPolicies: PolicyItem[]

  isLoadingPolicies: boolean
  isLoadingGroups: boolean
  isLoadingViews: boolean
  isCreating: boolean
  isDeleting: boolean
  deletingKey: string | null
}

export const usePolicyStore = defineStore('policy', {
  state: (): PolicyState => ({
    policies: [],
    policiesGroup: [],
    viewPolicies: [],
    isLoadingPolicies: false,
    isLoadingGroups: false,
    isLoadingViews: false,
    isCreating: false,
    isDeleting: false,
    deletingKey: null,
  }),

  getters: {
    isLoading(state): boolean {
      return (
        state.isLoadingPolicies ||
        state.isLoadingGroups ||
        state.isLoadingViews ||
        state.isCreating ||
        state.isDeleting
      )
    },
  },

  actions: {
    async loadPolicies() {
      this.isLoadingPolicies = true
      try {
        const resp = await fetchPolicies()
        if (resp.success && resp.data) this.policies = resp.data
        return resp
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to load policies' }
      } finally {
        this.isLoadingPolicies = false
      }
    },

    async loadPoliciesGroup() {
      this.isLoadingGroups = true
      try {
        const resp = await fetchPoliciesGroup()
        if (resp.success && resp.data) this.policiesGroup = resp.data
        return resp
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to load group policies' }
      } finally {
        this.isLoadingGroups = false
      }
    },

    async loadViewPolicies() {
      this.isLoadingViews = true
      try {
        const resp = await fetchViewPolicies()
        if (resp.success && resp.data) this.viewPolicies = resp.data
        return resp
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to load view policies' }
      } finally {
        this.isLoadingViews = false
      }
    },

    async addNewPolicy(newPolicy: PolicyCreate) {
      this.isCreating = true
      try {
        return await addPolicy(newPolicy)
      } catch (err: any) {
        return { success: false, message: err.message || 'Error creating policy' }
      } finally {
        this.isCreating = false
      }
    },

    async addNewPolicyGroup(newPolicy: PolicyCreate) {
      this.isCreating = true
      try {
        return await addPolicy(newPolicy)
      } catch (err: any) {
        return { success: false, message: err.message || 'Error creating group policy' }
      } finally {
        this.isCreating = false
      }
    },

    async addNewViewPolicy(newPolicy: PolicyCreate) {
      this.isCreating = true
      try {
        return await addPolicy(newPolicy)
      } catch (err: any) {
        return { success: false, message: err.message || 'Error creating view policy' }
      } finally {
        this.isCreating = false
      }
    },

    async removeExistingPolicy(policy: PolicyCreate) {
      const key = JSON.stringify(policy)
      this.isDeleting = true
      this.deletingKey = key

      try {
        return await deletePolicy(policy)
      } catch (err: any) {
        return { success: false, message: err.message || 'Error deleting policy' }
      } finally {
        this.isDeleting = false
        this.deletingKey = null
      }
    },

    async removeExistingPolicyGroup(policy: PolicyCreate) {
      const key = JSON.stringify(policy)
      this.isDeleting = true
      this.deletingKey = key

      try {
        return await deletePolicy(policy)
      } catch (err: any) {
        return { success: false, message: err.message || 'Error deleting group policy' }
      } finally {
        this.isDeleting = false
        this.deletingKey = null
      }
    },

    async removeExistingViewPolicy(policy: PolicyCreate) {
      const key = JSON.stringify(policy)
      this.isDeleting = true
      this.deletingKey = key

      try {
        return await deletePolicy(policy)
      } catch (err: any) {
        return { success: false, message: err.message || 'Error deleting view policy' }
      } finally {
        this.isDeleting = false
        this.deletingKey = null
      }
    },
  },
})
