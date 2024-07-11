import client from './request'
import type {
  ApiResponse,
  PageResponse,
  VoucherResponse,
  QueryVoucherRequest,
  CreateVoucherRequest,
  UpdateVoucherRequest
} from '@/types/api'

const queryVoucherList = (
  params: QueryVoucherRequest
): ApiResponse<PageResponse<VoucherResponse>> => {
  return client.get('/v1/vouchers', { params })
}

const queryVoucher = (id: number): ApiResponse<VoucherResponse> => {
  return client.get(`/v1/vouchers/${id}`)
}

const createVoucher = (data: CreateVoucherRequest): ApiResponse<VoucherResponse> => {
  return client.post('/v1/vouchers', data)
}

const updateVoucher = (id: number, data: UpdateVoucherRequest): ApiResponse<VoucherResponse> => {
  return client.put(`/v1/vouchers/${id}`, data)
}

export { queryVoucherList, queryVoucher, createVoucher, updateVoucher }
