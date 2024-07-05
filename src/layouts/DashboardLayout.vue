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
</script>
<template>
  <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    <CSidebar :menus="menus" />
    <div class="flex flex-col">
      <CHeader :menus="menus" />
      <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>
