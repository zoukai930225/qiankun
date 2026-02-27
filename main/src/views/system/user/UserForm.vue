<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      class="dialogForm"
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item v-if="formData.id === undefined" label="用户名" prop="userName">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.userName"
          autocomplete="new-password"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item v-if="formData.id === undefined" label="用户密码" prop="password">
        <el-input
          class="dialogFormItemWidth"
          autocomplete="new-password"
          v-model="formData.password"
          placeholder="请输入用户密码"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.realName"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.phone"
          maxlength="11"
          placeholder="请输入手机号码"
        />
      </el-form-item>
      <!-- 新增店铺信息 -->
      <el-form-item label="店铺" prop="store">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.store"
          placeholder="请选择店铺"
          clearable
          multiple
        >
          <el-option
            v-for="dict in storeList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.email"
          maxlength="50"
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item label="性别">
        <el-select class="dialogFormItemWidth" v-model="formData.sex" placeholder="请选择性别">
          <el-option
            v-for="dict in UserSexOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="岗位" prop="post">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.post"
          placeholder="请选择岗位"
          clearable
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_POST)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="departmentId">
        <el-cascader
          class="dialogFormItemWidth"
          v-model="formData.departmentId"
          :props="defaultProps"
          :options="deptList"
          clearable
        />
      </el-form-item>
      <el-form-item label="是否负责人" prop="isLeader">
        <el-radio-group v-model="formData.isLeader">
          <el-radio v-for="dict in CommonYesOrNoOptions" :key="dict.value" :label="dict.value">{{
            dict.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { UserSexOptions, CommonYesOrNoOptions } from '@/types/enumOptions'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import * as DeptApi from '@/api/system/dept'
import * as UserApi from '@/api/system/user'
import { FormRules } from 'element-plus'

defineOptions({ name: 'SystemUserForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userName: '',
  password: '',
  realName: '',
  phone: '',
  email: '',
  sex: undefined,
  post: '',
  departmentId: '',
  isLeader: 0,
  store: undefined
})
const formRules = reactive<FormRules>({
  userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }],
  realName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  email: [
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  phone: [
    {
      required: true,
      pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  post: [{ required: true, message: '请选择岗位', trigger: 'blur' }],
  store: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

const storeList = ref()
//获取全部店铺
const initStore = async () => {
  try {
    const res = await DeptApi.getAllStoreValue()
    storeList.value = (res || []).map((item) => {
      return {
        value: item.code,
        label: item.name
      }
    })
  } catch (error) {
    console.log(error)
  }
}

// as PostApi.PostVO[]
/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  getDeptList()
  initStore()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await UserApi.getUser(id)
      if (formData.value.store) {
        // @ts-ignore
        formData.value.store = formData.value.store.split(',')
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const deptList = ref<DeptApi.DeptVO[]>([]) // 部门数据源
const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}
const getDeptList = async () => {
  const data = await DeptApi.getDeptPage()
  deptList.value = data || []
}

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
    if (formData.value.store) {
      console.log(formData.value.store, 'formData.value.store')
      // @ts-ignore
      formData.value.store = formData.value.store.join()
    }
    const data = formData.value as unknown as UserApi.UserVO
    if (formType.value === 'create') {
      data.id = undefined
      await UserApi.createOrUpdateUser(data)
      message.success(t('common.createSuccess'))
    } else {
      await UserApi.createOrUpdateUser(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    userName: '',
    password: '',
    realName: '',
    phone: '',
    email: '',
    sex: undefined,
    post: '',
    departmentId: '',
    isLeader: 0,
    store: undefined
  }
  formRef.value?.resetFields()
}
</script>
