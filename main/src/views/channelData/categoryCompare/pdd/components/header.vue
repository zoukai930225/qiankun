<template>
  <div class="header" :class="formatBg">
    <div class="header-row">
      <img
        v-if="['search'].includes(type)"
        class="header-row-left"
        src="@/assets/imgs/channelData/header_left.png"
      />
      <img
        v-if="type === 'total'"
        class="header-row-left"
        src="@/assets/imgs/channelData/categoryCompare/header_left_3.png"
      />
      <img
        v-if="type === 'sale'"
        class="header-row-left"
        src="@/assets/imgs/channelData/categoryCompare/header_left_2.png"
      />

      <img
        v-if="type === 'refundRatio'"
        class="header-row-left"
        src="@/assets/imgs/channelData/categoryCompare/header_left_4.png"
      />

      <img
        v-if="type === 'refundRate'"
        class="header-row-left"
        src="@/assets/imgs/channelData/categoryCompare/header_left_5.png"
      />

      <img
        v-if="type === 'refund'"
        class="header-row-left"
        src="@/assets/imgs/channelData/categoryCompare/header_left_6.png"
      />

      <span class="header-row-title">
        <span style="margin-left: 16px">{{ storeName }}</span>
        <span>-各店铺</span>
        <span :style="{ color: typeColor }">{{ typeName }}</span>
        <span>对比</span>
      </span>
      <img
        v-if="['search'].includes(type)"
        class="header-row-right"
        src="@/assets/imgs/channelData/header_right.png"
      />
      <img
        v-if="type === 'total'"
        class="header-row-right"
        src="@/assets/imgs/channelData/categoryCompare/header_right_2.png"
      />
      <img
        v-if="type === 'sale'"
        class="header-row-right"
        src="@/assets/imgs/channelData/categoryCompare/header_right_3.png"
      />

      <img
        v-if="type === 'refundRatio'"
        class="header-row-right"
        src="@/assets/imgs/channelData/categoryCompare/header_right_4.png"
      />
      <img
        v-if="type === 'refundRate'"
        class="header-row-right"
        src="@/assets/imgs/channelData/categoryCompare/header_right_5.png"
      />
      <img
        v-if="type === 'refund'"
        class="header-row-right"
        src="@/assets/imgs/channelData/categoryCompare/header_right_6.png"
      />
      <el-tooltip effect="dark" :content="tipsContent" placement="right">
        <img
          v-if="type === 'refundRate' || type === 'refundRatio'"
          src="@/assets/imgs/channelData/categoryCompare/tips.svg"
          alt=""
          class="tip-icon"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  type: propTypes.string.def('search') // 类型 search 搜索流量 total 付费总和 sale 销售额 refundRatio 去退费比  refundRate 退费率 refund 退款
})

const storeName = computed(() => {
  return 'SW拼多多'
})

const formatBg = computed(() => {
  if (props.type === 'total') {
    return 'header2'
  } else if (props.type === 'sale') {
    return 'header3'
  } else if (props.type === 'refundRatio') {
    return 'header4'
  } else if (props.type === 'refundRate') {
    return 'header5'
  } else if (props.type === 'refund') {
    return 'header6'
  }
})

const typeName = computed(() => {
  if (props.type === 'search') {
    return '搜索流量'
  } else if (props.type === 'total') {
    return '付费总和'
  } else if (props.type === 'sale') {
    return '销售额'
  } else if (props.type === 'refundRatio') {
    return '去退费比'
  } else if (props.type === 'refundRate') {
    return '退款率'
  } else if (props.type === 'refund') {
    return '退款'
  }
})

const typeColor = computed(() => {
  if (props.type === 'search') {
    return '#0064ff'
  } else if (props.type === 'total') {
    return '#FF6000'
  } else if (props.type === 'sale') {
    return '#167901'
  }
  return '#FF6000'
})

const tipsContent = computed(() => {
  // 去退费比 去退费比=付费总和/(销售额总和 - 退款总和)
  if (props.type === 'refundRatio') {
    return '去退费比=付费总和/(销售额总和 - 退款总和)   '
  } else if (props.type === 'refundRate') {
    // 退款率：退款率=退款总和/销售额总和
    return '退款率=退款总和/销售额总和 '
  }
})
</script>

<style lang="scss" scoped>
.header {
  height: 65px;
  background-repeat: no-repeat;
  background-image: url('@/assets/imgs/channelData/categoryCompare/header_bg_1.png');
  background-size: 100% 100%;
  // width: calc(100% + 6px);
  width: calc(100%);
  // background-size: cover; /* 覆盖整个父元素 */
  // margin-left: -6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &-row {
    height: 32x;
    display: flex;
    flex-direction: row;
    align-items: center;
    &-left {
      width: 20px;
      height: 32px;
    }
    &-title {
      font-size: 20px;
      color: #333333;
      line-height: 20px;
      font-weight: 500;
    }
    &-right {
      width: 20px;
      height: 32px;
    }
  }
  &-star {
    width: 89px;
    height: 20px;
  }
  .tip-icon {
    margin-left: 6px;
  }
}
.header2 {
  background-image: url('@/assets/imgs/channelData/categoryCompare/header_bg_2.png');
}
.header3 {
  background-image: url('@/assets/imgs/channelData/categoryCompare/header_bg_3.png');
}
.header4 {
  background-image: url('@/assets/imgs/channelData/categoryCompare/header_bg_4.png');
}
.header5 {
  background-image: url('@/assets/imgs/channelData/categoryCompare/header_bg_5.png');
}
.header6 {
  background-image: url('@/assets/imgs/channelData/categoryCompare/header_bg_6.png');
}
</style>
