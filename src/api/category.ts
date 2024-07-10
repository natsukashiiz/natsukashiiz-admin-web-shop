import client from './request'
import type { ApiResponse, PageResponse, CategoryResponse, QueryCategoryRequest } from '@/types/api'

const queryCategoryList = (
  params: QueryCategoryRequest
): ApiResponse<PageResponse<CategoryResponse>> => {
  return client.get('/v1/categories', { params })
}

export { queryCategoryList }
