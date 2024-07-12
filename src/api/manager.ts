import client from './request'
import type {
  ApiResponse,
  PageResponse,
  ManagerResponse,
  QueryManagerRequest,
  CreateManagerRequest
} from '@/types/api'

const queryManagerList = (
  params: QueryManagerRequest
): ApiResponse<PageResponse<ManagerResponse>> => {
  return client.get('/v1/managers', { params })
}

const createManager = (data: CreateManagerRequest): ApiResponse<ManagerResponse> => {
  return client.post('/v1/managers', data)
}

export { queryManagerList, createManager }
