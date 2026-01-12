import type { BaseFilter } from '@/types'

export interface Notification {
  notification_id: number
  notification_kind: string
  viewed: 'Y' | 'N'
  title: string
  note: string
  uri: string | null
  uri_param: string | null
  created_on: string
}

export interface NotificationListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Notification[]
}

export interface NotificationUnreadCount {
  count: number
}

export interface NotificationsFilter extends BaseFilter {
  viewed?: 'Y' | 'N'
  notification_kind?: string
}

export interface NotificationMarkViewedResponse {
  id: number
  viewed: 'Y'
}
