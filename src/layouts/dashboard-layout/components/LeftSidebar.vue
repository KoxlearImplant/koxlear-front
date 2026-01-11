<script setup lang="ts">
import {
  UserCircleIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/vue/24/solid'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Component } from 'vue'
import LangSelect from '@/components/common/LangSelect.vue'
import { useAuthStore } from '@/store/auth.store'
import { GraduationCapIcon, UsersRoundIcon } from 'lucide-vue-next'
import { computed } from 'vue'

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

// Centralized navigation configuration - now reactive with computed
// Adding locale.value as a dependency ensures reactivity
const navItems = computed<NavItem[]>(() => {
  // Force reactivity by accessing locale.value
  return [
    // {
    //   to: '/dashboard/lesson-groups',
    //   icon: AcademicCapIcon,
    //   label: t('nav.lessons'),
    //   activePattern: '/dashboard/lessons',
    //   iconColor: 'text-yellow-200',
    //   borderColor: 'border-yellow-300',
    // },
    {
      to: '/dashboard/assignments',
      icon: ClipboardDocumentListIcon,
      label: t('nav.assignments'),
      activePattern: '/dashboard/assignments',
      iconColor: 'text-cyan-200',
      borderColor: 'border-cyan-300',
    },
    // {
    //   to: '/dashboard/letters',
    //   icon: ItalicIcon,
    //   label: t('nav.letters'),
    //   activePattern: '/letters',
    //   iconColor: 'text-pink-200',
    //   borderColor: 'border-pink-300',
    // },
    // {
    //   to: '/dashboard/practice',
    //   icon: MicrophoneIcon,
    //   label: t('nav.practice'),
    //   activePattern: '/practice',
    //   iconColor: 'text-green-200',
    //   borderColor: 'border-green-300',
    // },
    // {
    //   to: '/dashboard/random-cartoon',
    //   icon: SparklesIcon,
    //   label: t('nav.randomCartoon'),
    //   activePattern: '/dashboard/random-cartoon',
    //   iconColor: 'text-orange-200',
    //   borderColor: 'border-orange-300',
    // },
    {
      to: '/dashboard/profile',
      icon: UserCircleIcon,
      label: t('nav.profile'),
      activePattern: '/profile',
      iconColor: 'text-purple-200',
      borderColor: 'border-purple-300',
    },
  ]
})

// Teacher navigation items - now reactive with computed
const teacherNavItems = computed<NavItem[]>(() => {
  // Force reactivity by accessing locale.value
  return [
    {
      to: '/dashboard/teacher/lesson-groups',
      icon: GraduationCapIcon,
      label: t('nav.myLessons'),
      activePattern: '/dashboard/teacher/lesson-groups',
      iconColor: 'text-red-200',
      borderColor: 'border-red-300',
    },
    {
      to: '/dashboard/teacher/students',
      icon: UsersRoundIcon,
      label: t('nav.myStudents'),
      activePattern: '/dashboard/teacher/students',
      iconColor: 'text-blue-200',
      borderColor: 'border-blue-300',
    },
    {
      to: '/dashboard/teacher/assignments',
      icon: ClipboardDocumentListIcon,
      label: t('nav.myAssignments'),
      activePattern: '/dashboard/teacher/assignments',
      iconColor: 'text-green-200',
      borderColor: 'border-green-300',
    },
  ]
})

// Helper function to check if route is active
const isRouteActive = (pattern: string): boolean => {
  return route.path.includes(pattern)
}
</script>

<template>
  <!-- Desktop Sidebar - Vertical -->
  <nav
    class="hidden md:flex w-72 h-full bg-gradient-to-b from-blue-500 to-purple-600 dark:from-blue-900 dark:via-purple-900 dark:to-yellow-900 shadow-2xl flex-col items-center"
  >
    <!-- Logo - Fixed at top -->
    <div class="flex-shrink-0 p-4">
      <img src="@/assets/logo.png" alt="Logo" class="w-32" />
    </div>

    <!-- Scrollable navigation area -->
    <div
      class="flex-1 overflow-y-auto w-full px-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
    >
      <ul class="space-y-6 w-full pb-4">
        <template v-if="!authStore.isTeacher()">
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
              <span class="text-2xl text-white font-bold">{{
                item.label
              }}</span>
            </router-link>
          </li>
        </template>

        <!-- Teacher navigation items - only show for teacher users -->
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
              <span class="text-2xl text-white font-bold">{{
                item.label
              }}</span>
            </router-link>
          </li>
        </template>
      </ul>
    </div>

    <!-- Language selector - Fixed at bottom -->
    <div class="flex-shrink-0 w-full p-4">
      <LangSelect class="z-50 w-full" />
    </div>
  </nav>

  <!-- Mobile Bottom Navigation Bar - Floating Dock Style -->
  <nav
    class="md:hidden w-auto mx-4 rounded-2xl bg-gradient-to-r from-blue-500/95 to-purple-600/95 dark:from-blue-900/95 dark:via-purple-900/95 dark:to-yellow-900/95 backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden pointer-events-auto"
    style="margin-bottom: calc(1rem + env(safe-area-inset-bottom))"
  >
    <div class="flex items-center justify-around p-2">
      <template v-if="!authStore.isTeacher()">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="group relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 min-w-[60px]"
          :class="
            isRouteActive(item.activePattern)
              ? 'bg-white/10 shadow-inner'
              : 'hover:bg-white/5'
          "
        >
          <div
            class="absolute top-0 w-8 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-opacity duration-300 rounded-full"
            :class="{ 'opacity-100': isRouteActive(item.activePattern) }"
          ></div>

          <component
            :is="item.icon"
            class="size-6 mb-1 transition-transform duration-300"
            :class="[
              item.iconColor,
              isRouteActive(item.activePattern)
                ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                : 'opacity-80 group-hover:opacity-100 group-hover:scale-105',
            ]"
          />
          <span
            class="text-[10px] font-medium text-center leading-tight transition-colors duration-300"
            :class="
              isRouteActive(item.activePattern)
                ? 'text-white'
                : 'text-gray-400 group-hover:text-gray-200'
            "
          >
            {{ item.label }}
          </span>
        </router-link>
      </template>

      <!-- Teacher navigation items - only show for teacher users -->
      <template v-if="authStore.isTeacher()">
        <router-link
          v-for="item in teacherNavItems"
          :key="item.to"
          :to="item.to"
          class="group relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 min-w-[60px]"
          :class="
            isRouteActive(item.activePattern)
              ? 'bg-white/10 shadow-inner'
              : 'hover:bg-white/5'
          "
        >
          <div
            class="absolute top-0 w-8 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-opacity duration-300 rounded-full"
            :class="{ 'opacity-100': isRouteActive(item.activePattern) }"
          ></div>

          <component
            :is="item.icon"
            class="size-6 mb-1 transition-transform duration-300"
            :class="[
              item.iconColor,
              isRouteActive(item.activePattern)
                ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                : 'opacity-80 group-hover:opacity-100 group-hover:scale-105',
            ]"
          />
          <span
            class="text-[10px] font-medium text-center leading-tight transition-colors duration-300"
            :class="
              isRouteActive(item.activePattern)
                ? 'text-white'
                : 'text-gray-400 group-hover:text-gray-200'
            "
          >
            {{ item.label }}
          </span>
        </router-link>
      </template>
    </div>
  </nav>
</template>

<style scoped>
/* Custom scrollbar styles */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* For Firefox */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

/* Add a subtle scale animation for the active link icons */
.router-link-active svg {
  transition: transform 0.3s ease;
}
</style>
