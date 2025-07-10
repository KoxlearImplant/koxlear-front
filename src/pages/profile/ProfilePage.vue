<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGetProfile } from '@/pages/profile/queries/useGetProfile'
import { useUpdateProfile } from '@/pages/profile/queries/useUpdateProfile'
import { useAuthStore } from '@/store/auth.store'

const { data: profile, isLoading, error, refetch } = useGetProfile()
const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
const authStore = useAuthStore()

// Edit mode state
const isEditing = ref(false)
const editForm = ref({
  first_name: '',
  last_name: '',
  gender: null as 'male' | 'female' | null,
})

// Initialize edit form when profile data loads
const initializeEditForm = () => {
  if (profile.value) {
    editForm.value = {
      first_name: profile.value.first_name || '',
      last_name: profile.value.last_name || '',
      gender: profile.value.gender || null,
    }
  }
}

// Watch for profile data changes
watch(
  profile,
  () => {
    if (profile.value) {
      initializeEditForm()
    }
  },
  { immediate: true }
)

// Computed properties
const fullName = computed(() => {
  if (!profile.value) return ''
  return `${profile.value.first_name || ''} ${profile.value.last_name || ''}`.trim()
})

const avatarUrl = computed(() => {
  return profile.value?.avatarUrl || '/default-avatar.png'
})

const joinDate = computed(() => {
  if (!profile.value?.createdAt) return ''
  return new Date(profile.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const genderDisplay = computed(() => {
  if (!profile.value?.gender) return 'Not specified'
  return profile.value.gender === 'male' ? 'Male' : 'Female'
})

// Methods
const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    initializeEditForm()
  }
}

const saveProfile = async () => {
  try {
    updateProfile(
      {
        first_name: editForm.value.first_name,
        last_name: editForm.value.last_name,
        gender: editForm.value.gender,
      },
      {
        onSuccess: () => {
          isEditing.value = false
        },
        onError: (error) => {
          console.error('Error saving profile:', error)
        },
      }
    )
  } catch (error) {
    console.error('Error saving profile:', error)
  }
}

const cancelEdit = () => {
  isEditing.value = false
  initializeEditForm()
}

const logout = () => {
  authStore.logout()
  // Redirect to login page
  window.location.href = '/login'
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1
          class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Profile Settings
        </h1>
        <p class="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your personal information and account preferences
        </p>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center py-20"
      >
        <div class="relative">
          <div
            class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
          ></div>
          <div
            class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"
            style="animation-delay: -0.5s"
          ></div>
        </div>
        <p class="mt-4 text-gray-600 font-medium">Loading your profile...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div
          class="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-8 w-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-red-800">
                Unable to load profile
              </h3>
              <p class="mt-1 text-red-700">{{ error.message }}</p>
            </div>
          </div>
          <div class="mt-6">
            <button
              @click="() => refetch()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="profile" class="space-y-8">
        <!-- Main Profile Card -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- Profile Header -->
          <div
            class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 relative"
          >
            <div class="absolute inset-0 bg-black opacity-10"></div>
            <div class="relative flex items-center space-x-8">
              <!-- Avatar -->
              <div class="relative">
                <div
                  class="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden"
                >
                  <img
                    :src="avatarUrl"
                    :alt="fullName"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  class="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-3 border-white flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <!-- Profile Info -->
              <div class="flex-1 text-white">
                <h2 class="text-3xl font-bold mb-2">
                  {{ fullName || 'Complete your profile' }}
                </h2>
                <p class="text-blue-100 text-lg">{{ profile.email }}</p>
                <div class="flex items-center mt-3 space-x-6 text-blue-100">
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Member since {{ joinDate }}</span>
                  </div>
                  <div v-if="profile.gender" class="flex items-center">
                    <svg
                      class="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ genderDisplay }}</span>
                  </div>
                </div>
              </div>

              <!-- Edit Button -->
              <div class="flex-shrink-0">
                <button
                  v-if="!isEditing"
                  @click="toggleEdit"
                  class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="p-8">
            <div v-if="isEditing" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >First Name</label
                  >
                  <input
                    v-model="editForm.first_name"
                    type="text"
                    placeholder="Enter your first name"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Last Name</label
                  >
                  <input
                    v-model="editForm.last_name"
                    type="text"
                    placeholder="Enter your last name"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700"
                  >Gender</label
                >
                <select
                  v-model="editForm.gender"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option :value="null">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <!-- Action Buttons -->
              <div
                class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200"
              >
                <button
                  @click="cancelEdit"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  @click="saveProfile"
                  :disabled="isUpdating"
                  class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg
                    v-if="isUpdating"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ isUpdating ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Information Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Account Details -->
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="flex items-center mb-6">
              <div
                class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4"
              >
                <svg
                  class="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">Account Details</h3>
            </div>
            <div class="space-y-4">
              <div
                class="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Username</span>
                <span class="text-gray-900 font-semibold">{{
                  profile.username
                }}</span>
              </div>
              <div
                class="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">User ID</span>
                <span class="text-gray-900 font-semibold"
                  >#{{ profile.id }}</span
                >
              </div>
              <div
                class="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Email</span>
                <span class="text-gray-900 font-semibold">{{
                  profile.email
                }}</span>
              </div>
              <div
                class="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Gender</span>
                <span class="text-gray-900 font-semibold">{{
                  genderDisplay
                }}</span>
              </div>
              <div
                class="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <span class="text-gray-600 font-medium">Created</span>
                <span class="text-gray-900 font-semibold">{{ joinDate }}</span>
              </div>
              <div class="flex justify-between items-center py-3">
                <span class="text-gray-600 font-medium">Last Updated</span>
                <span class="text-gray-900 font-semibold">{{
                  new Date(profile.updatedAt).toLocaleDateString()
                }}</span>
              </div>
            </div>
          </div>

          <!-- Connected Services -->
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="flex items-center mb-6">
              <div
                class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4"
              >
                <svg
                  class="w-6 h-6 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  />
                  <path
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">
                Connected Services
              </h3>
            </div>
            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3"
                  >
                    <svg
                      class="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"
                      />
                      <path
                        d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">Telegram</p>
                    <p class="text-sm text-gray-500">
                      {{ profile.telegram_id || 'Not connected' }}
                    </p>
                  </div>
                </div>
                <div
                  v-if="profile.telegram_id"
                  class="w-3 h-3 bg-green-400 rounded-full"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="flex items-center mb-6">
            <div
              class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4"
            >
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Account Actions</h3>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-900 font-medium">Sign out of your account</p>
              <p class="text-gray-500 text-sm">
                This will end your current session
              </p>
            </div>
            <button
              @click="logout"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations and transitions */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
