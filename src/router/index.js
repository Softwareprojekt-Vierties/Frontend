import { createRouter, createWebHistory } from 'vue-router'
import AnmeldungView from '../views/AnmeldungView.vue'
import SignupView from '../views/SignupView.vue'
import NutzerUnterscheidungView from '../views/NutzerUnterscheidungView.vue'
import ServiceTypeView from '../views/ServiceTypeView.vue'
import SucheView from '@/views/SucheView.vue'

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
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
