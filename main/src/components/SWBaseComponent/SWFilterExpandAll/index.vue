<template>
  <div class="SWFilterExpandAll">
    <div class="SWFilterExpandAll-middle" @click="expandClick">
      <div v-if="!isExpand" class="SWFilterExpandAll-middle-text"> 展开 </div>
      <slot name="expandDown"  v-if="!isExpand">
      <img
       
        class="SWFilterExpandAll-middle-img"
        src="@/assets/imgs/common/filter_expand_down.png"
      />
     </slot>
      <div v-if="isExpand" class="SWFilterExpandAll-middle-text"> 收起 </div>
      <slot name="expandUp"   v-if="isExpand">
      <img
      
        class="SWFilterExpandAll-middle-img"
        src="@/assets/imgs/common/filter_expand_up.png"
      />
      </slot>
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
.SWFilterExpandAll {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ebeef5;
  height: 1px;
  margin-bottom: 30px;
  &-middle {
    cursor: pointer;
    margin-left: auto;
    width: 102px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: auto;
    background: #fff;

    &-text {
      margin-left: auto;
      font-size: 12px;
      color: #333333;
      line-height: 18px;
      padding-right: 5px;
    }
    &-img {
      width: 10px;
      height: 6px;
      margin-right: auto;
    }
  }
}
</style>
