<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import client from '@/api/client'

interface Course {
  id: string
  title: string
  description: string
  coverUrl?: string
  sortOrder: number
  isPublished: boolean
  createdAt: string
}

interface PaginatedResponse {
  items: Course[]
  total: number
}

const courses = ref<Course[]>([])
const total = ref(0)
const loading = ref(false)
const modalVisible = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)

const form = ref({
  title: '',
  description: '',
  coverUrl: '',
  sortOrder: 0,
  isPublished: false,
})

const columns = [
  { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '状态', key: 'isPublished', width: 100 },
  { title: '操作', key: 'actions', width: 120 },
]

async function fetchCourses() {
  loading.value = true
  try {
    const data = await client.get<never, Course[]>('/courses', {
      params: { page: 1, pageSize: 100 },
    })
    courses.value = Array.isArray(data) ? data : (data as unknown as { data: Course[] }).data ?? []
  } catch {
    message.error('获取课程列表失败')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = { title: '', description: '', coverUrl: '', sortOrder: 0, isPublished: false }
  modalVisible.value = true
}

function openEdit(course: Course) {
  editingId.value = course.id
  form.value = {
    title: course.title,
    description: course.description,
    coverUrl: course.coverUrl ?? '',
    sortOrder: course.sortOrder,
    isPublished: course.isPublished,
  }
  modalVisible.value = true
}

async function handleSave() {
  if (!form.value.title.trim()) {
    message.warning('请输入课程标题')
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await client.patch(`/courses/${editingId.value}`, form.value)
      message.success('更新成功')
    } else {
      await client.post('/courses', form.value)
      message.success('创建成功')
    }
    modalVisible.value = false
    fetchCourses()
  } catch {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

function handleDelete(course: Course) {
  Modal.confirm({
    title: '确认删除该课程？',
    content: course.title,
    okType: 'danger',
    async onOk() {
      await client.delete(`/courses/${course.id}`)
      message.success('删除成功')
      fetchCourses()
    },
  })
}

onMounted(fetchCourses)
</script>

<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">课程管理</h2>
      <a-button type="primary" @click="openCreate">
        <plus-outlined /> 新建课程
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="courses"
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
      :title="editingId ? '编辑课程' : '新建课程'"
      :confirm-loading="saving"
      @ok="handleSave"
    >
      <a-form layout="vertical" style="margin-top: 16px">
        <a-form-item label="课程标题" required>
          <a-input v-model:value="form.title" placeholder="请输入课程标题" />
        </a-form-item>
        <a-form-item label="课程描述">
          <a-textarea v-model:value="form.description" :rows="3" placeholder="请输入课程描述" />
        </a-form-item>
        <a-form-item label="封面图片 URL">
          <a-input v-model:value="form.coverUrl" placeholder="https://..." />
        </a-form-item>
        <a-form-item label="排序（数字越小越靠前）">
          <a-input-number v-model:value="form.sortOrder" :min="0" style="width: 120px" />
        </a-form-item>
        <a-form-item label="发布状态">
          <a-switch v-model:checked="form.isPublished" checked-children="已发布" un-checked-children="未发布" />
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
