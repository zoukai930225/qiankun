<template>
  <Dialog v-model="dialogVisible" title="分配权限">
    <el-form
      ref="formRef"
      class="dialogForm"
      v-loading="formLoading"
      :model="formData"
      label-width="80px"
    >
      <el-form-item label="账号">
        <el-input class="dialogFormItemWidth" v-model="formData.userName" :disabled="true" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input class="dialogFormItemWidth" v-model="formData.realName" :disabled="true" />
      </el-form-item>
      <el-form-item label="权限">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.permissionIds"
          multiple
          placeholder="请选择权限"
        >
          <el-option
            v-for="item in permissionList"
            :key="item.id"
            :label="showPermissionName(item)"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as PermissionApi from '@/api/system/permission'
import * as UserApi from '@/api/system/user'

defineOptions({ name: 'SystemUserAssignRoleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: '',
  userName: '',
  realName: '',
  permissionIds: []
})
const formRef = ref() // 表单 Ref
const permissionList = ref([] as PermissionApi.PermissionVO[]) // 权限的列表

/** 打开弹窗 */
const open = async (row: UserApi.UserVO) => {
  dialogVisible.value = true
  resetForm()
  // 设置数据
  formData.value.id = row.id as string
  formData.value.userName = row.username
  formData.value.realName = row.realName
  formLoading.value = true
  // 获得权限列表
  await getPermissionList()
  try {
    const data = await UserApi.getUser(formData.value.id)
    if (data) {
      formData.value.permissionIds = data.permissionIds || []
    }
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 显示权限名称 */
const showPermissionName = (item) => {
  if (item.channel === 'ALL') {
    return `${item.name}-全部渠道`
  } else {
    if (item.channelName) {
      return `${item.name}-${item.channelName}`
    } else {
      return `${item.name}`
    }
  }
}

/** 查询权限列表 */
const getPermissionList = async () => {
  const data = await PermissionApi.getPermissionPage({ page: 1, size: 999999 }).catch(() => {})
  if (data) {
    permissionList.value = data.data || []
  }
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
    await UserApi.userPermissionSave({
      id: formData.value.id,
      ids: formData.value.permissionIds
    })
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success', true)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    userName: '',
    realName: '',
    permissionIds: []
  }
  formRef.value?.resetFields()
}
</script>
