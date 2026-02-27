<!--
 * @Date: 2025-01-22 16:36:51
-->
<template>
  <div class="tab-container-wapper">
    <div class="tab-container">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="[
          'tab',
          {
            active: currentIndex == index
          }
        ]"
        @click="handleTabClick(tab, index)"
      >
        {{ tab.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  tabs: {
    type: Array as any,
    required: true,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['change'])

const handleTabClick = (tab, index) => {
  emit('change', tab, index)
}
</script>

<style scoped>
.tab-container-wapper {
  padding-top: 16px;
  background: white;
  display: flex;
  justify-content: center;
}

.tab-container {
  display: flex;
  background: rgba(241, 241, 241, 0.6);
  border-radius: 6px;
}

.tab {
  padding: 0 10px;
  box-sizing: border-box;
  height: 40px;
  background: rgba(241, 241, 241, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  border-radius: 0px;
}

.tab:first-child {
  border-radius: 6px 0px 0px 6px;
}
.tab:last-child {
  border-radius: 0px 6px 6px 0px;
}

.tab.active {
  background: #0064ff;
  color: white;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
}
</style>
