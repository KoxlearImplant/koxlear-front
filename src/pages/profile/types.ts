export interface ProfileType {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  gender?: 'male' | 'female' | null
  bio?: string | null
  avatarUrl?: string | null
  createdAt: string
  updatedAt: string
  telegram_id?: string | null
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  gender?: 'male' | 'female' | null
}
