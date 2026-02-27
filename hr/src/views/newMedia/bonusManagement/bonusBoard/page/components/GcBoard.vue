<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-17 14:00:00
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-22 13:51:47
-->
<template>
  <div class="board-card main-container">
    <div class="card-header">
      <div class="card-title">挂车/站内组看板</div>
    </div>
    <div class="gc-board-layout">
      <!-- 左侧：分组业绩总览 -->
      <el-card class="box-card">
        <template #header>
          <div class="section-header">
            <span class="section-label">分组业绩汇总</span>
          </div>
        </template>
        <div class="gc-left-section">
          <div class="group-cards-grid" v-if="gcGroupData.length > 0">
            <div
              v-for="(item, index) in gcGroupData"
              :key="index"
              class="group-card"
              :class="index % 2 === 0 ? 'blue-theme' : 'purple-theme'"
            >
              <div class="group-card-header">
                <span
                  class="group-number"
                  :class="[
                    [0, 2].includes(index) ? 'blue-theme' : '',
                    index === 1 ? 'purple-theme' : ''
                  ]"
                  >{{ index + 1 }}</span
                >
                <span class="group-name">{{ item.groupName }}</span>
              </div>
              <div class="group-card-content">
                <div class="group-card-stats">
                  <div class="stat-item">
                    <span class="stat-label">总GMV（元）</span>
                    <span class="stat-value">¥ {{ item.gmvTotal.toLocaleString() }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">作品数量</span>
                    <span class="stat-value">{{ item.num }}个</span>
                  </div>
                </div>
                <div class="group-card-bonus">
                  <span class="bonus-label">总奖金（元）</span>
                  <div class="bonus-value-wrapper">
                    <span class="bonus-value">¥ {{ item.bonusTotal.toLocaleString() }}</span>
                    <img :src="index % 2 === 0 ? gcIcon1 : gcIcon2" class="bonus-icon" alt="icon" />
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="
                (1 <= gcGroupData.length && gcGroupData.length < 3) ||
                (4 <= gcGroupData.length && gcGroupData.length < 6)
              "
              :class="[
                'empty-placeholder',
                gcGroupData.length === 1 || gcGroupData.length === 4 ? 'span-two' : ''
              ]"
            >
              <div class="section-empty">
                <img src="@/assets/imgs/newMedia/empty-img.svg" alt="" />
                <div class="empty-text">暂无内容</div>
              </div>
            </div>
          </div>
          <div class="section-empty" v-else>
            <img src="@/assets/imgs/newMedia/empty-img.svg" alt="" />
            <div class="empty-text">暂无内容</div>
          </div>
        </div>
      </el-card>

      <el-card class="box-card box-card-right">
        <!-- 右侧：个人金额合计分析 -->
        <template #header>
          <div class="section-header">
            <span class="section-label">个人奖金汇总</span>
            <el-button
              text
              type="primary"
              class="more-btn"
              v-if="showGcMore"
              @click="handleShowMore"
            >
              查看更多
              <el-icon class="ml-4px"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </template>
        <div class="gc-right-section">
          <person-amount-list
            :data="displayPersonData"
            :is-short="gcGroupData.length <= 3"
            v-if="gcPersonData.length > 0"
          />
          <div class="section-empty" v-else>
            <img src="@/assets/imgs/newMedia/empty-img.svg" alt="" />
            <div class="empty-text">暂无内容</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import gcIcon1 from '@/assets/imgs/newMedia/gc-icon-1.svg'
import gcIcon2 from '@/assets/imgs/newMedia/gc-icon-2.svg'
import PersonAmountList from './tables/PersonAmountList.vue'
import request from '@/config/axios'

const emit = defineEmits(['show-detail'])
const { selectedMonth } = inject('bonusBoard') as { selectedMonth: Ref<string> }
// onMounted(async () => {
//   getData()
// })
const getData = async () => {
  await getGcGroupData()
}
const getGcGroupData = async () => {
  const res = await request.get({
    url: '/api/nmBonusBoard/getTrailerBoard',
    params: { month: selectedMonth.value }
  })
  console.log(res)
  gcGroupData.value = res.groupBoard || []
  gcPersonData.value = res.personBoard || []
}

// 挂车/站内组 - 分组数据
const gcGroupData = ref<any[]>([])

// 挂车/站内组 - 人员数据
const gcPersonData = ref<any[]>([])

// 显示数据（前7条）
const displayPersonData = computed(() =>
  gcGroupData.value.length > 3 ? gcPersonData.value.slice(0, 7) : gcPersonData.value.slice(0, 4)
)
const showGcMore = computed(
  () =>
    (gcGroupData.value.length > 3 && gcPersonData.value.length > 7) ||
    (gcGroupData.value.length <= 3 && gcPersonData.value.length > 4)
)

// 查看更多
const handleShowMore = () => {
  emit('show-detail', {
    type: 'gcPerson',
    title: '个人金额合计分析明细',
    data: gcPersonData.value
  })
}

defineExpose({
  getData
})
</script>

<style lang="scss" scoped>
@use './style.scss';
.gc-board-layout {
  display: flex;
  gap: 20px;
  padding: 0 16px 16px;
  .box-card {
    width: calc(50% - 10px);
    .section-header {
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &.box-card-right {
      padding-left: 0;
      :deep(.el-card__body) {
        padding: 10px 20px 16px;
      }
    }
  }
}

// 分组卡片网格
.group-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  // 空数据占位符
  .empty-placeholder {
    &.span-two {
      grid-column: span 2; // 占据2列空间
    }
  }

  .group-card {
    border-radius: 8px;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    border: 0.95px solid #e5e5e5;
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    &.blue-theme {
      background: #f4f8ff;
      .bonus-value {
        color: #0064ff;
      }
    }

    &.purple-theme {
      background: #f5f3ff;
      .bonus-value {
        color: #7357ff;
      }
    }

    .group-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 20px;
      border-bottom: 1px solid #e5e5e5;
      .group-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        font-size: 14px;
        background-color: #ededed;
        &.blue-theme {
          background: rgba(0, 100, 255, 0.12);
          color: #0064ff;
        }
        &.purple-theme {
          background: rgba(115, 87, 255, 0.12);
          color: #7357ff;
        }
      }

      .group-name {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
      }
    }

    .group-card-content {
      padding: 16px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 20px;
        width: 1px;
        height: 46px;
        background-color: #e5e5e5;
      }
    }

    .group-card-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 19px;
      padding-right: 10px;

      .stat-item {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .stat-label {
          font-size: 12px;
          color: #666666;
          line-height: 17px;
        }

        .stat-value {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
          line-height: 20px;
        }
      }
    }

    .group-card-bonus {
      border: 1px solid #e5e5e5;
      background-color: #fff;
      border-radius: 6px;
      padding: 12px;
      position: relative;
      .bonus-label {
        font-size: 12px;
        color: #666666;
      }

      .bonus-value-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;

        .bonus-value {
          font-size: 20px;
          font-weight: 500;
        }

        .bonus-icon {
          position: absolute;
          right: 10px;
          bottom: 7px;
          width: 48px;
          height: 48px;
        }
      }
    }
  }
}
</style>
