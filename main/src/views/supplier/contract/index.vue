<template>
  <ContentWrap is-auto-height ref="contentWrapRef">
    <table-box v-bind="{ maxViewHeight: innerHeight, thresholdValue: 0 }">
      <template #prePart>
        <el-row :gutter="24">
          <el-col :span="20" class="!flex-1">
            <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
              <el-row :gutter="14">
                <el-col :span="6">
                  <el-form-item label-width="0">
                    <el-input
                      v-model.trim="queryParams[codeType]"
                      clearable
                      :placeholder="codeTypes[codeType].placeholder"
                      @keydown.enter="handleQuery"
                      @clear="handleQuery"
                    >
                      <template #prepend>
                        <el-select v-model="codeType" @change="handleChangeCodeType(codeTypes)">
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
                  <el-form-item label="供应商:" prop="supplierId">
                    <el-select-v2
                      v-model="queryParams.supplierId"
                      :options="supplierProduct.supplierList"
                      filterable
                      placeholder="请选择供应商"
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="货品编码">
                    <scroll-select
                      class-name="!w-100%"
                      v-model:model-value="queryParams.goodsCodeQuery"
                      :api="getInfoByGoodsCode"
                      item-label-key="goodsCode"
                      item-value-key="goodsCode"
                      selectKey="goodsCode"
                      :multiple="true"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="合同状态:" prop="status">
                    <el-select
                      v-model="queryStatus"
                      placeholder="请选择合同状态"
                      clearable
                      multiple
                      collapse-tags
                      collapse-tags-tooltip
                      @change="handleQuery"
                    >
                      <el-option
                        v-for="item in statusOps"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-show="isMore">
                  <el-form-item label="跟单人" prop="orderHandlerId">
                    <select-people
                      v-model:list="supplierProduct.personList"
                      v-model:model-value="queryParams.orderHandlerId"
                      :multiple="false"
                      placeholder="请选择跟单人"
                      get-list-method="visible"
                      :api="getScPersonsApi"
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-show="isMore">
                  <el-form-item prop="firstBatchTime" label="合同首批日期:">
                    <el-date-picker
                      type="daterange"
                      v-model.trim="firstBatchTime"
                      value-format="YYYY-MM-DD"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-show="isMore">
                  <el-form-item prop="latestArrivalTime" label="合同清单日期:">
                    <el-date-picker
                      type="daterange"
                      v-model.trim="latestArrivalTime"
                      value-format="YYYY-MM-DD"
                      placeholder="请选择"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6" v-show="isMore">
                  <el-form-item label="产前样时间:">
                    <el-date-picker
                      type="daterange"
                      v-model="productBeforeDate"
                      value-format="YYYY-MM-DD"
                      placeholder="请选择"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="4" class="!flex justify-end min-w-300px">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
              重置
            </el-button>

            <slot name="options"> </slot>

            <el-button @click="isMore = !isMore" type="primary" link class="ml-4px !h-32px">
              <img
                src="@/assets/svgs/supplier/zhankai.svg"
                alt=""
                class="mr4px"
                :style="{ transform: !isMore ? 'rotate(180deg)' : 'rotate(0)' }"
              />
              {{ isMore ? '收起' : '展开' }}
            </el-button>
          </el-col>
        </el-row>
      </template>

      <special-table
        :data="tableData"
        :options="mainTable"
        :btns-options="btnOptions"
        :loading="loading"
        :loading-btns="['发送', '重发', '催签', '下载']"
      />

      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </table-box>
  </ContentWrap>
</template>
<script lang="ts" setup>
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import tableBox from '@/views/supplier/components/tableBox.vue'
import specialTable from '@/views/supplier/components/table.vue'
import { CONTRACT_STATUS, mainTable, statusOps } from './options'
import {
  downloadContractApi,
  remindSignApi,
  scPoContractPaginQueryApi,
  sendToSignApi
} from '@/api/supplier/contract'
import { useSupplierProduct } from '@/store/modules/supplier'
import { getInfoByGoodsCode, getScPersonsApi } from '@/api/supplier/purchase'
import selectPeople from '@/views/supplier/components/selectPeople.vue'
import { AuditBtn } from '../changeAudit/option'
import { toReactive } from '@vueuse/core'
import { downloadByUrl2 } from '@/utils/download'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'SupplierContract' })

const supplierProduct = useSupplierProduct()
const route = useRoute()
const router = useRouter()
const message = useMessage()

const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()
const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const queryParams = reactive<Supplier.Contract.GetPageReq>({
  page: 1,
  size: 10
})
const codeTypes = {
  poNo: { label: '生产订单号', placeholder: '请输入生产订单号' },
  contractNo: { label: '合同编码', placeholder: '请输入合同编码' }
}
const codeType = ref('poNo')
const isMore = ref(false)

function handleChangeCodeType(codeTypes) {
  let val = ''
  Object.keys(codeTypes).forEach((key) => {
    queryParams[key] && (val = queryParams[key])
    queryParams[key] = undefined
  })
  val && handleQuery()
}

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)

const queryStatus = computed({
  get: () => queryParams.status && queryParams.status.split(','),
  set: (val) => (queryParams.status = val && val.length ? val.join(',') : undefined)
})

const firstBatchTime = computed({
  get: () =>
    queryParams.firstBatchStartTime && queryParams.firstBatchEndTime
      ? [queryParams.firstBatchStartTime, queryParams.firstBatchEndTime]
      : [],
  set: (val) => {
    queryParams.firstBatchStartTime = val ? val[0] : undefined
    queryParams.firstBatchEndTime = val ? val[1] : undefined
  }
})
const latestArrivalTime = computed({
  get: () =>
    queryParams.latestArrivalStartTime && queryParams.latestArrivalEndTime
      ? [queryParams.latestArrivalStartTime, queryParams.latestArrivalEndTime]
      : [],
  set: (val) => {
    queryParams.latestArrivalStartTime = val ? val[0] : undefined
    queryParams.latestArrivalEndTime = val ? val[1] : undefined
  }
})
const productBeforeDate = computed({
  get: () =>
    queryParams.productBeforeStartDate && queryParams.productBeforeEndDate
      ? [queryParams.productBeforeStartDate, queryParams.productBeforeEndDate]
      : [],
  set: (val) => {
    queryParams.productBeforeStartDate = val ? val[0] : undefined
    queryParams.productBeforeEndDate = val ? val[1] : undefined
  }
})

enum BTNS_KEY {
  /** 查看 */ CHECK,
  /** 编辑 */ EDIT,
  /** 发送 */ SEND,
  /** 催签 */ REMIND,
  /** 下载 */ DOWNLOAD,
  /** 重发 */ RESEND
}

const BTNS_CONFIG: Record<
  BTNS_KEY,
  [string, (...arg: any[]) => any, Omit<AuditBtn, 'label' | 'method'>]
> = {
  [BTNS_KEY.CHECK]: ['查看', handleCheck, { permission: `${String(route.name)}:Check` }],
  [BTNS_KEY.EDIT]: ['编辑', handleEdit, { permission: `${String(route.name)}:Edit` }],
  [BTNS_KEY.SEND]: ['发送', handleSend, { permission: `${String(route.name)}:Send` }],
  [BTNS_KEY.REMIND]: ['催签', handleRemind, { permission: `${String(route.name)}:Remind` }],
  [BTNS_KEY.DOWNLOAD]: ['下载', handleDownload, { permission: `${String(route.name)}:Download` }],
  [BTNS_KEY.RESEND]: ['重发', handleResend, { permission: `${String(route.name)}:Resend` }]
}

const STATUS_HIDE_RULES: Record<Partial<CONTRACT_STATUS>, BTNS_KEY[]> = {
  [CONTRACT_STATUS.DRAFT]: [BTNS_KEY.EDIT, BTNS_KEY.SEND],
  [CONTRACT_STATUS.PENDING]: [BTNS_KEY.REMIND],
  [CONTRACT_STATUS.SUCCESS]: [],
  [CONTRACT_STATUS.ERROR]: [BTNS_KEY.RESEND]
}

const btnOptions = computed<AuditBtn[][]>(() =>
  tableData.value.map(({ status }) => {
    const hideBtnKeys = new Set<BTNS_KEY>([
      BTNS_KEY.CHECK,
      BTNS_KEY.DOWNLOAD,
      ...STATUS_HIDE_RULES[status!]
    ])

    const hideBtns = Array.from(hideBtnKeys)
      .sort((a, b) => {
        return a - b
      })
      .map((key) => {
        const config = BTNS_CONFIG[key]
        return new AuditBtn(...config)
      })

    return toReactive(hideBtns)
  })
)

function handleCheck({ id }) {
  router.push({
    name: 'SupplierContractCheck',
    params: {
      id
    },
    query: {
      from: route.name as string
    }
  })
}
function handleEdit({ id }) {
  router.push({
    name: 'SupplierContractEdit',
    params: {
      id
    },
    query: {
      from: route.name as string
    }
  })
}
function handleSend(row) {
  handleResend(row)
}
async function handleRemind(row: Supplier.Contract.ScPoContractPageVo) {
  try {
    const res = await remindSignApi(row.id!)
    if (res && res.success) {
      message.success('催签消息已发出！')
    }
  } catch (error) {}
}
async function handleDownload(row: Supplier.Contract.ScPoContractPageVo) {
  try {
    const res = await downloadContractApi(row.id!)
    if (res.success) {
      downloadByUrl2(res.data, `采购合同_${formatDate(new Date(), 'YYYYMMDDHHmmss')}`)

      message.success('合同导出成功！')
    }
  } catch (error) {
  } finally {
  }
}
async function handleResend(row: Supplier.Contract.ScPoContractPageVo) {
  try {
    const res = await sendToSignApi(row.id!)

    if (res && res.success) {
      message.success('发送成功！')
      getList()
    }
  } catch (error) {}
}

async function getList() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await scPoContractPaginQueryApi(queryParams)

    if (!res) return

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

async function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { page: 1, size: 10 }
  )
  getList()
}

onBeforeMount(() => {
  handleQuery()

  if (!supplierProduct.personList?.length) supplierProduct.getgetScPersons()
  if (!supplierProduct.supplierList?.length) supplierProduct.getSupplierList()
})

onActivated(() => {
  getList()

  if (!supplierProduct.personList?.length) supplierProduct.getgetScPersons()
  if (!supplierProduct.supplierList?.length) supplierProduct.getSupplierList()
})
</script>
<style lang="less" scoped>
@import url(../index.scss);
</style>
