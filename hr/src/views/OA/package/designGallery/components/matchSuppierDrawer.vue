<template>
  <div>
    <SWDrawer v-if="drawerVisible" v-model="drawerVisible" :title="drawerTitle">
      <div class="content" v-loading="drawerLoading" element-loading-text="提交中，请稍候...">
        <div class="content-left">
          <SuppierLeft :data="planData" :categoryList="categoryList" />
        </div>
        <div class="content-right">
          <div class="row-center">
            <div class="desc"></div>
            <div class="title">供应商选择</div>
          </div>
          <div class="suppierItem" v-for="(value, index) in suppierList" :key="index">
            <div class="suppierItem-header">
              <div class="suppierItem-header-name text1">
                <div> {{ getSuppierName(value.supplierId) }}</div>
                <div class="flex-row" style="display: flex; flex-direction: row; align-items: center">
                  <img src="@/assets/imgs/oa/audit_pass.png" alt="" v-if="value.supplierStatus == 1" class="icon" />
                  <img src="@/assets/imgs/oa/audit_fali.png" alt="" v-if="value.supplierStatus == 2" class="icon" />
                  <span class="select" :style="{
                    color:
                      value.supplierStatus == 1
                        ? '#349B34'
                        : value.supplierStatus == 2
                          ? '#EB3737'
                          : ''
                  }">
                    {{
                      value.supplierStatus == 1
                        ? '已选中'
                        : value.supplierStatus == 2
                          ? '已淘汰'
                          : ''
                    }}
                  </span>
                </div>
              </div>
              <div v-if="isShowSubmitBtn" style="margin-left: auto">
                <img v-if="
                  deleteIconHoverList[index] &&
                  suppierList.length > 1 &&
                  value.supplierStatus != 1 &&
                  value.supplierStatus != 2
                " class="suppierItem-header-delete" src="@/assets/imgs/upload_file_delete_hl.png" alt=""
                  @mouseleave="deleteIconHoverList[index] = false" @click="delHandle(value, index)" />
                <img v-else class="suppierItem-header-delete" src="@/assets/imgs/upload_file_delete.png"
                  @mouseenter="deleteIconHoverList[index] = true" @mouseleave="deleteIconHoverList[index] = false"
                  alt="" />
              </div>
            </div>
            <div style="display: flex; flex-direction: column">
              <div class="suppierItem-form">
                <div class="taotai" v-if="value.supplierStatus == 2" @click="showReason(value)">淘汰原因</div>
                <div class="suppierItem-form-label">供应商名称</div>
                <div class="suppierItem-form-value" style="width: 100%">
                  <template v-if="!(!isShowSubmitBtn ||
                    value.supplierStatus == 2 ||
                    value.supplierStatus == 1 ||
                    value.status == 1)">
                    <el-select v-model="value.supplierId" placeholder="请选择供应商" clearable filterable :disabled="!isShowSubmitBtn ||
                      value.supplierStatus == 2 ||
                      value.supplierStatus == 1 ||
                      value.status == 1
                      " @change="(val) => suppierSelectChange(val, index)">
                      <!-- disable的不展示 -->
                      <el-option v-for="item in suppierOptions
                        .map((item) => (item.disabled ? null : item))
                        .filter((item) => item)" :key="item.id" :label="item.supplierName" :value="item.id" />
                    </el-select>
                  </template>
                  <template v-else>
                    <el-input disabled :value="getSuppierName(value.supplierId)" :style="value.supplierStatus == 2 ? `width: calc(100% - 90px)` : ''"></el-input>
                  </template>
                </div>
              </div>
              <div v-if="!value.supplierId && clickConfirmBtn"
                style="color: #f56c6c; padding-left: 98px; padding-top: 6px; font-size: 12px">请选择供应商</div>
            </div>

            <div style="display: flex; flex-direction: column">
              <div class="suppierItem-form">
                <div class="suppierItem-form-label">匹配原因</div>
                <div class="suppierItem-form-value" style="width: 100%; height: 72px">
                  <s-text-area v-model="value.matchReason" style="width: 100%; height: 72px"
                    :autosize="{ minRows: 3, maxRows: 3 }" :disabled="!isShowSubmitBtn ||
                      value.supplierStatus == 2 ||
                      value.supplierStatus == 1 ||
                      value.status == 1
                      " placeholder="请输入匹配原因" />
                </div>
              </div>
              <div v-if="!value.matchReason && clickConfirmBtn"
                style="color: #f56c6c; padding-left: 98px; padding-top: 6px; font-size: 12px">请输入匹配原因</div>
            </div>
            <div style="display: flex; flex-direction: column">
              <div class="suppierItem-form">
                <div class="suppierItem-form-label">预估报价</div>
                <div class="suppierItem-form-value" style="width: 100%">
                  <el-input v-model="value.matchPrice" placeholder="请输入预估报价" :disabled="!isShowSubmitBtn ||
                    value.supplierStatus == 2 ||
                    value.supplierStatus == 1 ||
                    value.status == 1
                    " />
                </div>
              </div>
              <div v-if="!value.matchPrice && clickConfirmBtn"
                style="color: #f56c6c; padding-left: 98px; padding-top: 6px; font-size: 12px">请输入预估报价</div>
            </div>

            <div style="display: flex; flex-direction: column">
              <div class="suppierItem-form">
                <div class="suppierItem-form-label">附件(合同等)</div>
                <div class="suppierItem-form-value">
                  <uploadImg v-model:modelValue="value.attachment" />
                </div>
              </div>
              <!-- <div
                v-if="!value.attachment && clickConfirmBtn"
                style="color: #f56c6c; padding-left: 98px; padding-top: 6px; font-size: 12px"
                >请上传附件(合同等)</div
              > -->
            </div>
          </div>
          <div v-if="isShowSubmitBtn" class="addSuppierRow" @click="addMoreSuppier">
            <img class="addSuppierRow-img" src="@/assets/imgs/oa/design_add.png" alt="" />
            <div style="font-size: 14px; line-height: 20px; color: #0064ff; padding-left: 8px">点击添加</div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="handleClose" style="margin-left: 0px"
          :style="{ marginRight: isShowSubmitBtn ? '0px' : '20px' }">关闭</el-button>
        <el-button v-if="isShowSubmitBtn" type="primary" @click="saveDialog" style="margin-left: 16px">暂存</el-button>
        <el-button v-if="isShowSubmitBtn" type="primary" @click="confirmDialog"
          style="margin-left: 16px; margin-right: 20px">提交</el-button>
      </template>
    </SWDrawer>
    <ConfirmDialog ref="confirmDialogRef" @confirm="confirmSubmit" :title="'系统提醒'" cancelText="取消" confirmText="继续"
      content="正在提交当前“匹配供应商”节点，提交完成后，该节点流程将结束且不可修改，是否继续提交？" />
    <TaotaiDialog ref="taotaiDialogRef" />
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import uploadImg from '@/components/SWUoloadFile/index.vue'
import ConfirmDialog from '@/views/OA/package/product/components/confirmDialog.vue'
import SuppierLeft from './suppierLeft.vue'
import TaotaiDialog from './taotaiDialog.vue'

import * as CommonApi from '@/api/common'
import * as OADevelopApi from '@/api/oa/package/develop'
import { getNpDetail } from '@/api/oa/package/plan/index'

import { getSupplierList } from '@/api/oa/package/designGallery/index'
import { cloneDeep } from 'lodash-es'
const drawerVisible = ref(false)
const drawerTitle = ref('匹配供应商')
const drawerLoading = ref(false)
const developData = ref()
const clickConfirmBtn = ref(false)
const isShowSubmitBtn = ref(true)
const suppierList = ref<Array<any>>([])
const open = async (row) => {
  console.log('匹配供应商带过来的参数', row)

  tempSupplierList.value = []
  originSupplierList.value = []
  drawerVisible.value = true
  developData.value = row
  suppierList.value = []
  clickConfirmBtn.value = false
  isShowSubmitBtn.value = true
  getCategoryList()
  /// 企划详情
  getPlanInfo()
  //供应商终审查询名单
  getSuppierListReq()
  //获取保存的供应商列表
  getSaveSupplierList()
}
const deleteIconHoverList = ref([])
const suppierOptions = ref([])
const planData = ref()

// suppierList 里面有的供应商品 在suppierOptions选中中禁用

watch(
  () => suppierList.value,
  (newVal) => {
    let selectedIds = newVal.map((item) => item.supplierId).filter((id) => id)
    console.log('selectedIds', selectedIds)
    suppierOptions.value = suppierOptions.value.map((item) => {
      return {
        ...item,
        disabled: selectedIds.includes(item.id)
      }
    })
  },
  { deep: true }
)

const getPlanInfo = async () => {
  const res = await getNpDetail(developData.value.enterprisePlanId)
  planData.value = res || {}
}

const taotaiDialogRef = ref()
const showReason = (item) => {
  taotaiDialogRef.value?.open(item)
}

const getSuppierName = (suppier) => {
  let item = suppierOptions.value.find((item) => item.id === suppier)
  return (item && item.supplierName) || ''
}

const getSuppierListReq = async () => {
  const data = await getSupplierList({
    enterpriseId: developData.value.enterprisePlanId, // 企业规划ID
    developmentTaskId: developData.value.developmentTaskId, // 开发任务ID
    designGalleryId: developData.value.designGalleryId // 设计库ID
  })
  if (data && data.length > 0) {
    suppierOptions.value = []
    data.forEach((item) => {
      if (item) {
        suppierOptions.value.push(item)
      }
    })
  }
}

// 获取品类编码
const categoryList = ref<any[]>([])
const getCategoryList = async () => {
  const data = await CommonApi.getCategoryNameList().catch(() => { })
  if (data) {
    categoryList.value = data || []
  }
}

// 获取暂存的供应商列表
const tempSupplierList = ref([])
// 原始供应商列表
const originSupplierList = ref([])

const getSaveSupplierList = async () => {
  const data = await OADevelopApi.getNpSupplierMappingList({
    enterpriseId: developData.value.enterprisePlanId, // 企业规划ID
    developmentTaskId: developData.value.developmentTaskId, // 开发任务ID
    designGalleryId: developData.value.designGalleryId // 设计库ID
  })
  suppierList.value =
    data?.map((item) => {
      return {
        ...item,
        attachment: item.attachment
          ? item.attachment.split(',').map((el) => {
            return {
              url: el,
              name: el.split('?fileName=')[1]
            }
          })
          : []
      }
    }) || []
  // status 0为暂存的
  originSupplierList.value = cloneDeep(data || [])
  tempSupplierList.value = cloneDeep(suppierList.value.filter((item) => item.status == 0))
  if (suppierList.value.length === 0) {
    suppierList.value.push({ supplierId: '', matchReason: '', matchPrice: '', attachment: [] })
  }
}

const suppierSelectChange = (value, index) => {
  // 需要更新供应商
  let isExist = false
  suppierList.value.forEach((item, index1) => {
    if (item && item.supplierId && item.supplierId == value && index1 != index) {
      isExist = true
    }
  })
  if (isExist) {
    if (index < suppierList.value.length) {
      suppierList.value[index].supplierId = ''
    }
  }

  // 更新选中的供应商信息
  let selectItem = suppierOptions.value.find((item) => item.id == value)
  if (selectItem) {
    // 如果新的供应商在tempSupplierList中存在
    if (tempSupplierList.value.some((item) => item.supplierId == selectItem.id)) {
      suppierList.value[index] = {
        ...selectItem,
        ...originSupplierList.value.find((item) => item.supplierId == selectItem.id),
        matchPrice: suppierList.value[index].matchPrice,
        matchReason: suppierList.value[index].matchReason,
        id: originSupplierList.value.find((item) => item.supplierId == selectItem.id)?.id,
        status: originSupplierList.value.find((item) => item.supplierId == selectItem.id)?.status,
        supplierId: selectItem.id
      }
    } else {
      suppierList.value[index] = {
        matchPrice: suppierList.value[index].matchPrice,
        matchReason: suppierList.value[index].matchReason,
        supplierId: selectItem.id,
        supplierName: selectItem.supplierName
      }
    }
  }
}

const delHandle = async (item, index) => {
  // 已选中 或者已经淘汰或者status==1都不可以删除
  if (item.supplierStatus == 1 || item.supplierStatus == 2 || item.status == 1) {
    return
  }
  suppierList.value.splice(index, 1)
}

// 新增供应商
const addMoreSuppier = () => {
  suppierList.value.push({ supplierId: '', matchReason: '', matchPrice: '', attachment: [] })
}

const handleClose = () => {
  drawerVisible.value = false
}

const confirmDialogRef = ref()
const confirmDialog = () => {
  clickConfirmBtn.value = true
  let isHasSuppier = true
  console.log('suppierList.value', suppierList.value)

  suppierList.value.forEach((item) => {
    if (!item.supplierId || !item.matchReason || !item.matchPrice) {
      isHasSuppier = false
    }
  })
  if (!isHasSuppier) {
    return
  }
  confirmDialogRef.value?.open()
}

const confirmSubmit = () => {
  saveSuppierInfoReq(1)
}
const saveDialog = () => {
  clickConfirmBtn.value = true
  saveSuppierInfoReq(0)
}

// status 0 暂存 1 提交
const saveSuppierInfoReq = async (status) => {
  console.log('suppierList.value', suppierList.value)
  let isHasSuppier = true
  suppierList.value.forEach((item) => {
    if (!item.supplierId || !item.matchReason || !item.matchPrice) {
      isHasSuppier = false
    }
  })

  if (!isHasSuppier) {
    return
  }
  drawerLoading.value = true
  try {
    await OADevelopApi.npSupplierSaveOrSubmit({
      status,
      devPlanTaskId: developData.value.developmentTaskId, //开发任务id
      enterpriseId: developData.value.enterprisePlanId, //商企规划id
      designGalleryId: developData.value.designGalleryId, //产品设计图库id
      supplierMappingInfoDtoList: suppierList.value.map((item) => {
        return {
          ...item,
          attachment:
            item.attachment?.length > 0
              ? item.attachment.map((el) => `${el.url}?fileName=${el.name}`).join(',')
              : ''
        }
      })
    })
    ElMessage.success('操作成功')
    emit('confirmSuccess')
    handleClose()
  } finally {
    drawerLoading.value = false
  }
}

const emit = defineEmits(['confirmSuccess'])

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

    .desc {
      background: #0064ff;
      width: 3px;
      height: 10px;
    }

    .title {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      color: #333333;
      padding-left: 6px;
    }

    .suppierItem {
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
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;

          .select {
            margin-right: 6px;
          }

          .icon {
            width: 16px;
            height: 16px;
            margin-right: 3px;
          }
        }

        &-delete {
          margin-left: auto;
          width: 18px;
          height: 18px;
          margin-right: 20px;
          cursor: pointer;
        }
      }

      &-form {
        display: flex;
        flex-direction: row;
        // align-items: center;
        margin-top: 16px;
        position: relative;

        .taotai {
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
          font-size: 14px;
          color: #0064ff;
          border: 1px solid #0064ff;
          padding: 7px 12px;
          box-sizing: border-box;
          border-radius: 4px;
        }

        &-label {
          padding-top: 8px;
          font-size: 14px;
          color: #666666;
          line-height: 20px;
          margin-right: 12px;
          min-width: 82px;
          text-align: right;
        }

        &-value {}
      }
    }

    .addSuppierRow {
      margin-top: 16px;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;

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
</style>
