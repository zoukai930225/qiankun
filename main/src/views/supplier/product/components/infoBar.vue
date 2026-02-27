<template>
  <div class="info-bar">
    <div class="info-item" v-for="item in infoOps" :key="item.label">
      <div class="num">{{ item.num || 0 }} </div>
      <div class="label">{{ item.label }} </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getDataBoardApi } from '@/api/supplier/purchase'

const infoOps = ref({
  unfinishedPurchaseRequestOrderCount: { label: '未完成需求单', num: '' },
  unfinishedPRQuantityTotal: { label: '未完成补单量', num: '' },
  unfinishedPurchaseOrderCount: { label: '采购未完成发货订单', num: '' },
  unfinishedPOQuantityTotal: { label: '采购未完成发货数量', num: '' },
  purchaseInTransitQuantityTotal: { label: '采购在途', num: '' }
})

const timer = ref<NodeJS.Timeout>()
function getDataBoard() {
  if (timer) clearTimeout(timer.value)

  timer.value = setTimeout(async () => {
    try {
      const res = await getDataBoardApi()
      Object.keys(infoOps.value).forEach((key) => {
        infoOps.value[key].num = res[key]
      })
    } catch (error) {
    } finally {
      if (timer.value) clearTimeout(timer.value)
    }
  }, 1000)
}

defineExpose({
  infoOps,
  getDataBoard
})
</script>
<style lang="less" scoped>
* {
  --base-color: #0064ff;
}
.info-bar {
  display: flex;
  margin-bottom: 24px;
  border-radius: 8px;
  background: #f8f8f9;
  border: 1px solid #e5e5e5;

  .info-item {
    flex: 1;
    padding: 0 52px 0 30px;
    margin: 12px 0;
    border-right: #e6e6e6 1px solid;

    &:last-of-type {
      border-right: 0;
    }

    .num {
      font-size: 20px;
      line-height: 1;
      margin-bottom: 12px;
      color: var(--base-color);
    }

    .label {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
