import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import NotFound from '@/pages/error/NotFound.vue';
import { useAuthStore } from "@/store/auth/authStore";


const routes: RouteRecordRaw[] = [
  { path: '/login', component: () => import('@/pages/auth/Login.vue') },
  {
    path: '/',
    component: () => import('@/components/layout/UserLayout.vue'),
    children: [
      {
        path: '/',
        name: 'MainPage',
        component: () => import('@/components/layout/UserMainContent.vue'),
      },
      {
        path: '/news',
        name: 'News',
        component: () => import('@/pages/views/inventory/Material.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:material:view',
        },
      },      
      { 
        path: '/403', 
        name: 'Forbidden', 
        component: () => import('@/pages/error/Forbidden.vue') 
      },
    ]
  },
  {
    path: '/admin',
    component: () => import('@/components/layout/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '', 
        name: 'AdminHome',
        component: () => import('@/pages/views/Home.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:dashboard:view',
        },
      },
      {
        path: 'inventory/material',
        name: 'Material',
        component: () => import('@/pages/views/inventory/Material.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:material:view',
        },
      },
      {
        path: 'inventory/maintenance-requests',
        name: 'MaintenanceRequest',
        component: () => import('@/pages/views/inventory/MaintenanceRequest.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:maintenance:view',
        },
      },
      {
        path: 'inventory/stock-management',
        name: 'StockManagement',
        component: () => import('@/pages/views/inventory/StockManagement.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:stock:view',
        },
      },
      {
        path: 'inventory/history',
        name: 'InventoryHistory',
        component: () => import('@/pages/views/inventory/InventoryHistory.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:inventory:view',
        },
      },
      {
        path: 'inventory/machine',
        name: 'Machine',
        component: () => import('@/pages/views/inventory/Machine.vue'),
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
        path: 'settings/users',
        name: 'UserManager',
        component: () => import('@/pages/views/settings/UserManager.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:settings:user:view',
        },
      },
      {
        path: 'settings/menus',
        name: 'MenuManager',
        component: () => import('@/pages/views/settings/MenuManager.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:settings:menu:view',
        },
      },
      {
        path: 'settings/routers',
        name: 'RouterManager',
        component: () => import('@/pages/views/settings/PermissionManager.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:settings:router:view',
        },
      },
      {
        path: 'settings/forms',
        name: 'FormManager',
        component: () => import('@/pages/views/settings/FormManager.vue'),
        meta: {
          requiresAuth: true,
          permission: 'menu:settings:form:view',
        },
      },
      {
        path: '403',
        name: 'Forbidden',
        component: () => import('@/pages/error/Forbidden.vue'),
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
