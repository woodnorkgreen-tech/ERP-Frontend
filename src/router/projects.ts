import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

export const projectsRoutes: RouteRecordRaw[] = [
  {
    path: '/projects',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      requiresProjectsAccess: true // Temporarily disabled for debugging
    },
    children: [
      {
        path: 'dashboard',
        name: 'projects-dashboard',
        component: () => import('../modules/projects/views/ProjectsDashboard.vue'),
        meta: { title: 'Project Dashboard' }
      },
      {
        path: 'command-center',
        name: 'projects-command-center',
        component: () => import('../modules/projects/views/ProjectsCommandCenter.vue'),
        meta: { title: 'Command Center' }
      },
      {
        path: 'enquiries',
        name: 'projects-enquiries',
        component: () => import('../modules/projects/views/ProjectsEnquiries.vue'),
        meta: { title: 'Project Enquiries' }
      },
      {
        path: 'tasks',
        name: 'projects-tasks',
        component: () => import('../modules/projects/views/ProjectTasks.vue'),
        meta: { title: 'Project Tasks' }
      },
    ],
  },
]
