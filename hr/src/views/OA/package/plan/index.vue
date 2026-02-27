<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <ContentWrap>
      <SWForm @search="handleSearch" @reset="handleReset" @add="handleAdd" ref="formRef" />
    </ContentWrap>
    <ContentWrap>
      <SWTable
        ref="tableRef"
        :tableData="list"
        :total="total"
        :loading="loading"
        @see-detail="handleSeeDetail"
        @del="handleDel"
        @update-progress="updateProgress"
        @page-change="handlePageChange"
        @sort-change="handleSortChange"
      />
    </ContentWrap>

    <!-- 新增 -->
    <AddDialog
      ref="addFormRef"
      :addType="addType"
      @close="handleCloseDialog"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import { deleteNpById, getNpList } from '@/api/oa/package/plan/index'
import SWForm from './components/SWForm.vue'

import SWTable from './components/SWTable.vue'
import AddDialog from './components/addDialog.vue'

const route = useRoute()
const planName = route.query.planName || undefined

const message = useMessage() // 消息弹窗
defineOptions({ name: 'PackagePlan' })
const list = ref([]) // 列表数据
const total = ref(0) // 总数
const form = ref<{
  page: number
  pageSize: number
  planName?: string | undefined
}>({
  page: 1,
  pageSize: 10,
  planName: undefined
})
const loading = ref(false)

const tableRef = ref()

const addType = ref('package')

// 新增
const addFormRef = ref()
const handleAdd = () => {
  addFormRef.value.open()
}

const handleCloseDialog = () => {
  addFormRef.value.close()
}

// 搜索 参数变化
const handleSearch = (val: any) => {
  console.log('handleSearch', val)
  // 处理参数
  form.value = Object.assign({ page: 1, pageSize: form.value.pageSize }, val)
  tableRef.value?.updateCurrentPage(1)
  getList()
}

// 重置
const handleReset = () => {
  form.value = { page: 1, pageSize: 10 }
  orderParam.value = { prop: '', custorOrder: null }
  tableRef.value?.updateCurrentPage(1)
  getList()
}

// 查看详情
const handleSeeDetail = (row: any) => {
  addFormRef.value.open(row.id, true)
}

// 删除
const handleDel = async (row: any) => {
  // 删除二次确认
  await message.confirm('确认删除吗？')
  await deleteNpById(row.id)
  message.success('删除成功')
  getList()
}

// 分页变化
const handlePageChange = (val: any) => {
  form.value.page = val.page
  form.value.pageSize = val.pageSize
  getList()
}

const orderParam = ref({
  prop: '',
  custorOrder: null
})

const handleSortChange = ({ prop, custorOrder }) => {
  orderParam.value = { prop, custorOrder }
  getList()
}

// 更新进度
const updateProgress = (row) => {
  // 找到点击的行 局部更新 isNewProgress 字段
  list.value.forEach((item) => {
    if (item.id == row.id) {
      item.isNewProgress = row.isNewProgress
    }
  })
}

const handleSuccess = () => {
  form.value.page = 1
  getList()
}

const getList = async () => {
  try {
    loading.value = true
    console.log('查询参数', form.value)
    const res = await getNpList({
      ...form.value
    })

    console.log('查询结果', res)

    loading.value = false
    list.value = res.records || []

    total.value = res.total || 0
  } catch (error) {
    loading.value = false
  }
}

onMounted(async () => {
  getList()
})

// 从不同的页面进来
if (planName) {
  const newUrl = window.location.href.replace(/\?.*$/, '') // 获取当前路径，并去除参数
  history.replaceState({}, '', newUrl)
}
</script>

<style lang="scss" scoped></style>
