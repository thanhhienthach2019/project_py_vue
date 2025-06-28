import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Layout from '@/components/layout/Layout.vue';
import Login from '@/pages/auth/Login.vue';
import Home from '@/pages/views/Home.vue';
import NotFound from '@/pages/error/NotFound.vue';
import Material from '@/pages/views/Material.vue';
import MaintenanceRequest from '@/pages/views/MaintenanceRequest.vue';
import StockManagement from '@/pages/views/StockManagement.vue';
import InventoryHistory from '@/pages/views/InventoryHistory.vue';
import Machine from '@/pages/views/Machine.vue';
import Policy from '@/pages/views/settings/PolicyManager.vue';

const routes: RouteRecordRaw[] = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'material', name: 'Material', component: Material },
      { path: 'maintenance-requests', name: 'MaintenanceRequest', component: MaintenanceRequest },
      { path: 'stock-management', name: 'StockManagement', component: StockManagement },
      { path: 'inventory-history', name: 'InventoryHistory', component: InventoryHistory },
      { path: 'machine', name: 'Machine', component: Machine },
      {
        path: 'settings/policies',
        name: 'PolicyManager',
        component: Policy,
        meta: {
          requiresAuth: true,
          permission: 'menu:settings:view', 
        },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
