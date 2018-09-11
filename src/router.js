import Vue from 'vue'
import Router from 'vue-router'
import Desktop from './views/Desktop.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Desktop
    },
  ]
})