import { getCurrentInstance } from 'vue'; // Access instance in Composition API

// 1. Define BooleanKeys type
export type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

// 2. Declare type for $toastLoading
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toastLoading: {
      show: (message: string, options?: any) => string | undefined;
      update: (id: string, updates: any) => void;
      dismiss: (id: string) => void;
    };
  }
}

/**
 * Loading + toast with guaranteed minimum spinner duration
 * @param store       - Pinia store instance
 * @param key         - boolean key to set loading state
 * @param fn          - main async function
 * @param options     - toast + timing configuration
 *    - loadingMsg?: string
 *    - successMsg?: string
 *    - errorMsg?: string
 *    - subMessage?: string
 *    - progressUpdate?: (progress: number) => void
 *    - minDurationMs?: number   // ensure spinner lasts at least this many ms
 */
export async function withLoadingToast<T, S extends Record<string, any>>(
  store: S,
  key: BooleanKeys<S>,
  fn: () => Promise<T>,
  options?: {
    loadingMsg?: string;
    successMsg?: string;
    errorMsg?: string;
    subMessage?: string;
    progressUpdate?: (progress: number) => void;
    minDurationMs?: number;
  }
): Promise<T | null> {
  const instance = getCurrentInstance();
  const $toastLoading = instance?.appContext.config.globalProperties.$toastLoading;
  if (!$toastLoading) {
    console.error('ToastLoading plugin is not registered');
    return null;
  }

  const loadingId = $toastLoading.show(
    options?.loadingMsg || 'Processing...',
    {
      subMessage: options?.subMessage || '',
      duration: 0 // stay until updated or dismissed
    }
  );

  // Enable loading state
  store[key] = true as S[BooleanKeys<S>];

  const minDuration = options?.minDurationMs ?? 0;
  const startTime = Date.now();

  try {
    // Execute main function
    const result = await fn();

    // Calculate elapsed and wait remaining time if needed
    const elapsed = Date.now() - startTime;
    if (elapsed < minDuration) {
      await new Promise(res => setTimeout(res, minDuration - elapsed));
    }

    // Update toast on success
    if (loadingId) {
      $toastLoading.update(loadingId, {
        message: options?.successMsg || 'Completed successfully',
        progress: 100,
        duration: 3000
      });
    }
    return result;
  } catch (error: any) {
    // Update toast on error
    if (loadingId) {
      $toastLoading.update(loadingId, {
        message: options?.errorMsg || error?.message || 'An error occurred',
        progress: undefined,
        duration: 5000
      });
    }
    return null;
  } finally {
    // Disable loading state
    store[key] = false as S[BooleanKeys<S>];
    // If no custom messages, dismiss immediately
    if (!options?.successMsg && !options?.errorMsg && loadingId) {
      $toastLoading.dismiss(loadingId);
    }
  }
}
