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
import { queryCarouselList } from '@/api/carousel'
import type { CarouselResponse } from '@/types/api'
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
    key: 'imageUrl',
    label: 'รูปภาพ'
  },
  {
    key: 'title',
    label: 'หัวข้อ'
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
    key: 'title',
    label: 'หัวข้อ',
    type: 'text'
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
const carousels = ref<CarouselResponse[]>([])
const pagination = reactive<Pagination>({
  page: 1,
  size: 10,
  total: 0
})

const loadCarouselList = async () => {
  try {
    const res = await queryCarouselList({
      page: pagination.page,
      size: pagination.size,
      id: search.by.key === 'id' && search.query ? Number(search.query) : undefined,
      title: search.by.key === 'title' && search.query ? String(search.query) : undefined,
      status:
        search.by.key === 'status' && search.query
          ? CommonStatus[search.query as keyof typeof CommonStatus]
          : undefined
    })
    if (res.status === 200 && res.data) {
      carousels.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error(error)
  }
}

const handlePageChange = async (page: number) => {
  pagination.page = page
  await loadCarouselList()
}

watch(search, async () => {
  pagination.page = 1
  await loadCarouselList()
})

onMounted(async () => {
  await loadCarouselList()
})
</script>

<template>
  <CTable
    title="รายชื่อภาพสไลด์"
    :columns="columns"
    :items="carousels"
    :pagination="pagination"
    @update:page="handlePageChange"
    :search-by="searchBy"
    :search="search"
    @update:search-query="($event) => (search.query = $event)"
    @update:search-by="($event) => (search.by = $event)"
  >
    <template #imageUrl="{ item }">
      <img
        :src="item.imageUrl"
        :alt="item.title"
        class="rounded-md object-cover"
        height="50"
        width="150"
      />
    </template>
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
                    <router-link :to="{ name: 'carousel-edit', params: { id: carousel.id } }">
                      แก้ไข
                    </router-link>
                  </DropdownMenuItem> -->
          <DropdownMenuItem disabled>ลบ</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </CTable>
</template>
