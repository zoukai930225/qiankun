<template>
  <div class="supplierCount">
    <el-table :data="list" align="center"  :header-cell-style="headStyle"
      :row-style="rowStyle" :cell-style="cellStyle" class="supplierCountTable" style="width: 100%;">
      <el-table-column min-width="80" property="submitPersonList" label="选供专员">
        <template #default="scope">
          <commonUser :data="getPersonalInfo(scope.row)" />
        </template>
      </el-table-column>

      <el-table-column min-width="140" property="supplierName" label="供应商名称" >
        <template #default="scope">
          {{ scope.row.supplierName || '--' }}
        </template>
      </el-table-column>

      <el-table-column min-width="140" prop="matchReason" label="匹配原因" />
      <el-table-column min-width="80" prop="matchPrice" label="预估报价" />

    </el-table>
  </div>
</template>
<script lang="ts" setup>
import commonUser from '@/views/OA/factory/components/commonUser.vue'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const getPersonalInfo = (row) => {
  return row.chosenSupplierStaff || {}
}

const headStyle = {
  backgroundColor: '#FBFCFD',
  color: '#333',
  fontSize: '14px',
  fontWeight: '400',
  height: '30px',
  borderTop: '1px solid #E5E5E5', 
  borderBottom: '1px solid #E5E5E5'
}

const rowStyle = {
  background: '#fff',
}

const cellStyle = {
  fontSize: '14px',
  color: '#333'
}
</script>

<style lang="scss" scoped>
.supplierCount {
  // position: relative;

  .supplierCountTable {
    margin-bottom: 10px;
  }

}
</style>
