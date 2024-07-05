<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DotsVerticalIcon } from '@radix-icons/vue'
import CLogoutModal from '@/components/CLogoutModal.vue'
</script>
<template>
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2">
      <Avatar class="h-8 w-8">
        <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <span class="text-sm">ผู้ดูแลระบบ</span>
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon">
          <DotsVerticalIcon class="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <router-link to="/profile">โปรไฟล์ของฉัน</router-link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <router-link to="/settings">การตั้งค่า</router-link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <CLogoutModal />
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
