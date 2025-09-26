import http from '@/service/http'
import type { BaseFilter } from '@/types'
import type { LessonGroup } from '@/pages/lessons/types.ts'

export interface LessonGroupFilter extends BaseFilter {
  search?: string
}

export interface LessonGroupsRes {
  count: number
  results: LessonGroup[]
}

export const getLessonGroups = (filter: LessonGroupFilter) => {
  return http
    .get<LessonGroupsRes>('/backoffice/lesson-groups/', { params: filter })
    .then((res) => res.data)
}
