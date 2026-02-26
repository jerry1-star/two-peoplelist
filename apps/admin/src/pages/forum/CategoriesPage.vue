<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import client from '@/api/client'

interface Category {
  id: string
  name: string
  description: string | null
  sortOrder: number
  _count: { posts: number }
}

const categories = ref<Category[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const modalLoading = ref(false)
const editingId = ref<string | null>(null)

const form = ref({ name: '', description: '', sortOrder: 0 })

const columns = [
  { title: '分类名称', dataIndex: 'name', key: 'name' },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '帖子数', dataIndex: ['_count', 'posts'], key: 'posts', width: 100 },
  { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
  { title: '操作', key: 'action', width: 140 },
]

async function fetchCategories() {
  loading.value = true
  try {
    categories.value = await client.get<never, Category[]>('/categories')
  } catch {
    message.error('加载分类失败')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = { name: '', description: '', sortOrder: 0 }
  modalVisible.value = true
}

function openEdit(record: Category) {
  editingId.value = record.id
  form.value = { name: record.name, description: record.description ?? '', sortOrder: record.sortOrder }
  modalVisible.value = true
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    message.warning('请输入分类名称')
    return
  }
  modalLoading.value = true
  try {
    if (editingId.value) {
      await client.put(`/categories/${editingId.value}`, form.value)
      message.success('更新成功')
    } else {
      await client.post('/categories', form.value)
      message.success('创建成功')
    }
    modalVisible.value = false
    await fetchCategories()
  } catch (e: unknown) {
    const err = e as { message?: string }
    message.error(err?.message ?? '操作失败')
  } finally {
    modalLoading.value = false
  }
}

function handleDelete(record: Category) {
  if (record._count.posts > 0) {
    message.warning(`该分类下有 ${record._count.posts} 篇帖子，无法删除`)
    return
  }
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除分类「${record.name}」吗？`,
    okType: 'danger',
    onOk: async () => {
      try {
        await client.delete(`/categories/${record.id}`)
        message.success('删除成功')
        await fetchCategories()
      } catch (e: unknown) {
        const err = e as { message?: string }
        message.error(err?.message ?? '删除失败')
      }
    },
  })
}

onMounted(fetchCategories)
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
      <h2 style="margin: 0; font-size: 18px; font-weight: 600">论坛分类管理</h2>
      <a-button type="primary" @click="openCreate">
        <template #icon><plus-outlined /></template>
        新增分类
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="categories"
      :loading="loading"
      :pagination="false"
      row-key="id"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'description'">
          <span style="color: #666">{{ record.description || '暂无描述' }}</span>
        </template>
        <template v-else-if="column.key === 'posts'">
          <a-tag color="blue">{{ record._count.posts }} 篇</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button size="small" @click="openEdit(record)">
              <template #icon><edit-outlined /></template>
              编辑
            </a-button>
            <a-button
              size="small"
              danger
              :disabled="record._count.posts > 0"
              @click="handleDelete(record)"
            >
              <template #icon><delete-outlined /></template>
              删除
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? '编辑分类' : '新增分类'"
      :confirm-loading="modalLoading"
      @ok="handleSubmit"
    >
      <a-form layout="vertical" style="margin-top: 16px">
        <a-form-item label="分类名称" required>
          <a-input v-model:value="form.name" placeholder="请输入分类名称" maxlength="20" show-count />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea
            v-model:value="form.description"
            placeholder="分类描述（选填）"
            :rows="3"
            maxlength="100"
            show-count
          />
        </a-form-item>
        <a-form-item label="排序（数字越小越靠前）">
          <a-input-number v-model:value="form.sortOrder" :min="0" :max="999" style="width: 120px" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
