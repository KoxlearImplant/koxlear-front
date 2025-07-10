export interface GroupType {
  id: number
  name: string
}

export interface LessonItemType {
  id: number
  type: 'tts' | 'stt' | 'img' // Text-to-speech, Speech-to-text, Image-based
  word: string
  audio: string
  image: string | null
}

export interface LessonType {
  id: number
  title: string
  items: LessonItemType[]
  group: GroupType
}

export interface LessonGroupType {
  id: number
  name: string
  slug: string
  order: number
  total_items_count: number
  completed_items_count: number
}
