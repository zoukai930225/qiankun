<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-18 10:30:00
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-30 13:57:56
-->
<template>
  <div class="main-container">
    <div class="person-list" v-if="data.length > 0">
      <div
        v-for="(item, index) in data"
        :key="index"
        :class="['person-item', isShort ? 'is-short' : '']"
      >
        <div class="person-info">
          <img :src="item.userAvatar || DefaultAvatar" alt="" />
        </div>
        <div class="person-amounts">
          <span class="person-name">{{ item.userName }}</span>
          <div class="amount-items">
            <div class="amount-item">
              <span class="amount-label">剪辑金额：</span>
              <span class="amount-value">¥ {{ item.editorBonus }}</span>
            </div>
            <div class="amount-item">
              <span class="amount-label">编导金额：</span>
              <span class="amount-value">¥ {{ item.directorBonus }}</span>
            </div>
          </div>
        </div>
        <div class="person-total">
          <span class="total-label">总金额：</span>
          <span class="total-value">¥ {{ item.bonusTotal }}</span>
        </div>
      </div>
    </div>
    <div class="section-empty" v-else>
      <img src="@/assets/imgs/newMedia/empty-img.svg" alt="" />
      <div class="empty-text">暂无内容</div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'

interface PersonItem {
  userName: string
  userAvatar: string
  editorBonus: number
  directorBonus: number
  bonusTotal: number
}

withDefaults(
  defineProps<{
    data: PersonItem[]
    isShort: boolean
  }>(),
  {
    isShort: false
  }
)
</script>

<style lang="scss" scoped>
@use '../style.scss';
.person-list {
  .person-item {
    display: flex;
    align-items: center;
    padding: 10px 0 19px;
    border-bottom: 1px solid #f0f0f0;
    &.is-short {
      padding: 10px 0 12px;
    }

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .person-info {
      margin-right: 8px;
      img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
    }

    .person-amounts {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      .person-name {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        line-height: 20px;
      }
      .amount-items {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .amount-item {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #666;
        &:first-child {
          position: relative;
          &::after {
            content: '';
            position: absolute;
            right: -10px;
            top: 1px;
            width: 1px;
            height: 10px;
            background-color: #e5e5e5;
          }
        }
      }
      .amount-value {
        line-height: 17px;
      }
    }

    .person-total {
      text-align: right;
      flex-shrink: 0;

      .total-label {
        font-size: 13px;
        color: #606266;
      }

      .total-value {
        font-size: 14px;
        color: #0064ff;
        font-weight: 600;
        margin-left: 4px;
      }
    }
  }
}
.section-empty {
  margin-top: 20px;
}
</style>
