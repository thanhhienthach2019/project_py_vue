// utils/piniaHelpers.ts
import { getCurrentInstance } from 'vue'; // Để truy cập instance trong Composition API

// 1. Định nghĩa type BooleanKeys
export type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

// 2. Khai báo kiểu cho $toastLoading
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
 * Loading + toast (hiện "loading..." và tự ẩn sau khi xong)
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
  }
): Promise<T | null> {
  // Lấy instance hiện tại để truy cập $toastLoading
  const instance = getCurrentInstance();
  const $toastLoading = instance?.appContext.config.globalProperties.$toastLoading;

  if (!$toastLoading) {
    console.error('ToastLoading plugin chưa được đăng ký');
    return null;
  }

  const loadingId = $toastLoading.show(
    options?.loadingMsg || "Đang xử lý...",
    {
      subMessage: options?.subMessage || "",
      duration: 0 // Không tự động ẩn
    }
  );

  store[key] = true as S[BooleanKeys<S>];

  try {
    // Hỗ trợ cập nhật tiến trình
    if (options?.progressUpdate && loadingId) {
      options.progressUpdate = (progress: number) => {
        $toastLoading.update(loadingId, { progress });
      };
    }

    const result = await fn();
    
    // Hiển thị thành công trong 3s
    if (loadingId) {
      $toastLoading.update(loadingId, {
        message: options?.successMsg || "Thành công!",
        progress: 100,
        duration: 3000
      });
    }
    
    return result;
  } catch (error: any) {
    // Hiển thị lỗi trong 5s
    if (loadingId) {
      $toastLoading.update(loadingId, {
        message: options?.errorMsg || error?.message || "Có lỗi xảy ra!",
        progress: undefined,
        duration: 5000
      });
    }
    return null;
  } finally {
    store[key] = false as S[BooleanKeys<S>];
    
    // Không xóa ngay nếu đang hiển thị thông báo thành công/lỗi
    if (!options?.successMsg && !options?.errorMsg && loadingId) {
      $toastLoading.dismiss(loadingId);
    }
  }
}