import client from './request'
import type { ApiResponse, PageResponse, CarouselResponse, QueryCarouselRequest } from '@/types/api'

const queryCarouselList = (
  params: QueryCarouselRequest
): ApiResponse<PageResponse<CarouselResponse>> => {
  return client.get('/v1/carousels', { params })
}

export { queryCarouselList }
