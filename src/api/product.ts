import client from './request'
import type {
  ApiResponse,
  PageResponse,
  ProductResponse,
  QueryProductRequest,
  CreateProductRequest
} from '@/types/api'

const queryProductList = (
  params: QueryProductRequest
): ApiResponse<PageResponse<ProductResponse>> => {
  return client.get('/v1/products', { params })
}

const createProduct = (data: CreateProductRequest): ApiResponse<ProductResponse> => {
  return client.post('/v1/products', data)
}

export { queryProductList, createProduct }
