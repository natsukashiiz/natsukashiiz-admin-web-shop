import type { AxiosResponse } from 'axios'
import type { AdminRoles, DiscountType, CommonStatus, OrderStatus } from './enum'

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

export interface FileStoreResponse {
  name: string
  type: string
  url: string
}

export interface ManagerResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  username: string
  role: AdminRoles
  status: CommonStatus
}

export interface QueryManagerRequest extends Pagination {
  id?: number
  username?: string
  role?: AdminRoles
  status?: CommonStatus
}

export interface CreateManagerRequest {
  username: string
  password: string
  role: AdminRoles
  status: CommonStatus
}

export interface UpdateManagerRequest {
  username: string
  password: string
  role: AdminRoles
  status: CommonStatus
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

export interface QueryCustomerRequest extends Pagination {
  id?: number
  email?: string
  username?: string
  verified?: boolean
  deleted?: boolean
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
  status: CommonStatus
}

export interface QueryProductRequest extends Pagination {
  id?: number
  name?: string
  'category.id'?: number
  status?: CommonStatus
}

export interface CreateProductRequest {
  name: string
  category: UpdateCategoryRequest
  options: CreateProductOptionRequest[]
  images: CreateProductImageRequest[]
  description: string
  status: CommonStatus
}

export interface UpdateProductRequest {
  name: string
  category: UpdateCategoryRequest
  options: UpdateProductOptionRequest[]
  images: UpdateProductImageRequest[]
  description: string
  status: CommonStatus
}

export interface CategoryResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  name: string
  thumbnail: string
  sort: number
  status: CommonStatus
}

export interface CategoryNameResponse {
  id: number
  name: string
  productCount: number
}

export interface QueryCategoryRequest extends Pagination {
  id?: number
  name?: string
  status?: CommonStatus
}

export interface CreateCategoryRequest {
  name: string
  thumbnail: string
  sort: number
  status: CommonStatus
}

export interface UpdateCategoryRequest {
  id?: number
  name?: string
  thumbnail?: string
  sort?: number
  status?: CommonStatus
}

export interface ImageResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  url: string
  sort: number
}

export interface CreateProductImageRequest {
  url: string
  sort: number
}

export interface UpdateProductImageRequest {
  id?: number
  url?: string
  sort?: number
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

export interface QueryProductOptionRequest extends Pagination {}

export interface CreateProductOptionRequest {
  name: string
  price: number
  quantity: number
  sort: number
  image?: {
    url: string
  }
}

export interface UpdateProductOptionRequest {
  id?: number
  name?: string
  price?: number
  quantity?: number
  sort?: number
  image?: {
    id?: number
    url?: string
    sort?: number
  }
}

export interface CarouselResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  title: string
  imageUrl: string
  sort: number
  status: CommonStatus
}

export interface QueryCarouselRequest extends Pagination {
  id?: number
  title?: string
  status?: CommonStatus
}

export interface CreateCarouselRequest {
  title: string
  imageUrl: string
  sort: number
  status: CommonStatus
}

export interface UpdateCarouselRequest {
  title: string
  imageUrl: string
  sort: number
  status: CommonStatus
}

export interface VoucherResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  code: string
  discount: number
  discountType: DiscountType
  maxDiscount?: number
  minOrderPrice: number
  quantity: number
  product: ProductResponse | null
  category: CategoryResponse | null
  beginAt: string
  expiredAt: string
  status: CommonStatus
  thumbnail: string
}

export interface QueryVoucherRequest extends Pagination {
  id?: number
  code?: string
  discountType?: DiscountType
  status?: CommonStatus
}

export interface CreateVoucherRequest {
  code: string
  discount: number
  discountType: DiscountType
  maxDiscount: number | null
  minOrderPrice: number
  quantity: number
  product?: number
  category?: number
  beginAt: string | Date
  expiredAt: string | Date
  status: CommonStatus
  thumbnail: string
}

export interface UpdateVoucherRequest {
  discount: number
  discountType: DiscountType
  maxDiscount: number | null
  minOrderPrice: number
  quantity: number
  product?: number
  category?: number
  beginAt: string | Date
  expiredAt: string | Date
  status: CommonStatus
  thumbnail: string
}

export interface QueryOrderRequest extends Pagination {
  id?: string
  'user.id'?: number
  firstName?: string
  lastName?: string
  mobile?: string
  address?: string
  status?: OrderStatus
  chargeId?: string
  payMethod?: string
  paidAt?: string
  cancelAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface OrderResponse {
  id: string
  user: CustomerResponse
  firstName: string
  lastName: string
  mobile: string
  address: string
  items: OrderItem[]
  totalPay: number
  totalDiscount: number | null
  actualPay: number
  status: OrderStatus
  chargeId: null | string
  payUrl: null | string
  payExpire: number
  payMethod: null | string
  trackingNumber: null | string
  paidAt: Date | null
  cancelAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: number
  createdAt: Date
  updatedAt: Date
  productId: number
  productName: string
  productThumbnail: string
  optionId: number
  optionName: string
  categoryId: number
  categoryName: string
  price: number
  quantity: number
  totalPrice: number
}

export interface UpdateOrderShippingRequest {
  trackingNumber: string
}

export interface QueryOrdersResponse {
  orders: OrderResponse[]
  statusCount: {
    [key in OrderStatus]: number
  }
  total: number
}
