<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import client from '@/api/client'

interface Tool {
  id: string
  name: string
  description: string
  link: string
  categoryName: string
  iconUrl?: string
  isRecommended: boolean
}

interface PaginatedResponse {
  data: Tool[]
  total: number
}

const tools = ref<Tool[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  name: '',
  description: '',
  link: '',
  categoryName: '',
  iconUrl: '',
  isRecommended: false,
})

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '分类', dataIndex: 'categoryName', key: 'categoryName', width: 120 },
  { title: '链接', dataIndex: 'link', key: 'link', ellipsis: true },
  { title: '推荐', key: 'isRecommended', width: 80 },
  { title: '操作', key: 'actions', width: 120 },
]

async function fetchTools() {
  loading.value = true
  try {
    const data = await client.get<never, PaginatedResponse>('/tools', {
      params: { page: 1, pageSize: 100 },
    })
    tools.value = data.data
  } catch {
    message.error('获取工具列表失败')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = { name: '', description: '', link: '', categoryName: '', iconUrl: '', isRecommended: false }
  modalVisible.value = true
}

function openEdit(tool: Tool) {
  editingId.value = tool.id
  form.value = {
    name: tool.name,
    description: tool.description,
    link: tool.link,
    categoryName: tool.categoryName,
    iconUrl: tool.iconUrl ?? '',
    isRecommended: tool.isRecommended,
  }
  modalVisible.value = true
}

async function handleSave() {
  if (!form.value.name.trim() || !form.value.link.trim()) {
    message.warning('请填写工具名称和链接')
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await client.patch(`/tools/${editingId.value}`, form.value)
      message.success('更新成功')
    } else {
      await client.post('/tools', form.value)
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchTools()
  } catch {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

function handleDelete(tool: Tool) {
  Modal.confirm({
    title: '确认删除该工具？',
    content: tool.name,
    okType: 'danger',
    async onOk() {
      await client.delete(`/tools/${tool.id}`)
      message.success('删除成功')
      fetchTools()
    },
  })
}

onMounted(fetchTools)
</script>

<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">AI 工具管理</h2>
      <a-button type="primary" @click="openCreate">
        <plus-outlined /> 新建工具
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="tools"
      :loading="loading"
      :pagination="false"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'isRecommended'">
          <a-tag :color="record.isRecommended ? 'gold' : 'default'">
            {{ record.isRecommended ? '推荐' : '-' }}
          </a-tag>
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
      :title="editingId ? '编辑工具' : '新建工具'"
      :confirm-loading="saving"
      @ok="handleSave"
    >
      <a-form layout="vertical" style="margin-top: 16px">
        <a-form-item label="工具名称" required>
          <a-input v-model:value="form.name" placeholder="如：ChatGPT" />
        </a-form-item>
        <a-form-item label="工具描述">
          <a-textarea v-model:value="form.description" :rows="2" />
        </a-form-item>
        <a-form-item label="访问链接" required>
          <a-input v-model:value="form.link" placeholder="https://..." />
        </a-form-item>
        <a-form-item label="分类">
          <a-input v-model:value="form.categoryName" placeholder="如：对话 AI、图像生成、编程辅助" />
        </a-form-item>
        <a-form-item label="图标 URL">
          <a-input v-model:value="form.iconUrl" placeholder="https://..." />
        </a-form-item>
        <a-form-item label="设为推荐">
          <a-switch v-model:checked="form.isRecommended" />
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
