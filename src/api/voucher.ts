import client from './request'
import type { ApiResponse, PageResponse, VoucherResponse, QueryVoucherRequest } from '@/types/api'

const queryVoucherList = (
  params: QueryVoucherRequest
): ApiResponse<PageResponse<VoucherResponse>> => {
  return client.get('/v1/vouchers', { params })
}

export { queryVoucherList }
