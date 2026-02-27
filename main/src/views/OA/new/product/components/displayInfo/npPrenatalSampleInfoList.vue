<template>
  <div class="info-table">
    <div class="sample-info_title">
      <div class="title_column">颜色</div>
      <div class="title_column">尺码</div>
      <div class="title_column">编码</div>
      <div class="title_column">数量</div>
      <div class="title_column">实际下单数量</div>
    </div>
    <div class="sample-info_list">
      <el-scrollbar max-height="200px">
        <div class="list_row" v-for="textItem in reviewDetail.npPrenatalSampleInfoList">
          <div class="column_item">{{ textItem?.color }}</div>
          <div class="column_item">{{ textItem?.size }}</div>
          <div class="column_item">{{ textItem?.skuCode }}</div>
          <div class="column_item">{{ textItem?.orderQuantity }}</div>
          <div class="column_item">{{ textItem?.realOrderVolume }}</div>
        </div>
      </el-scrollbar>
      <div class="list_row sample-info_sum">
        <div class="column_item label">总计</div>
        <div class="column_item value"></div>
        <div class="column_item value"></div>
        <div class="column_item value">{{ getSum }}</div>
        <div class="column_item value">{{ getRealSum }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  reviewDetail: {
    type: Object,
    default: () => ({})
  }
})

const getSum = computed(() =>
  props.reviewDetail?.npPrenatalSampleInfoList?.reduce(
    (a: any, b: any) => a + Number(b.orderQuantity),
    0
  )
)
const getRealSum = computed(() =>
  props.reviewDetail?.npPrenatalSampleInfoList?.reduce(
    (a: any, b: any) => a + Number(b.realOrderVolume),
    0
  )
)
</script>

<style lang="scss" scoped>
.info-table {
  width: 100%;
  border: 1px solid #e5e5e5;
  background: #ffffff;
}

:deep(.custom_desc-item_label) {
  color: #666666 !important;
  font-weight: 400 !important;
  background-color: #f4f6fa !important;
  border: solid 1px #e5e5e5 !important;
}

.sample-info_title {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

  .title_column {
    // max-width: 210px;
    // width: 210px;
    flex: 1;
    padding: 13px 0 12px 16px;
    box-sizing: border-box;
    border-right: 1px solid #e5e5e5;
    font-size: 14px;
    background: #f4f6fa;
    color: #666666;

    &:last-child {
      border-right: 0;
    }
  }
}

.sample-info_list {
  .list_row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    border-top: 1px solid #e5e5e5;
    box-sizing: border-box;

    .column_item {
      padding: 13px 16px 12px 16px;
      box-sizing: border-box;
      border-right: 1px solid #e5e5e5;
      font-size: 14px;
      word-break: break-all;
      &.label {
        background: #fde6e6;
        color: #666666;
      }
      &:last-child {
        border-right: 0;
      }
    }
  }
}

// 响应式处理
@media (max-width: 768px) {
  .info-table {
    .table-row {
      display: flex;
      flex-direction: column;

      .table-cell {
        border-right: none;
        border-bottom: 1px solid #e5e5e5;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
