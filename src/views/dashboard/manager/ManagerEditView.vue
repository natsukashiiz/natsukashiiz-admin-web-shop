<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import type { UpdateManagerRequest } from '@/types/api'
import { CommonStatus, AdminRoles } from '@/types/enum'
import { updateManager, queryManager } from '@/api/manager'
import { useToast } from '@/components/ui/toast'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

const { toast } = useToast()
const route = useRoute()

const managerId = Number(route.params.id)

const { isFieldDirty, handleSubmit, resetForm, setErrors, setFieldValue } = useForm<
  Partial<UpdateManagerRequest>
>({
  validationSchema: toTypedSchema(
    z.object({
      username: z.string().regex(new RegExp('^[a-zA-Z0-9_]{4,16}$'), {
        message: 'ชื่อผู้ใช้ต้องมีความยาว 4-16 ตัวอักษร และสามารถใช้ตัวอักษร a-z, A-Z, 0-9 และ _'
      }),
      password: z
        .string()
        .regex(new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{8,16}$'), {
          message:
            'รหัสผ่านต้องมีความยาว 8-16 ตัวอักษร และมีอย่างน้อย 1 ตัวเลข [0-9], 1 ตัวพิมพ์เล็ก [a-z], 1 ตัวพิมพ์ใหญ่ [A-Z] และ 1 ตัวอักษรพิเศษ เช่น @, #, $ ฯลฯ โดยไม่มีช่องว่าง และไม่มีตัวอักษรพิเศษอื่นๆ ที่ไม่ได้ระบุ'
        })
        .nullish(),
      role: z.nativeEnum(AdminRoles),
      status: z.nativeEnum(CommonStatus)
    })
  ),
  initialValues: {
    role: AdminRoles.admin,
    status: CommonStatus.active
  }
})

const loadManager = async () => {
  try {
    const res = await queryManager(managerId)
    if (res.status === 200) {
      const manager = res.data
      setFieldValue('username', manager.username)
      setFieldValue('role', manager.role)
      setFieldValue('status', manager.status)
      setFieldValue('password', undefined)
    }
  } catch (error) {
    console.error(error)
    toast({
      description: 'เกิดข้อผิดพลาดบางอย่าง',
      duration: 3000,
      variant: 'destructive'
    })
  }
}

const onSubmit = handleSubmit(async (form) => {
  try {
    const res = await updateManager(managerId, {
      username: form.username!,
      password: form.password!,
      role: form.role!,
      status: form.status!
    })
    if (res.status === 200) {
      toast({
        description: 'แก้ไขบัญชีผู้จัดการสำเร็จ',
        duration: 3000
      })
    }
  } catch (error: any) {
    if (error.response.status === 417) {
      const err = error.response.data.error
      if (err === 'manager.exists.username') {
        setErrors({ username: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' })
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
  resetForm()
}

onMounted(async () => {
  await loadManager()
})
</script>

<template>
  <form @submit="onSubmit" autocomplete="off">
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
              <CardTitle>รายละเอียดผู้จัดการ</CardTitle>
              <CardDescription>
                รายละเอียดผู้จัดการจะช่วยให้ลูกค้าเข้าใจผู้จัดการของคุณมากขึ้น
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="username"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>ชื่อผู้ใช้</FormLabel>
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
                    name="password"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>รหัสผ่าน</FormLabel>
                      <FormControl>
                        <Input type="password" v-bind="componentField" />
                      </FormControl>
                    </FormItem>
                    <FormMessage />
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>บทบาทผู้จัดการ</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid gap-6">
                <div class="grid gap-3">
                  <FormField
                    v-slot="{ componentField }"
                    name="role"
                    :validate-on-blur="!isFieldDirty"
                  >
                    <FormItem v-auto-animate>
                      <FormLabel>บทบาท</FormLabel>
                      <FormControl>
                        <Select v-bind="componentField">
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกบทบาท" />
                          </SelectTrigger>
                          <SelectContent>
                            <template v-for="role in Object.values(AdminRoles)" :key="role">
                              <SelectItem :value="role">
                                {{ role }}
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
        <div class="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>สถานะผู้จัดการ</CardTitle>
              <CardDescription>
                ผู้จัดการที่เป็นฉบับร่างและจัดเก็บจะไม่แสดงในหน้าร้านของคุณ
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
                      <FormLabel> สถานะ </FormLabel>
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
