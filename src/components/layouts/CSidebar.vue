<script setup lang="ts">
import type { MenuItem } from '@/types'
import { type PropType } from 'vue'
import { RouterLink } from 'vue-router'

import { Package2, ListCollapse } from 'lucide-vue-next'
import CAccountBox from '@/components/CAccountBox.vue'
import { Button } from '@/components/ui/button'
import { useSettingStore } from '@/stores/settingStore'
import { storeToRefs } from 'pinia'

defineProps({
  menus: {
    type: [] as PropType<MenuItem[]>,
    required: true
  }
})

const { toggleSidebar } = useSettingStore()
const { sidebarCollapsed } = storeToRefs(useSettingStore())
</script>
<template>
  <div class="hidden border-r bg-muted/40 md:block">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
        <router-link to="/" class="flex items-center gap-2 font-semibold">
          <Package2 class="h-6 w-6" />
          <span class="">ร้านค้า</span>
        </router-link>
        <Button size="xs" variant="secondary" @click="toggleSidebar">
          <ListCollapse class="h-5 w-5 transition-all" :class="sidebarCollapsed && 'rotate-180'" />
        </Button>
      </div>
      <div class="flex-1">
        <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
          <template v-for="menu in menus" :key="menu.name">
            <router-link
              :to="menu.href"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              :class="
                $route.path.includes(menu.href) ? 'bg-muted text-primary' : 'text-muted-foreground'
              "
            >
              <component :is="menu.icon" class="h-5 w-5" />
              <span v-if="!sidebarCollapsed">{{ menu.name }}</span>
            </router-link>
          </template>
        </nav>
      </div>
      <div class="mt-auto p-4">
        <hr class="my-2" />
        <CAccountBox />
      </div>
    </div>
  </div>
</template>
