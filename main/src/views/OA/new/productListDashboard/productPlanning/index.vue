<template>
  <div>
    <!-- 搜索表单 -->
    <SWForm ref="SWFormRef" @search="handleSearch" @reset="handleReset" />
    <!-- table -->
    <customTable :list="list" @refresh="getList" :loading="loading"/>
    <div class="flex justify-end mt-15px">
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="form.page"
        :page-size="form.size"
        :total="total"
        :page-sizes="[10, 20, 25,30, 50,100]"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        layout="total,sizes, prev, pager, next"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { queryProgressList } from '@/api/oa/new/progressDashboardList'
import CustomTable from './components/CustomTable.vue'
import SWForm from './components/SWForm.vue'

defineOptions({ name: 'ProgressDashboardList' })

onMounted(async () => {
  getList()
})

const form = ref({
  page: 1,
  size: 10
})

const list = ref([])
const total = ref(0)
const loading = ref(false)

const getList = async () => {
  try {
    loading.value = true
    const params = {
      ...form.value
    }
    const res = await queryProgressList(params)
    total.value = res.total || 0
    if (res.records) {
      const mergedItems = res.records.flatMap((record) => {
        return record.items
      })
      // 数组展开
      list.value = mergedItems
    }
    loading.value = false
  } catch (error) {
    loading.value = false
    console.error('获取进度列表失败', error)
  }
}

// 参数变化
const handleSearch = (val: any) => {
  form.value = Object.assign({ page: 1, size: form.value.size }, val)
  getList()
}

// 分页变化
const handlePageChange = (val: any) => {
  form.value.page = val
  getList()
}

const handleSizeChange = (val: any ) => {
  form.value.size = val
  getList()
}

const handleReset = () => {
  form.value = { page: 1, size: 10 }
  getList()
}
</script>

<style lang="scss" scoped></style>
