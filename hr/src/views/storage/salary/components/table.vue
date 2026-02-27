<template>
  <el-table
    class="SWCommonTable"
    v-horizontal-scroll="'always'"
    v-loading="loading"
    :show-overflow-tooltip="showOverFlowTooltip"
    ref="tableRef"
    :border="border"
    :header-cell-style="appStore.headerCellStyle"
    :stripe="stripe"
    :data="tableData"
    :max-height="maxHeight"
    :height="height"
    :row-key="rowKey"
    :span-method="spanMethod"
    @selection-change="(val) => emit('selection-change', val)"
  >
    <el-table-column
      v-for="item in options"
      :key="item.prop"
      :label="item.label"
      :fixed="item.fixed"
      :align="item.align"
      :width="item.width"
      :type="item.type"
      :show-overflow-tooltip="item.showOverFlowTooltip"
    >
      <template #header="{ column }">
        <slot :name="`${item.prop}_header`" :column="column">
          {{ item.label }}
        </slot>
      </template>
      <template v-if="item.type === 'default' || !item.type" #default="{ row, $index }">
        <slot
          :name="item.slotName || item.prop"
          :row="row"
          :col="row[item.prop as string]"
          :index="$index"
        >
          {{ item.transform ? item.transform(row[item.prop as string]) : row[item.prop as string] }}
        </slot>
      </template>
    </el-table-column>
    <template #empty>
      <img
        :style="{ width: emptySize, height: emptySize }"
        class="mt30px"
        src="@/assets/imgs/empty/empty1.png"
        alt=""
      />
      <div class="mb24px">暂无相关内容</div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { TableColumnCtx } from 'element-plus'
import html2canvas from 'html2canvas-plus'

interface SpanMethodProps {
  row: any
  column: TableColumnCtx<any>
  rowIndex: number
  columnIndex: number
}

const props = withDefaults(
  defineProps<{
    tableData: any[]
    options: TableOption
    loading?: boolean
    height?: string | number
    border?: boolean
    stripe?: boolean
    maxHeight?: number | string
    emptySize?: string
    downloadFileName?: string
    showOverFlowTooltip?: boolean | any
    spanMethod?: (params: SpanMethodProps) => [number, number]
    rowKey?: (row: any) => string
  }>(),
  {
    tableData: () => []
  }
)

const emit = defineEmits(['selection-change'])

const appStore = useAppStore()
const data = ref<any[]>([])
const tableRef = ref()
const message = useMessage()

async function exportable() {
  try {
    const canvas = await html2canvas(tableRef.value.$el)
    const img = canvas.toDataURL('image/png')
    // 创建一个a标签模拟点击进行下载
    const downloadLink = document.createElement('a')
    downloadLink.id = 'imgDownload'
    downloadLink.style.display = 'none'
    downloadLink.href = img
    downloadLink.download = props.downloadFileName!
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } catch (error) {
    message.error('导出失败')
  }
}

defineExpose({ toggleRowSelection: tableRef.value?.toggleRowSelection, exportable })

watch(
  () => props.tableData,
  (val) => {
    if (val) data.value = val
  }
)
</script>
<style lang="less" scoped>
:deep(.el-table__empty-text) {
  margin-right: 50px;
  line-height: 1;
}

:deep(.el-table) {
  z-index: 0;
}
</style>
