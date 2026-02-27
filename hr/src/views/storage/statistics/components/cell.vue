<template>
  <el-card shadow="never">
    <span>{{ title }}</span>
    <div>
      <el-divider v-if="title" />
      <el-form ref="formRef" :model="formData" label-position="top" label-width="170">
        <slot :cell="formData"></slot>
      </el-form>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    formData: Partial<StorageStatisticsType.DeliveryReportItem>
  }>(),
  {}
)
</script>
<style lang="less" scoped>
:deep(.el-card) {
  flex: calc((100% - 40px) / 4);
  .el-form {
    flex-wrap: wrap;
  }
}
</style>
