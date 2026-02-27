<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-17 14:00:00
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-18 14:47:41
-->
<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="900px"
    :class="['bonus-board-detail-dialog', dialogType === 'gcPerson' ? 'gc-person-dialog' : '']"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <!-- 汇总看板明细表格 -->
    <summary-rank-table v-if="dialogType === 'summary'" :data="dialogData" :max-height="500" />

    <!-- 个人金额合计分析明细列表 -->
    <div v-if="dialogType === 'gcPerson'">
      <person-amount-list :data="dialogData" />
    </div>

    <!-- 千川组新增金额分配明细表格 -->
    <qc-contribution-table
      v-if="dialogType === 'qcContribution'"
      :data="dialogData"
      :max-height="500"
    />

    <!-- 千川组编辑金额分配明细表格 -->
    <qc-edit-table v-if="dialogType === 'qcEdit'" :data="dialogData" :max-height="500" />
  </el-dialog>
</template>

<script lang="tsx" setup>
import SummaryRankTable from './tables/SummaryRankTable.vue'
import PersonAmountList from './tables/PersonAmountList.vue'
import QcContributionTable from './tables/QcContributionTable.vue'
import QcEditTable from './tables/QcEditTable.vue'

const visible = ref(false)
const dialogTitle = ref('')
const dialogType = ref('')
const dialogData = ref<any[]>([])

// 打开弹框
const open = (detail: { type: string; title: string; data: any[] }) => {
  dialogType.value = detail.type
  dialogTitle.value = detail.title
  dialogData.value = detail.data
  visible.value = true
}

defineExpose({
  open
})
</script>

<style lang="scss">
// 非 scoped 样式，用于修改 Element Plus Dialog 的默认样式
.bonus-board-detail-dialog {
  padding: 0;
  .el-dialog__header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    .el-dialog__title {
      font-size: 16px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0px;
      color: #333333;
    }
  }

  .el-dialog__body {
    padding: 20px !important;
    max-height: 500px;
    overflow-y: auto;
  }
}
.gc-person-dialog {
  .el-dialog__body {
    padding: 0 20px 20px !important;
  }
}
</style>
