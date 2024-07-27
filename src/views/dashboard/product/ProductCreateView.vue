<script setup lang="ts">
import { PlusCircle, Upload, X, Trash } from 'lucide-vue-next'
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
import { ref, watch } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { useToast } from '@/components/ui/toast'

import type {
  CategoryNameResponse,
  CreateProductRequest,
  CreateProductOptionRequest,
  CreateProductImageRequest
} from '@/types/api'
import { createProduct } from '@/api/product'
import { queryCategoryNames } from '@/api/category'
import { onMounted } from 'vue'
import { CommonStatus } from '@/types/enum'
import { uploadFile, deleteFile } from '@/api/file'
import { validateFileSize, validateFileType } from '@/utils/validations'
import { computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useEventListener } from '@vueuse/core'

interface Image extends CreateProductImageRequest {
  file: File
}
interface Option extends CreateProductOptionRequest {
  key: number
}

const { toast } = useToast()

const categories = ref<CategoryNameResponse[]>([])
const options = ref<Option[]>([{ key: 1, name: '', quantity: 0, price: 0, sort: 0 }])
const images = ref<Image[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const formChanged = ref(false)

const { isFieldDirty, handleSubmit, resetForm, setFieldValue, setErrors } = useForm<
  Partial<CreateProductRequest>
>({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string({ message: 'กรุณากรอกชื่อสินค้า' }),
      description: z.string({ message: 'กรุณากรอกรายละเอียดสินค้า' }),
      status: z.string({ message: 'กรุณาเลือกสถานะสินค้า' }),
      category: z.string({ message: 'กรุณาเลือกหมวดหมู่สินค้า' }),
      options: z.array(
        z.object({
          name: z
            .string({ message: 'กรุณากรอกชื่อตัวเลือกสินค้า' })
            .min(1, { message: 'กรุณากรอกชื่อตัวเลือกสินค้า' }),
          quantity: z
            .number({ message: 'กรุณากรอกจำนวนสินค้า' })
            .min(0, { message: 'กรุณากรอกจำนวนสินค้า' }),
          price: z
            .number({ message: 'กรุณากรอกราคาสินค้า' })
            .min(0, { message: 'กรุณากรอกราคาสินค้า' }),
          sort: z.number({ message: 'กรุณากรอกลำดับตัวเลือกสินค้า' }),
          image: z
            .object(
              {
                url: z.string().min(1, { message: 'กรุณาอัปโหลดรูปภาพ' })
              },
              { message: 'กรุณาอัปโหลดรูปภาพ' }
            )
            .nullish()
        }),
        { message: 'กรุณากรอกตัวเลือกสินค้า' }
      ),
      images: z.array(
        z.object({
          url: z.string().min(1, { message: 'กรุณาอัปโหลดรูปภาพ' }),
          sort: z.number({ message: 'กรุณากรอกลำดับรูปภาพ' })
        }),
        { message: 'กรุณาอัปโหลดรูปภาพ' }
      )
    })
  ),
  initialValues: {
    options: options.value
  }
})

const onSubmit = handleSubmit(async (form) => {
  try {
    const res = await createProduct({
      name: form.name!,
      category: categories.value.find((category) => category.id === Number(form.category))!,
      options: form.options!.map((option) => ({
        name: option.name,
        quantity: option.quantity,
        price: option.price,
        sort: option.sort,
        image: option.image
      })),
      images: form.images!.map((image) => ({
        url: image.url,
        sort: image.sort
      })),
      description: form.description!,
      status: form.status!
    })
    if (res.status === 200) {
      toast({
        description: 'สร้างสินค้าสำเร็จ',
        duration: 3000
      })
      clearForm()
    }
  } catch (error: any) {
    if (error.response.status === 417) {
      const err = error.response.data.error
      if (err === 'product.exists.name') {
        setErrors({ name: 'ชื่อสินค้านี้มีอยู่แล้ว' })
      } else {
        toast({
          description: 'เกิดข้อผิดพลาดบางอย่าง',
          duration: 3000,
          variant: 'destructive'
        })
      }
    }
  }
})

const clearForm = () => {
  options.value = [{ key: 1, name: '', quantity: 0, price: 0, sort: 0 }]
  images.value = []
  formChanged.value = false
  resetForm()
}

const handleAddOptionInput = () => {
  options.value.push({
    key: options.value.length + 1,
    name: '',
    quantity: 0,
    price: 0,
    sort: options.value.length,
    image: undefined
  })
}

const handleRemoveOptionInput = (key: number) => {
  options.value = options.value.filter((option) => option.key !== key)
}

const handleFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (validateFileType(file) === false) {
      toast({
        description: 'รูปภาพที่รองรับ: .jpeg, .png, .webp',
        duration: 3000,
        variant: 'destructive'
      })
      return
    }
    if (validateFileSize(file) === false) {
      toast({
        description: 'ขนาดไฟล์รูปภาพไม่เกิน 1MB',
        duration: 3000,
        variant: 'destructive'
      })
      return
    }

    await handleUploadFile(file)
  }
}
const handleUploadFile = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await uploadFile(formData)
    if (res.status === 200 && res.data) {
      const maxSort = images.value.reduce((max, image) => (image.sort > max ? image.sort : max), 0)
      images.value.push({ file, url: res.data.url, sort: maxSort + 1 })
      setFieldValue('images', images.value)
    }
  } catch (error) {
    console.error(error)
    toast({
      description: 'ไม่สามารถอัปโหลดรูปภาพได้',
      duration: 3000,
      variant: 'destructive'
    })
  }
}

const handleDeleteImage = async (url: string) => {
  const image = images.value.find((image) => image.url === url)
  if (image) {
    try {
      const res = await deleteFile(image.url)
      if (res.status === 200) {
        images.value = images.value.filter((image) => image.url !== url)
        setFieldValue('images', images.value)
      }
    } catch (error) {
      console.error(error)
      toast({
        description: 'ไม่สามารถลบรูปภาพได้',
        duration: 3000,
        variant: 'destructive'
      })
    }
  }
}

const removeAllImage = () => {
  images.value = []
  setFieldValue('images', images.value)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const loadCategoryNames = async () => {
  try {
    const res = await queryCategoryNames()
    if (res.status === 200 && res.data) {
      categories.value = res.data
    }
  } catch (error) {
    console.error(error)
  }
}

const updateOptionImage = (optionKey: number, url: string) => {
  const option = options.value.find(({ key }) => key === optionKey)
  if (option) {
    option.image = { url }
  }
}

const optionIsEmpty = computed(() =>
  options.value.every((option) => option.name === '' && option.quantity === 0 && option.price === 0)
)

const optionHasImage = (url: string) => {
  if (!url) return false

  return options.value.some((option) => option.image?.url === url)
}

watch(
  options,
  (newValue) => {
    setFieldValue('options', newValue)
  },
  { deep: true }
)

onMounted(async () => {
  await loadCategoryNames()
})

onBeforeRouteLeave((_to, _from, next) => {
  if (formChanged.value) {
    if (confirm('คุณต้องการออกจากหน้านี้หรือไม่? ข้อมูลที่กรอกอาจจะไม่ถูกบันทึก')) {
      next()
    } else {
      next(false)
    }
  }

  next()
})

useEventListener(window, 'beforeunload', (event) => {
  event.preventDefault()
})
</script>

<template>
  <form @submit="onSubmit" @change="() => (formChanged = true)">
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
              <CardTitle>รายละเอียดสินค้า</CardTitle>
              <CardDescription>
                รายละเอียดสินค้าจะช่วยให้ลูกค้าเข้าใจสินค้าของคุณมากขึ้น
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-6">
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="name"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel> ชื่อสินค้า </FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="กรอกชื่อสินค้า" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="description"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel> รายละเอียด </FormLabel>
                      <FormControl>
                        <Textarea
                          class="min-h-32"
                          placeholder="กรอกรายละเอียด"
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
              <CardTitle> สต็อกสินค้า </CardTitle>
              <CardDescription>
                สต็อกสินค้าจะช่วยให้คุณตรวจสอบสินค้าที่มีอยู่ในคลังของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField name="options" :validate-on-blur="!isFieldDirty">
                <FormItem v-auto-animate>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อ</TableHead>
                        <TableHead class="w-[80px] md:w-[150px]">จำนวน</TableHead>
                        <TableHead class="w-[80px] md:w-[150px]">ราคา</TableHead>
                        <TableHead class="w-[40px] md:w-[80px]">ลำดับ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="(option, index) in options" :key="index">
                        <TableCell>
                          <Input
                            type="text"
                            v-model="option.name"
                            placeholder="กรอกชื่อสต็อกสินค้า"
                          />
                        </TableCell>
                        <TableCell>
                          <Input type="number" v-model="option.quantity" :min="0" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" v-model="option.price" :min="0" step="any" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" v-model="option.sort" />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            @click="handleRemoveOptionInput(option.key)"
                            :disabled="options.length === 1"
                          >
                            <Trash class="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <FormMessage />
                </FormItem>
              </FormField>
            </CardContent>
            <CardFooter class="justify-center border-t p-4">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                class="gap-1"
                @click.prevent="handleAddOptionInput"
              >
                <PlusCircle class="h-3.5 w-3.5" />
                เพิ่ม
              </Button>
            </CardFooter>
          </Card>
          <Card class="overflow-hidden">
            <CardHeader>
              <CardTitle>รูปสินค้า</CardTitle>
              <CardDescription>
                รูปภาพสินค้าจะช่วยให้ลูกค้าเห็นภาพรวมของสินค้าของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField name="images" :validate-on-blur="!isFieldDirty">
                <FormItem v-auto-animate>
                  <div class="grid gap-2">
                    <div class="grid grid-cols-2 gap-2">
                      <template v-for="(image, index) in images" :key="index">
                        <div class="flex flex-col items-center gap-2">
                          <div class="relative w-[84] h-[84]">
                            <img
                              :src="image.url"
                              class="aspect-square w-full rounded-md object-cover"
                            />
                            <div class="absolute top-1 right-1">
                              <TooltipProvider :delay-duration="0">
                                <Tooltip>
                                  <TooltipTrigger>
                                    <button
                                      type="button"
                                      class="rounded-full text-muted-foreground"
                                      @click.prevent="handleDeleteImage(image.url)"
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
                          <Input
                            type="number"
                            class="text-center"
                            placeholder="ลำดับ"
                            v-model="image.sort"
                            @change="images.sort((a, b) => a.sort - b.sort)"
                          />
                          <Select
                            v-if="!optionIsEmpty"
                            @update:model-value="
                              (optionKey) => updateOptionImage(Number(optionKey), image.url)
                            "
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกสต็อกสินค้า" />
                            </SelectTrigger>
                            <SelectContent>
                              <template v-for="option in options" :key="option.name">
                                <SelectItem
                                  :value="String(option.key)"
                                  :disabled="optionHasImage(option.image?.url!)"
                                >
                                  {{ option.name }}
                                </SelectItem>
                              </template>
                            </SelectContent>
                          </Select>
                        </div>
                      </template>
                      <TooltipProvider v-if="images.length < 6" :delay-duration="0">
                        <Tooltip>
                          <TooltipTrigger>
                            <button
                              type="button"
                              class="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                              @click.prevent="handleFileInput"
                            >
                              <Upload class="h-6 w-6 text-muted-foreground" />
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
                  <FormMessage />
                </FormItem>
              </FormField>
            </CardContent>
            <CardFooter>
              <div class="flex flex-col px-6">
                <ul class="text-blue-500 text-sm font-semibold list-disc">
                  <li>ขนาดที่แนะนำ 512x512 พิกเซล</li>
                  <li>อัตราส่วน 1:1</li>
                  <li>ขนาดไฟล์ไม่เกิน 1MB</li>
                  <li>ไฟล์ที่รองรับ: <span class="font-normal">.jpeg, .png, .webp</span></li>
                </ul>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div class="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>หมวดหมู่สินค้า</CardTitle>
              <CardDescription>
                หมวดหมู่สินค้าจะช่วยให้ลูกค้าหาสินค้าของคุณได้ง่ายขึ้น
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                v-slot="{ componentField }"
                name="category"
                :validate-on-blur="!isFieldDirty"
              >
                <FormItem v-auto-animate>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>สถานะสินค้า</CardTitle>
              <CardDescription>
                สินค้าที่เป็นฉบับร่างและจัดเก็บจะไม่แสดงในหน้าร้านของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                v-slot="{ componentField }"
                name="status"
                :validate-on-blur="!isFieldDirty"
              >
                <FormItem v-auto-animate>
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
