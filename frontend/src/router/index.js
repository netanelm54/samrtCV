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
			path: '/payment-success',
			name: 'PaymentSuccess',
			component: () => import('../components/SuccessPage.vue')
		},
		{
			path: '/payment-cancel',
			name: 'PaymentCancel',
			component: () => import('../components/CancelPage.vue')
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

