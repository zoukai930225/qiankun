<template>
  <div>
    <div class="node">
      <div class="node-top row-center">
        <div class="node-top-name textWrap"> {{ data.nodeName }}</div>
      </div>
      <!-- <ElScrollbar
        :style="{
          height: isBigScreen ? 'calc(100vh - 90px)' : 'calc(100vh - 225px - 150px)'
        }"
      > -->

      <DynamicScroll
        :style="{
          height: isBigScreen ? 'calc(100vh - 90px)' : 'calc(100vh - 225px - 150px)'
        }"
        :items="list"
        ref="scrollRef"
        key-field="keyField"
      >
        <template #default="{ item, index, active }">
          <!-- <DynamicScrollerItem :item="item" :active="active" :data-index="index"> -->
            <div style="width: 270px;"  :style="index > 0 ? 'padding-top: 8px' : ''">
              <nodeItem
                :key="index"
                :data="item"
                :categoryList="categoryList"
                :nodeCode="data.nodeCode"
                @click-node="clickNode"
              ></nodeItem>
            </div>
          <!-- </DynamicScrollerItem> -->
        </template>
        <!-- <div
          class="node-center"
          v-if="data.childList && data.childList.length > 0"
          :style="{
            maxHeight: isBigScreen ? 'calc(100vh - 90px)' : 'calc(100vh - 225px - 150px)',
            overflowY: isBigScreen ? 'hidden' : ''
          }"
        >
          <div
            class="node-center"
            v-if="data.childList && data.childList.length > 0"
            :style="{
              overflowY: isBigScreen ? 'hidden' : ''
            }"
          >
            <div style="width: 270px; margin-top: 8px">
              <nodeItem
                v-for="(value, index) in data.childList"
                :key="index"
                :data="value"
                :categoryList="categoryList"
                :nodeCode="data.nodeCode"
                @click-node="clickNode"
              />
            </div>
          </div> -->
        <!-- <ElScrollbar
          :style="{
            height: isBigScreen ? 'calc(100vh - 90px)' : 'calc(100vh - 225px - 150px)'
          }"
        >
       
        </ElScrollbar> -->
        <!-- </div> -->
      </DynamicScroll>
      <!-- </ElScrollbar> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
// import DynamicScroller from 'vue-virtual-scroller'
// import DynamicScrollerItem from 'vue-virtual-scroller'
import { propTypes } from '@/utils/propTypes'
import DynamicScroll from '@/components/DynamicScroll/index.vue'

import nodeItem from './nodeItem.vue'

const props = defineProps({
  data: propTypes.object.def({}),
  isBigScreen: propTypes.bool.def(false),
  categoryList: propTypes.array.def([])
})

const list = computed(() => {
  const childList= props.data.childList
  if(!childList || childList.length === 0) return []
  return childList.map((item: any, index: number) => {
    const {planName} = item
    return {
      ...item,
      keyField: `${planName}__${index}`
    }
  })
})

const clickNode = (nodeCode, data) => {
  emit('clickNode', nodeCode, data)
}
const emit = defineEmits(['clickNode'])
</script>
<style lang="scss" scoped>
.node {
  width: 303px;
  // display: flex;
  // flex-direction: column;
  background: #f7f8f8;

  &-top {
    width: 303px;
    height: 44px;
    margin-bottom: 14px;

    background: #f7f8f8;
    border-radius: 4px;

    &-name {
      padding-left: 18px;
      padding-right: 18px;
      font-size: 14px;
      color: #333333;
      line-height: 20px;
    }
  }

  &-center {
    width: 303px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    // align-items: center;
    // overflow: auto;
  }
}
</style>
