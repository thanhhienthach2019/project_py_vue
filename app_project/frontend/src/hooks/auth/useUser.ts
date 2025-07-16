import { computed } from "vue";
import { useUserStore } from "@/store/auth/userStore"; 
import type { UserCreate, UserUpdate } from "@/models/auth/user";

export function useUser() {
  const userStore = useUserStore();

  // === CRUD ACTIONS ===
  const fetchUsers = async (
    skip = 0,
    limit = 100,
    is_active = true
  ) => {
    return await userStore.loadUsers(skip, limit, is_active);
  };

  const fetchUserById = async (userId: number) => {
    return await userStore.loadUserById(userId);
  };

  const createUser = async (user: UserCreate, imageFile?: File | null) => {
    return await userStore.createNewUser(user, imageFile);
  };

  const updateUser = async (userId: number, data: UserUpdate, imageFile?: File | null) => {
    return await userStore.updateExistingUser(userId, data, imageFile);
  };

  const deleteUser = async (userId: number) => {
    return await userStore.removeUser(userId);
  };

  const getUserByIdFromList = (userId: number) => {
    return userStore.getUserByIdFromList(userId);
  };

  // === STATE BINDINGS ===
  return {
    users: computed(() => userStore.users),
    selectedUser: computed(() => userStore.selectedUser),

    // Loading states
    loading: computed(() => userStore.loading),
    creating: computed(() => userStore.creating),
    updating: computed(() => userStore.updating),
    deleting: computed(() => userStore.deleting),

    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserByIdFromList,
  };
}
