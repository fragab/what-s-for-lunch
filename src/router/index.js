import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Signup from '@/components/Signup'
import Profile from '@/components/Profile'
import Restaurant from '@/components/Restaurant'
import Result from '@/components/Result'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'result',
      component: Result
    },
    {
      path: '/all',
      name: 'All',
      component: Hello
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
    }
  ],
  linkActiveClass: 'is-active'
})
