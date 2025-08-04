// src/hooks/useMenu.ts
import { computed, inject, type Ref, } from 'vue'
import { useMenuStore } from '@/store/settings/menuStore'
import { createWithToastAction } from '@/utils/withToastAction'
import type ToastTailwind from '@/pages/Toast/ToastTailwind.vue'
import { useI18n } from 'vue-i18n'
import type { MenuItemCreate, MenuItemUpdate, MenuItemResponse } from '@/models/settings/menu'
import type { ActionResult } from '@/types/api'

export function useMenu() {
  const store = useMenuStore()
  const { t } = useI18n()
  const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!
  const withToastAction = createWithToastAction(toast, t)

  const allMenus = computed(() => store.menus)
  const isLoading = computed(() => store.isLoading)
  const isLoadingMenus = computed(() => store.isLoadingMenus)
  const isCreating = computed(() => store.isCreating)
  const isUpdating = computed(() => store.isUpdating)
  const isDeleting = computed(() => store.isDeleting)
  const updatingId = computed(() => store.updatingId)
  const deletingId = computed(() => store.deletingId)

  // ============ Loaders ============
  function loadMenus(): Promise<ActionResult> {
    return withToastAction(() => store.loadMenus(), {
      error: 'error.menu.fetch_failed',
      success: false,
    })
  }

  // ============ Actions ============
  function createMenu(data: MenuItemCreate): Promise<ActionResult<MenuItemResponse>> {
    return withToastAction(() => store.createMenu(data))
  }

  function updateMenu(id: number, data: MenuItemUpdate): Promise<ActionResult<MenuItemResponse>> {
    return withToastAction(() => store.updateMenu(id, data))
  }

  function deleteMenu(id: number): Promise<ActionResult> {
    return withToastAction(() => store.deleteMenu(id))
  }

  // ============ Getter ============
  function getMenuById(id: number) {
    return store.getMenuById(id)
  }

  return {
    // State
    allMenus,
    isLoading,
    isLoadingMenus,
    isCreating,
    isUpdating,
    isDeleting,
    updatingId,
    deletingId,

    // Loaders & Actions
    loadMenus,
    createMenu,
    updateMenu,
    deleteMenu,

    // Getter
    getMenuById,
  }
}
