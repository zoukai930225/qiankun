<template>
  <SWDrawer v-model="drawerVisible" @close="handleClose" :title="dialogTitle"
    :width="isShowExamineRecordList ? '1200' : '936'">
    <div class="content" v-loading="recordLoading">
      <div class="left" v-if="isShowExamineRecordList">
        <div class="drawerBasicInfo auditInfo">
          <EditGoodInfoProductAudit :examineRecords="examineRecordList" :recordLoading="recordLoading" />
        </div>
      </div>
      <div class="right">
        <div class="drawerBasicInfo">
          <div class="drawerBasicInfo-header">
            <div class="drawerBasicInfo-header-line"></div>
            <div class="drawerBasicInfo-header-title">基本信息</div>
          </div>
          <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
            label-width="103px">
            <div class="p20px" @click="bgClick">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="类型" prop="productType" style="width: 100%">
                    <div class="seeBg">
                      <div class="seeBg-text">{{ getproductType(formData.productType) }}</div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="计划上架日期" prop="planListDate" style="width: 100%">
                    <div class="seeBg">
                      <div class="seeBg-text">{{ formData.planListDate }}</div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="期望到货日期" prop="goodsToWarehouseDate" style="width: 100%"
                    :rules="[{ required: true, message: '请选择期望到货日期', trigger: ['blur', 'change'] }]">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{
                        formatCustomDate(formData.goodsToWarehouseDate, 'yyyy-MM-dd')
                      }}</div>
                    </div>
                    <el-date-picker v-else v-model="formData.goodsToWarehouseDate" type="date" placeholder="请选择期望到货日期"
                      style="width: 100%" :disabled="forbidEdit" value-format="YYYY-MM-DD" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="拍摄规划时间" prop="planShootTime" style="width: 100%">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{
                        formatCustomDate(formData.planShootTime, 'yyyy-MM-dd')
                      }}</div>
                    </div>
                    <el-date-picker v-else v-model="formData.planShootTime" type="date" placeholder="请选择拍摄规划时间"
                      style="width: 100%" :disabled="forbidEdit" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="售价" prop="monthCount" style="width: 100%">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.price || '--' }}</div>
                    </div>
                    <el-input v-else class="dialogFormItemWidth" v-model="formData.price" placeholder="请输入售价" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="起订量" prop="minimumQuantity" style="width: 100%"
                    :rules="[{ required: true, message: '请输入起订量', trigger: 'blur' }]">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.minimumQuantity || '--' }}</div>
                    </div>
                    <el-input v-else class="dialogFormItemWidth" v-model="formData.minimumQuantity"
                      placeholder="请输入起订量" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="首单数量" prop="firstOrderQuantity" style="width: 100%"
                    :rules="[{ required: true, message: '请输入首单数量', trigger: 'blur' }]">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.firstOrderQuantity || '--' }}</div>
                    </div>
                    <el-input-number v-else class="dialogFormItemWidth" v-model="formData.firstOrderQuantity"
                      placeholder="请输入首单数量" :controls="false" :precision="0" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <div class="longlabel">
                    <el-form-item label="营销策略-预估月销量" prop="monthCount" style="width: 100%" :rules="[
                      { required: true, message: '请输入营销策略-预估月销量', trigger: 'blur' }
                    ]">
                      <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                        <div class="seeBg-text">{{ formData.monthCount || '--' }}</div>
                      </div>
                      <el-input v-else class="dialogFormItemWidth" v-model="formData.monthCount"
                        placeholder="请输入营销策略-预估月销量" clearable />
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="longlabel">
                    <el-form-item label="营销策略-预估季度销量" prop="seasonCount" style="width: 100%" :rules="[
                      { required: true, message: '请输入营销策略-预估季度销量', trigger: 'blur' }
                    ]">
                      <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                        <div class="seeBg-text">{{ formData.seasonCount || '--' }}</div>
                      </div>
                      <el-input v-else class="dialogFormItemWidth" v-model="formData.seasonCount"
                        placeholder="请输入营销策略-预估季度销量" clearable />
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="12">
                  <div class="longlabel">
                    <el-form-item label="预估退货率" prop="estimatedReturnRate" style="width: 100%"
                      :rules="[{ required: true, message: '请输入预估退货率', trigger: 'blur' }]">
                      <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                        <div class="seeBg-text">{{ formData.estimatedReturnRate || '--' }}</div>
                      </div>
                      <el-input v-else class="dialogFormItemWidth" v-model="formData.estimatedReturnRate"
                        placeholder="请输入预估退货率" clearable />
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="新品销售月份" prop="npSalesMonth" style="width: 100%"
                    :rules="[{ required: true, message: '请输入新品销售月份', trigger: 'blur' }]">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.npSalesMonth || '--' }}</div>
                    </div>
                    <el-input v-else class="dialogFormItemWidth" v-model="formData.npSalesMonth" placeholder="例如六月～九月"
                      clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="刚上新活动量规划" prop="activityVolumePlan" style="width: 100%" :rules="[
                    { required: true, message: '请输入刚上新活动量规划', trigger: 'blur' }
                  ]">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.activityVolumePlan || '--' }}</div>
                    </div>
                    <el-input v-else class="dialogFormItemWidth" v-model="formData.activityVolumePlan"
                      placeholder="例如私域活动等" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="链接详情页面主打方向" prop="linkDetailKeyFocus" style="width: 100%" :rules="[
                    { required: true, message: '请输入链接详情页面主打方向', trigger: 'blur' }
                  ]">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.linkDetailKeyFocus || '--' }}</div>
                    </div>
                    <el-input v-else class="dialogFormItemWidth" v-model="formData.linkDetailKeyFocus"
                      placeholder="请输入链接详情页面主打方向" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="是否收到拍摄样品" prop="isReceiveShootSample" style="width: 100%">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{
                        formData.isReceiveShootSample ? '是' : '否'
                      }}</div>
                    </div>
                    <el-select v-else class="dialogFormItemWidth" v-model="formData.isReceiveShootSample"
                      placeholder="请选择是否收到拍摄样品" clearable>
                      <el-option label="是" value="1" />
                      <el-option label="否" value="0" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="包装编码" prop="packageCode" style="width: 100%"
                    :rules="[{ required: true, message: '请输入包装编码', trigger: 'blur' }]">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.packageCode || '--' }}</div>
                    </div>
                    <el-input v-else class="dialogFormItemWidth" v-model="formData.packageCode" placeholder="请输入包装编码"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否分SKU包装" prop="isSkuPackage" style="width: 100%" :rules="[{ required: true }]"
                    class="longLabel">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.isSkuPackage ? '是' : '否' }}</div>
                    </div>
                    <!-- @change="skuPackageChange" -->
                    <el-radio-group v-else v-model="formData.isSkuPackage" class="saleTimeHeader-radio">
                      <el-radio label="1">是</el-radio>
                      <el-radio label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="Number(formData.isSkuPackage || '') == 1">
                <el-col :span="24">
                  <el-form-item label="分SKU包装编码" prop="skuPackageCode" style="width: 100%"
                    :rules="[{ required: true, message: '请输入分SKU包装编码', trigger: 'blur' }]">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.skuPackageCode || '--' }}</div>
                    </div>
                    <s-text-area v-else :autosize="{ minRows: 3, maxRows: 3 }" class="dialogFormItemWidth"
                      v-model="formData.skuPackageCode" placeholder="请输入分SKU包装编码" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="下单明细" prop="npPrenatalSampleInfoList" style="width: 100%">
                    <el-descriptions
                      :column="2"
                      border
                      v-if="
                        erpInfo?.npPrenatalSampleInfoList && erpInfo?.npPrenatalSampleInfoList.length > 0
                      "
                    >
                      <el-descriptions-item
                        v-for="(value, index) in erpInfo.npPrenatalSampleInfoList"
                        :key="index"
                        :label="`${value.skuName}(${value.skuCode})`"
                        label-align="center"
                        align="left"
                        label-class-name="item-title"
                        class-name="item-value"
                        label-width="234px"
                        :width="
                          erpInfo.npPrenatalSampleInfoList.length % 2 === 1 &&
                          index === erpInfo.npPrenatalSampleInfoList.length - 1
                            ? '534px'
                            : '150px'
                        "
                        :span="
                          erpInfo.npPrenatalSampleInfoList.length % 2 === 1 &&
                          index === erpInfo.npPrenatalSampleInfoList.length - 1
                            ? 2
                            : 1
                        "
                      >
                        <!-- {{ value.orderQuantity }} -->
                         <div v-if="formType === 'view' || forbidEdit" style="color: #333333; font-weight: 14px">{{ value.orderQuantity }}</div>
                        <div  v-else  class="row-center">
                          <el-input-number :min="0":controls="false"
                           style="width: 91px; height: 32px; margin-top: -3px" v-model="value.orderQuantity"
                           clearable @input="(val) => handleInput(val, value)" />
                         <el-tooltip v-if="index == 0 && !(formType === 'view' || forbidEdit)" effect="dark"
                           content="一键同步所有数据" placement="bottom">
                           <img style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                             @click="allSetOneValue(value.orderQuantity)" src="@/assets/imgs/oa/oa_all_add.png" />
                         </el-tooltip>
                        </div>
                      </el-descriptions-item>
                      <el-descriptions-item
                        label="合计"
                        label-align="center"
                        align="left"
                        label-class-name="item-title"
                        class-name="item-value"
                        label-width="234px"
                        width="534px"
                        :span="2"
                      >
                        {{ getTotal(erpInfo?.npPrenatalSampleInfoList) || 0 }}
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="运营备注" prop="operationRemark" style="width: 100%">
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.operationRemark || '--' }}</div>
                    </div>
                    <s-text-area v-else :autosize="{ minRows: 3, maxRows: 4 }" class="dialogFormItemWidth"
                      v-model="formData.operationRemark" placeholder="请输入备注" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="" prop="salesTargetFirstMonth">
                    <template #label>
                      <div>
                        <div>销售目标</div>
                        <div>(第一月)</div>
                      </div>
                    </template>
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.salesTargetFirstMonth || '--' }}</div>
                    </div>
                    <el-input v-else v-model="formData.salesTargetFirstMonth" placeholder="请输入" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" prop="salesTargetSecondMonth">
                    <template #label>
                      <div>
                        <div>销售目标</div>
                        <div>(第二月)</div>
                      </div>
                    </template>
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.salesTargetSecondMonth || '--' }}</div>
                    </div>
                    <el-input v-else v-model="formData.salesTargetSecondMonth" placeholder="请输入" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="" prop="salesTargetThirdMonth">
                    <template #label>
                      <div>
                        <div>销售目标</div>
                        <div>(第三月)</div>
                      </div>
                    </template>
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.salesTargetThirdMonth || '--' }}</div>
                    </div>
                    <el-input v-else v-model="formData.salesTargetThirdMonth" placeholder="请输入" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" required :rules="[
                    { required: true, message: '销售目标(季度)不能为空', trigger: 'blur' }
                  ]" prop="salesTargetQuarter">
                    <template #label>
                      <div style="color: #ea0000">
                        <div>销售目标</div>
                        <div>(季度)</div>
                      </div>
                    </template>
                    <div v-if="formType === 'view' || forbidEdit" class="seeBg">
                      <div class="seeBg-text">{{ formData.salesTargetQuarter || '--' }}</div>
                    </div>
                    <el-input v-else v-model="formData.salesTargetQuarter" placeholder="请输入" clearable />
                  </el-form-item>
                </el-col>

                <!-- 销售目标拆解  新品3.9优化-->
                <!-- <el-col :span="12">
                  <el-form-item label="销售目标拆解" :required="true" prop="salesTargetDismantling"
                    :rules="[{ required: true, message: '销售目标拆解不能为空', trigger: 'blur' }]"
                    :style="{ width: `100%`, height: 'auto' }">
                    <uploadFile ref="salesTargetDismantlingUploadFileRef"
                      v-model:modelValue="formData.salesTargetDismantling" :width="324"
                      :only-show="formType === 'view' || forbidEdit" @upload-bg-click="uploadBgClick(1)" />
                  </el-form-item>
                </el-col> -->
                <el-col :span="12" v-if="Number(formData.isSkuPackage || '') == 1">
                  <!-- 分SKU包装 流程图 -->
                  <el-form-item label="分SKU包装流程图" :required="false" prop="skuPackagePicture" :rules="[
                    { required: false, message: '分SKU包装流程图不能为空', trigger: 'blur' }
                  ]" :style="{ width: `100%`, height: 'auto' }">
                    <uploadFile ref="skuPackagePictureUploadFileRef" v-model:modelValue="formData.skuPackagePicture"
                      :width="324" :only-show="formType === 'view' || forbidEdit" @upload-bg-click="uploadBgClick(2)" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>

        <div class="drawerBasicInfo">
          <div class="drawerBasicInfo-header">
            <div class="drawerBasicInfo-header-line"></div>
            <div class="drawerBasicInfo-header-title">竞品信息</div>
            <el-button v-if="!forbidEdit" style="margin-left: auto; margin-right: 20px" type="primary"
              @click="openHanleCompetitorsInfo">
              <Icon class="mr-5px" icon="ep:plus" />
              新增
            </el-button>
          </div>
          <CompetitorDrawer ref="competitorRef" :forbidEdit="forbidEdit" :currentId="npDesignPictureGodownId"
            :developmentPlanId="developmentPlanId" :isCompetitorEditable="formData.operationStatus !== '3'" />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="drawerFooter">
        <el-button @click="drawerVisible = false" :class="formType === 'view' || forbidEdit ? 'mr20px' : ''">关
          闭</el-button>
        <el-button v-if="formType !== 'view' && !forbidEdit" :disabled="formLoading" @click="handleTempSave(true)"
          class="borderBtn">
          暂 存</el-button>
        <!-- <el-button v-if="formType !== 'view' && !forbidEdit" :disabled="formLoading" type="primary"
          @click="handleTempSave(false)" class="mr20px">
          提 交</el-button> -->
      </div>
    </template>
  </SWDrawer>

  <confirmDialog ref="confirmDialogRef" @confirm="handleConfirmComplete" :title="'系统提醒'" cancelText="关闭"
    confirmText="确认" content="是否结束运营阶段的信息填写，并流转到产研阶段？" />
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { checkPermi } from '@/utils/permission'
import confirmDialog from '@/views/OA/new/develop/components/confirmDialog.vue'
import uploadFile from '@/components/SWUoloadFile/index.vue'
import { getDesignDetailById, getErpInfo, updateSkuInfo } from '@/api/oa/new/designGallery/index'

import { formatCustomDate, handleJSONParse } from './../utils'
import EditGoodInfoProductAudit from './editGoodInfoProductAudit.vue'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

import {
  getDevelopPlanDetail,
  getNewPlanlOperaionDetail,
  sendFeiShuMessageForTask,
  saveOperationInfo
} from '@/api/oa/new/develop'
import CompetitorDrawer from './competitorEdit.vue'

import { getBasicAttribute } from '@/api/oa/new/plan/index'

const props = defineProps({
  forbidEdit: {
    type: Boolean,
    default: false
  }
})

const formData = ref<any>({
  id: '',
  enterprisePlanId: '',
  npDesignPictureGodownId: '',
  developmentPlanId: '',
  productType: '',
  price: '',
  competitorsInfo: '',
  listingTime: '',
  npSalesMonth: '',
  planListDate: '',
  productGrade: '',
  monthCount: '',
  seasonCount: '',
  operationRemark: '',
  isReceiveShootSample: '',
  actualShelfTime: '',
  planShootTime: '',
  estimatedReturnRate: '',
  activityVolumePlan: '',
  linkDetailKeyFocus: '',
  salesTargetDismantling: '',
  minimumQuantity: '',
  firstOrderQuantity: '',
  placeOrderDetails: '',
  isSkuPackage: '0',
  packageCode: '',
  skuPackageCode: '',
  skuPackagePicture: '',
  operationStatus: '', //运营状态(0-未指派,1-未开始,2-进行中,3-已结束)
  goodsToWarehouseDate: ''
})

const handleInput = (value: string, item) => {
  // 限制只能输入数字和小数点
  let value1 = value.replace(/[^0-9.]/g, '')

  // 限制只能输入两位小数
  value1 = value1.replace(/^(\d+(\.\d{0,2})?)?.*$/, '$1')
  item.value = value1
}

const formRef = ref() // 表单 Ref

const formRules = reactive({})

const npDesignPictureGodownId = ref()
const developmentPlanId = ref()
const enterprisePlanId = ref()

const allSetOneValue = (value) => {
  erpInfo.value.npPrenatalSampleInfoList &&
    erpInfo.value.npPrenatalSampleInfoList.forEach((item) => {
      item.orderQuantity = value
    })
}

// 获取产品类型选项名称
const getproductType = (productType) => {
  if (!productType || !productTypeColumnOptions.value) return ''
  // const options = productTypeColumnOptions.value.filter((item) => item.code === productType)
  console.log(productType, 'productType', typeof productType)
  // 0是买手款、1是定制款，转换为中文
  if (productType === '0') {
    return '买手款'
  } else if (productType === '1') {
    return '定制款'
  }
  // return options.length > 0 ? options[0].value : ''
}

// 审核记录 存在SupplyAndDemandPlan/ConfirmProductDataExamine 展示 否则不展示
const examineRecordList = ref([])
const isShowExamineRecordList = ref(false)
const recordLoading = ref(false)
const getDesignDetail = async () => {
  examineRecordList.value = []
  recordLoading.value = true
  try {
    const res = await getDesignDetailById(formData.value.npDesignPictureGodownId)
    if (res && res.qualificationExamineRecords) {
      examineRecordList.value = handleJSONParse(res.qualificationExamineRecords) || []
      examineRecordList.value = examineRecordList.value.filter(
        (li: any) =>
          li.nodeCode === 'SupplyAndDemandPlan' || li.nodeCode === 'ConfirmProductDataExamine'
      )
      isShowExamineRecordList.value = examineRecordList.value.length > 0
    }
  } finally {
    recordLoading.value = false
  }
}

const erpInfo = ref({ npPrenatalSampleInfoList: [] })
// 获取ERP信息
const getErpDetailInfo = async () => {
  const res = await getErpInfo(formData.value.npDesignPictureGodownId) //回显详情
  if (res) {
    erpInfo.value = { ...res }
    erpInfo.value.npPrenatalSampleInfoList = erpInfo.value.npPrenatalSampleInfoList || []
  }
}

/** 打开弹窗 */
const productTypeColumnOptions = ref()
const open = async (data: any, type: string) => {
  formType.value = type || 'update'
  resetForm()
  formRef.value?.clearValidate()
  dialogTitle.value = (data && data.nodeName) || ''
  formData.value = data
  drawerVisible.value = true
  npDesignPictureGodownId.value = data && data.npDesignPictureGodownId
  developmentPlanId.value = data && data.developmentPlanId
  enterprisePlanId.value = data && data.enterprisePlanId
  getProductTypeColumnOptions()
  if (formData.value && formData.value.npDesignPictureGodownId) {
    formData.value.id = formData.value.npDesignPictureGodownId
    const res = await getNewPlanlOperaionDetail(formData.value.npDesignPictureGodownId)
    await getDesignDetail()
    await getErpDetailInfo()
    if (res) {
      formData.value = res || {}
      formData.value.isSkuPackage = `${Number(formData.value.isSkuPackage || '')}`
      if (formData.value.salesTargetDismantling) {
        formData.value.salesTargetDismantling = formData.value.salesTargetDismantling
          .split(',')
          .map((item) => {
            let array = item.split('?name=')
            return {
              name: array[1],
              url: array[0]
            }
          })
      }

      if (formData.value.skuPackagePicture) {
        formData.value.skuPackagePicture = formData.value.skuPackagePicture
          .split(',')
          .map((item) => {
            let array = item.split('?name=')
            return {
              name: array[1],
              url: array[0]
            }
          })
      }
    }
  }
  // 打开竞品信息弹窗
  competitorRef.value?.getList()
}

const getProductTypeColumnOptions = async () => {
  const params = {
    code: 'Develop'
  }
  const res = await getBasicAttribute(params)
  if (res) {
    const productTypeColumn = res.find((item) => item.code === 'productType')
    productTypeColumnOptions.value = productTypeColumn.options // 获取产品类型选项
  }
}

const handleClose = () => {
  drawerVisible.value = false
  emit('close')
}

// 打开竞品信息
const competitorRef = ref()
const openHanleCompetitorsInfo = () => {
  if (props.forbidEdit) {
    return
  }
  // 打开竞品信息弹窗
  competitorRef.value.open(npDesignPictureGodownId.value, developmentPlanId.value)
}

const salesTargetDismantlingUploadFileRef = ref()
const skuPackagePictureUploadFileRef = ref()

const bgClick = () => {
  salesTargetDismantlingUploadFileRef.value?.cancelUploadSelect()
  skuPackagePictureUploadFileRef.value?.cancelUploadSelect()
}

const uploadBgClick = (index) => {
  if (index === 1) {
    // 销售目标 拆解
    skuPackagePictureUploadFileRef.value?.cancelUploadSelect()
  } else if (index === 2) {
    // 分SKU包装流程图
    salesTargetDismantlingUploadFileRef.value?.cancelUploadSelect()
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    enterprisePlanId: '',
    npDesignPictureGodownId: '',
    developmentPlanId: '',
    productType: '',
    price: '',
    competitorsInfo: '',
    listingTime: '',
    npSalesMonth: '',
    planListDate: '',
    productGrade: '',
    monthCount: '',
    seasonCount: '',
    operationRemark: '',
    isReceiveShootSample: '',
    actualShelfTime: '',
    planShootTime: '',
    estimatedReturnRate: '',
    activityVolumePlan: '',
    linkDetailKeyFocus: '',
    operationStatus: '',
    salesTargetDismantling: ''
  }
  formRef.value?.resetFields()
}

// 打开确认弹窗
const confirmDialogRef = ref() // 确认弹窗的 Ref
const openConfirmDialog = async () => {
  if (!checkPermi(['oa:newDevelop:maintainInfo'])) {
    return message.error('您没有权限维护运营信息')
  }
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  confirmDialogRef.value.open()
}

// 点击暂存按钮
const handleTempSave = async (isTempSave) => {
  if (!checkPermi(['oa:newDevelop:maintainInfo'])) {
    return message.error('您没有权限维护运营信息')
  }
  if (!isTempSave) {
    if (!formRef) return
    const valid = await formRef.value.validate()
    if (!valid) return
  }
  const isZero: any = erpInfo.value.npPrenatalSampleInfoList.reduce((cur: any, item: any) => cur += Number(item?.orderQuantity || 0), 0);
  if (!isZero && !isTempSave) {
    message.notifyWarning('下单明细数量不能都为0')
    return
  }
  formData.value.operationStatus = '2'
  formData.value.developmentPlanId = npDesignPictureGodownId.value || ''
  formData.value.npDesignPictureGodownId = npDesignPictureGodownId.value || ''
  formData.value.enterprisePlanId = enterprisePlanId.value || ''
  let obj = JSON.parse(JSON.stringify(formData.value))
  if (obj.jsonData) {
    delete obj.jsonData
  }
  if (obj.listingDate && obj.listingDate.indexOf(':') === -1) {
    obj.listingDate = obj.listingDate + ' 00:00:00'
  }
  if (obj.salesTargetDismantling && obj.salesTargetDismantling.length > 0) {
    obj.salesTargetDismantling = obj.salesTargetDismantling
      .map((item) => {
        return item.url && item.url + '?name=' + item.name
      })
      .join(',')
  }

  if (obj.skuPackagePicture && obj.skuPackagePicture.length > 0) {
    obj.skuPackagePicture = obj.skuPackagePicture
      .map((item) => {
        return item.url && item.url + '?name=' + item.name
      })
      .join(',')
  }

  if (isTempSave) {
    obj.submitStatus = 0
  } else {
    obj.submitStatus = 1
  }
  await updateSkuInfo(erpInfo.value).catch((err) => {
    console.log(err)
  })
  console.log(obj);
  await saveOperationInfo(obj)
  emit('update', formData.value)
  emit('success')
  drawerVisible.value = false
}

// 确认弹窗的回调
const handleConfirmComplete = async () => {
  formData.value.operationStatus = '3'
  await sendFeiShuMessageForTask({
    devPlanId: formData.value.id,
    process: '1', //(0-选完运营负责人,1-提交,2-选完设计师买手)
    sendIds: ''
  })
  emit('update', formData.value)
  emit('success')
  drawerVisible.value = false
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success', 'update', 'close']) // 定义 success 事件，用于操作成功后的回调

const getTotal = (list: any) => {
  if (!list || list.length === 0) return 0
  return list.reduce((sum: number, item: any) => (sum += item?.orderQuantity || 0), 0)
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  display: flex;

  .left {
    margin-right: 18px;
    width: 296px;
  }

  .right {
    flex: 1;
  }
}

.seeBg {
  width: 100%;
  min-height: 32px;
  // height: 32px;
  padding: 2px 0;
  // background: url('@/assets/imgs/team/target_input_disable.png');
  border-radius: 4px;
  /* 应用/边框 */
  background: #f8f8f9;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;

  &-text {
    font-size: 14px;

    color: #666666;
    line-height: 20px;
    padding-left: 16px;
    padding-right: 16px;
    line-height: 22px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  // margin: 20px 0;
}

.dialogFormItemWidth {
  width: 100%;
}

.drawerBasicInfo {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #ffffff;

  &.auditInfo {
    min-height: calc(100% - 20px);
  }

  &-header {
    height: 52px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 16px;

    &-line {
      width: 3px;
      height: 10px;
      background: #0064ff;
    }

    &-title {
      padding-left: 6px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: normal;
      color: #333333;
    }
  }

  &-form {
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
}

:deep(.el-form-item--default .el-form-item__label) {
  line-height: 16px;
  text-align: right;
  display: flex;
  // align-items: center;
  padding-left: 0px;

  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  // letter-spacing: normal;
  color: #666666;
}

:deep(.el-form-item__label) {
  padding-left: 0px;
  padding-right: 10px;
}

.borderBtn {
  border-color: #0064ff;
  background: #fff;
  color: #0064ff;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}

:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before) {
  margin-right: 0px;
  margin-left: auto;
}

:deep(.el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before) {
  margin-right: 0px !important;
  margin-left: auto;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 10px;
}

:deep(.el-form-item__content) {
  width: 100%;
}

:deep(.el-form-item__label) {
  width: 100%;
}
</style>

<style lang="scss" scoped>
.orderDetailBg {
  width: 758px;
  display: flex;
  flex-wrap: wrap;
}

.item {
  width: 379px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-left {
  width: 379px;
}

.item-titleBg {
  width: 234px;
  height: 45px;
  padding-left: 16px;
  padding-right: 16px;
  background: #f4f6fa;
  border: 1px solid #e5e5e5;
  border-right: none;
  border-bottom: none;
  border-left: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-titleBg1 {
  border-top: none;
}

.item-valueBg {
  height: 45px;
  width: 145px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-right: none;
  border-bottom: none;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-valueBg1 {
  border-top: none;
}

.item-valueBg2 {
  border-right: 1px solid #e5e5e5;
}

:deep(.item-title){
  font-weight: 400 !important;
  background: #f4f6fa !important;
  font-size: 14px;
  color: #666666 !important;
  // line-height: 22px;
}

:deep(.item-value) {
  color: #333333 !important;
}
</style>
