<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Assignments</h1>
      <Button @click="openCreate" size="sm">Create</Button>
    </div>

    <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Search"
        class="px-3 py-2 border rounded-md"
      />
      <select v-model="ordering" class="px-3 py-2 border rounded-md">
        <option value="-created_at">Newest</option>
        <option value="created_at">Oldest</option>
        <option value="title">Title A-Z</option>
        <option value="-title">Title Z-A</option>
      </select>
    </div>

    <div v-if="isLoading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-600">Failed to load assignments</div>

    <div
      v-else
      class="bg-white shadow-sm border border-gray-200 rounded-lg divide-y"
    >
      <div
        v-for="item in assignments"
        :key="item.id"
        class="p-4 flex items-center justify-between"
      >
        <div>
          <div class="font-medium text-gray-900">
            {{ item.title || `Assignment #${item.id}` }}
          </div>
          <div class="text-sm text-gray-500" v-if="item.description">
            {{ item.description }}
          </div>
          <div class="text-xs text-gray-400 mt-1">
            <span v-if="item.due_date"
              >Due: {{ formatDate(item.due_date) }} ·
            </span>
            <span>ID: {{ item.id }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" @click="edit(item)">Edit</Button>
          <Button variant="destructive" size="sm" @click="remove(item.id)"
            >Delete</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import {
  useAdminAssignments,
  useDeleteAdminAssignment,
} from './queries/useAdminContent'
import type { AdminAssignment } from './types'

const search = ref('')
const ordering = ref('-created_at')

const params = computed(() => ({
  search: search.value || undefined,
  ordering: ordering.value || undefined,
}))

const { data, isLoading, error, refetch } = useAdminAssignments(params.value)

watch(
  params,
  useDebounceFn(() => {
    refetch()
  }, 300)
)

const assignments = computed<AdminAssignment[]>(() => {
  const value = data?.value
  if (!value) return []
  // Support both array and paginated response
  return Array.isArray(value) ? value : value.results
})

const delMutation = useDeleteAdminAssignment()

function formatDate(date?: string) {
  if (!date) return ''
  try {
    return new Date(date).toLocaleString()
  } catch {
    return date
  }
}

function openCreate() {
  // Placeholder for create modal integration
}

function edit(item: AdminAssignment) {
  // Placeholder for edit modal integration; reference param to satisfy linter
  void item.id
}

function remove(id: number) {
  delMutation.mutate(id)
}
</script>
