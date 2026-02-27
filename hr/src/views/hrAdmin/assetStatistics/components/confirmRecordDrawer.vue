<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" @close="reset" width="600px">
    <div class="content">
      <!-- 列表 -->
      <el-table :header-cell-style="appStore.headerCellStyle" v-loading="drawerLoading" :data="list"
        :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable"
        v-horizontal-scroll="'always'" ref="tableRef">
        <el-table-column label="发送时间" prop="sendAt" min-width="180"
          :formatter="(row: any) => formatTime(row.sendAt, 'yyyy-MM-dd HH:mm:ss') || '-'" />
        <el-table-column label="确认时间" prop="confirmAt" min-width="180"
          :formatter="(row: any) => formatTime(row.confirmAt, 'yyyy-MM-dd HH:mm:ss') || '-'" />
        <el-table-column label="资产状态" prop="status" width="110">
          <template v-slot="{ row }">
            <div class="tag-item" :class="{ 'tag-item-done': row.status === 1 }">
              {{ getDictLabel(DICT_TYPE.ZCTJ_QRZT, row.status) }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
          @pagination="getList" />
      </div>
    </div>
    <template #footer>
      <el-button @click="reset" style="margin-right: 20px;">取消</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import { formatterValue, formatTime } from "@/utils";
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { getSingleAssetPage } from '@/api/hrAdmin/assetStatistics/index'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const list = ref<any[]>([])
const queryParams = ref<any>({
  userId: '',
  page: 1,
  size: 10
})
const total = ref(0)
const reset = () => {
  drawerVisible.value = false
  queryParams.value = {
    userId: '',
    page: 1,
    size: 10
  }
  total.value = 0
}

//打开弹框
const open = async (row: any) => {
  drawerTitle.value = `确认记录（${row.name}）`;
  queryParams.value.userId = row.userId
  drawerVisible.value = true
  getList()
}
const getList = async () => {
  drawerLoading.value = true
  try {
    const res = await getSingleAssetPage(queryParams.value)
    list.value = res && res.records && Array.isArray(res.records) ? res.records : []
    total.value = res.total || 0
  } finally {
    drawerLoading.value = false
  }
}
defineExpose({ open })
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
  width: 100%;
  min-height: calc(100vh - 152px);
  border-radius: 20px;
  padding: 20px;
}

.tag-item {
  width: 74px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 28px;
  font-size: 14px;
  color: #666666;
  background-color: #E5E5E5;

  &-done {
    color: #349B34;
    background-color: #D6EBD6;
  }
}
</style>