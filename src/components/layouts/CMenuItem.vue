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
    :to="menu.href"
    class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
    :class="{
      'bg-muted text-primary': $route.path.includes(menu.href),
      'text-muted-foreground': !$route.path.includes(menu.href),
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
          <p>{{ menu.name }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <template v-else>
      <component :is="menu.icon" class="h-5 w-5" />
      <span
        class="truncate"
        :class="collapsed ? '-translate-x-96 opacity-0 hidden' : 'translate-x-0 opacity-100'"
      >
        {{ menu.name }}
      </span>
    </template>
  </router-link>
</template>
