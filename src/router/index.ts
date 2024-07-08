import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/',
      name: 'dashboard',
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
          path: '/products',
          name: 'products',
          redirect: '/products/list',
          children: [
            {
              path: 'list',
              name: 'products-list',
              component: () => import('@/views/dashboard/products/ProductListView.vue')
            },
            {
              path: 'create',
              name: 'product-create',
              component: () => import('@/views/dashboard/products/ProductCreateView.vue')
            },
            {
              path: 'edit/:id',
              name: 'product-edit',
              component: () => import('@/views/dashboard/products/ProductEditView.vue')
            }
          ]
        },
        {
          path: '/categories',
          name: 'categories',
          redirect: '/categories/list',
          children: [
            {
              path: 'list',
              name: 'category-list',
              component: () => import('@/views/dashboard/categories/CategoryListView.vue')
            },
            {
              path: 'create',
              name: 'category-create',
              component: () => import('@/views/dashboard/categories/CategoryCreateView.vue')
            },
            {
              path: 'edit/:id',
              name: 'category-edit',
              component: () => import('@/views/dashboard/categories/CategoryEditView.vue')
            }
          ]
        },
        {
          path: '/customers',
          name: 'customers',
          component: () => import('@/views/dashboard/CustomersView.vue')
        },
        {
          path: '/vouchers',
          name: 'vouchers',
          redirect: '/vouchers/list',
          children: [
            {
              path: 'list',
              name: 'voucher-list',
              component: () => import('@/views/dashboard/vouchers/VoucherListView.vue')
            },
            {
              path: 'create',
              name: 'voucher-create',
              component: () => import('@/views/dashboard/vouchers/VoucherCreateView.vue')
            },
            {
              path: 'edit/:id',
              name: 'voucher-edit',
              component: () => import('@/views/dashboard/vouchers/VoucherEditView.vue')
            }
          ]
        },
        {
          path: '/carousels',
          name: 'carousels',
          redirect: '/carousels/list',
          children: [
            {
              path: 'list',
              name: 'carousel-list',
              component: () => import('@/views/dashboard/carousels/CarouselListView.vue')
            },
            {
              path: 'create',
              name: 'carousel-create',
              component: () => import('@/views/dashboard/carousels/CarouselCreateView.vue')
            },
            {
              path: 'edit/:id',
              name: 'carousel-edit',
              component: () => import('@/views/dashboard/carousels/CarouselEditView.vue')
            }
          ]
        },
        {
          path: '/managers',
          name: 'managers',
          component: () => import('@/views/dashboard/ManagersView.vue')
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
