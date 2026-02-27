<template>
  <div class="supplierCount">
    <el-table :data="list" align="center" :show-overflow-tooltip="true" :header-cell-style="{
      backgroundColor: '#FBFCFD',
      color: '#333333',
      fontSize: '14px',
      fontWeight: '400',
      height: '30px',
      borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5'
    }" :row-style="{
      background: '#ffffff'
    }" :cell-style="{ fontSize: '14px', color: '#333333' }" class="supplierCountTable">
      <el-table-column min-width="100" property="submitPersonList" label="选供专员">
        <template #default="scope">
          <div class="row-center" v-if="getPersonalInfo(scope.row).avatarOrigin"
            style="background: rgba(0, 100, 255, 0.102); height: 26px; border-radius: 13px">
            <img v-if="getPersonalInfo(scope.row).avatarOrigin" :src="getPersonalInfo(scope.row).avatarOrigin"
              style="width: 20px; height: 20px; border-radius: 10px; margin-left: 8px" alt="" />
            <div style="
                font-size: 14px;
                color: #333333;
                line-height: 26px;
                text-align: center;
                padding-left: 6px;
                padding-right: 6px;
              ">
              {{ getPersonalInfo(scope.row).name || '--' }}</div>
          </div>
          <div v-else> {{ getPersonalInfo(scope.row).name || '--' }}</div>
        </template>
      </el-table-column>

      <el-table-column min-width="100" property="supplierName" label="供应商名称">
        <template #default="scope">
          <div>{{ scope.row.supplierName || '--' }}</div>
        </template>
      </el-table-column>

      <el-table-column min-width="140" prop="matchReason" label="匹配原因" />
      <el-table-column min-width="90" prop="matchPrice" label="预估报价" />

      <!-- <el-table-column width="90" prop="status" label="核价结果">
        <template #default="scope">
          <div v-if="scope.status === 1" style="color: #349b34">通过</div>
          <div v-else style="color: #eb3737">未通过</div>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="bottomBg"></div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const getPersonalInfo = (row) => {
  return row.chosenSupplierStaff || {}
}
</script>

<style lang="scss" scoped>
.supplierCount {
  position: relative;

  .supplierCountTable {
    margin-bottom: 10px;
  }

  .bottomBg {
    width: calc(100%);
    position: absolute;
    height: 2px;
    bottom: 1px;
    z-index: 9;
    // background: #000000;
    // background: red;
  }
}
</style>

<style scoped>
:deep(.supplierCountTable .el-table__body tr:hover > td) {
  /* background-color: #ffffff !important; */
  /* 自定义背景色 */
}

:deep(.el-table td.el-table__cell) {
  /* border-bottom: 1px solid #E5E5E5 !important; */
}

/* :deep(.el-table__inner-wrapper:before) {
  background: transparent !important;
} */

/* 隐藏最后一行的分割线 */
/* :deep(.el-table .el-table__body-wrapper .el-table__body tr:last-child td) {
  border-bottom: none !important;
} */
</style>
