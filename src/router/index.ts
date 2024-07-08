import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      beforeEnter: (_to, _from, next) => {
        const authStore = useAuthStore()
        authStore.loadAuth()
        if (authStore.isAuthenticated) {
          next({ name: 'dashboard' })
        }
        next()
      }
    },
    {
      path: '/',
      name: 'dashboard',
      beforeEnter: (_to, _from, next) => {
        const authStore = useAuthStore()
        authStore.loadAuth()
        if (!authStore.isAuthenticated) {
          next({ name: 'login' })
        }
        next()
      },
      component: () => import('@/layouts/DashboardLayout.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/dashboard/HomeView.vue')
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('@/views/dashboard/OrdersView.vue')
        },
        {
          path: '/product',
          name: 'product',
          redirect: '/product/list',
          children: [
            {
              path: 'list',
              name: 'product-list',
              component: () => import('@/views/dashboard/product/ProductListView.vue')
            },
            {
              path: 'create',
              name: 'product-create',
              component: () => import('@/views/dashboard/product/ProductCreateView.vue')
            },
            {
              path: 'edit/:id',
              name: 'product-edit',
              component: () => import('@/views/dashboard/product/ProductEditView.vue')
            }
          ]
        },
        {
          path: '/category',
          name: 'category',
          redirect: '/category/list',
          children: [
            {
              path: 'list',
              name: 'category-list',
              component: () => import('@/views/dashboard/category/CategoryListView.vue')
            },
            {
              path: 'create',
              name: 'category-create',
              component: () => import('@/views/dashboard/category/CategoryCreateView.vue')
            },
            {
              path: 'edit/:id',
              name: 'category-edit',
              component: () => import('@/views/dashboard/category/CategoryEditView.vue')
            }
          ]
        },
        {
          path: '/voucher',
          name: 'voucher',
          redirect: '/voucher/list',
          children: [
            {
              path: 'list',
              name: 'voucher-list',
              component: () => import('@/views/dashboard/voucher/VoucherListView.vue')
            },
            {
              path: 'create',
              name: 'voucher-create',
              component: () => import('@/views/dashboard/voucher/VoucherCreateView.vue')
            },
            {
              path: 'edit/:id',
              name: 'voucher-edit',
              component: () => import('@/views/dashboard/voucher/VoucherEditView.vue')
            }
          ]
        },
        {
          path: '/carousel',
          name: 'carousel',
          redirect: '/carousel/list',
          children: [
            {
              path: 'list',
              name: 'carousel-list',
              component: () => import('@/views/dashboard/carousel/CarouselListView.vue')
            },
            {
              path: 'create',
              name: 'carousel-create',
              component: () => import('@/views/dashboard/carousel/CarouselCreateView.vue')
            },
            {
              path: 'edit/:id',
              name: 'carousel-edit',
              component: () => import('@/views/dashboard/carousel/CarouselEditView.vue')
            }
          ]
        },
        {
          path: '/customer',
          name: 'customer',
          redirect: '/customer/list',
          children: [
            {
              path: 'list',
              name: 'customer-list',
              component: () => import('@/views/dashboard/customer/CustomerListView.vue')
            }
          ]
        },
        {
          path: '/manager',
          name: 'manager',
          redirect: '/manager/list',
          children: [
            {
              path: 'list',
              name: 'manager-list',
              component: () => import('@/views/dashboard/manager/ManagerListView.vue')
            },
            {
              path: 'create',
              name: 'manager-create',
              component: () => import('@/views/dashboard/manager/ManagerCreateView.vue')
            },
            {
              path: 'edit/:id',
              name: 'manager-edit',
              component: () => import('@/views/dashboard/manager/ManagerEditView.vue')
            }
          ]
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/dashboard/ProfileView.vue')
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('@/views/dashboard/SettingsView.vue')
        }
      ]
    }
  ]
})

export default router
