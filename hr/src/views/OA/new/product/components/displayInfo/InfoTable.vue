<!--
 * @Date: 2025-07-29 14:10:37
-->
<template>
  <div class="info-table">
    <div class="table-row" v-for="(row, index) in tableData" :key="index">
      <div v-for="(item, itemIndex) in row" :key="itemIndex" class="table-cell" :class="{
        'label-cell': item.isLabel,
        'value-cell': !item.isLabel,
        'merged-cell': item.merged
      }" :style="item.bgColor ? { backgroundColor: item.bgColor } : {}">
        <div class="cell-content" :style="item.props == 'npPrenatalSampleInfoList' ? 'padding: 0' : ''">
          <!-- 使用插槽渲染内容 -->
          <div v-if="item.props == 'productType'">
            {{ item?.text == 0 ? '买手款' : item?.text == 1 ? '定制款' : '' }}
          </div>
          <!-- 拍摄规划时间 -->
          <div v-else-if="item.props == 'planShootTime'">
            {{ formatDate(item?.text, 'YYYY-MM-DD') || '--' }}
          </div>
          <!--  -->
          <div v-else-if="item.props == 'isReceiveShootSample'">
            {{ item.text == '0' ? '否' : item.text == '1' ? '是' : '--' }}
          </div>
          <!-- 销售目标拆解 -->
          <div v-else-if="item.props == 'salesTargetDismantling'">
            <baseSmallImgAndFile :stringValue="item.text" />
          </div>
          <div v-else-if="item.props == 'isSkuPackage'">
            {{ item.text ? '是' : '否' }}
          </div>
          <!-- 分SKU包装流程图 -->
          <div v-else-if="item.props == 'skuPackagePicture'">
            <baseSmallImgAndFile :stringValue="item.text" />
          </div>
          <!-- 下单明细 -->
          <!-- <div v-else-if="item.props == 'npPrenatalSampleInfoList'">
            <template v-if="item.text && item.text.length > 0">
              <div class="sample-info_title">
                <div class="title_column">颜色</div>
                <div class="title_column">尺码</div>
                <div class="title_column">编码</div>
                <div class="title_column">数量</div>
              </div>
              <div class="sample-info_list">
                <div class="list_row" v-for="textItem in item.text">
                  <div class="column_item">{{ textItem?.color }}</div>
                  <div class="column_item">{{ textItem?.size }}</div>
                  <div class="column_item">{{ textItem?.skuCode }}</div>
                  <div class="column_item">{{ textItem?.orderQuantity }}</div>
                </div>
              </div>
            </template>
          </div> -->
          <template v-else-if="item.slot">
            <div>
              <div>销售目标</div>
              <div v-if="item.slot === 'salesTargetFirstMonth'">(第一月)</div>
              <div v-if="item.slot === 'salesTargetSecondMonth'">(第二月)</div>
              <div v-if="item.slot === 'salesTargetThirdMonth'">(第三月)</div>
              <div v-if="item.slot === 'salesTargetQuarter'">(季度)</div>
            </div>
          </template>
          <!-- 默认文本内容 -->
          <template v-else>
            {{ item.text }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { defineProps } from 'vue'
import baseSmallImgAndFile from './baseSmallImgAndFile.vue'

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

// 根据数据生成表格结构
const tableData = computed(() => {
  const data = props.data
  const reviewDetail = props.reviewDetail
  const table = [
    [
      { text: '类型', isLabel: true },
      { text: reviewDetail.productType || '', isLabel: false, props: 'productType' },
      { text: '计划上架日期', isLabel: true },
      {
        text: reviewDetail.planListDate || '',
        isLabel: false,
        props: 'planListDate'
      },
      { text: '拍摄规划时间', isLabel: true },
      {
        text: reviewDetail.planShootTime || '',
        isLabel: false,
        props: 'planShootTime'
      }
    ],
    [
      { text: '售价', isLabel: true },
      { text: reviewDetail.price || '', isLabel: false },
      { text: '起订量', isLabel: true },
      { text: reviewDetail.minimumQuantity || '', isLabel: false },
      { text: '首单数量', isLabel: true },
      { text: reviewDetail.firstOrderQuantity || '', isLabel: false },

    ],
    [
      { text: '营销策略-预估月销量', isLabel: true },
      { text: reviewDetail.monthCount || '', isLabel: false },
      { text: '营销策略-预估季度销量', isLabel: true },
      { text: reviewDetail.seasonCount || '', isLabel: false },
      { text: '预估退货率', isLabel: true },
      { text: reviewDetail.estimatedReturnRate || '', isLabel: false },

    ],
    [
      { text: '新品销售月份', isLabel: true },
      { text: reviewDetail.npSalesMonth || '', isLabel: false },
      { text: '刚上新活动量规划', isLabel: true },
      { text: reviewDetail.activityVolumePlan || '', isLabel: false },
      { text: '链接详情页面主打方向', isLabel: true },
      { text: reviewDetail.linkDetailKeyFocus || '', isLabel: false },
    ],
    [
      { text: '是否收到拍摄样品', isLabel: true },
      {
        text: reviewDetail.isReceiveShootSample || '',
        isLabel: false,
        props: 'isReceiveShootSample'
      },
      { text: '包装编码', isLabel: true },
      { text: reviewDetail.packageCode || '', isLabel: false },
      { text: '是否分SKU包装', isLabel: true },
      { text: reviewDetail.isSkuPackage || '', isLabel: false, props: 'isSkuPackage' },
    ],
    [
      { text: '分SKU包装编码', isLabel: true },
      {
        text: reviewDetail.skuPackageCode || '',
        isLabel: false,
        // merged: false,
        // colspan: 3, // 标记合并3个单元格
        props: 'skuPackageCode'
      },
    ],
    [
      { text: '分SKU包装流程图', isLabel: true },
      {
        text: reviewDetail.skuPackagePicture || '', isLabel: false, props: 'skuPackagePicture'
      },
    ],
    // [
    //   { text: '下单明细', isLabel: true },
    //   { text: reviewDetail.npPrenatalSampleInfoList || '', isLabel: false, props: 'npPrenatalSampleInfoList' },
    // ],
    [
      { text: '运营备注', isLabel: true },
      {
        text: reviewDetail.operationRemark || '',
        isLabel: false,
        merged: true,
        colspan: 5 // 标记合并5个单元格
      }
    ],
    [
      {text: '销售目标(第一月)', isLabel: true, slot: 'salesTargetFirstMonth'},
      {text:reviewDetail.salesTargetFirstMonth || '', isLabel: false, props: 'salesTargetFirstMonth'},
      {text: '销售目标(第二月)', isLabel: true, slot: 'salesTargetSecondMonth'},
      {text:reviewDetail.salesTargetSecondMonth || '', isLabel: false, props: 'salesTargetSecondMonth'},
      {text: '销售目标(第三月)', isLabel: true, slot: 'salesTargetThirdMonth'},
      {text:reviewDetail.salesTargetThirdMonth || '', isLabel: false, props: 'salesTargetThirdMonth'},
    ],
    [
      { text: '销售目标(季度)', isLabel: true, slot: 'salesTargetQuarter' },
      {
        text: reviewDetail.salesTargetQuarter || '',
        isLabel: false,
        props: 'salesTargetQuarter',
      },
    ],
    
  ]
  if(reviewDetail.salesTargetDismantling) {
    table.push([
      { text: '销售目标拆解', isLabel: true },
      {
        text: reviewDetail.salesTargetDismantling || '',
        isLabel: false,
        props: 'salesTargetDismantling',
      },

    ])
  }
  return table
})

// 获取下单明细
const getOrderDetailInfo = (list: any) => {
  let str = ""
  if (list && list.length > 0) {
    list.forEach((item: any) => {
      str += `${item.skuName}(${item.skuCode}):${item.orderQuantity}；`
    })
  }
  return str
}
</script>

<style lang="scss" scoped>
.info-table {
  width: 100%;
  border: 1px solid #e5e5e5;
  background: #ffffff;

  .table-row {
    display: grid;
    grid-template-columns: 120px 1fr 120px 1fr 120px 1fr; // 使用grid布局，第一列固定120px，其余5列平均分配
    border-bottom: 1px solid #e5e5e5;

    &:last-child {
      border-bottom: none;
    }

    // 第4行：是否分SKU包装行
    // &:nth-child(5) {
    //   grid-template-columns: 120px 1fr 120px 2fr 120px;

    //   .table-cell:nth-child(4) {
    //     grid-column: 4 / 6; // 让第4个单元格跨越第4列和第5列
    //   }
    // }
    &:nth-child(6) {
      grid-template-columns: 120px 1fr; // 运营备注行只有2列
    }

    &:nth-child(7) {
      grid-template-columns: 120px 1fr; // 运营备注行只有2列
    }

    // &:nth-child(8) {
    //   grid-template-columns: 120px 1fr; // 运营备注行只有2列
    // }

    // // 第8行：运营备注行
    // &:nth-child(9) {
    //   grid-template-columns: 120px 1fr; // 运营备注行只有2列
    // }

    // &:nth-child(10) {
    //   grid-template-columns: 120px 1fr 120px 1fr 120px 1fr; // 运营备注行只有2列
    // }

    // &:nth-child(11) {
    //   grid-template-columns: 120px 1fr; // 运营备注行只有2列
    // }

    // &:nth-child(12) {
    //   grid-template-columns: 120px 1fr; // 运营备注行只有2列
    // }

    .table-cell {
      min-height: 40px;
      border-right: 1px solid #e5e5e5;
      display: flex;
      align-items: center;

      &:last-child {
        border-right: none;
      }

      &.label-cell {
        background: #f4f6fa;

        .cell-content {
          color: #666666;
          font-size: 14px;
        }
      }

      &.value-cell {
        background: #ffffff;

        .cell-content {
          color: #333333;
          font-size: 14px;
        }
      }

      // 合并单元格处理
      &.merged-cell {
        border-right: none;
      }

      .cell-content {
        padding: 8px 12px;
        width: 100%;
        word-break: break-all;
        line-height: 1.4;
      }
    }
  }
}

:deep(.custom_desc-item_label) {
  color: #666666 !important;
  font-weight: 400 !important;
  background-color: #f4f6fa !important;
  border: solid 1px #e5e5e5 !important;
}

.sample-info_title {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  .title_column {
    // max-width: 210px;
    // width: 210px;
    flex: 1;
    padding: 13px 0 12px 16px;
    box-sizing: border-box;
    border-right: 1px solid #E5E5E5;
    font-size: 14px;
    background: #F4F6FA;
    color: #666666;

    &:last-child {
      border-right: 0;
    }
  }
}

.sample-info_list {
  .list_row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    border-top: 1px solid #E5E5E5;
    box-sizing: border-box;

    .column_item {
      padding: 13px 16px 12px 16px;
      box-sizing: border-box;
      border-right: 1px solid #E5E5E5;
      font-size: 14px;
      word-break: break-all;

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
