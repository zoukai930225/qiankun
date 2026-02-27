<template>
  <div class="supplier-card" :class="!list || list.length === 0 ? 'flex-center' : ''">
    <el-carousel
      height="235px"
      v-if="list && list.length > 0"
      :autoplay="false"
      :indicator-position="!list || list.length <= 1 ? 'none' : 'outside'"
      trigger="click"
      :arrow="!list || list.length <= 1 ? 'never' : 'hover'"
    >
      <el-carousel-item v-for="item in list" :key="item.name">
        <div class="card-item">
          <div class="info-content">
            <img class="img" :class="!item.url ? 'none' : ''" :src="item.url || supplier" />
            <div class="info">
              <div class="name">{{ item.shortName || '-' }}</div>
              <div class="total-name">
                <div>{{ item.fullName || '-' }}</div>
              </div>
            </div>
          </div>
          <div>
            <div class="second-title">最近采购记录</div>
            <template v-if="item.latestOrderDetailInfo && item.latestOrderDetailInfo.length > 0">
              <template v-for="order in item.latestOrderDetailInfo.slice(2)">
                <div class="record-content">
                  <div class="line">
                    <div>{{ order.sku }}</div>
                    <div>{{ format(order.purchaseNum) || 0 }}件</div>
                  </div>
                  <div class="line">
                    <div style="color: #999999">{{
                      order.createTime ? formatTime(order.createTime, 'yyyy-MM-dd') : '-'
                    }}</div>
                  </div>
                </div>
              </template>
            </template>
            <div
              v-else
              style="
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-top: -60px;
              "
            >
              <img src="@/assets/svgs/oa/recordEmpty.svg" alt="" style="width:" />
              <div style="color: #999999; font-size: 14px">暂无记录</div>
            </div>

            <!-- <div class="record-content">
              <div class="line">
                <div>C267-bai-F</div>
                <div>5000件</div>
              </div>
              <div class="line">
                <div style="color: #999999">2025-12-09</div>
                <div style="color: #db6a0f">生产中</div>
              </div>
            </div> -->
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div v-else>
      <img src="@/assets/svgs/oa/imgEmpty.svg" alt="" />
      <div class="empty">暂无内容</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import supplier from '@/assets/svgs/oa/supplier.svg'
import { formatTime } from '@/utils'
import { numberFormatter } from '@/utils/formatter'

const format = (value: any) => {
  return numberFormatter(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.supplier-card {
  height: 235px;
  padding-top: 16px;
  &.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card-item {
    height: 235px;
    background: #f9fafc;
    border-radius: 10px;
    padding: 16px;
    box-sizing: border-box;
    .info-content {
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: solid 1px #e5e5e5;
      .img {
        width: 64px;
        height: 64px;
        box-sizing: border-box;
        border: 1px solid #e5e5e5;
        background: #eff3ff;
        border-radius: 4px;
        &.none {
          padding: 12px;
        }
      }
      .info {
        flex: 1;
        padding-left: 20px;
        .name {
          font-size: 22px;
          font-weight: 500;
          color: #333333;
        }
        .total-name {
          font-size: 16px;
          color: #666666;
          padding-top: 16px;
          word-break: break-all;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
    .second-title {
      font-size: 14px;
      font-weight: 500;
      color: #666666;
      padding: 10px 0;
    }
    .record-content {
      padding: 10px 0;
      .line {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #333333;
        padding-bottom: 6px;
        &:last-child {
          padding-bottom: 0;
        }
      }
    }
  }

  .empty {
    margin-top: 16px;
    text-align: center;
    font-size: 14px;
    color: #999999;
  }
}

:deep() {
  .el-carousel__indicators {
    .el-carousel__indicator {
      padding: 0 !important;
      &:first-child {
        .el-carousel__button {
          border-radius: 20px 0 0 20px;
        }
      }
      &:last-child {
        .el-carousel__button {
          border-radius: 0 20px 20px 0;
        }
      }
      .el-carousel__button {
        width: 15px;
        height: 6px;
      }
      &.is-active {
        .el-carousel__button {
          border-radius: 20px;
          background-color: var(--el-color-primary) !important;
        }
      }
    }
  }
}

:deep() {
  .el-carousel__arrow--left {
    left: 0 !important;
    border-radius: 0px 4px 4px 0px;
    background: rgba(51, 51, 51, 0.6);
    height: 44px;
    width: 32px;
    .el-icon {
      font-size: 18px;
    }
  }
  .el-carousel__arrow--right {
    right: 0 !important;
    border-radius: 4px 0px 0px 4px;
    background: rgba(51, 51, 51, 0.6);
    height: 44px;
    width: 32px;
    .el-icon {
      font-size: 18px;
    }
  }
}
</style>
