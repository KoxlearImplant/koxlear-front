<script setup lang="ts">
import LeftSidebar from '@/layouts/dashboard-layout/components/LeftSidebar.vue'
import Header from '@/layouts/dashboard-layout/components/TopHeader.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-row h-full">
      <div>
        <LeftSidebar />
      </div>
      <div class="flex-1 p-6 overflow-y-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
