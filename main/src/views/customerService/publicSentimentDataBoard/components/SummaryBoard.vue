<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2026-01-08 14:06:54
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-01-16 17:46:17
-->
<!--
 * @Description: 舆情汇总看板
-->
<template>
  <div class="board-section">
    <div class="data-cards">
      <div v-for="(item, index) in cardData" :key="index" class="data-card">
        <div class="card-content">
          <div class="card-left">
            <div class="metric-label"
              ><span>{{ item.label }}</span>
              <el-tooltip class="box-item" effect="dark" :content="item.tooltip" placement="top">
                <img :src="questionIcon" alt="" /> </el-tooltip
            ></div>
            <div class="metric-value">
              {{ item.value }}
            </div>
          </div>
          <div class="card-right">
            <img :src="item.icon" alt="" />
          </div>
          <div class="card-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
// import request from '@/config/axios'
import cardIcon1 from '@/assets/svgs/customerService/publicSentimentDataBoard/card-icon1.svg'
import cardIcon2 from '@/assets/svgs/customerService/publicSentimentDataBoard/card-icon2.svg'
import cardIcon3 from '@/assets/svgs/customerService/publicSentimentDataBoard/card-icon3.svg'
import cardIcon4 from '@/assets/svgs/customerService/publicSentimentDataBoard/card-icon4.svg'
import questionIcon from '@/assets/imgs/newMedia/question.svg'
// const { selectedDay } = inject('opinionDataBoard') as { selectedDay: Ref<string> }

// 卡片数值
const cardValues = ref({
  total: 0, // 舆情登记量
  inProgress: 0, // 处理中数量
  deleted: 0, // 删除数量
  notDeleted: 0 // 未删除数量
})

// 卡片数据
const cardData = computed(() => [
  {
    label: '舆情登记量',
    value: cardValues.value.total,
    icon: cardIcon1,
    tooltip: '已登记的舆情数量'
  },
  {
    label: '处理中数量',
    value: cardValues.value.inProgress,
    icon: cardIcon2,
    tooltip: '状态是进行中的数量'
  },
  {
    label: '删除数量',
    value: cardValues.value.deleted,
    icon: cardIcon3,
    tooltip: '舆情已经删除的数量'
  },
  {
    label: '未删除数量',
    value: cardValues.value.notDeleted,
    icon: cardIcon4,
    tooltip: '舆情登记但未删除的数量'
  }
])

// 获取数据
const getData = async (res: any) => {
  try {
    cardValues.value.total = res.djsl || 0
    cardValues.value.inProgress = res.jxzsl || 0
    cardValues.value.deleted = res.yscsl || 0
    cardValues.value.notDeleted = res.wscsl || 0
  } catch (error) {
    console.error('获取汇总数据失败:', error)
  }
}

defineExpose({ getData })
</script>

<style lang="scss" scoped>
@use '../style.scss';
.board-section {
  .data-cards {
    display: flex;
    gap: 19px;

    .data-card {
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 26px 30px;
      flex: 1;
      background: #fcfcfc;
      box-sizing: border-box;
      cursor: default;
      transition: all 0.3s;
      position: relative;

      .card-line {
        display: none;
        position: absolute;
        bottom: 7px;
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 3px;
        border-radius: 10px;
        opacity: 1;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(104, 127, 243, 0.4) 25%,
          rgba(104, 127, 243, 0.4) 78%,
          rgba(255, 255, 255, 0) 100%
        );
      }

      .card-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .card-left {
          flex: 1;

          .metric-label {
            font-size: 14px;
            color: #666;
            line-height: 20px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .metric-value {
            padding-top: 12px;
            font-size: 24px;
            font-weight: 500;
            color: #333;
            line-height: 1.5;
          }
        }

        .card-right {
          svg {
            display: block;
          }
        }
      }
    }
  }
}
</style>
