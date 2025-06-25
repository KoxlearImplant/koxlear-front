import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/pages/HomeView.vue'
import Login from '@/pages/Auth/LoginView.vue'
import Register from '@/pages/Auth/RegisterView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
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
