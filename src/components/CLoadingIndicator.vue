<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'
import { Loader } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const { loading } = storeToRefs(useLoadingStore())
</script>

<template>
  <div
    v-if="loading"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
  >
    <Loader class="w-12 h-12 text-slate-100 spinner" />
  </div>
</template>

<style>
.spinner {
  animation: spin 0.1s linear infinite;
}
</style>
