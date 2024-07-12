<script setup lang="ts">
import { CheckCircledIcon, CrossCircledIcon, TrashIcon } from '@radix-icons/vue'
import { CommonStatus } from '@/types/enum'

defineProps<{
  status: CommonStatus
}>()
</script>
<template>
  <CheckCircledIcon v-if="status === CommonStatus.active" class="h-5 w-5 text-green-500" />
  <CrossCircledIcon v-else-if="status === CommonStatus.inactive" class="h-5 w-5 text-gray-500" />
  <TrashIcon v-else-if="status === CommonStatus.deleted" class="h-5 w-5 text-red-500" />
  <span v-else>ไม่ทราบสถานะ</span>
</template>
