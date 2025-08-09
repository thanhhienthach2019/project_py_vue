// src/composables/useToastAction.ts
import type { ActionResult } from '@/types/api'
import { useI18n } from 'vue-i18n'
import { useToastStore } from '@/store/toast/toastStore'

export function useToastAction() {
  const { t } = useI18n()               
  const toast = useToastStore()

  return async function withToastAction<T>(
    action: () => Promise<ActionResult<T>>,
    options?: {
      success?: boolean | string
      error?: boolean | string
      onSuccess?: () => void
      onError?: () => void
    }
  ): Promise<ActionResult<T>> {
    const res = await action()

    if (res.success) {
      const key = typeof options?.success === 'string' ? options.success : res.message
      if (key && options?.success !== false) {
        toast.show(t(key, res.args || {}), 'success')
      }
      options?.onSuccess?.()
    } else {
      const key = typeof options?.error === 'string' ? options.error : res.message
      if (key && options?.error !== false) {
        toast.show(t(key, res.args || {}), 'error')
      }
      options?.onError?.()
    }

    return res
  }
}
