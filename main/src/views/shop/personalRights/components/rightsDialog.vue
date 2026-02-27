<template>
  <div>
    <Dialog
      v-model="dialogVisible"
      :modal-append-to-body="false"
      :title="dialogTitle"
      width="800px"
    >
      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column label="姓名" prop="name" min-width="100" />

        <el-table-column label="开始时间" prop="startTime" min-width="200" />
        <el-table-column label="结束时间" prop="endTime" min-width="200" />

        <!-- <el-table-column label="销售额" prop="xse" min-width="150" />
        <el-table-column label="退款金额" prop="tkje" min-width="150" />
        <el-table-column label="净销售额" prop="jxse" min-width="150" />
        <el-table-column label="净利润" prop="jlr" min-width="150" /> -->
        <el-table-column label="操作" align="center" fixed="right" width="80">
          <template #default="scope">
            <el-button class="operate-btn-space" link type="primary" @click="handleDel(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'

import * as GoodsShopApi from '@/api/shop'

const appStore = useAppStore()
const message = useMessage() // 消息弹窗

defineOptions({ name: 'SystemDictTypeForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const loading = ref(false) // 数据加载是否中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  goodsId: ''
})

/** 打开弹窗 */
const open = async (goodsId) => {
  dialogVisible.value = true
  dialogTitle.value = '责权历史数据'
  list.value = []
  queryParams.value.goodsId = goodsId
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await GoodsShopApi.goodsPersonInfoList(queryParams.value).catch(() => {
      loading.value = false
    })
    list.value = data.records || []

    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 删除
const handleDel = async (row: any) => {
  let content = `确定要删除？`
  let statusT = '删除'
  await message.delConfirm(content, statusT)
  if (row.id) {
    await GoodsShopApi.goodsPersonInfoDelete(row.id)
    message.success('操作成功')
    getList()
    emit('success')
  }
}
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style scoped>
:deep(.el-dialog) {
  padding: 0px;
  background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}
:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  max-height: 70vh;
  min-height: 70vh;
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
