<template>
  <div class="page-details">
    <el-drawer
      v-model="visible"
      v-if="visible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      :size="936"
      @closed="close"
      :append-to-body="false"
      :before-close="handleBeforeClose"
    >
      <div>
        <div class="drawerTitle">
          <div>数据看板</div>
          <div @click="close">
            <el-icon>
              <CloseBold />
            </el-icon>
          </div>
        </div>
      </div>
      <el-card shadow="never" class="contain_view">
        <el-form :model="searchValue" label-width="auto" inline>
          <el-form-item label="部门" v-if="!!userInfo.isManagement" prop="firstDepartIds">
            <el-cascader
              v-model="searchValue.firstDepartIds"
              :options="options"
              placeholder="请选择部门"
              :props="casProps"
              :show-all-levels="false"
              collapse-tags
              collapse-tags-tooltip
              @change="getDataList()"
            ></el-cascader>
          </el-form-item>
          <!-- <el-form-item label="部门名称" v-if="!!userInfo.isHrbp" prop="departName">
            <el-input
              v-model="searchValue.departName"
              placeholder="请输入部门名称"
              @blur="getDataList()"
            ></el-input>
          </el-form-item> -->
          <el-form-item label="考核周期" prop="khzq">
            <el-date-picker
              v-model="searchValue.khzq"
              :placeholder="`请选择考核周期`"
              type="month"
              valueFormat="YYYY-MM"
              format="YYYY-MM"
              :clearable="false"
              style="width: 220px"
              @change="getDataList()"
              :disabledDate="(time: Date) => time.getTime() > new Date(dayjs().add(-1, 'month').format('YYYY-MM')).getTime()"
            />
          </el-form-item>
          <el-form-item label="" style="float: right">
            <el-button @click="reSetData">重置</el-button>
            <el-button type="primary" @click="exportData">导出</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          ref="tableRef"
          style="margin: 10px 10px 0 0; width: calc(100% - 10px)"
          :header-cell-style="tableRowClassName"
          :cell-style="cellStyle"
        >
          <el-table-column prop="level" label="">
            <el-table-column prop="name" :label="sumValue?.name || ''" />
          </el-table-column>
          <el-table-column label="能力">
            <template #header>
              <div style="text-align: center">
                <span>能力</span>
                <el-popover content="人数/部门占比" placement="top" effect="dark">
                  <template #reference>
                    <img :src="tips" alt="" class="tips" />
                  </template>
                </el-popover>
              </div>
            </template>
            <el-table-column prop="nlzs" :label="String(sumValue?.nlzs || 0)" class-name="border" />
            <el-table-column
              prop="nl"
              :label="String(`${sumValue?.nl || 0}%`)"
              class-name="border"
              :formatter="(row: any) => `${row.nl}%`"
            />
          </el-table-column>
          <el-table-column label="潜力">
            <template #header>
              <div style="text-align: center">
                <span>潜力</span>
                <el-popover content="人数/部门占比" placement="top" effect="dark">
                  <template #reference>
                    <img :src="tips" alt="" class="tips" />
                  </template>
                </el-popover>
              </div>
            </template>
            <el-table-column prop="qlzs" :label="String(sumValue?.qlzs || 0)" class-name="border" />
            <el-table-column
              prop="ql"
              :label="String(`${sumValue?.ql || 0}%`)"
              class-name="border"
              :formatter="(row: any) => `${row.ql}%`"
            />
          </el-table-column>
          <el-table-column label="价值观">
            <template #header>
              <div style="text-align: center">
                <span>价值观</span>
                <el-popover content="人数/部门占比" placement="top" effect="dark">
                  <template #reference>
                    <img :src="tips" alt="" class="tips" />
                  </template>
                </el-popover>
              </div>
            </template>
            <el-table-column
              prop="jzgzs"
              :label="String(sumValue?.jzgzs || 0)"
              class-name="border"
            />
            <el-table-column
              prop="jzg"
              :label="String(`${sumValue?.jzg || 0}%`)"
              class-name="border"
              :formatter="(row: any) => `${row.jzg}%`"
            />
          </el-table-column>
          <el-table-column label="团队中价值">
            <template #header>
              <div style="text-align: center">
                <span>团队中价值</span>
                <el-popover content="人数/部门占比" placement="top" effect="dark">
                  <template #reference>
                    <img :src="tips" alt="" class="tips" />
                  </template>
                </el-popover>
              </div>
            </template>
            <el-table-column
              prop="tdzjzzs"
              :label="String(sumValue?.tdzjzzs || 0)"
              class-name="border"
            />
            <el-table-column
              prop="tdzjz"
              :label="String(`${sumValue?.tdzjz || 0}%`)"
              class-name="border"
              :formatter="(row: any) => `${row.tdzjz}%`"
            />
          </el-table-column>
          <template #empty>
            <img class="mt30px" src="@/assets/imgs/empty/empty1.png" alt="" />
            <div class="mb24px">暂无相关内容</div>
          </template>
        </el-table>
      </el-card>
      <el-card shadow="never" class="contain_view custom" style="margin-top: 20px">
        <el-tabs v-model="tabName" @click="onTabClick">
          <el-tab-pane label="月度考评" name="ydkp"> </el-tab-pane>
          <el-tab-pane label="人才标签" name="rcbq"> </el-tab-pane>
        </el-tabs>
        <month-chart
          v-if="tabName === 'ydkp'"
          ref="monthChartRef"
          width="890px"
          height="300px"
          :model-type="true"
          @echart-click="echartClick"
        ></month-chart>
        <talent-chart
          v-if="tabName === 'rcbq'"
          ref="talentChartRef"
          width="890px"
          height="300px"
          :model-type="true"
          @echart-click="echartClick"
        ></talent-chart>
      </el-card>
    </el-drawer>

    <record-dialog ref="recordDialogRef"></record-dialog>
  </div>
</template>

<script lang="tsx">
export default { name: 'MonthAssessmentBoard' }
</script>

<script lang="tsx" setup>
import tips from '@/assets/svgs/common/tips.svg'
import { formatDate } from '@/utils/formatTime'
import { exportToPdf } from '@/utils/pdf'
import request from '@/config/axios'
import { debounce } from 'lodash-es'
import dayjs from 'dayjs'
import MonthChart from './monthChart.vue'
import TalentChart from './talentChart.vue'
import RecordDialog from './recordDialog.vue'
const visible = ref(false)
const casProps = {
  label: 'name',
  value: 'id',
  children: 'children',
  checkStrictly: false,
  multiple: true
}
const props = defineProps({
  options: { type: Array<any>, default: () => [] },
  userInfo: { type: Object, default: () => {} }
})

const searchValue = ref<any>({ khzq: dayjs().add(-1, 'month').format('YYYY-MM'), departName: null })

const tableData = ref<any>([]),
  sumValue = ref<any>({}),
  tableRef = ref(),
  rcbqData = ref([])

const reSetData = () => {
  searchValue.value = { khzq: dayjs().add(-1, 'month').format('YYYY-MM') }
  getDataList()
}

const getDataList = debounce((bol: boolean = false) => {
  const loading = ElLoading.service({ fullscreen: true, text: '数据加载中......' })
  const query = { ...searchValue.value }
  if (query.firstDepartIds) {
    const firstDepartIds = query.firstDepartIds.map((item: any) => item[item.length - 1]).join()
    query.firstDepartIds = firstDepartIds ? firstDepartIds.split(',') : null
  }
  request
    .post({ url: `/api/employeeMonthlyAssessment/dataBoard`, data: query })
    .then((res: any) => {
      if (res?.ydkh?.length) {
        const sum: any = res.ydkh.find((rs: any) => rs.name === '汇总')
        sumValue.value = { ...sum }
        tableData.value = [...res.ydkh].filter((rs: any) => rs.name !== '汇总')
      }
      if (res?.rcbq?.length) {
        rcbqData.value = [...res.rcbq]
      }
    })
    .finally(() => {
      loading && loading.close()
      bol && (visible.value = true)
      initCharts()
    })
}, 1000)

const openDrawer = () => {
  searchValue.value = { khzq: dayjs().add(-1, 'month').format('YYYY-MM'), departName: null }
  tabName.value = 'ydkp'
  getDataList(true)
}

const close = () => {
  handleBeforeClose(() => {
    visible.value = false
  })
}

const closed = () => {
  visible.value = false
}

const tableRowClassName = ({ rowIndex }) => {
  return { backgroundColor: !!rowIndex ? '#E9EBEF' : '#fff', color: '#333', fontSize: '14px' }
}

const cellStyle = (data: any) => {
  return [2, 4, 6].includes(data.columnIndex)
    ? {
        background: `linear-gradient(to right, #D9E8FF ${data.row[data.column.property] || 0}%, #fff ${data.row[data.column.property] || 0}%)`
      }
    : { backgroundColor: '#fff' }
}

const handleBeforeClose = (done) => {
  done()
}

const exportData = () => {
  const targetDom = tableRef.value.$el
  if (!targetDom) {
    ElMessage.error('未找到打印内容区域')
    return
  }
  exportToPdf(
    targetDom,
    `月度考核数据看板_${formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')}`,
    {},
    {
      width: targetDom.scrollWidth,
      height: targetDom.scrollHeight + 10,
      windowWidth: targetDom.scrollWidth
    }
  )
}

const tabName = ref('ydkp')
const monthChartRef = ref()
const talentChartRef = ref()
const initCharts = () => {
  nextTick(() => {
    if (tabName.value === 'ydkp') {
      monthChartRef?.value?.setChartOptions(tableData.value)
    } else {
      talentChartRef?.value?.setChartOptions(rcbqData.value)
    }
  })
}

const onTabClick = (e) => {
  nextTick(() => {
    if (tabName.value === 'ydkp') {
      monthChartRef?.value?.setChartOptions(tableData.value)
    } else {
      talentChartRef?.value?.setChartOptions(rcbqData.value)
    }
  })
}

const recordDialogRef = ref()
const echartClick = (e: any) => {
  recordDialogRef?.value?.openView(e, 'view', searchValue.value)
}

defineExpose({ openDrawer, close, closed })
</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';

.tips {
  cursor: pointer;
  display: inline-block;
  margin-left: 5px;
}

.border {
  background-color: #e9ebef !important;
}

:deep() {
  .el-drawer__body {
    background-color: #f8f8f9 !important;
  }

  .el-form-item__label {
    color: #666 !important;
  }
}

.contain_view {
  // height: calc(100% - 40px);
  border: 0;
  :deep() {
    .el-card__header {
      padding: 10px;
    }

    .el-form-item {
      margin: 0 12px 12px 0 !important;
    }
  }
  &.custom {
    :deep() {
      .el-card__body {
        padding: 0 0 12px 0;
        .el-tabs__nav-wrap {
          padding: 0 10px 0 12px;
          &::after {
            height: 1px;
          }
        }
      }
    }
  }
}

.drawer {
  .el-drawer__header {
    margin-bottom: 0;

    .el-drawer__title {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      font-style: normal;
    }
  }
}
</style>
