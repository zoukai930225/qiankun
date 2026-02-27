<template>
  <ContentWrap class="min-w-1300px">
    <el-row :gutter="24">
      <el-col :span="20" class="!flex-1">
        <el-form ref="queryFormRef" :model="queryParams" :label-width="85">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label-width="0">
                <el-input :prefix-icon="Search" class="keyword" v-model="queryParams.keyword" :placeholder="placeholder"
                  clearable @keyup.enter="handleQuery" @clear="handleQuery">
                  <template #prepend>
                    <el-select v-model="queryParams.keyType" @change="handleChangeKeyType">
                      <el-option label="供应商简称" :value="1" />
                      <el-option label="公司名称" :value="2" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商类型" prop="supplierType">
                <el-select class="!w-260px" v-model.trim="queryParams.supplierType" placeholder="请选择" clearable
                  @change="handleQuery">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_TYPE, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商状态">
                <el-select class="!w-260px" v-model="queryParams.supplierStatus" placeholder="请选择供应商状态" clearable
                  @change="handleQuery" @clear="handleQuery">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_STATUS, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="评估日期">
                <el-date-picker v-model="queryParams.time" type="daterange" range-separator="至" @change="handleQuery"
                  start-placeholder="开始日期" end-placeholder="结束日期" class="!w-240px" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="提交日期">
                <el-date-picker v-model="queryParams.commitTime" type="daterange" range-separator="至"
                  @change="handleQuery" start-placeholder="开始日期" end-placeholder="结束日期" class="!w-240px"
                  value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合作模式">
                <el-select class="!w-260px" v-model="queryParams.collabModeList" placeholder="请选择" style="width: 100%"
                  clearable multiple collapse-tags collapse-tags-tooltip @change="handleQuery">
                  <el-option v-for="dict in supplierCollModeList" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合作品类">
                  <el-select class="!w-260px" v-model="queryParams.collabCategoryList" placeholder="请选择" style="width: 100%"
                    clearable multiple collapse-tags collapse-tags-tooltip @change="handleQuery">
                    <el-option v-for="dict in supplierCollCategoryList":key="dict.categoryCode"
                      :value="dict.categoryCode" :label="dict.categoryName" />
                  </el-select>
                </el-form-item>
            </el-col>
          </el-row>
          
        </el-form>
      </el-col>

      <el-col :span="4" class="!flex justify-end min-w-200px">
        <el-button @click="handleQuery" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn ml-0"> 重置 </el-button>
      </el-col>
    </el-row>

    <div class="container-body">
      <div class="body_title">
        <span>供应商列表</span>
        <el-button v-if="permissionSet.has('supplierManage:SupplierBlock')" type="primary" class="blockRecord"
          @click="router.push({ name: 'SupplierBlock' })">拉黑记录</el-button>
        <evaluation-item v-if="permissionSet.has('supplierManage:EvaluationItem')" />
      </div>
      <div class="supplierList">
        <el-table class="SWCommonTable" :data="valueList" width="100%" v-horizontal-scroll="'always'"
          row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" border v-loading="loading">
          <el-table-column label="编码" min-width="100px" fixed="left" prop="supplierCode"
            :formatter="(row: any) => formatterValue(row, 'supplierCode', '-')" />
          <el-table-column label="合作品类" min-width="160px" prop="collabCategoryNames" show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'collabCategoryNames', '-')" />
          <el-table-column label="供应商简称" prop="abbreviationCompany" min-width="180px" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="flex items-center">
                <el-tooltip content="模式变更待验厂">
                  <img v-if="row.pendingInspection === 1" :src="warningSvg" class="mr8px"
                    style="width: 14px;height:14px" />
                </el-tooltip>
                <span style="overflow:hidden;text-overflow:ellipsis">{{ row.abbreviationCompany || '-' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="公司名称" prop="fullCompany" min-width="180px" show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'fullCompany', '-')" />
          <el-table-column label="供应商类型" prop="supplierType" min-width="95px" show-overflow-tooltip :formatter="(row: any) => getDictLabel(DICT_TYPE.SUPPLIER_TYPE, row.supplierType) || '-'
            " />
          <el-table-column label="统一社会信用代码" prop="socialCreditCode" min-width="180px" show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'socialCreditCode', '-')" />
          <el-table-column label="供应商状态" prop="supplierStatus" min-width="100px" show-overflow-tooltip>
            <template #default="{ row }">
              <span :class="['status', `status_${row.supplierStatus}`]">{{
                getSupplierStatusName(row.supplierStatus) || '-' }}</span>
            </template>
          </el-table-column>
           <el-table-column label="下单金额" min-width="100px"   prop="maxOrderAmount" >
            <template #default="{ row }">
              <div class="flex items-center">
                <el-tooltip content="下单金额已超出验厂设定限额，请指派人员或重新验厂">
                  <img v-if="row.hasExceedAmountLimit === 1" :src="warningSvg" class="mr8px"
                    style="width: 14px;height:14px" />
                </el-tooltip>
                <span style="overflow:hidden;text-overflow:ellipsis">{{ row.maxOrderAmount || '-' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="是否需验厂" prop="needInspection" min-width="95px" show-overflow-tooltip :formatter="(row: any) => getDictLabel('need_inspection', row.needInspection) || '-'
            " />
          <el-table-column label="验厂次数" prop="numberOfFactoryInspections" show-overflow-tooltip align="right"
            min-width="95px">
            <template #default="{ row }">
              <span @click="showRecord(row)" :class="[!!Number(row?.numberOfFactoryInspections || 0) ? 'click' : '']">{{
                row.numberOfFactoryInspections || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="评估得分" prop="assessmentScore" show-overflow-tooltip align="right"
            :formatter="(row: any) => formatterValue(row, 'assessmentScore', '-')" min-width="95px" />
          <el-table-column label="评估人员" prop="evaluators" min-width="100px" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="flex items-center" v-if="row.evaluator?.name">
                <!-- <el-avatar :src="row.evaluator?.avatarOrigin":size="20" class="mr4px" /> -->
                <span>{{ row.evaluator?.name || '-' }}</span>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="评估日期" min-width="180px" prop="evaluationDate" show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'evaluationDate', '-')" />
          <el-table-column label="提交日期" min-width="180px" prop="commitTime" show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'commitTime', '-')" />
          <el-table-column label="开发人员" prop="developerName" min-width="100px" show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'developerName', '-')" />
          <el-table-column label="审核次数" prop="collabModeList" min-width="100px" show-overflow-tooltip align="right">
            <template #default="{ row }">
              <span :class="[!!Number(row?.auditCount || 0) ? 'click' : '']" @click="openInspectionAuditRecord(row)">{{
                row.auditCount }} </span>
            </template>
          </el-table-column>
          <el-table-column label="合作模式" prop="collabMode" min-width="140px" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.supplierType === 'auxiliaryMaterials' ? getAuxiliaryMaterialsCollabModeName(row.collabMode) :
                getSupplierCollabModeName(row.collabMode) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :width="maxWidth" fixed="right">
            <template #default="{ row }">
              <div class="optionDiv">
                <el-button link v-for="(btn, idx) in row.btns.showBtn" :key="idx" @click="btn.method"
                  :type="btn.type">{{
                    btn.label }}</el-button>
                <el-popover placement="bottom-end" v-if="row.btns.hideBtns.length">
                  <template #reference>
                    <img src="@/assets/svgs/moreBtn.svg" class="ml10px" alt="" style="width: 18px;height:18px" />
                  </template>
                  <div class="hideBtns">
                    <slot v-for="(btn, index) in row.btns.hideBtns" :key="index" :name="`${btn.label}`" :btn="btn">
                      <el-button link :type="btn.type" @click="btn.method">{{ btn.label }}</el-button>
                    </slot>
                  </div>
                </el-popover>
                <!-- <el-button link type="primary" @click="scanHandle(row)" class="btn normal">查看资质</el-button>
                <el-button v-if="['0', '1'].includes(row.supplierStatus)" link type="primary"
                  @click="inspectionRef?.open(row)" class="btn normal">验厂</el-button>
                <el-button v-if="['2'].includes(row.supplierStatus)" link type="primary"
                  @click="abbreviationRef?.open(row)" class="btn normal">供应商简称</el-button>
                <el-button v-if="row.supplierStatus === '2' && !!row?.syncWdt" link type="primary"
                  @click="accountRef?.open(row)" class="btn normal">系统账号</el-button>
                  <el-button v-if="row.supplierStatus === '2'" link type="primary" @click="openCollabModeDialog( row)"
                  class="btn normal">模式变更</el-button>
                <el-button v-if="row.supplierStatus === '2'" link type="danger" @click="blockRef?.open('block', row)"
                  class="btn del">拉黑</el-button>
                <el-button v-if="row.supplierStatus === '4'" link type="primary" @click="blockRef?.open('unblock', row)"
                  class="btn normal">拉黑原因</el-button> -->
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <Pagination v-model:limit="queryParams.size" v-model:page="queryParams.page" :total="total"
          @pagination="getSupplierInfo" />
      </div>
      <supplier-abbreviation ref="abbreviationRef" @updated="updateValue" />
      <supplier-account ref="accountRef" />
      <supplier-info ref="supplierRef" />
      <inspection-record ref="recordRef" />
      <inspection ref="inspectionRef" @search="handleQuery" />
      <!-- 查看 -->
      <ScanInfo ref="scanRef" />
      <!-- 审核人员设置 -->
      <AuditorSet ref="auditorRef" />
      <!-- 审核 -->
      <AuditForm ref="auditRef" @on-close="handleQuery" />

      <!-- 拉黑 -->
      <blockSupplierDialog ref="blockRef" @success="queryByStatus" />
      <!-- 验厂审核记录 -->
      <inspectionAuditRecords ref="inspectionAuditRecordsRef" />
      <!-- 合作模式变更申请 -->
      <collabModeDialog ref="collabModeDialogRef" @success="handleQuery" :hasCollabModePermission="hasCollabModePermission" />
      <!-- 合作品类变更 -->
      <supplierCategory ref="supplierCategoryRef" @success="handleQuery" />
      <!-- 反审 结算方式修改 -->
      <supplierPaymentMethod ref="supplierPaymentMethodRef" @success="handleQuery" />
      <!-- 框架合同 -->
      <frameworkAgreement ref="frameworkAgreementRef" @success="handleQuery" />
      <!-- 评估人员配置 -->
      <evaluatorsDialog ref="evaluatorsDialogRef" @success="handleQuery" />
    </div>
  </ContentWrap>

  <add-form ref="addFormRef" :type="formType" @refresh="handleQuery" />
</template>
<script setup lang="ts">
import warningSvg from '@/assets/svgs/supplier/warning.svg'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict';
import { deleteSupplierInfo, getSupplierAllInfo } from '@/api/supplier';
import InspectionRecord from './components/inspectionRecord.vue';
import SupplierAbbreviation from './components/abbreviation.vue';
import EvaluationItem from "./components/evaluation.vue";
import SupplierAccount from './components/account.vue';
import Inspection from './components/inspection.vue';
import { useAppStore } from '@/store/modules/app';
import SupplierInfo from './components/info.vue';
import { Search } from '@element-plus/icons-vue';
import ScanInfo from './components/scan.vue';
import AddForm from './components/info.vue';
import AuditorSet from './AuditorSet.vue';
import { formatterValue, getPermission } from "@/utils";
import AuditForm from './AuditForm.vue';
import blockSupplierDialog from './supplierBlock/blockSupplierDialog.vue';
import inspectionAuditRecords from './supplierInspection/inspectionAuditRecords.vue';
import collabModeDialog from './supplierInspection/collabModeDialog.vue';
import supplierCategory from './supplierInspection/supplierCategory.vue';
import supplierPaymentMethod from './supplierInspection/supplierPaymentMethod.vue';
import frameworkAgreement from './supplierInspection/frameworkAgreement.vue';
import evaluatorsDialog from './supplierInspection/evaluatorsDialog.vue';
import { queryCategoryTree } from '@/api/system/categoryManager'

import { useRole } from '@/hooks/common/useRole';
const { getPermissionInfo,grabCheck } = useRole('供应链')
// 是否有指派评估人员权限
const hasAssignEvaluatorsPermission = computed(() => grabCheck('指派评估人员'))  
// 是否有变更评估人员权限
const hasChangeEvaluatorsPermission = computed(() => grabCheck('变更评估人员'))  
// 合作模式修改权限
const hasCollabModePermission = computed(() => grabCheck('合作模式修改'))  

const router = useRouter()

class SearchItem {
  page: number = 1
  size: number = 10
  keyword: string = ''
  supplierStatus: string = ''
  time: Array<string> = []
  commitTime: Array<string> = []
  keyType: number = 1
  supplierType: string = ''
  collabMode: string = ''
  collabModeList: Array<string> = []
  collabCategoryList?: Array<string> = []
  collabCategory:string = ''
}

class SearchParams {
  page: number
  size: number
  keyword: string
  supplierStatus: string
  commitTimeStart: string | null
  queryStartDate: string
  commitTimeEnd: string | null
  queryEndDate: string
  keyType: number
  supplierType: string
  collabMode: string
  collabCategory: string 
  constructor(params?: any) {
    this.page = params?.page || 1
    this.size = params?.size || 10
    this.keyword = params?.keyword || ''
    this.supplierStatus = params?.supplierStatus || ''
    this.queryStartDate = params?.time?.length ? params?.time[0] : null
    this.queryEndDate = params?.time?.length ? params?.time[1] : null
    this.commitTimeStart = params?.commitTime?.length ? `${params.commitTime[0]} 00:00:00` : null
    this.commitTimeEnd = params?.commitTime?.length ? `${params.commitTime[1]} 23:59:59` : null
    this.keyType = params?.keyType || 1
    this.supplierType = params?.supplierType || ''
    this.collabMode = params?.collabModeList?.length ? params?.collabModeList.join(',') : ''
    this.collabCategory = params?.collabCategoryList?.length ? params?.collabCategoryList.join(',') : ''
  }
}

const appStore = useAppStore()
const message = useMessage()

// 供应商状态
const getSupplierStatusName = (status: string) => {
  if (status === '9') {
    return '待录入'
  } else {
    return getDictLabel(DICT_TYPE.SUPPLIER_STATUS, status)
  }
}
// 供应商合作模式
const supplierCollModeList = computed(() => {
  return [...getIntDictOptions(DICT_TYPE.SUPPLIER_COLLAB_MODE, true), ...getIntDictOptions('sc_supplier_auxiliary_materials_collab_mode', true)]
})
// 合作品类
const supplierCollCategoryList = ref<any>([])
const getCategoryTree = async()=>{
  queryCategoryTree().then((res:any)=>{
    supplierCollCategoryList.value = res || []
  })
}
// 查询参数
const total = ref(0),
  accountRef = ref(),
  abbreviationRef = ref(),
  recordRef = ref(),
  inspectionRef = ref()
const queryParams = ref<SearchItem>(new SearchItem())
const placeholder = ref('请输入供应商')
const addFormRef = ref()
const formType = ref<'add' | 'edit'>('edit')

// 重置
const resetQuery = () => {
  queryParams.value = new SearchItem()
  handleQuery()
}

// 查询
const handleQuery = () => {
  queryParams.value.page = 1
  getSupplierInfo()
}
// 拉黑后带状态查询
const queryByStatus = (status: string) => {
  // queryParams.value.page = 1
  // queryParams.value.supplierStatus = status
  getSupplierInfo()
}

//评估人员配置
const evaluatorsDialogRef = ref()
const openEvaluatorsDialog = (row: any) => {
  evaluatorsDialogRef.value?.open(row)
}
const hideBtns = ref<any>([])
const showBtns = ref<any>([])
const btnsOptions = (row: any) => {
  hideBtns.value = []
  const supplierInfoBtn = { label: "查看资质", type: "primary", method: () => scanHandle(row), permission: 'supplierManage:supplierInfoBtn' }
  const inspectionBtn = { label: "验厂", type: "primary", method: () => inspectionRef.value?.open(row), permission: 'supplierManage:inspectionBtn' }
  const sysAccountBtn = { label: "系统账号", type: "primary", method: () => accountRef.value?.open(row), permission: 'supplierManage:sysAccountBtn' }
  const modelBtn = { label: "模式变更", type: "primary", method: () => openCollabModeDialog(row), permission: 'supplierManage:modelBtn' }
  const categoryBtn = { label: "品类变更", type: "primary", method: () => openSupplierCategory(row), permission: 'supplierManage:categoryBtn' }
  const blockReasonBeBtn = { label: "拉黑原因", type: "primary", method: () => blockRef.value?.open('unblock', row), permission: 'supplierManage:blockReasonBeBtn' }
  const blockBtn = { label: "拉黑", type: "danger", method: () => blockRef.value?.open('block', row), permission: 'supplierManage:blockBtn' }
  const paymentMethodBtn = { label: "反审", type: "primary", method: () => openSupplierPaymentMethod(row), permission: 'supplierManage:paymentMethodBtn' }
  const contractBtn = { label: "框架合同", type: "primary", method: () => openFrameworkAgreement(row), permission: 'supplierManage:contractBtn' }
  const evaluatorsBtn = { label: row.supplierStatus === '5'? '指派评估人':'变更评估人', type: "primary", method: () => openEvaluatorsDialog(row), permission: 'supplierManage:evaluatorsBtn' }
  showBtns.value = [supplierInfoBtn]
  if (['0', '1'].includes(row.supplierStatus)) {
    showBtns.value.push(categoryBtn)
    showBtns.value.push(inspectionBtn)
  }
  if(['2','3'].includes(row.supplierStatus) && !hasCollabModePermission.value){
    // 供应商类型不是辅料的
    if (!row.collabMode?.split(',')?.includes('2') && row.supplierType !== 'auxiliaryMaterials') {
      showBtns.value.push(modelBtn)
    }
    // 供应商类型为辅料的
    if (row.supplierType === 'auxiliaryMaterials' && row.collabMode?.split(',')?.length < 3) {
      showBtns.value.push(modelBtn)
    }
  }
  // 独立权限 不是拉黑状态都可以修改
  if (hasCollabModePermission.value && !['4'].includes(row.supplierStatus)) {
    showBtns.value.push(modelBtn)
  }
  if (row.supplierStatus === '2') {
    showBtns.value.push(categoryBtn)
    if (!!row?.syncWdt) {
      showBtns.value.push(sysAccountBtn)
    }
    if (row.pendingInspection === 1) {
      showBtns.value.push(inspectionBtn)
    }
    if (row.paymentMethodBtn) {
      showBtns.value.push(paymentMethodBtn)
    }
    if (row.contractBtn) {
      showBtns.value.push(contractBtn)
    }
    showBtns.value.push(blockBtn)
  }
  if (row.supplierStatus === '4') {
    showBtns.value = [supplierInfoBtn, blockReasonBeBtn]
  }
  // 指派评估人员权限
  if (hasAssignEvaluatorsPermission.value && row.supplierStatus === '5') {
    showBtns.value.push(evaluatorsBtn)
  }
  // 变更评估人员权限
  if (hasChangeEvaluatorsPermission.value && !['5','4'].includes(row.supplierStatus)) {
    showBtns.value.push(evaluatorsBtn)
  }
  

  const permissionSet = new Set(getPermission())

  showBtns.value = showBtns.value.filter(ele => permissionSet.has(ele.permission))

  return { showBtn: showBtns.value.slice(0, 3), hideBtns: showBtns.value.slice(3) }
}
// 计算操作列宽度
const maxWidth = ref()
function renderWidth() {
  // 获取操作按钮组的元素
  setTimeout(() => {
    const opts = document.getElementsByClassName('optionDiv');
    let widthArr = [] as any;
    // 取操作组的最大宽度
    Array.prototype.forEach.call(opts, function (item: any) {
      widthArr.push(item.offsetWidth);
    });
    // 重新设置列标题及宽度属性
    maxWidth.value = Math.max(...widthArr) + 24;
  }, 10)

}
// 获取数据
const loading = ref(false)
const valueList = ref<any>([])
const getSupplierInfo = async () => {
  loading.value = true
  try {
    const res = await getSupplierAllInfo(new SearchParams(queryParams.value))
    valueList.value = res.records?.map((item) => ({
      ...item,
      btns: btnsOptions(item)
    })) || []
    total.value = res.total
  } finally {
    loading.value = false
  }
  await nextTick()
  renderWidth()
}

const showRecord = (row: any) => {
  !!row?.numberOfFactoryInspections &&
    Number(row.numberOfFactoryInspections) !== 0 &&
    recordRef?.value?.open(row)
}

const updateValue = (item: any) => {
  valueList.value = valueList.value.map((vs: any) =>
    vs.id === item.id ? { ...vs, abbreviationCompany: item?.abbreviationCompany || '' } : vs
  )
}

// 审核人员
const auditorRef = ref()
// const openAuditor = () => {
//   auditorRef.value.open()
// }
// 查看
const scanRef = ref(),
  supplierRef = ref()
const scanHandle = async (item: any) =>
  supplierRef?.value?.open(item.id, ['0', '1'].includes(item.supplierStatus))
// {
//   scanRef.value.open(item.id)
// }
// 审核
const auditRef = ref()
// const verifyHandle = (item: any) => {
//   auditRef.value.open(item.id, item.isExamine, item.examineMes)
// }

// 拉黑
const blockRef = ref()

// 验厂 合作模式变更审核记录
const inspectionAuditRecordsRef = ref()
const openInspectionAuditRecord = (row: any) => {
  !!row?.auditCount &&
    Number(row.auditCount) !== 0 &&
    inspectionAuditRecordsRef.value?.open('', row)
}
const collabModeDialogRef = ref()
const openCollabModeDialog = (row: any) => {
  collabModeDialogRef.value?.open('', row)
}
const getSupplierCollabModeName = (mode: string) => {
  if (!mode) return '-'
  const modeList = mode.split(',')
  return modeList?.map((code: any) => getDictLabel(DICT_TYPE.SUPPLIER_COLLAB_MODE, code)).join(',')
}
// 辅料供应商 合作模式转换名称
const getAuxiliaryMaterialsCollabModeName = (mode: string) => {
  if (!mode) return '-'
  const modeList = mode.split(',')
  return modeList?.map((code: any) => getDictLabel('sc_supplier_auxiliary_materials_collab_mode', code)).join(',')
}

// 合作品类变更
const supplierCategoryRef = ref()
const openSupplierCategory = (row: any) => {
  supplierCategoryRef.value?.open('', row)
}

function handleChangeKeyType(val: 1 | 2) {
  switch (val) {
    case 1:
      placeholder.value = '请输入供应商'
      break
    case 2:
      placeholder.value = '请输入公司名称'
      break
  }
}

// 反审
const supplierPaymentMethodRef = ref()
const openSupplierPaymentMethod = (row: any) => {
  supplierPaymentMethodRef.value?.open(row)
}

// 框架合同
const frameworkAgreementRef = ref()
const openFrameworkAgreement = (row: any) => {
  frameworkAgreementRef.value?.open(row)
}

// 权限列表
const permissionSet = new Set(getPermission())

// 初始化
onMounted(() => {
  getPermissionInfo(()=>{
    getSupplierInfo()
    getCategoryTree()
  })
})
</script>

<style lang="less" scoped>
@import url(./index.scss);

:deep(.commonTopFilterWrap-filter .el-form-item) {
  margin: 0 18px 18px 0 !important;
}

.status {
  // padding-left: 8px;

  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    position: absolute;
    left: 8px;
    top: 40%;
    border-radius: 50%;
    background-color: #d8d8d8;
  }
}

.status_0 {
  &::before {
    background-color: #d8d8d8;
  }
}

.status_1 {
  &::before {
    background-color: #db6a0f;
  }
}

.status_2 {
  &::before {
    background-color: #349b34;
  }
}

.status_3 {
  &::before {
    background-color: #eb3737;
  }
}

.click {
  color: #0064ff;
  cursor: pointer;
}

.container-body {
  width: calc(100%);
  background: #ffffff;
  // border-radius: 8px;
  padding: 16px 0 30px 0;
  border-top: 1px solid #e6e6e6;

  .body_title {
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    display: inline-block;
    padding-bottom: 16px;
    position: relative;

    .blockRecord {
      position: absolute;
      right: 120px;
      top: -6px;
      background: #fff;
      color: #0064ff;
    }
  }
}

.show-text {
  width: 100%;
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.red {
  color: #f00;
}

.green {
  color: #01854f;
}

.results {
  width: 140px !important;

  .result {
    display: flex;
    gap: 4px;
    justify-content: center;
    align-items: center;
    background: #f2f6fc;
    border-radius: 16px;
    padding: 4px 8px;
    margin-bottom: 5px;
  }
}

.btn {
  &:hover {
    opacity: 0.8;
  }

  &.normal {
    color: #0064ff;
  }

  &.del {
    color: #f00;
  }
}

.keyword {
  align-items: center;
  // width: 345px;

  :deep(.el-input__wrapper) {
    width: 120px;
  }
}

.optionDiv {
  display: flex;
  width: fit-content;
}

.hideBtns {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;

  :deep(.el-button) {
    display: flex;
    justify-content: center;
    width: fit-content;
    margin: 4px 0;
    margin-left: 0 !important;

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
