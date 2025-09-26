<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLessonGroups } from '@/pages/teacher/queries/use-lesson-groups'
import type { LessonGroupFilter } from '@/pages/teacher/api/lesson-group'

const searchQuery = ref('')
const limit = ref(20)
const offset = ref(0)

const filter = computed<LessonGroupFilter>(() => ({
  limit: limit.value,
  offset: offset.value,
  ...(searchQuery.value && { search: searchQuery.value }),
}))

const {
  data: lessonGroupsData,
  isLoading,
  error,
  refetch,
} = useLessonGroups(filter)

const lessonGroups = computed(() => lessonGroupsData.value?.results || [])
const totalCount = computed(() => lessonGroupsData.value?.count || 0)

const handleSearch = () => {
  offset.value = 0
  refetch()
}

const loadMore = () => {
  offset.value += limit.value
}

const canLoadMore = computed(() => {
  return lessonGroups.value.length < totalCount.value
})

const handleRefetch = () => {
  refetch()
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-4">Lesson Groups</h1>

      <!-- Search Input -->
      <div class="flex gap-2 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search lesson groups..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="handleSearch"
        />
        <button
          @click="handleSearch"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && lessonGroups.length === 0" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
      ></div>
      <p class="mt-2 text-gray-600">Loading lesson groups...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-600 mb-2">
        <svg
          class="w-12 h-12 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>
      <p class="text-gray-700 mb-4">Failed to load lesson groups</p>
      <button
        @click="handleRefetch"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>

    <!-- Lesson Groups List -->
    <div v-else-if="lessonGroups.length > 0">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="group in lessonGroups"
          :key="group.id"
          class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ group.name }}
          </h3>
          <div class="text-sm text-gray-600">
            <p>ID: {{ group.id }}</p>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="canLoadMore" class="text-center mt-6">
        <button
          @click="loadMore"
          :disabled="isLoading"
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Loading...</span>
          <span v-else>Load More</span>
        </button>
      </div>

      <!-- Results Info -->
      <div class="text-center mt-4 text-sm text-gray-600">
        Showing {{ lessonGroups.length }} of {{ totalCount }} lesson groups
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg
          class="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        No lesson groups found
      </h3>
      <p class="text-gray-600">
        {{
          searchQuery
            ? 'Try adjusting your search criteria.'
            : 'There are no lesson groups available.'
        }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
