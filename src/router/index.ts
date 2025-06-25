import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '@/pages/Auth/LoginView.vue'
import Register from '@/pages/Auth/RegisterView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '/home',
        name: 'basic.home',
        component: () => import('@/pages/HomeView.vue'),
      },
    ],
  },

  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: Register,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
