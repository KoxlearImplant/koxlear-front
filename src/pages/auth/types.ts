// --- Types ---
export interface SendOtpRequest {
  email: string
}
export interface SendOtpResponse {
  session: string // uuid
}

export interface VerifyOtpRequest {
  session: string
  code: string
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  session: string
}

export interface RegisterResponse {
  message: string
  access: string // JWT access token
  refresh: string // JWT refresh token
}

export interface User {
  id: number
  email: string
  first_name: string
  last_name?: string
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  date_joined: string
}

export interface APIError {
  response?: {
    data?: {
      error?: string
    }
  }
}

export interface TokenObtainPairRequest {
  email: string
  password: string
}

export interface TokenObtainPairResponse {
  access: string
  refresh: string
}

export interface TokenRefreshRequest {
  refresh: string
}
export interface TokenRefreshResponse {
  access: string
}

export interface TokenVerifyRequest {
  token: string
}
