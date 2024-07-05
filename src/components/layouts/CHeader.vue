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
import CAccountBox from '@/components/CAccountBox.vue'

const props = defineProps({
  menus: {
    type: [] as PropType<MenuItem[]>,
    required: true
  }
})

const route = useRoute()
const mode = useColorMode()

const routeNameFirstUpper = () => {
  const name = routeName()
  return name.charAt(0).toUpperCase() + name.slice(1)
}
const routeName = () => {
  const name = route.name
  return name ? name.toString() : 'Dashboard'
}
const title = computed(() => {
  const menu = props.menus.find((menu) => route.path.includes(menu.href))
  return menu ? menu.name : routeNameFirstUpper()
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
          <a href="#" class="flex items-center gap-2 text-lg font-semibold">
            <Package2 class="h-6 w-6" />
            <span class="sr-only">ร้านค้า</span>
          </a>
          <template v-for="menu in menus" :key="menu.name">
            <router-link
              :to="menu.href"
              class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
              :class="
                $route.path.includes(menu.href)
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground'
              "
            >
              <component :is="menu.icon" class="h-5 w-5" />
              <span>{{ menu.name }}</span>
            </router-link>
          </template>
        </nav>
        <div class="mt-auto">
          <hr class="my-2" />
          <CAccountBox />
        </div>
      </SheetContent>
    </Sheet>

    <span class="text-lg font-semibold"> {{ title }} </span>

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
