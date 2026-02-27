<template>
  <el-table
    v-loading="loading"
    :data="list"
    :stripe="true"
    :border="border"
    :show-overflow-tooltip="true"
    class="SWCommonTable commonTable"
    v-horizontal-scroll="'always'"
    :header-cell-style="tableHeaderStyle"
  >
    <el-table-column label="序号列" prop="rankNo" align="center" width="100">
      <template #default="scope">
        <div class="rankNoBg" style="width: 60px; margin-left: 5px">
          <img
            class="rankNoImg"
            v-if="scope.row.rankNo === 1"
            src="@/assets/imgs/channelData/rank_1.png"
          />
          <img
            class="rankNoImg"
            v-if="scope.row.rankNo === 2"
            src="@/assets/imgs/channelData/rank_2.png"
          />
          <img
            class="rankNoImg"
            v-if="scope.row.rankNo === 3"
            src="@/assets/imgs/channelData/rank_3.png"
          />
          <div class="rankNoText" v-if="scope.row.rankNo > 3"> {{ scope.row.rankNo }}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="图片" prop="amount" width="120">
      <template #default="scope">
        <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="0">
          <template #reference>
            <div class="row-center">
              <el-image
                style="
                  width: 54px;
                  height: 54px;
                  border-radius: 6px;
                  margin-top: 5px;
                  margin-bottom: 5px;
                  vertical-align: middle;
                "
                :src="
                  exportImg
                    ? imgBase64Dict && imgBase64Dict[`${scope.row.goodsImage}`]
                    : scope.row.goodsImage
                "
                :preview-src-list="[scope.row.goodsImage]"
                :preview-teleported="true"
            /></div>
          </template>
          <GoodCard
            :good="{
              materialName: scope.row.goodsName || scope.row.goods_name,
              materialId: scope.row.goodsId || scope.row.goods_id,
              channel: scope.row.channel || ''
            }"
          />
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="编码" prop="goodsCode" min-width="120" />
    <el-table-column label="商品ID" prop="goodsId" min-width="150" />
    <el-table-column label="关键词推广" prop="gjcCharge" min-width="150" />
    <el-table-column label="人群推广" prop="rqCharge" min-width="150" />
    <el-table-column label="货品运营" prop="hpCharge" min-width="150" />
    <el-table-column label="全站推广" prop="qzCharge" min-width="150" />
    <el-table-column label="活动加速" prop="hdCharge" min-width="150" />
    <el-table-column label="总花费" prop="allCharge" min-width="150">
      <template #default="scope">
        <SWProgressLabel
          :value="scope.row.allCharge"
          :progress="allChargePercent(scope.row.allCharge)"
          textColor="#0064FF"
          backgroundColor="#277BFF"
        />
      </template>
    </el-table-column>
    <el-table-column label="销售金额" prop="paymentAmount" min-width="150" />
    <el-table-column label="退款" prop="returnAmount" min-width="150" />
    <el-table-column label="费用占比(去退)" prop="percentageExpenses" min-width="150">
      <template #default="scope">
        <SWProgressLabel
          :value="`${(scope.row.percentageExpenses * 100).toFixed(2)}%`"
          :progress="percentageExpensesPercent(scope.row.percentageExpenses)"
          textColor="#EB3737"
          backgroundColor="#EF5F5F"
        />
      </template>
    </el-table-column>
    <el-table-column label="支付件数" prop="paidItemCount" min-width="150" />
    <el-table-column label="支付买家数" prop="payingBuyerCount" min-width="150" />
  </el-table>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import SWProgressLabel from '@/components/SWBaseComponent/SWProgressLabel/index.vue'
import GoodCard from '@/components/common/goods/goodCard.vue'

defineOptions({ name: 'CommonTable' })

const props = defineProps({
  loading: propTypes.bool.def(false),
  exportImg: propTypes.bool.def(false),
  imgBase64Dict: propTypes.object.def({}),
  list: propTypes.array.def([]),
  border: propTypes.bool.def(false)
})

// 总花费占比
const allChargePercent = (currentValue) => {
  let maxValue = 0
  props.list.forEach((item: any) => {
    if (Number(item.allCharge) > maxValue) {
      maxValue = item.allCharge
    }
  })
  if (maxValue > 0 && currentValue && Number(currentValue) > 0) {
    return Number((Number(currentValue) / maxValue).toFixed(2))
  }
  return 0
}

// 费用占比(去退)占比
const percentageExpensesPercent = (currentValue) => {
  let maxValue = 0
  props.list.forEach((item: any) => {
    if (Number(item.percentageExpenses) > maxValue) {
      maxValue = item.percentageExpenses
    }
  })

  if (maxValue > 0 && currentValue && Number(currentValue) > 0) {
    return Number((Number(currentValue) / maxValue).toFixed(2))
  }
  return 0
}

const tableHeaderStyle = ({ rowIndex, columnIndex, column }) => {
  let textColor = '#666'
  if (column.property === 'allCharge') {
    //总花费
    textColor = '#0064FF'
  }
  if (column.property === 'percentageExpenses') {
    // 费用占比(去退)
    textColor = '#EB3737'
  }
  return {
    backgroundColor: '#F2F6FC',
    color: textColor,
    fontSize: '14px',
    fontWeight: '400',
    height: '40px'
  }
}
</script>

<style lang="scss" scoped>
.commonTable {
  padding-top: 10px;
  background: #fff;
  border-radius: 8px;
  .rankNoBg {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .rankNoImg {
    width: 38px;
    height: 42px;
  }
  .rankNoText {
    text-align: center;
    font-size: 20px;
    color: #0064ff;
    line-height: 23px;
  }
}
</style>
