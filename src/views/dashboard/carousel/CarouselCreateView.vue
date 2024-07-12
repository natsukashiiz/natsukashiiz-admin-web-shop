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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { ref } from 'vue'
import { CommonStatus } from '@/types/enum'
import { createCarousel } from '@/api/carousel'
import type { CreateCarouselRequest } from '@/types/api'
import { toast } from '@/components/ui/toast'
import { uploadFile } from '@/api/file'
import { validateFileSize, validateFileType } from '@/utils/validations'

const image = ref<string>()
const file = ref<File | null>(null)

const { isFieldDirty, handleSubmit, resetForm, setFieldValue, setErrors } = useForm<
  Partial<CreateCarouselRequest>
>({
  validationSchema: toTypedSchema(
    z.object({
      title: z.string({ message: 'กรุณากรอกชื่อ' }),
      imageUrl: z.string({ message: 'กรุณาอัปโหลดรูปภาพ' }),
      sort: z.number().int({ message: 'ลำดับต้องเป็นตัวเลขเท่านั้น' })
    })
  ),
  initialValues: {
    sort: 0,
    status: CommonStatus.draft
  }
})
const onSubmit = handleSubmit(async (form: CreateCarouselRequest) => {
  if (file.value) {
    const url = await handleUploadFile()
    if (url) {
      form.imageUrl = url
    } else {
      setErrors({ thumbnail: 'ไม่สามารถอัปโหลดรูปภาพได้' })
      return
    }
  }
  try {
    const res = await createCarousel(form)
    if (res.status === 200) {
      toast({
        description: 'สร้างภาพสไลด์สำเร็จ',
        duration: 3000
      })
      clearForm()
    }
  } catch (error: any) {
    console.error(error)
  }
})
const clearForm = () => {
  image.value = undefined
  resetForm()
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
    setFieldValue('imageUrl', url)
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
    toast({
      description: 'ไม่สามารถอัปโหลดรูปภาพได้',
      duration: 3000,
      variant: 'destructive'
    })
  }

  return null
}
const removeImage = () => {
  image.value = undefined
  file.value = null
  setFieldValue('imageUrl', undefined)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}
</script>

<template>
  <form @submit="onSubmit">
    <div class="mx-auto grid max-w-5xl flex-1 auto-rows-max gap-4">
      <div class="flex items-center gap-4">
        <div class="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" type="button" @click="clearForm"> ยกเลิก </Button>
          <Button size="sm" type="submit"> บันทึก </Button>
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
                  <FormField
                    v-slot="{ componentField }"
                    name="title"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem>
                      <FormLabel>ชื่อ</FormLabel>
                      <FormControl>
                        <Input type="text" v-bind="componentField" />
                      </FormControl>
                    </FormItem>
                    <FormMessage />
                  </FormField>
                </div>
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="sort"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem>
                      <FormLabel> ลำดับ </FormLabel>
                      <FormControl>
                        <Input type="number" v-bind="componentField" />
                      </FormControl>
                    </FormItem>
                    <FormMessage />
                  </FormField>
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
              <FormField name="imageUrl" :validate-on-blur="!isFieldDirty">
                <FormItem v-auto-animate>
                  <div class="aspect-[16/9] overflow-hidden relative">
                    <div v-if="image" class="flex flex-col items-center gap-2">
                      <div class="relative">
                        <img :src="image" width="960" height="540" />
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
                </FormItem>
                <FormMessage />
              </FormField>
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
                  <FormField
                    v-slot="{ componentField }"
                    name="status"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem>
                      <FormLabel>ชื่อ</FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกสถานะ" />
                          </SelectTrigger>
                          <SelectContent>
                            <template v-for="item in Object.values(CommonStatus)" :key="item">
                              <SelectItem :value="item">
                                {{ item }}
                              </SelectItem>
                            </template>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                    <FormMessage />
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div class="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" type="button" @click="clearForm"> ยกเลิก </Button>
        <Button size="sm" type="submit"> บันทึก </Button>
      </div>
    </div>
  </form>
</template>
