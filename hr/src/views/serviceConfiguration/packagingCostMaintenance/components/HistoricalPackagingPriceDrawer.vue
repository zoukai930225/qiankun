<template>
  <SWDrawer v-model="drawerVisible" :title="currentMerchantCode" @close="reset">
    <div class="content" v-loading="loading">
      <el-table row-class-name="commonTableRow" class="SWCommonTable" :header-cell-style="appStore.headerCellStyle"
        :data="list" width="100%" :show-overflow-tooltip="false" v-loading="loading" v-horizontal-scroll="'always'">
        <el-table-column prop="warehouseName" label="仓库" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">{{ row.warehouseName || '--' }}</template>
        </el-table-column>
        <el-table-column prop="timeRange" label="时间范围" align="right" width="190"/>
        <el-table-column prop="packagingUnitPrice" label="包装单价" align="right" width="100" />
        <el-table-column prop="notes" label="备注" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">{{ row.notes || '--' }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="操作时间" width="180">
          <template #default="{ row }">{{ row.createdAt ? dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '--'
            }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
          @pagination="getList" />
      </div>
    </div>
    <template #footer>
      <el-button @click="reset" class="mr20px">关闭</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
defineOptions({ name: 'HistoricalPackagingPriceDrawer' })
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const drawerVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
import * as historicalPackagingPriceApi from '@/api/serviceConfiguration/historicalPackagingPrice'
const loading = ref(false) // 列表的加载中
const currentMerchantCode = ref('') // 当前商户编码
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import dayjs from 'dayjs'
const props = defineProps({
  tabType: {
    type: String,
    default: 'category'
  }
})
const queryParams = ref({
  page: 1,
  size: 10,
})
let historyId = ''
/** 打开弹窗 */
const open = async (id: string, merchantCode: string) => {
  drawerVisible.value = true
  formLoading.value = true
  try {
    currentMerchantCode.value = merchantCode
    if (props.tabType === 'category') {
      currentMerchantCode.value = getDictLabel(DICT_TYPE.STANDARD_CATEGORY, merchantCode)
    }
    historyId = id
    getList()
  } finally {
    formLoading.value = false
  }
}

const total = ref(0) // 列表的总页数
/** 查询列表 */
const list = ref<any[]>([])
const getList = async () => {
  loading.value = true

  try {
    const data = await historicalPackagingPriceApi.getHistoricalPackagingPrice(historyId, queryParams.value)
    if (data) {
      list.value = data.records || []
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}
const reset = () => {
  drawerVisible.value = false
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
  width: 100%;
  min-height: 100%;
  border-radius: 20px;
  padding: 20px;
}
</style>
