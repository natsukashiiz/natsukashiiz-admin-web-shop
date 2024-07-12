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
import { queryCategoryList } from '@/api/category'
import type { CategoryResponse } from '@/types/api'
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
    key: 'thumbnail',
    label: 'รูปภาพ'
  },
  {
    key: 'name',
    label: 'ชื่อ'
  },
  {
    key: 'sort',
    label: 'ลำดับ',
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
    key: 'name',
    label: 'ชื่อ',
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
const categorys = ref<CategoryResponse[]>([])
const pagination = reactive<Pagination>({
  page: 1,
  size: 10,
  total: 0
})

const loadCategoryList = async () => {
  try {
    const res = await queryCategoryList({
      page: pagination.page,
      size: pagination.size,
      id: search.by.key === 'id' && search.query ? Number(search.query) : undefined,
      name: search.by.key === 'name' && search.query ? search.query.trim() : undefined,
      status:
        search.by.key === 'status' && search.query
          ? CommonStatus[search.query as keyof typeof CommonStatus]
          : undefined
    })
    if (res.status === 200 && res.data) {
      categorys.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error(error)
  }
}

const handlePageChange = async (page: number) => {
  pagination.page = page
  await loadCategoryList()
}

watch(search, async () => {
  pagination.page = 1
  await loadCategoryList()
})

onMounted(async () => {
  await loadCategoryList()
})
</script>

<template>
  <CTable
    title="รายชื่อหมวดหมู่"
    :columns="columns"
    :items="categorys"
    :pagination="pagination"
    @update:page="handlePageChange"
    :search-by="searchBy"
    :search="search"
    @update:search-query="($event) => (search.query = $event)"
    @update:search-by="($event) => (search.by = $event)"
  >
    <template #thumbnail="{ item }">
      <img
        :src="item.thumbnail"
        :alt="item.name"
        class="aspect-square rounded-md object-cover"
        height="64"
        width="64"
      />
    </template>
    <template #status="{ item }">
      <CCommonStatus :status="item.status" />
    </template>
    <template #actions="{ item }">
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
            <router-link :to="{ name: 'category-edit', params: { id: item.id } }">
              แก้ไข
            </router-link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>ลบ</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </CTable>
</template>
