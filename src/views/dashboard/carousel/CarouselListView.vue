<script setup lang="ts">
import { File, ListFilter, MoreHorizontal, PlusCircle, Search } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

import { Input } from '@/components/ui/input'
import { reactive, ref } from 'vue'
import { computed } from 'vue'
import CPagination from '@/components/CPagination.vue'
import type { RouterLink } from 'vue-router'

interface TableColumn {
  key: string
  label: string
  hidden?: boolean
  class?: string
}

const colums: TableColumn[] = [
  {
    key: 'image',
    label: 'รูปภาพ',
    hidden: true,
    class: 'hidden sm:table-cell'
  },
  {
    key: 'title',
    label: 'ชื่อ'
  },
  {
    key: 'sort',
    label: 'ลำดับ'
  },
  {
    key: 'status',
    label: 'สถานะ'
  },
  {
    key: 'created_at',
    label: 'วันที่สร้าง',
    class: 'hidden md:table-cell'
  },
  {
    key: 'actions',
    label: 'การกระทำ',
    hidden: true
  }
]

const carousels = ref([
  {
    id: 1,
    name: 'ภาพสไลด์ 1',
    sort: 1,
    status: 'active',
    createdAt: '2021-09-01',
    image: 'https://www.shadcn-vue.com/placeholder.svg'
  },
  {
    id: 2,
    name: 'ภาพสไลด์ 2',
    sort: 2,
    status: 'draft',
    createdAt: '2021-09-02',
    image: 'https://www.shadcn-vue.com/placeholder.svg'
  },
  {
    id: 3,
    name: 'ภาพสไลด์ 3',
    sort: 3,
    status: 'archived',
    createdAt: '2021-09-03',
    image: 'https://www.shadcn-vue.com/placeholder.svg'
  },
  {
    id: 4,
    name: 'ภาพสไลด์ 4',
    sort: 4,
    status: 'active',
    createdAt: '2021-09-04',
    image: 'https://www.shadcn-vue.com/placeholder.svg'
  },
  {
    id: 5,
    name: 'ภาพสไลด์ 5',
    sort: 5,
    status: 'draft',
    createdAt: '2021-09-05',
    image: 'https://www.shadcn-vue.com/placeholder.svg'
  },
  {
    id: 6,
    name: 'ภาพสไลด์ 6',
    sort: 6,
    status: 'archived',
    createdAt: '2021-09-06',
    image: 'https://www.shadcn-vue.com/placeholder.svg'
  }
])

const search = ref('')
const filter = ref('')
const fileters = [
  { status: 'active', label: 'เปิดใช้งาน' },
  { status: 'draft', label: 'ฉบับร่าง' },
  { status: 'archived', label: 'จัดเก็บ' }
]

const pagination = reactive({
  page: 1,
  limit: 6,
  total: 100
})
const disabledSearch = computed(() => search.value.length < 1)
const handleSearch = () => {
  console.log(search.value)
}
const handleFilter = (status: string) => {
  console.log(status)
  filter.value = status
}
const handlePageChange = (page: number) => {
  console.log(page)
  pagination.page = page
}
</script>

<template>
  <div class="flex items-center">
    <div class="flex w-full max-w-sm items-center gap-1.5">
      <div class="relative">
        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="search"
          type="search"
          placeholder="ค้นหาภาพสไลด์"
          class="w-full appearance-none bg-background pl-8 shadow-none"
        />
      </div>
      <Button :disabled="disabledSearch" @click="handleSearch"> ค้นหา </Button>
    </div>
    <div class="ml-auto flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="sm" class="h-7 gap-1">
            <ListFilter class="h-3.5 w-3.5" />
            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> กรอง </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>สถานะ</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <template v-for="item in fileters" :key="item.status">
            <DropdownMenuItem :checked="item.status === filter" @click="handleFilter(item.status)">
              {{ item.label }}
            </DropdownMenuItem>
          </template>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button size="sm" variant="outline" class="h-7 gap-1" disabled>
        <File class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> ส่งออก </span>
      </Button>
      <router-link to="/carousel/create">
        <Button size="sm" class="h-7 gap-1">
          <PlusCircle class="h-3.5 w-3.5" />
          <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> เพิ่มภาพสไลด์ </span>
        </Button>
      </router-link>
    </div>
  </div>
  <Card>
    <CardHeader>
      <CardTitle>รายการภาพสไลด์</CardTitle>
      <CardDescription> จัดการผลิตภัณฑ์ของคุณและดูประสิทธิภาพการขาย </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <template v-for="column in colums" :key="column.key">
              <TableHead :class="column.class" class="font-medium">
                <span :class="{ 'sr-only': column.hidden }"> {{ column.label }} </span>
              </TableHead>
            </template>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="carousel in carousels" :key="carousel.id">
            <TableCell class="hidden sm:table-cell">
              <img
                :src="carousel.image"
                :alt="carousel.name"
                class="aspect-square rounded-md object-cover"
                height="64"
                width="64"
              />
            </TableCell>
            <TableCell class="font-medium">
              {{ carousel.name }}
            </TableCell>
            <TableCell>
              {{ carousel.sort }}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {{ carousel.status }}
              </Badge>
            </TableCell>
            <TableCell class="hidden md:table-cell">
              {{ carousel.createdAt }}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal class="h-4 w-4" />
                    <span class="sr-only">เปิดเมนู</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>การกระทำ</DropdownMenuLabel>
                  <DropdownMenuItem as-child class="cursor-pointer">
                    <router-link :to="{ name: 'carousel-edit', params: { id: carousel.id } }">
                      แก้ไข
                    </router-link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>ลบ</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  <div class="flex justify-end items-center">
    <CPagination :pagination="pagination" @update:page="handlePageChange" />
  </div>
</template>
