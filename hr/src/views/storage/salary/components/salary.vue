<template>
  <ContentWrap v-loading="syncDataLoading" element-loading-text="薪资核算中...">
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="日期:" prop="dataDate">
            <el-date-picker
              type="date"
              v-model="queryParams.dataDate"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="请选择日期"
              :clearable="false"
              @change="handleQuery"
            />
          </el-form-item>
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
          <el-form-item label="班次" prop="shiftType">
            <el-select
              v-model="queryParams.shiftType"
              placeholder="请选择班次"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="item in shiftTypeOps"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
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
          <el-button type="primary" :style="{ marginLeft: '20px' }" @click="syncData">
            薪资复核
          </el-button>
          <slot name="othersBtns"></slot>
        </div>
      </div>
    </div>

    <el-table v-loading="loading" :border="false" :data="tableData">
      <el-table-column label="日期" prop="dataDate" fixed="left" width="120" />
      <el-table-column label="姓名" prop="userName" fixed="left" width="120" />
      <el-table-column label="班次" fixed="left" width="120">
        <template #default="{ row }">
          <span class="shiftType" :class="{ night: row.shiftType === '夜班' }">{{
            row.shiftType
          }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center">
        <template #header>
          <span>本组数据（{{ getDictLabel(DICT_TYPE.ROLES_MASK, salary.currentRolesMask) }}）</span>
        </template>
        <el-table-column
          v-for="(item, index) in currentRolesMasksOps"
          :key="index"
          :label="item.label"
          :min-width="getColumnWidth(item.label)"
        >
          <template #header>
            <div class="table-header">
              <span>{{ item.label }}</span>
              <el-popover
                v-if="item.id"
                effect="light"
                placement="bottom"
                popper-class="popper"
                :popper-style="{
                  display: 'flex',
                  alignItems: 'centre',
                  width: 'auto',
                  border: '0',
                  height: '46px',
                  lineHeight: '22px'
                }"
                class="priceTip"
                append-to="body"
              >
                <template #reference>
                  <img class="ml10px" src="@/assets/svgs/storage/question.svg" alt="" />
                </template>
                <template #content> </template>
                <div class="tip-content">
                  <span>白班计价：{{ item.dayPricing || '--' }}</span>
                  <span>；夜班计价：{{ item.nightPricing || '--' }}</span>
                  <span>；跨工种价：{{ item.crossWorkPricing || '--' }}</span>
                  <span>；爆款计价：{{ item.hotSellPricing || '--' }}</span>
                </div>
              </el-popover>
            </div>
          </template>
          <template v-if="item.label === '产量（件）'" #default="{ row }">
            <span :class="{ isTime: row.currentRolesMask.accountingMethod === '1' }">{{
              row.currentRolesMask?.quantity || '--'
            }}</span>
          </template>
          <template v-else-if="item.label === '计时'" #default="{ row }">{{
            row.currentRolesMask?.duration || '--'
          }}</template>
          <template v-else #default="{ row }">{{
            row.currentRolesMask?.detailVos[index]?.quantity || '--'
          }}</template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        v-for="(item, i) in otherRolesMasksOps"
        :key="item.id"
        :label="item.label"
        align="center"
      >
        <el-table-column
          v-for="(ele, index) in item.children"
          :key="index"
          :label="ele.label"
          :min-width="getColumnWidth(ele.label)"
        >
          <template #header>
            <div class="table-header">
              <span>{{ ele.label }}</span>
              <el-popover
                v-if="ele.id"
                effect="light"
                placement="bottom"
                popper-class="popper"
                :popper-style="{
                  display: 'flex',
                  alignItems: 'centre',
                  width: 'auto',
                  border: '0',
                  height: '46px',
                  lineHeight: '22px'
                }"
                class="priceTip"
                append-to="body"
              >
                <template #reference>
                  <img class="ml10px" src="@/assets/svgs/storage/question.svg" alt="" />
                </template>
                <template #content> </template>
                <div class="tip-content">
                  <span>白班计价：{{ ele.dayPricing || '--' }}</span>
                  <span>；夜班计价：{{ ele.nightPricing || '--' }}</span>
                  <span>；跨工种价：{{ ele.crossWorkPricing || '--' }}</span>
                  <span>；爆款计价：{{ ele.hotSellPricing || '--' }}</span>
                </div>
              </el-popover>
            </div>
          </template>
          <template v-if="ele.label === '产量（件）'" #default="{ row }">
            <span :class="{ isTime: row.otherRolesMasks?.[i].accountingMethod === '1' }">{{
              row.otherRolesMasks?.[i]?.quantity || '--'
            }}</span>
          </template>
          <template v-else-if="ele.label === '计时'" #default="{ row }">
            {{ row.otherRolesMasks?.[i]?.duration || '--' }}
          </template>
          <template v-else #default="{ row }">{{
            row.otherRolesMasks?.[i].detailVos?.[index]?.quantity || '--'
          }}</template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="未分类件数" prop="notClassificationQuantity" fixed="right" width="95">
        <template #default="{ row }">
          <el-button
            v-if="row.notClassificationQuantity"
            link
            type="primary"
            @click="handleOpendialog(row, 1)"
          >
            <img src="@/assets/svgs/storage/eye.svg" class="mr8px" />
            <span :style="{ fontSize: '14px' }">{{ row.notClassificationQuantity }}</span>
          </el-button>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="实际出勤（h）" prop="actAttendance" fixed="right" width="120" />
      <el-table-column label="平均时薪" prop="averageHourSalary" fixed="right" width="90" />
      <el-table-column label="当日薪资" prop="dailySalary" fixed="right" width="150">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleOpenDailySalary(row.id)">
            <img src="@/assets/svgs/storage/eye.svg" class="mr8px" />
            <span :style="{ fontSize: '14px' }">{{ row.dailySalary }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :width="100">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleOpenDrawer(row)"> 数据调整 </el-button>
        </template>
      </el-table-column>

      <template #empty>
        <img class="mt36px" src="@/assets/imgs/empty/empty1.png" alt="" />
        <div class="mb24px" :style="{ lineHeight: '20px', marginTop: '-50px' }">暂无相关内容</div>
      </template>
    </el-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </ContentWrap>

  <ExamienDrawer
    ref="examineDrawerRef"
    v-model:is-show="isDrawerShow"
    title="数据调整"
    :row-data="rowData"
    @open-dialog="handleOpendialog"
    @refresh="handleQuery"
  />

  <ExamienDialog
    v-model:model-value="isDialogShow"
    :title="dialogTitle"
    :row-data="dialogRowData"
    :type="dialogType"
  />

  <daily-salary ref="dailySalaryRef" :id="dailyId" />

  <unpack-dialog
    v-model:is-show="isShowUnpackDialog"
    :data-date="queryParams.dataDate || ''"
    :row-data="dialogRowData"
    @close="isShowUnpackDialog = false"
    @upload="handleUploadQuantity"
    @refresh="getList"
  />
</template>
<script setup lang="tsx">
import { getWhInspectionSalary, syncWhInspectionSalary } from '@/api/storage/salary/examine'
import { useSalary } from '@/store/modules/storage'
import { getDictLabel, DICT_TYPE, getIntDictOptions, getDictValue } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { cloneDeep } from 'lodash-es'
const ExamienDrawer = defineAsyncComponent(() => import('../components/examineDrawer.vue'))
const ExamienDialog = defineAsyncComponent(() => import('../components/examineDialog.vue'))
const DailySalary = defineAsyncComponent(() => import('./dailySalary.vue'))
const UnpackDialog = defineAsyncComponent(() => import('./unpackDialog.vue'))

const message = useMessage()
const salary = useSalary()
const tableData = ref<StorageSalary.Examien.ListItem[]>([])
const queryParams = reactive<StorageSalary.Examien.GetListParams>({
  page: 1,
  size: 10
})
const loading = ref(true)
const total = ref(0)
const queryFormRef = ref()
const shiftTypeOps = ref<any[]>([])
const currentRolesMasksOps = ref<any[]>()
const otherRolesMasksOps = ref<any[]>()
const isDrawerShow = ref(false)
const isDialogShow = ref(false)
const rowData = ref<StorageSalary.Examien.ListItem>()
const dialogTitle = ref<string>('')
const dialogRowData = ref<StorageSalary.Examien.DetailVos>({})
const dailySalaryRef = ref()
const dailyId = ref('')
const dialogType = ref(0)
const syncDataLoading = ref(false)
const isShowUnpackDialog = ref(false)
const examineDrawerRef = ref()

/**
 * 搜索
 */
function handleQuery() {
  queryParams.page = 1
  getList()
}

/**
 * 重置
 */
function resetQuery() {
  queryFormRef.value.resetFields()
  getList()
}

/**
 * 获取列表数据
 */
async function getList() {
  queryFormRef.value?.clearValidate()
  loading.value = true
  try {
    const res = await getWhInspectionSalary(queryParams)
    if (res) {
      tableData.value = res.records.map((item) => {
        item.shiftType = getDictLabel(DICT_TYPE.SHIFT_TYPE, item.shiftType)
        return item
      })
      total.value = res.total

      if (res.records && res.records[0]) {
        // 本组数据label
        currentRolesMasksOps.value = res.records[0].currentRolesMask?.detailVos?.map((item) => ({
          label: item.classificationName,
          id: item.classificationId,
          dayPricing: item.dayPricing,
          nightPricing: item.nightPricing,
          crossWorkPricing: item.crossWorkPricing,
          hotSellPricing: item.hotSellPricing
        }))
        if (currentRolesMasksOps.value?.length)
          currentRolesMasksOps.value?.push({ label: '产量（件）' }, { label: '计时' })

        // 夸组数据label
        otherRolesMasksOps.value = res.records[0].otherRolesMasks?.map((item) => {
          const children:
            | {
                label?: string
                id?: string
                dayPricing?: number
                nightPricing?: number
                crossWorkPricing?: number
                hotSellPricing?: number
              }[]
            | undefined = item.detailVos?.map((ele) => {
            return {
              label: ele.classificationName,
              id: ele.classificationId,
              dayPricing: ele.dayPricing,
              nightPricing: ele.nightPricing,
              crossWorkPricing: ele.crossWorkPricing,
              hotSellPricing: ele.hotSellPricing
            }
          })
          children?.push({ label: '产量（件）' }, { label: '计时' })
          return {
            label: `跨组数据（${getDictLabel(DICT_TYPE.ROLES_MASK, item.rolesMask)}）`,
            children
          }
        })
      } else {
        currentRolesMasksOps.value = []
        otherRolesMasksOps.value = []
      }
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

/** 打开弹窗 */
function handleOpendialog(row: StorageSalary.Examien.DetailVos, type?: number) {
  dialogTitle.value = type
    ? `未分类产量（${row.userName}）`
    : `产量明细（${row.classificationName}）`
  dialogRowData.value = cloneDeep(row)
  dialogRowData.value.id = type ? dialogRowData.value.id : rowData.value?.id
  dialogType.value = type || 0
  row.interceptFlag ? (isShowUnpackDialog.value = true) : (isDialogShow.value = true)
}

/** 同步数据 */
async function syncData() {
  if (!queryParams.dataDate) return message.error('请选择日期')
  syncDataLoading.value = true
  try {
    const res = await syncWhInspectionSalary({
      dataDate: queryParams.dataDate || '',
      rolesMask: queryParams.rolesMask || ''
    })
    if (res.success) {
      message.success('数据同步完成')
      handleQuery()
    }
  } catch (error) {
  } finally {
    syncDataLoading.value = false
  }
}

function handleUploadQuantity(val: number) {
  examineDrawerRef.value.upDateInfo(val, dialogRowData.value)
  isShowUnpackDialog.value = false
}

/**
 * el-table扩展工具  -- 列宽度自适应
 * @returns 列宽(int)
 */
function getColumnWidth(label) {
  return getTextWidth(label)
}

/**
 * el-table扩展工具  -- 列宽度自适应 - 获取列宽内文本宽度
 * @param {*} text 文本内容
 * @returns 文本宽度(int)
 */
function getTextWidth(text) {
  const span = document.createElement('span')
  span.style.visibility = 'hidden'
  span.style.position = 'absolute'
  span.style.top = '-9999px'
  span.style.fontSize = '14px'
  span.style.whiteSpace = 'nowrap'
  span.innerText = text
  document.body.appendChild(span)
  const width = span.offsetWidth + 24 + 24
  document.body.removeChild(span)
  return width
}

async function handleOpenDailySalary(id: string) {
  dailyId.value = id
  await nextTick()
  dailySalaryRef.value.open()
}

function handleOpenUnpackDialog() {
  isShowUnpackDialog.value = true
  dialogRowData.value = {}
}

function handleOpenDrawer(row: typeof rowData.value) {
  isDrawerShow.value = true
  rowData.value = row

  if (salary.currentRolesMask === getDictValue(DICT_TYPE.ROLES_MASK, '拆包员')) {
    salary.getAllocationInterceptInfo(queryParams.dataDate || '')
  }
}

defineExpose({ handleOpenUnpackDialog })

onBeforeMount(async () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  queryParams.dataDate = formatDate(yesterday, 'YYYY-MM-DD')
  queryParams.rolesMask = salary.currentRolesMask
  await getList()
  shiftTypeOps.value = getIntDictOptions(DICT_TYPE.SHIFT_TYPE, true)
})

onActivated(async () => {
  await getList()
})
</script>

<style lang="less" scoped>
* {
  --el-select-width: 220px;
  --el-input-width: 220px;
  --el-date-editor-width: 220px;
  --el-color-primary: #0064ff;
}

.el-button {
  font-size: 12px;

  &.is-link {
    font-size: 14px;
  }
}

:deep(.el-input__wrapper) {
  padding-top: 0;
  padding-bottom: 0;
}

:deep(th.el-table__cell) {
  background-color: rgb(242, 246, 252) !important;
  color: rgb(102, 102, 102);
  font-size: 14px;
  font-weight: 400;
  height: 40px;
}

.table-header {
  display: flex;
  flex-wrap: nowrap;
}

:deep(.el-table__cell) {
  table-layout: auto;
}

.shiftType {
  --color: #0064ff;
  display: flex;
  align-items: center;
  color: var(--color);

  &::before {
    content: '';
    display: block;
    margin-right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color);
  }
}

.night {
  .shiftType();
  --color: #f00;
}

// 表格去边框
:deep(
  .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper .el-table--border .is-scrolling-left .el-table__fixed
) {
  border-right: 1px solid rgba(255, 0, 0, 0) !important;
}

.isTime {
  color: #999;
}

.popper {
  width: auto !important;
  border: 0;
  box-shadow: 0px 0px 20px 2px rgba(0, 31, 72, 0.1459);
}

.commonTopFilterWrap-search {
  .el-button {
    // margin-left: 20px;
    margin-right: 0;
  }
}

.tip-content {
  display: flex;
  width: auto;
}
</style>
