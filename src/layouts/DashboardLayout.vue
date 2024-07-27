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
import { useAuthStore } from '@/stores/auth'
import { onBeforeMount } from 'vue'

const menus: MenuItem[] = [
  {
    title: 'แดชบอร์ด',
    name: 'home',
    href: '/home',
    icon: Home
  },
  {
    title: 'คำสั่งซื้อ',
    name: 'order',
    icon: ShoppingCart,
    children: [
      {
        title: 'รายการคำสั่งซื้อ',
        name: 'order-list',
        href: '/order/list',
        icon: List
      }
    ]
  },
  {
    title: 'สินค้า',
    name: 'product',
    icon: Package,
    children: [
      {
        title: 'รายการสินค้า',
        name: 'product-list',
        href: '/product/list',
        icon: List
      },
      {
        title: 'เพิ่มสินค้า',
        name: 'product-create',
        href: '/product/create',
        icon: PackagePlus
      }
    ]
  },
  {
    title: 'หมวดหมู่',
    name: 'category',
    icon: LayoutList,
    children: [
      {
        title: 'รายการหมวดหมู่',
        name: 'category-list',
        href: '/category/list',
        icon: List
      },
      {
        title: 'เพิ่มหมวดหมู่',
        name: 'category-create',
        href: '/category/create',
        icon: PackagePlus
      }
    ]
  },
  {
    title: 'คูปอง',
    name: 'voucher',
    icon: Ticket,
    children: [
      {
        title: 'รายการคูปอง',
        name: 'voucher-list',
        href: '/voucher/list',
        icon: List
      },
      {
        title: 'เพิ่มคูปอง',
        name: 'voucher-create',
        href: '/voucher/create',
        icon: PackagePlus
      }
    ]
  },
  {
    title: 'ภาพสไลด์',
    name: 'carousel',
    icon: GalleryThumbnails,
    children: [
      {
        title: 'รายการภาพสไลด์',
        name: 'carousel-list',
        href: '/carousel/list',
        icon: List
      },
      {
        title: 'เพิ่มภาพสไลด์',
        name: 'carousel-create',
        href: '/carousel/create',
        icon: PackagePlus
      }
    ]
  },
  {
    title: 'ลูกค้า',
    name: 'customer',
    icon: Users,
    children: [
      {
        title: 'รายการลูกค้า',
        name: 'customer-list',
        href: '/customer/list',
        icon: List
      }
    ]
  },
  {
    title: 'ผู้จัดการ',
    name: 'manager',
    icon: UserRoundCog,
    children: [
      {
        title: 'รายการผู้จัดการ',
        name: 'manager-list',
        href: '/manager/list',
        icon: List
      },
      {
        title: 'เพิ่มผู้จัดการ',
        name: 'manager-create',
        href: '/manager/create',
        icon: PackagePlus
      }
    ]
  }
]

const settingStore = useSettingStore()
settingStore.loadSetting()

onBeforeMount(async () => {
  const { loadAuth } = useAuthStore()
  await loadAuth()
})
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
