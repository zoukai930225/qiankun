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
        <el-table-column label="电子面单时间" prop="channelSelectTime" min-width="180"
          :formatter="(row: any) => formatterValue(row, 'channelSelectTime', '-')" />
        <el-table-column :label="`${billMatchTypeName}账单月份`" prop="ztoSelectTime" min-width="180"
          :formatter="(row: any) => formatterValue(row, 'ztoSelectTime', '-')" />
        <el-table-column label="匹配时间" prop="matchTime" min-width="180"
          :formatter="(row: any) => formatTime(row.matchTime, 'yyyy-MM-dd HH:mm:ss')" />
        <el-table-column label="状态" prop="matchStatus" min-width="180">
          <template v-slot="{ row }">
            <div class="row-center">
              <div class="status-tag" :class="'status-tag-' + row.matchStatus">
                {{ getLabelByValue(matchStatusList, row.matchStatus + '') }}
              </div>
            </div>
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
  <matchDialog ref="matchDialogRef" @success="getList" :billMatchType="billMatchType"/>
</template>
<script lang="ts" setup>
import * as ztoEleDataApi from '@/api/finance/billMatch'
import { formatterValue, formatTime } from "@/utils";
import { matchStatusList, getLabelByValue } from '../common'
import matchDialog from "./matchDialog.vue";
import { useAppStore } from '@/store/modules/app'

const props = defineProps({
  billMatchType: {
    type: String,
    //中通ZTO ,圆通YTO
    default: 'ZTO'
  },
  billMatchTypeName: {
    type: String,
    default: '中通'
  }
})

const drawerVisible = ref(false)
const appStore = useAppStore()
const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const reset = () => {
  drawerVisible.value = false
}

const open = async () => {
  drawerVisible.value = true
  getList()
}

const queryParams = ref({
  billMatchType: props.billMatchType,
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ztoEleDataApi.billMatchRecordList(queryParams.value)
    if (data?.length) {
      list.value = data
    } else {
      list.value = []
    }
  } finally {
    loading.value = false
  }
}

const matchDialogRef = ref<any>()
const openAdd = () => {
  matchDialogRef.value.open()
}

defineExpose({ open })
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

  &-1 {
    background-color: rgba(0, 100, 255, 0.2);
    color: #0064FF;
  }

  &-2 {
    background-color: rgba(52, 155, 52, 0.2);
    color: #349B34;
  }

  &-3 {
    background-color: #E5E5E5;
    color: #666666;
  }

}
</style>