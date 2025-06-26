<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'
import type { LessonItemType } from '../types'
import axios from 'axios'

const { t } = useI18n()
const props = defineProps<{
  item: LessonItemType
}>()

const emit = defineEmits<{
  (e: 'item-completed', id: number): void
}>()

const isRecording = ref(false)
const isPlaying = ref(false)
const recordedAudio = ref<string | null>(null)
const recordedBlob = ref<Blob | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const feedback = ref<string>('')
const feedbackStatus = ref<'success' | 'error' | 'none'>('none')
const isSending = ref(false)
const isItemCompleted = ref(false)

const audioRef = ref<HTMLAudioElement | null>(null)
const recordedAudioRef = ref<HTMLAudioElement | null>(null)

// Play the lesson audio
const playAudio = () => {
  if (isPlaying.value) {
    audioRef.value?.pause()
    isPlaying.value = false
    return
  }

  if (audioRef.value) {
    audioRef.value.play()
    isPlaying.value = true

    // Reset when audio ends
    audioRef.value.onended = () => {
      isPlaying.value = false
    }
  }
}

// Start recording user's voice
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioChunks.value = []

    // Try to use ogg format if supported by the browser
    let options = {}
    if (MediaRecorder.isTypeSupported('audio/ogg')) {
      options = { mimeType: 'audio/ogg' }
    } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      options = { mimeType: 'audio/webm;codecs=opus' }
    }

    mediaRecorder.value = new MediaRecorder(stream, options)
    isRecording.value = true

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data)
    }

    mediaRecorder.value.onstop = () => {
      // Create blob of the recording for preview
      const audioBlob = new Blob(audioChunks.value, {
        type: mediaRecorder.value?.mimeType || 'audio/ogg',
      })
      recordedBlob.value = audioBlob
      recordedAudio.value = URL.createObjectURL(audioBlob)
    }

    mediaRecorder.value.start()
  } catch (error) {
    console.error('Error accessing microphone:', error)
    feedback.value =
      t('lessons.microphoneError') || 'Could not access microphone'
    feedbackStatus.value = 'error'
  }
}

// Stop recording
const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false

    // Stop all audio tracks to release the microphone
    mediaRecorder.value.stream.getTracks().forEach((track) => track.stop())
  }
}

// Play recorded audio
const playRecordedAudio = () => {
  if (recordedAudioRef.value) {
    recordedAudioRef.value.play()
  }
}

// Submit recording to server for checking
const submitRecording = async () => {
  if (!recordedBlob.value) return

  try {
    isSending.value = true
    feedback.value = t('lessons.sending') || 'Sending your recording...'
    feedbackStatus.value = 'none'

    // Create a form data object to send the recorded audio
    const formData = new FormData()
    formData.append('user_audio', recordedBlob.value, 'recording.ogg') // Note the .mp3 extension
    formData.append('lesson_item', props.item.id.toString())

    // Call the API endpoint to check the recording
    const response = await axios.post(
      'http://192.168.100.52:8000/api/check/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    // Handle the response
    if (response.data.success) {
      feedback.value =
        response.data.message ||
        t('lessons.goodJob') ||
        'Good job! Your pronunciation is correct.'
      feedbackStatus.value = 'success'
      isItemCompleted.value = true

      // Emit that this item is completed
      emit('item-completed', props.item.id)
    } else {
      feedback.value =
        response.data.message ||
        t('lessons.tryAgain') ||
        'Try again with your pronunciation.'
      feedbackStatus.value = 'error'
    }
  } catch (error) {
    console.error('Error submitting recording:', error)
    feedback.value =
      t('lessons.errorSubmitting') ||
      'Error submitting recording. Please try again.'
    feedbackStatus.value = 'error'
  } finally {
    isSending.value = false
  }
}

// Reset the recording and feedback
const resetRecording = () => {
  recordedAudio.value = null
  recordedBlob.value = null
  feedback.value = ''
  feedbackStatus.value = 'none'
}

const buttonColor = computed(() => {
  if (feedbackStatus.value === 'success') return 'bg-green-500'
  if (feedbackStatus.value === 'error') return 'bg-red-500'
  if (isRecording.value) return 'bg-red-600'
  return 'bg-blue-500'
})

const buttonText = computed(() => {
  if (isRecording.value) return t('lessons.stopRecording') || 'Stop Recording'
  return t('lessons.startRecording') || 'Record Your Voice'
})
</script>

<template>
  <div
    class="lesson-item bg-white rounded-xl shadow-md overflow-hidden p-6 mb-4"
    :class="{ 'border-2 border-green-500': isItemCompleted }"
  >
    <!-- Success indicator for completed items -->
    <div v-if="isItemCompleted" class="flex items-center justify-between mb-3">
      <div
        class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {{ t('lessons.stepCompleted', 'Step Completed') }}
      </div>
    </div>

    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div class="bg-blue-100 p-3 rounded-full mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a5 5 0 00-7.072 0"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold">{{ item.word }}</h3>
          <p class="text-sm text-gray-500">
            {{ t('lessons.listenAndRepeat') || 'Listen and repeat' }}
          </p>
        </div>
      </div>

      <Button
        @click="playAudio"
        class="bg-blue-500 hover:bg-blue-600 transition-colors flex items-center"
      >
        <svg
          v-if="!isPlaying"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        {{
          isPlaying
            ? t('lessons.stop') || 'Stop'
            : t('lessons.listen') || 'Listen'
        }}
      </Button>
    </div>

    <audio
      ref="audioRef"
      :src="item.audio"
      preload="auto"
      class="hidden"
    ></audio>

    <!-- Recording section -->
    <div class="mt-6 border-t pt-4">
      <div class="flex flex-col items-center">
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          :class="[isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100']"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            :class="isRecording ? 'text-red-600' : 'text-gray-500'"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>

        <Button
          @click="isRecording ? stopRecording() : startRecording()"
          :class="buttonColor"
          class="mb-4 transition-colors"
          :disabled="isItemCompleted"
        >
          {{ buttonText }}
        </Button>

        <!-- Recorded audio controls -->
        <div v-if="recordedAudio" class="w-full my-4">
          <div class="flex justify-between items-center">
            <Button
              @click="playRecordedAudio"
              class="bg-gray-500 hover:bg-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ t('lessons.playRecording') || 'Play Recording' }}
            </Button>

            <div>
              <Button
                @click="resetRecording"
                class="bg-gray-200 text-gray-700 hover:bg-gray-300 mr-2"
                :disabled="isItemCompleted"
              >
                {{ t('lessons.reset') || 'Reset' }}
              </Button>
              <Button
                @click="submitRecording"
                class="bg-green-500 hover:bg-green-600"
                :disabled="isSending || isItemCompleted"
              >
                <svg
                  v-if="isSending"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                {{ t('lessons.submit') || 'Submit' }}
              </Button>
            </div>
          </div>

          <audio
            ref="recordedAudioRef"
            :src="recordedAudio"
            class="hidden"
          ></audio>
        </div>

        <!-- Feedback message -->
        <div
          v-if="feedback"
          class="w-full p-3 rounded-lg mt-2 text-center"
          :class="{
            'bg-green-100 text-green-700': feedbackStatus === 'success',
            'bg-red-100 text-red-700': feedbackStatus === 'error',
            'bg-blue-100 text-blue-700': feedbackStatus === 'none',
          }"
        >
          {{ feedback }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lesson-item {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.lesson-item:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
