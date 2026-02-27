<template>
  <special-card>
    <div class="specialCard-title">
      <span
        v-for="({ label, text, color }, index) in TITLE_CONTENT"
        :key="label"
        class="color-#333 font-size-14px"
        :style="{ color }"
      >
        <i class="color-#666">{{ label }}</i
        >{{ text }}<i v-if="index !== TITLE_CONTENT.length - 1" class="mx-6px">/</i>
      </span>
    </div>

    <el-row>
      <el-col :span="20">
        <el-form label-width="97px">
          <el-row :gutter="0">
            <el-col :span="6">
              <el-form-item label="考核期：" prop="period">
                <select-month
                  v-model="queryParams.period"
                  placeholder="请选择考核期"
                  @change="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="等级：" prop="grade">
                <scroll-select
                  v-model="queryParams.grade"
                  item-label-key="grade"
                  item-value-key="grade"
                  select-key="grade"
                  :multiple="false"
                  clearable
                  :api="supplierGradePageApi"
                  @change="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="同步时间" prop="syncStartTime">
                <el-date-picker
                  v-model="syncTime"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  range-separator="至"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="handleQuery"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="4">
        <div class="flex justify-end">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
            重置
          </el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 
    <el-tabs v-model="queryParams.dimension" @tab-change="handleQuery">
      <el-tab-pane
        v-for="item in getDictOptions(DICT_TYPE.SUPPLIER_ASSESSMENT_DIMENSION)"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      >
        <template #label>
          <span class="flex w-64px items-center justify-center">{{ item.label }}</span>
        </template>
      </el-tab-pane>
    </el-tabs> -->

    <sw-table :options="assessDataDetailTable" :data="tableData" :loading="loading" border>
      <template #assessmentStatus="{ col }">
        <div class="status" :style="{ color: col?.color, background: col?.bg }">{{
          col?.label
        }}</div>
      </template>
      <template #options="{ row, index }">
        <s-w-table-btns
          ref="swTableBtnsRef"
          :row="row"
          :options="btnsOptions[index] || []"
          :row-index="index"
        />
      </template>

      <template #supplierType="{ col }">
        {{ getDictLabel(DICT_TYPE.SUPPLIER_TYPE, col) }}
      </template>

      <template #assessmentUserNum="{ col, row }">
        <el-button
          link
          type="primary"
          :disabled="!col"
          @click="handleAssessUserNumDialogOpen(row)"
          >{{ col }}</el-button
        >
      </template>
    </sw-table>

    <div class="mt-20px flex justify-end">
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>

    <template #footer>
      <el-button @click="handleBack">返回</el-button>
    </template>
  </special-card>

  <assessment-score-drawer
    v-model:model-value="scoreDrawerProp.modelValue"
    :row-data="scoreDrawerProp.rowData"
  />
</template>
<script lang="ts" setup>
import {
  supplierAssessmentDataQueryAssessmentDataApi,
  supplierGradePageApi
} from '@/api/supplier/assess'
import { AuditBtn } from '../../changeAudit/option'
import SpecialCard from '../../components/specialCard.vue'
import SwTable from '../../components/table.vue'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import AssessmentScoreDrawer from './components/scoreDetail.vue'
import { statusOps } from '../assess/option'
import { assessDataDetailTable } from './option'
import { toReactive } from '@vueuse/core'
import SelectMonth from '@/views/supplier/components/selectMonth.vue'

defineOptions({ name: 'SupplierAssessDataDetail' })

const route = useRoute()
const router = useRouter()

const queryParams = reactive<Supplier.Assess.AssessPageDetailRequest>({
  page: 1,
  size: 10,
  supplierId: route.query.supplierId as string,
  dimension: 'month'
})
const total = ref(0)
const tableData = ref<Supplier.Assess.SupplierAssessmentQuizVo[]>([])
const detailInfo = ref<Supplier.Assess.SupplierAssessmentQuizDto>()
const loading = ref(false)

const userNumberDialogProp = reactive({
  modelValue: false,
  rowData: {} as Supplier.Assess.SupplierAssessmentQuizVo
})

const scoreDrawerProp = reactive({
  modelValue: false,
  rowData: {} as Supplier.Assess.SupplierAssessmentQuizVo
})

const syncTime = computed({
  get: () => [queryParams.syncStartTime ?? '', queryParams.syncEndTime ?? ''],
  set: (val) => {
    queryParams.syncStartTime = val?.[0] ?? null
    queryParams.syncEndTime = val?.[1] ?? null
  }
})

const TITLE_CONTENT = computed(() => [
  { label: '供应商简称：', text: detailInfo.value?.abbreviationCompany || '--' },
  { label: '公司名称：', text: detailInfo.value?.fullCompany || '--' },
  {
    label: '供应商类型：',
    text: getDictLabel(DICT_TYPE.SUPPLIER_TYPE, detailInfo.value?.supplierType) || '--'
  },
  {
    label: '供应商状态：',
    text: getDictLabel(DICT_TYPE.SUPPLIER_STATUS, detailInfo.value?.supplierStatus) || '--',
    color: statusOps.find((item) => item.value === detailInfo.value?.supplierStatus)?.color
  }
])

/** 计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(() => {
    const hideBtns: AuditBtn[] = [
      new AuditBtn('分数明细', handleScoreDetail, {
        permission: 'SupplierAssessData:Check:ScoreDetail'
      })
    ]

    return toReactive(hideBtns)
  })
)

function handleScoreDetail(row: any) {
  scoreDrawerProp.modelValue = true
  scoreDrawerProp.rowData = { ...row }
}

async function getList() {
  loading.value = true
  try {
    const res = await supplierAssessmentDataQueryAssessmentDataApi(queryParams)
    tableData.value = res.dataQuizVo?.records ?? []
    total.value = res.dataQuizVo?.total ?? 0
    detailInfo.value = { ...res }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.page = 1
  getList()
}

function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, ''])),
    { page: 1, size: 10, supplierId: route.query.supplierId, dimension: 'month' }
  )
  getList()
}

function handleBack() {
  router.push({ name: 'SupplierAssessData' })
}

function handleAssessUserNumDialogOpen(row: Supplier.Assess.SupplierAssessmentQuizVo) {
  userNumberDialogProp.modelValue = true
  userNumberDialogProp.rowData = { ...row }
}

onBeforeMount(() => {
  getList()
})

onActivated(() => {
  getList()
})
</script>
<style lang="less" scoped>
@import url('../../index.scss');

:deep(.el-input__wrapper) {
  height: 30px;
  box-sizing: border-box;
}

:deep(.el-pagination) {
  margin: 0;
  float: none;
}

:deep(.el-tabs__item) {
  padding-left: 16px;
  padding-right: 16px;
}
</style>
