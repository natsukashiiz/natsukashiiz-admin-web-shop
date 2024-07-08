import type { ApiResponse, LoginRequest, TokenResponse, RefreshTokenRequest } from '@/types/api'
import { create } from '@/api/request'

const client = create()

const login = (body: LoginRequest): ApiResponse<TokenResponse> =>
  client.post('/v1/auth/login', body)

const refresh = (body: RefreshTokenRequest): ApiResponse<TokenResponse> =>
  client.post('/v1/auth/refresh', body)

export { login, refresh }
