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
  LayoutList
} from 'lucide-vue-next'
import { useSettingStore } from '@/stores/settingStore'

const menus: MenuItem[] = [
  { name: 'แดชบอร์ด', icon: Home, href: '/home' },
  { name: 'คำสั่งซื้อ', icon: ShoppingCart, href: '/orders' },
  { name: 'สินค้า', icon: Package, href: '/products' },
  { name: 'หมวดหมู่', icon: LayoutList, href: '/categories' },
  { name: 'คูปอง', icon: Ticket, href: '/vouchers' },
  { name: 'คารูเซล', icon: GalleryThumbnails, href: '/carousels' },
  { name: 'ลูกค้า', icon: Users, href: '/customers' },
  { name: 'ผู้จัดการ', icon: UserRoundCog, href: '/managers' }
]

const settingStore = useSettingStore()
settingStore.loadSetting()
</script>
<template>
  <div
    class="grid h-dvh w-full transition-all ease-in-out duration-500"
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
        class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 max-h-[calc(100dvh-60px)] overflow-scroll"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>
