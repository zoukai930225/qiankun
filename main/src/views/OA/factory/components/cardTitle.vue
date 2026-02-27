<template>
  <div class="title">
    <div class="line"></div>
    <span>{{ title }}</span>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  title: { type: String, default: '' },
  
})



</script>
<style lang="scss" scoped>
.title{
  display: flex;
  align-items: center;
  color: #333;
  font-weight: 600;
  font-size: 14px;
  .line{
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }
}
</style>
