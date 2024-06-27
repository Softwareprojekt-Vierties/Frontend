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
import EditDjView from '@/views/EditDjView.vue'
import EditLocationView from '@/views/EditLocationView.vue'
import EventView from '@/views/EventView.vue'
import LocationView from '@/views/LocationView.vue'
import DjView from '@/views/DjView.vue'
import CreatePersonView from '@/views/CreatePersonView.vue'
import PersonView from '@/views/PersonView.vue'

function isMobile() {
    const MAX_MOBILE_WIDTH = 800;
    return window.innerWidth < MAX_MOBILE_WIDTH;
}

const routes = [

    {
        path: '/',
        name: 'anmeldung',
        component: isMobile() ? AnmeldungView : AnmeldungView // Corrigido para usar AnmeldungView
    },  { //                    󱞩 MobileView    󱞩 DesktopView
        path: '/signup',
        name: 'signupSeite',
        component: isMobile() ? SignupView  : SignupView 
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
    path: '/editLocation',
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
    path: '/person',
    name: 'PersonType',
    component: PersonView
  }

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
