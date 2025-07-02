import { computed } from "vue";
import { useUserStore } from "@/store/userStore";
import type { UserCreate, UserUpdate } from "@/models/user";

export function useUser() {
  const userStore = useUserStore();

  const fetchUsers = async (
    skip: number = 0,
    limit: number = 100,
    is_active: boolean = true
  ) => {
    try {
      await userStore.loadUsers(skip, limit, is_active);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchUserById = async (userId: number) => {
    try {
      await userStore.loadUserById(userId);
    } catch (error) {
      console.error("Failed to fetch user by ID:", error);
    }
  };

  const createUser = async (user: UserCreate, imageFile?: File | null) => {
    try {
      const response = await userStore.createNewUser(user, imageFile);
      return response;
    } catch (error) {
      console.error("Failed to create user:", error);
      return { success: false, message: "An error occurred while creating the user." };
    }
  };

  const updateUser = async (userId: number, data: UserUpdate, imageFile?: File | null) => {
    try {
      const response = await userStore.updateExistingUser(userId, data, imageFile); // ✅ Thêm imageFile
      return response;
    } catch (error) {
      console.error("Failed to update user:", error);
      return { success: false, message: "An error occurred while updating the user." };
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await userStore.removeUser(userId);
      return response;
    } catch (error) {
      console.error("Failed to delete user:", error);
      return { success: false, message: "An error occurred while deleting the user." };
    }
  };

  return {
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    users: computed(() => userStore.users || []),
    selectedUser: computed(() => userStore.selectedUser),
    loading: computed(() => userStore.loading),
  };
}
