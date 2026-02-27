<!--
 * @Date: 2025-07-29 14:10:37
 报价核价
-->
<template>
  <div class="info-table">
    <div class="table-row" v-for="(row, index) in tableData" :key="index" :class="getRowClass(row)">
      <div v-for="(item, itemIndex) in row" :key="itemIndex" class="table-cell" :class="{
        'label-cell': item.isLabel,
        'value-cell': !item.isLabel,
        'merged-cell': item.merged
      }" :style="item.bgColor ? { backgroundColor: item.bgColor } : {}">
        <div class="cell-content">
          <div v-if="item.props == 'quotationSheet'">
            <BaseSmallImgAndFile :stringValue="item.text" :defaultFileName="'报价单'"/>
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
import { defineProps } from 'vue'
import BaseSmallImgAndFile from './baseSmallImgAndFile.vue'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  reviewDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

onMounted(() => {
  setTimeout(() => {
    // 确保在组件挂载后打印数据
    console.log(props.data, '!!!!!!1111')
    console.log(props.reviewDetail, '!!!!!!222')
  }, 1000)
})

// 根据数据生成表格结构
const tableData = computed(() => {
  const data = props.data
  return [
    [
      { text: '生命周期', isLabel: true },
      { text: data.lifeCycle || '', isLabel: false, props: 'lifeCycle' },
      { text: '单色起订量', isLabel: true },
      { text: data.singleColorOrderQuantity || '', isLabel: false },
      { text: '包材费用(元)', isLabel: true },
      { text: data.packagingCostNew, isLabel: false }
    ],
    [
      { text: '含税裸货价(元)', isLabel: true },
      {
        text: data.productCostIncludingTax, isLabel: false
      },
      { text: '包装人工费(元)', isLabel: true },
      { text: data.packagingManpowerNew, isLabel: false, props: 'packagingManpowerNew' },
      { text: '成品价(元)', isLabel: true },
      { text: data.finishedProductPrice, isLabel: false }
    ],
    [
      { text: '不含税裸货价(元)', isLabel: true },
      { text: data.productCostExcludingTax, isLabel: false },
      { text: '成品成本补充', isLabel: true },
      {
        text: data.productCost,
        isLabel: false,
        merged: true,
        colspan: 3
      },
    ],
    [
      { text: '备注', isLabel: true },
      {
        text: data.quotationRemark || '',
        isLabel: false,
        merged: true,
        colspan: 5 // 标记合并5个单元格
      }
    ],
    [
      { text: '报价单', isLabel: true },
      {
        text: data.quotationSheet || '',
        isLabel: false,
        merged: true,
        colspan: 5, // 标记合并5个单元格
        props: 'quotationSheet'
      }
    ]
  ]
})

// 添加这个方法
const getRowClass = (row) => {
  const mergedCell = row.find((item) => item.merged && item.colspan)

  if (mergedCell) {
    if (mergedCell.colspan == 3) {
      return 'row-colspan-3'
    } else if (mergedCell.colspan == 4) {
      return 'row-colspan-4'
    } else if (mergedCell.colspan == 5) {
      return 'row-colspan-5'
    }
  }

  return 'row-default'
}
</script>

<style lang="scss" scoped>
.info-table {
  width: 100%;
  border: 1px solid #e5e5e5;
  background: #ffffff;

  .table-row {
    display: grid;
    border-bottom: 1px solid #e5e5e5;

    &:last-child {
      border-bottom: none;
    }

    &.row-default {
      grid-template-columns: 120px 1fr 120px 1fr 120px 1fr;
    }

    &.row-colspan-3 {
      grid-template-columns: 120px 1fr 120px 2fr 120px;

      .table-cell:nth-child(4) {
        grid-column: 4 / 6; // 让第4个单元格跨越第4列和第5列
      }
    }


    &.row-colspan-5 {
      grid-template-columns: 120px 1fr;
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

.user-info-wapper {
  display: flex;
  flex-wrap: wrap;

  .user-info {
    display: flex;
    flex-direction: row;

    .name {
      color: #3d3d3d;
      font-size: 14px;
    }

    .avator {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      margin-right: 4px;
    }
  }
}
</style>
