<script setup lang="ts"></script>

<template>
  <div
    class="max-w-sm mx-auto bg-white dark:bg-dark-800 p-6 rounded-lg shadow-md mt-10"
  >
    <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
    <form>
      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2" for="email"
          >Email</label
        >
        <input
          id="email"
          type="email"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-dark-700 dark:text-gray-100"
          required
        />
      </div>
      <div class="mb-4">
        <label
          class="block text-gray-700 dark:text-gray-300 mb-2"
          for="password"
          >Password</label
        >
        <input
          id="password"
          type="password"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 dark:bg-dark-700 dark:text-gray-100"
          required
        />
      </div>
    </form>
    <div class="mt-4 text-center">
      <router-link to="/register" class="text-blue-600 hover:underline"
        >Don't have an account? Register</router-link
      >
    </div>
  </div>
</template>

<style scoped></style>
