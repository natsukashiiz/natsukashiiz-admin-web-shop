<script setup lang="ts">
import { Upload, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

interface FormAddCategory {
  name: string
  image: string | null
  status: string | null
}

const status = ref([
  { key: 'DRAFT', value: 'ฉบับร่าง' },
  { key: 'PUBLISHED', value: 'เผยแพร่' },
  { key: 'ARCHIVED', value: 'จัดเก็บ' }
])
const formAddCategory = reactive<FormAddCategory>({
  name: '',
  image: null,
  status: null
})
const images = ref<{ url: string }[]>([])

const handleCancel = () => {
  console.log('Cancel')
  if (confirm('Are you sure you want to cancel?')) {
    formAddCategory.name = ''
    formAddCategory.status = null
  }
}
const handleSave = () => {
  console.log('Save')
  console.log(formAddCategory)
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
    images.value.push({ url })
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
            <CardTitle>รายละเอียดหมวดหมู่</CardTitle>
            <CardDescription>
              รายละเอียดหมวดหมู่จะช่วยให้ลูกค้าเข้าใจหมวดหมู่ของคุณมากขึ้น
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6">
              <div class="grid gap-3">
                <Label for="name">ชื่อ</Label>
                <Input type="text" class="w-full" v-model="formAddCategory.name" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>สถานะหมวดหมู่</CardTitle>
            <CardDescription>
              หมวดหมู่ที่เป็นฉบับร่างและจัดเก็บจะไม่แสดงในหน้าร้านของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6">
              <div class="grid gap-3">
                <Label for="status">สถานะ</Label>
                <Select v-model="formAddCategory.status">
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
      </div>
      <div class="grid auto-rows-max items-start gap-4 lg:gap-8">
        <Card class="overflow-hidden">
          <CardHeader>
            <CardTitle>รูปหมวดหมู่</CardTitle>
            <CardDescription>
              รูปภาพหมวดหมู่จะช่วยให้ลูกค้าเห็นภาพรวมของหมวดหมู่ของคุณ
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
                  </div>
                </template>
                <TooltipProvider v-if="images.length < 1" :delay-duration="0">
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
            <CardTitle>เก็บหมวดหมู่ลงคลัง</CardTitle>
            <CardDescription> หมวดหมู่ที่เก็บลงคลังจะไม่แสดงในหน้าร้านของคุณ </CardDescription>
          </CardHeader>
          <CardContent>
            <div />
            <Button size="sm" variant="secondary" @click="handleAchieve">
              เก็บหมวดหมู่ลงคลัง
            </Button>
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
