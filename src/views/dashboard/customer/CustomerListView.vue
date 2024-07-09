<script setup lang="ts">
import { File, ListFilter, Search, MoreHorizontal } from 'lucide-vue-next'
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
import { reactive, ref } from 'vue'
import { computed } from 'vue'
import CTable from '@/components/CTable.vue'
import { queryCustomerList } from '@/api/customer'
import type { CustomerResponse } from '@/types/api'
import type { TableColumn, Pagination } from '@/types'
import { onMounted } from 'vue'

const columns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID'
  },
  {
    key: 'email',
    label: 'อีเมล'
  },
  {
    key: 'username',
    label: 'ชื่อผู้ใช้'
  },
  {
    key: 'verified',
    label: 'ยืนยันตัวตน',
    class: 'hidden md:table-cell'
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

const search = ref<string>()
const filter = ref<boolean>()
const fileters = [
  { verify: undefined, label: 'ทั้งหมด' },
  { verify: true, label: 'ยืนยันแล้ว' },
  { verify: false, label: 'ยังไม่ยืนยัน' }
]
const customers = ref<CustomerResponse[]>([])
const pagination = reactive<Pagination>({
  page: 1,
  size: 10,
  total: 0
})

const loadManagerList = async () => {
  try {
    const res = await queryCustomerList({
      page: pagination.page,
      size: pagination.size,
      email: search.value,
      verified: filter.value
    })
    if (res.status === 200 && res.data) {
      customers.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error(error)
  }
}

const disabledSearch = computed(() => !search.value)
const handleSearch = async () => {
  await loadManagerList()
}
const handleFilter = async (status?: boolean) => {
  filter.value = status
  await loadManagerList()
}
const handlePageChange = async (page: number) => {
  pagination.page = page
  await loadManagerList()
}
onMounted(async () => {
  await loadManagerList()
})
</script>

<template>
  <div class="flex items-center">
    <div class="flex w-full max-w-sm items-center gap-1.5">
      <div class="relative">
        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="search"
          type="search"
          placeholder="ค้นหาลูกค้า"
          class="w-full appearance-none bg-background pl-8 shadow-none"
        />
      </div>
      <Button :disabled="disabledSearch" @click="handleSearch"> ค้นหา </Button>
      <Button
        variant="outline"
        @click="
          () => {
            search = undefined
            loadManagerList()
          }
        "
        :disabled="disabledSearch"
      >
        ล้าง
      </Button>
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
          <DropdownMenuLabel>ยืนยันตัวตน</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup v-model="filter">
            <template v-for="item in fileters" :key="item.verify">
              <DropdownMenuRadioItem :value="item.verify">
                {{ item.label }}
              </DropdownMenuRadioItem>
            </template>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
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
  <CTable
    title="รายชื่อลูกค้า"
    :columns="columns"
    :items="customers"
    :pagination="pagination"
    @update:page="handlePageChange"
  >
    <template #verified="{ item }">
      {{ item.verified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน' }}
    </template>
    <template #actions>
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
          <DropdownMenuItem disabled>ลบ</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </CTable>
</template>
