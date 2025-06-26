import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '@/pages/home/HomePage.vue'
import LoginView from '@/pages/auth/LoginView.vue'
import RegisterView from '@/pages/auth/RegisterView.vue'
import DashboardLayout from '@/layouts/dashboard-layout/DashboardLayout.vue'
import LessonsPage from '@/pages/lessons/LessonsPage.vue'
import LettersPage from '@/pages/letters/LettersPage.vue'
import LessonDetailPage from '@/pages/lessons/LessonDetailPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardLayout,
    children: [
      {
        path: 'lessons',
        name: 'Lessons',
        component: LessonsPage,
      },
      {
        path: 'lessons/:lessonId',
        name: 'LessonDetail',
        component: LessonDetailPage,
      },
      {
        path: 'letters',
        name: 'Letters',
        component: LettersPage,
      },
    ],
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: RegisterView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
