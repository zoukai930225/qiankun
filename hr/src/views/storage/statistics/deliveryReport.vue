<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="78px">
          <el-form-item label="日报日期:" prop="reportDate">
            <el-date-picker
              v-model="reportDate"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              clearable
              :disabled-date="disableDate"
              @change="getList"
              @clear="getList"
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
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
        </div>
      </div>
    </div>
    <el-table
      :border="true"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="tableData"
      :stripe="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      show-overflow-tooltip
    >
      <el-table-column label="日报日期" prop="dataDate" />
      <el-table-column label="生成时间" prop="createdAt" />
      <el-table-column label="最后修改人" prop="updatedId" />
      <el-table-column label="修改时间" prop="updatedAt" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="editRow(row.id)">修改</el-button>
          <el-button
            link
            type="primary"
            :loading="row.exportloading"
            :disabled="row.exportloading"
            @click="exportRow(row)"
            >导出</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </ContentWrap>
  <Drawer v-model:is-show-drawer="isShowDrawer" :id="cellId" @after-update="getList" />
</template>
<script lang="ts" setup>
import { exportDeliveryReport, getDeliveryReportList } from '@/api/storage/statistics'
import { useAppStore } from '@/store/modules/app'
import download from '@/utils/download'
import { formatDate } from '@/utils/formatTime'

const Drawer = defineAsyncComponent(() => import('./components/drawer.vue'))

defineOptions({ name: 'DeliveryReport' })

const queryParams = reactive({
  dataDateStart: '',
  dataDateEnd: '',
  page: 1,
  size: 10
})
const reportDate = computed({
  get: () => [queryParams.dataDateStart, queryParams.dataDateEnd],
  set: (val) => {
    queryParams.dataDateStart = val?.[0] || ''
    queryParams.dataDateEnd = val?.[1] || ''
  }
})
const appStore = useAppStore()
const loading = ref(false)
const tableData = ref<any[]>([
  {
    reportDate: '',
    createDate: '',
    lastHandler: '',
    updateDate: '',
    id: '1234567890',
    exportloading: false
  }
])
const total = ref(1)
const isShowDrawer = ref(false)
const cellId = ref('')
const queryFormRef = ref()

async function getList() {
  try {
    const res = await getDeliveryReportList(queryParams)
    total.value = res.total
    tableData.value = res.records.map((el) => {
      el.updatedAt = formatDate(new Date(el.updatedAt), 'YYYY-MM-DD HH:mm:ss')
      el.createdAt = formatDate(new Date(el.createdAt), 'YYYY-MM-DD HH:mm:ss')
      return el
    })
  } catch (error) {}
}

// 搜索
async function handleQuery() {
  queryParams.page = 1
  getList()
}

// 重置
async function resetQuery() {
  queryFormRef.value.resetFields()
  reportDate.value = []
  getList()
}

// 修改
async function editRow(id: string) {
  isShowDrawer.value = true
  cellId.value = id
}

//导出
async function exportRow(row: any) {
  // 防抖
  row.exportloading = true
  setTimeout(() => {
    row.exportloading = false
  }, 2000)

  try {
    const res = await exportDeliveryReport({ id: row.id })
    if (res) {
      let fileName = `${row.dataDate}仓库发货统计.xlsx`
      download.excel(res, fileName)
    }
  } catch (error) {}
}

// 日期禁用
function disableDate(date: any) {
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  currentDate.setDate(currentDay)

  return date > currentDate
}

onMounted(() => {
  getList()
})
</script>
<style lang="less" scoped></style>
