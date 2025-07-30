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
  UserRole,
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

function buildOptimisticUser(user: UserCreate, tempId: number): UserResponse {
  const now = new Date().toISOString()
  return {
    id: tempId,
    username: user.username,
    email: user.email,
    full_name: user.full_name || '',
    phone_number: user.phone_number || '',
    profile_picture: user.profile_picture || '',
    is_active: true,
    is_verified: false,
    role: user.role || UserRole.USER,
    created_at: now,
    updated_at: now,
    last_login: null,
  }
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
      const tempId = -Date.now()
      const optimisticUser = buildOptimisticUser(data, tempId)
      this.users.push(optimisticUser)
      this.isCreating = true

      try {
        const response = await createUser(data, imageFile)
        if (response.success && response.data) {
          const idx = this.users.findIndex((u) => u.id === tempId)
          if (idx !== -1) this.users.splice(idx, 1, response.data)
          return { success: true, message: 'User created', data: response.data }
        }
        throw new Error(response.message || 'Failed to create user')
      } catch (err: any) {
        this.users = this.users.filter((u) => u.id !== tempId)
        return { success: false, message: err.message }
      } finally {
        this.isCreating = false
      }
    },

    // ✏️ UPDATE
    async updateUser(userId: number, data: UserUpdate, imageFile?: File | null) {
      const idx = this.users.findIndex((u) => u.id === userId)
      if (idx === -1) return { success: false, message: 'User not found' }

      const backup = { ...this.users[idx] }
      this.users[idx] = { ...backup, ...data }
      this.isUpdating = true
      this.updatingId = userId

      try {
        const response = await updateUser(userId, data, imageFile)
        if (response.success && response.data) {
          this.users[idx] = response.data
          return { success: true, message: 'User updated', data: response.data }
        }
        throw new Error(response.message || 'Failed to update user')
      } catch (err: any) {
        this.users[idx] = backup
        return { success: false, message: err.message }
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    // 🗑️ DELETE
    async deleteUser(userId: number) {
      const backup = [...this.users]
      this.users = this.users.filter((u) => u.id !== userId)
      this.isDeleting = true
      this.deletingId = userId

      try {
        const response = await deleteUser(userId)
        if (response.success) {
          return { success: true, message: 'User deleted' }
        }
        throw new Error(response.message || 'Failed to delete user')
      } catch (err: any) {
        this.users = backup
        return { success: false, message: err.message }
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },
  },
})
