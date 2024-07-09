<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import CPagination from '@/components/CPagination.vue'
import type { TableColumn, Pagination } from '@/types'
import type { PropType } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array as PropType<any[]>,
    required: true
  },
  columns: {
    type: Array as PropType<TableColumn[]>,
    required: true
  },
  pagination: {
    type: Object as PropType<Pagination>,
    required: true
  }
})
defineEmits(['update:page'])
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <template v-for="column in columns" :key="column.key">
              <TableHead :class="column.class" class="font-medium">
                <span :class="{ 'sr-only': column.hidden }"> {{ column.label }} </span>
              </TableHead>
            </template>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(item, index) in items" :key="index">
            <template v-for="column in columns" :Key="column.key">
              <TableCell :class="column.class">
                <slot :name="column.key" :item="item">
                  {{ (item as any)[column.key] }}
                </slot>
              </TableCell>
            </template>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  <div class="flex justify-end items-center">
    <CPagination :pagination="pagination" @update:page="(page) => $emit('update:page', page)" />
  </div>
</template>
