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
    key: 'id',
    label: 'ID'
  },
  {
    key: 'username',
    label: 'ชื่อผู้ใช้'
  },
  {
    key: 'role',
    label: 'บทบาท'
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

const managers = [
  {
    id: 1,
    username: 'admin1',
    role: 'admin',
    status: 'active',
    createdAt: '2021-09-01'
  },
  {
    id: 2,
    username: 'user2',
    role: 'user',
    status: 'active',
    createdAt: '2021-10-01'
  },
  {
    id: 3,
    username: 'user3',
    role: 'user',
    status: 'active',
    createdAt: '2021-11-01'
  },
  {
    id: 4,
    username: 'admin2',
    role: 'admin',
    status: 'active',
    createdAt: '2021-12-01'
  },
  {
    id: 5,
    username: 'user4',
    role: 'user',
    status: 'active',
    createdAt: '2022-01-01'
  },
  {
    id: 6,
    username: 'user5',
    role: 'user',
    status: 'active',
    createdAt: '2022-02-01'
  }
]
const search = ref('')
const filter = ref('')
const fileters = [
  { status: 'active', label: 'เปิดใช้งาน' },
  { status: 'inactive', label: 'ปิดใช้งาน' },
  { status: 'deleted', label: 'ลบ' }
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
          placeholder="ค้นหาผู้จัดการ"
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
      <router-link to="/managers/create">
        <Button size="sm" class="h-7 gap-1">
          <PlusCircle class="h-3.5 w-3.5" />
          <span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> เพิ่มผู้จัดการ </span>
        </Button>
      </router-link>
    </div>
  </div>
  <Card>
    <CardHeader>
      <CardTitle>รายการผู้จัดการ</CardTitle>
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
          <TableRow v-for="customer in managers" :key="customer.id">
            <TableCell class="font-medium">
              {{ customer.id }}
            </TableCell>
            <TableCell>
              {{ customer.username }}
            </TableCell>
            <TableCell>
              {{ customer.role }}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {{ customer.status }}
              </Badge>
            </TableCell>
            <TableCell class="hidden md:table-cell">
              {{ customer.createdAt }}
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
                  <!-- <DropdownMenuItem as-child class="cursor-pointer">
                    <router-link :to="{ name: 'customer-edit', params: { id: customer.id } }">
                      แก้ไข
                    </router-link>
                  </DropdownMenuItem> -->
                  <DropdownMenuItem disabled>แก้ไข</DropdownMenuItem>
                  <DropdownMenuItem disabled>ลบ</DropdownMenuItem>
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
