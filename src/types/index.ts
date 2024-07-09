import type { LucideProps } from 'lucide-vue-next'
import type { FunctionalComponent, InputTypeHTMLAttribute } from 'vue'

export interface MenuItem {
  title: string
  name: string
  href?: string
  icon: FunctionalComponent<LucideProps, {}, any, {}>
  children?: MenuItem[]
}

export interface TableColumn {
  key: string
  label: string
  hidden?: boolean
  class?: string
}

export interface Pagination {
  page: number
  size: number
  total: number
}

export interface TableSearchBy {
  key: string
  label: string
  type: InputTypeHTMLAttribute
}

export interface TableSearch {
  query?: string
  by: TableSearchBy
}
