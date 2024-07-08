<script setup lang="ts">
import { PlusCircle, Upload, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ref } from 'vue'
import { reactive } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface FormAddProduct {
  name: string
  description: string
  images: { url: string; sort: number }[]
  options: { name: string; quantity: number; price: number }[]
  category: string | null
  status: string | null
}

const categories = ref([
  { id: 1, name: 'Clothing' },
  { id: 2, name: 'Electronics' },
  { id: 3, name: 'Accessories' }
])
const status = ref([
  { key: 'DRAFT', value: 'ฉบับร่าง' },
  { key: 'PUBLISHED', value: 'เผยแพร่' },
  { key: 'ARCHIVED', value: 'จัดเก็บ' }
])
const formAddProduct = reactive<FormAddProduct>({
  name: '',
  description: '',
  images: [],
  options: [{ name: '', quantity: 0, price: 0 }],
  category: null,
  status: null
})
const images = ref<{ url: string; sort: number }[]>([])

const handleAddOptionInput = () => {
  formAddProduct.options.push({ name: '', quantity: 0, price: 0 })
}
const handleCancel = () => {
  console.log('Cancel')
  if (confirm('Are you sure you want to cancel?')) {
    formAddProduct.name = ''
    formAddProduct.description = ''
    formAddProduct.options = [{ name: '', quantity: 0, price: 0 }]
    formAddProduct.category = null
    formAddProduct.status = null
  }
}
const handleSave = () => {
  console.log('Save')
  console.log(formAddProduct)
}
const handleAchieve = () => {
  console.log('Achieve')
}
const fileInputRef = ref<HTMLInputElement | null>(null)
const handleFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const url = URL.createObjectURL(file)
    const maxSort = images.value.reduce((max, image) => (image.sort > max ? image.sort : max), 0)
    images.value.push({ url, sort: maxSort + 1 })
  }
}
</script>

<template>
  <div class="mx-auto grid max-w-5xl flex-1 auto-rows-max gap-4">
    <div class="flex items-center gap-4">
      <div class="hidden items-center gap-2 md:ml-auto md:flex">
        <Button variant="outline" size="sm" @click="handleCancel"> ยกเลิก </Button>
        <Button size="sm" @click="handleSave"> บันทึก </Button>
      </div>
    </div>
    <div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
      <div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>รายละเอียดสินค้า</CardTitle>
            <CardDescription>
              รายละเอียดสินค้าจะช่วยให้ลูกค้าเข้าใจสินค้าของคุณมากขึ้น
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6">
              <div class="grid gap-3">
                <Label for="name">ชื่อ</Label>
                <Input type="text" class="w-full" v-model="formAddProduct.name" />
              </div>
              <div class="grid gap-3">
                <Label for="description">รายละเอียด</Label>
                <Textarea class="min-h-32" v-model="formAddProduct.description" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle> สต็อกสินค้า </CardTitle>
            <CardDescription>
              สต็อกสินค้าจะช่วยให้คุณตรวจสอบสินค้าที่มีอยู่ในคลังของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อ</TableHead>
                  <TableHead class="w-[80px] md:w-[150px]">จำนวน</TableHead>
                  <TableHead class="w-[80px] md:w-[150px]">ราคา</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(option, index) in formAddProduct.options" :key="index">
                  <TableCell>
                    <Input type="text" v-model="option.name" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" v-model="option.quantity" :min="0" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" v-model="option.price" :min="0" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter class="justify-center border-t p-4">
            <Button size="sm" variant="ghost" class="gap-1" @click="handleAddOptionInput">
              <PlusCircle class="h-3.5 w-3.5" />
              เพิ่ม
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>หมวดหมู่สินค้า</CardTitle>
            <CardDescription>
              หมวดหมู่สินค้าจะช่วยให้ลูกค้าหาสินค้าของคุณได้ง่ายขึ้น
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6 sm:grid-cols-3">
              <div class="grid gap-3">
                <Label for="category">หมวดหมู่</Label>
                <Select v-model="formAddProduct.category">
                  <SelectTrigger aria-label="เลือกหมวดหมู่">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <template v-for="category in categories" :key="category.id">
                      <SelectItem :value="String(category.id)">
                        {{ category.name }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div class="grid auto-rows-max items-start gap-4 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>สถานะสินค้า</CardTitle>
            <CardDescription>
              สินค้าที่เป็นฉบับร่างและจัดเก็บจะไม่แสดงในหน้าร้านของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6">
              <div class="grid gap-3">
                <Label for="status">สถานะ</Label>
                <Select v-model="formAddProduct.status">
                  <SelectTrigger aria-label="เลือกสถานะ">
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <template v-for="item in status" :key="item.key">
                      <SelectItem :value="item.key">
                        {{ item.value }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="overflow-hidden">
          <CardHeader>
            <CardTitle>รูปสินค้า</CardTitle>
            <CardDescription>
              รูปภาพสินค้าจะช่วยให้ลูกค้าเห็นภาพรวมของสินค้าของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-2">
              <div class="grid grid-cols-2 gap-2">
                <template v-for="(image, index) in images" :key="index">
                  <div class="flex flex-col items-center gap-2">
                    <div class="relative w-[84] h-[84]">
                      <img :src="image.url" class="aspect-square w-full rounded-md object-cover" />
                      <div class="absolute top-1 right-1">
                        <TooltipProvider :delay-duration="0">
                          <Tooltip>
                            <TooltipTrigger>
                              <button
                                class="rounded-full text-muted-foreground"
                                @click="images.splice(index, 1)"
                              >
                                <X class="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>ลบรูปภาพ</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <Input
                      type="number"
                      class="text-center"
                      placeholder="ลำดับ"
                      v-model="image.sort"
                      @change="images.sort((a, b) => a.sort - b.sort)"
                    />
                  </div>
                </template>
                <TooltipProvider v-if="images.length < 6" :delay-duration="0">
                  <Tooltip>
                    <TooltipTrigger>
                      <button
                        class="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                        @click="handleFileInput"
                      >
                        <Upload class="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>อัปโหลดรูปภาพ</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  style="display: none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>เก็บสินค้าลงคลัง</CardTitle>
            <CardDescription> สินค้าที่เก็บลงคลังจะไม่แสดงในหน้าร้านของคุณ </CardDescription>
          </CardHeader>
          <CardContent>
            <div />
            <Button size="sm" variant="secondary" @click="handleAchieve"> เก็บสินค้าลงคลัง </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    <div class="flex items-center justify-center gap-2 md:hidden">
      <Button variant="outline" size="sm" @click="handleCancel"> ยกเลิก </Button>
      <Button size="sm" @click="handleSave"> บันทึก </Button>
    </div>
  </div>
</template>
