<!--
 * @Date: 2025-07-29 14:10:37
 * @Description: 打样进度组件
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
          <!-- 使用插槽渲染内容 -->

          <!-- 设计图 -->
          <div v-if="item.props == 'productPicture'">
            <div class="img-item">
              <div v-for="(it, index) in formatImg(item.text)" :key="index">
                <el-image v-if="it" class="img" :src="it" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                  :preview-src-list="formatImg(item.text)" show-progress :initial-index="4" fit="cover" />
              </div>
            </div>
          </div>
          <!-- 工艺文件 -->
          <div v-else-if="item.props == 'techniqueUrl'">
            <baseSmallImgAndFile :stringValue="item.text" />
          </div>
          <!-- 试穿样 -->
          <div v-else-if="item.props == 'tryOnAuditAttachment'">
            <baseSmallImgAndFile :stringValue="item.text" />
          </div>
          <!-- 齐色样 -->
          <div v-else-if="item.props == 'samplePicture'">
            <baseSmallImgAndFile :stringValue="item.text" />
          </div>
          <div v-else-if="item.props == 'samplePicture'">
            <div class="img-item">
              <div v-for="(it, index) in formatImg(item.text)" :key="index">
                <el-image v-if="it" class="img" :src="it" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                  :preview-src-list="formatImg(item.text)" show-progress :initial-index="4" fit="cover" />
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
import { defineProps } from 'vue'
import baseSmallImgAndFile from './baseSmallImgAndFile.vue'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  reviewDetail: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  // 新增配置项，指定哪些单元格使用插槽
  slotConfig: {
    type: Object,
    default: () => ({})
  }
})

const formatImg = (text) => {
  if (!text) return []
  const list = text.split(',')
  return list.map((item) => item.trim())
}

onMounted(() => {
  setTimeout(() => {
    // 确保在组件挂载后打印数据
    console.log(props.data, '!!!!!!1111')
    console.log(props.reviewDetail, '!!!!!!222')
  }, 1000)
})

// 根据数据生成表格结构
const tableData = computed(() => {
  const slotConfig = props.slotConfig
  const data = props.data
  return [
    [
      { text: '设计图', isLabel: true },
      {
        text: data.productPicture || '',
        isLabel: false,
        props: 'productPicture'
      },
      { text: '工艺文件', isLabel: true },
      {
        text: data.techniqueUrl || '',
        props: 'techniqueUrl',
        isLabel: false,
        merged: true,
        colspan: 3 // 标记合并3个单元格
      }
    ],
    [
      { text: '试穿样', isLabel: true },
      {
        text: data.tryOnAuditAttachment || '',
        isLabel: false,
        props: 'tryOnAuditAttachment'
      },
      { text: '齐色样', isLabel: true },
      {
        text: data.samplePicture || '',
        props: 'samplePicture',
        isLabel: false,
        merged: true,
        colspan: 3 // 标记合并3个单元格
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

    &.row-colspan-2 {
      grid-template-columns: 120px 1fr 120px 2fr 120px;
    }

    &.row-colspan-3 {
      // grid-template-columns: 120px 1fr 120px 2.6fr;
      grid-template-columns: 120px 1fr 120px 2fr 120px;
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
    border-radius: 4px;
    margin-right: 2px;
    margin-bottom: 4px;
  }
}
</style>
