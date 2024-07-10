import client from './request'
import type {
  ApiResponse,
  PageResponse,
  CategoryResponse,
  QueryCategoryRequest,
  CreateCategoryRequest
} from '@/types/api'

const queryCategoryList = (
  params: QueryCategoryRequest
): ApiResponse<PageResponse<CategoryResponse>> => client.get('/v1/categories', { params })

const queryCategoryNames = (): ApiResponse<CategoryResponse[]> => client.get('/v1/categories/names')

const createCategory = (data: CreateCategoryRequest): ApiResponse<CategoryResponse> =>
  client.post('/v1/categories', data)

export { queryCategoryList, queryCategoryNames, createCategory }
