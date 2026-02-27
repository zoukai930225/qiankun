<template>
  <ContentWrap is-auto-height ref="contentWrapRef">
    <table-box v-bind="{ maxViewHeight: innerHeight, thresholdValue: 0 }">
      <template #prePart>
        <el-row :gutter="24" id="searchForm">
          <el-col :span="20">
            <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
              <el-row :gutter="12" :style="{ maxWidth: '1340px' }">
                <el-col :span="6">
                  <el-form-item label-width="0">
                    <el-input
                      v-model.trim="queryParams[codeType2]"
                      clearable
                      :placeholder="codeTypes2[codeType2].placeholder"
                      @keydown.enter="handleQuery"
                      @clear="handleQuery"
                    >
                      <template #prepend>
                        <el-select v-model="codeType2" @change="handleChangeCodeType(codeTypes2)">
                          <el-option
                            v-for="(value, key) in codeTypes2"
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
                  <el-form-item label="供应商:" prop="supplierQuery">
                    <el-input
                      v-model="queryParams.supplierQuery"
                      clearable
                      placeholder="请输入供应商"
                      @keydown.enter="handleQuery"
                      @clear="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="skuQuery" label-width="20">
                    <sku-goods-no-select
                      v-model:params="queryParams"
                      goods-code-key="goodsNo"
                      @change-type="getList"
                      @change-value="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="订单状态" prop="changeStatus">
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
                  <el-form-item label="申请人" prop="applicant">
                    <select-people
                      v-model:model-value="queryParams.applicant"
                      v-model:list="personList"
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="4" class="!flex justify-end">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
              重置
            </el-button>
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

      <sw-table
        ref="swTableRef"
        :data="tableData"
        :options="mainTableOption"
        :loading="loading"
        :btns-options="btnsOptions"
        :loading-btns="['废弃']"
        @select="handleTableSelected"
      />
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </table-box>
  </ContentWrap>

  <auditLogDrawer
    ref="auditLogRef"
    time-key="updatedAt"
    status-key="approveStatus"
    person-key="operatorObj"
    comment-key="approveMsg"
    :desc="descMethod"
    :api="scPoChangeRequestLogApi"
    :is-pass="(status) => status === '10'"
    :is-recall="(status) => status === '30'"
    :is-no-pass="(status) => status === '20'"
    :is-submit="(status) => status === '0'"
    :is-remove="(status) => status === '50'"
  />

  <detail-drawer ref="detailDrawerRef" />
</template>
<script lang="ts" setup>
import SwTable from '../components/table.vue'
import { AuditBtn, mainTableOption, statusOps } from './option'
import {
  scPoChangeRequestLogApi,
  scPoChangeRequestPaginQueryApi,
  scPoChangeRequestWithdraw
} from '@/api/supplier/changeAudit'
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'
import { toReactive } from '@vueuse/core'
import DetailDrawer from '@/views/supplier/changeAudit/components/detailDrawer.vue'
import skuGoodsNoSelect from '@/views/supplier/components/sku&goodsNoSelect.vue'
import tableBox from '../components/tableBox.vue'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import { useSupplierProduct } from '@/store/modules/supplier'
import { getScPersonsApi } from '@/api/supplier/purchase'
import selectPeople from '../components/selectPeople.vue'
import { useUserStore } from '@/store/modules/user'
import CommentDrawer from '../components/comment'

defineOptions({ name: 'SupplierChangeAuditIndex' })

const router = useRouter()
const message = useMessage()
const supplierProduct = useSupplierProduct()
const userInfo = useUserStore()

const queryParams = reactive<Supplier.Purchase.GetListParams>({
  page: 1,
  size: 10
})
const loading = ref(false)
const total = ref(0)
const tableData = ref<Supplier.ChangeAudit.ListItem[]>([])
const selectedRows = ref<Supplier.Purchase.ListItem[]>([])
const swTableRef = ref()
const contentWrapRef = ref<InstanceType<typeof ContentWrap>>()

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)
const queryStatus = computed({
  get: () => (queryParams.status ? queryParams.status.split(',') : undefined),
  set: (val) => (queryParams.status = val && val.length ? val.join(',') : undefined)
})
const codeTypes2 = {
  scPurchaseRequestOrderNo: { label: '需求单号', placeholder: '请输入需求单号' },
  scPurchaseOrderNo: { label: '生产单号', placeholder: '请输入生产单号' }
}
const codeType2 = ref('scPurchaseRequestOrderNo')
const auditLogRef = ref<{ open: (id: string) => void }>()
const isMore = ref(false)
const personList = ref<any[]>([])

enum BTNS_KEY {
  /** 查看 */ CHECK,
  /** 评论 */ COMMENT,
  /** 跟单审核 */ AUDIT,
  /** 计划审核 */ PLANE_AUDIT,
  /** 废弃 */ DELETE,
  /** 审核记录 */ LOG
}

const BASE_BTN_CONFIGS: Record<BTNS_KEY, [string, (params: any) => void, any]> = {
  [BTNS_KEY.CHECK]: ['查看', handleCheck, { permission: 'SupplierChangeAuditIndex:Check' }],
  [BTNS_KEY.COMMENT]: [
    '评论',
    (row) => CommentDrawer.open(row),
    { permission: 'SupplierChangeAuditIndex:Comment' }
  ],
  [BTNS_KEY.AUDIT]: ['审核', handleAudit, { permission: 'SupplierChangeAuditIndex:Audit' }],
  [BTNS_KEY.PLANE_AUDIT]: [
    '审核',
    handleAudit,
    { permission: 'SupplierChangeAuditIndex:PlaneAudit' }
  ],
  [BTNS_KEY.LOG]: ['审核记录', handleOpenAuditList, { permission: 'SupplierChangeAuditIndex:Log' }],
  [BTNS_KEY.DELETE]: [
    '废弃',
    handleDelete,
    { permission: 'SupplierChangeAuditIndex:Delete', type: 'danger' }
  ]
}

const STATUS_HIDE_KEYS_MAP: Record<string, BTNS_KEY[]> = {
  '10': [BTNS_KEY.AUDIT, BTNS_KEY.DELETE],
  '20': [BTNS_KEY.PLANE_AUDIT, BTNS_KEY.DELETE],
  default: []
}

/**计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(({ changeStatus, applicantObj }) => {
    const hideBtnKeys = new Set<BTNS_KEY>([
      BTNS_KEY.CHECK,
      BTNS_KEY.LOG,
      BTNS_KEY.COMMENT,
      ...(STATUS_HIDE_KEYS_MAP[changeStatus!] || STATUS_HIDE_KEYS_MAP.default)
    ])

    if (userInfo.user.id !== applicantObj.userId) hideBtnKeys.delete(BTNS_KEY.DELETE)

    const hideBtns = Array.from(hideBtnKeys)
      .sort((a, b) => a - b)
      .map((key) => new AuditBtn(...BASE_BTN_CONFIGS[key]))

    return toReactive(hideBtns)
  })
)

const detailDrawerRef = ref()
function handleCheck(row: Supplier.Purchase.ListItem) {
  detailDrawerRef.value.open(row.id)
}

// 监听表格数据变化，恢复选中状态
watch(tableData, async () => {
  await nextTick()
  tableData.value.forEach((row) => {
    if (selectedRows.value.some((selectedRow) => selectedRow.id === row.id)) {
      swTableRef.value.toggleRowSelection(row, true)
    }
  })
})

function handleChangeCodeType(types) {
  let val = ''
  Object.keys(types).forEach((key) => {
    queryParams[key] && (val = queryParams[key])
    queryParams[key] = ''
  })
  val && getList()
}

async function getList() {
  loading.value = true
  try {
    const res = await scPoChangeRequestPaginQueryApi(queryParams)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function descMethod(status: any) {
  switch (status) {
    case '10':
      return '审核通过'
    case '20':
      return '审核不通过'
    case '0':
      return '提交审核'
    case '50':
      return '废弃'
    default:
      return ''
  }
}

function handleAudit(row: Supplier.ChangeAudit.ListItem) {
  router.push({
    name: 'PurchaseProductOrderChangeAudit',
    params: {
      id: row.id
    },
    query: {
      changeStatus: row.changeStatus
    }
  })
}

async function handleDelete(row: Supplier.ChangeAudit.ListItem) {
  try {
    await message.confirm('确定废弃当前审核吗？')
    const res = await scPoChangeRequestWithdraw({ scPoChangeRequestId: row.id })

    if (res.success) {
      message.success('废弃成功！')
      getList()
    }
  } catch (error) {}
}

function handleOpenAuditList(row: Supplier.ChangeAudit.ListItem) {
  auditLogRef.value?.open(row.id)
}

async function handleQuery() {
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

function handleTableSelected(
  selection: typeof selectedRows.value,
  item?: Supplier.Purchase.ListItem
) {
  if (item) {
    const currentSelection = swTableRef.value.getSelectionRows()
    const isRowSelected = currentSelection.some((row) => row.id === item.id)
    if (isRowSelected) {
      selectedRows.value.push(item)
    } else {
      selectedRows.value = selectedRows.value.filter((row) => row.id !== item.id)
    }
  } else {
    if (selection.length) {
      tableData.value.forEach(
        (tableRow) =>
          !selectedRows.value.some((selectredRow) => selectredRow.id === tableRow.id) &&
          selectedRows.value.push(tableRow)
      )
    } else {
      selectedRows.value = selectedRows.value.filter(
        (selectedRow) => !tableData.value.some((tableRow) => tableRow.id === selectedRow.id)
      )
    }
  }
}

onBeforeMount(() => {
  getList()
  supplierProduct.getgetScPersons()
})

onActivated(() => {
  getList()
})
</script>
<style lang="less" scoped>
@import url(../index.scss);
</style>
