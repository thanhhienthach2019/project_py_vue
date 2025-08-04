// src/utils/withToastAction.ts
import type { Ref } from 'vue'
import type { ActionResult } from '@/types/api'
import type ToastTailwind from '@/pages/Toast/ToastTailwind.vue'
import type { ComposerTranslation } from 'vue-i18n'

export function createWithToastAction(
  toast: Ref<InstanceType<typeof ToastTailwind>>,
  t: ComposerTranslation
) {
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
        : res.message || 'notification.success'
      const msg = t(key, res.args || {})

      if (options?.success !== false) toast.value.showToast(msg, 'success')
      options?.onSuccess?.()
    } else {
      const key = typeof options?.error === 'string'
        ? options.error
        : res.message || 'error.unknown'

        const msg = t(key, res.args || {})

      if (options?.error !== false) toast.value.showToast(msg, 'error')
      options?.onError?.()
    }

    return res
  }
}
