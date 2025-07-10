import { useQuery } from '@tanstack/vue-query'
import { getProfile } from '@/pages/profile/api/profile.api'

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
