<template>
  <div v-if="drawerVisible">
    <el-drawer custom-class="addDrawer" v-model="drawerVisible" :title="dialogTitle" size="908">
      <div class="drawerContent">
        <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
          label-width="125px">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="渠道" prop="channel">
                <el-select class="dialogFormItemWidth" v-model="formData.channel" placeholder="请选择" clearable filterable
                  @change="handleChangeChannel">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号归属店铺" prop="store">
                <el-select v-model="formData.store" clearable filterable value-on-clear="" class="dialogFormItemWidth"
                  @change="handleBillStoreChange">
                  <el-option v-for="item in storeList" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="实际消耗店铺" prop="actualConsumStore" :rules="isValidActualConsumeStore
                  ? [{ required: true, message: '请选择实际消耗店铺', trigger: 'change' }]
                  : []
                ">
                <el-select v-model="formData.actualConsumStore" clearable filterable value-on-clear=""
                  class="dialogFormItemWidth">
                  <el-option v-for="item in storeList" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="千川账号" prop="account">
                <!-- <el-select
                  class="dialogFormItemWidth"
                  v-model="formData.account"
                  placeholder="请选择"
                  clearable
                  @change="handleAccountChange"
                >
                  <el-option
                    v-for="dict in accountsList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>  -->
                <el-input placeholder="请输入" v-model="formData.account" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="类型" prop="type">
                <el-select class="dialogFormItemWidth" v-model="formData.type" placeholder="请选择" clearable
                  value-on-clear="" @change="handleTypeChange">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.DOUYIN_PROMOTION_TYPE, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务类型" prop="businessType">
                <el-select class="dialogFormItemWidth" v-model="formData.businessType" placeholder="请选择" clearable
                  value-on-clear="" multiple>
                  <el-option v-for="dict in getIntDictOptions(
                    DICT_TYPE.DOUYIN_PROMOTION_BUSINESS_TYPE,
                    true
                  )" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="开始日期" prop="beginDate">
                <el-date-picker class="dialogFormItemWidth" style="width: 100%" value-format="YYYY-MM-DD"
                  v-model="formData.beginDate" type="date" placeholder="请选择" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截止日期" prop="endDate">
                <el-date-picker class="dialogFormItemWidth" style="width: 100%" v-model="formData.endDate"
                  value-format="YYYY-MM-DD" type="date" placeholder="请选择" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="商品ID" prop="goodsId" :rules="isValidIds ? [{ required: true, message: '请输入商品ID', trigger: 'change' }] : []
                ">
                <el-input placeholder="请输入" v-model="formData.goodsId" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="直播间ID" prop="liveBroadcastId" :rules="isValidIds
                  ? [{ required: true, message: '请输入直播间ID', trigger: 'change' }]
                  : []
                ">
                <el-input placeholder="请输入" v-model="formData.liveBroadcastId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="来源平台" prop="orgType">
                <el-select class="!w300px" v-model="formData.orgType" placeholder="请选择" value-on-clear="" filterable>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ORG_TYPE, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账户类型" prop="accountType">
                <el-select class="!w300px" v-model="formData.accountType" placeholder="请选择" filterable>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.QC_ACCOUNT_TYPE, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 当类型选择标准直播推广的时候，标准直播间名称必填 -->
          <!-- <el-form-item
            label="标准直播间名称"
            prop="standardLiveRoomName"
            v-if="formData.type === '4'"
            :rules="
              formData.type === '4'
                ? [{ required: true, message: '请选择标准直播间名称', trigger: 'change' }]
                : []
            "
          >
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.standardLiveRoomName"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="dict in standardLiveRoomNames"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item> -->
          <!-- 当类型选择全域直播推广的时候，全域直播间名称必填 -->
          <!-- <el-form-item
            label="全域直播间名称"
            prop="universeLiveRoomName"
            v-if="formData.type === '5'"
            :rules="
              formData.type === '5'
                ? [{ required: true, message: '请选择全域直播间名称', trigger: 'change' }]
                : []
            "
          >
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.universeLiveRoomName"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="dict in universeLiveRoomNames"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item> -->
          <!-- 当类型选择财务流水的时候，财务流水必填 -->
          <!-- <el-form-item
            label="财务流水"
            prop="financialStatements"
            v-if="formData.type === '1'"
            :rules="
              formData.type === '1'
                ? [{ required: true, message: '请选择财务流水', trigger: 'change' }]
                : []
            "
          >
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.financialStatements"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="dict in financialStatements"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item> -->

          <el-form-item label="备注" prop="remark">
            <s-text-area :rows="5" class="dialogFormItemWidth" v-model="formData.remark" placeholder="请输入"
              resize="none" />
          </el-form-item>
        </el-form>
        <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
          <el-button @click="drawerVisible = false">取 消</el-button>
          <el-button :disabled="formLoading" type="primary" @click="submitForm">
            {{ formType === 'create' ? '提交' : '提交' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
defineOptions({ name: 'CostAllocationAddDrawer' })
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

import * as QcApi from '@/api/qianchuan'
import { nextTick } from 'vue'
import dayjs from 'dayjs'

const formData = ref({
  id: '',
  type: '', // 类型
  channel: '', // 渠道
  store: '', // 店铺
  account: '', // 千川账号
  // universeLiveRoomName: '', // 全域直播间名称
  // standardLiveRoomName: '', // 标准直播间名称
  // financialStatements: '', // 财务流水
  liveBroadcastId: '', // 直播间id
  goodsId: '', // 商品id
  remark: '', // 备注
  businessType: [] as any, // 业务类型
  actualConsumStore: '', // 实际消耗店铺
  beginDate: dayjs().format('YYYY-MM-DD'), // 开始日期
  endDate: dayjs('2099-01-01').format('YYYY-MM-DD'), // 截止日期
  orgType: "0",
  accountType: 'selfOwnedProductCardHolder'
})

const formRef = ref() // 表单 Ref

const formRules = reactive({
  channel: [{ required: true, message: '请选择渠道', trigger: 'change' }],
  store: [
    { required: true, message: '请选择店铺', trigger: ['change'] }
    // {
    //   validator: (rule: any, value: any, callback: any) => {
    //     if (value && value === formData.value.actualConsumStore) {
    //       callback(new Error('账单店铺不能与实际消耗店铺相同'))
    //     } else {
    //       callback()
    //     }
    //   }
    // }
  ],
  account: [{ required: true, message: '请输入千川账号', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  beginDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
  businessType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
  orgType: [{ required: true, message: '请选择来源平台', trigger: 'change' }],
  accountType: [{ required: true, message: '请选择账户类型', trigger: 'change' }]
})

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  dialogTitle.value =
    type === 'create' ? '新增' : type === 'update' ? '编辑' : type === 'view' ? '查看' : ''
  formType.value = type || ''
  //重置表单
  resetForm()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await QcApi.getQcAccountAssignById(id)
      if (data) {
        formData.value.accountType = '';
        Object.assign(formData.value, data)
        formData.value.businessType = formData.value.businessType.split(',')
        initData() // 初始化数据
      }
    } finally {
      formLoading.value = false
    }
  }
}

// 提交表单
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  await formRef.value.validate()

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any
    data.businessType = data.businessType.join(',')
    if (formType.value === 'create') {
      data.id = undefined
      await QcApi.addQcAccountAssign(data)
      message.success('新增成功')
    } else {
      await QcApi.updateQcAccountAssign(data)
      message.success('修改成功')
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    type: '', // 类型
    channel: '', // 渠道
    store: '', // 店铺
    account: '', // 千川账号
    // universeLiveRoomName: '', // 全域直播间名称
    // standardLiveRoomName: '', // 标准直播间名称
    // financialStatements: '', // 财务流水
    liveBroadcastId: '', // 直播间id
    goodsId: '', // 商品id
    businessType: [] as any, // 业务类型
    remark: '', // 备注
    actualConsumStore: '', // 实际消耗店铺
    beginDate: dayjs().format('YYYY-MM-DD'), // 开始日期
    endDate: dayjs('2099-01-01').format('YYYY-MM-DD'), // 截止日期
    orgType: "0",
    accountType: 'selfOwnedProductCardHolder'
  }

  billStoreList.value = [] // 清空账单店铺列表
  accountsList.value = [] // 清空千川账号列表
  storeList.value = [] // 清空实际消耗店铺列表
  financialStatements.value = [] // 清空财务流水列表
  universeLiveRoomNames.value = [] // 清空全域直播间名称列表
  standardLiveRoomNames.value = [] // 清空标准直播间名称列表

  nextTick(() => {
    formRef.value?.resetFields()
  })
}

// 初始化数据 -账单店铺列表，千川账号列表，实际消耗店铺列表，全域直播间名称列表，标准直播间名称列表，财务流水列表
const initData = async () => {
  // 获取实际消耗店铺列表
  getStoreList(formData.value.channel)
  // 获取账单店铺列表
  // await getQcAccountByChannel(formData.value.channel)

  // 获取千川账号列表
  await initAccountList()
  // 根据当前类型获取全域直播间名称、标准直播间名称和财务流水
  // initListByType()

  console.log('初始化数据', accountsList.value)
}

// 根据渠道获取账单店铺列表
const billStoreList = ref<any[]>([]) // 账单店铺列表
const getQcAccountByChannel = async (channel) => {
  const res = await QcApi.getQcAccountByChannel({ channel: channel })
  billStoreList.value = res || []
  storeList.value = res || []
}

// 根据渠道获取实际消耗店铺列表
const storeList = ref<any[]>([]) // 店铺列表
const getStoreList = async (channel) => {
  const res = await QcApi.getQcAccountStoreByChannel({ channelCode: channel })
  storeList.value = res || []
}

// 初始化千川账号列表
const accountsList = ref<any[]>([]) // 千川账号列表
const initAccountList = async () => {
  if (!formData.value.store) return // 如果没有选择店铺，则不进行后续操作
  const selectedStoreData = billStoreList.value.find((item) => item.store === formData.value.store)
  if (selectedStoreData && selectedStoreData.accounts && selectedStoreData.accounts.length > 0) {
    accountsList.value = selectedStoreData.accounts.map((account) => ({
      label: account,
      value: account
    }))
  }
}

// 初始化全域直播间名称、标准直播间名称和财务流水列表
const financialStatements = ref<any[]>([]) // 财务流水列表
const universeLiveRoomNames = ref<any[]>([]) // 全域直播间名称列表
const standardLiveRoomNames = ref<any[]>([]) // 标准直播间名称列表
const initListByType = async () => {
  if (!formData.value.type) return // 如果没有选择类型，则不进行后续操作
  const res = await QcApi.getQcAccountByChannelBillStoreAndAccount({
    channel: formData.value.channel,
    store: formData.value.store,
    account: formData.value.account
  })
  if (res) {
    universeLiveRoomNames.value =
      res.universeLiveRoomNames?.map((item) => ({ label: item, value: item })) || []
    standardLiveRoomNames.value =
      res.standardLiveRoomNames?.map((item) => ({ label: item, value: item })) || []
    financialStatements.value =
      res.financialStatements?.map((item) => ({ label: item, value: item })) || []
  }
}

// 渠道变化时
const handleChangeChannel = () => {
  formData.value.store = '' // 清空账单店铺
  billStoreList.value = [] // 清空账单店铺列表

  formData.value.account = '' // 清空千川账号
  accountsList.value = [] // 清空千川账号列表

  storeList.value = [] // 清空实际消耗店铺列表
  formData.value.actualConsumStore = '' // 清空实际消耗店铺

  formData.value.type = '' // 清空类型
  // 重置财务流水，全域直播间名称和标准直播间名称列表
  resetOtherData()

  if (!formData.value.channel) return // 如果没有选择渠道，则不进行后续操作
  getStoreList(formData.value.channel) // 根据渠道获取实际消耗店铺列表

  // 获取账单店铺列表
  // getQcAccountByChannel(formData.value.channel)
}

// 账单店铺变化时 获取店铺下面对应的千川账号列表
const handleBillStoreChange = () => {
  formData.value.account = '' // 清空千川账号
  accountsList.value = [] // 清空千川账号列表

  formData.value.type = '' // 清空类型
  // 重置财务流水，全域直播间名称和标准直播间名称列表
  resetOtherData()

  initAccountList() //初始化千川账号列表
}

// 千川账号变化
const handleAccountChange = () => {
  formData.value.type = '' // 清空类型
  // 重置财务流水，全域直播间名称和标准直播间名称列表
  resetOtherData()
}

// 类型变化时 根据渠道，店铺和千川账号获取对应的全域直播间名称、标准直播间名称和财务流水
// 类型 10,11,12,20 实际消耗店铺必填  类型 41，40商品id 直播间id 必填
const isValidActualConsumeStore = ref(false)
const isValidIds = ref(false)
const handleTypeChange = async (val: string) => {
  if (val === '10' || val === '11' || val === '12' || val === '20') {
    isValidActualConsumeStore.value = true
  } else {
    isValidActualConsumeStore.value = false
  }

  if (val === '40' || val === '41') {
    isValidIds.value = true
  } else {
    isValidIds.value = false
  }
  // 切换类型的时候，将直播间名称和财务流水清空
  // resetOtherData()

  // const channel = formData.value.channel
  // const store = formData.value.store
  // const account = formData.value.account
  // if (!channel || !store || !account) {
  //   message.warning('请先选择渠道、店铺和千川账号')
  //   formData.value.type = ''
  //   return
  // }
  // 请求接口
  // initListByType()
}

// 重置财务流水，全域直播间名称和标准直播间名称列表
const resetOtherData = () => {
  universeLiveRoomNames.value = [] // 清空全域直播间名称列表
  standardLiveRoomNames.value = [] // 清空标准直播间名称列表
  financialStatements.value = [] // 清空财务流水列表
  // formData.value.universeLiveRoomName = '' // 清空全域直播间名称
  // formData.value.standardLiveRoomName = '' // 清空标准直播间名称
  // formData.value.financialStatements = '' // 清空财务流水
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.drawerTitle {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 600;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 16px 20px 1px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;

  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

.dialogFormItemWidth {
  width: 100%;
}

:deep(.el-drawer__header) {
  margin-bottom: 0px;
}

:deep(.el-drawer__title) {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 500;
}

:deep(.el-drawer) {
  border-radius: 12px 0px 0px 0px;
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}
</style>
