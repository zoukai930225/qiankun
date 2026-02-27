<!--
 * @Date: 2025-07-28 15:45:28
-->
<template>
  <div>
    <div class="title row-center" :style="{ marginBottom: mbStyle, marginTop: mtStyle }">
      <div class="row-center" style="padding: 1px 0;box-sizing: border-box;">
        <div style="width: 3px; height: 10px; background: #0064ff; margin-right: 5px"></div>
        <div>{{ title }}</div>
      </div>
      <div class="row-center right-wapper" @click="toggleExpand" v-if="showcollapse">
        <div style="margin-right: 20px">
          <slot name="btn"></slot>
        </div>

        <div>
          <span class="desc">{{ isExpanded ? '收起' : '展开' }}</span>
          <img src="@/assets/imgs/common/xiangshang-activity.png" alt="" class="icon" v-if="!isExpanded" />
          <img src="@/assets/imgs/common/xiangxia-activity.png" alt="" class="icon" v-if="isExpanded" />
        </div>
      </div>
    </div>
    <div v-if="isExpanded">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import icon1 from '@/assets/imgs/oa/product/displayInfo/icon1.png'
const isExpanded = ref(true)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

const props = defineProps({
  title: {
    type: String,
    default: '企划信息'
  },
  icon: {
    type: String,
    default: icon1
  },
  showcollapse: {
    type: Boolean,
    default: false
  },
  mbStyle: {
    type: String,
    default: '2px'
  },
  mtStyle: {
    type: String,
    default: '6px'
  }
})
</script>

<style lang="scss" scoped>
.title {
  width: calc(100%);
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  // border-bottom: 1px solid #eceaea;
  padding: 14px 0;
  box-sizing: border-box;
  // margin-bottom: 13px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .icon {
    width: 12px;
    vertical-align: middle;
    margin-right: 14px;
  }
}

.right-wapper {
  cursor: pointer;

  .desc {
    color: #0064ff;
    font-size: 14px;
    margin-right: 7px;
    font-weight: normal;
  }

  .icon {
    width: 7px;
    height: 4px;
  }
}
</style>
