import { defineStore } from 'pinia'
import {
  loginApi,
  logoutApi,
  getProfileApi,
  refreshTokenApi,
  setPreferredLanguageApi
} from '@/services/auth/authService'
import { fetchMyPermissions } from '@/services/settings/permissionService'
import router from '@/router'
import { setPreferredLanguage as applyLang } from '@/utils/lang'
import type { SupportedLang } from '@/utils/i18n_types'
import type { ActionResult } from '@/types/api'

interface AuthUser {
  user_id: number
  username: string
  email?: string
  preferred_language?: SupportedLang
  [key: string]: any
}

interface AuthState {
  user: AuthUser | null
  permissions: string[]
  isAuthenticated: boolean
  isFetched: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    permissions: [],
    isAuthenticated: false,
    isFetched: false,
    loading: false,
  }),

  actions: {
    resetAuth() {
      this.user = null
      this.permissions = []
      this.isAuthenticated = false
      this.isFetched = false
    },

    async login(username: string, password: string): Promise<ActionResult> {
      this.loading = true
      try {
        const res = await loginApi(username, password)
        // login success if no exception, then fetch user
        const fetchRes = await this.fetchUser()
        return {
          success: fetchRes.success,
          message: fetchRes.success
            ? res.message
            : fetchRes.message,
          args: res.args,
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'error.auth.login_failed'
        return { success: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async logout(): Promise<ActionResult> {
      this.loading = true
      try {
        const res = await logoutApi()
        this.resetAuth()
        router.push('/')
        return { success: true, message: res.message }
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'error.auth.logout_failed'
        return { success: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async fetchUser(): Promise<ActionResult<AuthUser>> {
      this.loading = true
      try {
        const res = await getProfileApi()
        const payload = res.data as AuthUser
        this.user = payload
        this.isAuthenticated = true

        if (payload.preferred_language) {
          applyLang(payload.preferred_language)
        }

        try {
          this.permissions = await fetchMyPermissions()
        } catch {
          this.permissions = []
        }

        return {
          success: true,
          data: payload,
          message: res.message,
          args: res.args,
        }
      } catch (err: any) {
        this.resetAuth()
        const msg = err?.response?.data?.message || 'error.auth.fetch_user_failed'
        return { success: false, message: msg }
      } finally {
        this.loading = false
        this.isFetched = true
      }
    },

    async checkOrRefreshSession(): Promise<ActionResult> {
      this.loading = true
      try {
        const res = await getProfileApi()
        const payload = res.data as AuthUser
        this.user = payload
        this.isAuthenticated = true

        if (payload.preferred_language) {
          applyLang(payload.preferred_language)
        }

        try {
          this.permissions = await fetchMyPermissions()
        } catch {
          this.permissions = []
        }

        return { success: true, message: res.message, args: res.args }
      } catch {
        // try to refresh
        const refreshRes = await this.refreshToken()
        return refreshRes
      } finally {
        this.loading = false
        this.isFetched = true
      }
    },

    async refreshToken(): Promise<ActionResult> {
      this.loading = true
      try {
        await refreshTokenApi()
        // if refreshed, reload profile
        const fetchRes = await this.fetchUser()
        return fetchRes
      } catch (err: any) {
        this.resetAuth()
        const msg = err?.response?.data?.message || 'error.auth.session_expired'
        return { success: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async setPreferredLanguage(lang: SupportedLang): Promise<ActionResult> {
      this.loading = true
      try {
        const res = await setPreferredLanguageApi(lang)
        if (this.user) {
          this.user.preferred_language = lang
        }
        applyLang(lang)
        return {
          success: true,
          message: res.message,
          args: res.args,
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'error.auth.language_update_failed'
        return { success: false, message: msg }
      } finally {
        this.loading = false
      }
    },
  },
})
