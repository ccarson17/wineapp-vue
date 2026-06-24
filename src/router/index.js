import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '@/components/Home'
import HomePageComponent from '@/components/HelloWorld'
import LoginComponent from '@/components/Login'
import ProfileComponent from '@/components/Profile'
import BottlesComponent from '@/components/Bottles'
import RacksComponent from '@/components/Racks'
import HistoryComponent from '@/components/History'
import SettingsComponent from '@/components/Settings'
import ImportComponent from '@/components/Import'

// Define routes
const routes = [
  { path: '/', component: HomeComponent },
  { path: '/home', component: HomeComponent },
  { path: '/login', component: LoginComponent },
  { path: '/helloworld', component: HomePageComponent },
  { path: '/bottles', component: BottlesComponent, meta: { requiresAuth: true } },
  { path: '/history', component: HistoryComponent, meta: { requiresAuth: true } },
  { path: '/racks', component: RacksComponent, meta: { requiresAuth: true } },
  { path: '/settings', component: SettingsComponent, meta: { requiresAuth: true } },
  { path: '/import', component: ImportComponent, meta: { requiresAuth: true } },
  { path: '/profile', component: ProfileComponent, meta: { requiresAuth: true } }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Placeholder for authentication guard (to be replaced with Azure AD logic)
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // TODO: Implement Azure AD authentication check here
    next()
  } else {
    next()
  }
})

export default router
