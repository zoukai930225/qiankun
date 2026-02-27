<template>
  <special-card :show-footer="!!total">
    <el-row>
      <el-col :span="20">
        <el-form label-width="97">
          <el-row :gutter="0">
            <el-col :span="6">
              <el-form-item :prop="codeType" label-width="0">
                <el-input
                  v-model.trim="queryParams[codeType]"
                  :placeholder="codeTypes[codeType].placeholder"
                  clearable
                  @keydown.enter="handleQuery"
                  @clear="handleQuery"
                >
                  <template #prepend>
                    <el-select v-model="codeType" @change="handleChangeCodeType">
                      <el-option
                        v-for="(value, key) in codeTypes"
                        :key="key"
                        :value="key"
                        :label="value.label"
                      />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商类型" prop="supplierType">
                <el-select
                  v-model="queryParams.supplierType"
                  placeholder="请选择供应商类型"
                  clearable
                  @change="handleQuery"
                >
                  <el-option
                    v-for="item in supplierTypeOption"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="考核期" prop="period">
                <select-month
                  v-model="queryParams.period"
                  placeholder="请选择考核期"
                  :clearable="false"
                  @change="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col v-show="isMore" :span="6">
              <el-form-item label="等级" prop="grade">
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
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  range-separator="至"
                  @change="handleQuery"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="4">
        <div class="flex justify-end">
          <!-- <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button> -->
          <el-button @click="resetQuery" class="commonResetBtn" >
            重置
          </el-button>
          <el-button @click="handleExport" type="primary" >
            导出
          </el-button>
        </div>
      </el-col>
    </el-row>

    <sw-table :options="assessDataTable" :data="tableData" :loading="loading" border>
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

      <template #supplierStatus="{ col }">
        <div class="status" :style="{ color: col?.color, background: col?.bg }">{{
          col?.label
        }}</div>
      </template>
    </sw-table>

    <template #footer>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </template>
  </special-card>

  <score-detail :row-data="scoreDetailProps.rowData" v-model="scoreDetailProps.modelValue" />
</template>
<script lang="ts" setup>
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
import SpecialCard from '../../components/specialCard.vue'
import { supplierAssessmentDataPageQueryApi, supplierGradePageApi } from '@/api/supplier/assess'
import { assessDataTable } from './option'
import { AuditBtn } from '../../changeAudit/option'
import SwTable from '../../components/table.vue'
import SelectMonth from '@/views/supplier/components/selectMonth.vue'
import ScoreDetail from './components/scoreDetail.vue'
import { toReactive } from '@vueuse/core'
import { formatDate } from '@/utils/formatTime'
import request from '@/config/axios';
import download from '@/utils/download'

defineOptions({ name: 'SupplierAssessData' })

const router = useRouter()

const queryParams = reactive<Supplier.Assess.AssessDataPageRequest>({
  page: 1,
  size: 10,
  dimension: 'month'
})
const loading = ref(false)
const total = ref(0)
const tableData = ref<Supplier.Assess.SupplierAssessmentDataDto[]>([])

const codeTypes = {
  abbreviationCompany: { label: '供应商简称', placeholder: '请输入供应商简称' },
  fullCompany: { label: '公司名称', placeholder: '请输入公司名称' }
}
const codeType = ref('abbreviationCompany')
const isMore = ref(false)
const scoreDetailProps = reactive({
  rowData: {} as Supplier.Assess.SupplierAssessmentDataDto,
  modelValue: false
})

/** 计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(() => {
    const hideBtns: AuditBtn[] = [
      new AuditBtn('分数明细', handleScoreDetail, { permission: 'SupplierAssessData:ScoreDetail' }),
      new AuditBtn('查看详情', handleCheck, { permission: 'SupplierAssessData:Check' })
    ]

    return toReactive(hideBtns)
  })
)

const syncTime = computed({
  get: () => [queryParams.syncStartTime ?? '', queryParams.syncEndTime ?? ''],
  set: (val) => {
    queryParams.syncStartTime = val?.[0] ?? null
    queryParams.syncEndTime = val?.[1] ?? null
  }
})

const supplierTypeOption = computed(() => getDictOptions(DICT_TYPE.SUPPLIER_TYPE))
// const supplierStatusOption = computed(() => getDictOptions(DICT_TYPE.SUPPLIER_STATUS))

function handleScoreDetail(row: any) {
  scoreDetailProps.modelValue = true
  scoreDetailProps.rowData = { ...row }
}

function handleCheck(row: any) {
  router.push({
    name: 'SupplierAssessDataDetail',
    query: {
      ...row
    }
  })
}

function handleChangeCodeType() {
  let val = ''
  Object.keys(codeTypes).forEach((key) => {
    queryParams[key] && (val = queryParams[key])
    queryParams[key] = ''
  })
  val && getList()
}

// 导出
async function handleExport() {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '数据导出中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    const { page, size, ...rest } = queryParams
    const params = {...rest}
    const res = await request.downloadPost({
      url: '/api/supplierAssessmentData/export',
      data: params
    })
    if(res) {
      download.excel(res, `供应商考核问卷导出--${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`)
    }
  } catch (error) {
  } finally {
    loadingInstance.close()
  }
}

async function getList() {
  loading.value = true
  try {
    const res = await supplierAssessmentDataPageQueryApi(queryParams)
    tableData.value = res.records ?? []
    total.value = res.total ?? 0
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
  const today = new Date()
  // 重置当前的day为1，避免直接setMonth的31号溢出
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  // queryParams.period = formatDate(lastMonthDate, 'YYYY年MM月')
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, ''])),
    { page: 1, size: 10, dimension: 'month',period:formatDate(lastMonthDate, 'YYYY年MM月') }
  )
  getList()
}

onBeforeMount(() => {
  const today = new Date()
  // 重置当前的day为1，避免直接setMonth的31号溢出
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  queryParams.period = formatDate(lastMonthDate, 'YYYY年MM月')
  getList()
})

onActivated(() => {
  getList()
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);

:deep(.el-input__wrapper) {
  height: 30px;
  box-sizing: border-box;
}

:deep(.el-pagination) {
  margin: 0;
  float: none;
}

:deep(.el-input-group--prepend) {
  width: 100%;
}
</style>
