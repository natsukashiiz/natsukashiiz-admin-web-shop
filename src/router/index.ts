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
          path: '/customers',
          name: 'customers',
          component: () => import('@/views/dashboard/CustomersView.vue')
        },
        {
          path: '/vouchers',
          name: 'vouchers',
          component: () => import('@/views/dashboard/VouchersView.vue')
        },
        {
          path: '/categories',
          name: 'categories',
          component: () => import('@/views/dashboard/CategoriesView.vue')
        },
        {
          path: '/carousels',
          name: 'carousels',
          component: () => import('@/views/dashboard/CarouselsView.vue')
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
