<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import LangSelect from '@/components/common/LangSelect.vue'
import { useAuthStore } from '@/store/auth.store'

const auth = useAuthStore()

// We'll use t() to localize text in the template
const { t } = useI18n()
const router = useRouter()

// Guest mode detection - in a real app, this would come from auth state
const isLoggedIn = computed(() => auth.isAuthenticated())
console.log('Is user logged in:', isLoggedIn.value)
interface Course {
  id: number
  title: string
  description: string
  level: string
  icon: string
  progress: number
  color: string
  lessons: number
  completedLessons: number
}

const userStreak = ref(3)
const userPoints = ref(120)
const userName = ref('Alex')

// Sample courses
const courses = ref<Course[]>([
  {
    id: 1,
    title: 'Hearing Basics',
    description: 'Learn fundamental sounds and speech patterns',
    level: 'Beginner',
    icon: '🔊',
    progress: 65,
    color: 'bg-green-500',
    lessons: 10,
    completedLessons: 6,
  },
  {
    id: 2,
    title: 'Word Recognition',
    description: 'Practice identifying common words',
    level: 'Intermediate',
    icon: '🗣️',
    progress: 30,
    color: 'bg-blue-500',
    lessons: 15,
    completedLessons: 4,
  },
  {
    id: 3,
    title: 'Conversation Skills',
    description: 'Learn how to follow everyday conversations',
    level: 'Advanced',
    icon: '👥',
    progress: 10,
    color: 'bg-purple-500',
    lessons: 12,
    completedLessons: 1,
  },
  {
    id: 4,
    title: 'Music Appreciation',
    description: 'Experience and enjoy music patterns',
    level: 'Beginner',
    icon: '🎵',
    progress: 0,
    color: 'bg-pink-500',
    lessons: 8,
    completedLessons: 0,
  },
])

const features = ref([
  {
    title: 'Interactive Learning',
    description:
      'Fun, game-like exercises designed specifically for cochlear implant users',
    icon: '🎮',
  },
  {
    title: 'Speech Recognition',
    description: 'Practice speaking and get instant feedback on pronunciation',
    icon: '🎤',
  },
  {
    title: 'Progress Tracking',
    description: 'See your improvement over time with detailed statistics',
    icon: '📈',
  },
])

// Demo courses for guest mode
const demoCourses = ref<Course[]>([
  {
    id: 101,
    title: 'Hearing Basics',
    description: 'Learn fundamental sounds and speech patterns',
    level: 'Beginner',
    icon: '🔊',
    progress: 0,
    color: 'bg-green-500',
    lessons: 10,
    completedLessons: 0,
  },
  {
    id: 102,
    title: 'Word Recognition',
    description: 'Practice identifying common words',
    level: 'Beginner',
    icon: '🗣️',
    progress: 0,
    color: 'bg-blue-500',
    lessons: 8,
    completedLessons: 0,
  },
])

// Choose courses based on login status
const displayCourses = computed(() => {
  return isLoggedIn.value ? courses.value : demoCourses.value
})

const startLesson = (courseId: number) => {
  if (isLoggedIn.value) {
    // Navigate to the course lessons page
    router.push(`/course/${courseId}/lessons`)
  } else {
    // Redirect to login if in guest mode
    router.push('/auth/login')
  }
}

const gotoNext = () => {
  if (isLoggedIn.value) {
    router.push('/dashboard')
  } else {
    router.push('/auth/login')
  }
}

const goToRegister = () => {
  if (isLoggedIn.value) {
    router.push('/dashboard')
  } else {
    router.push('/auth/register')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero section - Different for guest and logged-in users -->
    <div
      class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-10 text-white"
    >
      <!-- Language selector in top-right corner -->
      <div class="flex justify-end mb-4">
        <LangSelect />
      </div>

      <div class="md:flex items-start">
        <div class="md:w-2/3">
          <template v-if="isLoggedIn">
            <!-- Logged in user welcome -->
            <h1 class="text-3xl md:text-4xl font-bold mb-4">
              {{ t('home.welcome', { name: userName }) }}
            </h1>
            <p class="text-xl mb-6">{{ t('home.tagline') }}</p>
            <div class="flex space-x-4 mb-6">
              <Button
                class="bg-white text-blue-600 hover:bg-blue-50"
                @click="gotoNext"
              >
                {{ t('actions.continueLearning') }}
              </Button>
              <Button
                class="bg-transparent border-2 border-white hover:bg-white/10"
              >
                {{ t('actions.learnMore') }}
              </Button>
            </div>
          </template>
          <template v-else>
            <!-- Guest user welcome -->
            <h1 class="text-3xl md:text-4xl font-bold mb-4">
              {{ t('home.welcomeGuest') || 'Welcome to Koxlear!' }}
            </h1>
            <p class="text-xl mb-6">
              {{
                t('home.guestTagline') ||
                'The fun learning platform designed for children with cochlear implants'
              }}
            </p>
            <div class="flex flex-wrap gap-4 mb-6">
              <Button
                class="bg-white text-blue-600 hover:bg-blue-50"
                @click="goToRegister"
              >
                {{ t('actions.signUp') || 'Sign Up Free' }}
              </Button>
              <Button
                class="bg-transparent border-2 border-white hover:bg-white/10"
                @click="gotoNext"
              >
                {{ t('actions.login') || 'Login' }}
              </Button>
            </div>
          </template>
        </div>

        <div class="md:w-1/3 flex justify-center mt-6 md:mt-0">
          <div
            v-if="isLoggedIn"
            class="bg-white/20 p-6 rounded-xl backdrop-blur-sm"
          >
            <!-- User stats for logged in users -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="text-2xl mr-2">🔥</div>
                <div>
                  <div class="text-sm">{{ t('home.streak') }}</div>
                  <div class="text-xl font-bold">
                    {{ userStreak }} {{ t('home.days') }}
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <div class="text-2xl mr-2">⭐</div>
                <div>
                  <div class="text-sm">{{ t('home.points') }}</div>
                  <div class="text-xl font-bold">{{ userPoints }} XP</div>
                </div>
              </div>
            </div>
            <Button
              class="w-full bg-yellow-400 text-gray-800 hover:bg-yellow-300"
              @click="gotoNext"
            >
              {{ t('actions.continueLearning') }}
            </Button>
          </div>
          <div v-else class="bg-white/20 p-6 rounded-xl backdrop-blur-sm">
            <!-- Demo info for guests -->
            <div class="text-center">
              <div class="text-4xl mb-2">👋</div>
              <h3 class="text-lg font-bold mb-2">
                {{ t('home.tryForFree') || 'Try for Free' }}
              </h3>
              <p class="text-sm mb-4">
                {{
                  t('home.createAccount') ||
                  'Create an account to start your learning journey'
                }}
              </p>
              <Button
                class="w-full bg-yellow-400 text-gray-800 hover:bg-yellow-300"
                @click="goToRegister"
              >
                {{ t('actions.getStarted') }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Courses section -->
    <div class="mb-12">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">
          {{
            isLoggedIn
              ? t('home.yourCourses')
              : t('home.exploreCourses') || 'Explore Courses'
          }}
        </h2>
        <Button v-if="isLoggedIn" variant="outline" class="border-gray-300">
          {{ t('actions.viewAll') }}
        </Button>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="course in displayCourses"
          :key="course.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          @click="startLesson(course.id)"
        >
          <div :class="`${course.color} p-4 text-white`">
            <div class="flex justify-between items-center">
              <div class="text-4xl">{{ course.icon }}</div>
              <div
                class="text-sm font-medium px-2 py-1 bg-white/20 rounded-full"
              >
                {{ course.level }}
              </div>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold mb-1">{{ course.title }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ course.description }}</p>

            <div class="relative h-2 bg-gray-100 rounded-full mb-2">
              <div
                class="absolute top-0 left-0 h-2 rounded-full"
                :class="course.color"
                :style="`width: ${course.progress}%`"
              ></div>
            </div>

            <div class="text-xs text-gray-500">
              {{ course.completedLessons }}/{{ course.lessons }}
              {{ t('home.lessons') }}
              <span v-if="course.completedLessons > 0"
                >· {{ course.progress }}% {{ t('home.complete') }}</span
              >
              <span v-if="!isLoggedIn" class="ml-2 text-blue-500">{{
                t('home.tryFree') || '• Try for free'
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily goal section - Only for logged in users -->
    <div v-if="isLoggedIn" class="bg-white rounded-xl shadow-md p-6 mb-12">
      <h2 class="text-2xl font-bold mb-4">{{ t('home.dailyGoal') }}</h2>
      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="w-full md:w-2/3">
          <div class="relative h-6 bg-gray-100 rounded-full">
            <div
              class="absolute top-0 left-0 h-6 bg-green-500 rounded-full flex items-center px-3 text-xs font-medium text-white"
              style="width: 40%"
            >
              10 {{ t('home.minutesToday') }}
            </div>
          </div>

          <div class="flex justify-between mt-2">
            <div class="text-xs text-gray-500">0 {{ t('home.min') }}</div>
            <div class="text-xs font-medium">
              {{ t('home.goal') }}: 25 {{ t('home.min') }}
            </div>
          </div>
        </div>

        <div>
          <Button class="bg-green-500 hover:bg-green-600">
            {{ t('actions.practiceNow') }} 🎯
          </Button>
        </div>
      </div>
    </div>

    <!-- Features section -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">{{ t('home.whyKoxlear') }}</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-white rounded-xl shadow-md p-6"
        >
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- For Parents section - Added for guest mode -->
    <div v-if="!isLoggedIn" class="bg-white rounded-xl shadow-md p-6 mb-12">
      <h2 class="text-2xl font-bold mb-4">
        {{ t('home.forParents') || 'For Parents and Caregivers' }}
      </h2>
      <div class="md:flex gap-8">
        <div class="md:w-2/3">
          <p class="mb-4">
            {{
              t('home.parentInfo') ||
              'Koxlear is designed specifically to help children with cochlear implants develop their listening and speaking skills through fun, engaging activities. Our app uses evidence-based methods developed with audiologists and speech therapists.'
            }}
          </p>
          <ul class="list-disc pl-5 mb-4">
            <li class="mb-2">
              {{
                t('home.parentBenefit1') ||
                'Regular practice with sounds and words tailored to cochlear implant users'
              }}
            </li>
            <li class="mb-2">
              {{
                t('home.parentBenefit2') ||
                'Progress tracking to monitor improvement over time'
              }}
            </li>
            <li class="mb-2">
              {{
                t('home.parentBenefit3') ||
                'Games designed to make learning fun and engaging'
              }}
            </li>
          </ul>
        </div>
        <div class="md:w-1/3 flex items-center justify-center mt-4 md:mt-0">
          <div class="bg-blue-100 p-6 rounded-xl text-center">
            <div class="text-4xl mb-2">👨‍👩‍👧</div>
            <p class="text-blue-800 font-medium mb-4">
              {{
                t('home.parentSupport') ||
                "Support your child's learning journey"
              }}
            </p>
            <Button class="bg-blue-600 hover:bg-blue-700 text-white">
              {{ t('home.learnMoreParents') || 'Learn More' }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to action - Different for guests -->
    <div
      class="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 text-white text-center mb-8"
    >
      <h2 class="text-2xl md:text-3xl font-bold mb-4">
        {{
          isLoggedIn
            ? t('home.readyToStart')
            : t('home.joinToday') || 'Join Koxlear Today!'
        }}
      </h2>
      <p class="md:text-lg mb-6 max-w-2xl mx-auto">
        {{
          isLoggedIn
            ? t('home.joinCommunity')
            : t('home.guestCta') ||
              'Start your learning journey and help develop essential hearing and speaking skills in a fun, supportive environment.'
        }}
      </p>
      <div class="flex flex-col md:flex-row gap-4 justify-center">
        <Button
          v-if="!isLoggedIn"
          class="bg-white text-purple-600 hover:bg-blue-50"
          @click="goToRegister"
        >
          {{ t('actions.signUpFree') || 'Sign Up Free' }}
        </Button>
        <Button
          v-if="isLoggedIn"
          class="bg-white text-purple-600 hover:bg-blue-50"
        >
          {{ t('actions.startFreeTrial') }}
        </Button>
        <Button class="bg-transparent border-2 border-white hover:bg-white/10">
          {{
            isLoggedIn
              ? t('actions.contactUs')
              : t('actions.learnMore') || 'Learn More'
          }}
        </Button>
      </div>
    </div>

    <!-- Testimonials -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">{{ t('home.successStories') }}</h2>
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="md:w-1/4 flex justify-center">
            <div
              class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl"
            >
              👧
            </div>
          </div>
          <div class="md:w-3/4">
            <p class="italic text-gray-700 mb-4">
              "{{ t('home.testimonialText') }}"
            </p>
            <div>
              <p class="font-bold">Sophia, 9</p>
              <p class="text-sm text-gray-600">
                {{ t('home.testimonialDetail') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

/* Animation for button hover */
button {
  transition: transform 0.2s;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}
</style>
