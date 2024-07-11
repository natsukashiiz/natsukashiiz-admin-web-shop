import client from './request'
import type {
  ApiResponse,
  PageResponse,
  VoucherResponse,
  QueryVoucherRequest,
  CreateVoucherRequest
} from '@/types/api'

const queryVoucherList = (
  params: QueryVoucherRequest
): ApiResponse<PageResponse<VoucherResponse>> => {
  return client.get('/v1/vouchers', { params })
}

const createVoucher = (data: CreateVoucherRequest): ApiResponse<VoucherResponse> => {
  return client.post('/v1/vouchers', data)
}

export { queryVoucherList, createVoucher }
