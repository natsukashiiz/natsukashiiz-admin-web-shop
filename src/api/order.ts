import client from './request'
import type {
  ApiResponse,
  PageResponse,
  QueryOrderRequest,
  OrderResponse,
  UpdateOrderShippingRequest
} from '@/types/api'

const queryOrderList = (params: QueryOrderRequest): ApiResponse<PageResponse<OrderResponse>> =>
  client.get('/v1/orders', { params })

const queryOrderStatusCount = (): ApiResponse<{ [key: string]: number }> =>
  client.get('/v1/orders/status/count')

const updateShipping = (id: string, data: UpdateOrderShippingRequest): ApiResponse<OrderResponse> =>
  client.patch(`/v1/orders/${id}/shipping`, data)

const cancelOrder = (id: string): ApiResponse<OrderResponse> =>
  client.patch(`/v1/orders/${id}/cancel`)

export { queryOrderList, queryOrderStatusCount, updateShipping, cancelOrder }
