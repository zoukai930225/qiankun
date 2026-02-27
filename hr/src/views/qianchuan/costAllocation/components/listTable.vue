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
    <el-table-column prop="store" label="账号归属店铺" :min-width="160" />
    <el-table-column prop="account" label="账单千川账号" :min-width="160">
      <template #default="{ row }">
        <span :class="{ underLine: !isView }" @click="handleViewDetail(row)">{{
          row.account
        }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="type" label="类型" :min-width="160">
      <template #default="scope">
        <span>{{ getDictLabel(DICT_TYPE.DOUYIN_PROMOTION_TYPE, scope.row.type) }}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="standardLiveRoomName" label="标准直播间名称" >
      <template #default="scope">
      {{ scope.row.standardLiveRoomName  || '--' }}
      </template>
    </el-table-column>
    <el-table-column prop="universeLiveRoomName" label="全域直播间名称" >
      <template #default="scope">
      {{ scope.row.universeLiveRoomName  || '--' }}
      </template>
    </el-table-column> -->
    <!-- <el-table-column prop="financialStatements" label="财务流水" >
      <template #default="scope">
      {{ scope.row.financialStatements  || '--' }}
      </template>
    </el-table-column> -->
    <el-table-column prop="actualConsumStore" label="实际消耗店铺" :min-width="160" />
    <el-table-column prop="goodsId" label="商品ID" :min-width="160" />
    <el-table-column prop="orgType" label="来源平台" width="120" show-overflow-tooltip :formatter="(row) => getDictLabel(DICT_TYPE.ORG_TYPE,row.orgType)||'-'"/>
    <el-table-column prop="accountType" label="账户类型" width="120" show-overflow-tooltip :formatter="(row) => getDictLabel(DICT_TYPE.QC_ACCOUNT_TYPE,row.accountType)||'-'"/>
    <el-table-column prop="remark" label="备注">
      <template #default="scope">
        {{ scope.row.remark || '--' }}
      </template>
    </el-table-column>
    <el-table-column prop="beginDate" label="开始日期" :min-width="120" />
    <el-table-column prop="endDate" label="截止日期" :min-width="120" />

    <el-table-column label="操作" width="160" align="left" v-if="!isView" fixed="right">
      <template #default="scope">
        <el-button link type="primary" style="color: #0064ff" @click="handleUpdate(scope.row)"
          >编辑</el-button
        >
        <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
        <el-button link type="primary" style="color: #0064ff" @click="handleExpire(scope.row)"
          >到期</el-button
        >
      </template>
    </el-table-column>
    <template #empty>
      <div class="empty-img">
        <!-- <img src="@/assets/imgs/common/empty_list.png" alt="" /> -->
        <div>暂无数据</div>
      </div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
defineOptions({ name: 'CostAllocationListTable' })
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const message = useMessage()
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
  },
  isView: {
    type: Boolean,
    default: false
  }
})

// 排序事件
const handleUpdate = (row: any) => {
  emits('update', row.id)
}

// 删除事件
const handleDelete = (row: any) => {
  emits('delete', row.id)
}
// 到期事件
const handleExpire = async (row: any) => {
  await message.confirm('确认是否已到期？')
  emits('expire', row.id)
}

// 查看
const handleViewDetail = (row: any) => {
  emits('detailView', row.account, row.type)
}

const emits = defineEmits(['update', 'delete', 'expire', 'detailView'])
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
.underLine {
  cursor: pointer;
  color: #0064ff;
  &:hover {
    opacity: 0.8;
  }
}
</style>
