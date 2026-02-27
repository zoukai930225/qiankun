<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" @close="reset">
    <div class="content" v-loading="drawerLoading">
      <el-form :model="formParams" label-width="100" :rules="fromRules" ref="formRef">
        <el-row>
          <el-col :span="12">
            <el-form-item label="渠道" prop="channel">
              <el-select class="!w300px" v-model="formParams.channel" placeholder="请选择" clearable filterable
                value-on-clear="" @change="handleChangeChannel">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="千川账号" prop="account">
              <el-input v-model="formParams.account" class="!w300px" placeholder="请输入千川账号" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select class="!w300px" v-model="formParams.type" placeholder="请选择" clearable value-on-clear="">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.DOUYIN_PROMOTION_TYPE, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="开始日期" prop="beginDate">
              <el-date-picker v-model="formParams.beginDate" type="date" class="!w300px" />
            </el-form-item>
            <el-form-item label="消耗" prop="cost">
              <el-input v-model="formParams.cost" class="!w300px" placeholder="请输入消耗" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺" prop="store">
              <el-select v-model="formParams.store" clearable filterable class="!w300px" value-on-clear=""
                @change="handleStoreChange">
                <el-option v-for="item in storeList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="业务类型" prop="businessType">
              <el-select class="!w300px" v-model="formParams.businessType" multiple placeholder="请选择业务类型">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.DOUYIN_PROMOTION_BUSINESS_TYPE, true)"
                  :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="计算类型" prop="countType">
              <el-select class="!w300px" v-model="formParams.countType" placeholder="请选择" clearable value-on-clear="">
                <el-option label="加上" value="1" />
                <el-option label="减去" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="截止日期" prop="endDate">
              <el-date-picker v-model="formParams.endDate" type="date" class="!w300px" />
            </el-form-item>
            <el-form-item label="来源平台" prop="orgType">
              <el-select class="!w300px" v-model="formParams.orgType" placeholder="请选择" value-on-clear="" filterable>
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ORG_TYPE, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <s-text-area class="!w730px" :autosize="{ minRows: 3, maxRows: 4 }" v-model="formParams.remark" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="reset">关闭</el-button>
      <el-button type="primary" class="mr20px" @click="submitForm" :disabled="drawerLoading">提交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as QcApi from '@/api/qianchuan'
import { DICT_TYPE, getIntDictOptions, getDictObj } from '@/utils/dict'
import dayjs from 'dayjs'
import * as QcDayApi from '@/api/qianchuanDay/index'
const message = useMessage() // 消息弹窗
//弹框显示
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
// 请求参数
const formParams = ref({
  channel: '',
  store: '',
  account: '',
  businessType: [],
  type: '',
  typeName: '',
  beginDate: new Date(),
  endDate: new Date(2099, 11, 31),
  countType: '',
  remark: '',
  cost: '',
  id: undefined,
  orgType: '0'
})

const formRef = ref()
const fromRules = reactive({
  channel: [{ required: true, message: '请选择渠道', trigger: 'blur' }],
  store: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
  businessType: [{ required: true, message: '请选择业务类型', trigger: 'blur' }],
  beginDate: [{ required: true, message: '请选择开始日期', trigger: 'blur' }],
  endDate: [{ required: true, message: '请选择截止日期', trigger: 'blur' }],
  cost: [{ pattern: /^(([1-9]\d*)|0)(\.\d{1,2})?$/, message: '请输入数值', trigger: 'blur' }],
  orgType: [{ required: true, message: '请选择来源平台', trigger: 'change' }]
})
// 根据渠道获取店铺列表
const storeList = ref<any[]>([]) // 店铺列表
// 渠道变化时的处理
const handleChangeChannel = () => {
  formParams.value.store = '' // 清空店铺
  storeList.value = [] // 清空店铺列表
  formParams.value.account = '' // 清空千川账号
  // 如果没有选择渠道，则不进行后续操作
  const channel = formParams.value.channel
  if (!channel) return
  // 根据渠道获取账单店铺和千川账号
  getQcAccountByChannel(channel)
}

// 根据渠道查询账单店铺和账单账号
const getQcAccountByChannel = async (channel) => {
  const res = await QcApi.getQcAccountStoreByChannel({ channelCode: channel })
  storeList.value = res || []
}
// 店铺变化时的处理
const handleStoreChange = () => {
  formParams.value.account = '' // 清空千川账号
  const selectedStore = formParams.value.store
  if (!selectedStore) return
}
//打开弹框
const open = async (type, id) => {
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = type === 'add' ? '新增' : type === 'edit' ? '编辑' : '查看'

  if (id) {
    formParams.value.id = id
    try {
      drawerLoading.value = true
      const data = await QcDayApi.getById(id)
      if (data) {
        formParams.value = data
        formParams.value.businessType = data.businessType.split(',')
        getQcAccountByChannel(data.channel)
      }
    } finally {
      drawerLoading.value = false
    }
  } else {
  }
}

// 提交表单
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  await formRef.value.validate()

  // 提交请求
  drawerLoading.value = true
  try {
    const data = formParams.value as any
    if (Array.isArray(data.businessType)) {
      data.businessType = data.businessType.join(',')
    }
    data.beginDate = dayjs(data.beginDate).format('YYYY-MM-DD')
    data.endDate = dayjs(data.endDate).format('YYYY-MM-DD')
    data.typeName = getDictObj(DICT_TYPE.DOUYIN_PROMOTION_TYPE, data.type)?.label
    if (drawerType.value === 'add') {
      data.id = undefined
      await QcDayApi.save(data)
      reset()
      message.success('新增成功')
    } else {
      await QcDayApi.update(data)
      reset()
      message.success('修改成功')
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emits('success')
  } finally {
    drawerLoading.value = false
  }
}

const reset = () => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  drawerVisible.value = false
}

const emits = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="less" scoped>
.content {
  background-color: #fff;
  width: 100%;
  min-height: 100%;
  border-radius: 20px;
  padding: 20px;
}
</style>
