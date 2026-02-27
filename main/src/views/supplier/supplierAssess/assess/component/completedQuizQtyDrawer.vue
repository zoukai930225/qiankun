<template>
  <s-w-drawer
    :model-value="modelValue"
    :title="title"
    width="1000"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <el-card v-show="!isDetail" class="!border-0" shadow="never">
      <el-row>
        <el-col :span="23" class="!flex-1 mr-30px">
          <el-form :model="queryParams">
            <div class="flex">
              <el-form-item :prop="codeType" label-width="0">
                <el-input
                  v-model.trim="queryParams[codeType]"
                  :placeholder="codeTypes[codeType].placeholder"
                  clearable
                  class="!w-264px"
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
              <el-form-item label="考核期" prop="period" class="ml-20px">
                <select-month
                  :style="{ width: '210px' }"
                  v-model="queryParams.period"
                  placeholder="请选择考核期"
                  @change="handleQuery"
                />
              </el-form-item>
              <el-form-item
                v-if="completedFlag === '0'"
                label="状态"
                prop="quizScoreStatus"
                class="ml-20px"
              >
                <el-select
                  v-model="queryParams.quizScoreStatus"
                  :style="{ width: '210px' }"
                  placeholder="请选择"
                  clearable
                  @change="handleQuery"
                >
                  <el-option v-for="item in quizScoreStatus" v-bind="item" :key="item.value" />
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
        <el-col :span="1" class="!flex justify-end !min-w-[min-content]">
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
            重置
          </el-button>
          <!-- <el-button
            type="primary"
            class="mb-16px"
            :loading="quickRingLoading"
            v-if="completedFlag === '0'"
            @click="handleFeiShu"
          >
            <img
              v-if="!quickRingLoading"
              src="@/assets/svgs/supplier/bell.svg"
              class="mr-6px"
              alt=""
            />
            一键提醒
          </el-button> -->
        </el-col>
      </el-row>

      <special-table
        border
        :loading="loading"
        :data="tableData"
        :options="completedQuizQtyTable"
        :span-method="spanMethod"
        :btns-options="btnsOptions"
        :loading-btns="['提醒评分']"
        :pick-up="false"
      />

      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </el-card>

    <assessment-progress-content
      v-show="isDetail"
      ref="detailRef"
      v-bind="{ ...props, ...assessmentContentProp }"
    >
      <template #preContent>
        <el-button type="primary" link class="mb-20px" @click="isDetail = false">
          <Icon icon="ep:arrow-left" />
          <span>返回</span>
        </el-button>
      </template>
    </assessment-progress-content>

    <template #footer>
      <el-button @click="handleClosed">关闭</el-button>
      <el-button type="primary" v-if="isAnyAssessPerson" @click="handleSubmit">保存</el-button>
    </template>
  </s-w-drawer>
</template>
<script lang="ts" setup>
import SelectMonth from '@/views/supplier/components/selectMonth.vue'
import {
  // sendQuizNotifyCardAllApi,
  sendQuizNotifyCardApi,
  supplierAssessmentCompletedPageApi,
  supplierAssessmentSaveQuiz
} from '@/api/supplier/assess'
import specialTable from '@/views/supplier/components/table.vue'
import { completedQuizQtyTable, quizScoreStatus } from '../option'
import { AuditBtn } from '@/views/supplier/changeAudit/option'
import assessmentProgressContent from './assessmentProgressContent.vue'

const message = useMessage()

const props = defineProps<{
  modelValue: boolean
  title: string
  completedFlag?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', v: boolean): void
}>()

const queryParams = reactive<Record<string, any>>({
  page: 1,
  size: 10
})
const total = ref(0)
const tableData = ref<any[]>([])
const codeTypes = {
  abbreviationCompany: { label: '供应商简称', placeholder: '请输入供应商简称' },
  fullCompany: { label: '公司名称', placeholder: '请输入公司名称' }
}
const codeType = ref('abbreviationCompany')
const timer = ref<NodeJS.Timeout>()
const loading = ref(false)
const assessmentContentProp = reactive({
  rowData: {} as any,
  isInTime: false
})
const isDetail = ref(false)
const detailRef = ref<InstanceType<typeof assessmentProgressContent>>()

/** 计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(() => {
    const hideBtns: AuditBtn[] = [new AuditBtn('查看详情', handleCheck)]

    if (props.completedFlag === '0') hideBtns.push(new AuditBtn('提醒评分', handleRing))
    return hideBtns
  })
)

// 判断当前用户是不是当前考核模块的审核人
function isAssessPerson(progressItem: Supplier.Assess.SupplierAssessmentQuizDetailDto) {
  return progressItem.ratable
}

// 判断当前用户是不是任一模块的考核人
const isAnyAssessPerson = computed(() => {
  const res =
    detailRef.value?.progressInfo.flat().some((progress) => isAssessPerson(progress)) &&
    isDetail.value
  return res
})

async function getList() {
  loading.value = true

  if (timer.value) clearTimeout(timer.value)

  timer.value = setTimeout(async function () {
    try {
      const res = await supplierAssessmentCompletedPageApi({
        ...queryParams,
        completedFlag: props.completedFlag,
        quizScoreStatus: props.completedFlag === '1' ? '2' : queryParams.quizScoreStatus
      })
      if (!res) return
      spanArr.value = []
      tableData.value = formatTable(res.records)
      total.value = res.total
    } catch (error) {
      console.log('获取列表失败：', error)
    } finally {
      loading.value = false
    }
  }, 500)
}

function handleQuery() {
  queryParams.page = 1
  getList()
}

function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { page: 1, size: 10 }
  )
  getList()
}
function formatTable(data: any[]): any[] {
  const result: any[] = data.flatMap((item) => {
    return item.quizDetailVos.map((ele) => ({ ...item, ...ele }))
  })

  return result
}
function handleOpen() {
  handleQuery()
}
function handleClosed() {
  emit('update:model-value', false)

  tableData.value = []
  total.value = 0
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { page: 1, size: 10 }
  )
  isDetail.value = false
}

function handleChangeCodeType() {
  let val = ''
  Object.keys(codeTypes).forEach((key) => {
    queryParams[key] && (val = queryParams[key])
    queryParams[key] = ''
  })
  val && getList()
}

/** 列表合并规则 */
function spanMethod({ rowIndex, column }): [number, number] {
  if (spanArr.value.length === 0) spanArr.value = calculateSpan()
  if (
    ['assessmentModuleName', 'quizScoreStatus', 'assessmentUser', 'assessmentModuleScore'].includes(
      column.rawColumnKey
    )
  )
    return [1, 1]
  return spanArr.value[rowIndex]
}

const spanArr = ref<[number, number][]>([]) // 通过清空spanArr可以重置合并规则
function calculateSpan(): typeof spanArr.value {
  const result: typeof spanArr.value = []
  let count = 1,
    index = 1
  tableData.value.forEach((row, i) => {
    if (
      i < tableData.value.length - 1 &&
      tableData.value[i].quizId === tableData.value[i + 1].quizId
    ) {
      count++
      row.index = index
    } else {
      result.push([count, 1])
      for (let index = 1; index < count; index++) {
        result.push([0, 0])
      }
      row.index = index
      index++
      count = 1
    }
  })
  return result
}

function handleCheck(row) {
  assessmentContentProp.rowData = { ...row }
  assessmentContentProp.isInTime =
    +new Date(row.startTime) <= Date.now() && +new Date(row.endTime) >= Date.now()

  isDetail.value = true
  nextTick(() => {
    detailRef.value?.getDetail()
  })
}

async function handleSubmit() {
  await detailRef.value?.validate()

  try {
    const res = await supplierAssessmentSaveQuiz({
      ...assessmentContentProp.rowData,
      detailList: detailRef.value?.progressInfo.flat().flat()
    })

    if (!res.success) return
    message.success('保存成功！')
    isDetail.value = false
    getList()
  } catch (error) {}
}

async function handleRing(row) {
  try {
    const res = await sendQuizNotifyCardApi({
      notifyAll: true,
      quizId: row.quizId
    })

    if (res.success) {
      message.success('提醒成功！')
    }
  } catch (error) {}
}

// const quickRingLoading = ref(false)
// async function handleFeiShu() {
//   try {
//     quickRingLoading.value = true
//     const res = await sendQuizNotifyCardAllApi(queryParams)
//     if (!res.success) return

//     message.success('提醒成功！')
//   } catch (error) {
//   } finally {
//     quickRingLoading.value = false
//   }
// }
</script>
<style lang="less" scoped>
@import url(../../../index.scss);
</style>
