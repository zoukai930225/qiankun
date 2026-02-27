<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer" size="968">
      <div>
        <div class="drawerTitle">
          <div>{{ drawerTitle }}</div>
          <div @click="drawerVisible = false"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="80px">
        <div class="drawerContent">
          <el-form-item label="人员:" prop="userList" required>
            <selectPeople v-model:modelValue="formData.userList" :getSearchList="remoteMethod" @change="handleChange" />
          </el-form-item>
          <el-form-item label="手机号:" prop="mobile" v-if="formData.mobile">
            <el-input class="dialogFormItemWidth" v-model="formData.mobile" placeholder="请输入" style="width: 100%"
              :readonly="true" />
          </el-form-item>
          <el-form-item label="加分值:" prop="addValue" required>
            <el-input class="dialogFormItemWidth" v-model="formData.addValue" type="number" :min="0"
              oninput="if(value.length > 10 || (value.indexOf('.') != -1 && value.slice(value.indexOf('.')).length > 3)) value = value.slice(0, value.length - 1)"
              placeholder="请输入" style="width: 100%" />
          </el-form-item>

          <!-- 备注 -->
          <el-form-item label="备注:" prop="remark">
            <s-text-area class="dialogFormItemWidth" v-model="formData.remark" placeholder="请输入" style="width: 100%"
              :autosize="{ minRows: 4, maxRows: 5 }" />
          </el-form-item>
        </div>
      </el-form>

      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>

defineOptions({ name: 'AddForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import STextArea from "@/components/common/input/s-textarea.vue";
import selectPeople from './selectPeople.vue'
import * as BonusPointApi from '@/api/otr/bonusPoint'
import { useAppStore } from '@/store/modules/app'
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref
const formData = ref({
  id: undefined,
  inventoryId: '', //活动id
  mobile: '', //手机号
  personName: '', //姓名
  employeeNo: '', //工号
  departmentId: '', //部门id
  departmentName: '', //部门名称
  addValue: '', //加分值
  remark: '', //备注
  userList: []
})
const checkPositiveNumber = (rule, value, callback) => {
  if (value <= 0) {
    callback(new Error('加分值必须大于0'))
  } else {
    callback()
  }
}
// 校验规则
const formRules = reactive({
  userList: [{ required: true, message: '请选择人员', trigger: 'change' }],
  addValue: [
    { required: true, message: '请输入加分值', trigger: 'change' },
    { validator: checkPositiveNumber, trigger: 'change' }
  ]
})

/** 打开弹窗 */
const open = async (type: string, inventoryId, id?: string) => {
  drawerVisible.value = true
  drawerTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  formData.value.inventoryId = inventoryId
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
    const data = {
      ...formData.value,
      personRosterId: formData.value.userList
    }
    // console.log('提交的数据：', data)
    if (formType.value === 'create') {
      data.id = undefined
      await BonusPointApi.addBonusPoint(data)
      message.success(t('common.createSuccess'))
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
  formRef.value?.resetFields()
  formData.value = {
    id: undefined,
    inventoryId: '', //活动id
    mobile: '', //手机号
    personName: '', //姓名
    employeeNo: '', //工号
    addValue: '', //加分值
    remark: '', //备注
    userList: [],
    departmentId: '', //部门id
    departmentName: '' //部门名称
  }
}

// 获取设计师列表
const remoteMethod = async (value) => {
  // console.log('调取接口')
  return await BonusPointApi.getDesignerList(value)
}

const handleChange = (data) => {
  console.log('选择', data)
  formData.value.mobile = data.mobile
  formData.value.employeeNo = data.employeeNo
  formData.value.personName = data.name
  formData.value.departmentId = data.departmentId
  formData.value.departmentName = data.departmentName
}
</script>

<style>
/* 隐藏 el-date-picker 的图标 */
.activitySet-icon-disabled .el-input__prefix-inner {
  display: none;
}
</style>
<style lang="scss" scoped>
// 修改多选框的背景色
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #bfc9d266;
  border-radius: 15px;
}

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 修改弹窗的标题样式
.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
