<script setup lang="ts">
import type { MenuItem } from '@/types'
import { RouterView } from 'vue-router'

import CHeader from '@/components/layouts/CHeader.vue'
import CSidebar from '@/components/layouts/CSidebar.vue'
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  GalleryThumbnails,
  UserRoundCog,
  LayoutList,
  PackagePlus,
  List
} from 'lucide-vue-next'
import { useSettingStore } from '@/stores/settingStore'

const menus: MenuItem[] = [
  {
    title: 'แดชบอร์ด',
    name: 'home',
    href: '/home',
    icon: Home
  },
  {
    title: 'คำสั่งซื้อ',
    name: 'orders',
    href: '/orders',
    icon: ShoppingCart
  },
  {
    title: 'สินค้า',
    name: 'products',
    icon: Package,
    children: [
      {
        title: 'รายการสินค้า',
        name: 'products-list',
        href: '/products/list',
        icon: List
      },
      {
        title: 'เพิ่มสินค้า',
        name: 'products-create',
        href: '/products/create',
        icon: PackagePlus
      }
    ]
  },
  {
    title: 'หมวดหมู่',
    name: 'categories',
    icon: LayoutList,
    children: [
      {
        title: 'รายการหมวดหมู่',
        name: 'categories-list',
        href: '/categories/list',
        icon: List
      },
      {
        title: 'เพิ่มหมวดหมู่',
        name: 'categories-create',
        href: '/categories/create',
        icon: PackagePlus
      }
    ]
  },
  {
    title: 'คูปอง',
    name: 'vouchers',
    icon: Ticket,
    children: [
      {
        title: 'รายการคูปอง',
        name: 'vouchers-list',
        href: '/vouchers/list',
        icon: List
      },
      {
        title: 'เพิ่มคูปอง',
        name: 'vouchers-create',
        href: '/vouchers/create',
        icon: PackagePlus
      }
    ]
  },
  {
    title: 'ภาพสไลด์',
    name: 'carousels',
    icon: GalleryThumbnails,
    children: [
      {
        title: 'รายการภาพสไลด์',
        name: 'carousels-list',
        href: '/carousels/list',
        icon: List
      },
      {
        title: 'เพิ่มภาพสไลด์',
        name: 'carousels-create',
        href: '/carousels/create',
        icon: PackagePlus
      }
    ]
  },
  {
    title: 'ลูกค้า',
    name: 'customers',
    href: '/customers',
    icon: Users
  },
  {
    title: 'ผู้จัดการ',
    name: 'managers',
    href: '/managers',
    icon: UserRoundCog
  }
]

const settingStore = useSettingStore()
settingStore.loadSetting()
</script>
<template>
  <div
    class="grid h-dvh w-full"
    :class="
      settingStore.sidebarCollapsed
        ? 'md:grid-cols-[90px_1fr] lg:grid-cols-[90px_1fr]'
        : 'md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]'
    "
  >
    <CSidebar
      :menus="menus"
      :toggle="settingStore.toggleSidebar"
      :collapsed="settingStore.sidebarCollapsed"
    />
    <div class="flex flex-col">
      <CHeader :menus="menus" />
      <main
        class="flex flex-1 flex-col gap-4 p-4 md:gap-5 md:p-5 max-h-[calc(100vh-60px)] overflow-y-auto"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>
