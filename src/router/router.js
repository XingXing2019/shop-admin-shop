import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/login/login.vue'
const Home = () => import('../components/home/home.vue')

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/home', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login }
  ]
})
