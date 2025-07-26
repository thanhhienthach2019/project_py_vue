import { createApp, type Component } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "@/store/auth/authStore";
import "@/assets/style/tailwind.css";
import "@/assets/style/agstyle.css";
import "@/assets/style/custom.css";
import "@/assets/style/inputstyle.css";
import ElementPlus from "element-plus";
import '@mdi/font/css/materialdesignicons.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { setupRouterGuard } from "@/router/guard";
import * as lucideIcons from 'lucide-vue-next';
import { vPermission } from "./directives/permission";
import { ToastLoading } from '@/utils/toast-manager';
import LoadingToast from '@/pages/Toast/LoadingToast.vue';

// Đăng ký các module cần thiết cho ag-grid
import { ModuleRegistry } from 'ag-grid-community';
import { 
  ClientSideRowModelModule, 
  ValidationModule, 
  PaginationModule, 
  TextFilterModule, 
  QuickFilterModule, 
  ColumnAutoSizeModule, 
  CsvExportModule, 
  TextEditorModule, 
  RenderApiModule, 
  CustomEditorModule, 
  NumberEditorModule, 
  ColumnApiModule,
  
 } from 'ag-grid-community';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  PaginationModule,
  TextFilterModule,
  QuickFilterModule,
  ColumnAutoSizeModule,
  CsvExportModule,
  TextEditorModule,
  RenderApiModule,
  CustomEditorModule,
  NumberEditorModule,
  ColumnApiModule,
]);

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

const pinia = createPinia()

async function bootstrap() {
  const app = createApp(App);

  app.use(pinia);

  // Pre-fetch user và permissions trước khi mount app
  const browserRefreshToken = getCookie('_rid-rtk');
    if (browserRefreshToken) {
      const authStore = useAuthStore(pinia);
      if (!authStore.isFetched) {
        try {
          await authStore.checkOrRefreshSession();
        } catch (error) {
          // console.warn('Initial session refresh failed', error);
        }
      }
    } else {
      // console.info('No refresh token found, skipping session refresh.');
  }

  for (const [key, component] of Object.entries(lucideIcons)) {  
    if (typeof component === 'function' || (component && typeof component === 'object' && 'render' in component)) {
      app.component(key, component as Component);
    }
  }

  app.directive("permission", vPermission);
  app.use(ToastLoading)
  app.component('LoadingToast', LoadingToast)
  app.use(router);
  setupRouterGuard();
  app.use(ElementPlus);
  // app.use(vuetify);

  // Mount app
  app.mount("#app");
}

bootstrap();
