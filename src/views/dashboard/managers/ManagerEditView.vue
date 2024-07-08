<script setup lang="ts">
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

interface FormAddManager {
  username: string | null
  password: string | null
  role: string | null
  status: string | null
}

const status = ref([
  { key: 'DRAFT', value: 'ฉบับร่าง' },
  { key: 'PUBLISHED', value: 'เผยแพร่' },
  { key: 'ARCHIVED', value: 'จัดเก็บ' }
])
const formAddManager = reactive<FormAddManager>({
  username: null,
  password: null,
  role: null,
  status: null
})
const handleCancel = () => {
  console.log('Cancel')
  if (confirm('Are you sure you want to cancel?')) {
    formAddManager.username = null
    formAddManager.password = null
    formAddManager.role = null
    formAddManager.status = null
  }
}
const handleSave = () => {
  console.log('Save')
  console.log(formAddManager)
}
const handleAchieve = () => {
  console.log('Achieve')
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
            <CardTitle>รายละเอียดผู้จัดการ</CardTitle>
            <CardDescription>
              รายละเอียดผู้จัดการจะช่วยให้ลูกค้าเข้าใจผู้จัดการของคุณมากขึ้น
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="grid gap-3">
                <Label for="title">ชื่อผู้ใช้</Label>
                <Input type="text" class="w-full" v-model="formAddManager.username" />
              </div>
              <div class="grid gap-3">
                <Label for="sort">รหัสผ่าน</Label>
                <Input type="text" class="w-full" v-model="formAddManager.password" />
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
                <Label for="role">บทบาท</Label>
                <Select v-model="formAddManager.role">
                  <SelectTrigger aria-label="เลือกบทบาท">
                    <SelectValue placeholder="เลือกบทบาท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ผู้ดูแลระบบ</SelectItem>
                    <SelectItem value="MANAGER">ผู้จัดการ</SelectItem>
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
            <CardTitle>สถานะผู้จัดการ</CardTitle>
            <CardDescription>
              ผู้จัดการที่เป็นฉบับร่างและจัดเก็บจะไม่แสดงในหน้าร้านของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-6">
              <div class="grid gap-3">
                <Label for="status">สถานะ</Label>
                <Select v-model="formAddManager.status">
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
            <CardTitle>เก็บผู้จัดการลงคลัง</CardTitle>
            <CardDescription> ผู้จัดการที่เก็บลงคลังจะไม่แสดงในหน้าร้านของคุณ </CardDescription>
          </CardHeader>
          <CardContent>
            <div />
            <Button size="sm" variant="secondary" @click="handleAchieve">
              เก็บผู้จัดการลงคลัง
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
