<template>
  <ContentWrap is-auto-height ref="contentWrapRef">
    <table-box v-bind="{ maxViewHeight: innerHeight, thresholdValue: 0 }">
      <template #prePart>
        <el-row>
          <el-col :span="20" class="!flex-1">
            <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item prop="sku" label-width="20">
                    <sku-goods-no-select
                      v-model:params="queryParams"
                      @change-type="getList"
                      @change-value="handleQuery"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="申请人" prop="requesterId">
                    <select-people
                      v-model:model-value="queryParams.requesterId"
                      v-model:list="personList"
                      clearable
                      :multiple="false"
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="状态" prop="status">
                    <el-select
                      v-model="queryStatus"
                      placeholder="请选择订单状态"
                      clearable
                      multiple
                      collapse-tags
                      collapse-tags-tooltip
                      @change="handleQuery"
                      @clear="handleQuery"
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
                <el-col :span="6">
                  <el-form-item label="渠道" prop="salesChannel">
                    <select-channels v-model="queryParams.salesChannel" @change="handleQuery" />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-show="isMore">
                  <el-form-item label="产品类型" prop="productType">
                    <el-select
                      v-model="queryParams.productType"
                      placeholder="请选择"
                      clearable
                      @change="handleQuery"
                    >
                      <el-option
                        v-for="dict in getIntDictOptions(
                          DICT_TYPE.OPS_REPLENISHMENT_PRODUCT_TYPE,
                          true
                        )"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-show="isMore">
                  <el-form-item label="调整原因" prop="adjustmentType">
                    <el-select
                      v-model="queryParams.adjustmentType"
                      placeholder="请选择"
                      clearable
                      @change="handleQuery"
                    >
                      <el-option
                        v-for="dict in getIntDictOptions(
                          DICT_TYPE.OPS_REPLENISHMENT_ADJUSTMENT_REASON,
                          true
                        )"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>

          <el-col :span="4" class="!flex justify-end min-w-330px">
            <el-button class="commonSearchBtn" @click="handleQuery">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button class="commonResetBtn" @click="resetQuery"> 重置 </el-button>
            <special-dropdown :btns="btnOps" />

            <el-button @click="isMore = !isMore" type="primary" link class="ml12px !h-32px">
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
        :options="tableOptions"
        :loading="loading"
        row-key="id"
        :btns-options="btnsOptions"
        :loading-btns="['撤回', '删除', '提交']"
      >
        <template #requestQuantity="{ col, row }">
          <popover-cell
            :reference="col"
            :row-data="row"
            :api="getOpsReplenishmentRequestQuantityDetailApi"
            :option="opsReplenishmentTable"
            title="申请量"
            is-not-page-api
            :params="{ id: row.id, goodsCode: row.goodsCode }"
            @show-more="handleCheck(row)"
          />
        </template>
      </special-table>

      <div class="flex items-center justify-end mt-20px">
        <!-- 分页 -->
        <Pagination
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="getList"
        />
      </div>
    </table-box>
  </ContentWrap>

  <!-- 审核记录 -->
  <auditLogDrawer
    ref="auditLogDrawerRef"
    :api="getProcessLogOpsReplenishmentRequestApi"
    time-key="nodeTime"
    status-key="status"
    person-key="reviewer"
    comment-key="reviewComment"
    descKey="status"
    :is-no-pass="(status) => /不通过$/.test(status)"
    :is-pass="(status) => /(?<!不)通过$/.test(status)"
    :is-recall="(status) => /撤回$/.test(status)"
  />
</template>
<script lang="tsx" setup>
import selectPeople from '../components/selectPeople.vue'
import {
  deleteOpsReplenishmentRequestApi,
  getOpsReplenishmentRequestQuantityDetailApi,
  getProcessLogOpsReplenishmentRequestApi,
  opsReplenishmentRequestApi,
  submitOpsReplenishmentRequestApi,
  withdrawOpsReplenishmentRequestApi
} from '@/api/supplier/purchaseApplication'
import specialTable from '../components/table.vue'
import { statusOps, tableOptions } from './options'
import { AuditBtn } from '../changeAudit/option'
import { toReactive } from '@vueuse/core'
import skuGoodsNoSelect from '@/views/supplier/components/sku&goodsNoSelect.vue'
import { opsReplenishmentTable } from '../purchase/options'
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import { useUserStore } from '@/store/modules/user'
const PopoverCell = defineAsyncComponent(() => import('../components/popoverDetail.vue'))
import tableBox from '../components/tableBox.vue'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import { Icon } from '@/components/Icon'
import specialDropdown from '../components/specialDropdown.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

defineOptions({ name: 'SupplierPurchaseApplication' })

const router = useRouter()
const message = useMessage()
const userInfo = useUserStore()

const queryParams = reactive<Supplier.PurchaseApplication.Request>({
  page: 1,
  size: 10
})
const isMore = ref(false)
const personList = ref<any[]>([])
const tableData = ref<Supplier.PurchaseApplication.Record[]>([])
const total = ref(0)
const auditLogDrawerRef = ref()
const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)

const queryStatus = computed({
  get: () => (queryParams.status ? queryParams.status?.split(',') : undefined),
  set: (val) => {
    queryParams.status = val && val.length ? val?.join(',') : undefined
  }
})

enum BTNS_KEY {
  /** 查看 */ CHECK,
  /** 编辑 */ EDIT,
  /** 提交 */ SUBMIT,
  /** 审核 */ AUDIT,
  /** 撤回 */ RECALL,
  /** 查看日志 */ LOG,
  /** 删除 */ DELETE,
  /** 采购进度 */ PROGRESS
}

const BASE_BTN_CONFIGS: Record<BTNS_KEY, [string, (params: any) => void, any]> = {
  [BTNS_KEY.CHECK]: ['查看', handleCheck, { permission: 'SupplierPurchaseApplication:Check' }],
  [BTNS_KEY.EDIT]: ['编辑', handleEdit, { permission: 'SupplierPurchaseApplication:Edit' }],
  [BTNS_KEY.SUBMIT]: [
    '提交',
    handleSubmitRow,
    { permission: 'SupplierPurchaseApplication:Submit' }
  ],
  [BTNS_KEY.AUDIT]: ['审核', handleAudit, { permission: 'SupplierPurchaseApplication:Audit' }],
  [BTNS_KEY.RECALL]: ['撤回', handleRecall, { permission: 'SupplierPurchaseApplication:Recall' }],
  [BTNS_KEY.LOG]: ['查看日志', handleCheckLog, { permission: 'SupplierPurchaseApplication:Log' }],
  [BTNS_KEY.DELETE]: [
    '删除',
    handleDeleteRow,
    { permission: 'SupplierPurchaseApplication:Delete', type: 'danger' }
  ],
  [BTNS_KEY.PROGRESS]: [
    '采购进度',
    handleCheckProgress,
    { permission: 'SupplierPurchaseApplication:Progress' }
  ]
}

const STATUS_HIDE_KEYS_MAP: Record<string, BTNS_KEY[]> = {
  '0': [],
  '1': [BTNS_KEY.CHECK],
  '2': [BTNS_KEY.CHECK, BTNS_KEY.PROGRESS],
  '3': [] // 动态补充，先初始化空数组
}

/** 计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map((item) => {
    const { status, pendingReviewer, requester, isInProcess } = item
    const isRequester = requester?.userId === userInfo.user.id
    const isReviewer = pendingReviewer?.split(',').includes(userInfo.user.id)

    const hideBtnKeys = new Set<BTNS_KEY>([
      ...(STATUS_HIDE_KEYS_MAP[status] || []),
      ...(isInProcess === 1 ? [BTNS_KEY.LOG] : [])
    ])

    if (status === '0') {
      if (userInfo.user.id === requester.userId) {
        hideBtnKeys.add(BTNS_KEY.EDIT).add(BTNS_KEY.SUBMIT).add(BTNS_KEY.DELETE)
      } else {
        hideBtnKeys.add(BTNS_KEY.CHECK)
      }
    }

    if (status === '1') {
      isReviewer && hideBtnKeys.add(BTNS_KEY.AUDIT)
      isRequester && hideBtnKeys.add(BTNS_KEY.RECALL)
    }

    if (status === '3') {
      isRequester
        ? hideBtnKeys.add(BTNS_KEY.EDIT).add(BTNS_KEY.SUBMIT).add(BTNS_KEY.DELETE)
        : hideBtnKeys.add(BTNS_KEY.CHECK)
    }

    const hideBtns = Array.from(hideBtnKeys)
      .sort((a, b) => a - b)
      .map((key) => new AuditBtn(...BASE_BTN_CONFIGS[key]))

    return toReactive(hideBtns)
  })
)

const btnOps = [
  {
    label: '新增',
    option: handleAdd,
    permission: 'SupplierPurchaseApplication:Add',
    icon: () => <Icon icon="ep:plus" />
  }
]

/* 新增 */
function handleAdd() {
  router.push({ name: 'SupplierPurchaseApplicationAdd' })
}
/* 编辑 */
function handleEdit(row) {
  router.push({ name: 'SupplierPurchaseApplicationEdit', params: { id: row.id } })
}
/* 查看 */
function handleCheck(row) {
  router.push({
    name: 'SupplierPurchaseApplicationDetail',
    params: { id: row.id },
    query: { status: row.status }
  })
}
/* 提交 */
async function handleSubmitRow(row) {
  try {
    const res = await submitOpsReplenishmentRequestApi({ id: row.id })
    if (res.success) {
      message.success('提交成功！')
      getList()
    }
  } catch (error) {}
}
/* 删除 */
async function handleDeleteRow(row) {
  try {
    await message.confirm('确定删除当前申请单吗？')

    const res = await deleteOpsReplenishmentRequestApi({ id: row.id })
    if (res.success) {
      message.success('删除成功！')
      handleQuery()
    }
  } catch (error) {}
}
/* 查看日志 */
function handleCheckLog(row) {
  auditLogDrawerRef.value?.open(row.id)
}
/* 审核 */
function handleAudit(row) {
  router.push({ name: 'SupplierPurchaseApplicationAudit', params: { id: row.id } })
}
async function handleRecall(row) {
  try {
    await message.confirm('确定要撤回这条申请吗？')

    const res = await withdrawOpsReplenishmentRequestApi({ id: row.id })
    if (res.success) {
      message.success('撤回成功！')
      getList()
    }
  } catch (error) {}
}
/* 查看采购进度 */
function handleCheckProgress(row) {
  router.push({
    name: 'SupplierPurchaseApplicationProgress',
    params: {
      sourceBusinessId: row.id
    }
  })
}

const timer = ref<NodeJS.Timeout | null>()
const loading = ref(false)
function getList() {
  loading.value = true
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }

  timer.value = setTimeout(async () => {
    try {
      const res = await opsReplenishmentRequestApi(queryParams)

      tableData.value = res.records
      total.value = res.total
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
      timer.value && clearTimeout(timer.value)
    }
  }, 1000)
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

onBeforeMount(() => {
  getList()
})

onActivated(() => {
  getList()
})
</script>
<style lang="less" scoped>
@import url(../index.scss);

:deep(.el-pagination) {
  margin: 0;
  // margin-bottom: 0;margin-bottom
  float: none;
}
</style>
