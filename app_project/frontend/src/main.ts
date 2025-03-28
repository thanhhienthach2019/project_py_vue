import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "@/assets/style/tailwind.css";
import "@/assets/style/agstyle.css";
import "@/assets/style/custom.css"
import ElementPlus from "element-plus";
// import vuetify from '../plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

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
    RenderApiModule      } from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  PaginationModule,
  TextFilterModule,
  QuickFilterModule,
  ColumnAutoSizeModule,
  CsvExportModule,
  TextEditorModule,
  RenderApiModule     
]);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
// app.use(vuetify);

app.mount("#app");