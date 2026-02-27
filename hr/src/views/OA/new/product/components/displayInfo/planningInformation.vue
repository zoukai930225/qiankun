<!--
 * @Date: 2025-07-29 14:10:37
 企划信息组件
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
          <!-- 企划类型 -->
          <div v-if="item.props == 'planType'">
            {{ getDictLabel(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, Number(item.text || '')) }}
          </div>
          <!-- 产品类型 -->
          <div v-else-if="item.props == 'planProductType'">
            {{ getDictLabel(DICT_TYPE.NP_ENTERPRISE_PRODUCTTYPE, Number(item.text || '')) }}
          </div>
          <!-- 产品等级 -->
          <div v-else-if="item.props == 'isCore'">
            {{ productLevel(item.text) }}
          </div>
          <!-- store -->
          <div v-else-if="item.props == 'store'">
            <div v-if="item.text == '全渠道'">{{ item.text }}</div>
            <div v-else>
              {{ getStoreName(item.text) }}
            </div>
          </div>
          <!-- 竞品链接 -->
          <div v-else-if="item.props == 'competitionLink'">
            <div :style="{ cursor: 'pointer', color: '#0064FF' }" @click="openLink(item.text)">{{
              item.text
            }}</div>
          </div>
          <!-- 销售目标拆解 -->
          <div v-else-if="item.props == 'salesTargetDismantling'">
            <baseSmallImgAndFile :stringValue="item.text" />
          </div>

          <div v-else-if="item.props == 'productDiagramReference'">
            <baseSmallImgAndFile :stringValue="item.text" />
          </div>

          <div v-else-if="item.props == 'productPrice'">
            <baseSmallImgAndFile :stringValue="item.text" />
          </div>
          <!-- 市场分析 -->
          <div v-else-if="item.props == 'marketAnalysis'">
            <baseSmallImgAndFile :stringValue="item.text" />
          </div>
          <!-- 需求分析 -->
          <div v-else-if="item.props == 'demandAnalysis'">
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
import * as TagMngApi from '@/api/tagMng'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { getChannelNameById } from '@/utils/index'
import { isUrl } from '@/utils/is'

import { defineProps } from 'vue'
import baseSmallImgAndFile from './baseSmallImgAndFile.vue'
const storsList = ref<any[]>([])

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

/** 初始化 **/
onMounted(async () => {
  getAllData()
})

//获取渠道名称
function getStoreName(value: string) {
  const valueAttr = storsList.value.filter((item) => item.storeCode == value)
  return getChannelNameById(valueAttr[0]?.platformId)
}
// 获取所有店铺信息
async function getAllData() {
  try {
    const res = await TagMngApi.getQueryChannels()
    storsList.value = res
  } catch (error) {}
}

const productLevel = (isCore) => {
  if (isCore) {
    return getDictLabel(DICT_TYPE.NP_PRODUCTGRADE, isCore) || '--'
  }
  return '--'
}

const openLink = (link) => {
  if (isUrl(link)) {
    window.open(link, '_blank')
  } else {
    ElMessage.warning('非链接无法跳转')
  }
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
  const data = props.data
  const reviewDetail = props.reviewDetail
  return [
    [
      { text: '企划类型', isLabel: true },
      {
        text: reviewDetail.planType || '',
        isLabel: false,
        props: 'planType'
      },
      { text: '产品类型', isLabel: true },
      {
        text: reviewDetail.planProductType || '',
        isLabel: false,
        props: 'planProductType'
      },
      { text: '企划名称', isLabel: true },
      {
        text: reviewDetail.planName || '',
        isLabel: false
      }
    ],
    [
      { text: '原编码', isLabel: true },
      {
        text: data.oldGoodsNo || '',
        isLabel: false,
        props: 'oldGoodsNo'
      },
      { text: '是否新建编码', isLabel: true },
      {
        text: data.isCreateGoodsNo ? (Number(data.isCreateGoodsNo) === 1 ? '是' : '否') : '',
        isLabel: false,
        props: 'isCreateGoodsNo',
        merged: true,
        colspan: 3
      }
    ],
    [
      { text: '店铺', isLabel: true },
      {
        text: reviewDetail.storeName || '',
        isLabel: false,
        props: 'storeName'
      },
      { text: '产品等级', isLabel: true },
      {
        text: reviewDetail.isCore || '',
        isLabel: false,
        props: 'isCore'
      },
      { text: '目标客群', isLabel: true },
      {
        text: reviewDetail.targetAudience || '',
        isLabel: false,
        props: 'targetAudience'
      }
    ],
    [
      { text: '预计拍摄日期', isLabel: true },
      {
        text: reviewDetail.estimatedShootingDate || '',
        isLabel: false
      },
      { text: '销售目标(第一月)', isLabel: true },
      {
        text: reviewDetail.salesTargetFirstMonth || '',
        isLabel: false,
        props: 'salesTargetFirstMonth'
      },
      { text: '销售目标(第二月)', isLabel: true },
      {
        text: reviewDetail.salesTargetSecondMonth || '',
        isLabel: false,
        props: 'salesTargetSecondMonth'
      },
    ],
    [
       { text: '销售目标(第三月)', isLabel: true },
      {
        text: reviewDetail.salesTargetThirdMonth || '',
        isLabel: false,
        props: 'salesTargetThirdMonth'
      },
      { text: '销售目标季度', isLabel: true },
      {
        text: reviewDetail.salesTargetQuarter || '',
        isLabel: false,
        props: 'salesTargetQuarter'
      },
      { text: '计划上架日期', isLabel: true },
      {
        text: reviewDetail.planListDate || '',
        isLabel: false,
        props: 'planListDate'
      }
    ],
    [
      { text: '企划时间', isLabel: true },
      {
        text: reviewDetail.planningTime || '',
        isLabel: false
      },
      { text: '计划下单日期', isLabel: true },
      {
        text: reviewDetail.planOrderDate || '',
        isLabel: false,
        props: 'planOrderDate'
      },
      { text: '大货到仓日期', isLabel: true },
      {
        text: reviewDetail.goodsToWarehouseDate || '',
        isLabel: false,
        props: 'goodsToWarehouseDate'
      }
    ],
    [
      { text: '竞品链接', isLabel: true },
      {
        text: reviewDetail.competitionLink || '',
        isLabel: false,
        props: 'competitionLink',
        merged: true,
        colspan: 5 // 标记合并5个单元格
      }
    ],
    [
      { text: '风险点', isLabel: true },
      {
        text: reviewDetail.productRisk || '',
        isLabel: false,
        merged: true,
        colspan: 5 // 标记合并5个单元格
      }
    ],
    [
      { text: '产品需求', isLabel: true },
      {
        text: data.remark || '',
        isLabel: false,
        merged: true,
        colspan: 5 // 标记合并5个单元格
      }
    ],
    [
      { text: '产品图参考', isLabel: true },
      {
        text: reviewDetail.productDiagramReference || '',
        isLabel: false,
        props: 'productDiagramReference',
        colspan: 2 // 标记合并3个单元格
      },
      { text: '产品定价', isLabel: true },
      {
        text: reviewDetail.productPrice || '',
        isLabel: false,
        props: 'productPrice',
        colspan: 2 // 标记合并3个单元格
      },
      { text: '市场分析', isLabel: true },
      {
        text: reviewDetail.marketAnalysis || '',
        isLabel: false,
        props: 'marketAnalysis',
        colspan: 2 // 标记合并3个单元格
      }
    ],
    [
      { text: '需求分析', isLabel: true },
      {
        text: reviewDetail.demandAnalysis || '',
        isLabel: false,
        props: 'demandAnalysis',
        merged: true,
        colspan: 2 // 标记合并3个单元格
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
        white-space: wrap;
        word-wrap: break-word;

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
