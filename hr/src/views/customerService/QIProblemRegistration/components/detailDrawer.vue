<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" :showBottom="drawerType !== 'detail'">
    <div class="content" v-loading="drawerLoading">
      <!-- <div class="title-wapper">
         <span>质检人员维护</span>
       </div> -->
      <el-form
        :model="formParams"
        label-width="80"
        :rules="fromRules"
        ref="formRef"
        class="form-wapper"
      >
        <el-card
          shadow="never"
          style="margin-bottom: 10px; background-color: #fff; position: relative"
        >
          <template #header>
            <div class="card-header">
              <logo-label :txt="`质检人员维护`" :is-edit="false" is-logo style="font-weight: 600" />
              <div class="expand-body" @click="expandClick('isCreater')" v-if="disabled">
                <span class="expand-text">
                  {{ expand.isCreater ? '收起' : '展开' }}
                </span>
                <Icon
                  class="expand-icon"
                  :icon="expand.isCreater ? 'ep:arrow-up' : 'ep:arrow-down'"
                  :size="18"
                />
              </div>
            </div>
          </template>
          <div v-if="expand.isCreater" class="card-content">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="质检类型"
                  :prop="['add', 'edit'].includes(drawerType) ? 'qualityInspectionType' : ''"
                >
                  <el-select
                    class="!w100%"
                    v-model="formParams.qualityInspectionType"
                    placeholder="请选择质检类型"
                    filterable
                    :disabled="disabled"
                    :suffix-icon="disabled ? '' : 'ArrowDown'"
                  >
                    <el-option
                      v-for="item in getIntDictOptions(DICT_TYPE.QUALITY_INSPECTION_TYPE, true)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="问题风险程度" class="textWapper" prop="problemRiskLevel">
                  <el-select
                    class="!w100%"
                    v-model="formParams.problemRiskLevel"
                    placeholder="请选择问题风险程度"
                    filterable
                    :disabled="disabled"
                  >
                    <el-option
                      v-for="item in getIntDictOptions(DICT_TYPE.PROBLEM_RISK_LEVEL, true)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="店铺"
                  :prop="['add', 'edit'].includes(drawerType) ? 'store' : ''"
                >
                  <StoreSelect v-model="formParams.store" class="!w100%" :disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单号">
                  <el-input
                    class="!w100%"
                    v-model="formParams.orderNo"
                    placeholder="请输入订单号"
                    filterable
                    :disabled="disabled"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="客户ID"
                  :prop="['add', 'edit'].includes(drawerType) ? 'customerId' : ''"
                >
                  <el-input
                    class="!w100%"
                    v-model="formParams.customerId"
                    placeholder="请输入客户ID"
                    filterable
                    :disabled="disabled"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="旺旺名(客服)"
                  class="textWapper"
                  :prop="['add', 'edit'].includes(drawerType) ? 'customerName' : ''"
                >
                  <template #label>
                    <div>
                      <div>旺旺名</div>
                      <div>(客服)</div>
                    </div>
                  </template>
                  <!-- <el-input
                    class="!w100%"
                    v-model="formParams.customerName"
                    placeholder="请输入旺旺名(客服)"
                    filterable
                    :disabled="disabled"
                  /> -->
                  <el-select
                    class="!w100%"
                    v-model="formParams.customerName"
                    placeholder="请选择旺旺名(客服)"
                    clearable
                    filterable
                    :disabled="disabled"
                    @change="selectCustomerName"
                  >
                    <el-option v-for="cus in customerConfigList" :label="cus.label" :value="cus.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="分组">
                  <!-- <el-input v-model="formParams.groupName" disabled/> -->
                  <el-select
                    class="!w100%"
                    v-model="formParams.groupName"
                    placeholder="请选择客服分组"
                    clearable
                    filterable
                    :disabled="disabled"
                  >
                    <el-option v-for="cus in groupList" :label="cus.label" :value="cus.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item
                  label="具体问题描述"
                  class="textWapper"
                  :prop="['add', 'edit'].includes(drawerType) ? 'problemRemark' : ''"
                >
                  <s-text-area
                    
                    v-model="formParams.problemRemark"
                    class="!w100%"
                    placeholder="请填写具体问题描述"
                    :autosize="{ minRows: 5, maxRows: 6 }"
                    maxlength="500"
                    show-word-limit
                    :disabled="disabled"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="改善建议"
                  :prop="['add', 'edit'].includes(drawerType) ? 'improveSugges' : ''"
                >
                  <s-text-area
                    
                    v-model="formParams.improveSugges"
                    class="!w100%"
                    placeholder="请填写改善建议"
                    :autosize="{ minRows: 5, maxRows: 6 }"
                    maxlength="500"
                    show-word-limit
                    :disabled="disabled"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="问题截图"
                  :prop="['add', 'edit'].includes(drawerType) ? 'imagesUrls' : ''"
                >
                  <transfer
                    style="width: 334px"
                    v-model="formParams.imagesUrls"
                    width="100%"
                    :tip="'最多上传5张大小不超过20M的图片'"
                    :limit="5"
                    :disabled="disabled"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="问题对接人"
                  class="textWapper"
                  :prop="drawerType === 'add' ? 'handler' : ''"
                >
                  <!-- <SelectUser  v-model="formParams.handler" :multiple="false" class="!w300px" ref="selectUserRef" :disabled="disabled ||drawerType ==='edit' " /> -->
                  <SelectUser
                   :feedBackOptions="handlerList"
                    v-model="formParams.handler"
                    showAvatarLable
                    :suffixIcon="disabled  ? '' : 'ArrowDown'"
                    :multiple="false"
                    ref="selectUserRef"
                    class="!w100%"
                    :role="role"
                    :disabled="disabled"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="期望处理日期"
                  class="textWapper"
                  :prop="drawerType === 'add' ? 'expectHandleTime' : ''"
                >
                  <el-date-picker
                    v-model="formParams.expectHandleTime"
                    type="date"
                    class="!w100%"
                    valueFormat="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    placeholder="选择日期和时间"
                    :disabled="disabled || drawerType === 'edit'"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card
          shadow="never"
          style="margin-bottom: 10px; background-color: #fff; position: relative"
          v-if="['handle', 'detail'].includes(drawerType)"
        >
          <template #header>
            <div class="card-header">
              <logo-label :txt="`对接人员维护`" :is-edit="false" is-logo style="font-weight: 600" />
              <div class="expand-body" @click="expandClick('ishandler')" v-if="disabled">
                <span class="expand-text">
                  {{ expand.ishandler ? '收起' : '展开' }}
                </span>
                <Icon
                  class="expand-icon"
                  :icon="expand.ishandler ? 'ep:arrow-up' : 'ep:arrow-down'"
                  :size="18"
                />
              </div>
            </div>
          </template>
          <div v-if="expand.ishandler">
            <el-row v-if="expand.ishandler" :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="问题是否完成"
                  :prop="drawerType === 'handle' ? 'warehouseIssueComplete' : ''"
                  class="textWapper"
                >
                  <el-select
                    class="!w100%"
                    v-model="formParams.warehouseIssueComplete"
                    placeholder="请选择问题是否完成"
                    filterable
                    :disabled="drawerType !== 'handle'"
                    :suffix-icon="disabled ? '' : 'ArrowDown'"
                  >
                    <el-option value="1" label="已完成" />
                    <el-option value="0" label="未完成" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="处理日期" :prop="drawerType === 'handle' ? 'handleTime' : ''">
                  <el-date-picker
                    v-model="formParams.handleTime"
                    type="date"
                    class="!w100%"
                    valueFormat="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    placeholder="选择日期和时间"
                    :disabled="drawerType !== 'handle'"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="具体跟进情况"
                  :prop="drawerType === 'handle' ? 'followUpStatus' : ''"
                  class="textWapper"
                >
                  <s-text-area
                    
                    v-model="formParams.followUpStatus"
                    class="!w100%"
                    placeholder="请填写具体跟进情况"
                    :autosize="{ minRows: 5, maxRows: 6 }"
                    maxlength="500"
                    show-word-limit
                    :disabled="drawerType !== 'handle'"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="处理截图" :prop="drawerType === 'handle' ? 'handleUrls' : ''">
                  <transfer
                    style="width: 320px"
                    v-model="formParams.handleUrls"
                    :tip="'最多上传5张大小不超过20M的图片'"
                    :limit="5"
                    :disabled="drawerType !== 'handle'"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="reset">关闭</el-button>
      <el-button @click="submit" type="primary" class="mr20px">提交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import * as QIProblemRegistrationApi from '@/api/customerService/QIProblemRegistration'
import Transfer from '@/components/common/upload/transfer.vue'
import request from '@/config/axios';
import dayjs from 'dayjs'
const props = defineProps(['role'])
const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
const disabled = ref(false)
const expand = ref<any>({ isCreater: true, ishandler: true })
// const { customerConfigList } =  inject( 'QIProblemRegistration') as any 
// 请求参数
const formParams = ref({
  qualityInspectionType: '',
  problemRiskLevel: '',
  store: '',
  orderNo: '',
  customerName: '',
  groupName:'',
  customerId: '',
  problemRemark: '',
  improveSugges: '',
  imagesUrls: '',
  handler: '',
  expectHandleTime: '',
  warehouseIssueComplete: '',
  handleTime: '',
  followUpStatus: '',
  handleUrls: ''
})
// 客服人员分组配置列表
const customerConfigList = ref<any[]>([])
const getCusList = async()=>{
  request.get({ url:"/api/personnelGroup/getGroup"}).then((res:any)=>{
    customerConfigList.value = res.map((rs:any)=>({
      ...rs,
      label:rs.customerName,
      value:rs.customerName
    }))
  })
}

const formRef = ref()
const selectUserRef = ref()
const showBottom = ref(true)
const open = async (type, id) => {
  console.log('id', id)
  reset()
  setTimeout(() => {
    selectUserRef.value?.focusOn()
  }, 0)
  drawerVisible.value = true
  drawerType.value = type
  getCusList()
  switch (type) {
    case 'add':
      // 当expression的值等于value1时执行的代码块
      drawerTitle.value = '新增'
      disabled.value = false
      break
    case 'edit':
      disabled.value = false
      drawerTitle.value = '编辑'
      break
    case 'handle':
      disabled.value = true
      drawerTitle.value = '处理'
      break
    case 'detail':
      disabled.value = true
      drawerTitle.value = '详情'
      break
  }
  if (id) {
    try {
      drawerLoading.value = true
      const data = await QIProblemRegistrationApi.getDetailsById(id)
      console.log(data)
      if (data) {
        formParams.value = data

        formParams.value.warehouseIssueComplete =
          formParams.value.warehouseIssueComplete === null
            ? ''
            : String(formParams.value.warehouseIssueComplete)
        if (!formParams.value.handleTime && drawerType.value === 'handle') {
          formParams.value.handleTime = dayjs().format('YYYY-MM-DD')
        }
      }
    } finally {
      drawerLoading.value = false
    }
  } else {
  }
}

const expandClick = (name: string) => {
  expand.value[name] = !expand.value[name]
}

const handleImgChange = (type = 0) => {
  if (type === 0) {
    formRef.value.validateField('imagesUrls')
  } else {
    formRef.value.validateField('handleUrls')
  }
}
const groupList = ref<any>([])
const handlerList = ref<any>([])
const selectCustomerName = (val:string ) => {
  if(val){
    formParams.value.customerName = val
    const groupName = customerConfigList.value.find((el:any)=>el.value === val)?.groupName
    groupList.value = groupName.map((gr:string)=>({
      label:gr,
      value:gr
    }))
    formParams.value.groupName = groupList.value[0].value
    const group = customerConfigList.value.find((el:any)=>el.value === val)?.groups[0]
    formParams.value.handler = group?.questionDockingPerson
    handlerList.value = [{avatarOrigin:group?.questionDockingPersonAvatar,realName:group?.questionDockingPersonName,userId:group?.questionDockingPerson}]
  }else{
    formParams.value.groupName = ''
    formParams.value.handler = ''
    groupList.value = []
    handlerList.value = []
  }
}
const fromRules = reactive({
  qualityInspectionType: [{ required: true, message: '请选择质检类型', trigger: 'change' }],
  store: [{ required: true, message: '请选择店铺', trigger: 'change' }],
  customerId: [{ required: true, message: '请输入客户ID', trigger: 'blur' }],
  customerName: [{ required: true, message: '请选择旺旺名(客服)', trigger: 'blur' }],
 groupName:[{ required: true, message: '请选择客服分组', trigger: ['blur', 'change'] }],
  problemRemark: [{ required: true, message: '请输入具体问题描述', trigger: 'blur' }],
  improveSugges: [{ required: true, message: '请输入改善建议', trigger: 'blur' }],
  imagesUrls: [{ required: true, message: '请上传问题截图', trigger: 'change' }],
  handler: [{ required: true, message: '请选择问题对接人', trigger: 'blur' }],
  expectHandleTime: [{ required: true, message: '请选择期望处理日期', trigger: 'blur' }],
  warehouseIssueComplete: [{ required: true, message: '请选择期问题是否完成', trigger: 'blur' }],
  handleTime: [{ required: true, message: '请选择期望处理日期', trigger: 'blur' }],
  followUpStatus: [{ required: true, message: '请输入具体跟进情况', trigger: 'blur' }],
  handleUrls: [{ required: true, message: '请上传处理截图', trigger: 'blur' }],
  problemRiskLevel: [{ required: true, message: '请选择问题风险程度', trigger: 'change' }]
})

const submit = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return
  try {
    drawerLoading.value = true
    let params = { ...formParams.value }
    if (Array.isArray(params.store)) {
      params.store = params.store.length === 2 ? params.store[1] : ''
    }
    params.qualityInspectionType = Array.isArray(params.qualityInspectionType)
      ? params.qualityInspectionType?.join(',')
      : params.qualityInspectionType

    if (drawerType.value === 'add') {
      await QIProblemRegistrationApi.add(params)
    }
    if (drawerType.value === 'edit') {
      await QIProblemRegistrationApi.editForCreate(params)
    }
    if (drawerType.value === 'handle') {
      const handleParam = { ...params, type: 2 }
      await QIProblemRegistrationApi.editForHandle(handleParam)
    }

    message.success('保存成功')
    reset()
    emits('success')
    emits('handleRefresh', false)
  } finally {
    drawerLoading.value = false
  }
}
const reset = () => {
  formRef.value?.resetFields()
  drawerVisible.value = false
}
const emits = defineEmits(['success', 'handleRefresh', 'getRole'])
defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep() {
  --el-text-color-placeholder: #999;
}

:deep(.el-drawer__footer) {
  display: none !important;
}
:deep(.el-card) {
  border: none;
  border-radius: 8px;
}
:deep(.upload_info .file_list .file_card .file_icon .img) {
  box-shadow: 0 0 0 0 !important;
}
.card-content {
  width: calc(100% - 0px);
  padding-right: 0px;
}
.textWapper {
  :deep(.el-form-item__label) {
    width: 80px;
    line-height: 16px !important;
    text-align: right;
  }
}
.content {
  //  background-color: #fff;
  // width: 100%;
  // min-height: 100%;
  // border-radius: 20px;
  // padding: 20px;
}
.handle-content {
  margin-top: 10px;
  margin-bottom: 10px;
}
.title-wapper {
  width: calc(100% - 20px);
  height: 52px;
  border-bottom: 1px #f0f0f0 solid;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  span {
    font-size: 14px;
    font-weight: 600;
    position: relative;
    margin-left: 25px;
  }
  span::before {
    content: '';
    width: 3px;
    height: 13px;
    background-color: #0064ff;
    position: absolute;
    left: -20px;
    top: 1px;
  }
}
.user {
  display: flex;
  align-items: center;
  .ava {
    margin-right: 10px;
  }
}
.expand-body {
  cursor: pointer;
  color: var(--el-color-primary);
  display: inline-block;
  position: absolute;
  right: 50px;
  top: 25px;
  font-size: 14px;

  .expand-icon {
    position: absolute;
    right: -20px;
    top: -2px;
  }
}
</style>
