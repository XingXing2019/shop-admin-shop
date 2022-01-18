// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router/router.js'
import ElementUI from '../node_modules/element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/common.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(
  function (config) {
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
