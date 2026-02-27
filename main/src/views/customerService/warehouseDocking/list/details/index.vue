<template>
  <scheme-details ref="detailsRef" name="List" :width="900">
    <template #card>
      <el-card shadow="never" class="info_card">
        <template #header>
          <div class="card-header">
            <logo-label txt="客服人员维护" :is-edit="false" />
          </div>
        </template>
        <el-form :inline="true" :model="dataValue" ref="formRef" label-width="85px" :validate-on-rule-change="false"
          style="margin-top: 20px" :disabled="fromDisabled" :rules="rules">
          <el-form-item label="问题模块" prop="typeValue" class="w_50">
            <el-select v-model="dataValue.typeValue" placeholder="请选择问题模块" filterable :disabled="viewType !== 'add'"
              clearable @change="typeChange">
              <el-option v-for="item in problemType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号" prop="orderNo" class="w_50" v-if="!['5'].includes(dataValue.typeValue)">
            <el-input v-model="dataValue.orderNo" placeholder="请输入订单编号" :disabled="disabled" maxlength="50"
              @change="queryOrderDetailInfo" />
          </el-form-item>
          <el-form-item label="所属仓库" prop="warehouse" class="w_50">
            <el-select v-model="dataValue.warehouse" placeholder="请选择所属仓库" filterable clearable
              :disabled="disabled || dataValue.typeValue === '5'"
              @change="warehouseChange">
              <!-- <el-option v-for="item in getIntDictOptions(
                DICT_TYPE.CS_WAREHOUSE_DOCKING_WAREHOUSE,
                true
              )" :key="item.value" :label="item.label" :value="item.value" /> -->
              <el-option v-for="item in warehouseDropDown" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="驳回出库单号" prop="rejectOrderNumber" class="w_50 half_label"
            v-if="['5'].includes(dataValue.typeValue)">
            <el-input v-model="dataValue.rejectOrderNumber" placeholder="请输入驳回出库单号" :disabled="disabled"
              maxlength="50" />
          </el-form-item>

          <el-form-item label="问题类型" prop="issueType" v-if="['1', '3'].includes(dataValue.typeValue)" class="w_50">
            <el-select v-model="dataValue.issueType" placeholder="请选择问题类型" filterable :disabled="disabled">
              <el-option v-for="item in getIntDictOptions(
                DICT_TYPE[
                dataValue.typeValue === '1'
                  ? 'CS_WAREHOUSE_DOCKING_ISSUE_TYPE'
                  : 'CS_WAREHOUSE_DOCKING_REFUND_ISSUE_TYPE'
                ],
                true
              )" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="物流公司" prop="logisticsCompany" class="w_50"
            v-if="!['4', '5'].includes(dataValue.typeValue)">
            <el-select v-model="dataValue.logisticsCompany" clearable  filterable allow-create 
              :reserve-keyword="false" placeholder="请选择物流公司" :disabled="disabled">
              <el-option v-for="item in getCompanyDropDown" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="物流单号" prop="logisticsOrderNo" class="w_50"
            v-if="!['4', '5'].includes(dataValue.typeValue)">
            <!-- <el-input v-model="dataValue.logisticsOrderNo" placeholder="请输入物流单号" :disabled="disabled" maxlength="50" /> -->
            <el-select v-model="dataValue.logisticsOrderNo" clearable filterable allow-create 
              :reserve-keyword="false" placeholder="请选择物流单号" :disabled="disabled">
              <el-option v-for="item in getLogisticsCodeDropDown" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="寄错内容" prop="wrongContent" class="w_50" v-if="['2'].includes(dataValue.typeValue)">
            <el-input v-model="dataValue.wrongContent" placeholder="请输入寄错内容" :disabled="disabled" maxlength="50" />
          </el-form-item>
          <el-form-item label="是否支付转寄运费" prop="isPay" class="w_50 half_label"
            v-if="['2'].includes(dataValue.typeValue)">
            <el-select v-model="dataValue.isPay as any" placeholder="请选择是否支付转寄运费" filterable :disabled="disabled">
              <el-option label="已支付" :value="1" />
              <el-option label="未支付" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="寄回物流单号" prop="returnLogisticsOrderNo" class="w_50 half_label"
            v-if="['2'].includes(dataValue.typeValue)">
            <el-input v-model="dataValue.returnLogisticsOrderNo" placeholder="请输入寄回物流单号" :disabled="disabled"
              maxlength="50" />
          </el-form-item>
          <el-form-item label="资损" prop="financialLoss" class="w_50" v-if="['2'].includes(dataValue.typeValue)">
            <el-input v-model="dataValue.financialLoss" placeholder="请输入资损" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="快递重量" prop="courierWeight" class="w_50" v-if="['1'].includes(dataValue.typeValue)">
            <el-input-number v-model="dataValue.courierWeight as any" placeholder="请输入快递重量" :disabled="disabled"
              :controls="false" :min="0">
              <template #suffix>
                <span>KG</span>
              </template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="应发产品编码" prop="productCodeList" class="w_50 half_label"
            v-if="['4'].includes(dataValue.typeValue)">
              <el-select v-if="codeAndAmountDropDown?.length" v-model="dataValue.productCodeList" clearable filterable 
                multiple collapse-tags collapse-tags-tooltip
                :reserve-keyword="false" placeholder="请选择应发产品编码" :disabled="disabled" @change="changeProductCode">
                <el-option v-for="item in codeAndAmountDropDown" value-key="productCode" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
              <good-code v-else url="/api/wdtSpec/listSpecNo" v-model="dataValue.productCodeList" placeholder="请输入应发产品编码"
              :disabled="disabled" multiple /> 
          </el-form-item>
          <el-form-item label="顾客收到产品编码" prop="sendLessProductCodeList" class="w_50 half_label"
            v-if="['4'].includes(dataValue.typeValue)">
            <good-code url="/api/wdtSpec/listSpecNo" v-model="dataValue.sendLessProductCodeList" placeholder="请输入顾客收到产品编码"
              :disabled="disabled" multiple/>
          </el-form-item>
          <el-form-item label="件数" prop="quantity" class="w_50" v-if="['4'].includes(dataValue.typeValue)">
            <el-input-number v-model="dataValue.quantity as any" placeholder="请输入件数" :disabled="disabled"
              :controls="false" :min="1" />
          </el-form-item>
          <el-form-item label="资损金额" prop="financialLossAmount" class="w_50" v-if="['4'].includes(dataValue.typeValue)">
            <el-input-number v-model="dataValue.financialLossAmount as any" placeholder="请输入资损金额" :disabled="disabled"
              :controls="false" :min="0" />
          </el-form-item>
          <el-form-item label="产品编码" prop="productCodeList" class="w_50" v-if="['1'].includes(dataValue.typeValue)">
            <el-select v-if="productCodeDropDown?.length" v-model="dataValue.productCodeList" clearable  filterable 
            multiple collapse-tags collapse-tags-tooltip @change="handleProductCodeChange"
              :reserve-keyword="false" placeholder="请选择产品编码" :disabled="disabled">
              <el-option v-for="item in productCodeDropDown" value-key="productCode" :key="item.value" :label="item.label"
                  :value="item.value" />
            </el-select>
            <good-code v-else url="/api/wdtSpec/listSpecNo" v-model="dataValue.productCodeList" placeholder="请输入产品编码"
              :disabled="disabled" multiple />
          </el-form-item>
          <el-form-item label="产品价值" prop="productValue" class="w_50" v-if="['1'].includes(dataValue.typeValue)">
            <el-input-number v-model="dataValue.productValue as any" placeholder="请输入产品价值" :disabled="disabled"
              :controls="false" :min="0" />
          </el-form-item>
          <el-form-item label="处理人" prop="handler" class="w_50" v-if="!['4', '3'].includes(dataValue.typeValue)">
            <el-input v-model="dataValue.handler" readonly disabled />
          </el-form-item>
          <el-form-item label="预警时间" prop="warningTime" class="w_50" v-if="!['4', '5'].includes(dataValue.typeValue)">
            <el-date-picker v-model="dataValue.warningTime" placeholder="请选择预警时间" :disabled="disabled" type="datetime"
              format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
          </el-form-item>
          <el-form-item label="转寄地址" prop="returnAddress" class="w_100" v-if="['2'].includes(dataValue.typeValue)">
            <s-text-area v-model="dataValue.returnAddress" placeholder="请填写备注" :autosize="{ minRows: 3, maxRows: 4 }"
              maxlength="200" show-word-limit :disabled="disabled" />
          </el-form-item>
          <el-form-item label="备注(客服)" prop="csRemark" class="w_100">
            <s-text-area v-model="dataValue.csRemark" placeholder="请填写备注" :autosize="{ minRows: 3, maxRows: 4 }"
              maxlength="200" show-word-limit :disabled="disabled" />
          </el-form-item>
          <el-form-item label="图片" prop="" class="w_100" style="margin-bottom: 10px !important"
            v-if="dataValue.typeValue && !['5'].includes(dataValue.typeValue)">
            <transfer style="width: 340px" v-model="dataValue.imagesUrls"
              :disabled="!['add', 'editorKeFu'].includes(viewType)" :tip="'最多上传5张大小不超过20M的图片'" :limit="5" />
          </el-form-item>
          <el-form-item label="合格证图片" prop="" class="w_100" style="margin-bottom: 10px !important"
            v-if="dataValue.typeValue && ['4'].includes(dataValue.typeValue)">
            <transfer style="width: 340px" v-model="dataValue.certificateUrls"
              :disabled="!['add', 'editorKeFu'].includes(viewType)" :limit="5" :tip="'最多上传5张大小不超过20M的图片'" />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="never" class="info_card"
        v-if="!['add', 'editorKeFu'].includes(viewType) && !['4'].includes(dataValue.typeValue)">
        <template #header>
          <div class="card-header">
            <logo-label txt="仓库人员维护" :is-edit="false" />
          </div>
        </template>
        <el-form :inline="true" :model="dataValue" ref="warehouseRef" label-width="85px" style="margin-top: 20px"
          :rules="rules" :validate-on-rule-change="false">
          <el-form-item label="问题是否存在" prop="warehouseIssueExistence" class="w_50 half_label"
            v-if="['1'].includes(dataValue.typeValue)">
            <el-select v-model="dataValue.warehouseIssueExistence as any" placeholder="请选择问题是否存在" filterable clearable
              :disabled="disabled">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="2" />
              <el-option label="客服填写信息需完善" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="问题是否处理" prop="formIsHandle" class="w_50 half_label"
            v-if="['3', '5'].includes(dataValue.typeValue)">
            <el-select v-model="dataValue.formIsHandle as any" placeholder="请选择问题是否处理" filterable clearable :disabled="disabled ||
              (viewType === 'edit' &&
                !!dataValue.isHandle &&
                Number(dataValue.formIsHandle) === 1)
              ">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="发货视频" prop="" class="w_100" style="margin-bottom: 10px !important"
            v-if="dataValue.typeValue && ['1'].includes(dataValue.typeValue)">
            <transfer style="width: 340px" v-model="dataValue.shippingVideoUrls" :disabled="disabled" :limit="5"
              :tip="'最多上传5张大小不超过20M的视频'" :accept-type="['video', 'image']" />
          </el-form-item>
          <el-form-item label="仓库转寄单号" prop="warehouseOrderNo" class="w_50 half_label"
            v-if="['2'].includes(dataValue.typeValue)">
            <el-input v-model="dataValue.warehouseOrderNo" placeholder="请输入仓库转寄单号" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="图片(仓库)" prop="whImageUrls" class="w_100" style="margin-bottom: 10px !important"
            v-if="dataValue.typeValue && !['4'].includes(dataValue.typeValue)">
            <transfer style="width: 340px" v-model="dataValue.whImageUrls" :tip="'最多上传5张大小不超过20M的图片'" :limit="5"
              :disabled="disabled" />
          </el-form-item>
          <el-form-item label="备注(仓库)" prop="whRemark" class="w_100">
            <s-text-area v-model="dataValue.whRemark" placeholder="请填写备注" :autosize="{ minRows: 3, maxRows: 4 }"
              maxlength="200" show-word-limit :disabled="disabled" />
          </el-form-item>
        </el-form>
      </el-card>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" style="margin-right: 20px">取消</el-button>
      <el-button v-if="viewType !== 'view'" @click="submitForm" type="primary" style="margin: 0 20px 0 0"
        :disabled="loading">
        {{ !dataValue.isHandle && !['add', 'editorKeFu'].includes(viewType) ? '处理' : '提交' }}
      </el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'ListDetails' };
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../page/config";
import STextArea from "@/components/common/input/s-textarea.vue";
import GoodCode from '@/components/template/query/components/goodCode.vue'
import LogoLabel from '@/components/common/label/logoLabel.vue'
import { tabsOptions, urlValue } from "../../components/utils";
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import request from '@/config/axios'
import Transfer from '@/components/common/upload/transfer.vue'

const message = useMessage();

const { onSearch } = inject(`ListForm`) as FromProvideType;
const { tabValue, roles } = inject('tabValue') as any
const detailsRef = ref<any>(), formRef = ref(), warehouseRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() =>
  viewType.value === 'add'
    ? '新增'
    : viewType.value === 'view'
      ? '查看'
      : viewType.value.includes('editor')
        ? '编辑'
        : !dataValue.value.isHandle
          ? '处理'
          : '编辑');

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    dataValue.value = { ...new DataItem(), ...item, typeValue: tabValue.value, };
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
    viewType.value = type;
    if (item?.id) {
      request.get({ url: `${urlValue(tabValue.value, 'details')}${item.id}` }).then((res: any) => {
        if (res?.id) {
          dataValue.value = {
            ...res,
            typeValue: tabValue.value,
            productValue: Number(res?.productValue || ''),
            courierWeight: Number(res?.courierWeight || ''),
            quantity: Number(res?.quantity || ''),
            financialLossAmount: Number(res?.financialLossAmount || ''),
            productCodeList:res.productCode? res.productCode.split(',') : [],
            sendLessProductCodeList:res.sendLessProductCode? res.sendLessProductCode.split(',') : [],
          }
        }
        bukValue.value = cloneDeep({ ...dataValue.value });
      })
    }
    if(item.orderNo)queryOrderDetailInfo(item.orderNo)
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
      warehouseRef?.value?.clearValidate()
      logisticsCompanyDropDown.value = []
      logisticsCodeDropDown.value = []
      productCodeDropDown.value = []
      returnLogisticsNumberDropDown.value = []
      returnLogisticsCompanyDropDown.value = []
      codeAndAmountDropDown.value = []
    });
  });
};
const typeChange = (val: string) => {
  formRef?.value?.clearValidate()
  dataValue.value = { ...new DataItem(), typeValue: val }
  val === '5' && ((dataValue.value = { ...dataValue.value, warehouse: '2' }), warehouseChange('2'))
}

const warehouseChange = async (val: string) => {
  const use: any = val
    ? await request.get({
      url: `/api/${dataValue.value.typeValue !== '3' ? 'csWarehouseDocking' : 'csWarehouseDockingRefundSent'}/getHandler/${val}`
    })
    : ''
  dataValue.value = { ...dataValue.value, handler: use }
}

const disabled = computed(() => viewType.value === 'view' || !dataValue.value.typeValue)

const fromDisabled = computed(() => viewType.value !== 'add' && viewType.value !== 'editorKeFu')

const problemType = computed(() => {
  if (roles.value.includes('退货退款换货处理人')) {
    return [
      { label: '少发/错发', value: '1' },
      { label: '退件寄错货', value: '2' },
      { label: '无需核对少发/错发', value: '4' },
      // { label: '南昌云仓驳回', value: '5' }
    ]
  } else {
    return tabsOptions(roles.value)
  }
})

const rules = computed(() => {
  let info: any = {
    typeValue: [{ required: true, message: '请选择问题模块', trigger: 'blur' }],
    warehouse: [{ required: true, message: '请选择所属仓库', trigger: ['blur', 'change'] }],
    issueType: [{ required: true, message: '请选择问题类型', trigger: ['blur', 'change'] }],
    logisticsCompany: [{ required: true, message: '请输入物流公司', trigger: ['blur', 'change'] }],
    logisticsOrderNo: [{ required: true, message: '请输入物流单号', trigger: ['blur', 'change'] }],
    productCodeList: [
      {
        required: true,
        message: `请输入${dataValue.value.typeValue === '4' ? '应发' : ''}产品编码`,
        trigger: ['blur', 'change']
      }
    ],
    warningTime: [{ required: true, message: '请选择预警时间', trigger: ['blur', 'change'] }],
    handler: [{ required: true, message: '' }],
    warehouseIssueExistence: [
      { required: true, message: '请选择问题是否存在', trigger: ['blur', 'change'] }
    ],
    orderNo: [{ required: true, message: '请输入订单编号', trigger: ['blur', 'change'] }],
    wrongContent: [{ required: true, message: '请输入寄错内容', trigger: ['blur', 'change'] }],
    warehouseOrderNo: [
      { required: true, message: '请输入仓库转寄单号', trigger: ['blur', 'change'] }
    ],
    formIsHandle: [{ required: true, message: '请选择问题是否处理', trigger: ['blur', 'change'] }],
    sendLessProductCodeList: [
      { required: true, message: '请输入顾客收到产品编码', trigger: ['blur', 'change'] }
    ],
    quantity: [{ required: true, message: '请输入件数', trigger: ['blur', 'change'] }],
    rejectOrderNumber: [
      { required: true, message: '请输入驳回出库单号', trigger: ['blur', 'change'] }
    ],
    courierWeight: [{ required: true, message: '请输入快递重量', trigger: ['blur', 'change'] }]
  }
  return dataValue.value.typeValue === '4'
    ? { ...info, imageList: [{ required: true, message: '请上传图片', trigger: 'change' }] }
    : { ...info }
})

// 根据订单号查订单信息
const warehouseDropDown = ref<any>(getIntDictOptions(DICT_TYPE.CS_WAREHOUSE_DOCKING_WAREHOUSE,true)) //所属仓库下拉列表
const logisticsCompanyDropDown = ref<any>([]) //物流公司
const logisticsCodeDropDown = ref<any>([]) //物流单号
const productCodeDropDown = ref<any>([]) //产品编码
const returnLogisticsNumberDropDown = ref<any>([]) //退货物流单号
const returnLogisticsCompanyDropDown = ref<any>([]) // 退货物流公司
const codeAndAmountDropDown = ref<any>([]) //产品编码-资损金额
const getCompanyDropDown = computed(()=>{
  if(dataValue.value.typeValue === '1') return logisticsCompanyDropDown.value
  else return returnLogisticsCompanyDropDown.value
})
const getLogisticsCodeDropDown = computed(()=>{
  if(dataValue.value.typeValue === '1') return logisticsCodeDropDown.value
  else return returnLogisticsNumberDropDown.value
})
const changeProductCode = (val: any)=>{
  if(val && val.length){
    dataValue.value.productCode = val?.join(',')
    const arr = codeAndAmountDropDown.value?.filter(pr=>val?.includes(pr.productCode))?.map(v=>v.financialLossAmount)
    dataValue.value.financialLossAmount = arr?.reduce((a,b)=>Number(a)+Number(b),0)
  }else{
    dataValue.value.productCode = ''
    dataValue.value.financialLossAmount = 0
  }
}
const handleProductCodeChange = (val: any)=>{
  if(val && val.length){
    dataValue.value.productCode = val?.join(',')
    const arr = productCodeDropDown.value?.filter(pr=>val?.includes(pr.productCode))?.map(v=>v.productValue)
    dataValue.value.productValue = arr?.reduce((a,b)=>Number(a)+Number(b),0)
  }else{
    dataValue.value.productCode = ''
    dataValue.value.productValue = 0
  }
}
const queryOrderDetailInfo = (val: any) => {
  if(val){
    request.get({ url: `${urlValue(dataValue.value.typeValue, 'queryInfo')}`, params: { orderNum: val } })
    .then((res: any) => {
      if (res) {
        console.log(res)
        // dataValue.value.productValue = res.productValue || 0
        warehouseDropDown.value = res.warehouse?.length? res.warehouse.map((wh: any) => ({
          ...wh,
          label: wh.warehouseName,
          value: wh.warehouseCode
        })) : getIntDictOptions(DICT_TYPE.CS_WAREHOUSE_DOCKING_WAREHOUSE,true)
        logisticsCompanyDropDown.value = res.logisticsCompany && res.logisticsCompany.map((el: any) => ({
          label: el,
          value: el
        }))
        logisticsCodeDropDown.value = res.logisticsCode && res.logisticsCode.map((el: any) => ({
          label: el,
          value: el
        }))
        productCodeDropDown.value = res.product && res.product.map((el: any) => ({
          ...el,
          label: el.productCode,
          value: el.productCode
        }))
        returnLogisticsCompanyDropDown.value = res.returnLogisticsCompany && res.returnLogisticsCompany.map((el: any) => ({
          label: el,
          value: el
        }))
        returnLogisticsNumberDropDown.value = res.returnLogisticsNumber && res.returnLogisticsNumber.map((el: any) => ({
          label: el,
          value: el
        }))
        codeAndAmountDropDown.value = res.codeAndAmount && res.codeAndAmount.map((el: any) => ({
          ...el,
          label: el.productCode,
          value: el.productCode
        }))
      }
    })
  }
}


// 通用表单校验 区分客服人员和仓库处理人员
const checkValue = async () => {
  // return await formRef?.value?.validate((valid: boolean) => {
  //   return valid
  // });
  if(viewType.value === 'edit'){
    const warehouseValid: any = warehouseRef.value ? await warehouseRef.value.validate() : true
    return warehouseValid
  }else{
    const customerValid: any = await formRef.value.validate()
    return customerValid
  }
};

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue();
  loading.value = true
  valid && submit();
};
const getUrlEditor = (dataValue:any) => {
  const params = cloneDeep(dataValue) as any
  delete params.warehouseIssueExistence
  delete params.formIsHandle
  delete params.shippingVideoUrls
  delete params.warehouseOrderNo
  delete params.whRemark
  delete params.whImageUrls
  switch (Number(dataValue.typeValue)) {
    case 1:
      delete params.rejectOrderNumber
      delete params.wrongContent
      delete params.isPay
      delete params.returnLogisticsOrderNo
      delete params.financialLoss
      delete params.sendLessProductCode
      delete params.quantity
      delete params.financialLossAmount
      delete params.returnAddress
      break
    case 2:
      delete params.rejectOrderNumber
      delete params.issueType
      delete params.courierWeight
      delete params.sendLessProductCode
      delete params.quantity
      delete params.financialLossAmount
      delete params.productCode
      delete params.productValue
      break
    case 3:
      delete params.rejectOrderNumber
      delete params.wrongContent
      delete params.isPay
      delete params.returnLogisticsOrderNo
      delete params.financialLoss
      delete params.courierWeight
      delete params.sendLessProductCode
      delete params.quantity
      delete params.financialLossAmount
      delete params.productCode
      delete params.productValue
      delete params.handler
      delete params.returnAddress
      break
    case 4:
      delete params.rejectOrderNumber
      delete params.issueType
      delete params.logisticsOrderNo
      delete params.wrongContent
      delete params.isPay
      delete params.returnLogisticsOrderNo
      delete params.financialLoss
      delete params.courierWeight
      delete params.productValue
      delete params.handler
      delete params.warningTime
      delete params.returnAddress
      break
    case 5:
      delete params.issueType
      delete params.orderNo
      delete params.logisticsOrderNo
      delete params.wrongContent
      delete params.isPay
      delete params.returnLogisticsOrderNo
      delete params.financialLoss
      delete params.courierWeight
      delete params.sendLessProductCode
      delete params.quantity
      delete params.financialLossAmount
      delete params.productCode
      delete params.productValue
      delete params.warningTime
      delete params.returnAddress
      delete params.imagesUrls
      break
  }
  return { params }
}

// 实际提交（防抖）
const submit = debounce(async () => {
  const param = { ...dataValue.value ,
    productCode:dataValue.value.productCodeList?.length? dataValue.value.productCodeList?.join(',')  : '',
    sendLessProductCode:dataValue.value.sendLessProductCodeList?.length? dataValue.value.sendLessProductCodeList?.join(',')  : ''
  }
  delete param.productCodeList
  delete param.sendLessProductCodeList
  if (viewType.value === 'editorKeFu') {
    const { params } = getUrlEditor(param)
    request
      .post({ url: urlValue(dataValue.value.typeValue, 'csEdit'), data: { ...params } })
      .then((res: any) => {
        if (res) {
          message.success('保存成功')
          detailsRef.value?.closed()
          onSearch();
        }
      })
      .finally(() => {
        loading.value = false
      })
  } else if (
    viewType.value !== 'add' &&
    dataValue.value.typeValue === '1' &&
    !dataValue.value?.isHandle
  ) {
    request
      .put({ url: `/api/csWarehouseDocking`, data: { ...param, type: '1' } })
      .then((res: any) => {
        if (res) {
          message.success('保存成功')
          detailsRef.value?.closed()
          onSearch();
        }
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    request
      .post({
        url: urlValue(dataValue.value.typeValue, viewType.value === 'add' ? 'add' : 'update'),
        data: {
          ...param,
          type: viewType.value === 'add' ? null : !!dataValue.value?.isHandle ? '1' : '2'
        }
      })
      .then((res: any) => {
        if (res) {
          message.success('保存成功')
          detailsRef.value?.closed()
          onSearch();
        }
      })
      .finally(() => {
        loading.value = false
      })
  }
}, 500);

defineExpose({ openView });

provide('ListDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
