<template>
  <el-table
    class="SWCommonTable"
    v-horizontal-scroll="'always'"
    v-loading="loading"
    show-overflow-tooltip
    ref="tableRef"
    :border="border"
    :header-cell-style="appStore.headerCellStyle"
    :stripe="stripe"
    :data="tableData"
    :max-height="maxHeight"
    :height="height"
    :row-key="rowKey"
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
    >
      <template #header="{ column }">
        <slot :name="`${item.prop}_header`" :column="column">
          {{ item.label }}
        </slot>
      </template>
      <template v-if="item.type === 'default' || !item.type" #default="{ row }">
        <slot :name="item.prop" :row="row">
          {{ row[item.prop] }}
        </slot>
      </template>
    </el-table-column>
    <template #empty>
      <div class="mt16px">
        <img
          :style="{ width: emptySize, height: emptySize }"
          ref="emptyImg"
          src="@/assets/imgs/empty/empty1.png"
          alt=""
        />
        <div class="mt16px mb16px">暂无相关内容</div>
      </div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'

const props = withDefaults(
  defineProps<{
    tableData: any[]
    options: any[]
    loading?: boolean
    height?: string | number
    border?: boolean
    stripe?: boolean
    maxHeight?: number | string
    emptySize?: string
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
const emptyImg = ref()

defineExpose({ toggleRowSelection: tableRef.value?.toggleRowSelection })

watch(
  () => props.tableData,
  (val) => {
    if (val) data.value = val
  }
)

onMounted(() => {
  emptyImg.value.style.width = props.emptySize
  emptyImg.value.style.height = props.emptySize
})
</script>
<style lang="less" scoped>
:deep(.el-table__empty-text) {
  line-height: 1;
}
</style>
