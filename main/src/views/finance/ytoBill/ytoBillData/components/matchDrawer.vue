<template>
  <SWDrawer v-model="drawerVisible" title="发起匹配" @close="reset">
    <div class="content">
      <div class="btn-box">
        <el-button type="primary" @click="getList">
          刷新
        </el-button>
        <el-button type="primary" @click="openAdd">
          新建匹配
        </el-button>
      </div>
      <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
        :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable"
        v-horizontal-scroll="'always'">
        <el-table-column label="中通账单月份" prop="belongTime" min-width="120"
          :formatter="(row: any) => formatterValue(row, 'belongTime', '-')" />
        <el-table-column label="电子面单时间" prop="billTime" min-width="120"
          :formatter="(row: any) => formatterValue(row, 'billTime', '-')" />
        <el-table-column label="匹配时间" prop="matchTime" width="180"
          :formatter="(row: any) => formatTime(row.matchTime, 'yyyy-MM-dd HH:mm:ss')" />
        <el-table-column label="状态" prop="matchStatus" width="150">
          <template v-slot="{ row }">
            <div class="row-center">
              <div class="status-tag" :class="'status-tag-' + row.matchStatus">
                {{ getLabelByValue(matchStatusList, row.matchStatus + '') }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template v-slot="{ row }">
            <el-button link @click="handleMatch(row)" :loading="row.loading"
              v-if="[5, 6].includes(Number(row.matchStatus))" type="primary">重新匹配
            </el-button :loading="row.loading">
            <span v-else>-</span>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex-column" style="align-items: center;">
            <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" />
            <span>暂无数据</span>
          </div>
        </template>
      </el-table>
    </div>
    <template #footer>
      <el-button @click="reset" class="mr20px">关闭</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import { formatterValue, formatTime } from "@/utils";
import * as ytBillApi from "@/api/finance/ytoBill/ytBill";
import { useAppStore } from '@/store/modules/app'
import dayjs from "dayjs";
const drawerVisible = ref(false)
const appStore = useAppStore()
const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const reset = () => {
  drawerVisible.value = false
}
const emit = defineEmits<{
  (e: 'openAddDialog'): void
}>()
const message = useMessage()

const open = async () => {
  drawerVisible.value = true
  getList()
}

const queryParams = ref({
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ytBillApi.listMatchRecord(queryParams.value)
    if (data?.length) {
      list.value = data
    } else {
      list.value = []
    }
  } finally {
    loading.value = false
  }
}

const openAdd = () => {
  emit('openAddDialog')
}
const matchStatusList = [
  { id: 4, label: '匹配中 ', value: '4' },
  { id: 5, label: '匹配成功 ', value: '5' },
  { id: 6, label: '匹配失败 ', value: '6' },
]
const getLabelByValue = (list, value) => {
  return list.find(item => item.value === value)?.label;
}
//重新匹配
const handleMatch = async (row) => {
  try {
    await message.confirm('确认要重新匹配吗？')
  } catch (e) {
    return
  }
  try {
    row.loading = true
    await ytBillApi.dataMatch({
      belongTime: dayjs(row.belongTime).format('YYYY-MM'),
    })
    message.success('已重新匹配')
    getList()
  } catch (err) { } finally {
    row.loading = false
  }
}

defineExpose({ open, getList })
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
  width: 100%;
  height: calc(100vh - 152px);
  border-radius: 20px;
  padding: 20px;
  overflow-y: auto;
}

.btn-box {
  margin-bottom: 15px;
  float: right;
}

.status-tag {
  display: flex;
  height: 28px;
  border-radius: 100px;
  /* 自动布局 */
  padding: 0 16px;
  font-size: 14px;
  justify-content: center;
  align-items: center;

  &-4 {
    background-color: rgba(0, 100, 255, 0.2);
    color: #0064FF;
  }

  &-5 {
    background-color: rgba(52, 155, 52, 0.2);
    color: #349B34;
  }

  &-6 {
    background-color: rgba(235, 55, 55, 0.2);
    color: #EB3737;
  }

}
</style>