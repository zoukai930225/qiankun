<template>
  <div class="flex justify-between items-center">
    <el-image :src="logoFull" />
    <!-- <el-button size="large"> <el-image :src="printer" class="mr-8px"></el-image>打印</el-button> -->
  </div>
</template>
<script lang="ts" setup>
import logoFull from '@/assets/svgs/logo_full.svg'
import printer from '@/assets/svgs/common/print.svg'
</script>
<style scoped lang="scss">
:deep(.el-button) {
  padding: 21px 16px;
  border: 1px solid #0064ff;
  color: #0064ff;
}
</style>
