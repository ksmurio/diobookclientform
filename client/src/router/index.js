import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import index from '../pages/index.vue';
import loginAdmin from '../pages/loginAdmin.vue';
import adminPage from '../pages/adminPage.vue';
import DefaultLayout from '../layouts/default.vue';

const routes = [
    {
        path: '',
        component: DefaultLayout,
        children: [
            {
                path: '',
                component: index,
            }
        ]
    },
    {
        path: '/loginAdmin',
        name: '/loginAdmin',
        component: loginAdmin,
    },
    {
        path: '/adminPage',
        name: '/adminPage',
        component: adminPage,
        meta: { requiresAuth: true },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const store = useAuthStore();
    if (to.meta.requiresAuth && !store.isAuthenticated) {
        next('/loginAdmin');
    } else {
        next();
    }
});

export default router;  