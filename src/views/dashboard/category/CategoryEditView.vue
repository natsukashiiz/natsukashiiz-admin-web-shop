<script setup lang="ts">
import { Upload, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/components/ui/toast/use-toast'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { ref } from 'vue'
import type { CreateCategoryRequest } from '@/types/api'
import { CommonStatus } from '@/types/enum'
import { updateCategory, queryCategory } from '@/api/category'
import { uploadFile } from '@/api/file'
import { validateFileSize, validateFileType } from '@/utils/validations'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import router from '@/router'

const { toast } = useToast()
const route = useRoute()

const categoryId = Number(route.params.id)
const image = ref<string>()
const file = ref<File | null>(null)

const loadCategory = async () => {
  try {
    const res = await queryCategory(categoryId)
    if (res.status === 200) {
      const category = res.data
      setFieldValue('name', category.name)
      setFieldValue('sort', category.sort)
      setFieldValue('thumbnail', category.thumbnail)
      setFieldValue('status', category.status)
      image.value = category.thumbnail
    }
  } catch (error) {
    console.error(error)
    toast({
      description: 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้',
      duration: 3000,
      variant: 'destructive'
    })
  }
}
const { isFieldDirty, handleSubmit, resetForm, setFieldValue, setErrors } = useForm<
  Partial<CreateCategoryRequest>
>({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string({ message: 'กรุณากรอกชื่อหมวดหมู่' }),
      sort: z.number({ message: 'กรุณากรอกลำดับหมวดหมู่' }),
      thumbnail: z.string({ message: 'กรุณาอัปโหลดรูปภาพ' }),
      status: z.nativeEnum(CommonStatus)
    })
  )
})
const onSubmit = handleSubmit(async (form) => {
  if (file.value) {
    const url = await handleUploadFile()
    if (url) {
      form.thumbnail = url
    } else {
      setErrors({ thumbnail: 'ไม่สามารถอัปโหลดรูปภาพได้' })
      return
    }
  }
  try {
    const res = await updateCategory(categoryId, {
      name: form.name!,
      sort: form.sort!,
      thumbnail: form.thumbnail!,
      status: form.status!
    })
    if (res.status === 200) {
      toast({
        description: 'แก้ไขหมวดหมู่สำเร็จ',
        duration: 3000
      })
    }
  } catch (error: any) {
    if (error.response.status === 417) {
      const err = error.response.data.error
      if (err === 'category.exists.name') {
        setErrors({ name: 'ชื่อหมวดหมู่นี้มีอยู่แล้ว' })
      }
    }
  }
})
const clearForm = () => {
  image.value = undefined
  resetForm()
  router.push({ name: 'category-list' })
}
const fileInputRef = ref<HTMLInputElement | null>(null)
const handleFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const f = target.files?.[0]
  if (f) {
    if (validateFileType(f) === false) {
      toast({
        description: 'รูปภาพที่รองรับ: .jpeg, .png, .webp',
        duration: 3000,
        variant: 'destructive'
      })
      return
    }
    if (validateFileSize(f) === false) {
      toast({
        description: 'ขนาดไฟล์รูปภาพไม่เกิน 1MB',
        duration: 3000,
        variant: 'destructive'
      })
      return
    }

    const url = URL.createObjectURL(f)
    file.value = f
    image.value = url
    setFieldValue('thumbnail', url)
  }
}
const handleUploadFile = async () => {
  try {
    const formData = new FormData()
    formData.append('file', file.value as File)
    const res = await uploadFile(formData)
    if (res.status === 200) {
      file.value = null
      return res.data.url
    }
  } catch (error) {
    console.error(error)
  }

  return null
}
const removeImage = () => {
  image.value = undefined
  file.value = null
  setFieldValue('thumbnail', undefined)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

onMounted(async () => {
  await loadCategory()
})
</script>

<template>
  <form @submit="onSubmit">
    <div class="mx-auto grid max-w-5xl flex-1 auto-rows-max gap-4">
      <div class="flex items-center gap-4">
        <div class="hidden items-center gap-2 md:ml-auto md:flex">
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                size="sm"
                type="button"
                @click="$router.push({ name: 'category-list' })"
              >
                ยกเลิก
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div class="flex">
                <p class="text-sm">คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการแก้ไขหมวดหมู่นี้</p>
                <Button variant="outline" size="sm" @click="clearForm"> ยืนยัน </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button size="sm" type="submit"> บันทึก </Button>
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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="name"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>ชื่อ</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="กรอกชื่อหมวดหมู่" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="sort"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>ลำดับ</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="กรอกลำดับหมวดหมู่"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
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
                  <FormField
                    v-slot="{ componentField }"
                    name="status"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>สถานะ</FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกสถานะ" />
                          </SelectTrigger>
                          <SelectContent>
                            <template v-for="status in Object.values(CommonStatus)" :key="status">
                              <SelectItem :value="status">
                                {{ status }}
                              </SelectItem>
                            </template>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
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
              <FormField name="thumbnail" :validate-on-blur="!isFieldDirty">
                <FormItem v-auto-animate>
                  <div class="w-full aspect-square mx-auto overflow-hidden relative">
                    <div v-if="image" class="flex flex-col items-center gap-2">
                      <div class="relative">
                        <img :src="image" />
                        <div class="absolute top-1 right-1">
                          <TooltipProvider :delay-duration="0">
                            <Tooltip>
                              <TooltipTrigger>
                                <button
                                  class="rounded-full text-muted-foreground"
                                  @click="removeImage"
                                >
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
                  <FormMessage />
                </FormItem>
              </FormField>
            </CardContent>
            <CardFooter>
              <div class="flex flex-col px-6">
                <ul class="text-blue-500 text-sm font-semibold list-disc">
                  <li>ขนาดที่แนะนำ 64x64 พิกเซล</li>
                  <li>อัตราส่วน 1:1</li>
                  <li>ขนาดไฟล์ไม่เกิน 1MB</li>
                  <li>ไฟล์ที่รองรับ: <span class="font-normal">.jpeg, .png, .webp</span></li>
                </ul>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div class="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" @click="$router.push({ name: 'category-list' })">
          ยกเลิก
        </Button>
        <Button size="sm" type="submit"> บันทึก </Button>
      </div>
    </div>
  </form>
</template>
