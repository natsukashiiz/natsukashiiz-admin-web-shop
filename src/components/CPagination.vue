<script setup lang="ts">
import { computed, type PropType } from 'vue'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import type { Pagination as PaginationProps } from '@/types'

const props = defineProps({
  pagination: {
    type: Object as PropType<PaginationProps>,
    required: true
  }
})
const emit = defineEmits(['update:page'])

const currentPage = computed(() => props.pagination.page)
const totalItems = computed(() => props.pagination.total)
const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.size))

const startItem = computed(() => (currentPage.value - 1) * props.pagination.size + 1)
const endItem = computed(() =>
  Math.min(currentPage.value * props.pagination.size, totalItems.value)
)

function handlePageChange(page: number) {
  if (page < 1 || page > totalPages.value) return
  emit('update:page', page)
}
</script>
<template>
  <div class="flex items-center">
    <div class="text-xs text-muted-foreground mr-4">
      แสดง
      <strong> {{ startItem }} - {{ endItem }} </strong>
      จากทั้งหมด <strong>{{ totalItems }}</strong> รายการ
    </div>
    <Pagination
      v-slot="{ page }"
      :total="pagination.total"
      :sibling-count="1"
      show-edges
      :default-page="1"
      :page="pagination.page"
      :items-per-page="pagination.size"
      @update:page="handlePageChange"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst />
        <PaginationPrev />

        <template v-for="(item, index) in items">
          <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
            <Button :variant="item.value === page ? 'default' : 'outline'">
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>
  </div>
</template>
