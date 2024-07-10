import client from './request'
import type { ApiResponse, PageResponse, ProductResponse, QueryProductRequest } from '@/types/api'

const queryProductList = (
  params: QueryProductRequest
): ApiResponse<PageResponse<ProductResponse>> => {
  return client.get('/v1/products', { params })
}

export { queryProductList }
