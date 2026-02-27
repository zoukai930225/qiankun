<!--
 * @Date: 2025-07-29 14:10:37
 资质资料信息
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
          <div v-if="item.props == 'washLabel'">
            <BaseSmallImgAndFile :stringValue="item.text" />
          </div>

          <div v-else-if="item.props == 'tmPicture'">
            <BaseSmallImgAndFile :stringValue="item.text" />
          </div>
          <div v-else-if="item.props == 'sizeChart'">
            <BaseSmallImgAndFile :stringValue="item.text" />
          </div>
          <div v-else-if="item.props == 'qualificationFile'">
            <BaseSmallImgAndFile :stringValue="item.text" />
          </div>
          <div v-else-if="item.props == 'paperSample'">
            <BaseSmallImgAndFile :stringValue="item.text" />
          </div>
          <div v-else-if="item.props == 'materialCard'">
            <BaseSmallImgAndFile :stringValue="item.text" />
          </div>
          <div v-else-if="item.props == 'approvalForm'">
            <BaseSmallImgAndFile :stringValue="item.text" />
          </div>
          <!-- 卖点/功能 -->
          <div v-else-if="item.props == 'salePointRemark'">
            <div v-if="item.text">
              <div class="sale-point-line" v-for="(txt,index) in item.text.split('&#&')">
               {{ `${(index + 1)}、${txt}` }}
              </div>
            </div>
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
// import { defineProps } from 'vue'
import BaseSmallImgAndFile from './baseSmallImgAndFile.vue'
import { getDictLabel,DICT_TYPE } from '@/utils/dict'
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
      { text: '面料成分', isLabel: true },
      {
        text: data.component || '',
        isLabel: false,
        merged: true,
        colspan: 5, // 标记合并5个单元格
      }
    ],
    [
      { text: '材料备注', isLabel: true },
      {
        text: data.materialRemark || '',
        props: 'materialRemark',
        isLabel: false,
        merged: true,
        colspan: 5, // 标记合并5个单元格
      }
    ],
    [
      { text: '卖点/功能', isLabel: true },
      {
        text: data.salePointRemark || '',
        isLabel: false,
        props: 'salePointRemark',
        merged: true,
        colspan: 5, // 标记合并5个单元格
      },
    ],
    [
      { text: '安全类别', isLabel: true },
      {
        text: getDictLabel(DICT_TYPE.SECURITY_CATEGORY,data.securityCategory) || '',
        isLabel: false,
        props: 'securityCategory'
      },
      { text: '执行标准', isLabel: true },
      {
        text: getDictLabel(DICT_TYPE.EXECUTION_STANDARDS,data.executionStandards) || '',
        props: 'executionStandards',
        isLabel: false,
        merged: true,
        colspan: 3 // 标记合并3个单元格
      }
    ],
    [
      { text: '洗唛标识', isLabel: true },
      { text: data.washLabel || '', isLabel: false, props: 'washLabel',
        merged: true,
        colspan: 5 // 标记合并3个单元格 
      }
    ],
    [
      { text: '尺码表', isLabel: true },
      { text: data.sizeChart || '', isLabel: false, props: 'sizeChart',
        merged: true,
        colspan: 5 // 标记合并3个单元格 
      },
    ],
    [
      { text: '纸样', isLabel: true },
      { text: data.paperSample || '', isLabel: false, props: 'paperSample',
        merged: true,
        colspan: 5 // 标记合并3个单元格 
      },
    ],
    [
      
      { text: '物料卡', isLabel: true },
      { text: data.materialCard || '', isLabel: false, props: 'materialCard',
        merged: true,
        colspan: 5 // 标记合并3个单元格 
        },
    ],
    [
      { text: '批复单', isLabel: true },
      { text: data.approvalForm || '', isLabel: false, props: 'approvalForm',
         merged: true,
        colspan: 5,
       },
    ],
    [
      { text: '资质文件', isLabel: true },
      {
        text: data.qualificationFile || '',
        isLabel: false,
        merged: true,
        colspan: 5, // 标记合并5个单元格
        props: 'qualificationFile'
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
    box-sizing: border-box;

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

.sale-point-line {
  font-size: 14px;
  color: #333333;
  padding: 12px 4px 12px 16px;
  border-bottom:1px solid #E5E5E5;
  margin-left: -12px;
  margin-right: -12px;
  &:first-child {
    padding-top: 4px;
  }
  &:last-child {
    padding-bottom: 4px;
    border-bottom: 0;
  }
}
</style>
