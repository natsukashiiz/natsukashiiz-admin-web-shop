import client from './request'
import type {
  ApiResponse,
  PageResponse,
  CarouselResponse,
  QueryCarouselRequest,
  CreateCarouselRequest
} from '@/types/api'

const queryCarouselList = (
  params: QueryCarouselRequest
): ApiResponse<PageResponse<CarouselResponse>> => {
  return client.get('/v1/carousels', { params })
}

const createCarousel = (data: CreateCarouselRequest): ApiResponse<CarouselResponse> => {
  return client.post('/v1/carousels', data)
}

export { queryCarouselList, createCarousel }
