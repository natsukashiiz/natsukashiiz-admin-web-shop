import client from './request'
import type {
  ApiResponse,
  PageResponse,
  CategoryResponse,
  QueryCategoryRequest,
  CreateCategoryRequest,
  CategoryNameResponse
} from '@/types/api'

const queryCategoryList = (
  params: QueryCategoryRequest
): ApiResponse<PageResponse<CategoryResponse>> => client.get('/v1/categories', { params })

const queryCategoryNames = (): ApiResponse<CategoryNameResponse[]> =>
  client.get('/v1/categories/names')

const queryCategory = (id: number): ApiResponse<CategoryResponse> =>
  client.get(`/v1/categories/${id}`)

const createCategory = (data: CreateCategoryRequest): ApiResponse<CategoryResponse> =>
  client.post('/v1/categories', data)

const updateCategory = (id: number, data: CreateCategoryRequest): ApiResponse<CategoryResponse> =>
  client.put(`/v1/categories/${id}`, data)

export { queryCategoryList, queryCategoryNames, queryCategory, createCategory, updateCategory }
