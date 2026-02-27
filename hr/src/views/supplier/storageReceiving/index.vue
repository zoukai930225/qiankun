<template>
  <Content isStorageReceiving :codeTypes="codeTypes" />
</template>
<script lang="ts" setup>
import Content from '../appointmentAudit/index.vue'

defineOptions({ name: 'SupplierStorageReceiving' })

const codeTypes = {
  wdtPurchaseNo: { label: 'ERP采购单号', placeholder: '请输入ERP采购单号' },
  advancedShippingRequestOrderNo: { label: '预约单号', placeholder: '请输入预约单号' }
}
</script>
<style lang="less" scoped></style>
