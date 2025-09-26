import { useQuery } from '@tanstack/vue-query'
import type { ComputedRef } from 'vue'
import {
  getLessonGroups,
  type LessonGroupFilter,
} from '@/pages/teacher/api/lesson-group.ts'

export const useLessonGroups = (filter: ComputedRef<LessonGroupFilter>) => {
  return useQuery({
    queryKey: ['lesson-groups', filter.value],
    queryFn: () => getLessonGroups(filter.value),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
