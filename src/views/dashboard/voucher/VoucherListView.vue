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
import { queryVoucherList } from '@/api/voucher'
import type { VoucherResponse } from '@/types/api'
import type { TableColumn, Pagination, TableSearch, TableSearchOption } from '@/types'
import { onMounted } from 'vue'
import { watch } from 'vue'
import { DiscountType, CommonStatus } from '@/types/enum'
import Badge from '@/components/ui/badge/Badge.vue'
import CCommonStatus from '@/components/CCommonStatus.vue'

const columns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID'
  },
  {
    key: 'thumbnail',
    label: 'รูปภาพ',
    class: 'hidden md:table-cell'
  },
  {
    key: 'code',
    label: 'โค้ด'
  },
  {
    key: 'discountType',
    label: 'ประเภท'
  },
  {
    key: 'discount',
    label: 'ส่วนลด'
  },
  {
    key: 'minOrderPrice',
    label: 'ขั้นต่ำ',
    class: 'hidden md:table-cell'
  },
  {
    key: 'maxDiscount',
    label: 'ลดสูงสุด',
    class: 'hidden md:table-cell'
  },
  {
    key: 'quantity',
    label: 'จำนวน',
    class: 'hidden md:table-cell'
  },
  {
    key: 'status',
    label: 'สถานะ',
    class: 'hidden md:table-cell'
  },
  {
    key: 'beginAt',
    label: 'วันที่เริ่ม',
    class: 'hidden md:table-cell'
  },
  {
    key: 'expiredAt',
    label: 'วันที่หมดอายุ',
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
    hidden: true,
    class: 'hidden md:table-cell'
  }
]
const searchBy: TableSearchOption[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'number'
  },
  {
    key: 'code',
    label: 'โค้ด',
    type: 'text'
  },
  {
    key: 'discountType',
    label: 'ประเภทส่วนลด',
    type: 'select',
    options: [
      { label: 'ทั้งหมด', value: 'none' },
      { label: 'เปอร์เซ็นต์', value: DiscountType.percent },
      { label: 'บาท', value: DiscountType.amount }
    ]
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
  by: searchBy[3]
})
const vouchers = ref<VoucherResponse[]>([])
const pagination = reactive<Pagination>({
  page: 1,
  size: 10,
  total: 0
})

const loadVoucherList = async () => {
  try {
    const res = await queryVoucherList({
      page: pagination.page,
      size: pagination.size,
      id: search.by.key === 'id' && search.query ? Number(search.query) : undefined,
      code: search.by.key === 'code' && search.query ? String(search.query) : undefined,
      discountType:
        search.by.key === 'discountType' && search.query
          ? DiscountType[search.query as keyof typeof DiscountType]
          : undefined,
      status:
        search.by.key === 'status' && search.query
          ? CommonStatus[search.query as keyof typeof CommonStatus]
          : undefined
    })
    if (res.status === 200 && res.data) {
      vouchers.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error(error)
  }
}

const handlePageChange = async (page: number) => {
  pagination.page = page
  await loadVoucherList()
}

watch(search, async () => {
  pagination.page = 1
  await loadVoucherList()
})

onMounted(async () => {
  await loadVoucherList()
})
</script>

<template>
  <CTable
    title="รายชื่อคูปอง"
    :columns="columns"
    :items="vouchers"
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
        height="78"
        width="78"
      />
    </template>
    <template #discountType="{ item }">
      <Badge v-if="item.discountType === DiscountType.percent" variant="secondary">
        เปอร์เซ็นต์
      </Badge>
      <Badge v-else-if="item.discountType === DiscountType.amount" variant="secondary">บาท</Badge>
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
            <router-link :to="{ name: 'voucher-edit', params: { id: item.id } }">
              แก้ไข
            </router-link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>ลบ</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </CTable>
</template>
