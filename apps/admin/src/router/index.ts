import { createRouter, createWebHistory } from 'vue-router'
import { useAdminAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/LoginPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/pages/dashboard/DashboardPage.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/pages/users/UsersPage.vue'),
        },
        {
          path: 'forum',
          name: 'forum',
          component: () => import('@/pages/forum/ForumPage.vue'),
        },
        {
          path: 'forum/categories',
          name: 'forum-categories',
          component: () => import('@/pages/forum/CategoriesPage.vue'),
        },
        {
          path: 'courses',
          name: 'courses',
          component: () => import('@/pages/courses/CoursesPage.vue'),
        },
        {
          path: 'tools',
          name: 'tools',
          component: () => import('@/pages/tools/ToolsPage.vue'),
        },
        {
          path: 'cases',
          name: 'cases',
          component: () => import('@/pages/cases/CasesPage.vue'),
        },
        {
          path: 'banners',
          name: 'banners',
          component: () => import('@/pages/banners/BannersPage.vue'),
        },
        {
          path: 'roles',
          name: 'roles',
          component: () => import('@/pages/roles/RolesPage.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAdminAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && auth.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
