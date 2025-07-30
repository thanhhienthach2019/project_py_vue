// src/hooks/useMenu.ts
import { computed } from 'vue'
import { useMenuStore } from '@/store/settings/menuStore'
import type { MenuItemCreate, MenuItemUpdate } from '@/models/settings/menu'

export function useMenu() {
  const store = useMenuStore()

  // ============ State Getters ============
  const allMenus    = computed(() => store.menus)
  const isLoading   = computed(() => store.isLoading)
  const isLoadingMenus = computed(() => store.isLoadingMenus)
  const isCreating  = computed(() => store.isCreating)
  const isUpdating  = computed(() => store.isUpdating)
  const isDeleting  = computed(() => store.isDeleting)
  const updatingId  = computed(() => store.updatingId)
  const deletingId  = computed(() => store.deletingId)

  // ============ Loaders ============
  async function loadMenus() {
    const res = await store.loadMenus()
    return res?.success
      ? { success: true }
      : { success: false, message: (res as any)?.message || 'Failed to load menus' }
  }

  // ============ Actions ============
  async function createMenu(data: MenuItemCreate) {
    const res = await store.createMenu(data)
    return res
  }

  async function updateMenu(id: number, data: MenuItemUpdate) {
    const res = await store.updateMenu(id, data)
    return res
  }

  async function deleteMenu(id: number) {
    const res = await store.deleteMenu(id)
    return res
  }

  // ============ Helper Getters ============
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

    // Loaders
    loadMenus,

    // Actions
    createMenu,
    updateMenu,
    deleteMenu,

    // Getter
    getMenuById,
  }
}
