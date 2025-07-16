import { defineStore } from "pinia";
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/auth/userService";
import {
  type UserResponse,
  type UserCreate,
  type UserUpdate,
  UserRole,
} from "@/models/auth/user";

interface UserState {
  users: UserResponse[];
  selectedUser?: UserResponse;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

function buildOptimisticUser(user: UserCreate, tempId: number): UserResponse {
  const now = new Date().toISOString();
  return {
    id: tempId,
    username: user.username,
    email: user.email,
    full_name: user.full_name || "",
    phone_number: user.phone_number || "",
    profile_picture: user.profile_picture || "",
    is_active: true,
    is_verified: false,
    role: user.role || UserRole.USER,
    created_at: now,
    updated_at: now,
    last_login: null,
  };
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    users: [],
    selectedUser: undefined,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
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

    async createNewUser(user: UserCreate, imageFile?: File | null) {
      const tempId = -Date.now();
      const optimisticUser = buildOptimisticUser(user, tempId);

      this.users.push(optimisticUser);
      this.creating = true;

      try {
        const response = await createUser(user, imageFile);
        if (response.success && response.data) {
          const index = this.users.findIndex(u => u.id === tempId);
          if (index !== -1) {
            this.users.splice(index, 1, response.data);
          }
        } else {
          this.users = this.users.filter(u => u.id !== tempId); // rollback
        }
        return response;
      } catch (error) {
        this.users = this.users.filter(u => u.id !== tempId); // rollback
        return { success: false, message: "Unexpected error when creating user." };
      } finally {
        this.creating = false;
      }
    },

    async updateExistingUser(userId: number, data: UserUpdate, imageFile?: File | null) {
      const index = this.users.findIndex(u => u.id === userId);
      if (index === -1) return { success: false, message: "User not found." };

      const backup = [...this.users];
      this.users[index] = { ...this.users[index], ...data } as UserResponse;
      this.updating = true;

      try {
        const response = await updateUser(userId, data, imageFile);
        if (response.success && response.data) {
          this.users[index] = response.data;
        } else {
          this.users = backup;
        }
        return response;
      } catch (error) {
        this.users = backup;
        return { success: false, message: "Unexpected error when updating user." };
      } finally {
        this.updating = false;
      }
    },

    async removeUser(userId: number) {
      const backup = [...this.users];
      this.users = this.users.filter(u => u.id !== userId);
      this.deleting = true;

      try {
        const response = await deleteUser(userId);
        if (!response.success) {
          this.users = backup;
        }
        return response;
      } catch (error) {
        this.users = backup;
        return { success: false, message: "Unexpected error when deleting user." };
      } finally {
        this.deleting = false;
      }
    },

    getUserByIdFromList(userId: number): UserResponse | undefined {
      return this.users.find(u => u.id === userId);
    },
  }
});
