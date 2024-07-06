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
    key: 'name',
    label: 'ชื่อ'
  },
  {
    key: 'status',
    label: 'สถานะ'
  },
  {
    key: 'price',
    label: 'ราคา',
    class: 'hidden md:table-cell'
  },
  {
    key: 'sales',
    label: 'ยอดขายรวม',
    class: 'hidden md:table-cell'
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

const products = [
  {
    id: 1,
    image: 'https://www.shadcn-vue.com/placeholder.svg',
    name: 'เครื่องทำน้ำมะนาวเลเซอร์',
    status: 'ฉบับร่าง',
    price: '$499.99',
    sales: 25,
    created_at: '2023-07-12 10:42 AM'
  },
  {
    id: 2,
    image: 'https://www.shadcn-vue.com/placeholder.svg',
    name: 'Hypernova Headphones',
    status: 'เปิดใช้งาน',
    price: '$129.99',
    sales: 100,
    created_at: '2023-10-18 03:21 PM'
  },
  {
    id: 3,
    image: 'https://www.shadcn-vue.com/placeholder.svg',
    name: 'AeroGlow Desk Lamp',
    status: 'เปิดใช้งาน',
    price: '$39.99',
    sales: 50,
    created_at: '2023-11-29 08:15 AM'
  },
  {
    id: 4,
    image: 'https://www.shadcn-vue.com/placeholder.svg',
    name: 'TechTonic Energy Drink',
    status: 'ฉบับร่าง',
    price: '$2.99',
    sales: 0,
    created_at: '2023-12-25 11:59 PM'
  },
  {
    id: 5,
    image: 'https://www.shadcn-vue.com/placeholder.svg',
    name: 'Gamer Gear Pro Controller',
    status: 'เปิดใช้งาน',
    price: '$59.99',
    sales: 75,
    created_at: '2024-01-01 12:00 AM'
  },
  {
    id: 6,
    image: 'https://www.shadcn-vue.com/placeholder.svg',
    name: 'Luminous VR Headset',
    status: 'เปิดใช้งาน',
    price: '$199.99',
    sales: 30,
    created_at: '2024-02-14 02:14 PM'
  }
]
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
          placeholder="ค้นหาสินค้า"
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
      <router-link to="/products/create">
        <Button size="sm" class="h-7 gap-1">
          <PlusCircle class="h-3.5 w-3.5" />
          <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> เพิ่มสินค้า </span>
        </Button>
      </router-link>
    </div>
  </div>
  <Card>
    <CardHeader>
      <CardTitle>รายการสินค้า</CardTitle>
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
          <TableRow v-for="product in products" :key="product.id">
            <TableCell class="hidden sm:table-cell">
              <img
                :src="product.image"
                :alt="product.name"
                class="aspect-square rounded-md object-cover"
                height="64"
                width="64"
              />
            </TableCell>
            <TableCell class="font-medium">
              {{ product.name }}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {{ product.status }}
              </Badge>
            </TableCell>
            <TableCell class="hidden md:table-cell">
              {{ product.price }}
            </TableCell>
            <TableCell class="hidden md:table-cell">
              {{ product.sales }}
            </TableCell>
            <TableCell class="hidden md:table-cell">
              {{ product.created_at }}
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
                  <DropdownMenuItem>แก้ไข</DropdownMenuItem>
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
