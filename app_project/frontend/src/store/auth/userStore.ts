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

  updatingId: string | null
  deletingId: string | null
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

    getUserByIdFromList: (state) => (userId: string) => {
      return state.users.find((u) => u.id === userId)
    },
  },

  actions: {
    // 🚀 LOAD
    async loadUsers() {
      this.isLoadingUsers = true
      try {
        const response = await fetchUsers()
        if (response.success && response.data) {
          this.users = response.data
        }
        return response
      } finally {
        this.isLoadingUsers = false
      }
    },

    async loadUserById(userId: string) {
      this.isLoadingUserById = true
      try {
        const response = await fetchUserById(userId)
        if (response.success && response.data) {
          this.selectedUser = response.data
        }
        return response
      } finally {
        this.isLoadingUserById = false
      }
    },

    // ➕ CREATE
    async createUser(data: UserCreate, imageFile?: File | null, removeImage?: boolean) {
      this.isCreating = true
      try{
          return await createUser(data, imageFile, removeImage);
      } finally {
        this.isCreating = false
      }
    },

    // ✏️ UPDATE
    async updateUser(userId: string, data: UserUpdate, imageFile?: File | null, removeImage?: boolean) {
      this.isUpdating = true
      this.updatingId = userId
      try {
          return await updateUser(userId, data, imageFile, removeImage);        
      } finally {
        this.isUpdating = false
        this.updatingId = null
      }
    },

    // 🗑️ DELETE
    async deleteUser(userId: string) {
      this.isDeleting = true
      this.deletingId = userId
      try {
        return await deleteUser(userId);        
      } finally {
        this.isDeleting = false
        this.deletingId = null
      }
    },
  },
})
