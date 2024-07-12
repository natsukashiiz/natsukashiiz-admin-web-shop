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
import { queryProductList } from '@/api/product'
import { queryCategoryNames } from '@/api/category'
import type { ProductResponse } from '@/types/api'
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
    key: 'images',
    label: 'รูปภาพ'
  },
  {
    key: 'name',
    label: 'ชื่อ'
  },
  {
    key: 'category',
    label: 'หมวดหมู่'
  },
  {
    key: 'options',
    label: 'ตัวเลือก (จำนวน) (ราคา)',
    class: 'hidden md:table-cell'
  },
  {
    key: 'views',
    label: 'เข้าชม',
    class: 'hidden md:table-cell'
  },
  {
    key: 'orders',
    label: 'สั่งซื้อ',
    class: 'hidden md:table-cell'
  },
  {
    key: 'rating',
    label: 'คะแนน',
    class: 'hidden md:table-cell'
  },
  {
    key: 'reviews',
    label: 'รีวิว',
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
const searchBy = ref<TableSearchBy[]>([
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
    key: 'category',
    label: 'หมวดหมู่',
    type: 'select',
    options: []
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
])

const search = reactive<TableSearch>({
  query: CommonStatus.active,
  by: searchBy.value[3]
})
const products = ref<ProductResponse[]>([])
const pagination = reactive<Pagination>({
  page: 1,
  size: 10,
  total: 0
})

const loadProductList = async () => {
  try {
    const res = await queryProductList({
      page: pagination.page,
      size: pagination.size,
      id: search.by.key === 'id' && search.query ? Number(search.query) : undefined,
      name: search.by.key === 'name' && search.query ? search.query : undefined,
      'category.id':
        search.by.key === 'category' && search.query ? Number(search.query) : undefined,
      status:
        search.by.key === 'status' && search.query
          ? CommonStatus[search.query as keyof typeof CommonStatus]
          : undefined
    })
    if (res.status === 200 && res.data) {
      products.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error(error)
  }
}
const loadCategoryNames = async () => {
  try {
    const res = await queryCategoryNames()
    if (res.status === 200 && res.data) {
      searchBy.value[2].options = res.data.map((category) => ({
        label: category.name,
        value: String(category.id)
      }))
    }
  } catch (error) {
    console.error(error)
  }
}

const handlePageChange = async (page: number) => {
  pagination.page = page
  await loadProductList()
}

watch(search, async (oldValue, newValue) => {
  pagination.page = 1
  if (oldValue.by !== newValue.by) {
    search.query = undefined
  }
  await loadProductList()
})

onMounted(() => {
  Promise.all([loadProductList(), loadCategoryNames()])
})
</script>

<template>
  <CTable
    title="รายชื่อสินค้า"
    :columns="columns"
    :items="products"
    :pagination="pagination"
    @update:page="handlePageChange"
    :search-by="searchBy"
    :search="search"
    @update:search-query="($event) => (search.query = $event)"
    @update:search-by="($event) => (search.by = $event)"
  >
    <template #images="{ item }">
      <img
        :src="item.images[0].url"
        :alt="item.name"
        class="aspect-square rounded-md object-cover"
        height="64"
        width="64"
      />
    </template>
    <template #category="{ item }">
      <span>{{ item.category.name }}</span>
    </template>
    <template #options="{ item }">
      <li v-for="option in item.options" :key="option.id">
        <span>{{ option.name }} ({{ option.quantity }}) ({{ option.price }})</span>
      </li>
    </template>
    <template #rating="{ item }">
      <span>{{ item.rating.toFixed(2) }}</span>
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
            <router-link :to="{ name: 'product-edit', params: { id: item.id } }">
              แก้ไข
            </router-link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>ลบ</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </CTable>
</template>
