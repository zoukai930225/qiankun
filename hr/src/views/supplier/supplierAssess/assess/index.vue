<template>
  <special-card :show-footer="!!total">
    <el-row>
      <el-col :span="19">
        <el-form label-width="100px">
          <el-row :gutter="24">
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
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="5">
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

    <!-- 数据看板 -->
    <div class="kpi-header mb-20px">
      <div
        v-for="(card, idx) in cards"
        :key="idx"
        class="kpi-card"
        :class="{ active: activeKey === card.key }"
        @click="openCard(card)"
      >
        <div class="kpi-title">{{ CARD_TITLE[idx] }}</div>
        <div class="kpi-value">
          <span class="kpi-value-text">{{ formatValue(card.value) }}</span>
        </div>
        <div class="kpi-img">
          <el-image :src="card.imgUrl" :style="{ width: '38px', height: '38px' }" />
        </div>
      </div>
    </div>

    <sw-table
      border
      :options="assessTable"
      :data="tableData"
      :loading="loading"
      :max-height="520"
      :pick-up="false"
    >
      <template #supplierStatus="{ col }">
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

  <supplier-qty-dialog v-model="supplierQtyProps.modelValue" />

  <completed-quiz-qty-drawer
    v-bind="completedQuizQtyProps"
    v-model:model-value="completedQuizQtyProps.modelValue"
  />
</template>
<script lang="ts" setup>
import {
  supplierAssessmentDataBoardApi,
  supplierAssessmentSupplierPageApi
} from '@/api/supplier/assess'
import { AuditBtn } from '../../changeAudit/option'
import SpecialCard from '../../components/specialCard.vue'
import SwTable from '../../components/table.vue'
import { assessTable } from './option'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
import supplierQtyDialog from './component/supplierQtyDialog.vue'
import completedQuizQtyDrawer from './component/completedQuizQtyDrawer.vue'
import invited from '@/assets/svgs/supplier/assessment/invited.svg'
import hasAssess from '@/assets/svgs/supplier/assessment/hasAssessed.svg'
import hasNotAssess from '@/assets/svgs/supplier/assessment/hasNotAssessed.svg'

defineOptions({ name: 'SupplierAssess' })

enum CARD_SORT {
  supplierQty,
  completedQuizQty,
  unCompletedQuizQty
}

enum QUIZ_SCORE_STATUS {
  unCompletedQuizQty,
  completedQuizQty
}

const CARD_TITLE = ['参与评分供应商', '已完成评分', '未完成评分']
const CARD_IMGURL = [invited, hasAssess, hasNotAssess]

const router = useRouter()

const queryParams = reactive<Supplier.Assess.GetAssessParams>({
  page: 1,
  size: 10
})
const total = ref(0)
const tableData = ref<Supplier.Assess.AssessPage[]>([])
const loading = ref(false)

const codeTypes = {
  abbreviationCompany: { label: '供应商简称', placeholder: '请输入供应商简称' },
  fullCompany: { label: '公司名称', placeholder: '请输入公司名称' }
}
const codeType = ref('abbreviationCompany')
const cards = ref<any[]>([])
const activeKey = ref()
const supplierQtyProps = reactive({
  modelValue: false
})
const completedQuizQtyProps = reactive({
  modelValue: false,
  title: '',
  completedFlag: '0' // 已完成1，未完成0
})

const supplierTypeOption = computed(() => getDictOptions(DICT_TYPE.SUPPLIER_TYPE))

async function getdashboardInfo() {
  try {
    const res = await supplierAssessmentDataBoardApi()
    if (!res) return
    cards.value = Object.keys(res)
      .sort((a, b) => CARD_SORT[a] - CARD_SORT[b])
      .map((key, i) => ({ key, value: res[key], imgUrl: CARD_IMGURL[i] }))
  } catch (error) {}
}

function openCard(card: any) {
  activeKey.value = card.key
  switch (card.key) {
    case 'supplierQty':
      supplierQtyProps.modelValue = true
      break
    case 'completedQuizQty':
    case 'unCompletedQuizQty':
      completedQuizQtyProps.modelValue = true
      completedQuizQtyProps.title = CARD_TITLE[CARD_SORT[card.key]]
      completedQuizQtyProps.completedFlag = QUIZ_SCORE_STATUS[card.key].toString()
      break
  }
}
function formatValue(val: number | string): string {
  const n = Number(val)
  if (!Number.isFinite(n)) return String(val ?? '-')
  return n.toLocaleString()
}

function handleChangeCodeType() {
  let val = ''
  Object.keys(codeTypes).forEach((key) => {
    queryParams[key] && (val = queryParams[key])
    queryParams[key] = ''
  })
  val && getList()
}

/** 计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(() => {
    const hideBtns: AuditBtn[] = [
      new AuditBtn('查看详情', handleCheck, { permission: 'SupplierAssess:Check' })
    ]

    return hideBtns
  })
)

async function getList() {
  loading.value = true
  try {
    const res = await supplierAssessmentSupplierPageApi(queryParams)
    tableData.value = res.records
    total.value = res.total
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
    { page: 1, size: 10 }
  )
  getList()
}

function handleCheck(row: any) {
  router.push({
    name: 'SupplierAssessDetail',
    query: {
      ...row
    }
  })
}

onBeforeMount(() => {
  getList()
  getdashboardInfo()
})

onActivated(() => {
  getList()
})
</script>
<style lang="less" scoped>
@import url('../../index.scss');

:deep(.el-pagination) {
  margin: 0;
  float: none;
}

.kpi-header {
  display: flex;
  gap: 16px;
}

.kpi-card {
  height: 150px;
  cursor: pointer;
  min-width: 220px;
  flex: 1 0 auto;
  padding: 30px;
  border-radius: 8px;
  /* 应用/灰色底色 */
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  /* 应用/边框 */
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
  position: relative;

  .active {
    border: 1px solid #687ff3;
    background: linear-gradient(179deg, #ffffff 3%, #f4f5fc 97%);


    &::after {
      content: '';
      display: block;
      width: 24px;
      height: 3px;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(104, 127, 243, 0.4) 25%,
        rgba(104, 127, 243, 0.4) 78%,
        rgba(255, 255, 255, 0) 100%
      );

      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 10px;
    }
  }

  &.active {
    .active();
  }

  &:active {
    .active();
  }

  &:hover {
    .active();

    border: 1px solid rgba(104, 127, 243, 0.2);
    background: linear-gradient(179deg, #ffffff 3%, #f4f5fc 96%);
    box-shadow: 0 4px 10px 0 #00000020;
  }

  & .kpi-img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    border-radius: 6px;
    background: #eff3ff;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 30px;
  }
}

.kpi-title {
  color: #666;
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 14px;
}

.kpi-value {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #333;
  font-size: 30px;
  font-weight: 500;
  line-height: 42px;

  .unit {
    font-size: 14px;
    color: #666;
  }

  // height: 36px;
}

.kpi-trend {
  color: #a6a6a6;
  font-size: 14px;
}
</style>
