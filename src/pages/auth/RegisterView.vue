<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import LangSelect from '@/components/common/LangSelect.vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const { t } = useI18n()
const router = useRouter()

const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Form validation schema
const schema = yup.object({
  name: yup.string().required(t('auth.nameRequired') || 'Name is required'),
  email: yup
    .string()
    .email(t('auth.invalidEmail') || 'Invalid email')
    .required(t('auth.emailRequired') || 'Email is required'),
  password: yup
    .string()
    .min(8, t('auth.passwordMin') || 'Password must be at least 8 characters')
    .required(t('auth.passwordRequired') || 'Password is required'),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password')],
      t('auth.passwordMatch') || 'Passwords must match'
    )
    .required(
      t('auth.confirmPasswordRequired') || 'Please confirm your password'
    ),
  agreeTerms: yup
    .boolean()
    .oneOf(
      [true],
      t('auth.agreeTermsRequired') ||
        'You must agree to the terms and conditions'
    )
    .required(),
})

// Form handling with vee-validate
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

// Define form fields
const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: confirmPassword } = useField('confirmPassword')
const { value: agreeTerms } = useField('agreeTerms')

// Check if form is valid to enable/disable submit button
const isFormValid = computed(() => {
  return (
    name.value &&
    email.value &&
    password.value &&
    confirmPassword.value &&
    agreeTerms.value &&
    Object.keys(errors.value).length === 0
  )
})

const handleRegister = handleSubmit(async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful registration
    successMessage.value =
      t('auth.registerSuccess') || 'Account created successfully!'

    // Redirect to login after short delay
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  } catch (error) {
    console.log(error)
    errorMessage.value =
      t('auth.registerFailed') || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
})

const goToLogin = () => {
  router.push('/auth/login')
}

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Language selector -->
    <div class="absolute top-4 right-4">
      <LangSelect />
    </div>

    <div class="max-w-md w-full mx-auto">
      <!-- Logo/App name -->
      <div class="text-center mb-8">
        <h2
          class="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          @click="goToHome"
          style="cursor: pointer"
        >
          Koxlear
        </h2>
        <p class="mt-2 text-gray-600">
          {{ t('auth.registerSubtitle') || 'Start your learning journey' }}
        </p>
      </div>

      <!-- Register Form -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Form header -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <h1 class="text-xl font-bold text-white">
            {{ t('auth.register') || 'Register' }}
          </h1>
        </div>

        <div class="p-6">
          <!-- Success message -->
          <div
            v-if="successMessage"
            class="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm"
          >
            {{ successMessage }}
          </div>

          <!-- Error message -->
          <div
            v-if="errorMessage"
            class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm"
          >
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleRegister">
            <!-- Name field -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-medium mb-2"
                for="name"
              >
                {{ t('auth.name') || 'Full Name' }}
              </label>
              <input
                id="name"
                v-model="name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="
                  t('auth.namePlaceholder') || 'Enter your full name'
                "
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <!-- Email field -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-medium mb-2"
                for="email"
              >
                {{ t('auth.email') || 'Email' }}
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="t('auth.emailPlaceholder') || 'Enter your email'"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-red-500">
                {{ errors.email }}
              </p>
            </div>

            <!-- Password field -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-medium mb-2"
                for="password"
              >
                {{ t('auth.password') || 'Password' }}
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="
                  t('auth.passwordPlaceholder') || 'Enter your password'
                "
              />
              <p v-if="errors.password" class="mt-1 text-xs text-red-500">
                {{ errors.password }}
              </p>
            </div>

            <!-- Confirm Password field -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-medium mb-2"
                for="confirm-password"
              >
                {{ t('auth.confirmPassword') || 'Confirm Password' }}
              </label>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="
                  t('auth.confirmPasswordPlaceholder') ||
                  'Confirm your password'
                "
              />
              <p
                v-if="errors.confirmPassword"
                class="mt-1 text-xs text-red-500"
              >
                {{ errors.confirmPassword }}
              </p>
            </div>

            <!-- Terms checkbox -->
            <div class="mb-6">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="terms"
                    v-model="agreeTerms"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <label for="terms" class="ml-2 block text-sm text-gray-700">
                  {{
                    t('auth.agreeTerms') ||
                    'I agree to the Terms and Conditions'
                  }}
                </label>
              </div>
              <p v-if="errors.agreeTerms" class="mt-1 text-xs text-red-500">
                {{ errors.agreeTerms }}
              </p>
            </div>

            <!-- Register button -->
            <Button
              type="submit"
              class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              :disabled="isLoading || !isFormValid"
            >
              <span v-if="isLoading">{{
                t('auth.registering') || 'Creating your account...'
              }}</span>
              <span v-else>{{ t('auth.register') || 'Register' }}</span>
            </Button>
          </form>
        </div>
      </div>

      <!-- Login link -->
      <div class="text-center mt-6">
        <p class="text-gray-600">
          {{ t('auth.alreadyHaveAccount') || 'Already have an account?' }}
          <span
            class="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            @click="goToLogin"
          >
            {{ t('auth.login') || 'Login' }}
          </span>
        </p>
      </div>

      <!-- Continue as guest -->
      <div class="text-center mt-4">
        <a
          @click="goToHome"
          class="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
        >
          {{ t('auth.continueAsGuest') || 'Continue as guest' }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hover animations */
button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

/* Focus states for better accessibility */
input:focus {
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

/* Disabled button styling */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}
</style>
