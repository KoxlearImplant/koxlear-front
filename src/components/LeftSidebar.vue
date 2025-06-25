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
</script>

<template>
  <!-- Fancy, child-friendly sidebar -->
  <nav
    class="w-64 h-full bg-gradient-to-b from-blue-500 to-purple-600 dark:from-blue-900 dark:via-purple-900 dark:to-yellow-900 p-4 rounded-r-3xl shadow-2xl flex flex-col items-center"
  >
    <div class="mb-8 flex flex-col items-center">
      <SparklesIcon
        class="size-12 text-white animate-bounce mb-2 drop-shadow-lg"
      />
      <h2
        class="text-2xl font-extrabold text-white dark:text-yellow-200 drop-shadow-lg tracking-wide"
      >
        FunNav!
      </h2>
    </div>
    <ul class="space-y-6 w-full">
      <li>
        <router-link to="/learn" class="fancy-link">
          <AcademicCapIcon
            class="inline-block size-6 mr-2 text-yellow-200 drop-shadow"
          />
          <span class="text-lg text-white font-bold">Learn</span>
        </router-link>
      </li>
      <li>
        <router-link to="/letters" class="fancy-link">
          <ItalicIcon
            class="inline-block size-6 mr-2 text-pink-200 drop-shadow"
          />
          <span class="text-lg text-white font-bold">Letters</span>
        </router-link>
      </li>
      <li>
        <router-link to="/practice" class="fancy-link">
          <BeakerIcon
            class="inline-block size-6 mr-2 text-green-200 drop-shadow"
          />
          <span class="text-lg text-white font-bold">Practice</span>
        </router-link>
      </li>
      <li>
        <router-link to="/leaderboard" class="fancy-link">
          <TrophyIcon
            class="inline-block size-6 mr-2 text-yellow-300 drop-shadow"
          />
          <span class="text-lg text-white font-bold">Leaderboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/shop" class="fancy-link">
          <ShoppingBagIcon
            class="inline-block size-6 mr-2 text-purple-200 drop-shadow"
          />
          <span class="text-lg text-white font-bold">Shop</span>
        </router-link>
      </li>
      <li>
        <router-link to="/profile" class="fancy-link">
          <UserCircleIcon
            class="inline-block size-6 mr-2 text-orange-200 drop-shadow"
          />
          <span class="text-lg text-white font-bold">Profile</span>
        </router-link>
      </li>
    </ul>
    <div class="mt-auto pt-8">
      <span class="text-base text-white font-bold">Have fun learning! 🎉</span>
    </div>
  </nav>
</template>

<style scoped></style>
