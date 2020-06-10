import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/main_page.vue'

Vue.use(VueRouter);

// function validate(to, from, next) {
//   if (this.$auth.check(['Doctor'])) {
//     next()
//   } else {
//     next({path: '/'})
//   }
// }

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {auth: true}
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  },
  {
    path: '/new-patient',
    name: 'newPatient',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/new_patient.vue'),
    meta: {auth: 'Doctor',},
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
