<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { reactive, ref } from 'vue'
import CTable from '@/components/CTable.vue'
import { queryCustomerList } from '@/api/customer'
import type { CustomerResponse } from '@/types/api'
import type { TableColumn, Pagination, TableSearch, TableSearchOption } from '@/types'
import { onMounted } from 'vue'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-icons/vue'
import { watch } from 'vue'

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
    label: 'วันที่ลงทะเบียน',
    class: 'hidden md:table-cell'
  },
  {
    key: 'actions',
    label: 'การกระทำ',
    hidden: true
  }
]
const searchBy: TableSearchOption[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'email', label: 'อีเมล', type: 'email' },
  { key: 'username', label: 'ชื่อผู้ใช้', type: 'search' }
]

const search = reactive<TableSearch>({
  query: undefined,
  by: searchBy[1]
})
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
      id: search.by.key === 'id' && search.query ? Number(search.query) : undefined,
      email: search.by.key === 'email' && search.query ? search.query.trim() : undefined,
      username: search.by.key === 'username' && search.query ? search.query.trim() : undefined
    })
    if (res.status === 200 && res.data) {
      customers.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error(error)
  }
}

const handlePageChange = async (page: number) => {
  pagination.page = page
  await loadManagerList()
}

watch(search, async () => {
  pagination.page = 1
  await loadManagerList()
})

onMounted(async () => {
  await loadManagerList()
})
</script>

<template>
  <CTable
    title="รายชื่อลูกค้า"
    :columns="columns"
    :items="customers"
    :pagination="pagination"
    @update:page="handlePageChange"
    :search-by="searchBy"
    :search="search"
    @update:search-query="($event) => (search.query = $event)"
    @update:search-by="($event) => (search.by = $event)"
  >
    <template #verified="{ item }">
      <CheckCircledIcon v-if="item.verified" class="h-5 w-5 text-green-500" />
      <CrossCircledIcon v-else class="h-5 w-5 text-red-500" />
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
