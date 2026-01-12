import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { markNotificationViewed } from '../api/notifications.api'

export const useMarkViewed = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationViewed(notificationId),
    onSuccess: () => {
      // Invalidate notifications list and unread count
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
