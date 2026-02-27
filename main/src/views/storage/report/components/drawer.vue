<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="isShow"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="60%"
      :before-close="handleBeforClose"
      @close="handleClose"
    >
      <div>
        <div class="drawerTitle">
          <div>{{ title }}</div>
          <div @click="handleClose">
            <el-icon><CloseBold /></el-icon>
          </div>
        </div>
      </div>
      <el-card shadow="never">
        <el-form :model="fillData" ref="reportDateRef" inline :rules="rules">
          <el-form-item label="填报日期" class="datePicker" required prop="reportDate">
            <el-date-picker
              v-model="fillData.reportDate"
              type="date"
              value-format="YYYY-MM-DD"
              :disabled="type === 1 || type === 2"
              :disabled-date="disableDate"
              clearable
              placeholder="请输入填报日期"
              @blur="submitFillDate"
            />
          </el-form-item>
        </el-form>
      </el-card>
      <div class="content">
        <Cell
          v-for="(item, index) in allData"
          :key="index"
          v-model:data="item.data"
          :title="item.typeName"
          :type="item.type"
          :page-type="type"
          :row-data="rowData"
          :id="rowData?.id || ''"
          @refresh="getDetail"
          @validate-daily-report-id="validateDate"
        />
      </div>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { getDailyReport, getDailyReportForAddOrEdit, getReportIdByDate } from '@/api/storage/report'

const Cell = defineAsyncComponent(() => import('./cell.vue'))

const message = useMessage()

const props = defineProps<{
  isShow: boolean
  rowData?: StorageType.ReportListItem
  title: string
  type?: 1 | 2
}>()

const emit = defineEmits(['handelClose', 'refresh'])

const isShow = computed({
  get: () => props.isShow,
  set: (val) => {
    fillData.reportDate = ''
    emit('handelClose', val)
  }
})

const allData = ref<StorageType.DailyReportDetailItem[]>([])
const fillData = reactive<StorageType.AddReportParams>({
  reportDate: ''
})
const rules = {
  reportDate: [
    {
      required: true,
      message: '请选择填报日期',
      trigger: 'blur'
    }
  ]
}
const reportDateRef = ref()

// 关闭抽屉
async function handleClose() {
  isShow.value = false
}

// 关闭前
async function handleBeforClose(done: () => void) {
  if (allData.value.find((item) => item.data.find((el) => el.isAdd || el.isEdit))) {
    await message.confirm('当前页面还有未保存的数据，确认关闭吗？')
    done()
  } else {
    done()
  }
}

// 日期禁用
function disableDate(date: any) {
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  currentDate.setDate(currentDay)

  return date > currentDate
}

// 提交日期
async function submitFillDate(val) {
  try {
    await reportDateRef.value.validate()
    const res = await getReportIdByDate({
      id: props.rowData?.id,
      ...fillData
    })
    if (res) {
      emit('refresh', res.id)
      message.success('新增日报成功')
    } else {
      message.error('新增日报失败')
    }
  } catch (error) {}
}

// 获取日报详情
async function getDetail() {
  allData.value = []
  // 根据页面类型选择获取明细的接口
  const api = props.type === 1 ? getDailyReport : getDailyReportForAddOrEdit

  try {
    const res = await api({ id: props.rowData?.id || '' })
    if (res) {
      allData.value = res.data
      fillData.reportDate = res.reportDate || ''
    }
  } catch (error) {}
}

async function validateDate() {
  reportDateRef.value.validate()
}

onMounted(() => {
  getDetail()
})
</script>

<style lang="less" scoped>
:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;
}
.drawer-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 16px;
}

// 尺码范围
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #fae8d066;
  border-radius: 15px;
}
:deep(.el-upload-list__item) {
  width: 110px;
  height: 110px;
}

:deep(.el-upload-list--text) {
  display: flex;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}
// 修改表单label的行高
:deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}
// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}
.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
  &-title {
    margin: 0 0 18px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }
  .tips {
    margin: 0 0 16px 80px;
    color: #2693f8;
    font-size: 14px;
    &-important {
      color: #eb3737;
    }
    img {
      width: 12px;
    }
  }

  &-disabledInput {
    width: 340px;
    padding: 0 16px;
    min-height: 32px;
    box-sizing: border-box;
    background-image: url(@/assets/imgs/common/input_disabled.png);
    background-repeat: no-repeat;
  }
  .disabledInput_cover {
    background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    width: 100%;
  }
  .disabledInput_remark {
    background-image: url(@/assets/imgs/common/input_disabled_remark.png);
    width: 100%;
    min-height: 92px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
:deep(.el-link__inner) {
  padding-left: 11px;
}
:deep(.el-card) {
  margin-bottom: 24px;
  .el-card__body {
    box-sizing: border-box;
  }
}
:deep(.el-form) {
  display: flex;
  .el-form-item {
    flex: 1;
    margin-right: 0;
    margin-bottom: 0;
  }
  .el-form-item__error {
    margin-left: 0;
  }
  .datePicker {
    flex: 0.5;
  }
}
:deep(.el-card) {
  border-radius: 12px;
}
.content {
  flex: 1px;
  overflow: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 3px; /* 垂直滚动条宽度 */
    height: 10px; /* 水平滚动条高度 */
  }

  /* 滚动条轨道 */
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 5px;
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    background-color: #cacaca;
    border-radius: 5px;
  }

  /* 滚动条滑块悬停状态 */
  &::-webkit-scrollbar-thumb:hover {
    background-color: #e2e2e2;
  }

  /* 滚动条箭头 */
  &::-webkit-scrollbar-button {
    display: none; /* 隐藏箭头 */
  }
}
</style>
