import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/auth/Login.vue";
import Home from "@/pages/dashboard/Home.vue";
import NotFound from "@/pages/error/NotFound.vue";
import Material from "@/pages/views/Material.vue";
import RequestForm from "@/pages/views/RequestForm.vue";
import StockManagement from "@/pages/views/StockManagement.vue";
import InventoryHistory from "@/pages/views/InventoryHistory.vue";
import Dashboard from "@/pages/views/Dashboard.vue";
import { authGuard } from "../middleware/authGuard";

const routes = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: Home,
    beforeEnter: authGuard,
    children: [
      { path: "", name: "dashboard", component: Dashboard },
      { path: "dashboard", name: "dashboard", component: Dashboard },
      { path: "material", name: "category", component: Material },
      { path: "request-form", name: "requestForm", component: RequestForm },
      { path: "stock-management", name: "stockManagement", component: StockManagement },
      { path: "inventory-history", name: "inventoryHistory", component: InventoryHistory },
    ],
  },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
