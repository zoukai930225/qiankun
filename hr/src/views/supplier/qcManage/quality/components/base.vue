<template>
  <div>
    <el-card shadow="never" class="qcCard">
      <template #header>
        <logo-label txt="基本信息" :is-edit="false" />
      </template>
      <div>
        <el-form
          :model="dataValue"
          class="table-form"
          scroll-to-error
          :inline="true"
          ref="formRef"
          :disabled="viewType === 'view'"
          :validate-on-rule-change="false"
          label-width="80"
        >
          <el-form-item
            prop="supplier"
            label="供应商"
            :rules="viewType !== 'view' ? rules.supplier : []"
          >
            <el-select-v2
              filterable
              clearable
              v-model="dataValue.supplier"
              remote
              :remote-method="remoteGetSupplier"
              :disabled="viewType === 'edit' || viewType === 'view'"
              :options="
                dataValue.supplierList && dataValue.supplierList.length > 0
                  ? dataValue.supplierList
                  : supplierList
              "
              @change="supplierChange"
            />
          </el-form-item>
          <el-form-item
            label="款号"
            prop="itemNumberIds"
            :rules="viewType !== 'view' ? rules.itemNumberIds : []"
          >
            <el-select-v2
              v-if="dataValue.itemNumberIdDic && dataValue.itemNumberIdDic.length > 0"
              filterable
              clearable
              :disabled="viewType === 'edit' || viewType === 'view'"
              v-model="dataValue.itemNumberIds"
              :options="dataValue.itemNumberIdDic"
              :suffix-icon="viewType === 'view' || viewType === 'edit' ? '' : 'ArrowDown'"
              @change="changeItemNumber"
            />
            <style-number
              v-else
              v-model:value="dataValue.itemNumberIds"
              v-model:name="dataValue.itemNumberNames"
              :componentProps="{ multiple: false, clearable: true, disabled: viewType === 'edit' || viewType === 'view' }"
              @change="valueChange"
            />
          </el-form-item>
          <el-form-item label="生产订单号" class="longLabel" prop="scPurchaseOrderNo">
            <el-select-v2
              filterable
              clearable
              v-model="dataValue.scPurchaseOrderNo"
              :disabled="viewType === 'edit' || viewType === 'view'"
              :options="
                dataValue.scPurchaseOrderNos && dataValue.scPurchaseOrderNos.length > 0
                  ? dataValue.scPurchaseOrderNos
                  : optionInfo.scPurchaseOrderNo
              "
              :suffix-icon="viewType === 'view' || viewType === 'edit' ? '' : 'ArrowDown'"
              @change="changScPurchaseOrderNo"
            />
          </el-form-item>
          <el-form-item
            prop="productType"
            label="商品类型"
            :rules="viewType !== 'view' ? rules.productType : []"
          >
            <el-select-v2
              filterable
              clearable
              v-model="dataValue.productType"
              :disabled="viewType === 'edit' || viewType === 'view'"
              :options="
                dataValue.productTypeDic && dataValue.productTypeDic.length > 0
                  ? dataValue.productTypeDic
                  : optionInfo.productType
              "
              :suffix-icon="viewType === 'view' || viewType === 'edit' ? '' : 'ArrowDown'"
            />
          </el-form-item>
          <el-form-item
            label="款式描述"
            prop="styleDescription"
            :rules="viewType !== 'view' ? rules.styleDescription : []"
          >
            <el-select-v2
              filterable
              clearable
              :disabled="viewType === 'edit' || viewType === 'view'"
              v-model="dataValue.styleDescription"
              :options="
                dataValue.styleDic && dataValue.styleDic.length > 0
                  ? dataValue.styleDic
                  : optionInfo.style
              "
              :suffix-icon="viewType === 'view' || viewType === 'edit' ? '' : 'ArrowDown'"
            />
          </el-form-item>
          <el-form-item
            label="货期"
            prop="deliveryTime"
            v-if="dataValue.qualityInspectionCycle === 3"
          >
            <el-date-picker
              v-model="dataValue.deliveryTime"
              type="date"
              placeholder="请选择货期"
              value-format="YYYY-MM-DD"
              style="width: 100%; margin-bottom: 4px"
              :disabled="viewType === 'view'"
            />
          </el-form-item>
          <el-form-item
            label="日期"
            prop="submissionDate"
            :rules="viewType !== 'view' ? rules.submissionDate : []"
          >
            <el-date-picker
              v-model="dataValue.submissionDate"
              type="date"
              placeholder="请选择日期"
              value-format="YYYY-MM-DD"
              style="width: 100%; margin-bottom: 4px"
              :disabled="viewType === 'view'"
            />
          </el-form-item>
          <el-form-item
            label="验货数量"
            prop="num"
            :rules="viewType !== 'view' && dataValue.qualityInspectionCycle !== 1 ? rules.num : []"
          >
            <el-input-number
              clearable
              v-model="dataValue.num"
              :precision="0"
              :min="0"
              :max="200000"
              @change="numChange"
              style="width: 100%"
              :controls="false"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="抽验数量"
            prop="spotCheckNum"
            :rules="
              viewType !== 'view' && dataValue.qualityInspectionCycle === 2
                ? rules.spotCheckNum
                : []
            "
          >
            <el-select-v2
              filterable
              clearable
              v-model="dataValue.spotCheckNum"
              :options="sampleSizeList"
              placeholder="请选择"
              :suffix-icon="viewType === 'view' ? '' : 'ArrowDown'"
            />
          </el-form-item>
          <!-- :rules="(viewType !== 'view' && dataValue.qualityInspectionCycle === 1) ? rules.purchaseNum : []" -->
          <el-form-item label="采购数量" prop="purchasedGoodsQuantity">
            <el-input-number
              clearable
              v-model="dataValue.purchasedGoodsQuantity"
              :precision="0"
              :min="0"
              :max="200000"
              style="width: 100%"
              :controls="false"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            v-if="dataValue.qualityInspectionCycle === 3"
            class="longLabel"
            label="装箱量(%)"
            prop="packQuantity"
            :rules="viewType !== 'view' ? rules.packQuantity : []"
          >
            <el-input-number
              clearable
              v-model="dataValue.packQuantity"
              :precision="0"
              :min="0"
              :max="100"
              style="width: 100%"
              :controls="false"
              placeholder="请输入"
            />
          </el-form-item>
          <!-- <el-form-item v-if="dataValue.qualityInspectionCycle !== 3" class="longLabel" label="第几次抽查" prop="checksNumber" :rules="viewType !== 'view' ? rules.checksNumber : []">
            <el-input-number clearable v-model="dataValue.checksNumber" :precision="0" :min="1"
              style="width: 100%;" :controls="false" placeholder="请输入"/>
          </el-form-item> -->
          <el-form-item
            label="面辅料测试"
            prop="materialsAccessoriesTest"
            class="longLabel"
            :rules="viewType !== 'view' ? rules.materialsAccessoriesTest : []"
          >
            <el-select
              v-model="dataValue.materialsAccessoriesTest"
              placeholder="请选择面辅料测试"
              style="width: 100%"
              :suffix-icon="viewType === 'view' ? '' : 'ArrowDown'"
            >
              <el-option label="已做" value="1" />
              <el-option label="未做" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="巡检记录"
            prop="inspectionRecord"
            :rules="viewType !== 'view' ? rules.inspectionRecord : []"
          >
            <el-select
              v-model="dataValue.inspectionRecord"
              placeholder="请选择巡检记录"
              style="width: 100%"
              :suffix-icon="viewType === 'view' ? '' : 'ArrowDown'"
            >
              <el-option label="已做" value="1" />
              <el-option label="未做" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="成品抽检记录"
            prop="finishProductCheckRecord"
            class="longLabel"
            :rules="viewType !== 'view' ? rules.finishProductCheckRecord : []"
          >
            <el-select
              v-model="dataValue.finishProductCheckRecord"
              placeholder="请选择成品抽检记录"
              style="width: 100%"
              :suffix-icon="viewType === 'view' ? '' : 'ArrowDown'"
            >
              <el-option label="已做" value="1" />
              <el-option label="未做" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="样板核对"
            prop="templateCheck"
            :rules="viewType !== 'view' ? rules.templateCheck : []"
          >
            <el-select
              v-model="dataValue.templateCheck"
              placeholder="请选择样板核对"
              style="width: 100%"
              :suffix-icon="viewType === 'view' ? '' : 'ArrowDown'"
            >
              <el-option label="已核对" value="1" />
              <el-option label="未核对" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="dataValue.qualityInspectionCycle === 3"
            class="longLabel"
            label="采购跟单人"
            prop="orderFollowId"
            :rules="viewType !== 'view' ? rules.orderFollowIds : []"
          >
            <!-- <el-select popper-class="eloption" :popper-append-to-body="true" v-model="dataValue.orderFollowIds"
              placeholder="请选择" filterable clearable multiple @change="userChange">
              <template #label>
                <div class="label-wrapper">
                  <img class="avatorLogo" :src="getUserInfo(dataValue.orderFollowId)?.avatarOrigin" alt="" />
                  <span class="name">{{ getUserInfo(dataValue.orderFollowId)?.name }} </span>
                </div>
              </template>
              <el-option v-for="dict in productInfoData.peopleList" :key="dict.userId" :label="dict.name"
                :value="dict.userId">
                <div class="peopleOption">
                  <div class="left-wapper">
                    <img class="img" :src="dict.avatarOrigin" alt="" />
                    <div class="info">
                      <span class="text name">{{ dict.name }}</span>
                      <span class="text desc">{{ dict.departmentName || '--' }}</span>
                    </div>
                  </div>
                </div>
              </el-option>
            </el-select> -->
            <selectUser
              v-model="dataValue.orderFollowId"
              :disabled="viewType === 'view'"
              :feed-back-options="dataValue.orderFollow ?  dataValue.orderFollow : userOption"
              :role="getRole('采购跟单')"
              :multiple="false"
              :show-avatar-lable="true"
              placeholder="请选择"
              style="width: 100%"
              :suffix-icon="viewType === 'view' ? '' : 'ArrowDown'"
            />
          </el-form-item>
          <!-- <el-form-item label="裁剪(%)" v-if="dataValue.qualityInspectionCycle === 3">
            <el-input-number clearable v-model="dataValue.crop" :min="0" :max="100" :precision="0"
              style="width: 100%;" :controls="false" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="缝制(%)" v-if="dataValue.qualityInspectionCycle === 3">
            <el-input-number clearable v-model="dataValue.sew" :min="0" :max="100" :precision="0"
              style="width: 100%;" :controls="false" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="检验(%)" v-if="dataValue.qualityInspectionCycle === 3">
            <el-input-number clearable v-model="dataValue.inspection" :min="0" :max="100" :precision="0"
              style="width: 100%;" :controls="false" placeholder="请输入"/>
          </el-form-item>
          <el-form-item label="包装(%)" v-if="dataValue.qualityInspectionCycle === 3">
            <el-input-number clearable v-model="dataValue.pack" :min="0" :max="100" :precision="0"
              style="width: 100%;" :controls="false" placeholder="请输入"/>
          </el-form-item> -->
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="tsx">
export default { name: 'QualityDetailsBase' }
</script>

<script lang="tsx" setup>
import { DetailProvideType } from '@/components/template/config/type'
import LogoLabel from '@/components/common/label/logoLabel.vue'
import { productInfoStore } from '@/store/modules/productInfo'
import * as productInfoApi from '@/api/supplier/productInfo'
import StyleNumber from '../components/styleNumber.vue'
import { getIntDictOptions } from '@/utils/dict'
import request from '@/config/axios'
import selectUser from '@/components/common/user/selectUser.vue'

const { userOption } = inject('UserOption') as any

const { getRole } = inject('PermissionInfo') as any
const productInfoData = productInfoStore()

const { dataValue, viewType } = inject('QualityDetails') as DetailProvideType

const formRef = ref(),
  userRef = ref(),
  listData = ref<any>([{}]),
  supplierList = ref<any>([]),
  optionInfo = ref<any>({ style: [], productType: [], scPurchaseOrderNo: [] })

const rules = reactive({
  supplier: [{ required: true, message: '请选择供应商', trigger: ['blur', 'change'] }],
  productType: [{ required: true, message: '请选择商品类型', trigger: ['blur', 'change'] }],
  itemNumberIds: [{ required: true, message: '请选择商品款号', trigger: ['blur', 'change'] }],
  styleDescription: [{ required: true, message: '请选择款式描述', trigger: ['blur', 'change'] }],
  submissionDate: [{ required: true, message: '请选择日期', trigger: ['blur', 'change'] }],
  checksNumber: [{ required: true, message: '请输入第几次抽查', trigger: ['blur', 'change'] }],
  materialsAccessoriesTest: [
    { required: true, message: '请选择面辅料测试', trigger: ['blur', 'change'] }
  ],
  inspectionRecord: [{ required: true, message: '请选择巡检记录', trigger: ['blur', 'change'] }],
  finishProductCheckRecord: [
    { required: true, message: '请选择成品抽检记录', trigger: ['blur', 'change'] }
  ],
  templateCheck: [{ required: true, message: '请选择样板核对', trigger: ['blur', 'change'] }],
  num: [{ required: true, message: '请输入验货数量', trigger: ['blur', 'change'] }],
  spotCheckNum: [{ required: true, message: '请输入抽验数量', trigger: ['blur', 'change'] }],
  packQuantity: [{ required: true, message: '请输入装箱量', trigger: ['blur', 'change'] }],
  orderFollowIds: [{ required: true, message: '请选择采购跟单人', trigger: ['blur', 'change'] }]
})

const getSelectOptions = () => {
  request.post({ url: `/api/qcDailyReportInfo/selectSupplierList` }).then((res: any) => {
    if (res && res.length) {
      supplierList.value = res.map((sup: any) => ({
        label: sup.abbreviationCompany || sup.fullCompany,
        value: sup.id,
        fullName: sup.fullCompany
      }))
    }
  })
}
// 远程筛选供应商
const remoteGetSupplier = (query: string) => {
  request
    .post({
      url: `/api/qcDailyReportInfo/selectSupplierList50`,
      params: { abbreviationCompany: query }
    })
    .then((res: any) => {
      supplierList.value = res.map((sup: any) => ({
        label: sup.abbreviationCompany,
        value: sup.id,
        fullName: sup.fullCompany
      }))
    })
}

const getUserInfo = (userId: string) => {
  return productInfoData.peopleList.find((person) => person.userId === userId)
}

const initDic = async () => {
  const res = await request.get({
    url: `/api/sysCategory/categorySelector/page`,
    params: { pageSize: -1, pageNum: 1 }
  })
  optionInfo.value = {
    // style: getIntDictOptions('style_description', true) || [],
    productType: getIntDictOptions('np_design_product_type', true) || [],
    style: res?.records.length
      ? res?.records.map((item: any) => {
          return {
            label: item.categoryName || '',
            value: item.categoryCode || ''
          }
        })
      : [],
    scPurchaseOrderNo: []
  }
}

// 根据供应商、货品编码查询采购订单号
const getScPurchaseOrderNo = (item: any) => {
  dataValue.value.scPurchaseOrderNo = ''
  if (!item.supplier || !item.itemNumberIds) {
    optionInfo.value.scPurchaseOrderNo = []
    return
  }
  request
    .post({
      url: `/api/qcQualityInspectionReportInfo/selectScPurchaseOrderInfo`,
      data: {
        qualityInspectionCycle: item.qualityInspectionCycle,
        supplierId: item.supplier,
        goodsId: item.itemNumberIds,
        goodsCode: item.itemNumberNames
      }
    })
    .then((res: any) => {
      optionInfo.value.scPurchaseOrderNo =
        res?.map((item: any) => ({
          label: item?.scPurchaseOrderNo || '',
          value: item?.scPurchaseOrderNo || ''
        })) || []
    })
}

const supplierChange = (value: any) => {
  dataValue.value = { ...dataValue.value, supplier: value || '' }
  getScPurchaseOrderNo(dataValue.value)
}

const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => valid)
}

const resetFields = () => {
  formRef?.value?.resetFields()
}
const clearValidate = () => {
  formRef?.value?.clearValidate()
}

const valueChange = (value: any, tar: any) => {
  dataValue.value = {
    ...dataValue.value,
    itemNumberNames: tar?.label || '',
    itemNumberIds: value || ''
  }
  // console.log(dataValue.value)
  getScPurchaseOrderNo(dataValue.value)
}

const numChange = () => {
  request
    .get({
      url: `/api/spotCheckConfiguration/selectListByValue`,
      params: { rangeValue: dataValue.value.num }
    })
    .then((res: any) => {
      dataValue.value.spotCheckPlanList = (res || []).map((rs: any) => ({
        batchRangeName: rs.batchRangeName || '',
        sampleSize: rs.sampleSize || '',
        onePointFiveAc: rs.onePointFiveAc || 0,
        onePointFiveRe: rs.onePointFiveRe || 0,
        twoPointFiveAc: rs.twoPointFiveAc || 0,
        twoPointFiveRe: rs.twoPointFiveRe || 0,
        isHit: rs.isHit || 0
      }))
    })
}

const getPeopleList = async () => {
  const data = await productInfoApi.getSupplyChainCenterList()
  productInfoData.peopleList = data || []
}

// 查询批量范围下拉款集合接口
const sampleSizeList = ref<any>([])
const getSampleSizeList = () => {
  request.get({ url: `/api/spotCheckConfiguration/list` }).then((res: any) => {
    sampleSizeList.value = (res || []).map((rs: any) => ({
      label: rs.sampleSize,
      value: rs.sampleSize
    }))
  })
}

const userChange = (value: any) => {
  dataValue.value.orderFollowIds = value?.length ? [value[value.length - 1]] : []
  dataValue.value.orderFollowId = dataValue.value.orderFollowIds?.length
    ? dataValue.value.orderFollowIds.join(',')
    : ''
}

const changeItemNumber = (val: any) => {
  const obj = dataValue?.value?.itemNumberIdDic.find((item: any) => item.value === val)
  dataValue.value.itemNumberNames = obj.label
}

const changScPurchaseOrderNo = async (val: any) => {
  if (!val) {
    const obj = {
      scPurchaseOrderId: '',
      purchasedGoodsQuantity: '',
      deliveryTime: '',
      styleDescription: '',
      styleDic: [],
      productType: '',
      productTypeDic: []
    }
    Object.assign(dataValue.value, obj)
    return
  }
  const res = await request.get({
    url: `/api/QCInspection/getBaseInfo/${val}`,
    params: {}
  })
  if (res?.scPurchaseOrderNo) {
    if (res?.scPurchaseOrderId) {
      dataValue.value.scPurchaseOrderId = res?.scPurchaseOrderId || ''
    }
    if (res?.purchasedGoodsQuantity) {
      dataValue.value.purchasedGoodsQuantity = res?.purchasedGoodsQuantity || '' // 采购数量
    }
    if (res?.orderArrivalTime) {
      dataValue.value.deliveryTime = res?.orderArrivalTime || '' // 货期
    }
    if (res?.categoryCode) {
      dataValue.value.styleDescription = res?.categoryCode || '' // 款式样式
    }
    if (res?.categoryCode && res?.categoryName) {
      dataValue.value.styleDic = [
        {
          label: res?.categoryName || '',
          value: res?.categoryCode || ''
        }
      ]
      // 款式样式集合
    }
    if (res?.goodsType) {
      dataValue.value.productType = res?.goodsType ? String(res?.goodsType) : '' // 商品类型
    }
    if (res?.goodsType && res?.goodsTypeDisplay) {
      dataValue.value.productTypeDic = [
        {
          label: res?.goodsTypeDisplay || '',
          value: String(res?.goodsType) || ''
        }
      ] // 商品类型集合
    }
    if (res?.orderHandlerId) {
        dataValue.value['orderFollowId'] = res?.orderHandlerId || ''
        if (res?.orderHandler) {
          dataValue.value['orderFollow'] = [
            {
              realName: res?.orderHandler?.name || '',
              userId: res?.orderHandler?.userId || '',
              avatarOrigin: res?.orderHandler?.avatarOrigin || ''
            }
          ]
        }
      }
  }
}

onMounted(() => {
  getSampleSizeList()
  getPeopleList()
  initDic()
  getSelectOptions()
})

defineExpose({ checkValue, clearValidate, resetFields })
</script>
<style lang="scss" scoped>
:deep() {
  .el-input-number {
    width: 100%;

    .el-input__inner {
      text-align: left !important;
    }
  }
}

// 上传人选择器
.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}

// 下拉选项样式
.peopleOption {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;
  width: 100px;

  .left-wapper {
    display: flex;
    align-items: center;
  }

  .img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 14px;

    .text {
      height: 20px;
      line-height: 20px;
    }

    .name {
      font-size: 14px;
      color: #333333;
    }

    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}

// 选择的人样式
.label-wrapper {
  display: flex;
  align-items: center;
  height: 26px;
  background: #cad6f8;
  border-radius: 13px;
  padding: 1px 6px;
  box-sizing: border-box;

  .name {
    font-size: 14px;
    color: #333333;
    margin-left: 6px;
    margin-right: 6px;
  }

  .avatorLogo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
}

.table-form {
  width: 100%;
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  justify-content: stretch;
  gap: 18px;
}

.longLabel {
  :deep(.el-form-item__label) {
    line-height: 16px;
    text-align: right;
  }
}
</style>
