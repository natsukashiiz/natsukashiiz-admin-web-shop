<script setup lang="ts">
import { File, Search, X, Grid2x2X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import CPagination from '@/components/CPagination.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { PropType } from 'vue'
import type { TableColumn, Pagination, TableSearch, TableSearchBy } from '@/types'

defineProps({
  title: {
    type: String,
    required: false
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
  },
  searchBy: {
    type: Array as PropType<TableSearchBy[]>,
    required: true
  },
  search: {
    type: Object as PropType<TableSearch>,
    required: true
  }
})
defineEmits(['update:page', 'update:searchQuery', 'update:searchBy'])
</script>
<template>
  <div class="flex items-center">
    <div class="flex w-full max-w-md items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            ค้นหาโดย: <Badge class="ml-2" variant="outline">{{ search.by.label }}</Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel> ค้นหาโดย </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            :model-value="search.by.key"
            @update:model-value="
              (byKey) =>
                $emit(
                  'update:searchBy',
                  searchBy.find((item) => item.key === byKey)
                )
            "
          >
            <template v-for="item in searchBy" :key="item.key">
              <DropdownMenuRadioItem :value="item.key">
                {{ item.label }}
              </DropdownMenuRadioItem>
            </template>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div class="relative">
        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Select
          v-if="search.by.type === 'select'"
          @update:model-value="(query) => $emit('update:searchQuery', query)"
        >
          <SelectTrigger class="w-[200px] appearance-none bg-background pl-8 shadow-none">
            <SelectValue :placeholder="search.by.label" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="item in searchBy.find((item) => item.key === search.by.key)?.options"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          v-else
          :value="search.query"
          :type="search.by.type"
          @update:model-value="
            (query) =>
              $emit('update:searchQuery', query.toString().trim() === '' ? undefined : query)
          "
          placeholder="ค้นหาลูกค้า"
          class="w-full appearance-none bg-background pl-8 shadow-none"
        />
      </div>
      <!-- <TooltipProvider :delay-duration="0">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="outline" size="icon" @click="$emit('update:searchQuery', undefined)">
              <X class="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent> ล้างคำค้นหา </TooltipContent>
        </Tooltip>
      </TooltipProvider> -->
    </div>
    <div class="ml-auto flex items-center gap-2">
      <Button size="sm" variant="outline" class="h-7 gap-1" disabled>
        <File class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> ส่งออก </span>
      </Button>
      <!-- <router-link to="/customer/create">
        <Button size="sm" class="h-7 gap-1">
          <PlusCircle class="h-3.5 w-3.5" />
          <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> เพิ่มลูกค้า </span>
        </Button>
      </router-link> -->
    </div>
  </div>
  <Card>
    <CardHeader>
      <CardTitle v-if="title">{{ title }}</CardTitle>
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
          <template v-if="items.length > 0">
            <TableRow v-for="(item, index) in items" :key="index">
              <template v-for="column in columns" :Key="column.key">
                <TableCell :class="column.class">
                  <slot :name="column.key" :item="item">
                    {{ item[column.key] }}
                  </slot>
                </TableCell>
              </template>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="columns.length">
              <Grid2x2X class="w-8 h-8 text-muted-foreground mx-auto mt-32 mb-2" />
              <p class="text-center text-muted-foreground mb-32">ไม่พบข้อมูล</p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  <div class="flex justify-end items-center">
    <CPagination :pagination="pagination" @update:page="(page) => $emit('update:page', page)" />
  </div>
</template>
