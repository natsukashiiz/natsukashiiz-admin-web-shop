<script setup lang="ts">
import { Copy, CreditCard, Pencil, MoreVertical, Truck } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import CTable from '@/components/CTable.vue'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

import { onMounted, ref, reactive, watch } from 'vue'
import { queryOrderList, updateShipping, cancelOrder, queryOrderStatusCount } from '@/api/order'
import type { Pagination, TableColumn, TableSearchOption, TableSearch } from '@/types'
import type { OrderResponse } from '@/types/api'
import { OrderStatus } from '@/types/enum'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

const columns: TableColumn[] = [
  {
    key: 'customer',
    label: 'ลูกค้า'
  },
  {
    key: 'status',
    label: 'สถานะ'
  },
  {
    key: 'createdAt',
    label: 'วันที่สั่งซื้อ'
  },
  {
    key: 'actualPay',
    label: 'ยอดชำระ'
  },
  {
    key: 'actions',
    label: 'การกระทำ',
    hidden: true
  }
]
const searchBy = ref<TableSearchOption[]>([
  {
    key: 'id',
    label: 'ID',
    type: 'text'
  },
  {
    key: 'status',
    label: 'สถานะ',
    type: 'select',
    showCount: true,
    options: []
  }
])
const search = reactive<TableSearch>({
  query: 'all',
  by: searchBy.value[1]
})
const orders = ref<OrderResponse[]>([])
const statusCount = ref<{ [key: string]: number }>({})
const pagination = reactive<Pagination>({
  page: 1,
  size: 10,
  total: 0
})
const currentOrder = ref<OrderResponse | null>(null)
const trackingNumber = ref<string | undefined>()
const editEnabled = ref(false)

const loadOrderList = async () => {
  try {
    const res = await queryOrderList({
      page: pagination.page,
      size: pagination.size,
      status:
        search.by.key === 'status' && search.query
          ? OrderStatus[search.query as keyof typeof OrderStatus]
          : undefined
    })
    if (res.status === 200 && res.data) {
      orders.value = res.data.list
      pagination.total = res.data.total

      if (orders.value.length > 0) {
        currentOrder.value = orders.value[0]
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const handleUpdateShipping = async () => {
  if (!currentOrder.value || !trackingNumber.value) {
    toast({
      title: 'เกิดข้อผิดพลาด',
      description: 'กรุณากรอกเลขพัสดุ',
      variant: 'destructive'
    })
    return
  }

  try {
    const res = await updateShipping(currentOrder.value.id, {
      trackingNumber: trackingNumber.value
    })
    if (res.status === 200) {
      toast({
        title: 'อัปเดตเลขพัสดุสำเร็จ',
        description: 'เลขพัสดุของคุณได้รับการอัปเดตเรียบร้อยแล้ว'
      })
      trackingNumber.value = undefined
      editEnabled.value = false
      await loadOrderList()
    }
  } catch (error) {
    console.error(error)
  }
}

const handleEditShipping = () => {
  editEnabled.value = !editEnabled.value
  if (currentOrder.value?.trackingNumber) {
    trackingNumber.value = currentOrder.value.trackingNumber
  }
}

const handleCancelEditShipping = () => {
  editEnabled.value = false
  trackingNumber.value = undefined
}

const handlePageChange = async (page: number) => {
  pagination.page = page
  await loadOrderList()
}

const handleCancelOrder = async () => {
  if (!currentOrder.value) {
    toast({
      title: 'เกิดข้อผิดพลาด',
      description: 'ไม่พบคำสั่งซื้อที่ต้องการยกเลิก',
      variant: 'destructive'
    })
    return
  }
  try {
    const res = await cancelOrder(currentOrder.value.id)
    if (res.status === 200) {
      toast({
        title: 'ยกเลิกคำสั่งซื้อสำเร็จ',
        description: 'คำสั่งซื้อของคุณได้รับการยกเลิกเรียบร้อยแล้ว'
      })
      await loadOrderList()
    }
  } catch (error) {
    console.error(error)
  }
}

const loadStatusCount = async () => {
  try {
    const res = await queryOrderStatusCount()
    if (res.status === 200 && res.data) {
      statusCount.value = res.data

      searchBy.value[1].options = Object.keys(statusCount.value).map((key) => ({
        label: key,
        value: key,
        count: statusCount.value[key]
      }))
    }
  } catch (error) {
    console.error(error)
  }
}

watch(search, async (oldValue, newValue) => {
  pagination.page = 1
  if (oldValue.by !== newValue.by) {
    search.query = undefined
  }
  await loadOrderList()
})

watch(currentOrder, async (value) => {
  if (value) {
    editEnabled.value = false
    trackingNumber.value = undefined
  }
})

onMounted(async () => {
  await Promise.all([loadOrderList(), loadStatusCount()])
})
</script>

<template>
  <main
    class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3"
  >
    <div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card class="sm:col-span-2">
          <CardHeader class="pb-3">
            <CardTitle>คำสั่งซื้อของคุณ</CardTitle>
            <CardDescription class="max-w-lg text-balance leading-relaxed">
              แนะนำแดชบอร์ดคำสั่งซื้อของเราสำหรับการจัดการที่ราบรื่นและการวิเคราะห์ที่มีประสิทธิภาพ
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button disabled>สร้างคำสั่งซื้อใหม่</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>สัปดาห์นี้</CardDescription>
            <CardTitle class="text-4xl"> ฿1329 </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-xs text-muted-foreground">+25% จากสัปดาห์ที่แล้ว</div>
          </CardContent>
          <CardFooter>
            <Progress :model-value="25" aria-label="เพิ่มขึ้น 25%" />
          </CardFooter>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>เดือนนี้</CardDescription>
            <CardTitle class="text-3xl"> ฿5,329 </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-xs text-muted-foreground">+10% จากเดือนที่แล้ว</div>
          </CardContent>
          <CardFooter>
            <Progress :model-value="12" aria-label="เพิ่มขึ้น 12%" />
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardHeader class="px-7">
          <CardTitle>คำสั่งซื้อ</CardTitle>
          <CardDescription>คำสั่งซื้อล่าสุดจากร้านค้าของคุณ</CardDescription>
        </CardHeader>
        <CardContent>
          <CTable
            title="รายการคำสั่งซื้อ"
            :columns="columns"
            :items="orders"
            :pagination="pagination"
            @update:page="handlePageChange"
            :search-by="searchBy"
            :search="search"
            @update:search-query="($event) => (search.query = $event)"
            @update:search-by="($event) => (search.by = $event)"
          >
            <template #customer="{ item }">
              <div class="flex flex-col">
                <span class="font-semibold">{{ item.firstName }} {{ item.lastName }}</span>
                <span class="text-sm">{{ item.mobile }}</span>
              </div>
            </template>
            <template #actualPay="{ item }">
              <span>{{ item.actualPay.toFixed(2) }}</span>
            </template>
            <template #actions="{ item }">
              <Button
                @click="currentOrder = item"
                size="xs"
                :disabled="currentOrder?.id === item.id"
              >
                ดูรายละเอียด
              </Button>
            </template>
          </CTable>
        </CardContent>
      </Card>
    </div>
    <div v-if="currentOrder">
      <Card class="overflow-hidden">
        <CardHeader class="flex flex-row items-start bg-muted/50">
          <div class="grid gap-0.5">
            <CardTitle class="group flex items-center gap-2 text-lg">
              รหัสคำสั่งซื้อ: {{ currentOrder.id }}
              <Button
                size="icon"
                variant="outline"
                class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy class="h-3 w-3" />
                <span class="sr-only">คัดลอกรหัสคำสั่งซื้อ</span>
              </Button>
            </CardTitle>
            <CardDescription>วันที่: {{ currentOrder.createdAt }}</CardDescription>
          </div>
          <div class="ml-auto flex items-center gap-1">
            <Button size="sm" variant="outline" class="h-8 gap-1">
              <Truck class="h-3.5 w-3.5" />
              <span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap"> ติดตามคำสั่งซื้อ </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button size="icon" variant="outline" class="h-8 w-8">
                  <MoreVertical class="h-3.5 w-3.5" />
                  <span class="sr-only">เพิ่มเติม</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>แก้ไข</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent class="p-6 text-sm">
          <div class="grid gap-3">
            <div class="font-semibold">รายละเอียดคำสั่งซื้อ</div>
            <ul class="grid gap-3">
              <template v-for="item in currentOrder.items" :key="item.id">
                <li class="flex items-center justify-between">
                  <span class="text-muted-foreground">
                    {{ item.productName }} ({{ item.optionName }})
                    <span>x{{ item.quantity }}</span>
                  </span>
                  <span>{{ item.price.toFixed(2) }}</span>
                </li>
              </template>
            </ul>
            <Separator class="my-2" />
            <ul class="grid gap-3">
              <li class="flex items-center justify-between">
                <span class="text-muted-foreground">ยอดรวมย่อย</span>
                <span>{{ currentOrder.totalPay.toFixed(2) }}</span>
              </li>
              <li class="flex items-center justify-between">
                <span class="text-muted-foreground">ส่วนลด</span>
                <span v-if="currentOrder.totalDiscount"
                  >-{{ currentOrder.totalDiscount.toFixed(2) }}</span
                >
                <span v-else>0</span>
              </li>
              <li class="flex items-center justify-between">
                <span class="text-muted-foreground">ค่าจัดส่ง</span>
                <span>0</span>
              </li>
              <li class="flex items-center justify-between font-semibold">
                <span class="text-muted-foreground">ยอดรวม</span>
                <span>{{ currentOrder.actualPay.toFixed(2) }}</span>
              </li>
            </ul>
          </div>
          <Separator class="my-4" />
          <div class="space-y-2">
            <div class="font-semibold">ข้อมูลการจัดส่ง</div>
            <address class="grid gap-0.5 not-italic text-muted-foreground">
              <span>{{ currentOrder.firstName }} {{ currentOrder.lastName }}</span>
              <span>{{ currentOrder.address }}</span>
            </address>
          </div>
          <Separator class="my-4" />
          <div class="grid gap-3">
            <div class="font-semibold">ข้อมูลลูกค้า</div>
            <dl class="grid gap-3">
              <div class="flex items-center justify-between">
                <dt class="text-muted-foreground">ลูกค้า</dt>
                <dd>{{ currentOrder.firstName }} {{ currentOrder.lastName }}</dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-muted-foreground">โทรศัพท์</dt>
                <dd>
                  <a href="tel:">{{ currentOrder.mobile }}</a>
                </dd>
              </div>
            </dl>
          </div>
          <template v-if="currentOrder.payMethod">
            <Separator class="my-4" />
            <div class="grid gap-3">
              <div class="font-semibold">ข้อมูลการชำระเงิน</div>
              <dl class="grid gap-3">
                <div class="flex items-center justify-between">
                  <dt class="flex items-center gap-1 text-muted-foreground">
                    <CreditCard class="h-4 w-4" />
                    {{ currentOrder.payMethod }}
                  </dt>
                </div>
              </dl>
            </div>
          </template>
          <template
            v-if="
              currentOrder.status === OrderStatus.paid ||
              currentOrder.status === OrderStatus.shipping ||
              currentOrder.status === OrderStatus.successful
            "
          >
            <Separator class="my-4" />
            <div class="grid gap-3">
              <div class="font-semibold">เลขพัสดุ</div>
              <dl class="grid gap-3">
                <div class="flex items-center justify-between">
                  <dt class="flex items-center gap-1 text-muted-foreground">
                    <template v-if="!currentOrder.trackingNumber || editEnabled">
                      <Input v-model="trackingNumber" size="sm" placeholder="เลขพัสดุ" />
                      <Button size="sm" @click="handleUpdateShipping">บันทึก</Button>
                      <Button size="sm" variant="secondary" @click="handleCancelEditShipping">
                        ยกเลิก
                      </Button>
                    </template>
                    <template v-else>
                      <Truck class="h-4 w-4" />
                      <span>{{ currentOrder.trackingNumber }}</span>
                      <TooltipProvider :delay-duration="0">
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              size="icon"
                              variant="outline"
                              class="h-6 w-6"
                              @click="handleEditShipping"
                            >
                              <Pencil class="h-3 w-3" />
                              <span class="sr-only">แก้ไขเลขพัสดุ</span>
                            </Button></TooltipTrigger
                          >
                          <TooltipContent> แก้ไขเลขพัสดุ </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider :delay-duration="0">
                        <Tooltip>
                          <TooltipTrigger>
                            <Button size="icon" variant="outline" class="h-6 w-6">
                              <Copy class="h-3 w-3" />
                              <span class="sr-only">คัดลอกเลขพัสดุ</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent> คัดลอกเลขพัสดุ </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </template>
                  </dt>
                </div>
              </dl>
            </div>
          </template>
          <template
            v-if="
              currentOrder.status === OrderStatus.pending ||
              currentOrder.status === OrderStatus.paid
            "
          >
            <Separator class="my-4" />
            <div class="grid gap-3">
              <div class="font-semibold">ยกเลิกคำสั่งซื้อ</div>
              <Popover :collision-padding="{ top: 0 }">
                <PopoverTrigger>
                  <Button variant="destructive" class="w-full">ยกเลิกคำสั่งซื้อ</Button>
                </PopoverTrigger>
                <PopoverContent class="w-full">
                  <div class="flex items-center space-x-2">
                    <p class="text-sm">คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำสั่งซื้อนี้?</p>
                    <Button variant="outline" size="sm" @click="handleCancelOrder"> ยืนยัน </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </template>
        </CardContent>
        <CardFooter class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div class="text-xs text-muted-foreground">
            อัปเดตเมื่อ <time dateTime="2023-11-23">{{ currentOrder.updatedAt }}</time>
          </div>
        </CardFooter>
      </Card>
    </div>
  </main>
</template>
