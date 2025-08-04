// src/store/auth/userStore.ts
import { defineStore } from 'pinia'
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from '@/services/auth/userService'

import {
  type UserResponse,
  type UserCreate,
  type UserUpdate,
} from '@/models/auth/user'

interface UserState {
  users: UserResponse[]
  selectedUser?: UserResponse

  isLoadingUsers: boolean
  isLoadingUserById: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  updatingId: number | null
  deletingId: number | null
}


export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    selectedUser: undefined,

    isLoadingUsers: false,
    isLoadingUserById: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,

    updatingId: null,
    deletingId: null,
  }),

  getters: {
    isLoading(state): boolean {
      return (
        state.isLoadingUsers ||
        state.isLoadingUserById ||
        state.isCreating ||
        state.isUpdating ||
        state.isDeleting
      )
    },

    getUserByIdFromList: (state) => (userId: number) => {
      return state.users.find((u) => u.id === userId)
    },
  },

  actions: {
    // 🚀 LOAD
    async loadUsers(skip = 0, limit = 100, is_active = true) {
      this.isLoadingUsers = true
      try {
        const response = await fetchUsers(skip, limit, is_active)
        if (response.success && response.data) {
          this.users = response.data
        }
        return response
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to load users' }
      } finally {
        this.isLoadingUsers = false
      }
    },

    async loadUserById(userId: number) {
      this.isLoadingUserById = true
      try {
        const response = await fetchUserById(userId)
        if (response.success && response.data) {
          this.selectedUser = response.data
        }
        return response
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to load user' }
      } finally {
        this.isLoadingUserById = false
      }
    },

    // ➕ CREATE
    async createUser(data: UserCreate, imageFile?: File | null) {
      this.isCreating = true
      try{
        const response = await createUser(data, imageFile)
        if (response.success) {
            return { success: true, message: 'User created', data: response.data }
          }
          throw new Error(response.message || 'Failed to create user')
      } catch (err: any) {
        return { success: false, message: err.message}
      } finally {
        this.isCreating = false
      }
    },

    // ✏️ UPDATE
    async updateUser(userId: number, data: UserUpdate, imageFile?: File | null) {
      this.isUpdating = true
      this.updatingId = userId
      try {
        const response = await updateUser(userId, data, imageFile)
        if (response.success) {
          return { success: true, message: 'User updated', data: response.data}
        }
        throw new Error(response.message || 'Failed to update user')        
      } catch (err: any) {
        return { success: false, message: err.message }
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    // 🗑️ DELETE
    async deleteUser(userId: number) {
      this.isDeleting = true
      this.deletingId = userId
      try {
        const response = await deleteUser(userId)
        if (response.success) {
          return { success: true, message: 'User deleted' }          
        }
        throw new Error(response.message || 'Failed to delete user')
      } catch (err: any) {
        return { success: false, message: err.message }
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },
  },
})
