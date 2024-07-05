import type { LucideProps } from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'

export interface MenuItem {
  title: string
  name: string
  href?: string
  icon: FunctionalComponent<LucideProps, {}, any, {}>
  children?: MenuItem[]
}
