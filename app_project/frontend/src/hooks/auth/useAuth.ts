import { computed} from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth/authStore'
import { createWithToastAction } from '@/utils/withToastAction'
import type { SupportedLang } from '@/utils/i18n_types'
import type { ActionResult } from '@/types/api'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const withToast = createWithToastAction()

  // ==== Login ====
  const login = async (username: string, password: string): Promise<ActionResult> =>
    withToast(() => authStore.login(username, password), {
      onSuccess: () => router.push('/admin'),
    })

  // ==== Session Check/Refresh ====
  const checkSession = async (): Promise<ActionResult> => {
    const res = await authStore.checkOrRefreshSession()
    if (!res.success) {
      router.push('/')
    }
    return res
  }

  // ==== Logout ====
  const logout = async (): Promise<ActionResult> =>
    withToast(() => authStore.logout(), {
      onSuccess: () => router.push('/'),
    })

  // ==== Set Preferred Language ====
  const setPreferredLanguage = async (lang: SupportedLang): Promise<ActionResult> =>
    withToast(() => authStore.setPreferredLanguage(lang))

  return {
    // actions
    login,
    checkSession,
    logout,
    setPreferredLanguage,

    // state
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isFetched: computed(() => authStore.isFetched),
    user: computed(() => authStore.user),
    loading: computed(() => authStore.loading),
    permissions: computed(() => authStore.permissions),

    // helper
    hasPermission: (key: string, action: string) =>
      authStore.permissions.includes(`${key}:${action}`),
  }
}