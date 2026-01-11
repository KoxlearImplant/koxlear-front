<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'
import {
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
  PlusIcon,
  CalendarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'
import useToasts from '@/lib/toast.ts'
import {
  getAssignments,
  deleteAssignment,
  createAssignment,
  updateAssignment,
  type AssignmentRes,
  type AssignmentReq,
} from './api/assignments'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getStudents, type StudentRes } from './api/students'
import { getLessons } from './api/lessons'
import type { ILesson } from '@/pages/lessons/types'

const toast = useToasts()
const { t } = useI18n()

// State
const assignments = ref<AssignmentRes[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const limit = ref(20)
const offset = ref(0)
const totalCount = ref(0)

// Modal state
const showAssignmentModal = ref(false)
const isSubmitting = ref(false)
const editingAssignment = ref<AssignmentRes | null>(null)

// Form data
const formData = ref<AssignmentReq>({
  student: 0,
  lesson: 0,
  begin_time: '',
  end_time: '',
  passing_score: 70,
})

// Students and Lessons
const students = ref<StudentRes[]>([])
const lessons = ref<ILesson[]>([])
const loadingStudents = ref(false)
const loadingLessons = ref(false)

// Load students
const loadStudents = async () => {
  loadingStudents.value = true
  try {
    const response = await getStudents({ limit: 100, offset: 0 })
    students.value = response.results
  } catch {
    toast.error('Failed to load students')
  } finally {
    loadingStudents.value = false
  }
}

// Load lessons
const loadLessons = async () => {
  loadingLessons.value = true
  try {
    const response = await getLessons({ limit: 100, offset: 0 })
    lessons.value = response.results
  } catch {
    toast.error('Failed to load lessons')
  } finally {
    loadingLessons.value = false
  }
}

// Open create modal
const openCreateModal = () => {
  editingAssignment.value = null
  formData.value = {
    student: 0,
    lesson: 0,
    begin_time: '',
    end_time: '',
    passing_score: 70,
  }
  showAssignmentModal.value = true
}

// Open edit modal
const openEditModal = (assignment: AssignmentRes) => {
  editingAssignment.value = assignment
  formData.value = {
    student: assignment.student,
    lesson: assignment.lesson,
    begin_time: assignment.begin_time,
    end_time: assignment.end_time,
    passing_score: assignment.passing_score,
  }
  showAssignmentModal.value = true
}

// Close modal
const closeModal = () => {
  showAssignmentModal.value = false
  editingAssignment.value = null
}

// Submit form
const submitForm = async () => {
  // Validate
  if (!formData.value.student || !formData.value.lesson) {
    toast.error('Please select student and lesson')
    return
  }
  if (!formData.value.begin_time || !formData.value.end_time) {
    toast.error('Please select begin and end time')
    return
  }

  isSubmitting.value = true
  try {
    if (editingAssignment.value) {
      await updateAssignment(editingAssignment.value.id, formData.value)
      toast.success('Assignment updated successfully')
    } else {
      await createAssignment(formData.value)
      toast.success('Assignment created successfully')
    }
    closeModal()
    await loadAssignments()
  } catch {
    toast.error(
      editingAssignment.value
        ? 'Failed to update assignment'
        : 'Failed to create assignment'
    )
  } finally {
    isSubmitting.value = false
  }
}

// Load assignments
const loadAssignments = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await getAssignments({
      limit: limit.value,
      offset: offset.value,
    })
    assignments.value = response.data.results
    totalCount.value = response.data.count
  } catch (err: unknown) {
    error.value =
      err instanceof Error ? err.message : 'Failed to load assignments'
    toast.error('Failed to load assignments')
  } finally {
    isLoading.value = false
  }
}

// Delete assignment
const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this assignment?')) return

  try {
    await deleteAssignment(id)
    toast.success('Assignment deleted successfully')
    await loadAssignments()
  } catch {
    toast.error('Failed to delete assignment')
  }
}

// Format date
const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

// Get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'FAILED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
}

// Get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return CheckCircleIcon
    case 'FAILED':
      return XCircleIcon
    default:
      return ClockIcon
  }
}

// Pagination
const currentPage = computed(() => Math.floor(offset.value / limit.value) + 1)
const totalPages = computed(() => Math.ceil(totalCount.value / limit.value))

const goToPage = (page: number) => {
  offset.value = (page - 1) * limit.value
  loadAssignments()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

onMounted(() => {
  loadAssignments()
  loadStudents()
  loadLessons()
})
</script>

<template>
  <div class="container mx-auto p-2 sm:p-6">
    <div class="mb-4 sm:mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
        {{ t('teacher.assignments.title', 'My Assignments') }}
      </h1>
      <p
        class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2"
      >
        {{
          t(
            'teacher.assignments.description',
            'Manage assignments for your students'
          )
        }}
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row justify-between sm:items-center p-3 sm:p-6 border-b dark:border-gray-700 gap-3 sm:gap-0"
      >
        <h2 class="text-lg sm:text-xl font-semibold">
          {{ t('teacher.assignments.list', 'Assignments List') }}
          <span
            v-if="totalCount > 0"
            class="text-xs sm:text-sm font-normal text-gray-500 ml-2"
          >
            ({{ totalCount }} total)
          </span>
        </h2>
        <div class="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            @click="loadAssignments"
            :disabled="isLoading"
            class="sm:flex-none"
          >
            <ArrowPathIcon
              class="w-4 h-4 sm:mr-2"
              :class="{ 'animate-spin': isLoading }"
            />
            <span class="hidden sm:inline">{{
              t('common.refresh', 'Refresh')
            }}</span>
          </Button>
          <Button size="sm" @click="openCreateModal" class="sm:flex-none">
            <PlusIcon class="w-4 h-4 mr-2" />
            <span class="text-xs sm:text-sm">{{
              t('teacher.assignments.create', 'Create Assignment')
            }}</span>
          </Button>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading && assignments.length === 0"
        class="p-4 sm:p-12 text-center"
      >
        <ArrowPathIcon
          class="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-4 animate-spin text-gray-400"
        />
        <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          {{ t('common.loading', 'Loading...') }}
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 sm:p-12 text-center">
        <XCircleIcon
          class="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-red-500"
        />
        <p class="text-sm sm:text-base text-red-600 dark:text-red-400">
          {{ error }}
        </p>
        <Button variant="outline" class="mt-4" @click="loadAssignments">
          {{ t('common.tryAgain', 'Try Again') }}
        </Button>
      </div>

      <!-- Empty State -->
      <div v-else-if="assignments.length === 0" class="p-4 sm:p-12 text-center">
        <AcademicCapIcon
          class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400"
        />
        <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-2">
          {{
            t(
              'teacher.assignments.empty',
              'No assignments yet. Create your first assignment!'
            )
          }}
        </p>
        <Button class="mt-4" @click="openCreateModal">
          <PlusIcon class="w-4 h-4 mr-2" />
          {{ t('teacher.assignments.create', 'Create Assignment') }}
        </Button>
      </div>

      <!-- Assignments List -->
      <div v-else class="divide-y dark:divide-gray-700">
        <div
          v-for="assignment in assignments"
          :key="assignment.id"
          class="p-3 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0"
          >
            <div class="flex-1 pr-16 sm:pr-0">
              <div
                class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1.5 sm:mb-2"
              >
                <h3
                  class="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate"
                >
                  {{
                    assignment.lesson_full?.title ||
                    'Lesson #' + assignment.lesson
                  }}
                </h3>
                <span
                  :class="getStatusColor(assignment.status)"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium w-fit"
                >
                  <component
                    :is="getStatusIcon(assignment.status)"
                    class="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                  />
                  {{ assignment.status }}
                </span>
              </div>

              <!-- Student Info -->
              <div
                v-if="assignment.student_full"
                class="flex items-center gap-1.5 mb-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
              >
                <UserIcon class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span class="font-medium truncate">
                  {{ assignment.student_full.first_name }}
                  {{ assignment.student_full.last_name }}
                </span>
                <span
                  class="text-gray-500 dark:text-gray-400 truncate hidden sm:inline"
                >
                  (@{{ assignment.student_full.username }})
                </span>
              </div>

              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400"
              >
                <div class="flex items-center gap-1.5">
                  <CalendarIcon class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span class="truncate"
                    >Start: {{ formatDate(assignment.begin_time) }}</span
                  >
                </div>
                <div class="flex items-center gap-1.5">
                  <CalendarIcon class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span class="truncate"
                    >End: {{ formatDate(assignment.end_time) }}</span
                  >
                </div>
              </div>
            </div>

            <div
              class="absolute top-3 right-3 flex gap-1 sm:static sm:gap-2 sm:ml-4 sm:justify-start"
            >
              <Button
                variant="outline"
                size="sm"
                @click="openEditModal(assignment)"
                class="flex-1 sm:flex-none h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
              >
                <PencilIcon class="w-4 h-4" />
                <span class="ml-2 hidden sm:inline">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                @click="handleDelete(assignment.id)"
                class="flex-1 sm:flex-none h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
              >
                <TrashIcon class="w-4 h-4 text-red-600" />
                <span class="ml-2 hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-3 sm:py-4 border-t dark:border-gray-700 gap-3 sm:gap-0"
      >
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            @click="prevPage"
            :disabled="currentPage === 1"
            class="flex-1 sm:flex-none"
          >
            {{ t('common.previous', 'Previous') }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex-1 sm:flex-none"
          >
            {{ t('common.next', 'Next') }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Assignment Modal -->
    <Dialog :open="showAssignmentModal" @update:open="closeModal">
      <DialogContent class="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {{
              editingAssignment
                ? t('teacher.assignments.edit', 'Edit Assignment')
                : t('teacher.assignments.create', 'Create Assignment')
            }}
          </DialogTitle>
          <DialogDescription class="text-xs sm:text-sm">
            {{
              editingAssignment
                ? t(
                    'teacher.assignments.editDescription',
                    'Update assignment details'
                  )
                : t(
                    'teacher.assignments.createDescription',
                    'Create a new assignment for a student'
                  )
            }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-4">
          <!-- Student Select -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ t('teacher.assignments.student', 'Student') }} *
            </label>
            <select
              v-model="formData.student"
              class="w-full px-3 py-2 text-sm sm:text-base border rounded-md dark:bg-gray-800 dark:border-gray-700"
              :disabled="loadingStudents"
            >
              <option :value="0">
                {{ t('teacher.assignments.selectStudent', 'Select a student') }}
              </option>
              <option
                v-for="student in students"
                :key="student.id"
                :value="student.id"
              >
                {{ student.first_name }} {{ student.last_name }} (@{{
                  student.username
                }})
              </option>
            </select>
          </div>

          <!-- Lesson Select -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ t('teacher.assignments.lesson', 'Lesson') }} *
            </label>
            <select
              v-model="formData.lesson"
              class="w-full px-3 py-2 text-sm sm:text-base border rounded-md dark:bg-gray-800 dark:border-gray-700"
              :disabled="loadingLessons"
            >
              <option :value="0">
                {{ t('teacher.assignments.selectLesson', 'Select a lesson') }}
              </option>
              <option
                v-for="lesson in lessons"
                :key="lesson.id"
                :value="lesson.id"
              >
                {{ lesson.title }}
              </option>
            </select>
          </div>

          <!-- Begin Time -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ t('teacher.assignments.beginTime', 'Begin Time') }} *
            </label>
            <input
              type="datetime-local"
              v-model="formData.begin_time"
              class="w-full px-3 py-2 text-sm sm:text-base border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <!-- End Time -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ t('teacher.assignments.endTime', 'End Time') }} *
            </label>
            <input
              type="datetime-local"
              v-model="formData.end_time"
              class="w-full px-3 py-2 text-sm sm:text-base border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <!-- Passing Score -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ t('teacher.assignments.passingScore', 'Passing Score') }} (%)
            </label>
            <input
              type="number"
              v-model="formData.passing_score"
              min="0"
              max="100"
              class="w-full px-3 py-2 text-sm sm:text-base border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        <DialogFooter class="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            @click="closeModal"
            :disabled="isSubmitting"
            class="w-full sm:w-auto"
          >
            {{ t('common.cancel', 'Cancel') }}
          </Button>
          <Button
            @click="submitForm"
            :disabled="isSubmitting"
            class="w-full sm:w-auto"
          >
            {{
              isSubmitting
                ? t('common.saving', 'Saving...')
                : t('common.save', 'Save')
            }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
