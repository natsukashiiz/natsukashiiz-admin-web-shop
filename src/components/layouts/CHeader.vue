<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import type { MenuItem } from '@/types'
import type { PropType } from 'vue'
import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

import { Bell, Menu, Package2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Icon } from '@iconify/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import CAccountBox from '@/components/layouts/CAccountItem.vue'
import CMenu from './CMenu.vue'

const props = defineProps({
  menus: {
    type: [] as PropType<MenuItem[]>,
    required: true
  }
})

const route = useRoute()
const mode = useColorMode()

const findInMenu = (menus: MenuItem[], routeName: string): MenuItem | undefined => {
  for (const menu of menus) {
    if (menu.name === routeName) {
      return menu
    }
    if (menu.children) {
      const found = findInMenu(menu.children, routeName)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

const routeNameFirstUpper = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}
const title = computed(() => {
  const menu = findInMenu(props.menus, route.name as string)
  return menu ? routeNameFirstUpper(menu.title) : 'แดชบอร์ด'
})
</script>

<template>
  <header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
    <Sheet>
      <SheetTrigger as-child>
        <Button variant="outline" size="icon" class="shrink-0 md:hidden">
          <Menu class="h-5 w-5" />
          <span class="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" class="flex flex-col">
        <nav class="grid gap-2 text-lg font-medium">
          <router-link to="/home" class="flex items-center gap-2 text-lg font-semibold">
            <Package2 class="h-6 w-6" />
            <span>ระบบจัดการร้านค้า</span>
          </router-link>
          <template v-for="menu in menus" :key="menu.name">
            <CMenu :menu="menu" />
          </template>
        </nav>
        <div class="mt-auto">
          <hr class="my-2" />
          <CAccountBox />
        </div>
      </SheetContent>
    </Sheet>

    <span class="text-lg font-semibold ml-4"> {{ title }} </span>

    <div class="ml-auto space-x-3">
      <Button variant="outline" size="icon" class="h-8 w-8">
        <Bell class="h-4 w-4" />
        <span class="sr-only">Toggle notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="icon" class="h-8 w-8">
            <Icon
              icon="radix-icons:moon"
              class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Icon
              icon="radix-icons:sun"
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="mode = 'light'" class="cursor-pointer">
            สว่าง
          </DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'dark'" class="cursor-pointer"> มืด </DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'auto'" class="cursor-pointer">ระบบ</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
