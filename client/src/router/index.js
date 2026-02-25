import { createRouter, createWebHistory } from 'vue-router'

import index from "../pages/index.vue";
import loginAdmin from "../pages/loginAdmin.vue";
import adminPage from "../pages/adminPage.vue";
import DefaultLayout from '../layouts/default.vue';

const routes = [
  {
    path:'',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: index
      }
    ]
  },
  {
    path: '/loginAdmin',
    name: '/loginAdmin',
    component: loginAdmin,
  },
  {
    path:  '/adminPage',
    name: '/adminpage',
    component: adminPage,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
