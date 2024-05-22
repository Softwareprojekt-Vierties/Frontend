import { createRouter, createWebHistory } from 'vue-router'
import AnmeldungView from '../views/AnmeldungView.vue'
import SignupView from '../views/SignupView.vue'
import NutzerUnterscheidungView from '../views/NutzerUnterscheidungView.vue'
import ServiceTypeView from '../views/ServiceTypeView.vue'
import SucheView from '@/views/SucheView.vue'

const routes = [
  {
    path: '/',
    name: 'anmeldung',
    component: AnmeldungView // Corrigido para usar AnmeldungView
  },  {
    path: '/signup',
    name: 'signupSeite',
    component: SignupView 
  }
  ,  {
    path: '/usertype',
    name: 'SelectingUserType',
    component: NutzerUnterscheidungView 
  },  {
    path: '/servicetype',
    name: 'SelectingServiceType',
    component: ServiceTypeView 
  },  {
    path: '/search',
    name: 'SucheViewType',
    component: SucheView 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router