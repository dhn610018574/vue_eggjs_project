/*
 * @Author: ji.xuyu
 * @Date: 2020-02-03 18:20:48
 * @LastEditors  : ji.xuyu
 * @LastEditTime : 2020-02-10 14:26:26
 * @Description: file content
 */
import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login.vue'
import index from './views/index'
import Home from '@/views/home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },{
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      component: Home,
      children: [{
        path: '/index',
        name: 'index',
        component: index
      },{
        path: '/account',
        name: 'account',
        component: ()=>import('@/views/account.vue')
      }, ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
  } else {
    if (localStorage.getItem('userName')) {
      next()
    } else {
      next('/login')
    }
  }
})
export default router