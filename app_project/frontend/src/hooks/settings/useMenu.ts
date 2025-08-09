// src/hooks/useMenu.ts
import { computed} from 'vue'
import { useMenuStore } from '@/store/settings/menuStore'
import { createWithToastAction } from '@/utils/withToastAction'
import type { MenuItemCreate, MenuItemUpdate } from '@/models/settings/menu'

export function useMenu() {
  const store = useMenuStore()
  const withToastAction = createWithToastAction()
  const state = {
    allMenus: computed(() => store.menus),
    isLoading: computed(() => store.isLoading),
    isLoadingMenus: computed(() => store.isLoadingMenus),
    isCreating: computed(() => store.isCreating),
    isUpdating: computed(() => store.isUpdating),
    isDeleting: computed(() => store.isDeleting),
    updatingId: computed(() => store.updatingId),
    deletingId: computed(() => store.deletingId)
  }    
  
  // ============ Loaders ============
  const loaders = {
    loadMenus: () => withToastAction(() => store.loadMenus()),
  }

  // ============ Actions ============
  const actions = {
    createMenu: (data: MenuItemCreate) => withToastAction(() => store.createMenu(data)),
    updateMenu: (id: string, data: MenuItemUpdate) => withToastAction(() => store.updateMenu(id, data)),
    deleteMenu: (id: string) => withToastAction(() => store.deleteMenu(id))
  }

  // ============ Getter ============
  function getMenuById(id: string) {
    return store.getMenuById(id)
  }

  return {
    // State
    ...state,
    // Loaders & Actions
    ...loaders,
    ...actions,
    // Getter
    getMenuById,
  }
}
