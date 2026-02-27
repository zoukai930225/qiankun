<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    :modal-append-to-body="false"
    :width="1100"
  >
    <template #header>
      <div class="my-header">
        <span>货品编码</span>
        <img
          src="@/assets/imgs/negativeReviewDashboard/close.svg"
          alt=""
          style="cursor: pointer"
          @click="dialogVisible = false"
        />
      </div>
    </template>
    <el-table
      ref="selectTableRef"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      border
      :height="list.length > 9 ? '400' : 'auto'"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      @cell-click="handleCellClick"
    >
      <el-table-column label="货品编码" prop="productCode" align="center" />
      <el-table-column label="订单数" prop="orderNum" align="center">
        <template #default="{ row }">
          <span :class="row.productCode === '合计' ? '' : 'custom-cell'">
            {{ row.orderNum || 0 }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="货品数" prop="goodsQuantity" align="center">
        <template #default="{ row }">
          <span :class="row.productCode === '合计' ? '' : 'custom-cell'">
            {{ row.goodsQuantity || 0 }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
    /></div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import * as DailyReportApi from '@/api/supplier/warehouseShippingDailyReport'

const appStore = useAppStore()

defineOptions({ name: 'ProductCodeDialog' })

const dialogVisible = ref(false) // 弹窗的是否展示
const loading = ref(false) // 数据加载是否中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  date: '', // 日期
  warehouse: '' // 仓库
})

const resetData = () => {
  firstRow.value = {
    productCode: '合计',
    orderNum: 0,
    goodsQuantity: 0
  }
  list.value = []
  // 重置查询参数
  queryParams.value = {
    page: 1,
    size: 10,
    date: '',
    warehouse: ''
  }
}

const firstRow = ref({
  productCode: '合计',
  orderNum: 0,
  goodsQuantity: 0
})

/** 打开弹窗 */
const open = async (warehouseData) => {
  dialogVisible.value = true

  resetData()

  queryParams.value.warehouse = warehouseData.warehouse // 设置仓库ID
  queryParams.value.date = warehouseData.orderTime // 设置日期
  firstRow.value.orderNum = warehouseData.orderNum // 重置合计行的订单数
  firstRow.value.goodsQuantity = warehouseData.goodsQuantity // 重置合计行的货品数

  console.log('打开弹窗，传入的仓库数据:', warehouseData)
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DailyReportApi.getProductCodeShippingDailyReport(queryParams.value).catch(
      () => {
        loading.value = false
      }
    )
    list.value = data.records || []

    // 将firstRow添加到列表的第一行
    list.value.unshift(firstRow.value)
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 点击单元格事件
const handleCellClick = (row) => {
  // 如果是合计行，直接返回不执行后续逻辑
  if (row.productCode === '合计') return

  const data = {
    ...row,
    warehouse: queryParams.value.warehouse,
    date: queryParams.value.date
  }

  emit('product-click', data)
}

const emit = defineEmits(['product-click'])
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  background: #fff;
  width: 100%;
}

.custom-cell {
  color: #0064ff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

.my-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    width: 16px;
    height: 16px;
  }
}
</style>
