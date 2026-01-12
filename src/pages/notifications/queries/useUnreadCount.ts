import { useQuery } from '@tanstack/vue-query'
import { getUnreadCount } from '../api/notifications.api'

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    refetchInterval: 60 * 1000, // Poll every 60 seconds
    staleTime: 30 * 1000, // 30 seconds
  })
}
