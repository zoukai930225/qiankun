<template>
  <div class="SWFilterExpandAllNew">
    <div class="SWFilterExpandAllNew-middle" @click="expandClick">
      <!-- <img
        v-if="!isExpand"
        class="SWFilterExpandAllNew-middle-img"
        src="@/assets/imgs/common/expand_new_down.png"
      /> -->
      <el-icon v-if="!isExpand" :size="14" color="#0064ff">
        <ArrowDown />
      </el-icon>
      <div v-if="!isExpand" class="SWFilterExpandAllNew-middle-text"> 展开 </div>

      <!-- <img v-if="isExpand" class="SWFilterExpandAllNew-middle-img" src="@/assets/imgs/common/expand_new_up.png" /> -->
      <el-icon v-if="isExpand" :size="14" color="#0064ff">
        <ArrowUp />
      </el-icon>
      <div v-if="isExpand" class="SWFilterExpandAllNew-middle-text"> 收起 </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineProps({
  isExpand: propTypes.bool.def(false)
})

const expandClick = () => {
  emit('expandClick')
}
const emit = defineEmits(['expandClick'])
</script>

<style lang="scss" scoped>
.SWFilterExpandAllNew {
  color: #0064ff;
  margin-left: 16px;
  font-size: 14px;

  &-middle {
    width: 70px;
    height: 32px;
    line-height: 32px;
    justify-content: center;
    display: flex;
    align-items: center;
    cursor: pointer;

    &-img {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
