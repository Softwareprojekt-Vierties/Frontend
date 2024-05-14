import { createRouter, createWebHistory } from 'vue-router'
import SucheView from '../views/SucheView.vue'

const routes = [
 {
    path: '/search',
    name: 'SearchAll',
    component: SucheView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router