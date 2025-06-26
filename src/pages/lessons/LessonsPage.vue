<script setup lang="ts">
import { useGetAllLessons } from '@/pages/lessons/queries'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const { data, error, isLoading } = useGetAllLessons()

const openLesson = (lessonId: number) => {
  router.push(`/dashboard/lessons/${lessonId}`)
}

function getGradientColor(id: number) {
  // Create different color gradients based on id
  const colors = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-green-500 to-teal-600',
    'from-amber-500 to-red-600',
    'from-emerald-500 to-cyan-600',
  ]
  return colors[id % colors.length]
}

function getItemTypes(items) {
  // Count item types and show summary
  if (!items || !items.length) return ''

  const types = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    return acc
  }, {})

  if (types['tts'] && !types['stt'] && !types['img']) {
    return 'Audio lessons'
  } else if (types['stt'] && !types['tts'] && !types['img']) {
    return 'Speech lessons'
  } else if (types['img'] && !types['tts'] && !types['stt']) {
    return 'Visual lessons'
  }

  return 'Mixed lesson types'
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">
      {{ t('lessons.title', 'Lessons') }}
    </h1>

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
          {{ t('lessons.loading', 'Loading lessons...') }}
        </p>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
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
        {{ t('lessons.errorLoading', 'Error loading lessons') }}
      </h2>
      <p class="text-gray-600">
        {{ t('lessons.tryAgain', 'Please try again later') }}
      </p>
    </div>

    <!-- Lessons grid -->
    <div
      v-else-if="data && data.length"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="lesson in data"
        :key="lesson.id"
        class="lesson-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
        @click="openLesson(lesson.id)"
      >
        <!-- Card header with colored background based on lesson id (for variation) -->
        <div
          class="p-6"
          :class="`bg-gradient-to-r ${getGradientColor(lesson.id)}`"
        >
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <div class="bg-white/20 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0h10"
                  />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white ml-4">
                {{ lesson.title }}
              </h2>
            </div>

            <div
              class="flex items-center bg-white/20 px-3 py-1 rounded-full text-xs text-white"
            >
              <span>{{ lesson.group.name }}</span>
            </div>
          </div>
        </div>

        <!-- Card content -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm text-gray-600">
              {{
                t('lessons.contains', 'Contains {count} items', {
                  count: lesson.items.length,
                })
              }}
            </div>

            <div
              class="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
            >
              {{ getItemTypes(lesson.items) }}
            </div>
          </div>

          <div class="flex justify-between items-center">
            <!-- Word tags preview -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="item in lesson.items.slice(0, 2)"
                :key="item.id"
                class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                {{ item.word }}
              </span>
              <span
                v-if="lesson.items.length > 2"
                class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                +{{ lesson.items.length - 2 }}
              </span>
            </div>

            <!-- Start button -->
            <button
              class="flex items-center text-blue-500 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              {{ t('lessons.startLesson', 'Start Lesson') }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-1"
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
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 text-gray-400 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
      <h2 class="text-lg font-semibold text-gray-800 mb-2">
        {{ t('lessons.noLessons', 'No lessons available') }}
      </h2>
      <p class="text-gray-600">
        {{ t('lessons.checkBack', 'Please check back later for new lessons') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Card hover effect */
.lesson-card {
  transform: translateY(0);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.lesson-card:hover {
  transform: translateY(-5px);
}

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
