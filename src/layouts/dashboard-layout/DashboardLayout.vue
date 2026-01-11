<script setup lang="ts">
import LeftSidebar from '@/layouts/dashboard-layout/components/LeftSidebar.vue'
import Header from '@/layouts/dashboard-layout/components/TopHeader.vue'
</script>

<template>
  <div class="flex flex-row w-full h-screen">
    <!-- Fixed Sidebar - Desktop (left side) and Mobile (bottom) -->
    <div class="fixed left-0 top-0 h-full z-50 hidden md:block">
      <LeftSidebar />
    </div>

    <!-- Mobile Bottom Navigation -->
    <div
      class="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none"
    >
      <LeftSidebar />
    </div>

    <!-- Main Content Area -->
    <div
      class="flex flex-col flex-1 h-full bg-gray-100 dark:bg-gray-900 md:ml-72"
    >
      <!-- Fixed Header -->
      <div class="fixed top-0 right-0 left-0 md:left-72 z-40">
        <Header class="z-50" />
      </div>

      <!-- Scrollable Content Area -->
      <div class="flex-1 p-4 md:p-6 overflow-y-auto mt-16 mb-24 md:mb-0">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
