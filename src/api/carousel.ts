import client from './request'
import type {
  ApiResponse,
  PageResponse,
  CarouselResponse,
  QueryCarouselRequest,
  CreateCarouselRequest,
  UpdateCarouselRequest
} from '@/types/api'

const queryCarouselList = (
  params: QueryCarouselRequest
): ApiResponse<PageResponse<CarouselResponse>> => {
  return client.get('/v1/carousels', { params })
}

const queryCarousel = (id: number): ApiResponse<CarouselResponse> => {
  return client.get(`/v1/carousels/${id}`)
}

const createCarousel = (data: CreateCarouselRequest): ApiResponse<CarouselResponse> => {
  return client.post('/v1/carousels', data)
}

const updateCarousel = (id: number, data: UpdateCarouselRequest): ApiResponse<CarouselResponse> => {
  return client.put(`/v1/carousels/${id}`, data)
}

export { queryCarouselList, queryCarousel, createCarousel, updateCarousel }
