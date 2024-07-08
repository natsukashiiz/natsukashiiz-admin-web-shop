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
    key: 'code',
    label: 'รหัส'
  },
  {
    key: 'discount',
    label: 'ส่วนลด'
  },
  {
    key: 'type',
    label: 'ประเภท'
  },
  {
    key: 'minOrderPrice',
    label: 'ยอดขั้นต่ำ'
  },
  {
    key: 'maxDiscount',
    label: 'ลดสูงสุด'
  },
  {
    key: 'quantity',
    label: 'จำนวน'
  },
  {
    key: 'beginAt',
    label: 'เริ่มต้น',
    class: 'hidden md:table-cell'
  },
  {
    key: 'endAt',
    label: 'สิ้นสุด',
    class: 'hidden md:table-cell'
  },
  {
    key: 'status',
    label: 'สถานะ'
  },
  {
    key: 'createdAt',
    label: 'วันที่สร้าง',
    class: 'hidden md:table-cell'
  },
  {
    key: 'actions',
    label: 'การกระทำ',
    hidden: true
  }
]

const vouchers = [
  {
    id: 1,
    code: '123456',
    discount: 10,
    type: 'percent',
    minOrderPrice: 1000,
    maxDiscount: 100,
    quantity: 100,
    beginAt: '2021-09-01',
    endAt: '2021-09-30',
    status: 'active',
    createdAt: '2021-09-01',
    image: 'https://www.shadcn-vue.com/placeholder.svg'
  },
  {
    id: 2,
    code: '654321',
    discount: 100,
    type: 'amount',
    minOrderPrice: 1000,
    maxDiscount: 100,
    quantity: 100,
    beginAt: '2021-09-01',
    endAt: '2021-09-30',
    status: 'expired',
    createdAt: '2021-09-01',
    image: 'https://www.shadcn-vue.com/placeholder.svg'
  },
  {
    id: 3,
    code: '654321',
    discount: 100,
    type: 'amount',
    minOrderPrice: 1000,
    maxDiscount: 100,
    quantity: 100,
    beginAt: '2021-09-01',
    endAt: '2021-09-30',
    status: 'expired',
    createdAt: '2021-09-01',
    image: 'https://www.shadcn-vue.com/placeholder.svg'
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
          placeholder="ค้นหาคูปอง"
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
      <router-link to="/voucher/create">
        <Button size="sm" class="h-7 gap-1">
          <PlusCircle class="h-3.5 w-3.5" />
          <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> เพิ่มคูปอง </span>
        </Button>
      </router-link>
    </div>
  </div>
  <Card>
    <CardHeader>
      <CardTitle>รายการคูปอง</CardTitle>
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
          <TableRow v-for="voucher in vouchers" :key="voucher.id">
            <TableCell class="hidden sm:table-cell">
              <img
                :src="voucher.image"
                :alt="voucher.code"
                class="aspect-square rounded-md object-cover"
                height="64"
                width="64"
              />
            </TableCell>
            <TableCell class="font-medium">
              {{ voucher.code }}
            </TableCell>
            <TableCell>
              <Badge :variant="voucher.type === 'percent' ? 'secondary' : 'secondary'">
                {{ voucher.discount }}{{ voucher.type === 'percent' ? '%' : '฿' }}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge :variant="voucher.type === 'active' ? 'default' : 'secondary'">
                {{ voucher.type === 'percent' ? 'เปอร์เซ็นต์' : 'จำนวนเงิน' }}
              </Badge>
            </TableCell>
            <TableCell>
              {{ voucher.minOrderPrice }}
            </TableCell>
            <TableCell>
              {{ voucher.maxDiscount }}
            </TableCell>
            <TableCell>
              {{ voucher.quantity }}
            </TableCell>
            <TableCell class="hidden md:table-cell">
              {{ voucher.beginAt }}
            </TableCell>
            <TableCell class="hidden md:table-cell">
              {{ voucher.endAt }}
            </TableCell>
            <TableCell>
              <Badge :variant="voucher.status === 'active' ? 'default' : 'secondary'">
                {{ voucher.status }}
              </Badge>
            </TableCell>
            <TableCell class="hidden md:table-cell">
              {{ voucher.createdAt }}
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
                    <router-link :to="{ name: 'voucher-edit', params: { id: voucher.id } }">
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
