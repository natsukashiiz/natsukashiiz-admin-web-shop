<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { reactive } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loadingStore'

const { toast } = useToast()
const router = useRouter()
const loading = useLoadingStore()

const form = reactive({
  email: '',
  password: ''
})

const handleSubmit = () => {
  if (!form.email || !form.password) {
    toast({
      title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      variant: 'destructive',
      duration: 3000
    })
    return
  }

  if (form.email !== 'admin' && form.password !== 'admin') {
    toast({
      title: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      variant: 'destructive',
      duration: 3000
    })
    return
  }

  loading.start()

  // delay 3 seconds
  setTimeout(() => {
    loading.stop()
    toast({
      title: 'เข้าสู่ระบบสำเร็จ',
      duration: 3000
    })

    router.push('/')
  }, 3000)
}
</script>

<template>
  <div class="w-full lg:grid lg:grid-cols-2 h-dvh">
    <div class="hidden bg-muted lg:block">
      <img
        src="https://img.freepik.com/free-photo/small-grocery-cart-with-black-friday-sale-inscription_23-2147957597.jpg?t=st=1720152471~exp=1720156071~hmac=cd465db6410b97083ff1ab4c0a92c9fa1aed73d3b7f4f79310ce3fb7877bcd20&w=1380"
        alt="รูปภาพ"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">เข้าสู่ระบบ</h1>
          <p class="text-balance text-muted-foreground">
            ยินดีต้อนรับกลับมา! กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ
          </p>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              required
              v-model="form.email"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">รหัสผ่าน</Label>
              <!-- <a href="#" class="ml-auto inline-block text-sm underline"> ลืมรหัสผ่าน? </a> -->
            </div>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
              v-model="form.password"
            />
          </div>
          <Button type="submit" class="w-full" @click="handleSubmit"> เข้าสู่ระบบ </Button>
          <!-- <Button variant="outline" class="w-full"> เข้าสู่ระบบด้วย Google </Button> -->
        </div>
        <!-- <div class="mt-4 text-center text-sm">
          ไม่มีบัญชี?
          <a href="#" class="underline"> สมัครสมาชิก </a>
        </div> -->
      </div>
    </div>
  </div>
</template>
