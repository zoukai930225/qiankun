<!--
品类信息
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
          <div v-if="item.props == 'category'">
            {{ formatCategory(item.text) }}
          </div>
          <div v-else-if="item.props == 'salePoint'">
            <div v-html="item.text"></div>
          </div>
          <div v-else-if="item.props == 'productType'">
            {{ item.text == '0' ? '买手款' : item.text == '1' ? '定制款' : '' }}
          </div>
          <!-- 包装图片 -->
          <div v-else-if="item.props == 'unRoutinePackagePicture'">
            <div class="img-item">
              <el-image
                v-for="(it, index) in formatImg(item.text)"
                class="img"
                :key="index"
                :src="it"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="formatImg(item.text)"
                show-progress
                :initial-index="4"
                fit="cover"
              />
            </div>
          </div>
          <!-- 包装了流程图 -->
          <div v-else-if="item.props == 'packageProgressPicture'">
            <div class="img-item">
              <el-image
                v-for="(it, index) in formatImg(item.text)"
                class="img"
                :key="index"
                :src="it"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="formatImg(item.text)"
                show-progress
                :initial-index="4"
                fit="cover"
              />
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
import { defineProps } from 'vue'
import { useCategoryList } from './hooks'
const { categoryList } = useCategoryList()

const props = defineProps({
  reviewDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

const formatImg = (text) => {
  if (!text) return []
  const list = text.split(',')
  return list.map((item) => item.trim())
}

const formatCategory = (code) => {
  const item = categoryList.value.find((item) => item.code === code)
  return item ? item.name : ''
}

// 根据数据生成表格结构
const tableData = computed(() => {
  const reviewDetail = props.reviewDetail
  return [
    [
      { text: '系列', isLabel: true },
      { text: reviewDetail.series || '', isLabel: false, props: 'series' },
      { text: '备注', isLabel: true },
      {
        text: reviewDetail.seriesRemark || '',
        isLabel: false,
        merged: true,
        colspan: 3, // 标记合并3个单元格
        props: 'salePoint'
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

.img-item {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .img {
    width: 68px;
    height: 68px;
    margin-right: 2px;
    margin-bottom: 4px;
  }
}
</style>
