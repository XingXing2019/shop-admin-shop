import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/login/login.vue'
const Home = () => import('../components/home/home.vue')
const Users = () => import('../components/users/users.vue')
const Roles = () => import('../components/roles/roles.vue')
const Rights = () => import('../components/rights/rights.vue')
const Goods = () => import('../components/goods/goods.vue')
const AddGoods = () => import('../components/goods/addGoods.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        { path: '/users', name: 'users', component: Users },
        { path: '/roles', name: 'roles', component: Roles },
        { path: '/rights', name: 'rights', component: Rights },
        { path: '/goods', name: 'goods', component: Goods },
        { path: '/addGoods', name: 'addGoods', component: AddGoods }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    localStorage.getItem('token') ? next() : next('/login')
  }
})

export default router
