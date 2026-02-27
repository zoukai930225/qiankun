<template>
  <el-dialog v-model="dialogVisible" class="nineGridDialog">
    <template #header>
      <div class="header">
        <span class="header-title"></span>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :header-cell-style="appStore.headerCellStyle"
      :data="list"
      :show-overflow-tooltip="true"
      row-class-name="commonTableRow1"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="name" :label="`${dimension1}均分`">
        <template #default="{ row }">
          {{ row.xmap.dimensionAverage }}
        </template>
      </el-table-column>
      <el-table-column prop="address" :label="`${dimension2}均分`">
        <template #default="{ row }">
          {{ row.ymap.dimensionAverage }}
        </template>
      </el-table-column>
      <el-table-column prop="address" :label="`${dimension1}结果`">
        <template #default="{ row }">
          {{ row.xmap.dimensionResult }}
        </template>
      </el-table-column>
      <el-table-column prop="address" :label="`${dimension2}结果`">
        <template #default="{ row }">
          {{ row.ymap.dimensionResult }}
        </template>
      </el-table-column>
      <el-table-column prop="position" label="九宫格落位" />
    </el-table>
    <template #footer>
      <!-- <el-button @click="dialogVisible = false">关闭</el-button> -->
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import * as InventoryCalibrationApi from '@/api/otr/InventoryCalibration'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
defineOptions({ name: 'NineGridDialog' })
const dialogVisible = ref(false) // 弹窗的是否展示
const emit = defineEmits(['confirm', 'cancel'])

const list = ref([])
const loading = ref(false)
const dimension1 = ref('')
const dimension2 = ref('')
const dimensionMap = ref({})
getIntDictOptions(DICT_TYPE.OTR_PROGRAM_DIMENSION, true).forEach((item) => {
  dimensionMap.value[item.value] = item.label
})
/** 打开弹窗 */
const open = async (params) => {
  dialogVisible.value = true
  loading.value = true
  const data = await InventoryCalibrationApi.getCalibrationList(params).catch(() => {
    loading.value = false
  })
  loading.value = false
  if (data && data.data.length > 0) {
    data.data.forEach((item) => {
      const xkey = item.xmap.dimension + '_average'
      const ykey = item.ymap.dimension + '_average'
      item.xmap.dimensionAverage = item.xmap[xkey]
      item.ymap.dimensionAverage = item.ymap[ykey]
      dimension1.value = dimensionMap.value[item.xmap.dimension]
      dimension2.value = dimensionMap.value[item.ymap.dimension]
    })
  }
  list.value = data.data
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss"></style>
