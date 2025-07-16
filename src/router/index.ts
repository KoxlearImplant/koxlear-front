import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'
import HomePage from '@/pages/home/HomePage.vue'
import LoginView from '@/pages/auth/LoginView.vue'
import RegisterView from '@/pages/auth/RegisterView.vue'
import DashboardLayout from '@/layouts/dashboard-layout/DashboardLayout.vue'
import LessonsPage from '@/pages/lessons/LessonsPage.vue'
import LettersPage from '@/pages/letters/LettersPage.vue'
import LessonDetailPage from '@/pages/lessons/LessonDetailPage.vue'
import ProfilePage from '@/pages/profile/ProfilePage.vue'
import LessonGroupsPage from '@/pages/lessons/LessonGroupsPage.vue'
import RandomCartoonPage from '@/pages/random-cartoon/RandomCartoonPage.vue'

const routes: RouteRecordRaw[] = [
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
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'lesson-groups',
        name: 'LessonGroups',
        component: LessonGroupsPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'lesson-groups/:id',
        name: 'Lessons',
        component: LessonsPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'lessons/:id',
        name: 'LessonDetail',
        component: LessonDetailPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'letters',
        name: 'Letters',
        component: LettersPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfilePage,
        meta: { requiresAuth: true },
      },
      {
        path: 'random-cartoon',
        name: 'RandomCartoon',
        component: RandomCartoonPage,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const auth = useAuthStore()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!auth.isAuthenticated()) {
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
