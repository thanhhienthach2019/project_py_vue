import { defineStore } from 'pinia'
import {
  fetchMyProfile,
  updateMyProfile,
  changeMyPassword,
} from '@/services/auth/profileService'

import type {
  UserResponse,
  MyProfileUpdate,
  ChangePassword,
} from '@/models/auth/user'

interface ProfileState {
  profile?: UserResponse

  isLoadingProfile: boolean
  isUpdatingProfile: boolean
  isChangingPassword: boolean
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: undefined,

    isLoadingProfile: false,
    isUpdatingProfile: false,
    isChangingPassword: false,
  }),

  getters: {
    isLoading(state): boolean {
      return (
        state.isLoadingProfile ||
        state.isUpdatingProfile ||
        state.isChangingPassword
      )
    },
  },

  actions: {
    async loadMyProfile() {
      this.isLoadingProfile = true
      try {
        const response = await fetchMyProfile()
        if (response.success && response.data) {
          this.profile = response.data
        }
        return response
      } finally {
        this.isLoadingProfile = false
      }
    },

    async updateMyProfile(
      data: MyProfileUpdate,
      imageFile?: File | null,
      removeImage: boolean = false
    ) {
      this.isUpdatingProfile = true
      try {
        const response = await updateMyProfile(data, imageFile, removeImage)
        if (response.success && response.data) {
          this.profile = response.data
        }
        return response
      } finally {
        this.isUpdatingProfile = false
      }
    },

    async changeMyPassword(payload: ChangePassword) {
      this.isChangingPassword = true
      try {
        const response = await changeMyPassword(payload)
        return response
      } finally {
        this.isChangingPassword = false
      }
    },
  },
})
