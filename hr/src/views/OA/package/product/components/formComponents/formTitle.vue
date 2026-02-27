<!--
 * @Date: 2025-02-11 18:11:15
-->
<template>
  <div>
    <div class="item-title-wapper">
      <span class="logo"></span>
      <span class="title">{{ title }}</span>

      <div v-if="isShowExpand" class="item-expand row-center" @click="expandClick">
        <div>{{ isExpand ? '收起' : '展开' }}</div>
        <img v-if="isExpand" src="@/assets/imgs/common/expand_up.png" />
        <img v-else src="@/assets/imgs/common/expand_down.png" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String
  },
  isShowExpand: {
    type: Boolean,
    default: false
  },
  isExpand: {
    type: Boolean,
    default: false
  }
})

const expandClick = () => {
  emit('expandClick')
}

const emit = defineEmits(['expandClick'])
</script>

<style lang="scss" scoped>
.item-title-wapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .item-expand {
    cursor: pointer;
    margin-left: 20px;
    font-size: 14px;
    color: #0064ff;
    line-height: 18px;

    img {
      margin-left: 8px;
      width: 10px;
      height: 5px;
    }
  }
}

.logo {
  width: 3px;
  height: 10px;
  background: #0064ff;
  margin-right: 5px;
  display: inline-block;
}

.title {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}
</style>
