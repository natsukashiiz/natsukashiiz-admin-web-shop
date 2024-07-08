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

interface FormAddCarousel {
  name: string
  sort: number
  image: string | null
  status: string | null
}

const status = ref([
  { key: 'DRAFT', value: 'ฉบับร่าง' },
  { key: 'PUBLISHED', value: 'เผยแพร่' },
  { key: 'ARCHIVED', value: 'จัดเก็บ' }
])
const formAddCarousel = reactive<FormAddCarousel>({
  name: '',
  sort: 0,
  image: null,
  status: null
})
const image = ref<string | null>(null)

const handleCancel = () => {
  console.log('Cancel')
  if (confirm('Are you sure you want to cancel?')) {
    formAddCarousel.name = ''
    formAddCarousel.sort = 0
    formAddCarousel.image = null
    formAddCarousel.status = null
  }
}
const handleSave = () => {
  console.log('Save')
  console.log(formAddCarousel)
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
    image.value = url
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
            <CardTitle>รายละเอียดภาพสไลด์</CardTitle>
            <CardDescription>
              รายละเอียดภาพสไลด์จะช่วยให้ลูกค้าเข้าใจภาพสไลด์ของคุณมากขึ้น
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="grid gap-3">
                <Label for="title">ชื่อ</Label>
                <Input type="text" class="w-full" v-model="formAddCarousel.name" />
              </div>
              <div class="grid gap-3">
                <Label for="sort">ลำดับ</Label>
                <Input type="number" class="w-full" v-model="formAddCarousel.sort" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="overflow-hidden">
          <CardHeader>
            <CardTitle>รูปภาพสไลด์</CardTitle>
            <CardDescription>
              รูปภาพสไลด์จะช่วยให้ลูกค้าเห็นภาพรวมของภาพสไลด์ของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              class="w-full max-w-[1920px] h-auto aspect-[16/9] mx-auto overflow-hidden relative"
            >
              <div v-if="image" class="flex flex-col items-center gap-2">
                <div class="relative">
                  <img :src="image" />
                  <div class="absolute top-1 right-1">
                    <TooltipProvider :delay-duration="0">
                      <Tooltip>
                        <TooltipTrigger>
                          <button class="rounded-full text-muted-foreground" @click="image = null">
                            <X class="h-6 w-6" />
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
              <TooltipProvider v-else :delay-duration="0">
                <Tooltip>
                  <TooltipTrigger
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <button @click="handleFileInput">
                      <Upload class="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
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
          </CardContent>
        </Card>
      </div>
      <div class="grid auto-rows-max items-start gap-4 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>สถานะภาพสไลด์</CardTitle>
            <CardDescription>
              ภาพสไลด์ที่เป็นฉบับร่างและจัดเก็บจะไม่แสดงในหน้าร้านของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6">
              <div class="grid gap-3">
                <Label for="status">สถานะ</Label>
                <Select v-model="formAddCarousel.status">
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
        <Card>
          <CardHeader>
            <CardTitle>เก็บภาพสไลด์ลงคลัง</CardTitle>
            <CardDescription> ภาพสไลด์ที่เก็บลงคลังจะไม่แสดงในหน้าร้านของคุณ </CardDescription>
          </CardHeader>
          <CardContent>
            <div />
            <Button size="sm" variant="secondary" @click="handleAchieve">
              เก็บภาพสไลด์ลงคลัง
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
