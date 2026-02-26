import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/pages/HomePage.vue') },
      { path: 'learning', name: 'Learning', component: () => import('@/pages/learning/LearningPage.vue') },
      { path: 'learning/:id', name: 'CourseDetail', component: () => import('@/pages/learning/CourseDetailPage.vue') },
      { path: 'tools', name: 'Tools', component: () => import('@/pages/tools/ToolsPage.vue') },
      { path: 'cases', name: 'Cases', component: () => import('@/pages/cases/CasesPage.vue') },
      { path: 'cases/:id', name: 'CaseDetail', component: () => import('@/pages/cases/CaseDetailPage.vue') },
      { path: 'forum', name: 'Forum', component: () => import('@/pages/forum/ForumPage.vue') },
      { path: 'forum/create', name: 'CreatePost', component: () => import('@/pages/forum/CreatePostPage.vue'), meta: { requiresAuth: true } },
      { path: 'forum/:id', name: 'PostDetail', component: () => import('@/pages/forum/PostDetailPage.vue') },
    ],
  },
  {
    path: '/profile',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Profile', component: () => import('@/pages/profile/ProfilePage.vue') },
      { path: 'edit', name: 'EditProfile', component: () => import('@/pages/profile/EditProfilePage.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'Login', component: () => import('@/pages/auth/LoginPage.vue'), meta: { guestOnly: true } },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/NotFoundPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const { useAuthStore } = await import('@/stores/auth')
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'Home' }
  }
})

export default router
