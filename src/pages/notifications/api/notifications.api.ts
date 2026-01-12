import http from '@/service/http'
import type {
  NotificationListResponse,
  NotificationUnreadCount,
  NotificationsFilter,
  NotificationMarkViewedResponse,
} from '../types'

export const getNotifications = async (
  filter: NotificationsFilter
): Promise<NotificationListResponse> => {
  const response = await http.get<NotificationListResponse>('/notifications/', {
    params: filter,
  })
  return response.data
}

export const getUnreadCount = async (): Promise<NotificationUnreadCount> => {
  const response = await http.get<NotificationUnreadCount>(
    '/notifications/unread-count/'
  )
  return response.data
}

export const markNotificationViewed = async (
  notificationId: number
): Promise<NotificationMarkViewedResponse> => {
  const response = await http.post<NotificationMarkViewedResponse>(
    `/notifications/${notificationId}/mark-viewed/`
  )
  return response.data
}
