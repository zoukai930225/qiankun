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
              <el-form-item label="考核类型" prop="assessmentType" label-width="auto">
                <el-select
                  v-model="queryParams.assessmentType"
                  placeholder="请选择考核类型"
                  clearable
                  @change="handleQuery"
                >
                  <el-option
                    v-for="item in assessmentTypeOption"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="考核状态" prop="assessmentStatus">
                <el-select
                  v-model="queryParams.assessmentStatus"
                  placeholder="请选择考核状态"
                  clearable
                  @change="handleQuery"
                >
                  <el-option
                    v-for="item in assessmentStatusOps"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建类型" prop="createType">
                <el-select
                  v-model="queryParams.createType"
                  placeholder="请选择创建类型"
                  clearable
                  @change="handleQuery"
                >
                  <el-option
                    v-for="(value, key) in createTypeOption"
                    :key="key"
                    :value="key"
                    :label="value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="考核时间" prop="assessTime">
                <el-date-picker
                  v-model="assessTime"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  range-separator="至"
                  clearable
                  @clear="assessTime = []"
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

    <el-divider class="!m-0" />

    <div class="flex items-center my-16px">
      <div class="fw-500 color-#3d3d3d">供应商考核评分列表</div>
      <el-button
        v-if="permissionSet.has('SupplierAssess:Check:Sync')"
        class="ml-auto"
        type="primary"
        @click="handleSync"
        >同步数据</el-button
      >
    </div>

    <sw-table
      border
      :pick-up="false"
      :options="assessDetailTable"
      :data="tableData"
      :loading="loading"
      :btns-options="btnsOptions"
      @select="handleTableSelected"
    >
      <template #assessmentStatus="{ col }">
        <div class="status" :style="{ color: col?.color, background: col?.bg }">{{
          col?.label
        }}</div>
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

    <el-divider class="!mt-14px !mb-0 !mx--20px !w-[calc(100%+40px)] !border-t-#ebeef5" />

    <template #footer>
      <el-button @click="handleBack">返回</el-button>
    </template>
  </special-card>

  <assessment-user-num-dialog
    v-model="userNumberDialogProp.modelValue"
    :row-data="userNumberDialogProp.rowData"
  />

  <assessment-progress-drawer
    v-bind="progressDrawerProp"
    v-model:model-value="progressDrawerProp.modelValue"
    @refresh="handleQuery"
  />

  <assessment-score-drawer
    v-model:model-value="scoreDrawerProp.modelValue"
    :row-data="scoreDrawerProp.rowData"
    @refresh="getList"
  />
</template>
<script lang="tsx" setup>
import {
  deleteAssessmentApi,
  supplierAssessmentQueryAssessmentApi,
  supplierAssessmentQuizCalculateByIdsApi
} from '@/api/supplier/assess'
import { AuditBtn } from '../../changeAudit/option'
import SpecialCard from '../../components/specialCard.vue'
import SwTable from '../../components/table.vue'
import {
  assessDetailTable,
  assessmentStatusOps,
  assessmentTypeOption,
  createTypeOption,
  statusOps
} from './option'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import AssessmentUserNumDialog from './component/assessmentUserNumDialog.vue'
import AssessmentProgressDrawer from './component/assessmentProgressDrawer.vue'
import AssessmentScoreDrawer from './component/assessmentScoreDrawer.vue'
import { ElLink } from 'element-plus'
import { getPermission } from '@/utils'

defineOptions({ name: 'SupplierAssessDetail' })

const route = useRoute()
const router = useRouter()
const message = useMessage()

const queryParams = reactive<Supplier.Assess.AssessPageDetailRequest>({
  page: 1,
  size: 10,
  supplierId: route.query.supplierId as string,
  dimension: 'month'
})
const total = ref(0)
const tableData = ref<Supplier.Assess.SupplierAssessmentQuizVo[]>([])
const selectedRows = ref<typeof tableData.value>([])
const detailInfo = ref<Supplier.Assess.SupplierAssessmentQuizDto>({})
const loading = ref(false)
// const isMore = ref(false)

const userNumberDialogProp = reactive({
  modelValue: false,
  rowData: {} as Supplier.Assess.SupplierAssessmentQuizVo
})

const progressDrawerProp = reactive({
  modelValue: false,
  rowData: {} as Supplier.Assess.SupplierAssessmentQuizVo,
  editabled: false
})

const scoreDrawerProp = reactive({
  modelValue: false,
  rowData: {} as Supplier.Assess.SupplierAssessmentQuizVo
})

const assessTime = computed({
  get: () => [queryParams.startTime ?? '', queryParams.endTime ?? ''],
  set: (val) => {
    queryParams.startTime = val?.[0]
    queryParams.endTime = val?.[1]
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

const permissionSet = new Set(getPermission())

/** 计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(() => {
    const hideBtns: AuditBtn[] = [
      new AuditBtn('考核进度', handleAssessSchedule, {
        permission: 'SupplierAssess:Check:Progress'
      }),
      new AuditBtn('加减赋分', handleAssessScore, { permission: 'SupplierAssess:Check:Score' }),
      new AuditBtn('删除', handleDelete, {
        type: 'danger',
        permission: 'SupplierAssess:Check:Delete'
      })
    ]

    return hideBtns
  })
)

async function getList() {
  loading.value = true
  try {
    const res = await supplierAssessmentQueryAssessmentApi(queryParams)
    tableData.value = res.quizVoLists?.records ?? []
    total.value = res.quizVoLists?.total ?? 0
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
    { page: 1, size: 10, dimension: 'month', supplierId: route.query.supplierId as string }
  )
  getList()
}

function handleAssessSchedule(row: Supplier.Assess.SupplierAssessmentQuizVo) {
  progressDrawerProp.modelValue = true
  progressDrawerProp.rowData = { ...row }
}

function handleAssessScore(row: Supplier.Assess.SupplierAssessmentQuizVo) {
  scoreDrawerProp.modelValue = true
  scoreDrawerProp.rowData = { ...row }
}

async function handleDelete(row: Supplier.Assess.SupplierAssessmentQuizVo) {
  try {
    await message.confirm('确定删除吗？')

    const res = await deleteAssessmentApi(row.id!)
    if (res.success) {
      message.success('删除成功！')
      getList()
    }
  } catch (error) {}
}

function handleBack() {
  router.push({ name: 'SupplierAssess' })
}

function handleAssessUserNumDialogOpen(row: Supplier.Assess.SupplierAssessmentQuizVo) {
  userNumberDialogProp.modelValue = true
  userNumberDialogProp.rowData = { ...row }
}

const syncLoading = ref(false)
async function handleSync() {
  if (selectedRows.value.length === 0) return message.warning('请选择需要同步的数据')

  const ids = selectedRows.value.map((ele) => ele.id as string).filter((el) => !!el)

  syncLoading.value = true
  try {
    const res = await supplierAssessmentQuizCalculateByIdsApi(ids)
    if (res.success) {
      ElMessage.success({
        message: (
          <p>
            <span>数据已同步，请前往</span>
            <ElLink
              type="primary"
              onClick={() => {
                router.push({ name: 'SupplierAssessData' })
              }}
            >
              考核数据
            </ElLink>
          </p>
        )
      })
      handleQuery()
    }
  } catch (error) {}
}

function handleTableSelected(val: typeof selectedRows.value, item: Supplier.Purchase.ListItem) {
  const selectedMap = new Map(selectedRows.value.map((row) => [row.id, row]))
  const currentMap = new Map(val.map((row) => [row.id, row]))
  if (item) {
    if (!selectedMap.has(item.id) && currentMap.has(item.id)) selectedRows.value.push(item)
    else if (selectedMap.has(item.id) && !currentMap.has(item.id))
      selectedRows.value = selectedRows.value.filter((row) => row.id !== item.id)
  } else {
    if (val.some((row) => !selectedMap.has(row.id))) selectedRows.value.push(...val)
    if (val.every((row) => selectedMap.has(row.id))) {
      const removeItems = tableData.value.filter((row) => !currentMap.has(row.id))
      const removeItemsMap = new Map(removeItems.map((row) => [row.id, row]))
      selectedRows.value = selectedRows.value.filter((row) => !removeItemsMap.has(row.id))
    }
  }

  selectedRows.value = Array.from(new Map(selectedRows.value.map((row) => [row.id, row])).values())
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

:deep(.special-card__footer) {
  padding-top: 14px;
  padding-bottom: 14px;
}
</style>
