<template>
  <header
    class="w-full flex items-center justify-between px-3 md:px-6 py-2 bg-white shadow-md z-50 text-gray-900 border-b border-gray-200"
  >
    <div></div>
    <div class="flex items-center gap-2 md:gap-4">
      <button
        class="relative p-2 md:p-2.5 rounded-full hover:bg-sky-900/10 transition"
        @click="goToNotifications"
        :aria-label="t('header.notifications')"
      >
        <BellIcon class="w-6 h-6 md:w-8 md:h-8 text-sky-400" />
        <span
          v-if="hasNotifications"
          class="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </button>
      <button
        @click="goProfile"
        class="flex items-center cursor-pointer gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-xl hover:bg-gray-100 transition"
      >
        <img
          :src="avatarUrl"
          :alt="fullName"
          class="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-[#58cc02]"
        />
        <span
          class="hidden sm:block text-lg font-semibold text-gray-900 max-w-[160px] truncate"
          >{{ fullName }}</span
        >
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { BellIcon } from '@heroicons/vue/24/outline'
import { useGetProfile } from '@/pages/profile/queries/useGetProfile'
import { useUnreadCount } from '@/pages/notifications/queries/useUnreadCount'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const { data: profile } = useGetProfile()
const { data: unreadCountData } = useUnreadCount()

const unreadCount = computed(() => unreadCountData.value?.count ?? 0)
const hasNotifications = computed(() => unreadCount.value > 0)

const fullName = computed(() => {
  if (!profile.value) return ''
  return `${profile.value.first_name || ''} ${profile.value.last_name || ''}`.trim()
})
const avatarUrl = computed(() => profile.value?.image || '/default-avatar.png')

function goToNotifications() {
  router.push('/dashboard/notifications')
}

function goProfile() {
  router.push('/dashboard/profile')
}
</script>

<style scoped></style>
