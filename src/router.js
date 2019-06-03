import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
Vue.use(VueRouter)
export default new VueRouter({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    name: 'Home',
    path: '/home',
    component: Home
  }
  ]
})
