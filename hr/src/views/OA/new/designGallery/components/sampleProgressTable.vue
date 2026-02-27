<template>
  <div class="title">{{ '打样进度' }}</div>
  <el-table :data="dataList" border :header-cell-style="appStore.headerCellStyle" stripe v-loading="loading">
    <el-table-column prop="supplierName" label="供应商名称"></el-table-column>
    <el-table-column label="当前节点">
      <template #default="{ row }">
        {{ stepInfoTitle(row.npSupplierAuditRecordList[row.npSupplierAuditRecordList.length - 1]) }}
      </template>
    </el-table-column>
    <el-table-column label="负责人">
      <template #default="{ row }">
        <line-reveals :no-bg="true" :tags="1"  :options-list="userList(row)" v-if="userList(row).length"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
// import {stepInfoTitle} from './SupplierStepItem.vue'
const appStore = useAppStore()
import LineReveals from "@/components/template/table/components/lineReveals.vue";

const stepInfoTitle = (item) => {
  if(!item)return ''
  if (item.flowStatus == '9') {
    if (item.todoNodeCode == 1) {
      return '试穿样审核'
    } else if (item.todoNodeCode == 2) {
      return '齐色样审核'
    } else if (item.todoNodeCode == 3) {
      return '报价核价 '
    } else if (item.todoNodeCode == 8) {
      return 'QA审核'
    } else if (item.todoNodeCode == 10) {
      return '试穿样重新上传'
    } else if (item.todoNodeCode == 11) {
      return '齐色样重新上传'
    } else if (item.todoNodeCode == 12) {
      return '试穿样/齐色样重新上传'
    }
  }
  if (item.flowStatus == '6') {
    return '审核确认'
  }
  if (Number(item.flowStatus || '') == 10) {
    return '试穿样重新上传'
  }
  if (Number(item.flowStatus || '') == 11) {
    return '齐色样重新上传'
  }
  if (Number(item.flowStatus || '') == 12) {
    return '试穿样/齐色样重新上传'
  }
  if (Number(item.flowStatus || '') == 2) {
    return '齐色样审核'
  }
  if (Number(item.flowStatus || '') == 8) {
    return 'QA审核'
  }
  if (
    (item.flowStatus == '1' && [1, 2, 3].includes(item.operateStatus)) ||
    item.flowStatus == '5'
  ) {
    if (item.flowStatus != '5') {
      return '试穿结果：继续调整'
    }
  } else if (
    (item.flowStatus == 1 && item.operateStatus == 4) ||
    [2, 3].includes(item.flowStatus)
  ) {
    return formatTitleByStep(item) || ''
  }
  if (item.flowStatus == '4') {
    return '备注'
  }
  if (item.flowStatus == '7') {
    return '色卡'
  }
  if (item.flowStatus == '5') {
    return '供应商已淘汰'
  }
  if (item.flowStatus == '6') {
    return '供应商淘汰已确认'
  }
  return ''
}
const formatTitleByStep = (step) => {
  if (step.flowStatus == '1' && step.operateStatus == 4) {
    return '试穿结果：通过'
  } else if (step.flowStatus == '2') {
    return '齐色样上传'
  } else if (step.flowStatus == '3') {
    return `报价核实：报价为 ${step.productCostIncludingTax} 元`
  } else if (step.flowStatus == '5') {
    return '已淘汰'
  }
  return ''
}

const props = defineProps({
  list: {
    type: Array as any,
    default: () => []
  },
  loading:{
    type:Boolean,
    default:false
  }
})
const dataList = computed(()=>{
  return props.list.filter((li:any)=>{
    return li.npSupplierAuditRecordList.length && li.npSupplierAuditRecordList.find((row:any)=>String(row.flowStatus) === '9')
  })
})

const userList = (row:any)=>{
  const currentStep = row.npSupplierAuditRecordList.length && row.npSupplierAuditRecordList[row.npSupplierAuditRecordList.length - 1]
  return currentStep?.todoPersonList? currentStep?.todoPersonList : currentStep.submitPersonName?[{ name:currentStep.submitPersonName,avatarOrigin:currentStep.submitPersonAvatar }] :[]
}

</script>

<style scoped lang="scss">
.title{
  font-size: 14px;
  color: #333;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
