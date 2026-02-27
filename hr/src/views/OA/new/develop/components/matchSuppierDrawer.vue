<template>
  <div>
    <SWDrawer v-if="drawerVisible" v-model="drawerVisible" :title="drawerTitle">
      <div class="content" v-loading="drawerLoading" element-loading-text="提交中，请稍候...">
        <div class="content-left">
          <SupplierLeft :data="planData" :categoryList="categoryList" />
        </div>
        <div class="content-right" v-loading="supplierLoading">
          <div class="row-center">
            <div style="background: #0064ff; width: 3px; height: 10px"></div>
            <div style="
                font-size: 14px;
                font-weight: 600;
                line-height: 20px;
                color: #333333;
                padding-left: 6px;
              ">供应商选择</div>
          </div>
          <div class="supplierItem" v-for="(value, index) in supplierList" :key="index">
            <div v-if="value.supplierId !== '999'">
              <div class="supplierItem-header">
                <div class="supplierItem-header-name text1">
                  {{ getSupplierName(value.supplierId) }}
                </div>
                <div :class="['status', getStatus(value)?.className]" v-if="getStatus(value)?.isShow">
                  <img :src="getStatus(value)?.icon" />
                  <span>{{ getStatus(value)?.label }}</span>
                </div>
                <div v-if="isShowSubmitBtn" style="margin-left: auto">
                  <img v-if="deleteIconHoverList[index] && supplierList.length > 1" class="supplierItem-header-delete"
                    src="@/assets/imgs/upload_file_delete_hl.png" alt=""
                    @mouseleave="deleteIconHoverList[index] = false" @click="delHandle(value, index)" />
                  <img v-else class="supplierItem-header-delete" src="@/assets/imgs/upload_file_delete.png"
                    @mouseenter="deleteIconHoverList[index] = true" @mouseleave="deleteIconHoverList[index] = false"
                    alt="" />
                </div>
              </div>
              <div style="display: flex; flex-direction: column">
                <div class="supplierItem-form">
                  <div class="supplierItem-form-label">供应商名称</div>
                  <div class="supplierItem-form-value" style="width: 334px">
                    <el-select v-model="value.supplierId" placeholder="请选择供应商" clearable filterable
                      :disabled="!isShowSubmitBtn || value.status == 1">
                      <el-option v-for="item in supplierOptions" :disabled="disabledSupplierSelect(item.id)"
                        :key="item.id" :label="item.supplierName" :value="item.id" />
                    </el-select>
                  </div>
                  <!-- 淘汰原因  -->
                  <el-button v-if="Number(value.flowStatus) === 5 || Number(value.flowStatus) === 6"
                    @click="openDisuseReasonDialog(value)" class="disuseReason borderBtn">淘汰原因</el-button>
                </div>
                <div v-if="!value.supplierId && clickConfirmBtn"
                  style="color: #f56c6c; padding-left: 84px; padding-top: 6px; font-size: 12px">请选择供应商</div>
              </div>
              <div style="display: flex; flex-direction: column">
                <div class="supplierItem-form">
                  <div class="supplierItem-form-label">匹配原因</div>
                  <div class="supplierItem-form-value" style="width: 527px; height: 72px">
                    <s-text-area v-model="value.matchReason" style="width: 527px; height: 72px"
                      :autosize="{ minRows: 3, maxRows: 3 }" :disabled="!isShowSubmitBtn || value.status == 1"
                      placeholder="请输入匹配原因" />
                  </div>
                </div>
                <div v-if="!value.matchReason && clickConfirmBtn"
                  style="color: #f56c6c; padding-left: 84px; padding-top: 6px; font-size: 12px">请输入匹配原因</div>
              </div>
              <div style="display: flex; flex-direction: column">
                <div class="supplierItem-form">
                  <div class="supplierItem-form-label">预估报价</div>
                  <div class="supplierItem-form-value flex" style="width: 334px">
                    <el-input v-model="value.matchPrice" placeholder="请输入预估报价"
                      :disabled="!isShowSubmitBtn || value.status == 1" />

                    <el-button class="borderBtn ml20px" @click="openQuotation(value)"
                      v-if="value.displayQuotePrice">报价核价</el-button>
                  </div>
                </div>
                <div v-if="!value.matchPrice && clickConfirmBtn"
                  style="color: #f56c6c; padding-left: 84px; padding-top: 6px; font-size: 12px">请输入预估报价</div>
              </div>
            </div>
          </div>
          <div v-if="isShowAddBtn" class="addSupplierRow" @click="addMoreSupplier">
            <img class="addSupplierRow-img" src="@/assets/imgs/oa/design_add.png" alt="" />
            <div style="font-size: 14px; line-height: 20px; color: #0064ff; padding-left: 8px">点击添加</div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleClose" style="margin-left: 0px"
          :style="{ marginRight: isShowSubmitBtn && isShowSaveBtn ? '0px' : '20px' }">关闭</el-button>
        <el-button v-if="isShowSaveBtn" @click="saveDialog" class="ml16px borderBtn templeSaveBtn"
          :loading="saveLoading" :disabled="saveLoading">暂存</el-button>
        <el-button v-if="isShowSubmitBtn" :loading="saveLoading" :disabled="saveLoading" type="primary"
          @click="confirmDialog" style="margin-left: 16px; margin-right: 20px">提交</el-button>
      </template>
    </SWDrawer>
    <ConfirmDialog ref="confirmDialogRef" @confirm="confirmSubmit" :title="'系统提醒'" cancelText="取消" confirmText="继续"
      content="正在提交当前“匹配供应商”节点，提交完成后，该节点流程将结束且不可修改，是否继续提交？" />

    <!-- 淘汰原因 -->
    <disuseReasonDialog ref="disuseReasonDialogRef" />

    <!-- 报价核价 -->
    <QuotationVerification ref="quotationVerificationRef" @success="getSaveSupplierList" />
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import SupplierLeft from './suppierLeft.vue'
import disuseReasonDialog from './disuseReasonDialog.vue'
import ConfirmDialog from '@/views/OA/new/product/components/confirmDialog.vue'
// import * as OADevelopApi from '@/api/oa/new/develop'
import * as CommonApi from '@/api/common'
import { getNpDetail } from '@/api/oa/new/plan/index'
import doneSvg from '@/assets/svgs/done.svg'
import failSvg from '@/assets/svgs/failed.svg'

import QuotationVerification from '@/views/OA/new/designGallery/components/progressDialogComponents/quotationVerification.vue'

import {
  getSupplierList,
  queryMatchSupplier,
  updateMatchSupplier
} from '@/api/oa/new/designGallery/index'
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const developData = ref()
const clickConfirmBtn = ref(false)
const isShowSubmitBtn = ref(true)
const isShowSaveBtn = ref(true)
const isShowAddBtn = ref(true)
const open = async (row) => {
  drawerVisible.value = true
  drawerTitle.value = '匹配供应商'
  developData.value = row
  supplierList.value = [] as any
  clickConfirmBtn.value = false
  isShowSubmitBtn.value = true
  getCategoryList()
  getPlanInfo()
  getSupplierListReq()
  getSaveSupplierList()
}
const deleteIconHoverList = ref<any>([])

const supplierOptions = ref<any>([])
const planData = ref()

//  根据企划id获取企划信息
const getPlanInfo = async () => {
  const res = await getNpDetail(developData.value.enterprisePlanId)

  planData.value = res || {}
}

const getSupplierName = (supplier) => {
  let item = supplierOptions.value.find((item: any) => item.id === supplier)
  return (item && item.supplierName) || ''
}
const supplierList = ref<any>([])
const getSupplierListReq = async () => {
  const data = await getSupplierList().catch(() => { })
  if (data && data.length > 0) {
    supplierOptions.value = []
    data.forEach((item) => {
      if (item) {
        supplierOptions.value.push(item)
      }
    })
  }
}

// 淘汰原因
const disuseReasonDialogRef = ref()
const openDisuseReasonDialog = (data: any) => {
  disuseReasonDialogRef.value?.open({
    remark: data.eliminateRecord?.remark,
    attachmentUrl: data.eliminateRecord?.attachmentUrl
  })
}

// 报价核价
const quotationVerificationRef = ref()
const openQuotation = (item) => {
  quotationVerificationRef.value?.open(item,'update')
}

// 获取状态
const getStatus = (item: any) => {
  if (item.isMatched === 1) {
    return {
      icon: doneSvg,
      label: '已选中',
      className: 'pass',
      isShow: true
    }
  } else if (Number(item.flowStatus) === 5 || Number(item.flowStatus) === 6) {
    return {
      icon: failSvg,
      label: '已淘汰',
      className: 'fail',
      isShow: true
    }
  } else {
    return {
      icon: '',
      label: '',
      className: '',
      isShow: false
    }
  }
}

const categoryList = ref<any[]>([])
const getCategoryList = async () => {
  const data = await CommonApi.getCategoryNameList().catch(() => { })
  if (data) {
    categoryList.value = data || []
  }
}
//获取保存的供应商列表
const supplierLoading = ref(false)
const getSaveSupplierList = async () => {
  supplierLoading.value = true
  try{
    const data = await queryMatchSupplier({
      pictureId: developData.value.id
    })
    supplierList.value = data?.npSupplierMatchAllRespVos.length ? data?.npSupplierMatchAllRespVos : []
    if (supplierList.value.length === 0) {
      supplierList.value.push({ supplierId: '', matchReason: '', matchPrice: '' })
    }
    isShowSubmitBtn.value = data?.displaySubmit
    isShowSaveBtn.value = data?.displaySave
    isShowAddBtn.value = data?.displayAddSupplier
  }finally{
    supplierLoading.value = false
  }
}

//  控制供应商不可重复选择
const disabledSupplierSelect = (id: string) => {
  const index = supplierList.value.findIndex((li: any) => li.supplierId === id)
  return index >= 0
}

const delHandle = async (item, index) => {
  // if (item.id) {
  //   await OADevelopApi.npSupplierDelete(item.supplierId)
  //   supplierList.value.splice(index, 1)
  // } else {
  //   supplierList.value.splice(index, 1)
  // }
  supplierList.value.splice(index, 1)
}
const addMoreSupplier = () => {
  supplierList.value.push({ supplierId: '', matchReason: '', matchPrice: '' })
}

const handleClose = () => {
  drawerVisible.value = false
}

const confirmDialogRef = ref()
const confirmDialog = () => {
  clickConfirmBtn.value = true
  let isHasSupplier = true
  supplierList.value.filter(li => li.supplierId !== '999').forEach((item) => {
    if (!item.supplierId || !item.matchReason || !item.matchPrice) {
      isHasSupplier = false
    }
  })
  if (!isHasSupplier) {
    return
  }
  confirmDialogRef.value?.open()
}

const confirmSubmit = () => {
  saveSupplierInfoReq(1)
}
const saveDialog = () => {
  clickConfirmBtn.value = true
  saveSupplierInfoReq(0)
}

const saveLoading = ref(false)
// status 0 暂存 1 提交
const saveSupplierInfoReq = async (status) => {
  saveLoading.value = true
  let isHasSupplier = true
  supplierList.value.filter(li => li.supplierId !== '999').forEach((item) => {
    if (!item.supplierId || !item.matchReason || !item.matchPrice) {
      isHasSupplier = false
    }
  })
  if (!isHasSupplier) {
    return
  }
  drawerLoading.value = true
  try {
    await updateMatchSupplier({
      status,
      pictureId: developData.value.id,
      dataList: supplierList.value
    })
    ElMessage.success('操作成功')
    emit('success')
    handleClose()
  } finally {
    drawerLoading.value = false
    saveLoading.value = false
  }
}

const emit = defineEmits(['success'])

defineExpose({ open })
</script>

<style lang="less" scoped>
.content {
  background-color: #fff;
  width: 100%;
  height: auto;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: row;

  &-left {
    display: flex;
    flex-direction: column;
    width: 209px;
    height: auto;
    padding-right: 16px;
    margin-right: 20px;
    border-right: 1px solid #eceaea;
  }

  &-right {
    display: flex;
    flex-direction: column;
    height: auto;
    width: 610px;

    .supplierItem {
      &-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 20px;
        width: 610px;
        height: 40px;
        border-radius: 4px;
        background: #eff5ff;

        &-name {
          padding-left: 20px;
          font-size: 14px;
          font-weight: 500;
          line-height: normal;
          color: #333333;
        }

        &-delete {
          margin-left: auto;
          width: 18px;
          height: 18px;
          margin-right: 20px;
          cursor: pointer;
        }

        .status {
          margin-left: auto;
          margin-right: 20px;
          display: flex;

          img {
            margin-right: 4px;
          }

          font-size: 14px;
          font-weight: 600;

          &.pass {
            color: #349b34;
          }

          &.fail {
            color: #eb3737;
          }
        }
      }

      &-form {
        display: flex;
        flex-direction: row;
        // align-items: center;
        margin-top: 16px;

        &-label {
          padding-top: 8px;
          font-size: 14px;
          color: #666666;
          line-height: 20px;
          margin-right: 12px;
          width: 72px;
          text-align: right;
        }

        &-value {}

        .disuseReason {
          margin-left: auto;
        }
      }
    }

    .addSupplierRow {
      margin-top: 16px;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;

      &:hover {
        opacity: 0.5;
      }

      &-img {
        width: 14px;
        height: 14px;
      }
    }
  }
}

:deep(.el-textarea__inner) {
  color: #333333;
}

.borderBtn {
  border-color: #0064ff;
  background: #fff;
  color: #0064ff;
}
</style>
