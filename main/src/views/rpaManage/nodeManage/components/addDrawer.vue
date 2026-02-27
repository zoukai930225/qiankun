<template>
  <div v-if="drawerVisible">
    <el-drawer custom-class="addDrawer" v-model="drawerVisible" :title="dialogTitle" size="968">
      <div class="drawerContent">
        <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
          label-width="155px">
          <el-form-item label="节点类型" prop="type">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{
                getDictLabel(DICT_TYPE.YINGDAO_NOTE_TYPE, formData.type)
              }}</div>
            </div>
            <el-select v-else class="dialogFormItemWidth" v-model="formData.type" placeholder="请选择节点类型" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.YINGDAO_NOTE_TYPE, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="机器人名称" prop="robotClientName">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.robotClientName }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" :disabled="isBusinessNode" v-model="formData.robotClientName"
              placeholder="请输入机器人名称" />
          </el-form-item>
          <el-form-item label="机器人uuid" prop="robotClientUuid">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.robotClientUuid }}</div>
            </div>
            <el-input v-else :disabled="isBusinessNode" class="dialogFormItemWidth" v-model="formData.robotClientUuid"
              placeholder="请输入机器人uuid" />
          </el-form-item>

          <el-form-item label="机器人状态" prop="rebotStatus">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{
                getDictLabel(DICT_TYPE.YINGDAO_ROBOT_STATUS, formData.status)
              }}</div>
            </div>
            <el-select v-else :disabled="isBusinessNode" class="dialogFormItemWidth" v-model="formData.status"
              placeholder="请选择机器人状态" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.YINGDAO_ROBOT_STATUS, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="服务器名称" prop="machineName">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.machineName }}</div>
            </div>
            <el-input v-else :disabled="isBusinessNode" class="dialogFormItemWidth" v-model="formData.machineName"
              placeholder="请输入服务器名称" />
          </el-form-item>
          <el-form-item label="服务器IP" prop="clientIp">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.clientIp }}</div>
            </div>
            <el-input v-else :disabled="isBusinessNode" class="dialogFormItemWidth" v-model="formData.clientIp"
              placeholder="请输入服务器IP" />
          </el-form-item>
          <el-form-item label="服务器账号" prop="windowsUserName">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.windowsUserName }}</div>
            </div>
            <el-input v-else :disabled="isBusinessNode" class="dialogFormItemWidth" v-model="formData.windowsUserName"
              placeholder="请输入服务器账号" />
          </el-form-item>
          <el-form-item label="服务器密码" prop="windowsPassWord">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.windowsPassWord }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.windowsPassWord" placeholder="请输入服务器密码" />
          </el-form-item>
          <el-form-item label="影刀登录账号" prop="loginUserName">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.loginUserName }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.loginUserName" placeholder="请输入影刀登录账户" />
          </el-form-item>
          <el-form-item label="影刀登录密码" prop="loginPassWord">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.loginPassWord }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.loginPassWord" placeholder="请输入影刀登录密码" />
          </el-form-item>
          <el-form-item label="影刀用户名" prop="yingdaoUserName">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.yingdaoUserName }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.yingdaoUserName" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="节点简称" prop="nickName">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.nickName }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.nickName" placeholder="请输入节点简称" />
          </el-form-item>

          <el-form-item label="todesk账号" prop="todeskUserName">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.todeskUserName }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.todeskUserName" placeholder="请输入todesk账号" />
          </el-form-item>
          <el-form-item label="todesk密码" prop="todeskPassWord">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.todeskPassWord }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.todeskPassWord" placeholder="请输入todesk密码" />
          </el-form-item>
          <el-form-item label="迁移码" prop="migrationCode">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.migrationCode }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.migrationCode" placeholder="请输入迁移码" />
          </el-form-item>
          <!-- 统一登录应用UUID -->
          <el-form-item label="统一登录应用UUID" prop="yingyongUuid">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.yingyongUuid }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.yingyongUuid" placeholder="请输入统一登录应用UUID" />
          </el-form-item>
          <el-form-item label="影刀应用路径" prop="appsPath">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.appsPath }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.appsPath" placeholder="请输入影刀应用路径" />
          </el-form-item>
          <el-form-item label="机器人备注" prop="description">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.description }}</div>
            </div>
            <s-text-area v-else :disabled="isBusinessNode" :autosize="{ minRows: 3, maxRows: 4 }"
              class="dialogFormItemWidth" v-model="formData.description" placeholder="请输入机器人备注" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.remark }}</div>
            </div>
            <s-text-area v-else :autosize="{ minRows: 3, maxRows: 4 }" class="dialogFormItemWidth"
              v-model="formData.remark" placeholder="请输入备注" />
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
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

import * as NodeManageAccountApi from '@/api/rpaManage/nodeManage'
import { computed, nextTick } from 'vue'

const formData = ref({
  id: '',
  type: '',
  robotClientName: '',
  robotClientUuid: '',
  status: '',
  machineName: '',
  clientIp: '',
  windowsUserName: '',
  windowsPassWord: '',
  loginUserName: '',
  loginPassWord: '',
  yingdaoUserName: '',
  nickName: '',
  todeskUserName: '',
  todeskPassWord: '',
  migrationCode: '',
  appsPath: '',
  description: '',
  remark: '',
  yingyongUuid: '' // 统一登录应用UUID
})

// 是否企业节点
const isBusinessNode = computed(() => {
  return formData.value.type && Number(formData.value.type) === 1 ? true : false
})

const formRef = ref() // 表单 Ref

const formRules = reactive({
  type: [{ required: true, message: '请选择节点类型', trigger: 'blur' }],
  loginUserName: [{ required: true, message: '影刀登录账号不能为空', trigger: 'blur' }],
  todeskUserName: [{ required: true, message: 'todesk账号不能为空', trigger: 'blur' }],
  todeskPassWord: [{ required: true, message: 'todesk密码不能为空', trigger: 'blur' }],
  yingyongUuid: [{ required: true, message: '统一登录应用UUID不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (type?: string, id?: string) => {
  drawerVisible.value = false
  dialogTitle.value =
    type === 'create' ? '新增' : type === 'update' ? '编辑' : type === 'view' ? '查看' : ''
  formType.value = type || ''
  resetForm()
  nextTick(async () => {
    drawerVisible.value = true
    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        const data = await NodeManageAccountApi.getNodeManageDetail(id).catch(() => {
          formLoading.value = false
        })
        if (data) {
          formData.value = data
          formData.value.type = `${formData.value.type}`
        }
      } finally {
        formLoading.value = false
      }
    }
  })
}

const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any
    if (formType.value === 'create') {
      data.id = undefined
      await NodeManageAccountApi.saveNodeManage(data)
      message.success('新增成功')
    } else {
      await NodeManageAccountApi.updateNodeManage(data)
      message.success('修改')
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
    type: '',
    robotClientName: '',
    robotClientUuid: '',
    status: '',
    machineName: '',
    clientIp: '',
    windowsUserName: '',
    windowsPassWord: '',
    loginUserName: '',
    loginPassWord: '',
    yingdaoUserName: '',
    nickName: '',
    todeskUserName: '',
    todeskPassWord: '',
    migrationCode: '',
    appsPath: '',
    description: '',
    remark: '',
    yingyongUuid: '' // 统一登录应用UUID
  }
  formRef.value?.resetFields()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.drawerTitle {
  font-family: AlibabaPuHuiTi_2_75_SemiBold;
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

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  .seeBg {
    width: 100%;
    height: 32px;
    // background: url('@/assets/imgs/team/target_input_disable.png');
    background: #f8f8f9;
    border-radius: 4px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;

    &-text {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      padding-left: 16px;
      line-height: 32px;
    }
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

:deep(.el-drawer__body) {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

:deep(.el-input__wrapper) {
  background: transparent;
  border-radius: 4px;
  box-shadow: none;
}

:deep(.el-table .cell) {
  margin-left: 5px;
}

:deep(.el-table) {
  --el-table-row-hover-bg-color: transparent;
}
</style>
