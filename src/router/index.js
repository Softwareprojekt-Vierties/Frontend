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
import EditEventView from '@/views/EditEventView.vue';
import EventView from '@/views/EventView.vue'
import LocationView from '@/views/LocationView.vue'
import CatererView from '@/views/CatererView.vue'


import DjView from '@/views/DjView.vue'
import CreatePersonView from '@/views/CreatePersonView.vue'
import EditPersonView from '@/views/EditPersonView.vue'
import PersonView from '@/views/PersonView.vue'
import EmailView from '@/views/EmailView.vue'

import MobileLoginView from '@/views/MobileLoginView.vue'
import MobileSignupView from '@/views/MobileSignupView.vue'
import MoblieSearchView from '@/views/MoblieSearchView.vue'
import MobileEmailView from '@/views/MobileEmailView.vue'
import MobileEventView from '@/views/MobileEventView.vue'
import MobileLocationView from '@/views/MobileLocationView.vue'
import MobileDjView from '@/views/MobileDjView.vue'
import MobileCatererView from '@/views/MobileCatererView.vue'
import MobileCreateLocationView from '@/views/MobileCreateLocationView.vue'
import MobileCreateDjView from '@/views/MobileCreateDjView.vue'
import MobileCreateCatererView from '@/views/MobileCreateCatererView.vue'
import MobileCreatePersonView from '@/views/MobileCreatePersonView.vue'
import MobilePersonView from '@/views/MobilePersonView.vue'
import MobileNutzerUnterscheidungView from '../views/MobileNutzerUnterscheidungView.vue'
import MobileServiceTypeView from '../views/MobileServiceTypeView.vue'

import MobileEditCaterer from '@/views/MobileEditCatererView.vue'
import MobileEditDJ from '@/views/MobileEditDjView.vue'

import MobileCreateEventPage from '@/views/MobileCreateEventPage.vue'
import MobileEditPersonView from '@/views/MobileEditPerson.vue'
import MobileEditLocationView from '@/views/MobileEditLocationView.vue'
import MobileEditEventView from '@/views/MobileEditEventView.vue'



function isMobile() {
    const MAX_MOBILE_WIDTH = 800;
    return window.innerWidth < MAX_MOBILE_WIDTH;
}

const routes = [
    {
        path: '/',
        name: 'login',
        component: isMobile() ? MobileLoginView : LoginView 
    },  { //                    󱞩 MobileView    󱞩 DesktopView
        path: '/signup',
        name: 'signupSeite',
        component: isMobile() ? MobileSignupView  : SignupView 
    }
    ,  {
        path: '/usertype',
        name: 'SelectingUserType',
        component: isMobile() ? NutzerUnterscheidungView  : MobileNutzerUnterscheidungView 
    },  {
        path: '/servicetype',
        name: 'SelectingServiceType',
        component: isMobile() ? ServiceTypeView  : MobileServiceTypeView 
    },  {
        path: '/search',
        name: 'SucheViewType',
        component: isMobile() ? MoblieSearchView  : SucheView 
    },
  {
    path: '/dj/:id',
    name: 'DjType',
    component: isMobile() ? MobileDjView : DjView
  } , {
    path :'/caterer/:id',
    name : 'CatererType',
    component : isMobile() ? MobileCatererView : CatererView
  },


{
    path: '/createevent',
    name: 'CreateEventType',
    component: isMobile() ? MobileCreateEventPage : CreateEvent 
},
    {
    path: '/createcaterer',
    name: 'CreateCatererType',
    component: isMobile() ? MobileCreateCatererView : CreateCatererView 
},  {
    path: '/createlocation',
    name: 'CreateLocationType',
    component : isMobile() ? MobileCreateLocationView : CreateLocationView 
},  {
    path: '/createdj',
    name: 'CreateDjType',
    component: isMobile() ? MobileCreateDjView : CreateDjView 
}, {
    path: '/editcaterer/:id',
    name: 'EditCatererType',
    component: isMobile() ? MobileEditCaterer : EditCatererView 
}, {
    path: '/editdj/:id',
    name: 'EditDjType',
    component: isMobile() ?  MobileEditDJ  : EditDjView
},  {
    path: '/editlocation/:id',
    name: 'EditLocationType',
    component: isMobile() ? MobileEditLocationView :EditLocationView 
},  {
    path: '/editevent/:id',
    name: 'EditEventType',
    component: isMobile() ? MobileEditEventView : EditEventView,
},  {
    path: '/event/:id',
    name: 'EventType',
    component: isMobile() ? MobileEventView : EventView
},  {
    path: '/location/:id',
    name: 'LocationType',
    component: isMobile() ? MobileLocationView : LocationView
}, {
    path: '/createPerson',
    name: 'CreatePersonType',
    component: isMobile() ? MobileCreatePersonView : CreatePersonView
},  {
    path: '/editPerson',
    name: 'EditPersonType',
    component: isMobile() ? MobileEditPersonView : EditPersonView,
},
  {
    path: '/person/:id',
    name: 'PersonType',
    component: isMobile() ? MobilePersonView : PersonView
},  {
    path: '/email',
    name: 'EmailType',
    component: isMobile() ? MobileEmailView  : EmailView 
}, {
    path: '/me',
    name: 'MyPage',
    component: isMobile() ? MobilePersonView : PersonView,
}



]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
