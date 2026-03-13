import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import reservaNormal from '../pages/reservaNormal.vue';
import loginAdmin from '../pages/loginAdmin.vue';
import adminPage from '../pages/adminPage.vue';
import DefaultLayout from '../layouts/default.vue';
import index from '../pages/index.vue'
import ReservaRapida from '@/pages/reservaRapida.vue';
import profissionalIndiferente  from '../pages/profissionalIndiferente.vue';

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
        path: '/reservaNormal',
        name: '/reservaNormal',
        component: reservaNormal,
    },
    {
        path: '/reservaRapida',
        name: '/reservaRapida',
        component: ReservaRapida,
    },
        {
        path: '/profissionalIndiferente',
        name: '/profissionalIndiferente',
        component: profissionalIndiferente,
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