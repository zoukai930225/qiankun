<template>
  <div>
    <el-drawer custom-class="addDrawer" v-model="drawerVisible" :title="dialogTitle" size="568">
      <div class="drawerContent">
        <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
          label-width="135px">
          <el-form-item label="渠道" prop="channel">
            <el-select class="dialogFormItemWidth" v-model="formData.channel" placeholder="请选择" clearable filterable
              @change="handleChangeChannel">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺" prop="store">
            <el-select v-model="formData.store" clearable filterable value-on-clear="" class="dialogFormItemWidth">
              <el-option v-for="item in storeList" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="千川账号" prop="account">
            <el-input class="dialogFormItemWidth" v-model="formData.account" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="标准直播间名称" prop="standardLiveRoomName">
            <el-input class="dialogFormItemWidth" v-model="formData.standardLiveRoomName" placeholder="如有多个请以逗号隔开" />
          </el-form-item>

          <el-form-item label="全域直播间名称" prop="universeLiveRoomName">
            <el-input class="dialogFormItemWidth" v-model="formData.universeLiveRoomName" placeholder="如有多个请以逗号隔开" />
          </el-form-item>
          <el-form-item label="财务流水" prop="financialStatements">
            <el-input class="dialogFormItemWidth" v-model="formData.financialStatements" placeholder="如有多个请以逗号隔开" />
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <s-text-area :rows="5" class="dialogFormItemWidth" v-model="formData.remark" placeholder="请输入"
              resize="none" />
          </el-form-item>
        </el-form>
        <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
          <el-button @click="drawerVisible = false">取 消</el-button>
          <el-button :disabled="formLoading" type="primary" @click="submitForm"> 提交</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
defineOptions({ name: 'AccountManageAddDrawer' })
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

import * as QcApi from '@/api/qianchuan'
import { nextTick } from 'vue'

const formData = ref({
  id: '',
  channel: '', // 渠道
  store: '', // 店铺
  account: '', // 千川账号
  universeLiveRoomName: '', // 全域直播间名称
  standardLiveRoomName: '', // 标准直播间名称
  financialStatements: '', // 财务流水
  remark: '' // 备注
})

const formRef = ref() // 表单 Ref

const formRules = reactive({
  channel: [{ required: true, message: '请选择渠道', trigger: 'change' }],
  store: [{ required: true, message: '请选择店铺', trigger: ['change'] }],
  account: [{ required: true, message: '请输入千川账号', trigger: 'change' }]
})

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  dialogTitle.value =
    type === 'create' ? '新增' : type === 'update' ? '编辑' : type === 'view' ? '查看' : ''
  formType.value = type || ''
  resetForm()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await QcApi.getQcAccountById(id)
      if (data) {
        Object.assign(formData.value, data)
        // 初始化店铺列表
        initStoreList()
      }
    } finally {
      formLoading.value = false
    }
  }
}

// 根据渠道获取店铺列表
const storeList = ref<any>([]) // 店铺列表
const getStoreList = async (channel) => {
  const res = await QcApi.getQcAccountStoreByChannel({ channelCode: channel })
  storeList.value = res || []
}
// 初始化店铺列表
const initStoreList = () => {
  storeList.value = []
  if (!formData.value.channel) return
  getStoreList(formData.value.channel)
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
    if (formType.value === 'create') {
      data.id = undefined
      await QcApi.addQcAccount(data)
      message.success('新增成功')
    } else {
      await QcApi.addQcAccount(data)
      message.success('修改成功')
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

// 渠道变化时的处理
const handleChangeChannel = () => {
  formData.value.store = '' // 清空店铺
  initStoreList() //获取店铺列表
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    channel: '', // 渠道
    store: '', // 店铺
    account: '', // 千川账号
    universeLiveRoomName: '', // 全域直播间名称
    standardLiveRoomName: '', // 标准直播间名称
    financialStatements: '', // 财务流水
    remark: '' // 备注
  }
  storeList.value = [] // 清空店铺列表
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
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

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
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

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
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
