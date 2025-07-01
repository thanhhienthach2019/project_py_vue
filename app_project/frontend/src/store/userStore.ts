import { defineStore } from "pinia";
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/userService";
import type { UserResponse, UserCreate, UserUpdate } from "@/models/user";

interface UserState {
  users: UserResponse[];
  loading: boolean;
  selectedUser?: UserResponse;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    users: [],
    loading: false,
    selectedUser: undefined,
  }),

  actions: {
    async loadUsers(skip = 0, limit = 100, is_active = true) {
      this.loading = true;
      try {
        const response = await fetchUsers(skip, limit, is_active);
        if (response.success && response.data) {
          this.users = response.data;
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching users:", error);
      } finally {
        this.loading = false;
      }
    },

    async loadUserById(userId: number) {
      this.loading = true;
      try {
        const response = await fetchUserById(userId);
        if (response.success && response.data) {
          this.selectedUser = response.data;
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching user by ID:", error);
      } finally {
        this.loading = false;
      }
    },

    async createNewUser(user: UserCreate) {
      try {
        const response = await createUser(user);
        if (response.success) {
          await this.loadUsers();
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while creating user:", error);
        return { success: false, message: "Unexpected error when creating user." };
      }
    },

    async updateExistingUser(userId: number, data: UserUpdate) {
      try {
        const response = await updateUser(userId, data);
        if (response.success) {
          await this.loadUsers();
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while updating user:", error);
        return { success: false, message: "Unexpected error when updating user." };
      }
    },

    async removeUser(userId: number) {
      try {
        const response = await deleteUser(userId);
        if (response.success) {
          await this.loadUsers();
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while deleting user:", error);
        return { success: false, message: "Unexpected error when deleting user." };
      }
    }
  }
});
