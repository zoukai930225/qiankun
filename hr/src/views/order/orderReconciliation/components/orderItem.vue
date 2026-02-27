<!--
 * @Date: 2025-02-18 15:02:09
-->
<template>
  <div class="item-wapper flex-column">
    <div class="flex-row" style="margin-bottom: 20px">
      <div class="top-item">
        <div class="title">订单号</div>
        <div class="value">{{ item?.orderNumber }}</div>
      </div>
      <div class="top-item">
        <div class="title">订单付款时间</div>
        <div class="value">{{ item?.orderPaymentAt }}</div>
      </div>
    </div>
    <div class="flex-row bottom-wapper">
      <div class="order-num" @click="openRemittanceDialog">
        <div class="title">订单</div>
        <div class="order-value">{{ item?.actualPaidAmount }}</div>
      </div>
      <div class="order-num" @click="openBillDialog">
        <div class="title">账单</div>
        <div class="order-value">{{ item?.billAmount }}</div>
      </div>
      <div class="order-num">
        <div class="title">差值</div>
        <div class="diff">
          <img
            src="@/assets/imgs/order/top-icon.png"
            class="icon"
            alt=""
            v-if="item?.difference != '0.0' && Number(item?.difference) > 0"
          />
          <img
            src="@/assets/imgs/order/bottom-icon.png"
            class="icon"
            alt=""
            v-if="item?.difference != '0.0' && Number(item?.difference) < 0"
          />
          <span>{{ item?.difference }}</span>
        </div>
      </div>
    </div>

    <!-- 订单 -->
    <RemittanceDialog ref="remittanceDialog" />
    <!-- 账单 -->
    <BillDialog ref="billDialog" />
  </div>
</template>
<script lang="ts" setup>
import BillDialog from './billDialog.vue'
import RemittanceDialog from './remittanceDialog.vue'
interface Item {
  orderNumber: string
  orderPaymentAt: string
  difference: string
  confirmReceiptPaymentAmount: string
  billAmount: string
  actualPaidAmount: string
}
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  }
})

const remittanceDialog = ref()

const openRemittanceDialog = () => {
  remittanceDialog.value.open(props.item)
}

// 账单
const billDialog = ref()
const openBillDialog = () => {
  billDialog.value.open(props.item)
}
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.order-num {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.item-wapper {
  padding: 20px 18px;
  box-sizing: border-box;
  border-radius: 10px;
}

.title {
  font-weight: 400;
  font-size: 12px;
  color: #999999;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin-bottom: 10px;
}

.diff {
  font-weight: 400;
  font-size: 14px;
  color: #ff3c3c;
  text-align: left;
  font-style: normal;
  display: flex;
  flex-direction: row;
  align-items: center;
  .icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
}

.order-value {
  font-weight: 600;
  font-size: 14px;
  color: #0064ff;
  text-align: left;
  font-style: normal;
}
.value {
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  width: 100%;
  white-space: normal; /* 默认值，允许换行 */
  word-wrap: break-word; /* 长单词或URL强制换行 */
  overflow-wrap: break-word; /* 与 word-wrap 类似，推荐使用 */
  padding-right: 20px;
  box-sizing: border-box;
}
.top-item {
  width: 50%;
}
.bottom-wapper {
  justify-content: space-between;
}
</style>
