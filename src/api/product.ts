import client from './request'
import type {
  ApiResponse,
  PageResponse,
  ProductResponse,
  QueryProductRequest,
  CreateProductRequest,
  UpdateProductRequest
} from '@/types/api'

const queryProductList = (
  params: QueryProductRequest
): ApiResponse<PageResponse<ProductResponse>> => {
  return client.get('/v1/products', { params })
}

const queryProduct = (id: number): ApiResponse<ProductResponse> => {
  return client.get(`/v1/products/${id}`)
}

const createProduct = (data: CreateProductRequest): ApiResponse<ProductResponse> => {
  return client.post('/v1/products', data)
}

const updateProduct = (id: number, data: UpdateProductRequest): ApiResponse<ProductResponse> => {
  return client.put(`/v1/products/${id}`, data)
}

export { queryProductList, queryProduct, createProduct, updateProduct }
