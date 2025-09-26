import { ref } from 'vue'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning'

export interface ToastItem {
  id: number
  title?: string
  description?: string
  variant: ToastVariant
  durationMs: number
}

const toasts = ref<ToastItem[]>([])
let idCounter = 1

export function useToasts() {
  const remove = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const push = (toast: Omit<ToastItem, 'id'>) => {
    const id = idCounter++
    const item: ToastItem = { id, ...toast }
    toasts.value.push(item)
    if (item.durationMs > 0) {
      setTimeout(() => remove(id), item.durationMs)
    }
    return id
  }

  const success = (description: string, title = 'Success') =>
    push({ title, description, variant: 'success', durationMs: 3000 })

  const error = (description: string, title = 'Error') =>
    push({ title, description, variant: 'error', durationMs: 3000 })

  const warning = (description: string, title = 'Warning') =>
    push({ title, description, variant: 'warning', durationMs: 3000 })

  const info = (description: string, title = 'Info') =>
    push({ title, description, variant: 'default', durationMs: 3000 })

  return { toasts, push, remove, success, error, warning, info }
}

export default useToasts
