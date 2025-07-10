<script setup lang="ts">
import {
  BeakerIcon,
  ItalicIcon,
  TrophyIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  AcademicCapIcon,
  SparklesIcon,
} from '@heroicons/vue/24/solid'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Component } from 'vue'
import LangSelect from '@/components/common/LangSelect.vue'

const { t } = useI18n()
const route = useRoute()

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
    to: '/dashboard/lessons',
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
    to: '/achievements',
    icon: TrophyIcon,
    label: t('nav.achievements', 'Achievements'),
    activePattern: '/achievements',
    iconColor: 'text-yellow-200',
    borderColor: 'border-yellow-300',
  },
  {
    to: '/experiments',
    icon: BeakerIcon,
    label: t('nav.experiments', 'Experiments'),
    activePattern: '/experiments',
    iconColor: 'text-blue-200',
    borderColor: 'border-blue-300',
  },
  {
    to: '/store',
    icon: ShoppingBagIcon,
    label: t('nav.store', 'Store'),
    activePattern: '/store',
    iconColor: 'text-green-200',
    borderColor: 'border-green-300',
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

// Helper function to check if route is active
const isRouteActive = (pattern: string): boolean => {
  return route.path.includes(pattern)
}
</script>

<template>
  <!-- Fancy, child-friendly sidebar -->
  <nav
    class="w-64 h-full bg-gradient-to-b from-blue-500 to-purple-600 dark:from-blue-900 dark:via-purple-900 dark:to-yellow-900 p-4 shadow-2xl flex flex-col items-center"
  >
    <div class="mb-8 flex flex-row items-center">
      <SparklesIcon class="size-12 text-white mb-2 drop-shadow-lg" />
      <h2
        class="text-2xl font-extrabold text-white dark:text-yellow-200 drop-shadow-lg tracking-wide"
      >
        Hear<span class="text-yellow-200">O</span>
      </h2>
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
          <span class="text-lg text-white font-bold">{{ item.label }}</span>
        </router-link>
      </li>
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
