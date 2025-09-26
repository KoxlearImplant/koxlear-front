<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-2">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="w-80 rounded-md shadow border px-4 py-3 bg-white"
      :class="{
        'border-green-300': t.variant === 'success',
        'border-red-300': t.variant === 'error',
        'border-yellow-300': t.variant === 'warning',
      }"
    >
      <div class="flex items-start gap-3">
        <div class="mt-0.5">
          <span
            class="inline-block w-2 h-2 rounded-full"
            :class="{
              'bg-green-500': t.variant === 'success',
              'bg-red-500': t.variant === 'error',
              'bg-yellow-500': t.variant === 'warning',
              'bg-gray-400': t.variant === 'default',
            }"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p v-if="t.title" class="font-medium text-gray-900 truncate">
            {{ t.title }}
          </p>
          <p class="text-sm text-gray-600 break-words">
            {{ t.description }}
          </p>
        </div>
        <button class="text-gray-400 hover:text-gray-600" @click="remove(t.id)">
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToasts } from '@/lib/toast'

defineOptions({
  name: 'ToasterComponent',
})

const { toasts, remove } = useToasts()
</script>
