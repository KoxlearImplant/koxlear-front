<script setup lang="ts">
import {
  ItalicIcon,
  UserCircleIcon,
  AcademicCapIcon,
  SparklesIcon,
  MicrophoneIcon,
} from '@heroicons/vue/24/solid'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Component } from 'vue'
import LangSelect from '@/components/common/LangSelect.vue'
import { useAuthStore } from '@/store/auth.store'
import { GraduationCapIcon, UsersRoundIcon } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()

interface NavItem {
  to: string
  icon: Component
  label: string
  activePattern: string
  iconColor: string
  borderColor: string
}

// Centralized navigation configuration
const navItems: NavItem[] = [
  {
    to: '/dashboard/lesson-groups',
    icon: AcademicCapIcon,
    label: t('nav.lessons', 'Learn'),
    activePattern: '/dashboard/lessons',
    iconColor: 'text-yellow-200',
    borderColor: 'border-yellow-300',
  },
  {
    to: '/dashboard/letters',
    icon: ItalicIcon,
    label: t('nav.letters', 'Letters'),
    activePattern: '/letters',
    iconColor: 'text-pink-200',
    borderColor: 'border-pink-300',
  },
  {
    to: '/dashboard/practice',
    icon: MicrophoneIcon,
    label: t('nav.practice', 'Practice'),
    activePattern: '/practice',
    iconColor: 'text-green-200',
    borderColor: 'border-green-300',
  },
  {
    to: '/dashboard/random-cartoon',
    icon: SparklesIcon,
    label: t('nav.randomCartoon', 'Random Cartoon'),
    activePattern: '/dashboard/random-cartoon',
    iconColor: 'text-orange-200',
    borderColor: 'border-orange-300',
  },
  {
    to: '/dashboard/profile',
    icon: UserCircleIcon,
    label: t('nav.profile', 'Profile'),
    activePattern: '/profile',
    iconColor: 'text-purple-200',
    borderColor: 'border-purple-300',
  },
]

// Admin navigation items - only show for admin users
const teacherNavItems: NavItem[] = [
  {
    to: '/dashboard/teacher/lesson-groups',
    icon: GraduationCapIcon,
    label: 'My lessons',
    activePattern: '/dashboard/teacher/lesson-groups',
    iconColor: 'text-red-200',
    borderColor: 'border-red-300',
  },
  {
    to: '/dashboard/teacher/students',
    icon: UsersRoundIcon,
    label: 'My students',
    activePattern: '/dashboard/teacher/students',
    iconColor: 'text-blue-200',
    borderColor: 'border-blue-300',
  },
]

// Helper function to check if route is active
const isRouteActive = (pattern: string): boolean => {
  return route.path.includes(pattern)
}
</script>

<template>
  <!-- Fancy, child-friendly sidebar -->
  <nav
    class="w-72 h-full bg-gradient-to-b from-blue-500 to-purple-600 dark:from-blue-900 dark:via-purple-900 dark:to-yellow-900 p-4 shadow-2xl flex flex-col items-center"
  >
    <div>
      <img src="@/assets/logo.png" alt="Logo" class="w-32" />
    </div>
    <ul class="space-y-6 w-full">
      <li v-for="item in navItems" :key="item.to">
        <router-link
          :to="item.to"
          class="flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:transform hover:translate-x-1"
          :class="{
            'bg-white/20 shadow-inner border-l-4': isRouteActive(
              item.activePattern
            ),
            [item.borderColor]: isRouteActive(item.activePattern),
          }"
        >
          <component
            :is="item.icon"
            class="inline-block size-6 mr-2 drop-shadow"
            :class="item.iconColor"
          />
          <span class="text-2xl text-white font-bold">{{ item.label }}</span>
        </router-link>
      </li>

      <!-- Admin navigation items - only show for admin users -->
      <template v-if="authStore.isTeacher()">
        <li v-for="item in teacherNavItems" :key="item.to">
          <router-link
            :to="item.to"
            class="flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:transform hover:translate-x-1"
            :class="{
              'bg-white/20 shadow-inner border-l-4': isRouteActive(
                item.activePattern
              ),
              [item.borderColor]: isRouteActive(item.activePattern),
            }"
          >
            <component
              :is="item.icon"
              class="inline-block size-6 mr-2 drop-shadow"
              :class="item.iconColor"
            />
            <span class="text-2xl text-white font-bold">{{ item.label }}</span>
          </router-link>
        </li>
      </template>
    </ul>
    <LangSelect class="mt-auto z-50 w-full" />
  </nav>
</template>

<style scoped>
/* Add a subtle scale animation for the active link icons */
.router-link-active svg {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
