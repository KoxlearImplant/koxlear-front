import type { BaseFilter } from '@/types.ts'
import http from '@/service/http'

export interface AssignmentsFilter extends BaseFilter {
  student?: number
  status?: string
}

export interface AssignmentRes {
  id: number
  student: number
  lessons: number[]
  begin_time: string
  end_time: string
  passing_score: number
  status: string
  created_at: string
  updated_at: string
  assignment_lessons: {
    id: number
    assignment: number
    lesson: number
    score: number
    status: 'PENDING' | 'COMPLETED' | 'FAILED'
  }[]
}

export interface AssignmentReq {
  student: number
  lessons: number[]
  begin_time: string
  end_time: string
  passing_score: number
}

export interface AssignmentsRes {
  count: number
  results: AssignmentRes[]
}

export const getAssignments = async (filter: AssignmentsFilter) => {
  return await http.get<AssignmentsRes>('/backoffice/assignments/', {
    params: {
      ...filter,
    },
  })
}

export const createAssignment = async (data: AssignmentReq) => {
  const res = await http.post<AssignmentRes>('/backoffice/assignments/', data)
  return res.data
}

export const updateAssignment = async (
  id: number,
  data: Partial<AssignmentReq>
) => {
  const res = await http.patch<AssignmentRes>(
    `/backoffice/assignments/${id}/`,
    data
  )
  return res.data
}

export const deleteAssignment = async (id: number) => {
  const res = await http.delete(`/backoffice/assignments/${id}/`)
  return res.data
}
