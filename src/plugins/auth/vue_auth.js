import Vue from 'vue';
import VueAuth from '@websanova/vue-auth';
import router from '../../router/index';

Vue.router = router;
import bearer from './bearer.js';
import authAxios from '@websanova/vue-auth/dist/drivers/http/axios.1.x.js';
import routerVueRouter from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x.js';

Vue.use(VueAuth, {
  auth: bearer,
  http: authAxios,
  router: routerVueRouter,
  rolesKey: 'roles',
  loginData: {
    url: 'rest-auth/login/',
  },
  logoutData: {
    url: 'rest-auth/logout/',
  },
  fetchData: {
    url: 'rest-auth/user/',
  },
  refreshData: {
    url: 'rest-auth/refresh-token/',
    enabled: false,
  },
  authRedirect: {
    path: '/login',
  },
  forbiddenRedirect: {
    path: '/404',
  },
  parseUserData: function(data) {
    return data
  }
});

