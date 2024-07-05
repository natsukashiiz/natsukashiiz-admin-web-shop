<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-vue-next'
import type { PropType } from 'vue'

defineProps({
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
  <div class="invisible md:visible absolute top-[12px] -right-[16px] z-20">
    <Button @click="toggle" class="rounded-md w-8 h-8" variant="outline" size="icon">
      <ChevronLeft
        class="h-4 w-4 transition-transform ease-in-out duration-700"
        :class="collapsed === false ? 'rotate-180' : 'rotate-0'"
      />
    </Button>
  </div>
</template>
