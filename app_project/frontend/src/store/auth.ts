// src/store/auth.ts
import { defineStore } from "pinia";
import { loginApi, checkAuth, logoutApi } from "@/services/auth"
import { fetchMyPermissions } from "@/services/permission";
import router from "@/router";

interface AuthState {
  user: any | null
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
    permissions: []
  }),  
  actions: {
    async login(username: string, password: string) {
      this.loading = true;
      try {
        await loginApi(username, password);
        await this.fetchUser(); 
        return true;
      } catch (error) {
        throw new Error("Sai tài khoản hoặc mật khẩu!");
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUser() {
      this.loading = true;
      try {
        // console.log("vận chạy");
        const response = await checkAuth();
        if (response.data.authenticated) {
          this.user = response.data.user;
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
    
    async logout() {
      try {
        await logoutApi();
      } catch (e) {
       
      } finally {
        this.resetAuth();
        router.push("/login"); 
      }
    },
    resetAuth() {
      this.user = null;
      this.isAuthenticated = false;
      this.isFetched = true;
      this.permissions = [];
    }
  },
});

