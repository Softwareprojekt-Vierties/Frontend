import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import SignupView from '../views/SignupView.vue'
import NutzerUnterscheidungView from '../views/NutzerUnterscheidungView.vue'
import ServiceTypeView from '../views/ServiceTypeView.vue'
import CreateEvent from '../views/CreateEventView.vue'
import SucheView from '@/views/SucheView.vue'
import CreateCatererView from '@/views/CreateCatererView.vue'
import CreateLocationView from '@/views/CreateLocationView.vue'
import CreateDjView from '@/views/CreateDjView.vue'
import EditCatererView from '@/views/EditCatererView.vue'
import EditDjView from '@/views/EditDjView.vue'
import EditLocationView from '@/views/EditLocationView.vue'
import EventView from '@/views/EventView.vue'
import LocationView from '@/views/LocationView.vue'

import CatererView from '@/views/CatererView.vue'


import DjView from '@/views/DjView.vue'
import CreatePersonView from '@/views/CreatePersonView.vue'
import PersonView from '@/views/PersonView.vue'
import EmailView from '@/views/EmailView.vue'

import MobileLoginView from '@/views/MobileLoginView.vue'
import MobileSignupView from '@/views/MobileSignupView.vue'



function isMobile() {
    const MAX_MOBILE_WIDTH = 800;
    return window.innerWidth < MAX_MOBILE_WIDTH;
}

const routes = [
    {
        path: '/',
        name: 'login',
        component: isMobile() ? MobileLoginView : LoginView // Corrigido para usar AnmeldungView
    },  { //                    󱞩 MobileView    󱞩 DesktopView
        path: '/signup',
        name: 'signupSeite',
        component: isMobile() ? MobileSignupView  : SignupView 
    }
    ,  {
        path: '/usertype',
        name: 'SelectingUserType',
        component: isMobile() ? NutzerUnterscheidungView  : NutzerUnterscheidungView 
    },  {
        path: '/servicetype',
        name: 'SelectingServiceType',
        component: isMobile() ? ServiceTypeView  : ServiceTypeView 
    },  {
        path: '/search',
        name: 'SucheViewType',
        component: isMobile() ? SucheView  : SucheView 
    },
  {
    path: '/dj',
    name: 'DjType',
    component: DjView
  } , {
    path :'/caterer',
    name : 'CatererType',
    component : CatererView
  },

{
    path: '/createevent',
    name: 'CreateEventType',
    component: CreateEvent 
},
    {
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
}, {
    path: '/editdj',
    name: 'EditDjType',
    component: EditDjView 
},  {
    path: '/editlocation/:id',
    name: 'EditLocationType',
    component: EditLocationView 
},  {
    path: '/event',
    name: 'EventType',
    component: EventView
},  {
    path: '/location',
    name: 'LocationType',
    component: LocationView
},  {
    path: '/dj',
    name: 'DjType',
    component: DjView
},  {
    path: '/createPerson',
    name: 'CreatePersonType',
    component: CreatePersonView
},  {
    path: '/person/:id',
    name: 'PersonType',
    component: PersonView
},  {
    path: '/email',
    name: 'EmailType',
    component: EmailView
}


]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
