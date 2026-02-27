<template>
  <Content :api="queryApprovalById" />
</template>
<script lang="ts" setup>
import { queryApprovalById } from '@/api/supplier/purchase'
import Content from './add.vue'
defineOptions({ name: 'PurchaseAudit' })
</script>
<style lang="less" scoped></style>
