import { createRouter, createWebHistory } from 'vue-router'
import AnmeldungView from '../views/AnmeldungView.vue'
import SignupView from '../views/SignupView.vue'
import NutzerUnterscheidungView from '../views/NutzerUnterscheidungView.vue'
import ServiceTypeView from '../views/ServiceTypeView.vue'
import CreateEvent from '../views/CreateEventView.vue'
import SucheView from '@/views/SucheView.vue'
import CreateCatererView from '@/views/CreateCatererView.vue'
import CreateLocationView from '@/views/CreateLocationView.vue'
import CreateDjView from '@/views/CreateDjView.vue'
import EditCatererView from '@/views/EditCatererView.vue'

const routes = [
  {
    path: '/',
    name: 'anmeldung',
    component: AnmeldungView 
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
    path: '/createevent',
    name: 'CreateEventType',
    component: CreateEvent 
  },  {
    path: '/search',
    name: 'SucheViewType',
    component: SucheView 
  },  {
    path: '/createcaterer',
    name: 'CreateCatererType',
    component: CreateCatererView 
  },  {
    path: '/createlocation',
    name: 'CreateLocationType',
    component: CreateLocationView 
  },  {
    path: '/createdj',
    name: 'CreateDjType',
    component: CreateDjView 

  }, {
    path: '/editcaterer',
    name: 'EditCatererType',
    component: EditCatererView 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
