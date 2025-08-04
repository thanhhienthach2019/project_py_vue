// src/hooks/useUser.ts
import { computed } from 'vue'
import { useUserStore } from '@/store/auth/userStore'
import type { UserCreate, UserUpdate } from '@/models/auth/user'

export function useUser() {
  const store = useUserStore()

  // ============ State Getters ============
  const state = {
    users: computed(() => store.users),
    selectedUser: computed(() => store.selectedUser),

    isLoading: computed(() => store.isLoading),
    isLoadingUsers: computed(() => store.isLoadingUsers),
    isCreating: computed(() => store.isCreating),
    isUpdating: computed(() => store.isUpdating),
    isDeleting: computed(() => store.isDeleting),
    updatingId: computed(() => store.updatingId),
    deletingId: computed(() => store.deletingId),
  }

  // ============ Loaders ============
  const loaders = {
    fetchUsers: async (skip = 0, limit = 100, is_active = true) => {
      try {
        await store.loadUsers(skip, limit, is_active)
        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to load users' }
      }
    },

    fetchUserById: async (userId: number) => {
      try {
        await store.loadUserById(userId)
        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to load user' }
      }
    },
  }

  // ============ Actions ============
  const actions = {
    createUser: async (user: UserCreate, imageFile?: File | null) => {
      try {
        return await store.createUser(user, imageFile)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to create user' }
      }
    },

    updateUser: async (userId: number, data: UserUpdate, imageFile?: File | null) => {
      try {
        return await store.updateUser(userId, data, imageFile)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to update user' }
      }
    },

    deleteUser: async (userId: number) => {
      try {
        return await store.deleteUser(userId)
      } catch (error: any) {
        return { success: false, message: error.message || 'Failed to delete user' }
      }
    },
  }

  // ============ Getters ============
  const getters = {
    getUserByIdFromList: (userId: number) => store.getUserByIdFromList(userId),
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
