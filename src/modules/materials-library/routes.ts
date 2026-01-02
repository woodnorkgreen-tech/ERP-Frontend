import type { RouteRecordRaw } from 'vue-router';
import MaterialsLibraryIndex from './views/MaterialsLibraryIndex.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/materials-library',
        name: 'MaterialsLibrary',
        component: MaterialsLibraryIndex,
        meta: {
            requiresAuth: true,
            title: 'Materials Library',
            // Check roles if necessary
        },
    },
];

export default routes;
