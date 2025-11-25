export interface Profile {
  is_staff: boolean
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  gender: 'male' | 'female' | null
  bio: string | null
  image: string | null
  date_joined: string
  telegram_id: string | null
  streak_days: number
  last_activity_date: null | string
  is_superuser: boolean
  lesson_begin_time: number
  lesson_end_time: number
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  gender?: 'male' | 'female' | null
  image?: File | null
}
