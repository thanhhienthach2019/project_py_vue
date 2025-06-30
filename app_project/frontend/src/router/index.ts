import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import NotFound from '@/pages/error/NotFound.vue';
import { useAuthStore } from "@/store/auth";


const routes: RouteRecordRaw[] = [
  { path: '/login', component: () => import('@/pages/auth/Login.vue') },
  {
    path: '/',
    component: () => import('@/components/layout/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/views/Home.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:dashboard:view',
        },
      },
      {
        path: 'material',
        name: 'Material',
        component: () => import('@/pages/views/Material.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:material:view',
        },
      },
      {
        path: 'maintenance-requests',
        name: 'MaintenanceRequest',
        component: () => import('@/pages/views/MaintenanceRequest.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:maintenance:view',
        },
      },
      {
        path: 'stock-management',
        name: 'StockManagement',
        component: () => import('@/pages/views/StockManagement.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:stock:view',
        },
      },
      {
        path: 'inventory-history',
        name: 'InventoryHistory',
        component: () => import('@/pages/views/InventoryHistory.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:inventory:view',
        },
      },
      {
        path: 'machine',
        name: 'Machine',
        component: () => import('@/pages/views/Machine.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:machines:view',
        },
      },
      {
        path: 'settings/policies',
        name: 'PolicyManager',
        component: () => import('@/pages/views/settings/PolicyManager.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:settings:policy:view',
        },
      },
      {
        path: 'settings/roles',
        name: 'RoleManager',
        component: () => import('@/pages/views/settings/RoleManager.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:settings:role:view',
        },
      },
      { 
        path: '/403', 
        name: 'Forbidden', 
        component: () => import('@/pages/error/Forbidden.vue') 
      },
    ]
  },
  { path: '/:pathMatch(.*)*', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  const requiredPerm = to.meta.permission as string | undefined

  if (!requiredPerm) {
    return next()
  }

  if (!auth.permissions.includes(requiredPerm)) {
    // window.dispatchEvent(new CustomEvent('show-toast', {
    //   detail: {
    //     message: 'You do not have permission to access this feature.',
    //     type: 'error'
    //   }
    // }))
    return next('/403');
  }

  next()
})

export default router;
