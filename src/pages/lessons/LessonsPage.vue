<script setup lang="ts">
import { useGetAllLessons } from '@/pages/lessons/queries'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  BookOpenIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  InboxIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const { t } = useI18n()
const router = useRouter()
const { data: allLessons, error, isLoading } = useGetAllLessons()

const openLesson = (lessonId: number) => {
  // Navigate to the lesson without specifying an item index
  // Let the LessonDetailPage handle finding the first uncompleted item
  router.push(`/dashboard/lessons/${lessonId}`)
}

const groupId = computed(() => {
  return router.currentRoute.value.params.id as string
})

const filteredLessons = computed(() => {
  if (!allLessons.value) return []
  return allLessons.value.filter(
    (lesson) => lesson.group.id === parseInt(groupId.value)
  )
})

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
</script>

<template>
  <div id="lessons" class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">
      {{ t('lessons.title', 'Lessons') }}
    </h1>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center">
        <BookOpenIcon class="animate-spin h-12 w-12 text-blue-500 mb-4" />
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
      <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-lg font-semibold text-gray-800 mb-2">
        {{ t('lessons.errorLoading', 'Error loading lessons') }}
      </h2>
      <p class="text-gray-600">
        {{ t('lessons.tryAgain', 'Please try again later') }}
      </p>
    </div>

    <!-- Lessons grid -->
    <div
      v-else-if="filteredLessons && filteredLessons.length"
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="lesson in filteredLessons"
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
                <BookOpenIcon class="h-6 w-6 text-white" />
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
                t('lessons.contains', {
                  count: lesson.items.length,
                })
              }}
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
              @click="openLesson(lesson.id)"
              class="flex items-center text-blue-500 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              {{ t('lessons.startLesson', 'Start Lesson') }}
              <ArrowRightIcon class="h-4 w-4 ml-1" />
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
      <InboxIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-lg font-semibold text-gray-800 mb-2">
        {{ t('lessons.noLessons', 'No lessons available') }}
      </h2>
      <p class="text-gray-600">
        {{ t('lessons.checkBack', 'Check back later for new lessons!') }}
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
