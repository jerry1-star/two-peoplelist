<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import client from '@/api/client'

interface Case {
  id: string
  title: string
  summary: string
  coverUrl?: string
  authorName: string
  revenue?: string
  isPublished: boolean
  createdAt: string
}

interface PaginatedResponse {
  data: Case[]
  total: number
}

const cases = ref<Case[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  title: '',
  summary: '',
  content: '',
  coverUrl: '',
  authorName: '',
  revenue: '',
  isPublished: false,
})

const columns = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '创始人', dataIndex: 'authorName', key: 'authorName', width: 120 },
  { title: '收入', dataIndex: 'revenue', key: 'revenue', width: 120 },
  { title: '状态', key: 'isPublished', width: 100 },
  { title: '操作', key: 'actions', width: 120 },
]

async function fetchCases() {
  loading.value = true
  try {
    const data = await client.get<never, PaginatedResponse>('/cases', {
      params: { page: 1, pageSize: 100 },
    })
    cases.value = data.data
  } catch {
    message.error('获取案例列表失败')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = { title: '', summary: '', content: '', coverUrl: '', authorName: '', revenue: '', isPublished: false }
  modalVisible.value = true
}

function openEdit(c: Case) {
  editingId.value = c.id
  form.value = {
    title: c.title,
    summary: c.summary,
    content: '',
    coverUrl: c.coverUrl ?? '',
    authorName: c.authorName,
    revenue: c.revenue ?? '',
    isPublished: c.isPublished,
  }
  modalVisible.value = true
}

async function handleSave() {
  if (!form.value.title.trim()) {
    message.warning('请输入案例标题')
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await client.patch(`/cases/${editingId.value}`, form.value)
      message.success('更新成功')
    } else {
      await client.post('/cases', form.value)
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchCases()
  } catch {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

function handleDelete(c: Case) {
  Modal.confirm({
    title: '确认删除该案例？',
    content: c.title,
    okType: 'danger',
    async onOk() {
      await client.delete(`/cases/${c.id}`)
      message.success('删除成功')
      fetchCases()
    },
  })
}

onMounted(fetchCases)
</script>

<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">成功案例管理</h2>
      <a-button type="primary" @click="openCreate">
        <plus-outlined /> 新建案例
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="cases"
      :loading="loading"
      :pagination="false"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'isPublished'">
          <a-badge
            :status="record.isPublished ? 'success' : 'default'"
            :text="record.isPublished ? '已发布' : '未发布'"
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
      :title="editingId ? '编辑案例' : '新建案例'"
      :confirm-loading="saving"
      @ok="handleSave"
    >
      <a-form layout="vertical" style="margin-top: 16px">
        <a-form-item label="案例标题" required>
          <a-input v-model:value="form.title" />
        </a-form-item>
        <a-form-item label="摘要">
          <a-textarea v-model:value="form.summary" :rows="2" />
        </a-form-item>
        <a-form-item label="正文内容">
          <a-textarea v-model:value="form.content" :rows="4" />
        </a-form-item>
        <a-form-item label="封面图片 URL">
          <a-input v-model:value="form.coverUrl" placeholder="https://..." />
        </a-form-item>
        <a-form-item label="创始人">
          <a-input v-model:value="form.authorName" />
        </a-form-item>
        <a-form-item label="月收入">
          <a-input v-model:value="form.revenue" placeholder="如：$5,000/月" />
        </a-form-item>
        <a-form-item label="发布状态">
          <a-switch v-model:checked="form.isPublished" />
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
