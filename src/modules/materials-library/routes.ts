import type { RouteRecordRaw } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import MaterialsLibraryIndex from './views/MaterialsLibraryIndex.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/materials-library',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'MaterialsLibrary',
                component: MaterialsLibraryIndex,
                meta: {
                    requiresAuth: true,
                    title: 'Materials Library',
                },
            }
        ]
    },
];

export default routes;
