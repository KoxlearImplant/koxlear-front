<script setup lang="ts">
import LeftSidebar from '@/layouts/dashboard-layout/components/LeftSidebar.vue'
import Header from '@/layouts/dashboard-layout/components/TopHeader.vue'
</script>

<template>
  <div class="flex flex-row w-full h-screen">
    <div class="flex flex-row h-full z-50">
      <LeftSidebar />
    </div>
    <div class="flex flex-col flex-1 h-full bg-gray-100 dark:bg-gray-900">
      <Header class="z-50" />
      <div class="flex-1 p-6 overflow-y-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
