import client from './request'
import type { ApiResponse, PageResponse, ManagerResponse, QueryManagerRequest } from '@/types/api'

const queryManagerList = (
  params: QueryManagerRequest
): ApiResponse<PageResponse<ManagerResponse>> => {
  return client.get('/v1/managers', { params })
}

export { queryManagerList }
