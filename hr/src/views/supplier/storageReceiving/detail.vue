<template>
  <Content isStorageReceiving :tableOptions="addPurchaseTable" />
</template>
<script lang="ts" setup>
import Content from '../appointmentAudit/audit.vue'
import { addPurchaseTable } from './options'
defineOptions({ name: 'StorageReceivingDetail' })
</script>
<style lang="less" scoped></style>
