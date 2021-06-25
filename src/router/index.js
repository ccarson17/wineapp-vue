import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth, { LoginCallback } from '@okta/okta-vue'
import { OktaAuth } from '@okta/okta-auth-js'
import HomeComponent from '@/components/Home'
import HomePageComponent from '@/components/HelloWorld'
import LoginComponent from '@/components/Login'
import ProfileComponent from '@/components/Profile'
import BottlesComponent from '@/components/Bottles'
import RacksComponent from '@/components/Racks'
import HistoryComponent from '@/components/History'
import SettingsComponent from '@/components/Settings'
import ImportComponent from '@/components/Import'

Vue.use(VueRouter)

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-364313.okta.com/oauth2/default',
  clientId: '0oa3e2hnb2jqsNipY4x7',
  /* redirectUri: window.location.origin + '/login/callback', */
  redirectUri: 'https://master.d2e0r6wdrmawu9.amplifyapp.com/login/callback',
  scopes: ['openid', 'profile', 'email']
})
Vue.use(Auth, { oktaAuth })

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: HomeComponent
    },
    {
      path: '/home',
      component: HomeComponent
    },
    {
      path: '/login',
      component: LoginComponent
    },
    {
      path: '/login/callback',
      component: LoginCallback
    },
    {
      path: '/helloworld',
      component: HomePageComponent,
    },
    {
      path: '/bottles',
      component: BottlesComponent,
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/history',
      component: HistoryComponent,
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/racks',
      component: RacksComponent,
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/settings',
      component: SettingsComponent,
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/import',
      component: ImportComponent,
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/profile',
      component: ProfileComponent,
      meta: {
        requiresAuth: true
      },
    },
  ]
})

const onAuthRequired = async (from, to, next) => {
  if (from.matched.some(record => record.meta.requiresAuth) && !(await Vue.prototype.$auth.isAuthenticated())) {
    // Navigate to custom login page
    next({ path: '/login' })
  } else {
    next()
  }
}

router.beforeEach(onAuthRequired)

export default router
