<template>
  <special-table
    :data="list"
    :options="skuTableOptions"
    :btns-options="btnsOptions"
    :loading="loading"
    :row-class-name="getRowClassName"
  >
    <template #category="{ row }">
      {{ productInfoData.flattenCategory[row.category] || row.category || '--' }}
    </template>
  </special-table>
</template>
<script lang="ts" setup>
import specialTable from '@/views/supplier/components/table.vue'
import { skuTableOptions } from '../../options'
import { AuditBtn } from '@/views/supplier/changeAudit/option'
import { toReactive } from '@vueuse/core'
import { productInfoStore } from '@/store/modules/productInfo'

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

const emit = defineEmits(['publish_product', 'edit_product', 'unpubilish_product'])

const btnsOptions = computed(() =>
  props.list.map(({ skuOutOfStockDisplay }) => {
    const hideBtns: AuditBtn[] = [
      new AuditBtn('编辑', handleEditProduct, { permission: 'ProductInfo:SKU:Edit' })
    ]

    switch (skuOutOfStockDisplay) {
      case '下架款':
        hideBtns.push(
          new AuditBtn('上架', handlePublishProduct, { permission: 'ProductInfo:SKU:Publish' })
        )
        break
      case '上架款':
        hideBtns.push(
          new AuditBtn('下架', handleUnpublishProduct, { permission: 'ProductInfo:SKU:UnPublish' })
        )
        break
    }

    return toReactive(hideBtns)
  })
)

// 上架
const handlePublishProduct = (row: any) => {
  emit('publish_product', row.skuId)
}

// 下架
const handleUnpublishProduct = (row: any) => {
  emit('unpubilish_product', row.skuId)
}
// 编辑商品
const handleEditProduct = (row: any) => {
  emit('edit_product', row.skuId)
}

// 获取行的类名
const getRowClassName = ({ row }: { row: any }) => {
  let className = ''
  if (row.skuOutOfStock === 1) {
    className += ' out-of-stock-row'
  }
  return className
}
</script>

<style lang="less" scoped>
@import url(../../index.scss);
@import url(@/views/supplier/index.scss);
// 评价类型
.comment-type {
  width: 65px;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  text-align: center;
}
// 评价内容
.comment-content-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.5;
}
.comment-content {
  background-color: #f5f5f5;
  padding: 8px;
  box-sizing: border-box;
}

// 视频链接 // 图片链接
.video-box,
.img-box {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.5;
  color: #0064ff;
  cursor: pointer;
}

// 下架状态行的背景色
:deep(.out-of-stock-row) {
  background-color: #fffbf0 !important;
}

:deep(.out-of-stock-row:hover) {
  background-color: #fff7e6 !important;
}
</style>
