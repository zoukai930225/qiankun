<template>
  <div class="auditDetail">
    <el-table
      class="SWCommonTable"
      :data="list"
      width="100%"
      :show-overflow-tooltip="true"
      v-horizontal-scroll="'always'"
      row-class-name="commonTableRow"
      :header-cell-style="appStore.headerCellStyle"
    >
      <el-table-column
        label="人员"
        prop="examinePersonObj"
        min-width="70"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          <div class="row-center">
            <img
              :src="scope.row.avatarOrigin || ''"
              style="width: 16px; height: 16px; border-radius: 8px; margin-right: 10px"
              alt=""
            />
            <div style="font-size: 12px; color: #333333; line-height: 17px">
              {{ scope.row.auditUserName }}</div
            >
          </div>
        </template>
      </el-table-column>

      <el-table-column label="审核状态" prop="status" min-width="80">
        <template #default="scope">
          <div style="font-size: 12px; color: #333333; line-height: 17px">
            {{ scope.row.auditStatus  === '1' ? '审核通过' : '审核拒绝' }}</div
          >
        </template>
      </el-table-column>

      <el-table-column
        label="审核备注"
        prop="remark"
        min-width="214"
        :show-overflow-tooltip="false"
      >
        <template #default="scope">
          <div
            class="textWrap"
            style="width: 214px; font-size: 12px; color: #333333; line-height: 17px"
          >
            {{ scope.row.auditComment || '--' }}</div
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()

defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped lang="scss">
.auditDetail {
  &-header {
    width: 394px;
    height: 33px;
    background: #f2f7ff;
    border-radius: 7px;
  }
  &-title {
    font-weight: 500;
  }
}
</style>
