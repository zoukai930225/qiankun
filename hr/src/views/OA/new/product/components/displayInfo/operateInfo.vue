<template>
  <div class="yunying-list">
    <div class="yunying-item">
      <div class="yunying-item-title">计划上架月份</div>
      <div class="yunying-item-content" :style="{ width: `${yunyingInfoInputWidth()}px` }">{{
        formatDate(reviewDetail?.planListDate, 'YYYY-MM-DD') || '--' }}
      </div>
    </div>
    <div class="yunying-item">
      <div class="yunying-item-title">包装方式</div>
      <div class="yunying-item-content" :style="{ width: `${yunyingInfoInputWidth()}px` }">{{
        reviewDetail?.packageMethod || '--'
      }}</div>
    </div>
    <div class="yunying-item">
      <div class="yunying-item-title">产品等级</div>
      <div class="yunying-item-content" :style="{ width: `${yunyingInfoInputWidth()}px` }">{{
        reviewDetail?.productGrade || '--'
      }}</div>
    </div>
    <div class="yunying-item">
      <div class="yunying-item-title">营销策略-预 估月销量</div>
      <div class="yunying-item-content" :style="{ width: `${yunyingInfoInputWidth()}px` }">{{
        reviewDetail?.monthCount || '--'
      }}</div>
    </div>

    <div class="yunying-item">
      <div class="yunying-item-title">拍摄规划时间</div>
      <div class="yunying-item-content" :style="{ width: `${yunyingInfoInputWidth()}px` }">{{
        formatDate(reviewDetail?.planShootTime, 'YYYY-MM-DD') || '--'
      }}</div>
    </div>

    <div class="yunying-item">
      <div class="yunying-item-title">是否收到拍摄样品</div>
      <div class="yunying-item-content" :style="{ width: `${yunyingInfoInputWidth()}px` }">{{
        reviewDetail?.isReceiveShootSample == '1'
          ? '是'
          : reviewDetail?.isReceiveShootSample == '0'
            ? '否'
            : '--'
      }}</div>
    </div>

    <div class="yunying-item">
      <div class="yunying-item-title">是否已上架</div>
      <div class="yunying-item-content" :style="{ width: `${yunyingInfoInputWidth()}px` }">{{
        designDetail?.isOnshelf == '1' ? '是' : '否'
      }}</div>
    </div>
    <div class="yunying-item">
      <div class="yunying-item-title">未上架原因</div>
      <div class="yunying-item-content" :style="{ width: `${yunyingInfoRemarkWidth()}px` }">{{
        designDetail?.notOnShelfReason || '--'
      }}</div>
    </div>
    <div class="yunying-item">
      <div class="yunying-item-title">运营备注</div>
      <div class="yunying-item-content" :style="{ width: `${yunyingInfoRemarkWidth()}px`, height: auto }">{{
        reviewDetail?.operationRemark || '--' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/formatTime'

const props = defineProps({
  reviewDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  designDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  yunyingInfoInputWidth: {
    type: Number,
    default: 0
  },
  yunyingInfoRemarkWidth: {
    type: Number,
    default: 0
  },
  categoryList: {
    type: Array,
    default: () => []
  }
})

const yunyingInfoInputWidth = () => {
  return props.yunyingInfoInputWidth
}
const yunyingInfoRemarkWidth = () => {
  return props.yunyingInfoRemarkWidth
}
</script>

<style lang="scss" scoped>
.yunying-list {
  width: calc(100%);
  // display: grid;
  // grid-template-columns: repeat(auto-fit, minmax(174px, 1fr));
  // grid-column-gap: 12px;
  display: flex;
  flex-wrap: wrap;

  .yunying-item {
    // width: 313px;
    // min-height: 100px;
    // background: rgb(153, 153, 153, 0.08);
    // border-radius: 10px;
    // padding: 14px;
    // box-sizing: border-box;
    margin-bottom: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.yunying-item-title {
  font-size: 14px;
  color: #999999;
  margin-bottom: 5px;
  width: 108px;
  text-align: right;
  padding-right: 10px;
}

.yunying-item-content {
  font-size: 14px;
  color: #666666;
  border-radius: 4px;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  min-height: 32px;
  line-height: 20px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
}

// 卖点
.yunying-maidian {
  width: 554px;
  min-height: 100px;
  background: rgb(153, 153, 153, 0.08);
  border-radius: 10px;
  padding: 14px;
  box-sizing: border-box;
}
</style>
