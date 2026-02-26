<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import client from '@/api/client'

interface Permission {
  id: string
  resource: string
  action: string
  description?: string
}

interface Role {
  id: string
  name: string
  description?: string
  rolePermissions: Array<{ permission: Permission }>
}

const roles = ref<Role[]>([])
const allPermissions = ref<Permission[]>([])
const loading = ref(false)
const saving = ref<string | null>(null)

const resourceLabels: Record<string, string> = {
  users: '用户',
  posts: '帖子',
  comments: '评论',
  courses: '课程',
  tools: '工具',
  cases: '案例',
  banners: 'Banner',
  roles: '角色',
  dashboard: '看板',
  categories: '分类',
}

const actionLabels: Record<string, string> = {
  read: '查看',
  write: '发布',
  create: '创建',
  update: '编辑',
  delete: '删除',
  manage: '管理',
  review: '审核',
  approve: '审核',
}

function groupedPermissions(permissions: Permission[]) {
  const groups: Record<string, Permission[]> = {}
  for (const p of permissions) {
    if (!groups[p.resource]) groups[p.resource] = []
    groups[p.resource]!.push(p)
  }
  return groups
}

function hasPermission(role: Role, permId: string) {
  return role.rolePermissions.some((rp) => rp.permission.id === permId)
}

async function togglePermission(role: Role, perm: Permission) {
  const has = hasPermission(role, perm.id)
  saving.value = role.id + perm.id
  try {
    if (has) {
      await client.delete(`/roles/${role.id}/permissions/${perm.id}`)
    } else {
      await client.post(`/roles/${role.id}/permissions`, { permissionId: perm.id })
    }
    await fetchRoles()
    message.success('权限更新成功')
  } catch {
    message.error('权限更新失败')
  } finally {
    saving.value = null
  }
}

async function fetchRoles() {
  loading.value = true
  try {
    const [rolesData, permsData] = await Promise.all([
      client.get<never, Role[]>('/roles'),
      client.get<never, Permission[]>('/roles/permissions'),
    ])
    roles.value = rolesData
    allPermissions.value = permsData
  } catch {
    message.error('获取角色权限失败')
  } finally {
    loading.value = false
  }
}

const grouped = () => groupedPermissions(allPermissions.value)

onMounted(fetchRoles)
</script>

<template>
  <div>
    <h2 class="page-title">角色权限管理</h2>

    <a-spin :spinning="loading">
      <a-tabs>
        <a-tab-pane
          v-for="role in roles"
          :key="role.id"
          :tab="role.name"
        >
          <p v-if="role.description" class="role-desc">{{ role.description }}</p>

          <div v-for="(perms, resource) in grouped()" :key="resource" class="perm-group">
            <div class="perm-group-title">
              {{ resourceLabels[resource] ?? resource }}
            </div>
            <div class="perm-tags">
              <a-checkable-tag
                v-for="perm in perms"
                :key="perm.id"
                :checked="hasPermission(role, perm.id)"
                :class="{ loading: saving === role.id + perm.id }"
                @change="togglePermission(role, perm)"
              >
                {{ actionLabels[perm.action] ?? perm.action }}
              </a-checkable-tag>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px;
}

.role-desc {
  color: #666;
  margin-bottom: 16px;
}

.perm-group {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.perm-group-title {
  width: 80px;
  color: #333;
  font-weight: 500;
  flex-shrink: 0;
}

.perm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
