<!--
 * @Date: 2025-07-29 14:10:37
 负责人信息组件
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
          <!-- 企业负责人 -->
          <div v-if="item.props == 'enterprisePlanPersonChargeList'" class="user-info-wapper">
            <div v-for="it in item.text" :key="it.userId" class="user-info">
              <img :src="it.avatarOrigin" alt="" class="avator" />
              <span class="name">{{ it.name }}</span>
            </div>
          </div>

          <!-- 产研负责人 -->
          <div v-else-if="item.props == 'productSuperintendentList'" class="user-info-wapper">
            <div v-for="it in item.text" :key="it.userId" class="user-info">
              <img :src="it.avatarOrigin" alt="" class="avator" />
              <span class="name">{{ it.name }}</span>
            </div>
          </div>
          <!-- 运营负责人 -->
          <div v-else-if="item.props == 'operateManageIdList'" class="user-info-wapper">
            <div v-for="it in item.text" :key="it.userId" class="user-info">
              <img :src="it.avatarOrigin" alt="" class="avator" />
              <span class="name">{{ it.name }}</span>
            </div>
          </div>
          <!-- 选供负责人 -->
          <div v-else-if="item.props == 'chosenSupplierStaffList'" class="user-info-wapper">
            <div v-for="it in item.text" :key="it.userId" class="user-info">
              <img :src="it.avatarOrigin" alt="" class="avator" v-if="it.avatarOrigin" />
              <span class="name" v-if="it.name">{{ it.name }}</span>
            </div>
          </div>
          <!-- 采购负责人 -->
          <div v-else-if="item.props == 'procurementManagerIdList'" class="user-info-wapper">
            <div>
              <div v-for="it in item.text" :key="it.userId" class="user-info">
                <img :src="it.avatarOrigin" alt="" class="avator" v-if="it.avatarOrigin" />
                <span class="name" v-if="it.name">{{ it.name }}</span>
              </div>
            </div>
          </div>
          <!-- 项目经理 -->
          <div v-else-if="item.props == 'projectManagerList'" class="user-info-wapper">
            <div>
              <div v-for="it in item.text" :key="it.userId" class="user-info">
                <img :src="it.avatarOrigin" alt="" class="avator" v-if="it.avatarOrigin" />
                <span class="name" v-if="it.name">{{ it.name }}</span>
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

// 根据数据生成表格结构
const tableData = computed(() => {
  const data = props.data
  return [
    [
      { text: '企划负责人', isLabel: true },
      {
        text: data.enterprisePlanPersonChargeList || [],
        isLabel: false,

        props: 'enterprisePlanPersonChargeList'
      },
      { text: '产研负责人', isLabel: true },
      {
        text: data.productSuperintendentList || [],
        isLabel: false,

        props: 'productSuperintendentList'
      },
      { text: '运营负责人', isLabel: true },
      {
        text: data.operateManageIdList || [],
        isLabel: false,

        props: 'operateManageIdList'
      }
    ],
    [
      { text: '选供负责人', isLabel: true },
      {
        text: data.chosenSupplierStaffList || '12%',
        isLabel: false,
        props: 'chosenSupplierStaffList'
      },
      { text: '采购负责人', isLabel: true },
      {
        text: data.procurementManagerIdList || '是',
        props: 'procurementManagerIdList',
        isLabel: false,
        // merged: true,
        // colspan: 3 // 标记合并3个单元格
      },
      { text: '项目经理', isLabel: true },
      {
        text: data.projectManagerList || '是',
        props: 'projectManagerList',
        isLabel: false,
        // merged: true,
        // colspan: 3 // 标记合并3个单元格
      },
    ],
    [
      { text: '货品编码', isLabel: true, bgColor: 'rgba(234, 0, 0, 0.1)' },
      { text: data.productCode || '', isLabel: false },
      { text: '商品ID', isLabel: true, bgColor: 'rgba(234, 0, 0, 0.1)' },
      { text: data.goodsId || '', isLabel: false },
      { text: '供应商', isLabel: true, bgColor: 'rgba(234, 0, 0, 0.1)' },
      { text: data.supplier || '', isLabel: false }
    ],
    [
      { text: '选品理由', isLabel: true, bgColor: 'rgba(234, 0, 0, 0.1)' },
      {
        text: data.chooseReason || '',
        isLabel: false,
        merged: true,
        colspan: 5 // 标记合并5个单元格
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
    margin-right: 10px;
    &:last-child {
      margin: 0;
    }
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
