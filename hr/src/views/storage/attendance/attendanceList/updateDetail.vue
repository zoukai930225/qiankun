<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form :model="queryParams" ref="queryFormRef" :inline="true">
            <el-form-item label="变更日期:">
              <div class="date-picker">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  clearable
                  @change="getList"
                />
              </div>
            </el-form-item>
            <el-form-item prop="userId" label="变更人:">
              <el-input v-model.trim="queryParams.changeUserName" placeholder="请输入" />
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :pageSize="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
              重置
            </el-button>
          </div>
        </div>
      </div>

      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="records"
        :stripe="true"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
        show-overflow-tooltip
      >
        <el-table-column label="变更时间" width="300" prop="changeDate" />
        <el-table-column label="变更人" width="200" prop="changeUserName" />
        <el-table-column label="变更内容">
          <template #default="{ row }">
            <div v-html="row.changeContent"></div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { getAttendanceUpdateDetail } from '@/api/storage/attendance'

const appStore = useAppStore()
const route = useRoute()

const queryParams = ref<StorageAttendance.GetUpdateDetailParams>({
  page: 1,
  pageSize: 10,
  attendanceDateEnd: route.query.attendanceDateEnd as string,
  attendanceDateStart: route.query.attendanceDateStart as string,
  userId: route.params.id as string,
  changeDateEnd: '',
  changeDateStart: ''
})
const dateRange = computed({
  get: () => [queryParams.value.changeDateStart!, queryParams.value.changeDateEnd!],
  set: (val) => {
    queryParams.value.changeDateStart = val?.[0] || ''
    queryParams.value.changeDateEnd = val?.[1] || ''
  }
})
const loading = ref(false)
const records = ref<StorageAttendance.UpdateListItem[]>([])
const queryFormRef = ref()

const total = ref(1)

function handleQuery() {
  queryParams.value.page = 1
  getList()
}

function resetQuery() {
  delete queryParams.value.changeDateEnd
  delete queryParams.value.changeDateStart
  delete queryParams.value.changeUserName

  getList()
}

async function getList() {
  try {
    const res = await getAttendanceUpdateDetail(queryParams.value)

    records.value = res.records
    total.value = res.total
  } catch (error) {
    records.value = [
      {
        changeContent: '',
        changeDate: '2025-3-28',
        changeUserName: 'zx'
      }
    ]

    total.value = records.value.length
  }
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

<style scoped lang="less">
.SWFilterExpandAll {
  margin-bottom: 20px;
}
:deep(.el-form) {
  .el-form-item {
    margin-right: 20px;
    .el-input__wrapper,
    .el-select__wrapper {
      width: 223px;
      box-sizing: border-box;
    }

    .date-picker {
      display: flex;
      justify-content: space-between;
      width: 396px;

      .el-date-editor {
        width: 183px;
      }
    }
  }
}
</style>
