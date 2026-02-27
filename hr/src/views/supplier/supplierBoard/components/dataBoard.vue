<template>
  <div class="cards-area" v-loading="loading">
    <el-card shadow="never" class="supplier-card">
      <template #header>
        <span class="lh-18px font-size-14px font-600">供应商：{{ pageData.supplierName }}</span>
      </template>

      <div class="supplier-card-content">
        <div class="supplier-card-label">本期绩效评分</div>
        <div class="supplier-card-info" v-if="pageData.performanceScore">
          <span class="lh-62px font-size-44px mr-14px font-500">{{
            pageData.performanceScore
          }}</span>
          <span
            v-if="growthRate"
            :class="{ 'color-#EB3737': growthTrend, 'color-#349b34': !growthTrend }"
          >
            <component :is="iconsSrc[growthTrend ? 'up' : 'down']" class="mr-4px" />
            <span>{{ growthRate }}%</span>
          </span>
        </div>
        <div v-else>
          <el-tooltip content="暂无数据" placement="right">
            <span class="lh-62px font-size-44px mr-14px">--</span>
          </el-tooltip>
        </div>
        <div class="supplier-card-icon">
          <component :is="iconsSrc['supplier-icon']" />
        </div>
      </div>
    </el-card>

    <el-card
      shadow="never"
      v-for="card in cardsOptions"
      :key="card.field"
      :class="{ danger: ['unfinishedOrderNum', 'waitDeliveryGoodsNum'].includes(card.field) }"
    >
      <div class="flex justify-between">
        <div>
          <div class="font-size-14px color-#666 mb-14px lh-20px">{{ card.label }}</div>
          <div class="font-size-22px lh-30px font-500">{{
            new Intl.NumberFormat().format((pageData[card.field] as number) || 0)
          }}</div>
        </div>
        <component :is="card.icon" />
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { getSupplierProductDataBoardApi } from '@/api/supplier/supplierBoard'
import { cardsOptions, iconsSrc } from '../options'

const pageData = ref<Record<string, string | number>>({})
const loading = ref(false)

const growthRate = computed(() => Math.abs(Number(pageData.value.growthRate)))
const growthTrend = computed(
  () => Number((pageData.value.growthRate as string)?.replace(/([+-]\d+)\D+$/, '$1')) > 0
)

async function getData() {
  loading.value = true
  try {
    const res = await getSupplierProductDataBoardApi()
    if (res) {
      pageData.value = res
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

onBeforeMount(() => {
  getData()
})
</script>
<style lang="less" scoped>
.el-card {
  border-radius: 10px;
}
.cards-area {
  display: grid;
  margin-bottom: 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;

  .supplier-card {
    grid-row: 1 / 3;

    :deep(.el-card__header) {
      background: linear-gradient(91deg, #e6ecfd 0%, rgba(230, 236, 253, 0) 99%);
      border: 0;
    }

    .supplier-card-content {
      display: grid;
      grid-template-columns: 1fr 1fr;

      .supplier-card-label {
        margin: 6px 0;
        font-size: 14px;
        color: #666;
        line-height: 20px;
      }

      .supplier-card-icon {
        width: 110px;
        height: 110px;
        margin-left: auto;
        transform: rotate(4.44deg);
        grid-row: 1 / 3;
        grid-column: 2 / 2;
      }
    }
  }
}

.danger {
  background-color: #fef9f9;
}
</style>
