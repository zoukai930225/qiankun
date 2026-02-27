<template>
  <div>
    <el-drawer v-model="drawerVisible" v-if="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer"
      :size="940" :before-close="beforeClose" v-loading="loading">
      <div class="drawer_body">
        <div class="drawerTitle">
          <div>{{ drawerTitle }}</div>
          <div @click="handleCloseDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
        <div class="item-body">
          <el-card shadow="never" class="info_card">
            <template #header>
              <div class="card-header">
                <logo-label txt="客服人员维护" :is-edit="false" />
              </div>
            </template>
            <el-form :inline="true" :model="dataValue" ref="customerRef" label-width="85px"
              :validate-on-rule-change="false" style="margin-top: 20px" :disabled="fromDisabled" :rules="rules">
              <el-form-item label="问题模块" prop="typeValue" class="w_50">
                <el-select v-model="dataValue.typeValue" placeholder="请选择问题模块" filterable :disabled="type !== 'add'"
                  clearable @change="typeChange">
                  <el-option v-for="item in problemType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="所属仓库" prop="warehouse" class="w_50">
                <el-select v-model="dataValue.warehouse" placeholder="请选择所属仓库" filterable clearable
                  :disabled="disabled || dataValue.typeValue === '5' || type.includes('editor')"
                  @change="warehouseChange">
                  <el-option v-for="item in getIntDictOptions(
                    DICT_TYPE.CS_WAREHOUSE_DOCKING_WAREHOUSE,
                    true
                  )" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="驳回出库单号" prop="rejectOrderNumber" class="w_50 half_label"
                v-if="['5'].includes(dataValue.typeValue)">
                <el-input v-model="dataValue.rejectOrderNumber" placeholder="请输入驳回出库单号" :disabled="disabled"
                  maxlength="50" />
              </el-form-item>
              <el-form-item label="订单编号" prop="orderNo" class="w_50" v-if="!['5'].includes(dataValue.typeValue)">
                <el-input v-model="dataValue.orderNo" placeholder="请输入订单编号" :disabled="disabled" maxlength="50" />
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
              <el-form-item label="物流单号" prop="logisticsOrderNo" class="w_50"
                v-if="!['4', '5'].includes(dataValue.typeValue)">
                <el-input v-model="dataValue.logisticsOrderNo" placeholder="请输入物流单号" :disabled="disabled"
                  maxlength="50" />
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
              <el-form-item label="应发产品编码" prop="productCode" class="w_50 half_label"
                v-if="['4'].includes(dataValue.typeValue)">
                <good-code url="/api/wdtSpec/listSpecNo" v-model="dataValue.productCode" placeholder="请输入应发产品编码"
                  :disabled="disabled" />
              </el-form-item>
              <el-form-item label="少发/错发产品编码" prop="sendLessProductCode" class="w_50 half_label"
                v-if="['4'].includes(dataValue.typeValue)">
                <good-code url="/api/wdtSpec/listSpecNo" v-model="dataValue.sendLessProductCode"
                  placeholder="请输入少发/错发产品编码" :disabled="disabled" />
              </el-form-item>
              <el-form-item label="件数" prop="quantity" class="w_50" v-if="['4'].includes(dataValue.typeValue)">
                <el-input-number v-model="dataValue.quantity as any" placeholder="请输入件数" :disabled="disabled"
                  :controls="false" :min="0" />
              </el-form-item>
              <el-form-item label="资损金额" prop="financialLossAmount" class="w_50"
                v-if="['4'].includes(dataValue.typeValue)">
                <el-input-number v-model="dataValue.financialLossAmount as any" placeholder="请输入资损金额"
                  :disabled="disabled" :controls="false" :min="0" />
              </el-form-item>
              <el-form-item label="产品编码" prop="productCode" class="w_50" v-if="['1'].includes(dataValue.typeValue)">
                <good-code url="/api/wdtSpec/listSpecNo" v-model="dataValue.productCode" placeholder="请输入产品编码"
                  :disabled="disabled" />
              </el-form-item>
              <el-form-item label="产品价值" prop="productValue" class="w_50" v-if="['1'].includes(dataValue.typeValue)">
                <el-input-number v-model="dataValue.productValue as any" placeholder="请输入产品价值" :disabled="disabled"
                  :controls="false" :min="0" />
              </el-form-item>
              <el-form-item label="处理人" prop="handler" class="w_50" v-if="!['4', '3'].includes(dataValue.typeValue)">
                <el-input v-model="dataValue.handler" readonly disabled />
              </el-form-item>
              <el-form-item label="预警时间" prop="warningTime" class="w_50"
                v-if="!['4', '5'].includes(dataValue.typeValue)">
                <el-date-picker v-model="dataValue.warningTime" placeholder="请选择预警时间" :disabled="disabled"
                  type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
              </el-form-item>
              <el-form-item label="转寄地址" prop="returnAddress" class="w_100" v-if="['2'].includes(dataValue.typeValue)">
                <s-text-area  v-model="dataValue.returnAddress" placeholder="请填写备注"
                  :autosize="{ minRows: 3, maxRows: 4 }" maxlength="200" show-word-limit :disabled="disabled" />
              </el-form-item>
              <el-form-item label="备注(客服)" prop="csRemark" class="w_100">
                <s-text-area  v-model="dataValue.csRemark" placeholder="请填写备注"
                  :autosize="{ minRows: 3, maxRows: 4 }" maxlength="200" show-word-limit :disabled="disabled" />
              </el-form-item>
              <el-form-item label="图片" prop="" class="w_100" style="margin-bottom: 0px !important"
                v-if="dataValue.typeValue && !['5'].includes(dataValue.typeValue)">
                <transfer style="width: 320px" v-model="dataValue.imagesUrls"
                  :disabled="!['add', 'editorKeFu'].includes(type)" :tip="'最多上传5张大小不超过20M的图片'" :limit="5" />
              </el-form-item>
              <el-form-item label="合格证图片" prop="" class="w_100" style="margin-bottom: 0px !important"
                v-if="dataValue.typeValue && ['4'].includes(dataValue.typeValue)">
                <transfer style="width: 320px" v-model="dataValue.certificateUrls"
                  :disabled="!['add', 'editorKeFu'].includes(type)" :limit="5" :tip="'最多上传5张大小不超过20M的图片'" />
              </el-form-item>
            </el-form>
          </el-card>
          <el-card shadow="never" class="info_card"
            v-if="!['add', 'editorKeFu'].includes(type) && !['4'].includes(dataValue.typeValue)">
            <template #header>
              <div class="card-header">
                <logo-label txt="仓库人员维护" :is-edit="false" />
              </div>
            </template>
            <el-form :inline="true" :model="dataValue" ref="warehouseRef" label-width="85px" style="margin-top: 20px"
              :rules="rules" :validate-on-rule-change="false">
              <el-form-item label="问题是否存在" prop="warehouseIssueExistence" class="w_50 half_label"
                v-if="['1'].includes(dataValue.typeValue)">
                <el-select v-model="dataValue.warehouseIssueExistence as any" placeholder="请选择问题是否存在" filterable
                  clearable :disabled="disabled">
                  <el-option label="是" :value="1" />
                  <el-option label="否" :value="2" />
                  <el-option label="客服填写信息需完善" :value="0" />
                </el-select>
              </el-form-item>
              <el-form-item label="问题是否处理" prop="formIsHandle" class="w_50 half_label"
                v-if="['3', '5'].includes(dataValue.typeValue)">
                <el-select v-model="dataValue.formIsHandle as any" placeholder="请选择问题是否处理" filterable clearable
                  :disabled="disabled ||
                    (type === 'edit' &&
                      !!dataValue.isHandle &&
                      Number(dataValue.formIsHandle) === 1)
                    ">
                  <el-option label="是" :value="1" />
                  <el-option label="否" :value="0" />
                </el-select>
              </el-form-item>
              <el-form-item label="发货视频" prop="" class="w_100" style="margin-bottom: 0px !important"
                v-if="dataValue.typeValue && ['1'].includes(dataValue.typeValue)">
                <transfer style="width: 320px" v-model="dataValue.shippingVideoUrls" :disabled="disabled" :limit="5"
                  :tip="'最多上传5张大小不超过20M的视频'" :accept-type="['video', 'image']" />
              </el-form-item>
              <el-form-item label="仓库转寄单号" prop="warehouseOrderNo" class="w_50 half_label"
                v-if="['2'].includes(dataValue.typeValue)">
                <el-input v-model="dataValue.warehouseOrderNo" placeholder="请输入仓库转寄单号" :disabled="disabled" />
              </el-form-item>
              <el-form-item label="图片(仓库)" prop="whImageUrls" class="w_100" style="margin-bottom: 0px !important"
                v-if="dataValue.typeValue && !['4'].includes(dataValue.typeValue)">
                <transfer style="width: 320px" v-model="dataValue.whImageUrls" :tip="'最多上传5张大小不超过20M的图片'" :limit="5"
                  :disabled="disabled" />
              </el-form-item>
              <el-form-item label="备注(仓库)" prop="whRemark" class="w_100">
                <s-text-area  v-model="dataValue.whRemark" placeholder="请填写备注"
                  :autosize="{ minRows: 3, maxRows: 4 }" maxlength="200" show-word-limit :disabled="disabled" />
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
      <div class="btn_group">
        <el-button @click="handleCloseDrawer" style="margin-right: 20px">取消</el-button>
        <el-button v-if="type !== 'view'" @click="submit" type="primary" style="margin: 0 20px 0 0" :disabled="loading">
          {{ !dataValue.isHandle && !['add', 'editorKeFu'].includes(type) ? '处理' : '提交' }}
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts">
export default { name: 'WarehouseDockingDetails' }
</script>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { consistency } from '@/utils'
import GoodCode from '@/components/template/query/components/goodCode.vue'
import LogoLabel from '@/components/common/label/logoLabel.vue'
import { tabsOptions, urlValue } from './utils'
import { TabsProvideType, DataItem } from '../type'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import request from '@/config/axios'
import Transfer from '@/components/common/upload/transfer.vue'
import { cloneDeep } from 'lodash-es'

const message = useMessage()

const { permissionList, getDataList } = inject('warehouse_docke_handle') as TabsProvideType

const drawerVisible = ref<boolean>(false),
  type = ref<string>('view'),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukData = ref<DataItem>({ ...new DataItem() })

const loading = ref<boolean>(false),
  customerRef = ref(),
  warehouseRef = ref()

const drawerTitle = computed(() =>
  type.value === 'add'
    ? '新增'
    : type.value === 'view'
      ? '查看'
      : type.value.includes('editor')
        ? '编辑'
        : !dataValue.value.isHandle
          ? '处理'
          : '编辑'
)

const disabled = computed(() => type.value === 'view' || !dataValue.value.typeValue)

const roles = computed(() => permissionList.value.map((ps: any) => ps.name).join(','))

const fromDisabled = computed(() => type.value !== 'add' && type.value !== 'editorKeFu')

const problemType = computed(() => {
  if (roles.value.includes('退货退款换货处理人')) {
    return [
      { label: '少发/错发', value: '1' },
      { label: '退件寄错货', value: '2' },
      { label: '无需核对少发/错发', value: '4' },
      { label: '南昌云仓驳回', value: '5' }
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
    logisticsOrderNo: [{ required: true, message: '请输入物流单号', trigger: ['blur', 'change'] }],
    productCode: [
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
    sendLessProductCode: [
      { required: true, message: '请输入少发/错发产品编码', trigger: ['blur', 'change'] }
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

const getDetailsInfo = (row: any) => {
  request.get({ url: `${urlValue(row.typeValue, 'details')}${row.id}` }).then((res: any) => {
    if (res?.id) {
      dataValue.value = {
        ...new DataItem({
          ...res,
          typeValue: row.typeValue,
          productValue: Number(res?.productValue || ''),
          courierWeight: Number(res?.courierWeight || ''),
          quantity: Number(res?.quantity || ''),
          financialLossAmount: Number(res?.financialLossAmount || '')
        })
      }
      bukData.value = cloneDeep({ ...dataValue.value })
      drawerVisible.value = true
    }
  })
}

const open = (row: any, typeStr: string) => {
  type.value = typeStr
  if (row?.id) {
    getDetailsInfo(row)
  } else {
    dataValue.value = { ...new DataItem(row) }
    bukData.value = cloneDeep({ ...dataValue.value })
    drawerVisible.value = true
  }
}

const typeChange = (val: string) => {
  customerRef?.value?.clearValidate()
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

const checkValue = async () => {
  const customerValid: any = await customerRef.value.validate()
  const warehouseValid: any = warehouseRef.value ? await warehouseRef.value.validate() : true
  return customerValid && warehouseValid
}

const submit = async () => {
  const valid: any = await checkValue()
  if (valid) {
    loading.value = true
    if (type.value === 'editorKeFu') {
      const params = getUrlEditor()
      request
        .post({ url: params.url, data: params.params })
        .then((res: any) => {
          if (res) {
            message.success('保存成功')
            drawerVisible.value = false
            getDataList()
          }
        })
        .finally(() => {
          loading.value = false
        })
    } else if (
      type.value !== 'add' &&
      dataValue.value.typeValue === '1' &&
      !dataValue.value?.isHandle
    ) {
      request
        .put({ url: `/api/csWarehouseDocking`, data: { ...dataValue.value, type: '1' } })
        .then((res: any) => {
          if (res) {
            message.success('保存成功')
            drawerVisible.value = false
            getDataList()
          }
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      request
        .post({
          url: urlValue(dataValue.value.typeValue, type.value === 'add' ? 'add' : 'update'),
          data: {
            ...dataValue.value,
            type: type.value === 'add' ? null : !!dataValue.value?.isHandle ? '1' : '2'
          }
        })
        .then((res: any) => {
          if (res) {
            message.success('保存成功')
            drawerVisible.value = false
            getDataList()
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
  }
}

const beforeClose = (done: Function) => consistency(dataValue.value, bukData.value, done)

const handleCloseDrawer = () => {
  beforeClose(() => {
    drawerVisible.value = false
  })
}
const getUrlEditor = () => {
  const params = cloneDeep(dataValue.value) as any
  delete params.warehouseIssueExistence
  delete params.formIsHandle
  delete params.shippingVideoUrls
  delete params.warehouseOrderNo
  delete params.whRemark
  delete params.whImageUrls
  let url = ''
  switch (Number(dataValue.value.typeValue)) {
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
      url = '/api/csWarehouseDocking/csEdit'
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
      url = '/api/csWarehouseDockingReturnSent/csEdit'
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
      url = '/api/csWarehouseDockingRefundSent/csEdit'
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
      url = '/api/csWarehouseDockingNoCheck/csEdit'
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
      url = '/api/csWarehouseNcRejected/csEdit'
      break
  }
  return { url, params }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
@use '@/styles/drawer.scss';

.drawer_body {
  padding: 20px 20px 0 20px;
  height: calc(100% - 50px);
}

:deep(.el-drawer__body) {
  padding: 0px !important;
}

.info_card {
  margin-bottom: 10px;
  border-radius: 8px;

  :deep() {
    .el-card__header {
      padding: 16px 20px;
    }

    .el-form-item {
      margin: 0 8px 18px 0 !important;
    }

    .el-input-number {
      width: 100%;

      .el-input__inner {
        text-align: left !important;
      }
    }

    .el-textarea__inner {
      color: #333;
    }
  }
}

.w_50 {
  width: calc(50% - 8px);
}

.w_100 {
  width: 100%;
}

.item-body {
  height: calc(100% - 38px);
  overflow-y: auto;
}

.btn_group {
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  width: 100%;
  text-align: right;
}

.half_label {
  :deep(.el-form-item__label) {
    line-height: 16px !important;
  }
}
</style>
