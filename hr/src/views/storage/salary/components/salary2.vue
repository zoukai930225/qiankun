<template>
  <ContentWrap v-loading="uploadLoading || syncDataLoading" :element-loading-text="loadingText">
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

      <el-upload
        v-model:file-list="fileList"
        v-show="false"
        name="files"
        :auto-upload="false"
        :on-change="handleChange"
      >
        <el-button ref="uploadRef" />
      </el-upload>

      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn"> 重置 </el-button>
          <el-button type="primary" @click="syncData" :style="{ marginLeft: '20px' }">
            薪资复核
          </el-button>
          <slot name="othersBtns">
            <el-dropdown
              split-button
              type="primary"
              class="ml20px"
              ref="othersOptions"
              :teleported="false"
              :style="{ marginLeft: '20px' }"
              @click="handleDropdownClick"
              @command="handleCommand"
            >
              {{ btnName }}
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item in btnOps" :key="item.value" :command="item">
                    <span class="text-align-center">{{ item.label }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </slot>
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
          <template v-else-if="ele.label === '计时'" #default="{ row }">{{
            row.otherRolesMasks?.[i]?.duration || '--'
          }}</template>
          <template v-else #default="{ row }">{{
            row.otherRolesMasks?.[i].detailVos?.[index]?.quantity || '--'
          }}</template>
        </el-table-column>
      </el-table-column>

      <!-- <el-table-column label="未分类件数" prop="notClassificationQuantity" fixed="right" width="95">
        <template #default="{ row }">
          <el-button v-if="row.notClassificationQuantity" link type="primary">
            <img src="@/assets/svgs/storage/eye.svg" class="mr8px" />
            <span :style="{ fontSize: '14px' }">{{ row.notClassificationQuantity }}</span>
          </el-button>
          <span v-else>--</span>
        </template>
      </el-table-column> -->
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
      <el-table-column label="操作" fixed="right" width="90">
        <template #default="{ row }">
          <el-button link type="primary" @click="((isDrawerShow = true), (rowData = row))">
            数据调整
          </el-button>
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

  <QuilatyDrawer
    v-model:is-show="isDrawerShow"
    title="数据调整"
    :row-data="rowData"
    :roles-mask="rolesMask"
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
</template>
<script setup lang="tsx">
import {
  getWhInspectionSalary,
  importData,
  syncWhInspectionSalary
} from '@/api/storage/salary/examine'
import { useSalary } from '@/store/modules/storage'
import { getDictLabel, DICT_TYPE, getIntDictOptions, getDictValue } from '@/utils/dict'
import { downloadByUrl2 } from '@/utils/download'
import { formatDate } from '@/utils/formatTime'
import { cloneDeep } from 'lodash-es'
const QuilatyDrawer = defineAsyncComponent(() => import('./qualityDrawer.vue'))
const ExamienDialog = defineAsyncComponent(() => import('./examineDialog.vue'))
const DailySalary = defineAsyncComponent(() => import('./dailySalary.vue'))

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
const btnName = ref('更多操作')
const btnOps = [
  { value: '2', label: '数据导入', option: handleImport },
  { value: '3', label: '模板下载', option: handleDownloadModle }
]
const currentBtn = ref<StorageSalary.Quality.BtnOption>()
const othersOptions = ref()
const uploadRef = ref()
const fileList = ref<File[]>([])
const rolesMask = ref('')
const dailyId = ref('')
const dailySalaryRef = ref()
const uploadLoading = ref(false)
const dialogType = ref(0)
const syncDataLoading = ref(false)
const loadingText = ref('')

async function handleImport() {
  uploadRef.value.$el.click()
}

/** 导入 */
async function handleChange(file: any) {
  uploadLoading.value = true
  loadingText.value = '数据导入中...'
  const formData = new FormData()
  formData.append('file', file.raw)

  try {
    const res = await importData(formData, { rolesMask: salary.currentRolesMask })
    if (res.success) {
      message.success('数据导入成功')
      handleQuery()
    }
  } catch (error) {
  } finally {
    uploadLoading.value = false
  }
}

function handleDownloadModle() {
  const fileUrl =
    salary.currentRolesMask === getDictValue(DICT_TYPE.ROLES_MASK, '质检员')
      ? 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/c026e7ba-22bc-4dd4-a3a0-ab25dbca149e.xlsx'
      : 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/newProduct/ccc6731c-aad3-494f-a05a-3a5287a030df.xlsx'

  const fileName =
    salary.currentRolesMask === getDictValue(DICT_TYPE.ROLES_MASK, '质检员')
      ? '品控导入模版.xlsx'
      : '售后质检导入模板.xlsx'

  downloadByUrl2(fileUrl, fileName)
}

function handleDropdownClick() {
  if (currentBtn.value) {
    currentBtn.value?.option()
  } else {
    othersOptions.value?.handleOpen()
  }
}

async function handleOpenDailySalary(id: string) {
  dailyId.value = id
  await nextTick()
  dailySalaryRef.value.open()
}

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

      // 本组数据label
      currentRolesMasksOps.value = res.records?.[0].currentRolesMask?.detailVos?.map((item) => ({
        label: item.classificationName,
        id: item.classificationId,
        dayPricing: item.dayPricing,
        nightPricing: item.nightPricing,
        crossWorkPricing: item.crossWorkPricing,
        hotSellPricing: item.hotSellPricing
      }))
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
  isDialogShow.value = true
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

function handleCommand(btn: StorageSalary.Quality.BtnOption) {
  btnName.value = btn.label || '更多操作'
  currentBtn.value = btn
  btn.option()
}

/** 同步数据 */
async function syncData() {
  if (!queryParams.dataDate) return message.error('请选择日期')
  syncDataLoading.value = true
  loadingText.value = '薪资核算中...'
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

onBeforeMount(async () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  rolesMask.value = salary.currentRolesMask
  queryParams.dataDate = formatDate(yesterday, 'YYYY-MM-DD')
  queryParams.rolesMask = rolesMask.value
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
    width: 8px;
    height: 8px;
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
  border: 0;
  box-shadow: 0px 0px 20px 2px rgba(0, 31, 72, 0.1459);
}

:deep(.el-button-group) {
  display: flex;

  .el-dropdown__caret-button .el-icon-arrow-down {
    display: none;
  }
}

:deep(.el-popper__arrow) {
  display: none;
}

.easyBtn {
  display: flex;
}

.el-dropdown {
  :deep(.el-dropdown-menu) {
    display: flex;
    flex-direction: column;
    align-items: center;

    .el-dropdown-menu__item {
      width: 100%;
      box-sizing: border-box;
    }

    .text-align-center {
      flex: 1;
      text-align: center;
    }
  }

  :deep(.el-button) {
    font-size: 12px;

    &:first-of-type {
      width: 80px;
    }
  }
}

.commonTopFilterWrap-search {
  .el-button {
    // margin-left: 20px;
    margin-right: 0;
  }
}

.popper {
  width: auto !important;
  border: 0;
  box-shadow: 0px 0px 20px 2px rgba(0, 31, 72, 0.1459);
}

.tip-content {
  display: flex;
  width: auto;
}
</style>
