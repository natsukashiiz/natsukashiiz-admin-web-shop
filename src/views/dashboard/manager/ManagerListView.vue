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
import { queryManagerList } from '@/api/manager'
import type { ManagerResponse } from '@/types/api'
import type { TableColumn, Pagination, TableSearch, TableSearchBy } from '@/types'
import { onMounted } from 'vue'
import { watch } from 'vue'
import { CommonStatus } from '@/types/enum'
import CCommonStatus from '@/components/CCommonStatus.vue'

const columns: TableColumn[] = [
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
    label: 'บทบาท',
    class: 'hidden md:table-cell'
  },
  {
    key: 'status',
    label: 'สถานะ',
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
const searchBy: TableSearchBy[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'number'
  },
  {
    key: 'username',
    label: 'ชื่อผู้ใช้',
    type: 'search'
  },
  {
    key: 'status',
    label: 'สถานะ',
    type: 'select',
    options: [
      { label: 'ทั้งหมด', value: 'none' },
      { label: 'เปิดใช้งาน', value: CommonStatus.active },
      { label: 'ปิดใช้งาน', value: CommonStatus.inactive },
      { label: 'ถูกลบ', value: CommonStatus.deleted }
    ]
  }
]

const search = reactive<TableSearch>({
  query: CommonStatus.active,
  by: searchBy[2]
})
const managers = ref<ManagerResponse[]>([])
const pagination = reactive<Pagination>({
  page: 1,
  size: 10,
  total: 0
})

const loadManagerList = async () => {
  try {
    const res = await queryManagerList({
      page: pagination.page,
      size: pagination.size,
      id: search.by.key === 'id' && search.query ? Number(search.query) : undefined,
      username: search.by.key === 'username' && search.query ? search.query.trim() : undefined,
      status:
        search.by.key === 'status' && search.query
          ? CommonStatus[search.query as keyof typeof CommonStatus]
          : undefined
    })
    if (res.status === 200 && res.data) {
      managers.value = res.data.list
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
    title="รายชื่อผู้จัดการ"
    :columns="columns"
    :items="managers"
    :pagination="pagination"
    @update:page="handlePageChange"
    :search-by="searchBy"
    :search="search"
    @update:search-query="($event) => (search.query = $event)"
    @update:search-by="($event) => (search.by = $event)"
  >
    <template #status="{ item }">
      <CCommonStatus :status="item.status" />
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
                    <router-link :to="{ name: 'manager-edit', params: { id: manager.id } }">
                      แก้ไข
                    </router-link>
                  </DropdownMenuItem> -->
          <DropdownMenuItem disabled>ลบ</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </CTable>
</template>
