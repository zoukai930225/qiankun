<!--
 * @Description: 数据卡片组件
-->
<template>
  <!-- <div class="data-card-list">
    <div
      v-for="(card, index) in cards"
      :key="index"
      :class="['data-card', { clickable: card.clickable }]"
      @click="handleCardClick(card)"
    >
      <div class="card-label">{{ card.label }}</div>
      <div class="card-value">{{ card.value }}</div>
    </div>
  </div> -->
  <div class="data-cards">
    <div
      v-for="(item, index) in cards"
      :key="index"
      class="data-card"
      @click="handleCardClick(item)"
    >
      <div class="card-content">
        <div class="card-left">
          <div class="metric-label">{{ item.label }}</div>
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
</template>

<script lang="tsx" setup>
interface DataCard {
  label: string
  value: number | string
  clickable?: boolean
  onClick?: () => void
  icon?: string
}

defineProps<{
  cards: DataCard[]
}>()
const handleCardClick = (card: DataCard) => {
  if (card.clickable && card.onClick) {
    card.onClick()
  }
}
</script>

<style lang="scss" scoped>
.data-cards {
  display: flex;
  gap: 19px;
  padding-bottom: 30px;
  .data-card {
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 29px 20px;
    flex: 1;
    background: #fcfcfc;
    box-sizing: border-box;
    cursor: pointer;
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
    &:hover {
      background: linear-gradient(179deg, #ffffff 2%, #f4f5fc 97%);
      box-sizing: border-box;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
      .card-line {
        display: block;
      }
    }
    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .card-left {
        flex: 1;
        .metric-label {
          font-size: 18px;
          color: #333;
          line-height: 25px;
        }
        .metric-value {
          padding-top: 7px;
          font-size: 32px;
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
</style>
