import client from './request'
import type { ApiResponse, PageResponse, CategoryResponse, QueryCategoryRequest } from '@/types/api'

const queryCategoryList = (
  params: QueryCategoryRequest
): ApiResponse<PageResponse<CategoryResponse>> => client.get('/v1/categories', { params })

const queryCategoryNames = (): ApiResponse<CategoryResponse[]> => client.get('/v1/categories/names')

export { queryCategoryList, queryCategoryNames }
