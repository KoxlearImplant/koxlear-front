import http from '@/service/http'
import type { LessonType } from '@/pages/lessons/types.ts'

export const getAllLessons = async () => {
  return http.get<LessonType[]>('/lessons').then((res) => res.data)
}

export const getLessonById = async (id: number): Promise<LessonType | null> => {
  return http.get<LessonType>(`/lessons/${id}`).then((res) => res.data)
}
