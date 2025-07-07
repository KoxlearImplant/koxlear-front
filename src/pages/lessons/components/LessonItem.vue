<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'
import type { LessonItemType } from '../types'
import {
  PlayCircleIcon,
  PauseCircleIcon,
  SpeakerWaveIcon,
  CheckIcon,
  MicrophoneIcon,
} from '@heroicons/vue/24/outline'
import http from '@/service/http'

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
    feedback.value = t('lessons.microphoneError')
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
    feedback.value = t('lessons.sending')
    feedbackStatus.value = 'none'

    // Create a form data object to send the recorded audio
    const formData = new FormData()
    formData.append('user_audio', recordedBlob.value, 'recording.ogg') // Note the .mp3 extension
    formData.append('lesson_item', props.item.id.toString())

    // Call the API endpoint to check the recording
    const response = await http.post('/check/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Handle the response
    if (response.data.success) {
      feedback.value = response.data.message || t('lessons.goodJob')
      feedbackStatus.value = 'success'
      isItemCompleted.value = true
      emit('item-completed', props.item.id)
    } else {
      feedback.value = response.data.message || t('lessons.tryAgain')
      feedbackStatus.value = 'error'
    }
  } catch (error) {
    console.error('Error submitting recording:', error)
    feedback.value = t('lessons.errorSubmitting')
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
  if (isRecording.value) return t('lessons.stopRecording')
  return t('lessons.startRecording')
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
        <CheckIcon class="h-4 w-4 mr-1" />
        {{ t('lessons.stepCompleted') }}
      </div>
    </div>

    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div class="bg-blue-100 p-3 rounded-full mr-4">
          <SpeakerWaveIcon class="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h3 class="text-lg font-semibold">{{ item.word }}</h3>
          <p class="text-sm text-gray-500">
            {{ t('lessons.listenAndRepeat') }}
          </p>
        </div>
      </div>

      <Button
        @click="playAudio"
        class="bg-blue-500 hover:bg-blue-600 transition-colors flex items-center"
      >
        <PlayCircleIcon v-if="!isPlaying" class="h-5 w-5 mr-2" />
        <PauseCircleIcon v-else class="h-5 w-5 mr-2" />
        {{ isPlaying ? t('lessons.stop') : t('lessons.listen') }}
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
          <MicrophoneIcon
            class="h-8 w-8"
            :class="isRecording ? 'text-red-600' : 'text-gray-500'"
          />
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
              <PlayCircleIcon class="h-5 w-5 mr-2" />
              {{ t('lessons.playRecording') }}
            </Button>

            <div>
              <Button
                @click="resetRecording"
                class="bg-gray-200 text-gray-700 hover:bg-gray-300 mr-2"
                :disabled="isItemCompleted"
              >
                {{ t('lessons.reset') }}
              </Button>
              <Button
                @click="submitRecording"
                class="bg-green-500 hover:bg-green-600"
                :disabled="isSending || isItemCompleted"
              >
                <span v-if="isSending">
                  <svg
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
                </span>
                {{ t('lessons.submit') }}
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
