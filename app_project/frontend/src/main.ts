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

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);

  // Pre-fetch user và permissions trước khi mount app
  const authStore = useAuthStore(pinia);
  if (!authStore.isFetched) {
    try {
      await authStore.fetchUser();
    } catch (error) {
      console.warn('Fetch user failed, user not authenticated');
    }
  }

  for (const [key, component] of Object.entries(lucideIcons)) {  
    if (typeof component === 'function' || (component && typeof component === 'object' && 'render' in component)) {
      app.component(key, component as Component);
    }
  }

  app.directive("permission", vPermission);

  app.use(router);
  setupRouterGuard();

  app.use(ElementPlus);
  // app.use(vuetify);

  // Mount app
  app.mount("#app");
}

bootstrap();
