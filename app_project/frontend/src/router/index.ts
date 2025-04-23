import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Layout from '@/components/layout/Layout.vue';
import Login from '@/pages/auth/Login.vue';
import Home from '@/pages/views/Home.vue';
import NotFound from '@/pages/error/NotFound.vue';
import Material from '@/pages/views/Material.vue';
import RequestForm from '@/pages/views/RequestForm.vue';
import StockManagement from '@/pages/views/StockManagement.vue';
import InventoryHistory from '@/pages/views/InventoryHistory.vue';

const routes: RouteRecordRaw[] = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'material', name: 'Material', component: Material },
      { path: 'request-form', name: 'RequestForm', component: RequestForm },
      { path: 'stock-management', name: 'StockManagement', component: StockManagement },
      { path: 'inventory-history', name: 'InventoryHistory', component: InventoryHistory },
    ],
  },
  { path: '/:pathMatch(.*)*', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
