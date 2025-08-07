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
      } finally {
        this.isLoadingViews = false
      }
    },

    async addPolicy(newPolicy: PolicyCreate) {
      this.isCreating = true
      try {
        return await addPolicy(newPolicy)      
      } finally {
        this.isCreating = false
      }
    },    

    async removePolicy(policy: PolicyCreate) {
      const key = JSON.stringify(policy)
      this.isDeleting = true
      this.deletingKey = key

      try {
        return await deletePolicy(policy)      
      } finally {
        this.isDeleting = false
        this.deletingKey = null
      }
    },    
  },
})
