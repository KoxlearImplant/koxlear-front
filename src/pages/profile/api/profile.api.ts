import http from '@/service/http'
import type { ProfileType, UpdateProfileRequest } from '@/pages/profile/types'

export const getProfile = async (): Promise<ProfileType | null> => {
  return http.get<ProfileType>('/profile/').then((res) => res.data)
}

export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<ProfileType> => {
  return http.patch<ProfileType>('/profile/', data).then((res) => res.data)
}
