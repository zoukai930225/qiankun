<template>
  <el-popover
    :width="300"
    :show-after="200"
    :hide-after="200"
    :visible="!!reference || title === '入库单' ? undefined : false"
    @before-enter="handleBeforeEnter"
    @after-leave="handleAfterLeave"
  >
    <div class="popoverBtns">
      <b>{{ title }}</b>
      <el-button link type="primary" :disabled="!tableData?.length" @click="emit('show-more')">
        显示更多
      </el-button>
    </div>
    <sw-table
      :options="option"
      :data="tableData || []"
      :header-row-style="{ display: 'none' }"
      :show-empty="false"
      :max-height="200"
      :loading="loading"
      stripe
      :border="false"
      @scroll="handleScroll($event)"
    />
    <template #reference>{{ reference }} </template>
  </el-popover>
</template>
<script lang="ts" setup>
import SwTable from './table.vue'

const props = withDefaults(
  defineProps<{
    reference?: number
    rowData: any
    visible?: undefined | boolean
    title: string
    api: (params: any) => Promise<any>
    option: TableOption
    poId?: string
    asrId?: string
    isNotPageApi?: boolean
    prId?: string
    isNotPage?: string
    params?: any
  }>(),
  {
    visible: false,
    isNotPageApi: false
  }
)

const emit = defineEmits(['show-more'])

const tableData = ref<any[]>([])
const queryParams = reactive({
  pageNum: 1,
  size: 10
})
const total = ref(0)
const loading = ref(false)

async function getList() {
  loading.value = true
  try {
    const params = props.params
      ? props.params
      : props.isNotPage
        ? props[props.isNotPage]
        : props.isNotPageApi
          ? {
              scPurchaseOrderId: props.poId,
              scPurchaseRequestOrderId: props.prId
            }
          : {
              ...queryParams,
              prId: props.prId,
              poId: props.poId,
              asrId: props.asrId
            }
    const res = await props.api(params)
    if (!res) return

    if (props.isNotPageApi) {
      tableData.value =
        res.scPurchaseOrderDetailList ?? res.scAdvancedShippingRequestOrderDetailList ?? res ?? []
    } else {
      tableData.value = res.records
      total.value = res.total
    }

    console.log(tableData.value)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

/**用于防抖 */
const canSearch = ref(true)
async function handleScroll(e: HTMLElement) {
  if (tableData.value.length >= total.value || e.scrollTop % 400 >= 200 || !canSearch.value) return
  queryParams.pageNum++

  try {
    canSearch.value = false

    const res = await props.api({
      ...queryParams,
      prId: props.rowData.scPurchaseRequestOrderId || props.rowData.id,
      poId: props.poId
    })
    if (!res) return
    tableData.value.push(...res.records)
    total.value = res.total
  } catch (error) {
  } finally {
    const timer = setTimeout(() => {
      canSearch.value = true
      clearTimeout(timer)
    }, 500)
  }
}

function handleBeforeEnter() {
  getList()
}

function handleAfterLeave() {
  tableData.value = []
  queryParams.pageNum = 1
  canSearch.value = true
}
</script>
<style lang="less" scoped>
@import url(../index.scss);

.popoverBtns {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

:deep(.el-table__empty-text) {
  margin-right: 0;
}

:deep(.el-table__body-wrapper) {
  border-top: 1px solid #eee;
}

:deep(.cell) {
  & > div {
    padding: 6px 0;
  }
}
</style>
