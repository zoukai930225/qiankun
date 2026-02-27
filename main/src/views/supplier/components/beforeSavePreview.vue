<!-- 提交前预览 -->
<template>
  <s-w-dialog title="预览" v-model="isShow" @closed="handleClosed" :width="width" show-full-screen>
    <sw-table
      ref="tableRef"
      :data="tableData"
      :options="tableOption"
      :max-height="400"
      :spanMethod="spanMethod"
    >
      <template #imgUrl="{ col }">
        <div class="picture">
          <el-image
            fit="contain"
            :src="col"
            :style="{ height: '60px' }"
            :preview-src-list="[col]"
            preview-teleported
            lazy
            hide-on-click-modal
          >
            <template #error>
              <img src="@/assets/imgs/supplier/defaultImg.svg" :style="{ width: '60px' }" />
            </template>
          </el-image>
        </div>
      </template>
    </sw-table>

    <template #footer>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="emit('comfire')"> 确定 </el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import SwTable from './table.vue'

const props = withDefaults(
  defineProps<{
    data: any[]
    tableOption: TableOption
    width?: string
  }>(),
  {
    width: '1400'
  }
)

const emit = defineEmits<{
  (e: 'comfire'): void
}>()

const isShow = ref(false)
const tableRef = ref()

function open() {
  isShow.value = true
}

const tableData = computed(() => {
  spanArr.value = []
  return props.data
})

function handleClosed() {
  isShow.value = false
}

/** 列表合并规则 */
function spanMethod({ rowIndex, column }): [number, number] {
  if (spanArr.value.length === 0) spanArr.value = calculateSpan()
  if (
    [
      'purchasedGoodsQuantity',
      'orderArrivalTime',
      'firstBatchTime',
      'supplierName',
      'fgCost',
      'baseProdCost'
    ].includes(column.rawColumnKey)
  )
    return [1, 1]
  return spanArr.value[rowIndex]
}

const spanArr = ref<[number, number][]>([]) // 通过清空spanArr可以重置合并规则
function calculateSpan(): typeof spanArr.value {
  const result: typeof spanArr.value = []
  let count = 1,
    index = 1
  tableRef.value?.filterData.forEach((row, i) => {
    if (
      i < tableRef.value?.filterData.length - 1 &&
      tableRef.value?.filterData[i].sku === tableRef.value?.filterData[i + 1].sku
    ) {
      count++
      row.index = index
    } else {
      result.push([count, 1])
      for (let index = 1; index < count; index++) {
        result.push([0, 0])
      }
      row.index = index
      index++
      count = 1
    }
  })
  return result
}

defineExpose({ open, handleClosed })
</script>
<style lang="less" scoped></style>
