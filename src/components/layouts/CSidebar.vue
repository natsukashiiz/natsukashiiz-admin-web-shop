<script setup lang="ts">
import type { MenuItem } from '@/types'
import { type PropType } from 'vue'
import { RouterLink } from 'vue-router'

import CAccountBox from '@/components/layouts/CAccountItem.vue'
import CSidebarToggle from '@/components/layouts/CSidebarToggle.vue'
import { Package2 } from 'lucide-vue-next'
import CMenu from '@/components/layouts/CMenu.vue'

defineProps({
  menus: {
    type: [] as PropType<MenuItem[]>,
    required: true
  },
  toggle: {
    type: Function as PropType<() => void>,
    required: true
  },
  collapsed: {
    type: Boolean as PropType<boolean>,
    required: true
  }
})
</script>
<template>
  <aside class="hidden border-r bg-muted/40 md:block relative">
    <CSidebarToggle :toggle="toggle" :collapsed="collapsed" />
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div
        class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6"
        :class="{
          'justify-center': collapsed,
          'justify-start': !collapsed
        }"
      >
        <router-link to="/" class="flex items-center gap-2 font-semibold">
          <Package2 class="h-6 w-6" />
          <span
            class="text-nowrap transition-[transform,opacity,display] ease-in-out duration-300"
            :class="collapsed ? '-translate-x-96 opacity-0 hidden' : 'translate-x-0 opacity-100'"
          >
            ระบบจัดการร้านค้า
          </span>
        </router-link>
      </div>
      <div class="flex-1 max-h-full overflow-y-scroll">
        <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
          <template v-for="menu in menus" :key="menu.name">
            <CMenu :menu="menu" :collapsed="collapsed" />
          </template>
        </nav>
      </div>
      <div class="mt-auto p-4">
        <hr class="my-2" />
        <CAccountBox :collapsed="collapsed" />
      </div>
    </div>
  </aside>
</template>
