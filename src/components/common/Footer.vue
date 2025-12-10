<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const { t } = useI18n()
const router = useRouter()

const currentYear = computed(() => new Date().getFullYear())

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <footer class="bg-gray-900 text-gray-300 mt-auto">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- About Section -->
        <div>
          <h3 class="text-white text-lg font-bold mb-4">
            {{ t('footer.aboutKoxlear') || 'About Koxlear' }}
          </h3>
          <p class="text-sm mb-4">
            {{
              t('footer.aboutDescription') ||
              'A fun learning platform designed for children with cochlear implants to develop listening and speaking skills.'
            }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white text-lg font-bold mb-4">
            {{ t('footer.quickLinks') || 'Quick Links' }}
          </h3>
          <ul class="space-y-2">
            <li>
              <button
                @click="navigateTo('/')"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.home') || 'Home' }}
              </button>
            </li>
            <li>
              <button
                @click="navigateTo('/dashboard/lesson-groups')"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.lessons') || 'Lessons' }}
              </button>
            </li>
            <li>
              <button
                @click="navigateTo('/dashboard/practice')"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.practice') || 'Practice' }}
              </button>
            </li>
            <li>
              <button
                @click="navigateTo('/profile')"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.profile') || 'Profile' }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="text-white text-lg font-bold mb-4">
            {{ t('footer.resources') || 'Resources' }}
          </h3>
          <ul class="space-y-2">
            <li>
              <a
                href="#"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.forParents') || 'For Parents' }}
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.forTeachers') || 'For Teachers' }}
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.helpCenter') || 'Help Center' }}
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.faq') || 'FAQ' }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h3 class="text-white text-lg font-bold mb-4">
            {{ t('footer.legal') || 'Legal' }}
          </h3>
          <ul class="space-y-2">
            <li>
              <a
                href="#"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.privacyPolicy') || 'Privacy Policy' }}
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.termsOfService') || 'Terms of Service' }}
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.cookiePolicy') || 'Cookie Policy' }}
              </a>
            </li>
            <li>
              <a
                href="#"
                class="text-sm hover:text-white transition-colors duration-200"
              >
                {{ t('footer.accessibility') || 'Accessibility' }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center"
      >
        <div class="mb-4 md:mb-0">
          <p class="text-sm">
            © {{ currentYear }}
            {{ t('footer.copyright') || 'Koxlear. All rights reserved.' }}
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <a
            href="mailto:support@koxlear.com"
            class="text-sm hover:text-white transition-colors duration-200"
          >
            📧 {{ t('footer.contactEmail') || 'support@koxlear.com' }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

button,
a {
  display: inline-block;
  text-align: left;
}
</style>
