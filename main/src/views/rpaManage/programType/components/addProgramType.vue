<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer" :size="968">
      <div>
        <div class="drawerTitle">
          {{ drawerTitle }}
          <img src="@/assets/imgs/dashboard/programGroup/close1.png" alt="" @click="drawerVisible = false" />
        </div>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="基本信息" name="first">
          <div class="drawerContent basicInfo">
            <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
              label-width="95px">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="名称" prop="typeName">
                    <el-input class="dialogFormItemWidth" v-model="formData.typeName" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="编码" prop="typeCode">
                    <el-input class="dialogFormItemWidth" v-model="formData.typeCode" placeholder="请输入" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="类别" prop="typeCategory">
                    <el-select class="dialogFormItemWidth" v-model="formData.typeCategory" placeholder="请选择" clearable>
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.APPLICATION_TYPE, true)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="数据库表" prop="typeDbName">
                    <el-input class="dialogFormItemWidth" v-model="formData.typeDbName" placeholder="请输入" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="业务场景" prop="businessScenario">
                    <el-select class="dialogFormItemWidth" v-model="formData.businessScenario" placeholder="请选择"
                      clearable @clear="hanleClear('businessScenario')">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.RPA_PROGRAM_TYPE, true)" :key="dict.value"
                        :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="渠道" prop="channel">
                    <el-select class="dialogFormItemWidth" v-model="formData.channel" placeholder="请选择" clearable>
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)"
                        :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="应用UUID" prop="yingyongUuid">
                    <el-input class="dialogFormItemWidth" v-model="formData.yingyongUuid" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="RPA负责人" prop="rpaPersonInCharge" :required="formData.typeCategory === 'RPA'"
                    :rules="[{ required: true, message: '请选择RPA负责人', trigger: 'change' }]">
                    <el-select class="dialogFormItemWidth" v-model="formData.rpaPersonInCharge" placeholder="请选择"
                      clearable>
                      <el-option v-for="dict in userList" :key="dict.id" :label="dict.realName" :value="dict.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="后端负责人" prop="hdPersonInCharge">
                    <el-select class="dialogFormItemWidth" v-model="formData.hdPersonInCharge" placeholder="请选择"
                      clearable @clear="hanleClear('hdPersonInCharge')">
                      <el-option v-for="dict in userList" :key="dict.id" :label="dict.realName" :value="dict.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="DTS类名" prop="dtsName">
                    <el-input class="dialogFormItemWidth" v-model="formData.dtsName" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="优先级" prop="priority">
                    <el-select class="dialogFormItemWidth" v-model="formData.priority" placeholder="请选择" clearable
                      @clear="hanleClear('priority')">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PRIORITY, true)"
                        :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item label="数据源文档" prop="docUrl">
                    <el-input v-model="formData.docUrl" placeholder="" class="dialogFormItemWidth docUrl"
                      @click="openDataDocUrl(formData.docUrl)" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- <el-form-item label="执行时间" prop="executionTime">
                   
                    <el-input
                      class="dialogFormItemWidth"
                      v-model.trim="formData.executionTime"
                      placeholder="请输入"
                    />
                  </el-form-item> -->
                </el-col>
              </el-row>
              <el-form-item label="备注" prop="remark">
                <Editor height="200px" v-model:modelValue="formData.remark" :key="formData.id" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="店铺管理" name="second" v-if="formType !== 'create'">
          <div class="drawerContent" style="padding: 20px 30px 0">
            <storeManage ref="storeManageRef" :typeId="typeId" />
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="drawerFooter" v-if="activeName === 'first'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddProgramType' })
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as rpaProgramTypeApi from '@/api/rpaManage/programType'
import storeManage from './storeMng/index.vue'
import * as rpaApi from '@/api/rpaManage'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const typeId = ref('') // 类型ID
const activeName = ref('first') // 默认显示基础信息

const formData = ref({
  id: '',
  typeCode: '', // 编码
  typeName: '', // 名称
  oldTypeName: '', // 名称原始值
  typeCategory: '', // 类别
  typeDbName: '', // 数据库表
  businessScenario: '', // 业务场景
  docUrl: '', // 数据源文档
  channel: '', // 渠道
  rpaPersonInCharge: '', // 负责人
  hdPersonInCharge: '', // 后端负责人
  dtsName: '', // DTS类名
  priority: '', // 优先级
  executionTime: '', // 执行时间
  remark: '', // 备注
  yingyongUuid: '' // 应用UUID
})

const hanleClear = (prop: string) => {
  formData.value[prop] = ''
}
const formRules = reactive({
  typeCode: [{ required: true, message: '请输入编码', trigger: 'blur', whitespace: true }],
  typeName: [{ required: true, message: '请输入名称', trigger: 'blur', whitespace: true }],
  typeCategory: [{ required: true, message: '请选择类别', trigger: 'change' }],
  channel: [{ required: true, message: '请选择渠道', trigger: 'change' }]
})

const formRef = ref() // 表单 Ref
const storeManageRef = ref() // 店铺管理 Ref
/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  console.log('---', type, id)
  drawerVisible.value = true
  drawerTitle.value =
    type === 'create' ? '新增' : type === 'update' ? '编辑' : type === 'view' ? '查看' : ''
  formType.value = type
  activeName.value = 'first'
  resetForm()
  if (storeManageRef.value) {
    storeManageRef.value.clearViewConfigId()
  }
  getUserList()
  // 修改时，设置数据
  if (id) {
    typeId.value = id
    formLoading.value = true
    try {
      const data = await rpaProgramTypeApi.getProgramType({ id: id })
      Object.assign(formData.value, data)
      formData.value.oldTypeName = data.typeName
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = { ...formData.value }

    if (formType.value === 'create') {
      data.id = undefined
      await rpaProgramTypeApi.saveProgramType(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await rpaProgramTypeApi.updateProgramType(data)
      message.success(t('common.updateSuccess'))
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
    typeCode: '', // 编码
    typeName: '', // 名称
    oldTypeName: '', // 名称原始值
    typeCategory: '', // 类别
    typeDbName: '', // 数据库表
    businessScenario: '', // 业务场景
    docUrl: '', // 数据源文档
    channel: '', // 渠道
    rpaPersonInCharge: '', // 负责人
    hdPersonInCharge: '', // 后端负责人
    dtsName: '', // DTS类名
    priority: '', // 优先级
    executionTime: '', // 执行时间
    remark: '', // 备注
    yingyongUuid: '' // 应用UUID
  }
  formRef.value?.resetFields()
}

// 查询负责人
interface User {
  label: string
  value: string
}
const userList = ref<User[]>([])
const getUserList = async () => {
  let data = await rpaApi.getUserList({ page: 1, size: 99999 })
  userList.value = data?.data
}

// 打开数据文档
const openDataDocUrl = (docUrl) => {
  if (!docUrl) return
  window.open(docUrl, '_blank')
}
</script>

<style lang="scss" scoped>
// 隐藏el-tabs的底部线
:deep(.el-tabs__nav-wrap:after) {
  content: '';
  background-color: transparent;
}

// 修改备注的文本框背景
:deep(.basicInfo) {

  .el-textarea__inner,
  .el-input__wrapper,
  .el-select__wrapper {
    background-color: #f8f8f9 !important;
    box-shadow: none !important;
  }
}

:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawerTitle {
  font-family: AlibabaPuHuiTi_2_75_SemiBold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 600;
  margin: 0 0 18px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;

  &-title {
    margin: 0 0 18px 25px;
    display: flex;
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

// 点击跳转
:deep(.docUrl .el-input__inner) {
  color: #0064ff;
  cursor: pointer;
  text-decoration: underline;
}
</style>
