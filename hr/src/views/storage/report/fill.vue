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
              @blur="getList"
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
          <el-button type="primary" @click="openDrawer"> 新增 </el-button>
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
      <el-table-column label="日报日期" prop="reportDate" />
      <el-table-column label="工作时长" prop="workHours" />
      <el-table-column label="实际作业" prop="actualWork" />
      <el-table-column label="填写人" prop="operationName" />
      <el-table-column label="创建时间" prop="createdAt" />
      <el-table-column label="最后更新时间" prop="updatedAt" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDrawer(row, 1)">查看</el-button>
          <el-button link type="primary" @click="openDrawer(row, 2)">填写</el-button>
          <el-button link type="primary" @click="remove(row)">删除</el-button>
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

  <Drawer
    v-if="isShowDrawer"
    ref="drawerRef"
    :is-show="isShowDrawer"
    :row-data="rowData"
    :title="drawerTitle"
    :type="drawerType"
    @refresh="refreshDrawer"
    @handel-close="closeDrawer"
  />
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import Drawer from './components/drawer.vue'
import { delReportItem, getReportList } from '@/api/storage/report'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'StorageReportFill' })

const appStore = useAppStore()
const queryParams = ref<StorageType.GetReportListQuery>({
  page: 1,
  size: 10
})
const loading = ref(false)
const tableData = ref<StorageType.ReportListItem[]>([])
const total = ref(1)
const isShowDrawer = ref(false)
const rowData = ref<StorageType.ReportListItem>()
const drawerTitle = ref('')
const drawerType = ref()
const reportDate = ref<string[]>()
const message = useMessage()
const drawerRef = ref()

watch(
  () => reportDate.value,
  (val) => {
    queryParams.value.beginDate = val?.[0]
    queryParams.value.endDate = val?.[1]
  }
)

// 搜索
async function handleQuery() {
  queryParams.value.page = 1
  await getList()
}

// 重置
function resetQuery() {
  queryParams.value = {
    page: 1,
    size: 10
  }
  reportDate.value = undefined

  getList()
}

// 获取列表数据
async function getList() {
  loading.value = true
  try {
    const res = await getReportList(queryParams.value)
    tableData.value = res.records.map((ele) => {
      ele.createdAt = formatDate(new Date(ele.createdAt), 'YYYY-MM-DD')
      ele.updatedAt = formatDate(new Date(ele.updatedAt))
      return ele
    })
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}

/**
 * @param row
 * @param type 1-查看 | 2-填写 | undefined-新增
 */
function openDrawer(row?: any, type?: 1 | 2) {
  isShowDrawer.value = true
  drawerType.value = type

  // 判断有没有row，有row就是填写，没有就是新增
  if (type === 1) {
    // 查看
    rowData.value = row
    drawerTitle.value = '查看'
  } else if (type === 2) {
    // 填写
    rowData.value = row
    drawerTitle.value = '填写'
  } else {
    // 新增
    drawerTitle.value = '新增'
  }
}

// 删除
async function remove(row: StorageType.ReportListItem) {
  try {
    await message.confirm('确认删除吗？删除后将无法恢复')
    const res = await delReportItem(row.id)
    if (res.success) {
      message.success('删除日报成功')
      getList()
    } else {
      message.error(res.message || '删除日报失败')
    }
  } catch (error) {}
}

// 关闭抽屉
async function closeDrawer() {
  try {
    isShowDrawer.value = false
    rowData.value = undefined
    drawerType.value !== 1 && getList()
  } catch (error) {}
}

// 日期禁用
function disableDate(date: any) {
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  currentDate.setDate(currentDay)

  return date > currentDate
}

async function refreshDrawer(id: string) {
  await handleQuery()
  rowData.value = tableData.value.find((el) => el.id === id)
}

onMounted(() => {
  getList()
})
</script>
