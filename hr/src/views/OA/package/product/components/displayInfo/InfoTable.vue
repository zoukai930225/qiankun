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
        <div class="cell-content">
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
  return [
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
      { text: '营销策略-预估月销量', isLabel: true },
      { text: reviewDetail.monthCount || '', isLabel: false },
      { text: '营销策略-预估季度销量', isLabel: true },
      { text: reviewDetail.seasonCount || '', isLabel: false }
    ],
    [
      { text: '预估退货率', isLabel: true },
      { text: reviewDetail.estimatedReturnRate || '', isLabel: false },
      { text: '新品销售月份', isLabel: true },
      { text: reviewDetail.npSalesMonth || '', isLabel: false },
      { text: '刚上新活动量规划', isLabel: true },
      { text: reviewDetail.activityVolumePlan || '', isLabel: false }
    ],
    [
      { text: '链接详情页面主打方向', isLabel: true },
      { text: reviewDetail.linkDetailKeyFocus || '', isLabel: false },
      { text: '是否收到拍摄样品', isLabel: true },
      {
        text: reviewDetail.isReceiveShootSample || '',
        isLabel: false,
        merged: true,
        colspan: 3, // 标记合并3个单元格
        props: 'isReceiveShootSample'
      }
    ],
    [
      { text: '运营备注', isLabel: true },
      {
        text: reviewDetail.operationRemark || '',
        isLabel: false,
        merged: true,
        colspan: 5 // 标记合并5个单元格
      }
    ], [
      { text: '销售目标拆解', isLabel: true },
      {
        text: reviewDetail.salesTargetDismantling || '',
        isLabel: false,
        props: 'salesTargetDismantling',
      },

    ],
  ]
})
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

    // 第4行：链接详情页面主打方向行
    &:nth-child(4) {
      grid-template-columns: 120px 1fr 120px 2fr 120px;

      .table-cell:nth-child(4) {
        grid-column: 4 / 6; // 让第4个单元格跨越第4列和第5列
      }
    }

    // 第5行：运营备注行
    &:nth-child(5) {
      grid-template-columns: 120px 1fr; // 运营备注行只有2列
    }

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
