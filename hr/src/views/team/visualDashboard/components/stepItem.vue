<!--
 * @Date: 2025-10-13 10:18:45
-->
<template>
  <div class="step-item">
    <div class="title-wapper">
      <div class="title-left">
        <img :src="getStatusImg" alt="" class="img" />
        <!-- 不同的状态不同的颜色字体 一共有三种颜色-->
        <div class="title" :class="statusClass">{{ item?.processNodeName }}</div>
      </div>
      <div class="title-right">
        <img v-if="iconSrc" :src="iconSrc" alt="" class="icon" />
        <div class="desc">{{ item?.typeName }}</div>
      </div>
    </div>
    <div class="content-wapper">
      <div class="item" v-for="(it, index) in item?.operators" :key="index">
        <img :src="it?.avatarOrigin" alt="" class="avator" />
        <div class="name">{{ it?.operatorRealname }}</div>
      </div>
    </div>
    <div class="time">{{ item?.expectedCompletionTime }}</div>
    <div class="line"></div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    // status?: 'normal' | 'finish' | 'ing'
    item?: any
  }>(),
  {
    item: {}
  }
)

// 计算属性 status 'normal' | 'finish' | 'ing' 映射 item.status 0 | 1或者2 | 3

const cusStatus = computed(() => {
  if (props.item?.state == 0) return 'normal'
  if (props.item?.state == 1 || props.item?.state == 2) return 'ing'
  if (props.item?.state == 3) return 'finish'
  return 'normal'
})

const getStatusImg = computed(() => {
  switch (props.item.state) {
    case 3:
      return new URL('@/assets/imgs/team/title-finish-icon.png', import.meta.url).href
    case 1:
      return new URL('@/assets/imgs/team/title-ing-icon.png', import.meta.url).href
    case 0:
      return new URL('@/assets/imgs/team/title-normal-icon.png', import.meta.url).href
    default:
      return ''
  }
})

const statusClass = computed(() => {
  switch (props.item.state) {
    case 0:
      return 'title-normal'
    case 3:
      return 'title-finish'
    case 1:
      return 'title-ing'
    default:
      return 'title-normal'
  }
})

// 将行为类型映射到图标，便于扩展
const iconMap = {
  跳过: new URL('@/assets/imgs/team/tiaoguo.png', import.meta.url).href,
  指派: new URL('@/assets/imgs/team/zhipainew.png', import.meta.url).href,
  上传: new URL('@/assets/imgs/team/shangchuan.svg', import.meta.url).href
}

const iconSrc = computed(() => {
  return iconMap[props.item?.typeName] || ''
})
</script>

<style scoped>
.step-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px dashed #e5e5e5;
  padding-bottom: 8px;
  box-sizing: border-box;
  .title-wapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      .img {
        background: red;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        transform: translateX(-6px);
        display: inline-block;
      }
      .title {
        font-size: 12px;
        font-weight: 500;
      }
      .title-normal {
        color: #999999;
      }
      .title-ing {
        color: #0064ff;
      }
      .title-finish {
        color: #349b34;
      }
    }
    .title-right {
      background: #fef2d7;
      color: #cd8200;
      font-size: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 2px 3px;
      box-sizing: border-box;
      .icon {
        width: 11px;
        margin-right: 4px;
      }
      .desc {
        color: #cd8200;
        font-size: 10px;
      }
    }
  }
  .content-wapper {
    padding: 7px 12px 0 12px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 8px;
      margin-right: 10px;
      .avator {
        background: yellow;
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        border-radius: 50%;
      }
      .name {
        margin-left: 4px;
        font-size: 12px;
        color: #333333;
      }
    }
    .item:nth-child(2n) {
      margin-right: 0;
    }
  }
  .time {
    color: #999999;
    font-size: 12px;
    margin-bottom: 8px;
    padding-left: 12px;
    box-sizing: border-box;
  }
  .line {
    background: #e5e5e5;
    margin-left: 12px;
    height: 1px;
  }
}
</style>
