import { createApp, type Component } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "@/assets/style/tailwind.css";
import "@/assets/style/agstyle.css";
import "@/assets/style/custom.css"
import "@/assets/style/inputstyle.css"
import ElementPlus from "element-plus";
// import vuetify from '../plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { setupRouterGuard } from "@/router/guard";
import * as lucideIcons from 'lucide-vue-next';

// Đăng ký các module cần thiết
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule, 
    ValidationModule, 
    PaginationModule,
    TextFilterModule,
    QuickFilterModule,
    ColumnAutoSizeModule,
    CsvExportModule,
    TextEditorModule,
    RenderApiModule,
    CustomEditorModule,
    NumberEditorModule ,
    ColumnApiModule 
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
  ColumnApiModule 
          
]);

const app = createApp(App);

for (const [key, component] of Object.entries(lucideIcons)) {  
  if (typeof component === 'function' || (component && typeof component === 'object' && 'render' in component)) {
    app.component(key, component as Component);
  }
}

app.use(createPinia());
app.use(router);
setupRouterGuard();
app.use(ElementPlus);
// app.use(vuetify);

app.mount("#app");