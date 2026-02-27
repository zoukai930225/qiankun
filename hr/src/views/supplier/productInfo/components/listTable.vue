<template>
  <special-table
    :data="list"
    :options="mainTable"
    :loading="loading"
    :row-class-name="getRowClassName"
    :btns-options="btnsOptions"
    @selection-change="handleSelectionChange"
  >
    <template #category="{ row }">
      {{ productInfoData.flattenCategory[row.category] || row.category || '--' }}
    </template>
  </special-table>
</template>
<script lang="ts" setup>
import { productInfoStore } from '@/store/modules/productInfo'
import specialTable from '@/views/supplier/components/table.vue'
import { mainTable } from '../options'
import { AuditBtn } from '../../changeAudit/option'
import { toReactive } from '@vueuse/core'
const productInfoData = productInfoStore()

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// 点击SKU明细
const emit = defineEmits([
  'view_sku_details',
  'publish_product',
  'edit_product',
  'selection_change',
  'unpubilish_product'
])
const handleViewSkuDetails = (row: any) => {
  emit('view_sku_details', row.goodsId)
}

// 上架
const handlePublishProduct = (row: any) => {
  emit('publish_product', row.goodsId)
}

// 下架
const handleUnpublishProduct = (row: any) => {
  emit('unpubilish_product', row.goodsId)
}
// 编辑商品
const handleEditProduct = (row: any) => {
  emit('edit_product', row.goodsId)
}

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  emit('selection_change', selection)
}

const btnsOptions = computed(() =>
  props.list.map(({ outOfStockDisplay }) => {
    return toReactive([
      new AuditBtn('SKU明细', handleViewSkuDetails, { permission: 'ProductInfo:SKU' }),
      outOfStockDisplay === '下架款'
        ? new AuditBtn('上架', handleUnpublishProduct, { permission: 'ProductInfo:Publish' })
        : new AuditBtn('下架', handlePublishProduct, { permission: 'ProductInfo:UnPublish' }),
      new AuditBtn('编辑', handleEditProduct, { permission: 'ProductInfo:Edit' })
    ])
  })
)

// 获取行的类名
const getRowClassName = ({ row }: { row: any }) => {
  let className = ''
  if (row.outOfStock === 1) {
    className += ' out-of-stock-row'
  }
  return className
}
</script>

<style lang="less" scoped>
// 显示跟单员的样式
.designerItem {
  background: #cad6f8;
  border-radius: 13px;
  margin: 0 5px 5px 0;
  padding: 2px 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:last-child {
    margin: 0 5px 0 0;
  }

  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    vertical-align: middle;
  }
}

// 下架状态行的背景色
:deep(.out-of-stock-row) {
  background-color: #fffbf0 !important;
}

:deep(.out-of-stock-row:hover) {
  background-color: #fff7e6 !important;
}
</style>
