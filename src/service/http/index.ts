import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

class HttpService {
  service: AxiosInstance

  constructor() {
    const service = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    })

    service.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    )
    service.interceptors.response.use(this.handleSuccess, this.handleError)
    this.service = service
  }

  handleRequest = (
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig => {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  }

  handleRequestError = (error: AxiosError) => {
    return Promise.reject(error)
  }

  handleSuccess(response: AxiosResponse): AxiosResponse {
    return response
  }

  handleError = (error: AxiosError) => {
    // switch (error?.response?.status) {
    //   case 401:
    //     this.redirectTo(document, "/login");
    //     break;
    // }
    return Promise.reject(error)
  }

  redirectTo = (document: Document, path: string): void => {
    document.location.href = path
  }
}

const http = new HttpService().service

export default http
