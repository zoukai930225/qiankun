<template>
  <!-- 页头 -->
  <el-card shadow="never" class="!border-0 mb-20px">
    <div class="!flex items-center">
      <component :is="iconsSrc['header']" />
      <span class="mr-auto ml-16px font-size-18px font-600">供应商产品数据看板</span>
    </div>
  </el-card>

  <!-- 内容 -->
  <el-card shadow="never" class="!border-0">
    <data-board />

    <!-- 柱状图区 -->
    <div class="charts-bar-area">
      <top-ten-board
        v-for="chartsConfig in chartsBars"
        :key="chartsConfig.type"
        v-model:more-dialog-prop="moreDialogProps"
        :config="chartsConfig"
      >
        <template #[TOP_10_TYPE.GOODS_NEW]="{ data }">
          <special-table :data="data" :options="tableConfig" class="mt-20px" height="335px">
            <template #empty>
              <img src="@/assets/imgs/common/empty_list.png" alt="" />
              <span class="mt-20px">暂无数据</span>
            </template>
          </special-table>
        </template>
      </top-ten-board>
    </div>

    <!-- 货品销售趋势 -->
    <trend-part title="货品销售趋势" ref="saleTrendRef" :api="getGoodsSalesTrendApi">
      <template #filter="{ params }">
        <el-form :model="params">
          <el-row justify="space-between">
            <el-col :span="6">
              <el-form-item label="货品编码" prop="goodsNo">
                <scroll-select
                  class-name="!w-220px"
                  v-model:model-value="params.goodsNo"
                  :api="getInfoByGoodsCode"
                  item-label-key="goodsCode"
                  item-value-key="goodsCode"
                  selectKey="goodsCode"
                  :multiple="true"
                  clearable
                  @change="saleTrendRef?.getData"
                />
              </el-form-item>
            </el-col>

            <el-col :span="6" class="!flex justify-end">
              <el-form-item>
                <el-checkbox :model-value="!saleTrendRef?.queryParams.goodsNo">
                  展示 TOP10 货品
                </el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </trend-part>

    <!-- 日发货趋势 -->
    <trend-part ref="deliveryRef" :api="getDeliverNumTrendApi">
      <template #title>
        <span>日发货趋势（TOP10）</span>
        <el-button type="primary" link @click="handleMore">
          <span>查看所有发货明细</span>
          <Icon icon="ep:arrow-right" />
        </el-button>
      </template>
    </trend-part>
  </el-card>

  <more-dialog v-bind="moreDialogProps" v-model="moreDialogProps.modelValue" />
</template>
<script lang="tsx" setup>
import { chartsBars, deliveryTrendTable, iconsSrc, tableConfig, TOP_10_TYPE } from './options'
import specialTable from '@/views/supplier/components/table.vue'
import dataBoard from './components/dataBoard.vue'
import topTenBoard from './components/topTenBoard.vue'
import moreDialog from './components/moreDialog.vue'
import trendPart from './components/trend.vue'
import { getInfoByGoodsCode } from '@/api/supplier/purchase'
import {
  getDeliverNumTrendApi,
  getDeliverNumTrendDetailApi,
  getGoodsSalesTrendApi,
  getTop10GoodsApi
} from '@/api/supplier/supplierBoard'

defineOptions({ name: 'SupplierBoard' })

const moreDialogProps = ref<{
  modelValue: boolean
  type: string
  config?: {
    detailApi?: (...arg: any[]) => Promise<any>
    detailTableOptions?: TableOption
    label?: string
  }
  otherParams?: any
}>({
  modelValue: false,
  type: ''
})
const top10Goods = ref<any[]>([])

const saleTrendRef = ref<InstanceType<typeof trendPart>>()
const deliveryRef = ref<InstanceType<typeof trendPart>>()

async function getTop10Goods() {
  try {
    const res = await getTop10GoodsApi()
    if (res) {
      top10Goods.value = res.map((ele) => ele.goodsNo)
    }
  } catch (error) {}
}

function handleMore() {
  moreDialogProps.value = {
    modelValue: true,
    type: '',
    config: {
      detailTableOptions: deliveryTrendTable,
      detailApi: getDeliverNumTrendDetailApi,
      label: '日发货量明细'
    },
    otherParams: {
      ...deliveryRef.value?.queryParams,
      startTime: deliveryRef.value?.queryParams.startTime + ' 00:00:00',
      endTime: deliveryRef.value?.queryParams.endTime + ' 23:59:59'
    }
  }
}

onBeforeMount(() => {
  getTop10Goods()
})
</script>
<style lang="less" scoped>
.el-card {
  border-radius: 10px;
}

.charts-bar-area {
  display: grid;
  margin-bottom: 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 20px;
}

:deep(.el-card__header) {
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>
