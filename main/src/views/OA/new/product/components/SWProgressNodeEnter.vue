<template>
  <div>
    <div class="setProductInfoBg">
      <div class="setProductInfoBg-title">{{ formInline.nodeName }}</div>
      <div class="setProductInfoBg-enterBg" @click="enterNodeSetClick"
        v-if="isHasEditInfoPermission(formInline, true) && isProductInfoBgVisible">
        <div class="setProductInfoBg-enterBg-title">进入</div>
        <img class="setProductInfoBg-enterBg-arrow" src="@/assets/imgs/oa/product/arrow_white.png" />
      </div>
    </div>
    <!-- 编辑节点信息 -->
     <!-- 基本资料填写 -->
    <EditNodeInfoDialog ref="editNodeInfoDialogRef" :title="formInline.nodeName" :designInfo="designInfo"
      :forbidEdit="nodeIsForbidEdit()" @confirm="handleConfirm" />
      <!-- 运营信息填写 -->
    <EditOperationInfoDialog ref="editOperationInfoDialog" :forbidEdit="nodeIsForbidEdit()" @success="handleConfirm" />
    <EditOperationManagerDialog ref="operationManagerDialogRef" :forbidEdit="nodeIsForbidEdit()"
      @confirm="handleConfirm" @cancel="handleCancle" />

    <EditPurchaseManagerDistributionDialog ref="purchaseManagerDistributionDialogRef" :forbidEdit="nodeIsForbidEdit()"
      @confirm="handleConfirm" @cancel="handleCancle" />
    <EditBeforeProduceSampleDialog ref="uploadDialogRef" :forbidEdit="nodeIsForbidEdit()" @confirm="handleConfirm"
      @cancel="handleCancle" />
    <EditOperateDateDialog ref="editOperateDateDialogRef" :forbidEdit="nodeIsForbidEdit()" @confirm="handleConfirm" />
    <EditProcurementNoticeDialog ref="editProcurementNoticeRef" :title="formInline.nodeName"
      :forbidEdit="nodeIsForbidEdit()" @confirm="handleConfirm" />
    <EditFeishuOrderApprovalDialog ref="editFeishuOrderApprovalRef" :forbidEdit="nodeIsForbidEdit()"
      @confirm="handleConfirm" />
    <EditProductQualityDialog ref="editProductQualityDialogRef" :title="formInline.nodeName" :isAudit="false"
      :forbidEdit="nodeIsForbidEdit()" @confirm="handleConfirm" />
    <!-- 产品资质提交 -->
    <EditProductQualityDialog ref="editProductQualityAuditDialogRef" :title="formInline.nodeName" :isAudit="true"
      @confirm="handleConfirm" />
    <!-- 产前样审核 -->
    <PrenatalSampleAuditDialogRef ref="prenatalSampleAuditDialogRef" title="产前样详情" @success="handleSccess"
      :forbidEdit="nodeIsForbidEdit()" @confirm="handleConfirm" />
    <EditRiskAssessReportDialog ref="editRiskAssessReportDialogRef" :forbidEdit="nodeIsForbidEdit()"
      @confirm="handleConfirm" @cancel="handleCancle" />
    <!-- 供需计划 -->
    <EditSupplyAndDemandPlantDialog ref="editSupplyAndDemandPlanDialogRef" :forbidEdit="true" @confirm="handleConfirm"
      @cancel="handleCancle" />
    <EditPaperDocumentArchivingDialog ref="editPaperDocumentArchivingDialogRef" :forbidEdit="nodeIsForbidEdit()"
      @confirm="handleConfirm" @cancel="handleCancle" />
      <!-- 定品资料审批 -->
    <EditConfirmProductDataExamineDialog ref="editConfirmProductDataExamineDialogRef" :title="formInline.nodeName"
      :forbidEdit="true" @cancel="handleCancle" />
      <!-- ERP资料填写 -->
    <EditERPInfoDialog ref="editERPInfoDialogRef" :title="formInline.nodeName" :designInfo="designInfo"
      :forbidEdit="nodeIsForbidEdit()" @confirm="handleConfirm" />
  </div>
</template>

<script lang="ts" setup>
import { isHasEditInfoPermission } from '@/views/OA/new/product/utils.js'
import EditBeforeProduceSampleDialog from './editBeforeProduceSampleDialog.vue'
import EditNodeInfoDialog from './editNodeInfoDialog.vue'
import EditOperationInfoDialog from './editOperationInfoDialog.vue'
import EditOperationManagerDialog from './editOperationManagerDialog.vue'
import EditPurchaseManagerDistributionDialog from './editPurchaseManagerDistributionDialog.vue'
import PrenatalSampleAuditDialogRef from './prenatalSampleAuditDialog.vue'

import EditFeishuOrderApprovalDialog from './editFeishuOrderApprovalDialog.vue'
import EditOperateDateDialog from './editOperateDateDialog.vue'
import EditPaperDocumentArchivingDialog from './editPaperDocumentArchivingDialog.vue'
import EditProcurementNoticeDialog from './editProcurementNoticeDialog.vue'
import EditProductQualityDialog from './editProductQualificationsDialog.vue'
import EditRiskAssessReportDialog from './editRiskAssessReportDialog.vue'
import EditSupplyAndDemandPlantDialog from './editSupplyAndDemandPlantDialog.vue'
import EditConfirmProductDataExamineDialog from './editConfirmProductDataExamineDialog.vue'
import EditERPInfoDialog from './editERPInfoDialog.vue'

const props = defineProps({
  formInline: {
    type: Object as PropType<any>,
    default: () => { }
  },
  nodeList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  designInfo: {
    type: Object,
    default() {
      return {}
    }
  }
})

const editNodeInfoDialogRef = ref()
const editOperationInfoDialog = ref()
const editOperateDateDialogRef = ref()
const editProcurementNoticeRef = ref()
const editFeishuOrderApprovalRef = ref()
const editProductQualityDialogRef = ref()
const editProductQualityAuditDialogRef = ref()
// 产前样审核
const prenatalSampleAuditDialogRef = ref()

const operationManagerDialogRef = ref()
const purchaseManagerDistributionDialogRef = ref()
const uploadDialogRef = ref()
const editRiskAssessReportDialogRef = ref()
const editSupplyAndDemandPlanDialogRef = ref()
const editPaperDocumentArchivingDialogRef = ref()
const editConfirmProductDataExamineDialogRef = ref()
const editERPInfoDialogRef = ref()

// 节点是否禁止编辑
const nodeIsForbidEdit = () => {
  if (
    (props.formInline && Number(props.formInline.status || 0) === 1) ||
    Number(props.formInline.status || 0) === 2
  ) {
    return true
  }
  return false
}

const isProductInfoBgVisible = computed(() => {
  return [
    'ProductinformationFilling',
    'ERPInformationFilling',
    'OperationManagerDistribution',
    'PurchaseManagerDistribution',
    'OperationInformationFilling',
    'PreProductionSampleUpload',
    // 'ProcurementNotice',
    'OperationTimeFilling',
    'VisualTimeFilling',
    'FeishuOrderApproval',
    'ProductQualificationSubmit',
    'QAQualificationExamine',
    'PreProductionSampleAudit',
    'RiskAssessReport',
    'SupplyAndDemandPlan',
    'PaperDocumentArchiving',
    'ConfirmProductDataExamine'
  ].includes(props.formInline.nodeCode)
})

// 点击进入区分不同的节点进行操作
const selectItem = ref({})
const enterNodeSetClick = () => {
  selectItem.value = { ...props.formInline }
  console.log(props.formInline.nodeCode);

  if (props.formInline.nodeCode === 'OperationInformationFilling') {
    editOperationInfoDialog.value?.open(selectItem.value)
  } else if (props.formInline.nodeCode === 'OperationManagerDistribution') {
    operationManagerDialogRef.value?.open(selectItem.value)
  } else if (props.formInline.nodeCode === 'PurchaseManagerDistribution') {
    purchaseManagerDistributionDialogRef.value?.open(selectItem.value)
  } else if (props.formInline.nodeCode === 'PreProductionSampleUpload') {
    uploadDialogRef.value?.open(selectItem.value)
  } else if (props.formInline.nodeCode === 'ProcurementNotice') {
    editProcurementNoticeRef.value?.open(selectItem.value)
  } else if (props.formInline.nodeCode === 'OperationTimeFilling') {
    editOperateDateDialogRef.value?.open(selectItem.value, 'OperationTimeFilling')
  } else if (props.formInline.nodeCode === 'VisualTimeFilling') {
    editOperateDateDialogRef.value?.open(selectItem.value, 'VisualTimeFilling')
  } else if (props.formInline.nodeCode === 'FeishuOrderApproval') {
    editFeishuOrderApprovalRef.value?.open(selectItem.value, 'FeishuOrderApproval')
  } else if (props.formInline.nodeCode === 'ProductQualificationSubmit') {
    editProductQualityDialogRef.value?.open(selectItem.value, 'ProductQualificationSubmit')
  } else if (props.formInline.nodeCode === 'QAQualificationExamine') {
    editProductQualityAuditDialogRef.value?.open(selectItem.value, 'QAQualificationExamine')
  } else if (props.formInline.nodeCode === 'PreProductionSampleAudit') {
    // 产前样审核
    prenatalSampleAuditDialogRef.value?.open(selectItem.value, 'PreProductionSampleAudit')
  } else if (props.formInline.nodeCode === 'RiskAssessReport') {
    //风险评估报告
    editRiskAssessReportDialogRef.value?.open(selectItem.value, 'RiskAssessReport')
  } else if (props.formInline.nodeCode === 'SupplyAndDemandPlan') {
    //供需计划
    editSupplyAndDemandPlanDialogRef.value?.open(selectItem.value, 'SupplyAndDemandPlan')
  } else if (props.formInline.nodeCode === 'PaperDocumentArchiving') {
    //资料归档
    editPaperDocumentArchivingDialogRef.value?.open(selectItem.value, 'PaperDocumentArchiving')
  } else if (props.formInline.nodeCode === 'ConfirmProductDataExamine') {
    //定品资料审核
    editConfirmProductDataExamineDialogRef.value?.open(
      selectItem.value,
      'ConfirmProductDataExamine'
    )
  } else if (props.formInline.nodeCode === 'ERPInformationFilling') {
    //ERP信息填写
    editERPInfoDialogRef.value?.open(selectItem.value, 'ERPInformationFilling')
  } else {
    editNodeInfoDialogRef.value?.open(props.formInline)
  }
}

// 编辑节点信息成功
const handleConfirm = async () => {
  selectItem.value = {}
  emit('success')
}

// 提交成功
const handleSccess = () => {
  emit('success')
}

const handleCancle = () => {
  selectItem.value = {}
}

const emit = defineEmits([
  'handleConfirmOperationManager',
  'handleConfirmPurchaseManager',
  'success'
])



</script>

<style lang="scss" scoped>
.setProductInfoBg {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(100%);
  height: 56px;
  margin-bottom: 10px;
  background: linear-gradient(270deg, #fdf2ff 0%, #f6fcff 48%, #eff6ff 100%);
  // border-radius: 8px;

  &-title {
    padding-left: 10px;
    height: 23px;
    font-weight: 500;
    font-size: 18px;
    color: #0064ff;
    line-height: 23px;
  }

  &-enterBg {
    margin-left: auto;
    margin-right: 20px;
    width: 88px;
    height: 32px;
    cursor: pointer;
    background: #0064ff;
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &-title {
      font-size: 14px;
      color: #ffffff;
      line-height: 32px;
      padding-left: 20px;
    }

    &-arrow {
      width: 7px;
      height: 12px;
      margin-left: 13px;
      background: re;
    }
  }
}
</style>
