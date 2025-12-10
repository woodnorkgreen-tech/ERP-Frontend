import type { RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AccessDenied from '../views/AccessDenied.vue'

export const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: AccessDenied,
    meta: { title: 'Access Denied' }
  },
  // Universal Task System Routes
  {
    path: '/universal-tasks',
    component: () => import('../layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'universal-tasks',
        component: () => import('../modules/universal-task/views/TaskListView.vue'),
        meta: { title: 'Universal Tasks' }
      },
      {
        path: 'analytics',
        name: 'universal-tasks-analytics',
        component: () => import('../modules/universal-task/views/TaskAnalyticsView.vue'),
        meta: { title: 'Task Analytics' }
      },
      {
        path: ':id',
        name: 'universal-task-detail',
        component: () => import('../modules/universal-task/views/TaskDetailView.vue'),
        meta: { title: 'Task Details' }
      }
    ]
  },
  // Catch-all dashboard route - redirect to HR dashboard as fallback
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: '/hr',
    meta: { requiresAuth: true }
  }
]
