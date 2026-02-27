<template>
  <div>
    <div class="setProductInfoBg" v-if="isProductInfoBgVisible">
      <div class="setProductInfoBg-title">{{ formInline.nodeName }}</div>
      <div class="setProductInfoBg-enterBg" @click="enterNodeSetClick" v-if="canEnter">
        <div class="setProductInfoBg-enterBg-title">进入</div>
        <img
          class="setProductInfoBg-enterBg-arrow"
          src="@/assets/imgs/oa/product/arrow_white.png"
        />
      </div>
    </div>

    <!-- 编辑节点信息 -->
    <!-- 包装资料填写 -->
    <ProductInformationFillingDialog
      ref="ProductInformationFillingDialogRef"
      :title="formInline.nodeName"
      :designInfo="designInfo"
      :forbidEdit="selectItem.status != 'active'"
      @confirm="handleConfirm"
    />
    <!-- 其他 -->
    <EditNodeInfoDialog
      ref="editNodeInfoDialogRef"
      :title="formInline.nodeName"
      :designInfo="designInfo"
      :forbidEdit="nodeIsForbidEdit()"
      @confirm="handleConfirm"
    />

    <!-- 采购主管分配 -->
    <EditPurchaseManagerDistributionDialog
      ref="purchaseManagerDistributionDialogRef"
      :forbidEdit="selectItem.status != 'active'"
      :designInfo="designInfo"
      @confirm="handleConfirm"
      @cancel="handleCancle"
    />

    <!-- 采购信息填写 -->
    <EditProcurementNoticeDialog
      ref="editProcurementNoticeRef"
      :title="formInline.nodeName"
      :designInfo="designInfo"
      :forbidEdit="selectItem.status != 'active'"
      @success="handleConfirm"
    />

    <!-- 供需单 -->
    <EditSupplyAndDemandPlantDialog
      ref="editSupplyAndDemandPlanDialogRef"
      :forbidEdit="selectItem.status != 'active'"
      :designInfo="designInfo"
      @confirm="handleConfirm"
      @cancel="handleCancle"
    />
    <!-- 资料归档 -->
    <EditPaperDocumentArchivingDialog
      ref="editPaperDocumentArchivingDialogRef"
      :forbidEdit="nodeIsForbidEdit()"
      @confirm="handleConfirm"
      @cancel="handleCancle"
    />
    <!-- 归档 -->
    <Archive
      ref="ArchiveRef"
      :title="formInline.nodeName"
      :designInfo="designInfo"
      :forbidEdit="nodeIsForbidEdit()"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import EditNodeInfoDialog from './editNodeInfoDialog.vue'
import EditPurchaseManagerDistributionDialog from './editPurchaseManagerDistributionDialog.vue'
import ProductInformationFillingDialog from './productInformationFillingDialog.vue'

import Archive from './Archive.vue'
import EditPaperDocumentArchivingDialog from './editPaperDocumentArchivingDialog.vue'
import EditProcurementNoticeDialog from './editProcurementNoticeDialog.vue'
import EditSupplyAndDemandPlantDialog from './editSupplyAndDemandPlantDialog.vue'

// 获取当前用户
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const props = defineProps({
  formInline: {
    type: Object as PropType<any>,
    default: () => {}
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

const canEnter = computed(() => {
  return (
    props.formInline.submitUserList &&
    props.formInline.submitUserList.map((item) => item.userId).includes(userStore.user.id)
  )
})

const editNodeInfoDialogRef = ref()
const editProcurementNoticeRef = ref()
const purchaseManagerDistributionDialogRef = ref()
const editSupplyAndDemandPlanDialogRef = ref()
const editPaperDocumentArchivingDialogRef = ref()
const ArchiveRef = ref()
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
    'ProductInformationFilling',
    'ERPInformationFilling',
    'SupplyAndDemandPlan',
    'PurchaseManagerDistribution',
    'ProcurementNotice',
    'ApplicationProcurementPlan',
    'ProcurementPlanAudit',
    'Archive'
  ].includes(props.formInline.nodeCode)
})

const ProductInformationFillingDialogRef = ref()

// 点击进入区分不同的节点进行操作
const selectItem = ref({
  status: ''
})
const enterNodeSetClick = () => {
  selectItem.value = { ...props.formInline }

  if (props.formInline.nodeCode == 'ProductInformationFilling') {
    //包装资料填写
    ProductInformationFillingDialogRef.value?.open(selectItem.value)
  } else if (props.formInline.nodeCode === 'PurchaseManagerDistribution') {
    // 采购主管分配
    purchaseManagerDistributionDialogRef.value?.open(selectItem.value)
  } else if (props.formInline.nodeCode === 'ProcurementNotice') {
    // 采购信息填写
    editProcurementNoticeRef.value?.open(selectItem.value)
  } else if (
    props.formInline.nodeCode == 'ApplicationProcurementPlan' ||
    props.formInline.nodeCode == 'ProcurementPlanAudit'
  ) {
    //供需计划
    editSupplyAndDemandPlanDialogRef.value?.open(selectItem.value, props.formInline.nodeCode)
  } else if (props.formInline.nodeCode === 'PaperDocumentArchiving') {
    //资料归档
    editPaperDocumentArchivingDialogRef.value?.open(selectItem.value, 'PaperDocumentArchiving')
  } else if (props.formInline.nodeCode === 'Archive') {
    //归档
    ArchiveRef.value?.open(selectItem.value, 'Archive')
  } else {
    editNodeInfoDialogRef.value?.open(props.formInline)
  }
}

// 编辑节点信息成功
const handleConfirm = async () => {
  selectItem.value = {}
}

// 提交成功
const handleSccess = () => {
  emit('success')
}

const handleCancle = () => {
  selectItem.value = {}
}

const emit = defineEmits(['success'])
</script>

<style lang="scss" scoped>
.setProductInfoBg {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(100%);
  height: 56px;
  margin-bottom: 20px;
  background: linear-gradient(270deg, #fdf2ff 0%, #f6fcff 48%, #eff6ff 100%);
  border-radius: 8px;

  &-title {
    padding-left: 30px;
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
