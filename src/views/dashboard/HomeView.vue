<script setup lang="ts">
import { Users, ArrowUpRight } from 'lucide-vue-next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
</script>
<template>
  <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium"> รายได้รวม </CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$45,231.89</div>
          <p class="text-xs text-muted-foreground">+20.1% จากเดือนที่แล้ว</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium"> การสมัครสมาชิก </CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">+2350</div>
          <p class="text-xs text-muted-foreground">+180.1% จากเดือนที่แล้ว</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium"> ยอดขาย </CardTitle>
          <CreditCard class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">+12,234</div>
          <p class="text-xs text-muted-foreground">+19% จากเดือนที่แล้ว</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium"> กำลังใช้งานอยู่ </CardTitle>
          <Activity class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">+573</div>
          <p class="text-xs text-muted-foreground">+201 ตั้งแต่ชั่วโมงที่แล้ว</p>
        </CardContent>
      </Card>
    </div>
    <div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <Card class="xl:col-span-2">
        <CardHeader class="flex flex-row items-center">
          <div class="grid gap-2">
            <CardTitle>ธุรกรรม</CardTitle>
            <CardDescription> ธุรกรรมล่าสุดจากร้านค้าของคุณ </CardDescription>
          </div>
          <Button as-child size="sm" class="ml-auto gap-1">
            <a href="#">
              ดูทั้งหมด
              <ArrowUpRight class="h-4 w-4" />
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ลูกค้า</TableHead>
                <TableHead class="hidden xl:table-column"> ประเภท </TableHead>
                <TableHead class="hidden xl:table-column"> สถานะ </TableHead>
                <TableHead class="hidden xl:table-column"> วันที่ </TableHead>
                <TableHead class="text-right"> จำนวนเงิน </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div class="font-medium">Liam Johnson</div>
                  <div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
                </TableCell>
                <TableCell class="hidden xl:table-column"> ขาย </TableCell>
                <TableCell class="hidden xl:table-column">
                  <Badge class="text-xs" variant="outline"> อนุมัติ </Badge>
                </TableCell>
                <TableCell class="hidden md:table-cell lg:hidden xl:table-column">
                  2023-06-23
                </TableCell>
                <TableCell class="text-right"> $250.00 </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div class="font-medium">Olivia Smith</div>
                  <div class="hidden text-sm text-muted-foreground md:inline">
                    olivia@example.com
                  </div>
                </TableCell>
                <TableCell class="hidden xl:table-column"> คืนเงิน </TableCell>
                <TableCell class="hidden xl:table-column">
                  <Badge class="text-xs" variant="outline"> ปฏิเสธ </Badge>
                </TableCell>
                <TableCell class="hidden md:table-cell lg:hidden xl:table-column">
                  2023-06-24
                </TableCell>
                <TableCell class="text-right"> $150.00 </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div class="font-medium">Noah Williams</div>
                  <div class="hidden text-sm text-muted-foreground md:inline">noah@example.com</div>
                </TableCell>
                <TableCell class="hidden xl:table-column"> สมัครสมาชิก </TableCell>
                <TableCell class="hidden xl:table-column">
                  <Badge class="text-xs" variant="outline"> อนุมัติ </Badge>
                </TableCell>
                <TableCell class="hidden md:table-cell lg:hidden xl:table-column">
                  2023-06-25
                </TableCell>
                <TableCell class="text-right"> $350.00 </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div class="font-medium">Emma Brown</div>
                  <div class="hidden text-sm text-muted-foreground md:inline">emma@example.com</div>
                </TableCell>
                <TableCell class="hidden xl:table-column"> ขาย </TableCell>
                <TableCell class="hidden xl:table-column">
                  <Badge class="text-xs" variant="outline"> อนุมัติ </Badge>
                </TableCell>
                <TableCell class="hidden md:table-cell lg:hidden xl:table-column">
                  2023-06-26
                </TableCell>
                <TableCell class="text-right"> $450.00 </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div class="font-medium">Liam Johnson</div>
                  <div class="hidden text-sm text-muted-foreground md:inline">liam@example.com</div>
                </TableCell>
                <TableCell class="hidden xl:table-column"> ขาย </TableCell>
                <TableCell class="hidden xl:table-column">
                  <Badge class="text-xs" variant="outline"> อนุมัติ </Badge>
                </TableCell>
                <TableCell class="hidden md:table-cell lg:hidden xl:table-column">
                  2023-06-27
                </TableCell>
                <TableCell class="text-right"> $550.00 </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>ยอดขายล่าสุด</CardTitle>
        </CardHeader>
        <CardContent class="grid gap-8">
          <div class="flex items-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">Olivia Martin</p>
              <p class="text-sm text-muted-foreground">olivia.martin@email.com</p>
            </div>
            <div class="ml-auto font-medium">+$1,999.00</div>
          </div>
          <div class="flex items-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
              <AvatarImage src="/avatars/02.png" alt="Avatar" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">Jackson Lee</p>
              <p class="text-sm text-muted-foreground">jackson.lee@email.com</p>
            </div>
            <div class="ml-auto font-medium">+$39.00</div>
          </div>
          <div class="flex items-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
              <AvatarImage src="/avatars/03.png" alt="Avatar" />
              <AvatarFallback>IN</AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">Isabella Nguyen</p>
              <p class="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
            </div>
            <div class="ml-auto font-medium">+$299.00</div>
          </div>
          <div class="flex items-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
              <AvatarImage src="/avatars/04.png" alt="Avatar" />
              <AvatarFallback>WK</AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">วิลเลียม คิม</p>
              <p class="text-sm text-muted-foreground">will@email.com</p>
            </div>
            <div class="ml-auto font-medium">+$99.00</div>
          </div>
          <div class="flex items-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
              <AvatarImage src="/avatars/05.png" alt="Avatar" />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <p class="text-sm font-medium leading-none">โซเฟีย เดวิส</p>
              <p class="text-sm text-muted-foreground">sofia.davis@email.com</p>
            </div>
            <div class="ml-auto font-medium">+$39.00</div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="grid gap-4 md:gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle> สถิติการใช้งาน </CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src="https://wcs.smartdraw.com/chart/img/clustered-bar-chart.png?bn=15100111938"
            alt="Chart"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle> สถิติการขาย </CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src="https://www.microsoft.com/en-us/microsoft-365/blog/wp-content/uploads/sites/2/2012/06/Excel-charts-11.png"
            alt="Chart"
          />
        </CardContent>
      </Card>
    </div>
  </main>
</template>
