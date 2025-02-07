import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Dev from '../components/DeveloperDashaboard.vue'
import Manage from '../components/ManagerDashboard.vue'
import user from '../components/User.vue'
import Register from '../components/Registration.vue'
import fourofour from '../components/404page.vue'



Vue.use(VueRouter)

const routes = [

  {
    path : '/',
    name : 'login',
    component : Login
  },
  {
    path : '/registration',
    name : 'registration',
    component : Register,
    meta: { requiresAuth: true, roles: ['user','developer','manager'] },
  },
  {
    path : '/developer',
    name : 'developer',
    component : Dev,
    meta: { requiresAuth: true, roles: ['developer'] },
    
  },
  {
    path : '/manager',
    name : 'manager',
    component : Manage,
    meta: { requiresAuth: true, roles: ['manager'] },
   
  },
  {
    path : '/user',
    name : 'user',
    component : user,
    meta: {requiresAuth: true,role: ['user'],
    },
   
  },
  {
     path : '/fourofour',
     name : 'fourofour',
     component : fourofour
  }
 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})





export default router
