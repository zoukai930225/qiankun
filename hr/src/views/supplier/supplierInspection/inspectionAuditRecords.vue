<template>
  <SWDrawer v-model="drawerVisible" width="600" :title="drawerTitle" :showTitleLine="true" :showBottomLine="true"
    v-loading="loading" @close="close">
    <el-scrollbar>
      <el-card shadow="never" v-for="(record, index) in auditRecords" :key="record.id" class="recordCard">
        <template #header>
          <div class="title">{{ `审核记录: ${index + 1}` }}</div>
        </template>
        <el-descriptions :column="2" border label-width="110" class="des">
          <el-descriptions-item label="申请合作模式" :width="150">
            {{ record.supplierType === "auxiliaryMaterials"? getAuxiliaryMaterialsCollabModeName(record.collabMode): getSupplierCollabModeName(record.collabMode)}}
          </el-descriptions-item>
          <el-descriptions-item label="审核人" :width="150">
            <LineAvatar v-if="getAuditUser(record)?.name" :user="{ avatarOrigin: getAuditUser(record)?.avatarOrigin, name: getAuditUser(record)?.name }" />
            <div v-else>-</div>
          </el-descriptions-item>
          <!-- <el-descriptions-item label="审核状态" :width="150">
            {{ getStatusStyle(record.status)?.text || '-' }}
          </el-descriptions-item> -->
          <el-descriptions-item label="审核状态" :width="150">
            <div v-if="getStatusStyle(record.status)?.text" :class="['tag',getStatusStyle(record.status)?.class]">{{ getStatusStyle(record.status)?.text }}</div>
            <div v-else>-</div>
          </el-descriptions-item>
          <el-descriptions-item label="审核时间">
            {{ record.updatedAt || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ record.remark || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-scrollbar>
    <template #footer>
      <div class=" mr10px">
        <el-button @click="close">关闭</el-button>
      </div>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { querySupplierAuditRecords } from '@/api/supplier/index'
import { DICT_TYPE, getDictLabel } from '@/utils/dict';

const getSupplierCollabModeName = (mode: string) => {
  if (!mode) return '-'
  const modeList = mode.split(',')
  return modeList?.map((code: any) => getDictLabel(DICT_TYPE.SUPPLIER_COLLAB_MODE, code)).join(',')
}
// 辅料供应商 合作模式转换名称 auxiliaryMaterials
const getAuxiliaryMaterialsCollabModeName = (mode:string)=>{
  if(!mode)return '-'
  const modeList = mode.split(',')
  return modeList?.map((code:any)=>getDictLabel('sc_supplier_auxiliary_materials_collab_mode',code)).join(',')
}
// 获取审核人
const getAuditUser = (arr:any)=>{
  return arr.collabModeExaminers?.length? arr.collabModeExaminers[0]:''
}
// 审核状态
const getStatusStyle = (status: number) => {
  if (status === 1) {
    // 待审核
    return {
      text: "待审核",
      class:'orange'
    }
  }
  if (status === 2) {
    // 审核通过
    return {
      text: "审核通过",
      class:'green'
    }
  }
  if (status === 3) {
    // 审核拒绝
    return {
      text: "审核拒绝",
      class:'red'
    }
  }
}

const drawerVisible = ref(false);
const drawerType = ref()
const drawerTitle = ref()
const loading = ref(false)
const auditRecords = ref<any>([])
const open = (type?: string, row?: any) => {
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = '审核记录'
  const supplierId = row.id
  querySupplierAuditRecords(supplierId).then((res: any) => {
    auditRecords.value = res
  })

}
const close = () => {
  drawerVisible.value = false
}

defineExpose({
  open
})

</script>
<style lang="scss" scoped>
:deep(.recordCard) {
  margin-bottom: 20px;
  border: none;
  border-radius: 8px;

  .el-card__header {
    .title {
      position: relative;
      font-size: 14px;
      font-weight: 600;
      padding-left: 7px;
      color: #333;

      &::before {
        position: absolute;
        display: block;
        content: '';
        width: 3px;
        height: 10px;
        background: #0064ff;
        left: 0px;
        top: 2px;
      }
    }
  }

}

:deep(.des) {
  width: 520px;
  --el-descriptions-table-border: 1px solid #e5e5e5;
  --el-descriptions-item-bordered-label-background: #F4F6FA;
  --el-text-color-regular: #666;

  :deep(.el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell) {
    vertical-align: middle;
  }

  .el-descriptions__content {
    max-width: 150px;
    word-wrap: break-word;
    vertical-align: middle;
    color: #333;
  }

  .tag {
    width: 64px;
    height: 28px;
    border-radius: 362px;
    text-align: center;
    line-height: 28px;
    font-size: 14px;

    &.red {
      background: rgba(235, 55, 55, 0.2);
      color: #eb3737;
    }

    &.green {
      background: #EDF5DD;
      color: #349B34;
    }

    &.orange {
      background: rgba(219, 106, 15, 0.2);
      color: #DB6A0F;
    }
  }
}
</style>