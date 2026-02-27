<template>
  <el-table
    class="SWCommonTable"
    stripe
    :data="list"
    :show-overflow-tooltip="false"
    v-loading="loading"
    v-horizontal-scroll="'always'"
    row-class-name="commonTableRow"
    :header-cell-style="appStore.headerCellStyle"
  >
    <el-table-column prop="channel" label="渠道" />
    <el-table-column prop="store" label="店铺" min-width="100" />
    <el-table-column prop="account" label="千川账号" />
    <el-table-column prop="standardLiveRoomName" label="标准直播间名称">
      <template #default="scope">
        {{ scope.row.standardLiveRoomName || '--' }}
      </template>
    </el-table-column>
    <el-table-column prop="universeLiveRoomName" label="全域直播间名称">
      <template #default="scope">
        {{ scope.row.universeLiveRoomName || '--' }}
      </template>
    </el-table-column>
    <el-table-column prop="financialStatements" label="财务流水">
      <template #default="scope">
        {{ scope.row.financialStatements || '--' }}
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="备注">
      <template #default="scope">
        {{ scope.row.remark || '--' }}
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button link type="primary" style="color: #0064ff" @click="handleUpdate(scope.row)"
          >修改</el-button
        >
        <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
    <template #empty>
      <div class="empty-img">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <div>暂无数据</div>
      </div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AccountListTable' })
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

defineProps({
  list: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// 编辑事件
const handleUpdate = (row: any) => {
  emits('update', row.id)
}

// 删除事件
const handleDelete = (row: any) => {
  emits('delete', row.id)
}

const emits = defineEmits(['update', 'delete'])
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
