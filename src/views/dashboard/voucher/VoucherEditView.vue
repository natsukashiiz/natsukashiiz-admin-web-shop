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
import { computed, ref, type Ref } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { toast } from '@/components/ui/toast'
import { getLocalTimeZone, today, parseDate, type DateValue } from '@internationalized/date'

import { uploadFile } from '@/api/file'
import { queryVoucher, updateVoucher } from '@/api/voucher'
import type { CreateVoucherRequest } from '@/types/api'
import { DiscountType, VoucherStatus } from '@/types/enum'
import { validateFileType, validateFileSize } from '@/utils/validations'
import dayjs from 'dayjs'
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const voucherId = Number(route.params.id)
const image = ref<string>()
const file = ref<File | null>(null)

const { isFieldDirty, handleSubmit, setFieldValue, setErrors, values } = useForm<
  Partial<CreateVoucherRequest>
>({
  validationSchema: toTypedSchema(
    z.object({
      code: z
        .string({ message: 'กรุณากรอกโค้ด' })
        .max(5, { message: 'โค้ดต้องมีความยาวไม่เกิน 5 ตัวอักษร' }),
      discount: z.number({ message: 'กรุณากรอกส่วนลด' }).min(0, {
        message: 'ส่วนลดต้องมากกว่า 0'
      }),
      discountType: z.nativeEnum(DiscountType, { message: 'กรุณาเลือกประเภทส่วนลด' }),
      maxDiscount: z
        .number({ message: 'กรุณากรอกส่วนลดสูงสุด' })
        .min(0, {
          message: 'ส่วนลดสูงสุดต้องมากกว่า 0'
        })
        .nullish(),
      minOrderPrice: z.number({ message: 'กรุณากรอกยอดขั้นต่ำ' }).min(0, {
        message: 'ยอดขั้นต่ำต้องมากกว่า 0'
      }),
      quantity: z.number({ message: 'กรุณากรอกจำนวน' }).min(0, {
        message: 'จำนวนต้องมากกว่า 0'
      }),
      beginAt: z.string({ message: 'กรุณาเลือกวันที่เริ่มต้น' }),
      expiredAt: z.string({ message: 'กรุณาเลือกวันที่สิ้นสุด' }),
      status: z.nativeEnum(VoucherStatus, { message: 'กรุณาเลือกสถานะ' }),
      thumbnail: z.string({ message: 'กรุณาอัปโหลดรูปภาพ' })
    })
  ),
  initialValues: {
    discount: 0,
    discountType: DiscountType.amount,
    maxDiscount: undefined,
    minOrderPrice: 0,
    quantity: 0,
    status: VoucherStatus.active
  }
})

watch(
  () => values.discountType,
  (value) => {
    if (value === DiscountType.amount) {
      setFieldValue('maxDiscount', undefined)
    } else {
      setFieldValue('maxDiscount', 0)
    }
  }
)

const loadVoucher = async () => {
  try {
    const res = await queryVoucher(voucherId)
    if (res.status === 200) {
      const voucher = res.data
      setFieldValue('code', voucher.code)
      setFieldValue('discount', voucher.discount)
      setFieldValue('discountType', voucher.discountType)
      setFieldValue('maxDiscount', voucher.maxDiscount)
      setFieldValue('minOrderPrice', voucher.minOrderPrice)
      setFieldValue('quantity', voucher.quantity)
      setFieldValue('beginAt', dayjs(voucher.beginAt).format('YYYY-MM-DD'))
      setFieldValue('expiredAt', dayjs(voucher.expiredAt).format('YYYY-MM-DD'))
      setFieldValue('status', voucher.status)
      setFieldValue('thumbnail', voucher.thumbnail)
      image.value = voucher.thumbnail
    }
  } catch (error) {
    console.error(error)
  }
}
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

  if (form.discountType === DiscountType.percent) {
    if (form.discount! > 100 || form.discount! < 0) {
      setErrors({ discount: 'ส่วนลดต้องอยู่ระหว่าง 0 ถึง 100' })
      return
    }
  }

  try {
    const res = await updateVoucher(voucherId, {
      discount: form.discount!,
      discountType: form.discountType!,
      maxDiscount: form.maxDiscount!,
      minOrderPrice: form.minOrderPrice!,
      quantity: form.quantity!,
      beginAt: dayjs(form.beginAt).format('YYYY-MM-DD 00:00:00'),
      expiredAt: dayjs(form.expiredAt).format('YYYY-MM-DD 23:59:59'),
      status: form.status!,
      thumbnail: form.thumbnail!
    })
    if (res.status === 200) {
      toast({
        description: 'แก้ไขคูปองสำเร็จ',
        duration: 3000
      })
    }
  } catch (error) {
    console.error(error)
    toast({
      description: 'ไม่สามารถแก้ไขคูปองได้',
      duration: 3000,
      variant: 'destructive'
    })
  }
})

const handleCancel = () => {
  console.log('Cancel')
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
  setFieldValue('thumbnail', undefined)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

onMounted(async () => {
  await loadVoucher()
})

const beginAt = computed({
  get: () => (values.beginAt ? parseDate(values.beginAt as string) : undefined),
  set: (val) => val
})
const expiredAt = computed({
  get: () => (values.expiredAt ? parseDate(values.expiredAt as string) : undefined),
  set: (val) => val
})
</script>

<template>
  <form @submit="onSubmit">
    <div class="mx-auto grid max-w-5xl flex-1 auto-rows-max gap-4">
      <div class="flex items-center gap-4">
        <div class="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" type="button" @click="handleCancel"> ยกเลิก </Button>
          <Button size="sm" type="submit"> บันทึก </Button>
        </div>
      </div>
      <div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>รายละเอียดคูปอง</CardTitle>
              <CardDescription>
                รายละเอียดคูปองจะช่วยให้ลูกค้าเข้าใจคูปองของคุณมากขึ้น
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="discountType"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>ประเภท</FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกประเภท" />
                          </SelectTrigger>
                          <SelectContent>
                            <template v-for="item in Object.values(DiscountType)" :key="item">
                              <SelectItem :value="item">
                                {{ item }}
                              </SelectItem>
                            </template>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="code"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>โค้ด</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="กรอกโค้ด"
                          v-bind="componentField"
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="discount"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>ส่วนลด</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="กรอกส่วนลด" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="maxDiscount"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>ลดสูงสุด</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="กรอกลดสูงสุด"
                          v-bind="componentField"
                          :disabled="values.discountType === DiscountType.amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="minOrderPrice"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>ยอดขั้นต่ำ</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="กรอกยอดขั้นต่ำ" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="quantity"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>จำนวน</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="กรอกจำนวน" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>
          <div class="grid md:grid-flow-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>วันที่เริ่มต้น</CardTitle>
                <CardDescription> วันที่เริ่มต้นของคูปอง </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField name="beginAt" :validate-on-blur="!isFieldDirty">
                  <FormItem v-auto-animate>
                    <FormControl>
                      <Calendar
                        v-model="beginAt"
                        :weekday-format="'short'"
                        locale="th"
                        class="rounded-md border"
                        :min-value="today(getLocalTimeZone()).add({ days: 1 })"
                        @update:model-value="
                          (v) => {
                            if (v) {
                              setFieldValue('beginAt', v.toString())
                            } else {
                              setFieldValue('beginAt', undefined)
                            }
                          }
                        "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>วันที่สิ้นสุด</CardTitle>
                <CardDescription> วันที่สิ้นสุดของคูปอง </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField name="expiredAt" :validate-on-blur="!isFieldDirty">
                  <FormItem v-auto-animate>
                    <FormControl>
                      <Calendar
                        v-model="expiredAt"
                        :weekday-format="'short'"
                        locale="th"
                        class="rounded-md border"
                        :min-value="today(getLocalTimeZone()).add({ days: 1 })"
                        @update:model-value="
                          (v) => {
                            if (v) {
                              setFieldValue('expiredAt', v.toString())
                            } else {
                              setFieldValue('expiredAt', undefined)
                            }
                          }
                        "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </CardContent>
            </Card>
          </div>
          <!-- <Card>
            <CardHeader>
              <CardTitle>สินค้า</CardTitle>
              <CardDescription> สินค้าจะช่วยให้ลูกค้าหาสินค้าของคุณได้ง่ายขึ้น </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-6 sm:grid-cols-3">
                <div class="grid gap-3">
                  <Label for="category">สินค้า</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="สินค้า" />
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
                  <Label for="category">หมวดหมู่สินค้า</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="หมวดหมู่สินค้า" />
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
          </Card> -->
        </div>
        <div class="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>สถานะคูปอง</CardTitle>
              <CardDescription>
                คูปองที่เป็นฉบับร่างและจัดเก็บจะไม่แสดงในหน้าร้านของคุณ
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
                    <FormLabel>สถานะ</FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกสถานะ" />
                        </SelectTrigger>
                        <SelectContent>
                          <template v-for="item in Object.values(VoucherStatus)" :key="item">
                            <SelectItem :value="item">
                              {{ item }}
                            </SelectItem>
                          </template>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    <li>ขนาดที่แนะนำ 312x312 พิกเซล</li>
                    <li>อัตราส่วน 1:1</li>
                    <li>ขนาดไฟล์ไม่เกิน 1MB</li>
                    <li>ไฟล์ที่รองรับ: <span class="font-normal">.jpeg, .png, .webp</span></li>
                  </ul>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" type="button" @click="handleCancel"> ยกเลิก </Button>
        <Button size="sm" type="submit"> บันทึก </Button>
      </div>
    </div>
  </form>
</template>
