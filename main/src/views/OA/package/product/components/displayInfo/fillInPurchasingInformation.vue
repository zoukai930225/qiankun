<!--
 * @Date: 2025-07-29 14:10:37
 采购信息填写
-->
<template>
  <div class="info-table">
    <div class="table-row" v-for="(row, index) in tableData" :key="index" :class="getRowClass(row)">
      <div
        v-for="(item, itemIndex) in row"
        :key="itemIndex"
        class="table-cell"
        :class="{
          'label-cell': item.isLabel,
          'value-cell': !item.isLabel,
          'merged-cell': item.merged
        }"
        :style="item.bgColor ? { backgroundColor: item.bgColor } : {}"
      >
        <div class="cell-content">
          <div v-if="item.props == 'attachmentUrl'">
            <BaseSmallImgAndFile :stringValue="item.text" />
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
  }
})

// 根据数据生成表格结构
const tableData = computed(() => {
  const data = props.data
  return [
    [
      { text: '下单数量', isLabel: true },
      { text: data.orderNumber || '', isLabel: false },
      { text: '版费', isLabel: true },
      { text: data.editionFee || '', isLabel: false },
      { text: '金额', isLabel: true },
      {
        text: data.totalAmount || '',
        isLabel: false
      }
    ],
    [
      { text: '交货日期', isLabel: true },
      {
        text: data.deliveryDate || '',
        isLabel: false,
        merged: true,
        colspan: 5 // 标记合并5个单元格
      }
    ],
    [
      { text: '备注', isLabel: true },
      {
        text: data.remark || '',
        isLabel: false,
        merged: true,
        colspan: 5 // 标记合并5个单元格
      }
    ],
    [
      { text: '附件上传', isLabel: true },
      {
        text: data.attachmentUrl || '',
        isLabel: false,
        merged: true,
        colspan: 5, // 标记合并5个单元格
        props: 'attachmentUrl'
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
      grid-template-columns: 120px 1fr 120px 2.6fr;
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
