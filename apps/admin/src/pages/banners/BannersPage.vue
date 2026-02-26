<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import client from '@/api/client'

interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl?: string
  position: string
  order: number
  isActive: boolean
  startAt?: string
  endAt?: string
}

interface PaginatedResponse {
  items: Banner[]
  total: number
}

const banners = ref<Banner[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  title: '',
  imageUrl: '',
  linkUrl: '',
  position: 'home_top',
  order: 0,
  isActive: true,
})

const positionOptions = [
  { value: 'home_top', label: '首页顶部' },
  { value: 'home_middle', label: '首页中部' },
  { value: 'forum_top', label: '论坛顶部' },
]

const columns = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '位置', key: 'position', width: 120 },
  { title: '排序', dataIndex: 'order', key: 'order', width: 80 },
  { title: '状态', key: 'isActive', width: 100 },
  { title: '操作', key: 'actions', width: 120 },
]

const positionLabel: Record<string, string> = {
  home_top: '首页顶部',
  home_middle: '首页中部',
  forum_top: '论坛顶部',
}

async function fetchBanners() {
  loading.value = true
  try {
    const data = await client.get<never, PaginatedResponse>('/banners', {
      params: { page: 1, pageSize: 100 },
    })
    banners.value = Array.isArray(data) ? data : (data as unknown as { data: Banner[] }).data ?? []
  } catch {
    message.error('获取 Banner 列表失败')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = { title: '', imageUrl: '', linkUrl: '', position: 'home_top', order: 0, isActive: true }
  modalVisible.value = true
}

function openEdit(b: Banner) {
  editingId.value = b.id
  form.value = {
    title: b.title,
    imageUrl: b.imageUrl,
    linkUrl: b.linkUrl ?? '',
    position: b.position,
    order: b.order,
    isActive: b.isActive,
  }
  modalVisible.value = true
}

async function handleSave() {
  if (!form.value.title.trim() || !form.value.imageUrl.trim()) {
    message.warning('请填写标题和图片链接')
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await client.patch(`/banners/${editingId.value}`, form.value)
      message.success('更新成功')
    } else {
      await client.post('/banners', form.value)
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchBanners()
  } catch {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

function handleDelete(b: Banner) {
  Modal.confirm({
    title: '确认删除该 Banner？',
    content: b.title,
    okType: 'danger',
    async onOk() {
      await client.delete(`/banners/${b.id}`)
      message.success('删除成功')
      fetchBanners()
    },
  })
}

onMounted(fetchBanners)
</script>

<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">Banner 管理</h2>
      <a-button type="primary" @click="openCreate">
        <plus-outlined /> 新建 Banner
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="banners"
      :loading="loading"
      :pagination="false"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'position'">
          {{ positionLabel[record.position] ?? record.position }}
        </template>
        <template v-else-if="column.key === 'isActive'">
          <a-badge
            :status="record.isActive ? 'success' : 'default'"
            :text="record.isActive ? '启用' : '禁用'"
          />
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-button type="link" size="small" @click="openEdit(record)">
            <edit-outlined />
          </a-button>
          <a-button type="link" size="small" danger @click="handleDelete(record)">
            <delete-outlined />
          </a-button>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? '编辑 Banner' : '新建 Banner'"
      :confirm-loading="saving"
      @ok="handleSave"
    >
      <a-form layout="vertical" style="margin-top: 16px">
        <a-form-item label="标题" required>
          <a-input v-model:value="form.title" />
        </a-form-item>
        <a-form-item label="图片链接" required>
          <a-input v-model:value="form.imageUrl" placeholder="https://..." />
        </a-form-item>
        <a-form-item label="跳转链接">
          <a-input v-model:value="form.linkUrl" placeholder="https://..." />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="展示位置">
              <a-select v-model:value="form.position" style="width: 100%">
                <a-select-option
                  v-for="opt in positionOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排序权重">
              <a-input-number v-model:value="form.order" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="启用状态">
          <a-switch v-model:checked="form.isActive" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}
</style>
