<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ArrowPathIcon,
  BellIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
} from '@heroicons/vue/24/outline'
import { Button } from '@/components/ui/button'
import { useNotifications, useMarkViewed } from './queries'
import type { Notification } from './types'
import useToasts from '@/lib/toast'

const { t } = useI18n()
const toast = useToasts()

// Pagination state
const limit = ref(20)
const offset = ref(0)

// Query params
const queryParams = computed(() => ({
  limit: limit.value,
  offset: offset.value,
}))

// Queries
const { data, isLoading, error, refetch } = useNotifications(queryParams)
const { mutate: markViewed, isPending: isMarkingViewed } = useMarkViewed()

// Computed
const notifications = computed(() => data.value?.results ?? [])
const totalCount = computed(() => data.value?.count ?? 0)
const currentPage = computed(() => Math.floor(offset.value / limit.value) + 1)
const totalPages = computed(() => Math.ceil(totalCount.value / limit.value))

const hasNotifications = computed(() => notifications.value.length > 0)

// Methods
const handleMarkViewed = (notification: Notification) => {
  if (notification.viewed === 'Y') return

  markViewed(notification.notification_id, {
    onSuccess: () => {
      toast.success(t('notifications.markedAsRead'))
    },
    onError: () => {
      toast.error(t('notifications.markAsReadError'))
    },
  })
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) {
    return t('notifications.justNow')
  } else if (diffMins < 60) {
    return t('notifications.minutesAgo', { count: diffMins })
  } else if (diffHours < 24) {
    return t('notifications.hoursAgo', { count: diffHours })
  } else if (diffDays < 7) {
    return t('notifications.daysAgo', { count: diffDays })
  } else {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }
}

const goToPage = (page: number) => {
  offset.value = (page - 1) * limit.value
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

// Refetch when pagination changes
watch([limit, offset], () => {
  refetch()
})
</script>

<template>
  <div class="container mx-auto sm:p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
            {{ t('notifications.title') }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{ t('notifications.subtitle') }}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          :disabled="isLoading"
          @click="() => refetch()"
        >
          <ArrowPathIcon
            class="w-4 h-4 mr-2"
            :class="{ 'animate-spin': isLoading }"
          />
          {{ t('common.refresh') }}
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading && !data"
      class="flex flex-col items-center justify-center py-12"
    >
      <ArrowPathIcon class="w-8 h-8 animate-spin text-sky-500 mb-4" />
      <p class="text-gray-500 dark:text-gray-400">
        {{ t('common.loading') }}
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-12"
    >
      <div
        class="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center max-w-md"
      >
        <p class="text-red-600 dark:text-red-400 mb-4">
          {{ t('notifications.loadError') }}
        </p>
        <Button variant="outline" @click="() => refetch()">
          {{ t('common.tryAgain') }}
        </Button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!hasNotifications"
      class="flex flex-col items-center justify-center py-16"
    >
      <div class="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
        <BellIcon class="w-12 h-12 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ t('notifications.noNotifications') }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 text-center max-w-sm">
        {{ t('notifications.noNotificationsDesc') }}
      </p>
    </div>

    <!-- Notifications List -->
    <div v-else class="space-y-3">
      <div
        v-for="notification in notifications"
        :key="notification.notification_id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md cursor-pointer"
        :class="[
          notification.viewed === 'N'
            ? 'border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-900/10'
            : 'border-gray-200 dark:border-gray-700',
        ]"
        @click="handleMarkViewed(notification)"
      >
        <div class="p-4 flex items-start gap-4">
          <!-- Icon -->
          <div
            class="flex-shrink-0 rounded-full p-2"
            :class="[
              notification.viewed === 'N'
                ? 'bg-sky-100 dark:bg-sky-900/30'
                : 'bg-gray-100 dark:bg-gray-700',
            ]"
          >
            <component
              :is="
                notification.viewed === 'N' ? EnvelopeIcon : EnvelopeOpenIcon
              "
              class="w-5 h-5"
              :class="[
                notification.viewed === 'N'
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-gray-500 dark:text-gray-400',
              ]"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <h3
                class="font-medium truncate"
                :class="[
                  notification.viewed === 'N'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300',
                ]"
              >
                {{ notification.title }}
              </h3>
              <span
                class="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400"
              >
                {{ formatDate(notification.created_on) }}
              </span>
            </div>
            <p
              class="mt-1 text-sm line-clamp-2"
              :class="[
                notification.viewed === 'N'
                  ? 'text-gray-600 dark:text-gray-300'
                  : 'text-gray-500 dark:text-gray-400',
              ]"
            >
              {{ notification.note }}
            </p>

            <!-- Unread indicator -->
            <div
              v-if="notification.viewed === 'N'"
              class="mt-2 flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400"
            >
              <span class="w-2 h-2 rounded-full bg-sky-500"></span>
              {{ t('notifications.unread') }}
            </div>
            <div
              v-else
              class="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
            >
              <CheckCircleIcon class="w-3.5 h-3.5" />
              {{ t('notifications.read') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{
            t('notifications.showingResults', {
              from: offset + 1,
              to: Math.min(offset + limit, totalCount),
              total: totalCount,
            })
          }}
        </p>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage <= 1"
            @click="prevPage"
          >
            {{ t('common.previous') }}
          </Button>
          <span class="text-sm text-gray-600 dark:text-gray-400 px-2">
            {{ currentPage }} {{ t('common.of') }} {{ totalPages }}
          </span>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage >= totalPages"
            @click="nextPage"
          >
            {{ t('common.next') }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Loading overlay for mark as viewed -->
    <div
      v-if="isMarkingViewed"
      class="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
    >
      <ArrowPathIcon class="w-8 h-8 animate-spin text-sky-500" />
    </div>
  </div>
</template>
