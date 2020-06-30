import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'

const upload = () => import('@/views/Upload')
const upload1 = () => import('@/views/Upload1')
const login = () => import('@/views/login/Login')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  }, {
    path: '/home',
    name: 'Home',
    component: Home
  }, {
    path: '/upload',
    component: upload
  }, {
    path: '/upload1',
    component: upload1
  }, {
    path: '/login',
    name: 'Login',
    component: login
  }
]

const router = new VueRouter({
  mode: 'hash',
  // base: process.env.BASE_URL,
  routes
})

export default router
