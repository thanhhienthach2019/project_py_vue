// utils/toast-manager.ts
import { type ComponentInternalInstance } from 'vue'

let loadingToastInstance: ComponentInternalInstance | null = null

export const ToastLoading = {
  install(app: any) {
    app.config.globalProperties.$toastLoading = {
      show: (message: string, options?: any) => 
        loadingToastInstance?.exposed?.showLoading(message, options),
      
      update: (id: string, updates: any) => 
        loadingToastInstance?.exposed?.updateLoading(id, updates),
      
      dismiss: (id: string) => 
        loadingToastInstance?.exposed?.dismissLoading(id)
    }
  },

  setInstance(instance: ComponentInternalInstance) {
    loadingToastInstance = instance
  }
}