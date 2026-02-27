<!--
 * @Date: 2024-10-10 09:01:47
-->
<template>
  <div class="tab-item-wapper">
    <div class="item-title">
      <div class="title">{{ item.label }}</div>
      <div class="desc">{{ formatName(item.programInfo?.typeCode) }}</div>
      <span class="definition">{{ item.programInfo?.definition }}</span>
    </div>
    <div class="content">
      <div class="content-item" v-for="it in item.programRankList" :key="it.id">
        <div class="key">{{ it.name }}({{ it.minScore }}~{{ it.maxScore }})</div>
        <div class="value">{{ it.description }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
defineOptions({ name: 'TooltipItem' })

const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const formatName = (value) => {
  const arr = getIntDictOptions(DICT_TYPE.OTR_PROGRAM_TYPE)
  const item = arr.filter((item) => item.code == value)
  if (item?.length) {
    return item[0]?.label
  }
}
</script>

<style lang="scss" scoped>
.tab-item-wapper {
  cursor: pointer;
  margin-top: 17px;
  width: 100%;
  border-radius: 20px;
  // padding: 16px 18px;
  box-sizing: border-box;
  position: relative;
  line-height: 18px;
  .item-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    // margin-bottom: 17px;

    .title {
      font-weight: 600;
      font-size: 16px;
      color: #333333;
      max-width: 400px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .desc {
      display: block;
      background: rgba(0, 100, 255, 0.1);
      border-radius: 16px;
      padding: 4px 16px;
      box-sizing: border-box;
      font-weight: 400;
      font-size: 12px;
      color: #0064ff;
      margin-left: 10px;
      margin-right: 20px;
    }
    .icon {
      width: 14px;
      height: 14px;
      margin-right: 5px;
    }
    .definition {
      color: #999;
      font-size: 14px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 60px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .text-desc {
      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }
  }

  .content {
    width: 100%;
    background: #ffffff;
    border-radius: 10px;
    padding: 16px;
    box-sizing: border-box;
    .content-item {
      margin-bottom: 12px;
      padding: 10px 0;
      box-sizing: border-box;
      background: #f9f9fb;
      display: flex;
      flex-direction: row;
      align-items: center;
      .key {
        display: block;
        min-width: 100px;
        max-width: 300px;
        font-weight: 400;
        line-height: 20px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        color: #17c534;
        text-align: center;
        margin-right: 10px;
      }
      .value {
        flex: 1;
        width: 360px;
        display: block;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .content-item:last-child {
      margin-bottom: 0px;
    }
  }
}
</style>
