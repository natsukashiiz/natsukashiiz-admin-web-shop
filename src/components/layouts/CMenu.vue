<script setup lang="ts">
import type { MenuItem } from '@/types'
import { computed, type PropType, ref } from 'vue'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import CMenuItem from '@/components/layouts/CMenuItem.vue'
import { ChevronDown } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const props = defineProps({
  menu: {
    type: Object as PropType<MenuItem>,
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const isOpen = ref(false)

const menuActive = (menu: MenuItem): boolean => {
  return menu.name.includes(String(route.name))
}

if (props.menu.children) {
  props.menu.children.forEach((child) => {
    if (menuActive(child)) {
      isOpen.value = true
    }
  })
}
</script>

<template>
  <template v-if="menu.children">
    <Collapsible v-model:open="isOpen">
      <CollapsibleTrigger class="w-full relative">
        <CMenuItem :menu="menu" :collapsed="collapsed" />
        <span v-if="!collapsed" class="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown
            :size="16"
            class="transition-transform duration-300"
            :class="{ 'transform rotate-180': isOpen }"
          />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div :class="{ 'pl-5': !collapsed }">
          <CMenuItem
            v-for="child in menu.children"
            :key="child.name"
            :menu="child"
            :collapsed="collapsed"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  </template>
  <CMenuItem v-else :menu="menu" :collapsed="collapsed" />
</template>
