<template>
  <header
    class="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 shadow-md rounded-b-2xl z-20 min-h-[52px]"
  >
    <div class="flex items-center gap-2">
      <SparklesIcon class="w-6 h-6 text-yellow-500" />
      <span
        class="text-lg font-extrabold text-blue-700 dark:text-yellow-200 tracking-wide"
        >Hear<span class="text-yellow-400">O</span></span
      >
    </div>
    <div class="flex items-center gap-2">
      <button
        class="relative p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-gray-800 transition"
        @click="notify"
      >
        <BellIcon class="w-6 h-6 text-blue-700 dark:text-yellow-200" />
        <span
          v-if="hasNotifications"
          class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
        ></span>
      </button>
      <button
        @click="goProfile"
        class="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-blue-100 dark:hover:bg-gray-800 transition"
      >
        <img
          :src="avatarUrl"
          :alt="fullName"
          class="w-8 h-8 rounded-full object-cover border border-blue-200 dark:border-yellow-300"
        />
        <span
          class="hidden sm:block text-sm font-semibold text-blue-900 dark:text-yellow-100 max-w-[120px] truncate"
          >{{ fullName }}</span
        >
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SparklesIcon, BellIcon } from '@heroicons/vue/24/outline'
import { useGetProfile } from '@/pages/profile/queries/useGetProfile'

const hasNotifications = ref(false) // Replace with real notification logic if needed
const router = useRouter()

const { data: profile } = useGetProfile()

const fullName = computed(() => {
  if (!profile.value) return ''
  return `${profile.value.first_name || ''} ${profile.value.last_name || ''}`.trim()
})
const avatarUrl = computed(() => profile.value?.image || '/default-avatar.png')

function notify() {
  // Placeholder for notification logic
  alert('No new notifications!')
}

function goProfile() {
  router.push('/dashboard/profile')
}
</script>

<style scoped></style>
