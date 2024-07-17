import client from './request'
import type {
  ApiResponse,
  PageResponse,
  ManagerResponse,
  QueryManagerRequest,
  CreateManagerRequest,
  UpdateManagerRequest
} from '@/types/api'

const queryManagerList = (
  params: QueryManagerRequest
): ApiResponse<PageResponse<ManagerResponse>> => {
  return client.get('/v1/managers', { params })
}

const queryManager = (id: number): ApiResponse<ManagerResponse> => {
  return client.get(`/v1/managers/${id}`)
}

const createManager = (data: CreateManagerRequest): ApiResponse<ManagerResponse> => {
  return client.post('/v1/managers', data)
}

const updateManager = (id: number, data: UpdateManagerRequest): ApiResponse<ManagerResponse> => {
  return client.put(`/v1/managers/${id}`, data)
}

export { queryManagerList, queryManager, createManager, updateManager }
