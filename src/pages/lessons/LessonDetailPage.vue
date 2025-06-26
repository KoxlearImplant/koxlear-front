<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import LessonItem from './components/LessonItem.vue'
import type { LessonItemType } from './types'
import { useGetLessonById } from '@/pages/lessons/queries'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const lessonId = computed(() => Number(route.params.lessonId))
const activeItemIndex = ref(0)
const isCompleted = ref(false)
const completedItems = ref<Set<number>>(new Set())

const {
  data: currentLesson,
  isLoading,
  error,
} = useGetLessonById(lessonId.value)

// Navigation functions
const goBack = () => {
  router.push('/dashboard/lessons')
}

const goToNextItem = () => {
  if (
    !currentLesson.value ||
    activeItemIndex.value >= currentLesson.value.items.length - 1
  ) {
    completeLesson()
    return
  }

  activeItemIndex.value++
  scrollToTop()
}

const goToPreviousItem = () => {
  if (activeItemIndex.value > 0) {
    activeItemIndex.value--
    scrollToTop()
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const completeLesson = () => {
  isCompleted.value = true
  // Here you would typically send a request to update the user's progress
}

const markItemComplete = (itemId: number) => {
  completedItems.value.add(itemId)
}

const activeItem = computed<LessonItemType | null>(() => {
  if (!currentLesson.value || !currentLesson.value.items.length) return null
  return currentLesson.value.items[activeItemIndex.value]
})

const progress = computed(() => {
  if (!currentLesson.value || !currentLesson.value.items.length) return 0
  return Math.round(
    ((activeItemIndex.value + 1) / currentLesson.value.items.length) * 100
  )
})

const isLastItem = computed(() => {
  if (!currentLesson.value) return true
  return activeItemIndex.value === currentLesson.value.items.length - 1
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-800">
        {{ currentLesson?.title || t('lessons.lessonDetail', 'Lesson Detail') }}
      </h1>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center">
        <svg
          class="animate-spin h-12 w-12 text-blue-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-gray-500">
          {{ t('lessons.loading', 'Loading lesson...') }}
        </p>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error || !currentLesson"
      class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 text-red-500 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h2 class="text-lg font-semibold text-gray-800 mb-2">
        {{ t('lessons.lessonNotFound', 'Lesson not found') }}
      </h2>
      <p class="text-gray-600">
        {{ t('lessons.returnToLessons', 'Please return to the lessons page') }}
      </p>
      <Button @click="goBack" class="mt-4 bg-blue-500 hover:bg-blue-600">
        {{ t('lessons.backToLessons', 'Back to Lessons') }}
      </Button>
    </div>

    <!-- Completed lesson state -->
    <div
      v-else-if="isCompleted"
      class="bg-green-50 border border-green-200 rounded-lg p-10 text-center"
    >
      <div class="mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-20 w-20 text-green-500 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-3">
        {{ t('lessons.lessonComplete', 'Lesson Completed!') }}
      </h2>
      <p class="text-lg text-gray-600 mb-6">
        {{ t('lessons.greatJob', "Great job! You've completed this lesson.") }}
      </p>
      <div class="flex justify-center space-x-4">
        <Button @click="goBack" class="bg-gray-500 hover:bg-gray-600">
          {{ t('lessons.backToLessons', 'Back to Lessons') }}
        </Button>
        <Button class="bg-blue-500 hover:bg-blue-600">
          {{ t('lessons.nextLesson', 'Next Lesson') }}
        </Button>
      </div>
    </div>

    <!-- Lesson content -->
    <div v-else class="mb-12">
      <!-- Progress bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">
            {{ t('lessons.progress', 'Progress') }}: {{ progress }}%
          </span>
          <span class="text-sm text-gray-500">
            {{ activeItemIndex + 1 }}/{{ currentLesson.items.length }}
            {{ t('lessons.items', 'items') }}
          </span>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full">
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
          @item-completed="markItemComplete(activeItem.id)"
        />
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-between">
        <Button
          @click="goToPreviousItem"
          class="bg-gray-500 hover:bg-gray-600"
          :disabled="activeItemIndex === 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{ t('lessons.previous', 'Previous') }}
        </Button>

        <Button @click="goToNextItem" class="bg-blue-500 hover:bg-blue-600">
          {{
            isLastItem
              ? t('lessons.finish', 'Finish Lesson')
              : t('lessons.next', 'Next')
          }}
          <svg
            v-if="!isLastItem"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
