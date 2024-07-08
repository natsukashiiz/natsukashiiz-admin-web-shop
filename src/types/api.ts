import type { AxiosResponse } from 'axios'

export type ApiResponse<T> = Promise<AxiosResponse<T>>

export type PageResponse<T> = {
  list: T[]
  total: number
}

export interface Pagination {
  page?: number
  size?: number
  sort?: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  sub: string
  iss: string
  exp: number
  iat: number
  jti: string
  username: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}
