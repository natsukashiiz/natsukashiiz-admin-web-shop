<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import CLoadingIndicator from './components/CLoadingIndicator.vue'
</script>

<template>
  <CLoadingIndicator />
  <Toaster />
  <div class="max-h-dvh">
    <RouterView />
  </div>
</template>
