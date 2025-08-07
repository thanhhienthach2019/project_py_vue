// src/hooks/useUser.ts
import { computed } from 'vue';
import { useUserStore } from '@/store/auth/userStore';
import type { UserCreate, UserUpdate } from '@/models/auth/user';
import { createWithToastAction } from "@/utils/withToastAction";

export function useUser() {
  const store = useUserStore()
  const withToastAction = createWithToastAction();
  // ============ State Getters ============
  const state = {
    users: computed(() => store.users),
    selectedUser: computed(() => store.selectedUser),

    isLoading: computed(() => store.isLoading),
    isLoadingUsers: computed(() => store.isLoadingUsers),
    isCreating: computed(() => store.isCreating),
    isUpdating: computed(() => store.isUpdating),
    isDeleting: computed(() => store.isDeleting),
    updatingId: computed(() => store.updatingId),
    deletingId: computed(() => store.deletingId),
  }

  // ============ Loaders ============
  const loaders = {
    fetchUsers: () => withToastAction(() => store.loadUsers()),
    fetchUserById: (userId: number) => withToastAction(() => store.loadUserById(userId))
  }

  // ============ Actions ============
  const actions = {
    createUser: (user: UserCreate, imageFile?: File | null, removeImage?: boolean) => withToastAction(() => store.createUser(user, imageFile, removeImage)),
    updateUser: (userId: number, data: UserUpdate, imageFile?: File | null, removeImage?: boolean) => withToastAction(() => store.updateUser(userId, data, imageFile, removeImage)),
    deleteUser: (userId: number) => withToastAction(() => store.deleteUser(userId)) 
  }

  // ============ Getters ============
  const getters = {
    getUserByIdFromList: (userId: number) => store.getUserByIdFromList(userId),
  }

  return {
    // State
    ...state,
    // Loaders
    ...loaders,
    // Actions
    ...actions,
    // Getters
    ...getters,
  }
}
