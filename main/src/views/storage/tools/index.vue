<template>
  <div class="tools-box">
    <div class="tools-title">仓储应用中心</div>
    <!-- banner -->
    <div class="tools-banner">
      <img src="@/assets/imgs/storage/banner.png" alt="banner" />
    </div>
    <!-- card -->
    <div class="cards">
      <card
        ref="cardRef"
        v-for="item in cardOptions"
        :key="item.title"
        :title="item.title"
        :tip="item.tip"
        :icon="item.icon"
        @click="item.onClick"
      />
    </div>
  </div>
  <create-replenishment-order-dialog v-model:is-show-dialog="isShowReplenishmentOrderDialog" />
</template>

<script lang="ts" setup>
defineOptions({ name: 'StorageTools' })

const Card = defineAsyncComponent(() => import('./components/card.vue'))
const CreateReplenishmentOrderDialog = defineAsyncComponent(
  () => import('./components/createReplenishmentOrderDialog.vue')
)

// 卡片组配置
const cardOptions = [
  {
    title: '生成补货单',
    tip: '生成补货单',
    icon: '/assets/imgs/storage/icon.png',
    onClick: showReplenishmentOrderDialog
  }
]

// 生成补货单弹窗控件
const isShowReplenishmentOrderDialog = ref(false)
const cardRef = ref()

/**
 * 点击生成补货单卡片的回调
 */
function showReplenishmentOrderDialog() {
  isShowReplenishmentOrderDialog.value = true
}
</script>

<style scoped lang="less">
.tools-box {
  padding: 0 10px;
  .tools-title {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    font-size: 18px;
    color: #6e7398;
    line-height: 25px;
    text-align: left;
    font-style: normal;
  }
  .tools-banner {
    width: 100%;
    margin-top: 20px;
    img {
      width: 100%;
    }
  }
}
.cards {
  display: flex;
  flex-wrap: wrap;
  margin-right: -18px;
}
</style>
