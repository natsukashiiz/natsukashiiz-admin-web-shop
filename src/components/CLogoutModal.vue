<script setup lang="ts">
import { useRouter } from 'vue-router'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const router = useRouter()
const handleLogout = () => {
  router.push('/login')
}
</script>
<template>
  <Dialog>
    <DialogTrigger> ออกจากระบบ </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>ออกจากระบบ</DialogTitle>
      </DialogHeader>
      <DialogDescription>คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ</DialogDescription>
      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="secondary"> ยกเลิก </Button>
        </DialogClose>
        <Button @click="handleLogout">ออกจากระบบ</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
