import client from './request'
import type { ApiResponse, PageResponse, CustomerResponse, QueryCustomerRequest } from '@/types/api'

const queryCustomerList = (
  params: QueryCustomerRequest
): ApiResponse<PageResponse<CustomerResponse>> => {
  return client.get('/v1/customers', { params })
}

export { queryCustomerList }
