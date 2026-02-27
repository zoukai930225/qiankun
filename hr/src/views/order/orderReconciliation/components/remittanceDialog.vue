<template>
  <!-- 详情 -->
  <el-dialog v-model="visible" title="订单" width="800">
    <div class="flex-cloumn">
      <div class="flex-row title-wapper">
        <span class="logo"></span>
        <span class="title">订单编号：</span>
        <span class="value">{{ orderDetail?.orderNumber || '' }}</span>
      </div>
      <div class="total flex-cloumn">
        <span class="title">总计</span>
        <span class="blue">{{ orderDetail?.actualPaidAmount }}</span>
      </div>
      <div class="flex-row item-wapper">
        <div class="item">
          <span class="title">应付货款</span>
          <div class="flex-row">
            <img
              src="@/assets/imgs/order/top-icon.png"
              class="icon"
              alt=""
              v-if="orderDetail?.payableFreight != '0.0' && Number(orderDetail?.payableFreight) > 0"
            />
            <img
              src="@/assets/imgs/order/bottom-icon.png"
              class="icon"
              v-if="orderDetail?.payableFreight != '0.0' && Number(orderDetail?.payableFreight) < 0"
            />
            <span
              :class="{
                add: payableFreight > 0,
                jian: payableFreight < 0
              }"
              >{{ orderDetail?.payableFreight || '0.0' }}</span
            >
          </div>
        </div>
        <div class="item">
          <span class="title">应付邮费</span>
          <div class="flex-row">
            <img
              src="@/assets/imgs/order/top-icon.png"
              class="icon"
              alt=""
              v-if="orderDetail?.payablePostage != '0.0' && Number(orderDetail?.payablePostage) > 0"
            />
            <img
              src="@/assets/imgs/order/bottom-icon.png"
              class="icon"
              alt=""
              v-if="orderDetail?.payablePostage != '0.0' && Number(orderDetail?.payablePostage) < 0"
            />
            <span
              :class="{
                add: payablePostage > 0,
                jian: payablePostage < 0
              }"
              >{{ orderDetail?.payablePostage || '0.0' }}</span
            >
          </div>
        </div>
        <div class="item">
          <span class="title"> 退款</span>
          <div class="flex-row">
            <img
              src="@/assets/imgs/order/top-icon.png"
              class="icon"
              alt=""
              v-if="orderDetail?.refundAmount != '0.0' && Number(orderDetail?.refundAmount) > 0"
            />
            <img
              src="@/assets/imgs/order/bottom-icon.png"
              class="icon"
              alt=""
              v-if="orderDetail?.refundAmount != '0.0' && Number(orderDetail?.refundAmount) < 0"
            />
            <span
              :class="{
                add: refundAmount > 0,
                jian: refundAmount < 0
              }"
              >{{ orderDetail?.refundAmount || '0.0' }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
const visible = ref(false)

const payableFreight = computed(() => {
  return Number(orderDetail.value?.payableFreight) || 0
})
const payablePostage = computed(() => {
  return Number(orderDetail.value?.payablePostage) || 0
})
const refundAmount = computed(() => {
  return Number(orderDetail.value?.refundAmount) || 0
})
const orderDetail = ref()
const open = (item) => {
  visible.value = true
  orderDetail.value = item
}

// const getDetail = async (id) => {
//   const params = {
//     orderNumber: id
//   }
//   const res = await getBillDetail(params)
//   console.log(res)
// }

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.flex-cloumn {
  display: flex;
  flex-direction: column;
}
.logo {
  display: inline-block;
  width: 3px;
  height: 10px;
  background: #0064ff;
  margin-right: 10px;
}
.title {
  font-weight: 400;
  font-size: 12px;
  color: #585c64;
  line-height: 20px;
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
}

.total {
  width: 250px;
  height: 100px;
  background: #f0f5fe;
  border-radius: 8px;
  border: 1px solid #0064ff;
  padding: 20px 23px;
  box-sizing: border-box;
  margin: 20px 0;
}
.title-wapper {
  align-items: center;
}
.blue {
  font-weight: 500;
  font-size: 14px;
  color: #0064ff;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  margin-top: 16px;
}
.item {
  width: 250px;
  height: 100px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e9e9e9;
  padding: 20px 23px;
  box-sizing: border-box;
}

.item-wapper {
  justify-content: space-between;
  .item {
    .title {
      margin-bottom: 13px;
      display: inline-block;
    }
  }
}
.icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}
.add {
  color: red; /* 负数样式 */
}

.jian {
  color: green; /* 正数样式 */
}
</style>
