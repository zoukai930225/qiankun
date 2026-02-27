<template>
  <div class="chartDetailTable">
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      class="SWCommonTable fixedHeaderTable"
      v-horizontal-scroll="'always'"
      row-class-name="house-hover-row"
      max-height="340"
    >
      <el-table-column prop="dataDate" label="数据日期" align="center" />
      <el-table-column prop="type" label="数据类型" align="center" v-if="channel === 'Douyin'">
        <template #default="{ row }">
          <span class="tag" :class="getClass(row.type)">{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="GMV" label="GMV" align="center" />
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { propTypes } from '@/utils/propTypes'
const appStore = useAppStore()

const props = defineProps({
  loading: propTypes.bool.def(false),
  data: propTypes.object.def({}),
  list: propTypes.array.def([]),
  channel: propTypes.string.def('')
})
const getClass = (type) => {
  if (type === '商务') return 'tag1'
  if (type === '直播间') return 'tag2'
}
</script>
<style lang="scss" scoped>
.chartDetailTable {
  max-height: 53vh;
  overflow: auto;
}
:deep(.el-table__cell) {
  border-left: none !important;
}

:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  border-left: none !important;
}

:deep(.el-table__body tr.house-hover-row:hover > td) {
  background-color: #e6e6e6 !important;
  --el-fill-color-light: ##e6e6e6 !important;
  --el-fill-color-lighter: ##e6e6e6 !important;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  background: #3270ff;
  color: #fff;
  border-radius: 10px;
  opacity: 0.8;
  &.tag1 {
    background: #ff7d08;
  }

  &.tag2 {
    background: #349b34;
  }
}
</style>
