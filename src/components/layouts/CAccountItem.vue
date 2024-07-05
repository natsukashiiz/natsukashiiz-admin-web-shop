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
import type { PropType } from 'vue'

defineProps({
  collapsed: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})
</script>
<template>
  <div class="flex items-center" :class="collapsed ? 'justify-center' : 'justify-between'">
    <div v-if="!collapsed" class="flex items-center gap-2">
      <Avatar class="h-8 w-8">
        <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <span
        class="text-sm truncate"
        :class="collapsed ? '-translate-x-96 opacity-0 hidden' : 'translate-x-0 opacity-100'"
      >
        ผู้ดูแลระบบ
      </span>
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar v-if="collapsed" class="h-8 w-8">
          <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Button v-else variant="ghost" size="icon">
          <DotsVerticalIcon class="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent :collision-padding="{ top: 20, left: 20 }">
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
