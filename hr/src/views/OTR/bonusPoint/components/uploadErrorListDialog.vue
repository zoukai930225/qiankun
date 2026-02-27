<template>
  <div>
    <Dialog v-model="dialogVisible" :modal-append-to-body="false" title="导入失败" width="1155px">
      <el-table
        ref="selectTableRef"
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="人员名称" prop="personName">
          <template #default="scope"> {{ scope.row.personName || '-' }}</template>
        </el-table-column>
        <el-table-column label="工号" prop="employeeNo" />

        <el-table-column label="手机号" prop="mobile" />
        <el-table-column label="加分值" prop="addValue" />
        <el-table-column label="加分原因" prop="remark" />
        <el-table-column label="导入失败原因" prop="importErrorReason" />
      </el-table>

      <template #footer>
        <div style="margin-right: 33px; padding-bottom: 20px">
          <el-button @click="dialogVisible = false">关 闭</el-button>
          <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        </div>
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'

import { Search } from '@element-plus/icons-vue'

const appStore = useAppStore()

defineOptions({ name: 'SystemDictTypeForm' })

const dialogVisible = ref(false) // 弹窗的是否展示

const loading = ref(false) // 数据加载是否中
const list = ref<any[]>([]) // 列表的数据

/** 打开弹窗 */
const open = async (data) => {
  dialogVisible.value = true
  list.value = []
  getList(data)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async (data) => {
  loading.value = true
  try {
    console.log('data', data)
    list.value = data || []
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  height: 60px;
  background: #fff;
  width: calc(100%);
  // position: absolute;
  // right: 0;
  // bottom: 0px;
  z-index: 99;
  border-radius: 14px;
}
</style>

<style scoped>
:deep(.el-dialog) {
  padding: 0px;
  background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}
:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  /* min-height: 50vh; */
  max-height: 70vh;
}
:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
:deep(.CommonSearchForm) {
  border-bottom: none;
}
</style>
