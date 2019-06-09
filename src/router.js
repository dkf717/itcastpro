import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import User from '@/views/User.vue'
import Role from '@/views/Role.vue'
import Right from '@/views/Right.vue'

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
    component: Home,
    children: [{
      name: 'User',
      path: 'users',
      component: User
    },
    {
      name: 'Role',
      path: 'roles',
      component: Role
    }, {
      name: 'Right',
      path: 'rights',
      component: Right
    }]
  }
  ]
})
