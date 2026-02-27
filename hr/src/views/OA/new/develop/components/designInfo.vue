<template>
  <div class="designInfo">
    <el-table :data="list" align="center" :show-overflow-tooltip="true" :header-cell-style="{
      backgroundColor: '#FBFCFD',
      color: '#333333',
      fontSize: '14px',
      fontWeight: '400',
      height: '30px',
      borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5'
    }" :row-style="{
      background: '#ffffff'
    }" :cell-style="{ fontSize: '14px', color: '#333333' }" class="designInfoTable">
      <el-table-column min-width="76" property="submitPersonList" label="人员">
        <template #default="scope">
          <div>
            <div class="row-center" style="background: rgba(0, 100, 255, 0.102);border-radius: 13px;height: 26px;">
              <img v-if="getPersonalInfo(scope.row).avatarOrigin" :src="getPersonalInfo(scope.row).avatarOrigin"
                style="width: 18px; height: 18px; border-radius: 8px;margin-left: 8px; margin-right: 7px" alt="" />
              <div style="font-size: 14px; color: #333333; line-height: 26px;margin-right: 8px;">
                {{ getPersonalInfo(scope.row).name || '--' }}</div>
            </div>
          </div>

        </template>
      </el-table-column>

      <el-table-column min-width="130" property="productNumber" label="产品编号" />

      <el-table-column min-width="110" prop="productPictureTime" label="设计图上传时间">
        <template #default="scope">
          {{ scope.row.productPictureTime || '--' }}
        </template>
      </el-table-column>
      <el-table-column min-width="110" prop="remark" label="设计图备注" />

      <el-table-column label="设计图" prop="productPicture" min-width="60">
        <template #default="scope">
          <el-image v-if="scope.row.productPicture" :src="scope.row.productPicture"
            :preview-src-list="[scope.row.productPicture || '']" :preview-teleported="true" alt=""
            style="width: 30px; height: 30px" />

          <div v-else>--</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottomBg"></div>
  </div>
</template>
<script lang="ts" setup>
import { handleJSONParse } from '@/views/OA/new/product/utils.js'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const getPersonalInfo = (row) => {
  let submitPersonList = handleJSONParse(row.submitPersonList) || {}
  if (submitPersonList && submitPersonList.length > 0) {
    return submitPersonList[0]
  }
  return submitPersonList
}
</script>

<style lang="scss" scoped>
.designInfo {
  position: relative;

  .designInfoTable {
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
:deep(.designInfoTable .el-table__body tr:hover > td) {
  background-color: #ffffff !important;
  /* 自定义背景色 */
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid #E5E5E5 !important;
}

/* :deep(.el-table__inner-wrapper:before) {
  background: transparent !important;
} */

/* 隐藏最后一行的分割线 */
/* :deep(.el-table .el-table__body-wrapper .el-table__body tr:last-child td) {
  border-bottom: none !important;
} */
</style>
