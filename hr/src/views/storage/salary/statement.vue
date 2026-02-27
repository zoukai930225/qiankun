<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="姓名:" prop="userName">
            <el-input
              v-model.trim="queryParams.userName"
              placeholder="请输入姓名"
              clearable
              :maxlength="10"
              @keydown.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="部门:" prop="departmentId">
            <el-cascader
              v-model="departmentIds"
              :options="salary.departmentOptions"
              :props="salary.departmentProps"
              placeholder="请选择部门"
              clearable
              :show-all-levels="false"
              @change="handleCHangeDepartment"
            />
          </el-form-item>
          <el-form-item label="月份" prop="dataMonth">
            <el-date-picker
              type="month"
              v-model="queryParams.dataMonth"
              value-format="YYYY-MM"
              format="YYYY-MM"
              placeholder="请选择月份"
              :clearable="false"
              @change="handleQuery"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn"> 重置 </el-button>
          <el-button type="primary" :style="{ marginLeft: '20px' }" @click="openExportDialog">
            导出
          </el-button>
        </div>
      </div>
    </div>

    <sw-table :options="tableOptions" :table-data="tableData" />

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 导出弹窗 -->
  <export-dialog v-model:model-value="isShow" @export-success="message.success('导出成功')" />
</template>
<script setup lang="ts">
import { formatDate } from '@/utils/formatTime'
import SwTable from './components/table.vue'
import { tableOptions } from './options'
import { getWhSalaryReport } from '@/api/storage/salary/statement'
import { useSalary } from '@/store/modules/storage'
const exportDialog = defineAsyncComponent(() => import('./components/exportDialog.vue'))

const salary = useSalary()

defineOptions({ name: 'StorageSalaryStatement' })

const message = useMessage()

const tableData = ref<StorageSalary.Statement.ListItem[]>([])
const queryParams = reactive<StorageSalary.Statement.GetListParams>({
  page: 1,
  size: 10
})
const loading = ref(true)
const total = ref(1)
const queryFormRef = ref()
const isShow = ref(false)
const departmentIds = ref<string[]>([])

watch(isShow, (val) => (salary.departmentProps.multiple = val), {
  immediate: true
})

/**
 * 搜索
 */
function handleQuery() {
  queryParams.page = 1
  getList()
}

function handleCHangeDepartment(val: string[]) {
  queryParams.departmentId = val?.[val.length - 1] || undefined
  handleQuery()
}

/**
 * 重置
 */
function resetQuery() {
  departmentIds.value = []
  queryFormRef.value.resetFields()
  getList()
}

/**
 * 获取列表数据
 */
async function getList() {
  loading.value = true
  try {
    const res = await getWhSalaryReport(queryParams)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}

/**
 * 打开导出弹窗
 */
function openExportDialog() {
  isShow.value = true
}

onBeforeMount(async () => {
  const currentMonth = new Date()
  const preMonth = new Date(currentMonth)
  preMonth.setMonth(currentMonth.getMonth() - 1)
  queryParams.dataMonth = formatDate(preMonth, 'YYYY-MM')
  getList()
  if (salary.departmentOptions.length === 0) salary.getDepartmentList()
})

onActivated(async () => {
  getList()
  if (salary.departmentOptions.length === 0) salary.getDepartmentList()
})
</script>

<style lang="less" scoped>
* {
  --el-select-width: 220px;
  --el-input-width: 220px;
  --el-date-editor-width: 220px;
}

.el-button {
  font-size: 12px;
}
</style>
