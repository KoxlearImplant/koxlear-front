import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { getNotifications } from '../api/notifications.api'
import type { NotificationsFilter } from '../types'

export const useNotifications = (
  params?: Ref<Partial<NotificationsFilter>> | Partial<NotificationsFilter>
) => {
  const computedParams = computed(() => {
    const p = params && 'value' in params ? params.value : params
    return {
      limit: 20,
      offset: 0,
      ...p,
    } as NotificationsFilter
  })

  return useQuery({
    queryKey: ['notifications', computedParams],
    queryFn: () => getNotifications(computedParams.value),
    staleTime: 30 * 1000, // 30 seconds
  })
}
