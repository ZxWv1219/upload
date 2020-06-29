import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'

const upload = () => import('@/views/Upload')
const upload1 = () => import('@/views/Upload1')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/upload',
    component: upload
  }, {
    path: '/upload1',
    component: upload1
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
