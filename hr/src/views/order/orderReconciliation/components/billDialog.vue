<template>
  <!-- 详情 -->
  <el-dialog v-model="visible" title="账单" width="800">
    <div class="flex-cloumn">
      <div class="flex-row title-wapper">
        <span class="logo"></span>
        <span class="title">订单编号：</span>
        <span class="value">{{ orderDetail?.orderNumber || '' }}</span>
      </div>
      <div class="total flex-cloumn">
        <span class="title">总计</span>
        <span class="blue">{{ orderDetail?.billAmount }}</span>
      </div>

      <div class="flex-row item-wapper">
        <div class="item" v-for="item in list" :key="item.id">
          <span class="title">{{ item?.businessDescription }}</span>
          <div class="flex-row">
            <img
              src="@/assets/imgs/order/top-icon.png"
              class="icon"
              alt=""
              v-if="item?.amount != '0.0' && Number(item?.amount) > 0"
            />
            <img
              src="@/assets/imgs/order/bottom-icon.png"
              class="icon"
              v-if="item?.amount != '0.0' && Number(item?.amount) < 0"
            />
            <span
              :class="{
                add: Number(item?.amount) > 0,
                jian: Number(item?.amount) < 0
              }"
              >{{ item?.amount || '0.0' }}</span
            >
          </div>
          <div style="margin-top: 5px">{{ item?.entryTime }}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getBillDetail } from '@/api/order'
const visible = ref(false)

const orderDetail = ref()
const open = (item) => {
  visible.value = true
  orderDetail.value = item
  getDetail()
}

const list = ref()
const getDetail = async () => {
  const params = {
    orderNumber: orderDetail.value.orderNumber
  }
  const res = await getBillDetail(params)
  list.value = res.data
}

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
  height: 120px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e9e9e9;
  padding: 20px 23px;
  box-sizing: border-box;
}

.item-wapper {
  .item {
    margin-right: 20px;
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
