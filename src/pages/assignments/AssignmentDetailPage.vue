<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import LessonItem from '@/pages/lessons/components/LessonItem.vue'
import type { ILessonItem } from '@/pages/lessons/types'
import { useAssignmentById } from './queries/useAssignments'
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/vue/24/solid'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const assignmentId = computed(() => Number(route.params.id))

const {
  data: assignmentResponse,
  isLoading,
  error,
} = useAssignmentById(assignmentId)

const assignment = computed(() => assignmentResponse.value?.data)

// Convert assignment lesson items to ILessonItem format
const lessonItems = computed<ILessonItem[]>(() => {
  if (!assignment.value?.lesson_full?.items) return []
  return assignment.value.lesson_full.items.map((item) => ({
    id: item.id,
    type: item.type as 'tts' | 'tutorial',
    word: item.word,
    audio: item.audio_url || item.audio,
    image: item.image_url || item.image,
    state: null, // Assignment items start fresh
  }))
})

const activeItemIndex = ref(0)
const completedItemIds = ref<Set<number>>(new Set())

// Initialize activeItemIndex
const initializeActiveItemIndex = () => {
  if (!lessonItems.value.length) {
    activeItemIndex.value = 0
    return
  }

  if (route.query.item !== undefined) {
    const urlIndex = Number(route.query.item)
    activeItemIndex.value = Math.max(
      0,
      Math.min(urlIndex, lessonItems.value.length - 1)
    )
  } else {
    activeItemIndex.value = 0
  }
}

// Watch for assignment data changes
watch(
  lessonItems,
  (items) => {
    if (items.length > 0) {
      initializeActiveItemIndex()
    }
  },
  { immediate: true }
)

// Watch for route query changes
watch(
  () => route.query.item,
  (newItemQuery) => {
    if (lessonItems.value.length > 0 && newItemQuery !== undefined) {
      const urlIndex = Number(newItemQuery)
      activeItemIndex.value = Math.max(
        0,
        Math.min(urlIndex, lessonItems.value.length - 1)
      )
    }
  }
)

// Navigation functions
const goBack = () => {
  router.push('/dashboard/assignments')
}

const goToNextItem = () => {
  if (activeItemIndex.value >= lessonItems.value.length - 1) {
    return
  }

  const nextIndex = activeItemIndex.value + 1
  router.push({
    path: `/dashboard/assignments/${assignmentId.value}`,
    query: { item: nextIndex.toString() },
  })
  scrollToTop()
}

const goToPreviousItem = () => {
  if (activeItemIndex.value > 0) {
    const prevIndex = activeItemIndex.value - 1
    router.push({
      path: `/dashboard/assignments/${assignmentId.value}`,
      query: { item: prevIndex.toString() },
    })
    scrollToTop()
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Handle item completion from child component
const handleItemCompleted = (itemId: number, state: 'correct' | 'wrong') => {
  if (state === 'correct') {
    completedItemIds.value.add(itemId)
  }

  // Update the item's state in our local data
  const item = lessonItems.value.find((i) => i.id === itemId)
  if (item) {
    item.state = {
      id: itemId,
      state: state,
      wrong_count: state === 'wrong' ? 1 : 0,
      created_at: new Date().toISOString(),
      last_submit_at: new Date().toISOString(),
    }
  }
}

const activeItem = computed<ILessonItem | null>(() => {
  if (!lessonItems.value.length) return null
  return lessonItems.value[activeItemIndex.value]
})

// Calculate progress based on completed items
const progress = computed(() => {
  if (!lessonItems.value.length) return 0
  const completedItems = lessonItems.value.filter(
    (item) => item.state?.state === 'correct'
  ).length
  return Math.round((completedItems / lessonItems.value.length) * 100)
})

// Check if assignment is fully completed
const isAssignmentCompleted = computed(() => {
  if (!lessonItems.value.length) return false
  return lessonItems.value.every((item) => item.state?.state === 'correct')
})

const isLastItem = computed(() => {
  return activeItemIndex.value === lessonItems.value.length - 1
})

// Check if assignment is expired
const isExpired = computed(() => {
  if (!assignment.value) return false
  const now = new Date()
  const end = new Date(assignment.value.end_time)
  return now > end
})

// Format date helper
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

// Get status color
const getStatusColor = computed(() => {
  if (!assignment.value) return ''
  if (assignment.value.status === 'COMPLETED') {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  if (isExpired.value) {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
})

// Get status text
const getStatusText = computed(() => {
  if (!assignment.value) return ''
  if (assignment.value.status === 'COMPLETED') return 'COMPLETED'
  if (isExpired.value) return 'EXPIRED'
  return 'IN PROGRESS'
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header with back button and title -->
    <div class="mb-6 flex items-center">
      <button
        @click="goBack"
        class="mr-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
      >
        <ArrowLeftIcon class="h-5 w-5 text-gray-600" />
      </button>
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
          {{
            assignment?.lesson_full?.title ||
            t('assignments.assignmentDetail', 'Assignment')
          }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ assignment?.lesson_full?.group_name }}
        </p>
      </div>
      <span
        v-if="assignment"
        :class="getStatusColor"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
      >
        <component
          :is="assignment.status === 'COMPLETED' ? CheckCircleIcon : ClockIcon"
          class="w-4 h-4 mr-1"
        />
        {{ getStatusText }}
      </span>
    </div>

    <!-- Assignment info card -->
    <div
      v-if="assignment"
      class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <CalendarIcon class="w-4 h-4" />
          <span
            >{{ t('assignments.startTime', 'Start') }}:
            {{ formatDate(assignment.begin_time) }}</span
          >
        </div>
        <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <CalendarIcon class="w-4 h-4" />
          <span
            >{{ t('assignments.endTime', 'End') }}:
            {{ formatDate(assignment.end_time) }}</span
          >
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center">
        <ArrowPathIcon class="animate-spin h-12 w-12 text-blue-500 mb-4" />
        <p class="text-gray-500">
          {{ t('assignments.loading', 'Loading assignment...') }}
        </p>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error || !assignment"
      class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
    >
      <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-lg font-semibold text-gray-800 mb-2">
        {{ t('assignments.notFound', 'Assignment not found') }}
      </h2>
      <p class="text-gray-600">
        {{
          t(
            'assignments.returnToAssignments',
            'Please return to the assignments page'
          )
        }}
      </p>
      <Button @click="goBack" class="mt-4 bg-blue-500 hover:bg-blue-600">
        {{ t('assignments.backToAssignments', 'Back to Assignments') }}
      </Button>
    </div>

    <!-- Expired state -->
    <div
      v-else-if="isExpired && assignment.status !== 'COMPLETED'"
      class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center"
    >
      <ClockIcon class="h-12 w-12 text-gray-500 mx-auto mb-4" />
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        {{ t('assignments.expired', 'Assignment Expired') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        {{
          t(
            'assignments.expiredMessage',
            'This assignment is no longer available.'
          )
        }}
      </p>
      <Button @click="goBack" class="mt-4">
        {{ t('assignments.backToAssignments', 'Back to Assignments') }}
      </Button>
    </div>

    <!-- Completed state -->
    <div
      v-else-if="isAssignmentCompleted || assignment.status === 'COMPLETED'"
      class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
    >
      <CheckCircleIcon class="h-12 w-12 text-green-500 mx-auto mb-4" />
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        {{ t('assignments.completed', 'Assignment Completed!') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        {{
          t(
            'assignments.completedMessage',
            'Great job! You have successfully completed this assignment.'
          )
        }}
      </p>
      <Button @click="goBack" class="mt-4">
        {{ t('assignments.backToAssignments', 'Back to Assignments') }}
      </Button>
    </div>

    <!-- Assignment content -->
    <div v-else class="mb-12">
      <!-- Progress bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('lessons.progress', 'Progress') }}: {{ progress }}%
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ activeItemIndex + 1 }}/{{ lessonItems.length }}
            {{ t('lessons.items', 'items') }}
          </span>
        </div>
        <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            class="h-2 bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
            :style="`width: ${progress}%`"
          ></div>
        </div>
      </div>

      <!-- Active lesson item -->
      <div v-if="activeItem" class="mb-8">
        <LessonItem
          :item="activeItem"
          :isLast="isLastItem"
          :assignmentId="assignmentId"
          @item-completed="handleItemCompleted"
          @next-item="goToNextItem"
          @back-to-lessons="goBack"
        />
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-between">
        <Button
          @click="goToPreviousItem"
          class="bg-gray-500 hover:bg-gray-600"
          :disabled="activeItemIndex === 0"
        >
          <ChevronLeftIcon class="h-5 w-5 mr-2" />
          {{ t('lessons.previous', 'Previous') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
