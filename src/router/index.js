import Vue from 'vue'
import Router from 'vue-router'
import Choice from '@/components/Choice'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Profile from '@/components/Profile'
import Restaurant from '@/components/Restaurant'
import Result from '@/components/Result'
import Stats from '@/components/Stats'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'result',
      component: Result
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/choice',
      name: 'Choice',
      component: Choice
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/restaurant',
      name: 'restaurant',
      component: Restaurant
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    }
  ],
  linkActiveClass: 'is-active'
})
