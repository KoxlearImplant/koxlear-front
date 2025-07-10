import http from '@/service/http'
import type { LessonGroupType, LessonType } from '@/pages/lessons/types.ts'

export const getAllLessons = async () => {
  return http.get<LessonType[]>('/lessons').then((res) => res.data)
}

export const getLessonById = async (id: number): Promise<LessonType | null> => {
  return http.get<LessonType>(`/lessons/${id}`).then((res) => res.data)
}

export const getLessonGroups = async () => {
  return http.get<LessonGroupType[]>('/lesson-groups/').then((res) => res.data)
}
