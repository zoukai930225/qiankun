<template>
  <div v-loading="importBtnLoading" element-loading-text="数据导入中...">
    <!-- 列表 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form :model="queryParams" ref="queryFormRef" :inline="true">
            <el-form-item label="部门:" prop="department">
              <el-cascader
                v-model="departmentIds"
                :options="departmentOptions"
                :props="departmentProps"
                placeholder="请选择部门"
                clearable
                :show-all-levels="false"
                @change="getList"
              />
            </el-form-item>
            <el-form-item label="考勤状态:" prop="attendanceStatus">
              <el-select
                v-model="queryParams.attendanceStatus"
                placeholder="请选择考勤状态"
                clearable
                @change="getList"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="userName" label="姓名:">
              <el-input
                v-model.trim="queryParams.userName"
                placeholder="请输入"
                clearable
                @keydown.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="考勤周期:" prop="attendanceDateStart">
              <div class="date-picker">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :clearable="false"
                  :disabled-date="disableDate"
                  @change="getList"
                />
              </div>
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
            <el-upload
              :action="uploadUrl"
              class="ml16px"
              :show-file-list="false"
              :headers="uploadHeaders"
              :on-success="handleImportSuccess"
              :before-upload="() => (importBtnLoading = true)"
              :on-error="() => (importBtnLoading = false)"
              :disabled="importBtnLoading"
            >
              <el-button type="primary">
                <el-icon class="mr7px"><Upload /></el-icon> 导入
              </el-button>
            </el-upload>
          </div>
        </div>
      </div>
      <div class="table-part">
        <el-table
          :header-cell-style="appStore.headerCellStyle"
          :data="records"
          class="SWCommonTable"
          v-horizontal-scroll="'always'"
          :max-height="655"
          v-loading="loading"
          show-overflow-tooltip
        >
          <el-table-column label="部门" prop="departmentName" fixed="left" min-width="100px" />
          <el-table-column label="姓名" prop="userName" fixed="left" min-width="100px" />
          <el-table-column label="考勤状态" fixed="left" min-width="100px">
            <template #default="{ row }">
              <div
                :class="{
                  success: row.attendanceStatusName === '正常',
                  error: row.attendanceStatusName === '异常'
                }"
                @click="toDetail(row.userId)"
              >
                {{ row.attendanceStatusName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column v-for="(day, index) in days" :key="day" min-width="120px">
            <template #header>
              <span>{{ day }}</span>
            </template>
            <template #default="{ $index, row }">
              <div
                class="flex attendanceStatus"
                :class="{ hasChanged: records[$index]?.attendanceDaySummaryVos?.[index]?.changed }"
                @click="openEditDrawer(day, row)"
                v-if="records[$index]?.attendanceDaySummaryVos?.[index]?.attendanceStatus"
              >
                <div
                  class="status"
                  :style="{
                    color:
                      records[$index]?.attendanceDaySummaryVos?.[index].attendanceStatus === '异常'
                        ? '#EB3737'
                        : '#333'
                  }"
                  >{{ records[$index]?.attendanceDaySummaryVos?.[index].attendanceStatus! }}</div
                >

                <div
                  v-if="records[$index]?.attendanceDaySummaryVos?.[index]?.shiftType === '夜班'"
                  class="shiftType"
                >
                  夜
                </div>

                <div
                  v-else-if="
                    records[$index]?.attendanceDaySummaryVos?.[index]?.leaveType === '请假' &&
                    records[$index].attendanceDaySummaryVos?.[index]?.attendanceStatus === '正常'
                  "
                  class="leaveType"
                >
                  假
                </div>
                <div
                  v-else-if="
                    records[$index]?.attendanceDaySummaryVos?.[index]?.leaveType === '休假' &&
                    records[$index].attendanceDaySummaryVos?.[index]?.attendanceStatus === '正常'
                  "
                  class="leaveType2"
                >
                  休
                </div>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="163" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" size="large" @click="toDetail(row.userId)">
                查看详情
              </el-button>
              <el-button link type="primary" size="large" @click="toUpdateDetail(row.userId)">
                变更明细
              </el-button>
            </template>
          </el-table-column>

          <template #empty>
            <img src="@/assets/imgs/empty/empty1.png" alt="" />
            <div>暂无相关内容</div>
          </template>
        </el-table>
      </div>
      <div :class="{ tableFooter: true }">
        <!-- 分页 -->
        <Pagination
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </ContentWrap>
  </div>
  <update-detail-drawer
    v-model="isShowDrawer"
    :date="dailyDetailDate"
    @after-submit="getList"
    :user-id="editUserId"
    :personName="personName"
  />
</template>
<script lang="ts" setup>
import UpdateDetailDrawer from './components/updateDetailDrawer.vue'
import { getAttendanceList, getDeptTreeByKefan } from '@/api/storage/attendance'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { betweenDay, formatDate, getDateAfterNDays, getLastNDays } from '@/utils/formatTime'
import { cloneDeep } from 'lodash-es'

defineOptions({ name: 'AttendanceList' })

const appStore = useAppStore()
const router = useRouter()
const message = useMessage()
const { wsCache } = useCache()

const queryParams = ref<StorageAttendance.GetListParams>({
  page: 1,
  pageSize: 10,
  attendanceDateStart: formatDate(new Date(getLastNDays(6)[0] as string), 'YYYY-MM-DD'),
  attendanceDateEnd: formatDate(new Date(), 'YYYY-MM-DD')
})
const oldFormData = cloneDeep(queryParams.value)
const isShowDrawer = ref(false)
const dailyDetailDate = ref('')
const editUserId = ref('')
const statusOptions = [
  {
    label: '正常',
    value: 0
  },
  {
    label: '异常',
    value: 1
  }
]
const AccessTokenKey = 'ACCESS_TOKEN'
const loading = ref(false)
const records = ref<StorageAttendance.ListItem[]>([])
const personName = ref('')
const uploadUrl = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_URL}/api/attendance/uploadFile`
const uploadHeaders = {
  token: wsCache.get(AccessTokenKey) ? wsCache.get(AccessTokenKey) : wsCache.get('ACCESS_TOKEN')
}
const importBtnLoading = ref(false)

const total = ref(1)
const departmentOptions = ref<any[]>([])
const departmentProps = {
  label: 'name',
  value: 'id',
  children: 'children',
  checkStrictly: true
}
const departmentIds = ref<string[]>([])

const dateRange = computed({
  get: () => [queryParams.value.attendanceDateStart!, queryParams.value.attendanceDateEnd!],
  set: (val) => {
    queryParams.value.attendanceDateStart = val?.[0] || ''
    queryParams.value.attendanceDateEnd = val?.[1] || ''
  }
})
const betweenDays = computed(
  () => betweenDay(new Date(dateRange.value[0]), new Date(dateRange.value[1])) + 1
)
const days = computed(() => {
  let value: string[] = []
  for (let i = 0; i < betweenDays.value; i++) {
    value.push(
      formatDate(getDateAfterNDays(queryParams.value.attendanceDateStart!, i), 'YYYY-MM-DD')
    )
  }
  return value
})

function handleQuery() {
  queryParams.value.page = 1
  getList()
}

function handleImportSuccess(res) {
  if (res.success) {
    message.success('导入成功')
  }
  importBtnLoading.value = false
  handleQuery()
}

function resetQuery() {
  queryParams.value = { ...oldFormData }
  departmentIds.value = []
  getList()
}

async function getList() {
  loading.value = true
  queryParams.value.departmentId = departmentIds.value?.[departmentIds.value.length - 1]
  try {
    const res = await getAttendanceList(queryParams.value)

    records.value = res.records
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}
function toDetail(id: string) {
  router.push({
    name: 'attendanceDetail',
    params: {
      id
    },
    query: {
      attendanceDateStart: queryParams.value.attendanceDateStart,
      attendanceDateEnd: queryParams.value.attendanceDateEnd
    }
  })
}

function toUpdateDetail(id: string) {
  router.push({
    name: 'attendanceUpdateDetail',
    params: {
      id
    },
    query: {
      attendanceDateStart: queryParams.value.attendanceDateStart,
      attendanceDateEnd: queryParams.value.attendanceDateEnd
    }
  })
}

/**
 * 获取部门列表
 */
async function getDepartmentList() {
  try {
    const res = await getDeptTreeByKefan()
    departmentOptions.value = res?.children
  } catch (err) {}
}

// 日期禁用
function disableDate(date: any) {
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  currentDate.setDate(currentDay)

  return date > currentDate
}

function openEditDrawer(date: string, row: any) {
  dailyDetailDate.value = date
  editUserId.value = row.userId
  isShowDrawer.value = true
  personName.value = row.userName
}

onMounted(() => {
  Promise.all([getDepartmentList(), getList()])
})

onActivated(() => {
  Promise.all([getDepartmentList(), getList()])
})
</script>

<style scoped lang="less">
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
      width: 270px;

      .el-date-editor {
        width: 183px;
      }
    }
  }
}
:deep(.el-button--default) {
  font-size: 12px;
}

.caseTag {
  width: 40px;
  height: 20px;
  border-radius: 2px;
  font-size: 12px;
  line-height: 19px;
  text-align: center;
  position: relative;
  margin-left: 20px;

  &.night {
    background-color: #fff5e3;
    color: #db6a0f;
  }

  &.vacation {
    background-color: #e3fffb;
    color: #359b97;
  }

  &.leave {
    background-color: #e6f3ff;
    color: #0064ff;
  }

  &::before {
    content: '';
    display: block;
    height: 12px;
    margin-top: 4px;
    border-left: 1px solid #f0f0f0;
    position: absolute;
    left: -11px;
  }
}

:deep(.el-card) {
  border-radius: 8px !important;
}

:deep(.el-pagination) {
  margin: 0;
  padding: 8px;
}

.commonTopFilterWrap {
  justify-content: space-between;
}

.commonTopFilterWrap-filter {
  flex-wrap: nowrap;
}

.commonTopFilterWrap-search {
  margin-left: 0;
}

.attendanceStatus {
  display: flex;
  align-items: center;
  width: 69px;
  height: 26px;
  background: #ebebeb;
  border-radius: 2px;
  overflow: hidden;
  font-size: 12px;
  cursor: pointer;

  .status {
    flex: 1;
    line-height: 1;
    text-align: center;
  }

  .shiftType {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 100%;
    background: #ffeadd;
    color: #f46004;
    line-height: 1;
  }

  .leaveType {
    .shiftType();
    background: #d5e6ff;
    color: #0056dc;
  }

  .leaveType2 {
    .shiftType();
    background: #dafdf9;
    color: #02a28c;
  }

  &.hasChanged {
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 0;
      height: 0;
      border-right: 10px solid transparent;
      border-top: 8px solid #fcd200;
      // background-color: #f00;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}

.success {
  display: flex;
  align-items: center;
  width: 50px;
  color: #333;
  cursor: pointer;

  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    margin-right: 10px;
    border-radius: 50%;
    background: #139040;
  }
}

.error {
  .success();

  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    margin-right: 10px;
    border-radius: 50%;
    background: #eb3737;
  }
}

:deep(.el-table__cell) {
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>
