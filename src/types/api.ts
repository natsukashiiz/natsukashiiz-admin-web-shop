import type { AxiosResponse } from 'axios'
import type { AdminRoles, DiscountType } from './enum'

export type ApiResponse<T> = Promise<AxiosResponse<T>>

export interface PageResponse<T> {
  list: T[]
  total: number
}

export interface Pagination {
  page?: number
  size?: number
  sort?: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  sub: string
  iss: string
  exp: number
  iat: number
  jti: string
  username: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ManagerResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  username: string
  role: AdminRoles
}

export interface CustomerResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  email: string
  username: string
  avatar: string | null
  verified: boolean
  deleted: boolean
  deletedAt: string | null
}
export interface ProductResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  category: CategoryResponse
  options: ProductOptionResponse[]
  images: ImageResponse[]
  description: string
  views: number
  orders: number
  rating: number
  reviews: number
}

export interface CategoryResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  thumbnail: string
  sort: number
}

export interface ImageResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  url: string
  sort: number
}

export interface ProductOptionResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  price: number
  quantity: number
  sort: number
  image: ImageResponse
}

export interface CarouselResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  title: string
  imageUrl: string
  sort: number
}

export interface VoucherResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  code: string
  discount: number
  discountType: DiscountType
  maxDiscount: number | null
  minOrderPrice: number
  quantity: number
  product: ProductResponse | null
  category: CategoryResponse | null
  beginAt: Date
  expiredAt: Date
  status: string
  thumbnail: string
}
