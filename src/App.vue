<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <Toaster />
  <div class="max-h-dvh">
    <RouterView />
  </div>
</template>
