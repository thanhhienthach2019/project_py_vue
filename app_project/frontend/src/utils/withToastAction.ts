// src/utils/withToastAction.ts
import type { ActionResult } from '@/types/api'
import { useI18n } from 'vue-i18n'
import { useToastStore } from '@/store/toast/toastStore'

export function createWithToastAction() {
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
      const key = typeof options?.success === 'string'
        ? options.success
        : res.message
      
      if (key) {
        const msg = t(key, res.args || {})
        if (options?.success !== false) {
          toast.show(msg, 'success')
        }
      }
      options?.onSuccess?.()
    } else {
      const key = typeof options?.error === 'string'
        ? options.error
        : res.message

        if (key) {
          const msg = t(key, res.args || {})
          if (options?.error !== false) {
            toast.show(msg, 'error')
          }
        }
      options?.onError?.()
    }

    return res
  }
}
