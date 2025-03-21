// src/store/auth.ts
import { defineStore } from "pinia";
import { loginApi, checkAuth, logoutApi } from "@/services/auth"

interface AuthState {
  user: any | null
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
  }),  
  actions: {
    async login(username: string, password: string) {
      try {
        await loginApi(username, password);
        await this.fetchUser();
        return true;
      } catch (error) {        
        throw new Error("Sai tài khoản hoặc mật khẩu!");
      }
    },
    
    async fetchUser() {
      try {
        const response = await checkAuth();
        
        if (response.data.authenticated) {
          this.user = response.data.user;
          this.isAuthenticated = true;
        } else {
          this.user = null;
          this.isAuthenticated = false;
        }
    
      } catch (error) {
        console.error("Lỗi fetchUser:", error);    
        this.user = null;
        this.isAuthenticated = false;
      }
    },
    
    async logout() {
      await logoutApi();
      this.user = null;
      this.isAuthenticated = false;
    }
  },
});

