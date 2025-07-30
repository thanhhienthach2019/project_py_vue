// src/store/auth.ts
import { defineStore } from "pinia";
import { loginApi, checkAuth, logoutApi, refreshTokenApi } from "@/services/auth/authService";
import { fetchMyPermissions } from "@/services/settings/permissionService";
import router from "@/router";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  isFetched: boolean;
  permissions: string[];
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    isFetched: false,
    permissions: [],
  }),

  actions: {
    async login(username: string, password: string) {
      this.loading = true;
      try {
        await loginApi(username, password); 
        await this.fetchUser(); 
        return true;
      } catch (error) {
        throw new Error("Incorrect username or password.");
      } finally {
        this.loading = false;
      }
    },

    async fetchUser() {
      this.loading = true;
      try {
        const res = await checkAuth(); 
        if (res.data.authenticated) {
          this.user = res.data.user;
          this.isAuthenticated = true;
          this.permissions = await fetchMyPermissions();
        } else {
          this.resetAuth();
        }
      } catch (error) {
        this.resetAuth();
      } finally {
        this.loading = false;
        this.isFetched = true;
      }
    },

    async checkOrRefreshSession(): Promise<boolean> {
      try {
        // Thử kiểm tra session hiện tại
        const res = await checkAuth();
        
        if (res.data.authenticated) {
          this.user = res.data.user;
          this.isAuthenticated = true;
          try {
            this.permissions = await fetchMyPermissions();
          } catch (err) {
            console.warn('Cannot load permissions, keeping empty:', err);
            this.permissions = [];
          }
          return true;
        }        
        // Nếu session hết hạn, thử refresh token
        return await this.refreshToken();
      } catch (error) {
        console.warn('Session check failed', error);
        return false;
      } finally {
        this.isFetched = true;
      }
    },
    
    async refreshToken(): Promise<boolean> {
    try {
      // Gọi API refresh token
      await refreshTokenApi();
      
      // Cập nhật thông tin user sau khi refresh
      await this.fetchUser();
      return true;
    } catch (error) {
      // console.error('Refresh token failed', error);
      this.resetAuth();
      return false;
    }
  },

    async logout() {
      try {
        await logoutApi(); 
      } catch (_) {
        // ignore
      } finally {
        this.resetAuth();
        router.push("/");
      }
    },

    resetAuth() {
      this.user = null;
      this.isAuthenticated = false;
      this.isFetched = true;
      this.permissions = [];
    },
  },
});
