<template>
  <div class="summaryBoard" v-loading="loading">
    <el-card shadow="never">
      <p class="font-500 lh-22px mb-16px">出库动态汇总</p>

      <div class="summaryBoard-sum">
        <div class="summary-card-items">
          <div class="my-10px ml-16px">
            <p class="font-400 font-size-14px lh-20px mb-10px color-#4B5563">出库订单总量</p>
            <p class="font-500 font-size-28px lh-39px color-#111827">
              {{ pageData?.outboundOrderTotal || 0 }}
            </p>
          </div>
          <component :is="iconsSrc['icon_1']" class="mr-20px" />
        </div>
        <div class="summary-card-items">
          <div class="my-10px ml-16px">
            <p class="font-400 font-size-14px lh-20px mb-10px color-#4B5563">出库货品总数</p>
            <p class="font-500 font-size-28px lh-39px color-#111827">
              {{ pageData?.outboundGoodsTotal || 0 }}
            </p>
          </div>
          <component :is="iconsSrc['icon_2']" class="mr-20px" />
        </div>
      </div>

      <div class="summary-detail">
        <el-card shadow="never">
          <p class="font-500 mb-14px">总仓出库</p>
          <div class="font-size-14px color-#666666 p10px rounded-4px bg-#f4f8ff">
            <div class="flex justify-between">
              <span>销售出库</span>
              <span>
                <span class="font-500 color-#333">{{ pageData?.salesOutboundOrders || 0 }}</span>
                单 /
                <span class="font-500 color-#333">{{ pageData?.salesOutboundQty || 0 }}</span>
                件
              </span>
            </div>

            <el-divider class="!my-12px" />

            <div class="flex justify-between">
              <span>采购退回</span>
              <span>
                <span class="color-#EB3737 font-500">
                  {{ pageData?.purchaseReturnOrders || 0 }}
                </span>
                单 /
                <span class="color-#EB3737 font-500">{{ pageData?.purchaseReturnQty || 0 }}</span>
                件
              </span>
            </div>
          </div>
        </el-card>

        <el-card shadow="never">
          <p class="font-500 mb-16px">云仓出库</p>
          <div class="font-size-14px color-#666666 p10px rounded-4px bg-#f4f8ff">
            <div class="flex justify-between">
              <span>销售出库</span>
              <span>
                <span class="font-500 color-#333">{{ pageData?.salesOutboundOrders_1 || 0 }}</span>
                单 /
                <span class="font-500 color-#333">{{ pageData?.salesOutboundQty_1 || 0 }}</span> 件
              </span>
            </div>
            <el-divider class="!my-12px" />
            <div class="flex justify-between">
              <span>采购退回</span>
              <span>
                <span class="color-#EB3737 font-500">
                  {{ pageData?.purchaseReturnOrders_1 || 0 }}
                </span>
                单 /
                <span class="color-#EB3737 font-500">
                  {{ pageData?.purchaseReturnQty_1 || 0 }}
                </span>
                件
              </span>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
    <el-card shadow="never">
      <p class="font-500 lh-22px mb-16px">入库动态汇总</p>

      <div class="summaryBoard-sum">
        <div class="summary-card-items">
          <div class="my-10px ml-16px">
            <p class="font-400 font-size-14px lh-20px mb-10px color-#4B5563">入库单据总量</p>
            <p class="font-500 font-size-28px lh-39px color-#111827">
              {{ pageData?.inboundOrderTotal || 0 }}
            </p>
          </div>
          <component :is="iconsSrc['icon_1']" class="mr-20px" />
        </div>
        <div class="summary-card-items">
          <div class="my-10px ml-16px">
            <p class="font-400 font-size-14px lh-20px mb-10px color-#4B5563">入库货品汇总</p>
            <p class="font-500 font-size-28px lh-39px color-#111827">
              {{ pageData?.inboundGoodsTotal || 0 }}
            </p>
          </div>
          <component :is="iconsSrc['icon_3']" class="mr-20px" />
        </div>
      </div>

      <div class="summary-detail">
        <el-card shadow="never">
          <p class="font-500 mb-16px">总仓入库</p>
          <div class="font-size-14px color-#666666 bg-#F4F8FF p10px rounded-4px">
            <div class="flex justify-between">
              <span>入库单量</span>
              <span>
                <span class="font-500 color-#333">{{ pageData?.inboundOrders || 0 }}</span>
                单
              </span>
            </div>

            <el-divider class="!my-12px" />

            <div class="flex justify-between">
              <span>入库件数</span>
              <span>
                <span class="font-500 color-#333">{{ pageData?.inboundQty || 0 }}</span>
                件
              </span>
            </div>
          </div>
        </el-card>

        <el-card shadow="never">
          <p class="font-500 mb-16px">云仓入库</p>
          <div class="font-size-14px color-#666666 bg-#F4F8FF p10px rounded-4px">
            <div class="flex justify-between">
              <span>入库单量</span>
              <span>
                <span class="font-500 color-#333">{{ pageData?.inboundOrders_1 || 0 }} </span>
                单
              </span>
            </div>
            <el-divider class="!my-12px" />
            <div class="flex justify-between">
              <span>入库件数</span>
              <span>
                <span class="font-500 color-#333">{{ pageData?.inboundQty_1 || 0 }} </span>
                件
              </span>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { getWarehouseSummaryBoardSummaryApi } from '@/api/supplier/warhouseSummaryBoard'
import { iconsSrc } from '../options'

const props = defineProps<{
  params: { startDate: string; endDate: string }
}>()

const pageData = ref<any>()
const loading = ref(false)

async function getData() {
  loading.value = true
  try {
    const res = await getWarehouseSummaryBoardSummaryApi(props.params)
    if (res) {
      pageData.value = getOnlyBottomLevel(res)
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function getOnlyBottomLevel(obj) {
  const result = {}

  function traverse(currentObj) {
    for (const [key, value] of Object.entries(currentObj)) {
      const isBottomLevel = !(typeof value === 'object' && value !== null && !Array.isArray(value))

      if (isBottomLevel) {
        if (result[key]) {
          result[key + '_1'] = Intl.NumberFormat().format(Number(value ?? 0))
        } else {
          result[key] = Intl.NumberFormat().format(Number(value ?? 0))
        }
      } else {
        traverse(value)
      }
    }
  }

  traverse(obj)
  return result
}

defineExpose({ getData })
</script>
<style lang="less" scoped>
.summaryBoard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  .summaryBoard-sum {
    display: grid;
    margin-bottom: 20px;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}

.summary-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  :deep(.el-card) {
    border-radius: 6px;
  }
}

.summary-card-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;

  &:nth-of-type(2n-1) {
    background-color: #0064ff10;
    border: 1px solid #0064ff26;
  }

  &:nth-of-type(2n) {
    background-color: #349b3410;
    border: 1px solid #349b3426;
  }
}
</style>
