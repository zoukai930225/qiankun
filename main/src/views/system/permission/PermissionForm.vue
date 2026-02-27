<template>
  <el-drawer v-model="dialogVisible" size="968" :with-header="false" :title="dialogTitle" @close="handleClose">
    <div class="drawer-wapper">
      <div>
        <div class="title"><span>{{ dialogTitle }}</span><img src="@/assets/imgs/common/close-drawer.png" alt=""
            class="close" @click="handleClose" /></div>
        <div class="form-wapper">
          <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="90px">
            <el-form-item label="权限名称" prop="name">
              <el-input class="dialogFormItemWidth" v-model="formData.name" placeholder="请输入权限名称" style="width: 100%" />
            </el-form-item>
            <el-form-item label="渠道:" prop="channel">
              <SelectChannels v-model="formData.channel" style="width: 100%;" />
            </el-form-item>

            <el-form-item label="权限类型:" prop="permissionType">
              <el-select class="dialogFormItemWidth" v-model="formData.permissionType" placeholder="请选择渠道" clearable
                style="width: 100%">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PERMISSION_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.label" />
              </el-select>
            </el-form-item>
            <!-- 分组 -->
            <el-form-item label="分组" prop="groupType">
              <el-select class="dialogFormItemWidth" v-model="formData.groupType" placeholder="请选择分组" clearable
                style="width: 100%">
                <el-option v-for="dict in groupList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item label="备注" prop="remark">
              <s-text-area class="dialogFormItemWidth" v-model="formData.remark" placeholder="请输入" style="width: 100%"
                :autosize="{ minRows: 4, maxRows: 5 }" />
            </el-form-item>
          </el-form>

          <div class="btn-wapper">
            <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>

  <!-- </Dialog> -->
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as PermissionApi from '@/api/system/permission'
// import { SelectChannels } from '@/components/SelectChannels/index'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

defineOptions({ name: 'SystemPermissionForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  name: '',
  channel: '',
  permissionType: undefined,
  remark: '',
  groupType: undefined // 分组类型
})
const groupList = ref([
  { label: '权限组', value: 0 },
  { label: '用户组', value: 1 }
])

const formRules = reactive({
  name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
  // channel: [{ required: true, message: '请选择渠道', trigger: 'blur' }],
  permissionType: [{ required: true, message: '请选择权限类型', trigger: 'blur' }],
  groupType: [{ required: true, message: '请选择分组', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await PermissionApi.getPermission(id)
      if (data) {
        formData.value = {
          id: data.id,
          name: data.name,
          channel: data.channel,
          permissionType: data.permissionType,
          remark: data.remark,
          groupType: data.groupType // 分组类型
        }
      }
    } finally {
      formLoading.value = false
    }
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    name: '',
    channel: '',
    permissionType: undefined,
    remark: '',
    groupType: undefined // 分组类型
  }
  formRef.value?.resetFields()
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
    const data = formData.value as unknown as PermissionApi.PermissionVO
    if (formType.value === 'create') {
      data.id = ''
      await PermissionApi.createOrUpdatePermisson(data)
      message.success(t('common.createSuccess'))
    } else {
      await PermissionApi.createOrUpdatePermisson(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.drawer-wapper {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 23px 22px 0 18px;
  box-sizing: border-box;

  .title {
    font-size: 14px;
    color: #333333;
    margin-bottom: 18px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .close {
      width: 21px;
      height: 24px;
      cursor: pointer;
    }
  }

  .form-wapper {
    // height: 168px;
    background: #ffffff;
    border-radius: 8px;
    padding: 16px 20px 20px 27px;
    box-sizing: border-box;

    .btn-wapper {
      padding-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

:global(.el-drawer__body) {
  padding: 0 !important;
  // background: rgba(0, 0, 0, 0.5);
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  height: 32px;
  background: #f8f8f9;
  border-radius: 4px;
  box-shadow: none;
}

:deep(.el-textarea__inner) {
  background: #f8f8f9;
  border-radius: 4px;
  box-shadow: none;
}

:global(.el-drawer__header) {
  // background: rgba(0, 0, 0, 0.5);
  // margin-bottom: 0;
  // padding: 0;
}
</style>
