<template>
  <el-form
    :label-width="80"
    ref="formRef"
    :rules="rules"
    :model="dataValue"
    inline
    class="form_body"
    :class="disabled ? 'only-view' : ''"
  >
    <el-form-item label="店铺" prop="store" class="half">
      <store-select
        placeholder="请选择"
        v-model="dataValue.store"
        :show-params="{ label: 'value' }"
        :disabled="disabled"
        @change="storeChange"
      />
    </el-form-item>
    <el-form-item prop="customerName" class="half line-h16">
      <template #label>
        <div>
          <div>旺旺名</div>
          <div>(客服)</div>
        </div>
      </template>
      <!-- <el-input v-model="dataValue.customerName" placeholder="请输入" :disabled="disabled">
      </el-input> -->
      <el-select
        class="!w100%"
        v-model="dataValue.customerName"
        placeholder="请选择旺旺名(客服)"
        clearable
        filterable
        :disabled="disabled"
        @change="selectCustomerName"
      >
        <el-option v-for="cus in customerConfigList" :label="cus.label" :value="cus.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="客服分组" prop="groupName" class="half">
      <!-- <el-input v-model="dataValue.groupName"  disabled /> -->
       <el-select
        class="!w100%"
        v-model="dataValue.groupName"
        placeholder="请选择客服分组"
        clearable
        filterable
        :disabled="disabled"
      >
        <el-option v-for="cus in groupList" :label="cus.label" :value="cus.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="订单号" prop="orderNo" class="half">
      <el-input v-model="dataValue.orderNo" placeholder="请输入" :disabled="disabled" />
    </el-form-item>
    <el-form-item label="客户ID" prop="customerId" class="half">
      <el-input v-model="dataValue.customerId" placeholder="请输入" :disabled="disabled" />
    </el-form-item>
    <el-form-item label="触发舆情" prop="violatingPublicOpinion" class="half">
      <el-select
        v-model="dataValue.violatingPublicOpinion"
        placeholder="请选择"
        :disabled="disabled"
      >
        <el-option
          v-for="item in getIntDictOptions(DICT_TYPE.VIOLATING_PUBLIC_OPINION)"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="problemRiskLevel" class="half line-h16">
      <template #label>
        <div>
          <div>问题风险</div>
          <div>程度</div>
        </div>
      </template>
      <el-select v-model="dataValue.problemRiskLevel" placeholder="请选择" :disabled="disabled">
        <el-option
          v-for="item in getIntDictOptions(DICT_TYPE.PROBLEM_RISK_LEVEL)"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="产品编码" prop="productId" class="half">
      <GoodCode
        placeholder="请输入"
        url="/api/wdtSpec/listSpecNo"
        v-model="dataValue.productId"
        :disabled="disabled"
      />
    </el-form-item>
    <el-form-item label="客户问题描述" prop="problemRemark" class="all line-h16">
      <s-text-area
        show-word-limit
        placeholder="请输入"
        
        v-model="dataValue.problemRemark"
        :rows="4"
        :maxlength="500"
        @change="valueChange"
        :disabled="disabled"
      />
    </el-form-item>
    <el-form-item label="产生原因" prop="rootCause" class="half">
      <el-select v-model="dataValue.rootCause" placeholder="请选择" :disabled="disabled">
        <el-option
          v-for="item in getIntDictOptions(DICT_TYPE.ROOT_CAUSE)"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="具体原因" prop="specificReason" class="half">
      <el-select
        v-model="dataValue.specificReason"
        placeholder="请选择"
        :disabled="disabled"
        filterable
      >
        <el-option
          v-for="item in getIntDictOptions(DICT_TYPE.SPECTIFIC_REASON)"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="质检时间" prop="inspectionTime" class="half">
      <el-date-picker
        placeholder="默认到当前年月日时分"
        v-model="dataValue.inspectionTime"
        type="datetime"
        :disabled="disabled"
        style="width: 100%"
        @change="valueChange"
        format="YYYY-MM-DD HH:mm"
        value-format="YYYY-MM-DD HH:mm"
        time-format="HH:mm"
      />
    </el-form-item>
    <el-form-item label="期望完成时间" prop="expectHandleTime" class="half line-h16">
      <el-date-picker
        placeholder="精确到年月日时分"
        v-model="dataValue.expectHandleTime"
        type="datetime"
        :disabled="disabled || type === 'edit'"
        style="width: 100%"
        @change="valueChange"
        format="YYYY-MM-DD HH:mm"
        value-format="YYYY-MM-DD HH:mm"
        time-format="HH:mm"
        :default-time="new Date()"
        v-bind="pickerOptions"
      />
    </el-form-item>
    <el-form-item label="客服当时方案" prop="customerPlanTimeService" class="half line-h16">
      <el-select
        v-model="dataValue.customerPlanTimeService"
        placeholder="请选择"
        :disabled="disabled"
      >
        <el-option
          v-for="item in getIntDictOptions(DICT_TYPE.CUSTOMER_PLAN_TIME_SERVICE)"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="客户当时反馈" prop="customerTimeFeedback" class="half line-h16">
      <el-select v-model="dataValue.customerTimeFeedback" placeholder="请选择" :disabled="disabled">
        <el-option
          v-for="item in getIntDictOptions(DICT_TYPE.CUSTOMER_TIME_FEEDBACK)"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="客服当时处理" prop="customerTimeHandle" class="all line-h16">
      <s-text-area
        show-word-limit
        placeholder="请输入"
        
        v-model="dataValue.customerTimeHandle"
        :rows="4"
        :maxlength="500"
        @change="valueChange"
        :disabled="disabled"
      >
        <template #prepend></template>
      </s-text-area>
    </el-form-item>
    <el-form-item
      label="问题对接人"
      prop="handler"
      class="half line-h16"
      :class="type !== 'add' ? 'only-view' : ''"
    >
      <SelectUser
        :multiple="false"
        placeholder="请选择"
        v-model="dataValue.handler"
        :feedBackOptions="feedBackOptions"
        :role="getRole('质检问题处理人')"
        :showAvatarLable="true"
        :disabled="disabled"
      />
    </el-form-item>
    <el-form-item
      label="问题截图"
      prop="imagesUrls"
      class="all"
      :show-message="(type === 'add' || type === 'edit') && !dataValue.imagesUrls"
    >
      <transfer
        v-if="type === 'add' || type === 'edit'"
        :width="353"
        v-model="dataValue.imagesUrls"
        :tip="'只能上传图片，且不超过5M'"
        :limit="5"
      />
      <div
        v-if="type === 'view' || type === 'handle'"
        class="file_image"
        v-for="(file, index) in fileList"
        :key="index"
      >
        <el-image class="img" :src="file" :preview-src-list="[file ? file : '']" fit="cover" />
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="tsx">
export default { name: 'TransactionOrderDetailReg' }
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import SelectUser from '@/components/common/user/selectUser.vue'
import GoodCode from '@/components/template/query/components/goodCode.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { TabsProvideType, DetailProvideType } from './type'

const { dataValue, type, disabled, feedBackOptions, updetaValue,customerConfigList } = inject(
  'realtimeqi_details'
) as DetailProvideType

const fileList = computed(() => dataValue.value?.imagesUrls.split(','))

const { roleList } = inject('realtimeqi_handle') as TabsProvideType

const rules = computed(() => ({
  store: [{ required: !disabled.value, message: '请选择店铺', trigger: ['blur', 'change'] }],
  customerName: [
    { required: !disabled.value, message: '请选择客服(旺旺名)', trigger: ['blur', 'change'] }
  ],
  groupName:[{ required: !disabled.value, message: '请选择客服分组', trigger: ['blur', 'change'] }],
  customerId: [{ required: !disabled.value, message: '请输入客户ID', trigger: ['blur', 'change'] }],
  violatingPublicOpinion: [
    { required: !disabled.value, message: '请选择触发舆情', trigger: ['blur', 'change'] }
  ],
  problemRiskLevel: [
    { required: !disabled.value, message: '请选择问题风险程度', trigger: ['blur', 'change'] }
  ],
  problemRemark: [
    { required: !disabled.value, message: '请输入客户问题描述', trigger: ['blur', 'change'] }
  ],
  rootCause: [
    { required: !disabled.value, message: '请选择产生原因', trigger: ['blur', 'change'] }
  ],
  specificReason: [
    { required: !disabled.value, message: '请选择具体原因', trigger: ['blur', 'change'] }
  ],
  inspectionTime: [
    { required: !disabled.value, message: '请选择质检时间', trigger: ['blur', 'change'] }
  ],
  expectHandleTime: [
    {
      required: !disabled.value && type.value === 'add',
      message: '请选择期望完成时间',
      trigger: ['blur', 'change']
    }
  ],
  customerPlanTimeService: [
    { required: false, message: '请选择客服当时方案', trigger: ['blur', 'change'] }
  ],
  customerTimeFeedback: [
    { required: !disabled.value, message: '请选择客服当时反馈', trigger: ['blur', 'change'] }
  ],
  customerTimeHandle: [
    { required: false, message: '请输入客服当时处理', trigger: 'blur' }
  ],
  handler: [
    {
      required: !disabled.value && type.value === 'add',
      message: '请选择问题对接人',
      trigger: ['blur', 'change']
    }
  ],
  imagesUrls: [
    { required: !disabled.value, message: '请上传问题截图', trigger: ['blur', 'change'] }
  ]
}))

const formRef = ref()

const validateCheck = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  })
}

const clearValidate = () => {
  formRef?.value?.clearValidate()
}

const getRole = (name: string) => {
  const tar: any = roleList.value.find((rs: any) => rs.name.includes(name))
  return tar?.id || ''
}

const valueChange = () => updetaValue({ ...dataValue.value })

const storeChange = (val) => {
  dataValue.value.store = val?.length ? val[1] : ''
}

// 选择客服
const groupList = ref<any>([])
const selectCustomerName = (val:string ) => {
  if(val){
    dataValue.value.customerName = val
    const groupName = customerConfigList.value.find((el:any)=>el.value === val)?.groupName
    groupList.value = groupName.map((gr:string)=>({
      label:gr,
      value:gr
    }))
    dataValue.value.groupName = groupList.value[0].value
    const group = customerConfigList.value.find((el:any)=>el.value === val)?.groups[0]
    dataValue.value.handler = group?.questionDockingPerson
    feedBackOptions.value = [{avatarOrigin:group?.questionDockingPersonAvatar,realName:group?.questionDockingPersonName,userId:group?.questionDockingPerson}]
  }else{
    dataValue.value.groupName = ''
    dataValue.value.handler = ''
    groupList.value = []
  }
}

/**
 * 生成一个数组
 * @param start
 * @param end
 */
const makeRange = (start: number, end: number) => {
  const result: number[] = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

/**
 * 限制今天之前的时间不能选择（小时）
 */
const disabledHours = () => {
  let newVal = new Date(dataValue.value.expectHandleTime)
  if (
    newVal &&
    newVal.getFullYear() == new Date().getFullYear() &&
    newVal.getMonth() == new Date().getMonth() &&
    newVal.getDate() == new Date().getDate()
  ) {
    //如果为今天，则限制当前时间前的时间不能选择。
    return makeRange(0, new Date().getHours() - 1)
  }
  return []
}

/**
 * 限制今天之前的时间不能选择（分钟）
 * @param hour
 */
const disabledMinutes = (_hour: number) => {
  let newVal = new Date(dataValue.value.expectHandleTime)
  if (
    newVal &&
    newVal.getFullYear() == new Date().getFullYear() &&
    newVal.getMonth() == new Date().getMonth() &&
    newVal.getDate() == new Date().getDate()
  ) {
    //如果为今天，则限制当前时间前的时间不能选择。
    return makeRange(0, new Date().getMinutes() - 1)
  }
  return []
}

/**
 * 限制今天之前的时间不能选择的配置
 */
const pickerOptions = computed(() => {
  return {
    // 限制今天之前的日期不能选择
    disabledDate(time: any) {
      return time.getTime() < Date.now() - 24 * 3600 * 1000
    },
    // 限制今天之前的小时不能选择
    disabledHours,
    // 限制今天之前的分钟不能选择
    disabledMinutes
  }
})

defineExpose({ clearValidate, validateCheck })
</script>
<style lang="scss" scoped>
.form_body {
  margin-top: 10px;

  // :deep(.el-form-item__label) {
  //   display: block;
  // }

  &.only-view {
    :deep(.el-input__suffix) {
      display: none;
    }

    :deep(.el-select__suffix) {
      display: none;
    }
  }

  .line-h16 {
    :deep(.el-form-item__label) {
      line-height: 16px;
      text-align: right;
    }
  }

  :deep(.el-form-item) {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .half {
    width: calc(50% - 20px);

    &.only-view {
      :deep(.el-select__suffix) {
        display: none;
      }
    }
  }

  .all {
    width: calc(100% - 20px);
  }

  :deep(.file_icon) {
    .img {
      box-shadow: none !important;
    }
  }

  .file_image {
    margin-right: 20px;

    .img {
      border-radius: 6px;
      width: 110px;
      height: 110px;
    }
  }
}
</style>
