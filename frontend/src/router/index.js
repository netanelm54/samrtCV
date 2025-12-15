import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../components/Home.vue')
    },
    {
      path: '/success',
      name: 'Success',
      component: () => import('../components/SuccessPage.vue')
    },
    {
      path: '/cancel',
      name: 'Cancel',
      component: () => import('../components/CancelPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router

