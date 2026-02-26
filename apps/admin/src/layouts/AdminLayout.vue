<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminAuthStore } from '@/stores/auth'
import {
  DashboardOutlined,
  UserOutlined,
  MessageOutlined,
  BookOutlined,
  ToolOutlined,
  TrophyOutlined,
  PictureOutlined,
  SafetyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const auth = useAdminAuthStore()

const collapsed = ref(false)

const selectedKeys = computed(() => [route.name as string])

const menuItems = [
  { key: 'dashboard', label: '数据看板', icon: DashboardOutlined, path: '/dashboard' },
  { key: 'users', label: '用户管理', icon: UserOutlined, path: '/users' },
  {
    key: 'forum-group',
    label: '论坛管理',
    icon: MessageOutlined,
    children: [
      { key: 'forum', label: '帖子审核', path: '/forum' },
      { key: 'forum-categories', label: '分类管理', path: '/forum/categories' },
    ],
  },
  { key: 'courses', label: '课程管理', icon: BookOutlined, path: '/courses' },
  { key: 'tools', label: 'AI 工具', icon: ToolOutlined, path: '/tools' },
  { key: 'cases', label: '成功案例', icon: TrophyOutlined, path: '/cases' },
  { key: 'banners', label: 'Banner', icon: PictureOutlined, path: '/banners' },
  { key: 'roles', label: '角色权限', icon: SafetyOutlined, path: '/roles' },
]

function navigate(key: string) {
  const allItems = menuItems.flatMap((m) => ('children' in m && m.children ? m.children : [m]))
  const item = allItems.find((m) => m.key === key)
  if (item && 'path' in item) router.push(item.path)
}

const openKeys = ref(['forum-group'])

function handleOpenChange(keys: string[]) {
  openKeys.value = keys
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <span v-if="!collapsed">产品专家</span>
        <span v-else>专</span>
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :selected-keys="selectedKeys"
        :open-keys="openKeys"
        @click="({ key }: { key: string }) => navigate(key)"
        @open-change="handleOpenChange"
      >
        <template v-for="item in menuItems" :key="item.key">
          <a-sub-menu v-if="'children' in item && item.children" :key="item.key">
            <template #icon><component :is="item.icon" /></template>
            <template #title>{{ item.label }}</template>
            <a-menu-item v-for="child in item.children" :key="child.key">
              {{ child.label }}
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="item.key">
            <component :is="item.icon" />
            <span>{{ item.label }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="site-header">
        <menu-fold-outlined
          v-if="!collapsed"
          class="trigger"
          @click="collapsed = true"
        />
        <menu-unfold-outlined
          v-else
          class="trigger"
          @click="collapsed = false"
        />
        <div class="header-right">
          <a-dropdown>
            <span class="user-info">
              <a-avatar size="small" style="background-color: #1677ff">
                {{ auth.user?.nickname?.[0] ?? 'A' }}
              </a-avatar>
              <span class="username">{{ auth.user?.nickname ?? '管理员' }}</span>
            </span>
            <template #overlay>
              <a-menu>
                <a-menu-item key="logout" @click="handleLogout">
                  <logout-outlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content class="site-content">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.1);
}

.site-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1677ff;
}

.header-right {
  margin-left: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: rgba(0, 0, 0, 0.04);
}

.username {
  font-size: 14px;
}

.site-content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 64px - 48px);
}
</style>
