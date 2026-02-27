<!-- 供需计划节点更改为【采购计划申请】 -->
<template>
  <SWDialog v-if="visible" v-model="visible" :title="dialogTitle" :width="width" :showTitleLine="true"
    :show-bottom-line="true" style="background: #f8f8f9">
    <div class="dialog-content">
      <div class="left-content">
        <div class="flex-row header-wapper">
          <span class="desc"></span>
          <div class="title">审核记录</div>
        </div>
        <AuditRecords :records="auditRecords" />
        <div class="empty-wapper">
          <img class="empty-img" src="@/assets/imgs/promotion/empty.png" alt="" />
          <div v-if="!auditRecords.length" class="empty-desc">暂无数据</div>
        </div>
      </div>
      <div class="right-content">
        <div class="flex-row header-wapper">
          <span class="desc"></span>
          <div class="title">审核记录</div>
        </div>
        <el-form ref="ruleFormRef" :model="form" label-width="120" style="max-width: 580px" :rules="rules"
          @click="formBgClick">
          <el-form-item label="设计图" prop="productPictureUrl">
            <SWUploadFile style="width: 298px" ref="supplyDocumentUploadFileRef"
              v-model:modelValue="form.productPictureUrl" :width="298" :hideFileSizeMsg="true" :onlyShow="true"
              :disabled="forbidEdit" />
          </el-form-item>
          <el-form-item label="材质" prop="material">
            <el-input v-model="form.material" placeholder="请输入材质" style="width: 100%" :disabled="true" />
          </el-form-item>
          <el-form-item label="规格尺寸" prop="packageSize">
            <el-input v-model="form.packageSize" placeholder="请输入规格尺寸" style="width: 100%" :disabled="true" />
          </el-form-item>
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input v-model="form.supplierName" placeholder="请输入供应商名称" style="width: 100%" :disabled="true" />
          </el-form-item>
          <el-form-item label="货品编码" prop="productCode">
            <el-input v-model="form.productCode" placeholder="请输入货品编码" style="width: 100%" :disabled="true" />
          </el-form-item>
          <el-form-item label="下单数量" prop="orderNumber">
            <!-- 只能是正整数 -->
            <el-input v-model="form.orderNumber" placeholder="请输入下单数量" style="width: 100%" type="number" min="0"
              :disabled="forbidEdit || canNotEdit" @input="handleInput" />
          </el-form-item>
          <el-form-item label="实物报价（单价）" prop="physicalQuotePrice">
            <el-input v-model="form.physicalQuotePrice" placeholder="请输入实物报价" style="width: 100%" :disabled="true" />
          </el-form-item>

          <el-form-item label="版费" prop="editionFee">
            <el-input v-model="form.editionFee" placeholder="请输入版费" style="width: 100%" type="number" min="0"
              :disabled="forbidEdit || canNotEdit" @input="handleEditionFeeInput" />
          </el-form-item>
          <el-form-item label="交货日期" prop="deliveryDate">
            <el-date-picker v-model="form.deliveryDate" type="date" :value-format="'YYYY-MM-DD'" placeholder="请选择日期"
              style="width: 100%" :disabled="forbidEdit || canNotEdit" />
          </el-form-item>

          <el-form-item label="备货事由" prop="remark">
            <s-text-area v-model="form.remark" placeholder="请输入备货事由" style="width: 100%"
              :disabled="forbidEdit || canNotEdit" :autosize="{ minRows: 4, maxRows: 4 }" />
          </el-form-item>
          <!-- 根据下单数量的输入 ，动态变化，可修改。但是只要是下单数量变化了，此值就会发生变化 -->
          <el-form-item label="金额" prop="totalAmount">
            <el-input v-model="form.totalAmount" placeholder="请输入金额" style="width: 100%"
              :disabled="forbidEdit || canNotEdit" />
          </el-form-item>
          <el-form-item label="附件上传" prop="attachmentUrl">
            <SWUploadFile style="width: 298px" ref="supplyDocumentUploadFileRef" v-model:modelValue="form.attachmentUrl"
              :width="298" :hideFileSizeMsg="true" :disabled="forbidEdit || canNotEdit" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="selectItem.status == 'active' && !canNotEdit" type="primary"
          @click="confirmDialog">提交</el-button>
      </div>
    </template>
  </SWDialog>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
import { PropType, reactive, ref, watch } from 'vue'
import AuditRecords from './AuditRecords.vue'

import {
  getProcurementPlanDetail,
  saveOrUpdateProcurementPlan
} from '@/api/oa/package/designGallery/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  forbidEdit: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    required: false
  },

  width: {
    type: String,
    default: '936px'
  },
  designInfo: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

const records = ref([
  {
    avatar:
      'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png', // 替换为真实头像地址
    username: '丁萌萌',
    status: 'reject', // 状态：reject（拒绝）/ pass（通过）
    time: '2025-06-24 11:47:20',
    remark: '6.24颜色已确认，已建档'
  },
  {
    avatar:
      'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png',
    username: '丁萌萌',
    status: 'reject',
    time: '2025-06-24 11:47:20',
    remark: '6.24颜色已确认，已建档'
  },
  {
    avatar:
      'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/roster/ou_8dfeaa27803c1a7e6a055d87dbc0270d.png',
    username: '丁萌萌',
    status: 'pass',
    time: '2025-06-24 11:47:20',
    remark: '6.24颜色已确认，已建档6.24颜色已确认，已建档6.24颜色已确认，已建档...' // 测试长文本换行
  }
])

const dialogTitle = ref('')
const form = ref({
  productPictureUrl: undefined, //设计图
  material: undefined, //材质
  packageSize: undefined, //规格尺寸
  supplierName: undefined, //供应商名称
  productCode: undefined, //货品编码
  orderNumber: 0, //下单数量
  physicalQuotePrice: 0, //实物报价
  totalAmount: 0, //金额
  deliveryDate: undefined, //交货日期
  remark: undefined, //备注
  attachmentUrl: undefined, //附件
  editionFee: 10.0 //版费
})

const handleInput = (value: any) => {
  console.log(value, 'value')
  form.value.orderNumber = value.replace(/[^\d]/g, '')

  form.value.totalAmount =
    value.replace(/[^\d]/g, '') * Number(form.value.physicalQuotePrice || 0) +
    Number(form.value.editionFee || 0)
}

// 只能是数字和小数点后两位 不能是负数
const handleEditionFeeInput = (value: any) => {
  let newValue = value.replace(/[^\d.]/g, '') // 只允许输入数字和小数点
  newValue = newValue.replace(/\.{2,}/g, '.') // 只允许一个小数点
  newValue = newValue.replace(/^0+(\d)/, '$1') // 去掉前导零
  newValue = newValue.replace(/^(\d+)\.(\d{0,2}).*$/, '$1.$2') // 保留两位小数

  form.value.editionFee = newValue

  form.value.totalAmount =
    form.value.orderNumber * Number(form.value.physicalQuotePrice || 0) +
    Number(form.value.editionFee || 0)
}

const canNotEdit = computed(() => {
  return nodeCode.value == 'ProcurementPlanAudit'
})

const nodeCode = ref('') // 当前节点code
const selectItem = ref()
const open = async (data: any, type: string) => {
  console.log(type, 'type', data)
  nodeCode.value = type
  dialogTitle.value = data.nodeName || ''
  selectItem.value = data || {}
  visible.value = true
  getDesignDetail()
}

const procurementDetail = ref() //采购计划申请详情
const auditRecords = ref([]) // 审核记录

const getDesignDetail = async () => {
  console.log(props.designInfo, 'props.designInfo111')
  // 进度维护采购计划申请详情
  const res = await getProcurementPlanDetail(props.designInfo.productPlanId)

  auditRecords.value = res.auditRecords || []
  form.value = res.procurementDetail || {}
  form.value.editionFee = res.procurementDetail.editionFee || 0.0
  console.log(res, '采购计划申请详情')
  form.value.productPictureUrl = res.procurementDetail.productPictureUrl.split(',').map((item) => {
    const url = item.split('?name=')[0]
    const name = item.split('?name=')[1]
    return {
      url,
      name
    }
  })
  form.value.attachmentUrl = res.procurementDetail.attachmentUrl.split(',').map((item) => {
    const url = item.split('?name=')[0]
    const name = item.split('?name=')[1]
    return {
      url,
      name
    }
  })
}

const rules = reactive({
  orderNumber: [
    { required: true, message: '请输入下单数量', trigger: 'blur' },
    {
      pattern: /^[1-9]\d*$/,
      message: '请输入正整数',
      trigger: 'blur'
    }
  ],
  deliveryDate: [{ required: true, message: '请选择交货日期', trigger: 'change' }]
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const supplyDocumentUploadFileRef = ref()

const formBgClick = () => {
  supplyDocumentUploadFileRef.value?.cancelUploadSelect()
}

const handleClose = () => {
  form.value.productPictureUrl = undefined

  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}
const ruleFormRef = ref()
const confirmDialog = async () => {
  console.log(props.designInfo, 'form11', form.value)
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        ...form.value,
        productPlanId: props.designInfo.productPlanId
      }

      if (
        data.productPictureUrl &&
        Array.isArray(data.productPictureUrl) &&
        data.productPictureUrl.length > 0
      ) {
        data.productPictureUrl = data.productPictureUrl
          .map((item) => {
            return item.url && item.url + '?name=' + item.name
          })
          .join(',')
      }

      if (
        data.attachmentUrl &&
        Array.isArray(data.attachmentUrl) &&
        data.attachmentUrl.length > 0
      ) {
        data.attachmentUrl = data.attachmentUrl
          .map((item) => {
            return item.url && item.url + '?name=' + item.name
          })
          .join(',')
      }

      console.log(data, '111')
      await saveOrUpdateProcurementPlan(data)
      message.success('操作成功')
      emit('confirm', data)
      emit('update:modelValue', false)
      handleClose()
    } else {
      return false
    }
  })
}

defineExpose({ open })
</script>

<style scoped lang="scss">
.dialog-footer {
  margin-top: 10px;
  margin-right: 20px;
}

.dialog-content {
  padding-top: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;

  .left-content {
    max-height: 600px;
    overflow-y: auto;
    width: 274px;
    background: #ffffff;
    border-radius: 8px;
    margin-right: 20px;
  }

  .right-content {
    max-height: 600px;
    overflow-y: auto;
    box-sizing: border-box;
    background: #ffffff;
    flex: 1;
  }

  .header-wapper {
    padding: 16px 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 20px;
    align-items: center;

    .title {
      color: #333333;
      font-weight: 600;
      font-size: 14px;
    }

    .desc {
      display: inline-block;
      width: 3px;
      height: 10px;
      background-color: #0064ff;
      margin-right: 6px;
    }
  }
}

:deep(.el-form-item__label) {
  display: flex;
  align-items: center;
  padding-left: 0px;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-align: right;
  letter-spacing: normal;
  color: #666666;
}

.empty-wapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;

  .empty-img {
    display: block;
    width: 120px;
    height: 76px;
  }

  .empty-desc {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #999999;
  }
}
</style>
