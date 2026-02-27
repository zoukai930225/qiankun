<!--
 * @Date: 2024-09-12 13:12:09
-->
<!--圆形进度条-->
<template>
  <div class="wapper">
    <div class="empty-wapper" v-if="visibility">
      <img src="@/assets/imgs/team/empty-img.png" class="empty-img" />
      <span class="empty-desc">暂无数据</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'EmptyTable' })
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
.empty-wapper {
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .empty-img {
    width: 393px;
    height: 231px;
  }
  .empty-desc {
    font-weight: 400;
    font-size: 14px;
    color: #999999;
    margin-top: 20px;
  }
}
</style>
