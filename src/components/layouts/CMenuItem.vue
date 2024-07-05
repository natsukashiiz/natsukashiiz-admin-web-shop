<script setup lang="ts">
import type { MenuItem } from '@/types'
import type { PropType } from 'vue'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

defineProps({
  menu: {
    type: Object as PropType<MenuItem>,
    required: true
  },
  collapsed: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <router-link
    :to="menu.href || ''"
    class="flex items-center gap-3 rounded-lg px-3 py-2 my-[2px] transition-all hover:text-primary"
    :class="{
      'bg-muted text-primary': $route.name && ($route.name as string).includes(menu.name),
      'text-muted-foreground': $route.name && !($route.name as string).includes(menu.name),
      'justify-center': collapsed,
      'justify-start': !collapsed
    }"
  >
    <TooltipProvider v-if="collapsed">
      <Tooltip :delay-duration="0">
        <TooltipTrigger>
          <component :is="menu.icon" class="h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{{ menu.title }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <template v-else>
      <component :is="menu.icon" class="h-5 w-5" />
      <span
        class="truncate"
        :class="collapsed ? '-translate-x-96 opacity-0 hidden' : 'translate-x-0 opacity-100'"
      >
        {{ menu.title }}
      </span>
    </template>
  </router-link>
</template>
