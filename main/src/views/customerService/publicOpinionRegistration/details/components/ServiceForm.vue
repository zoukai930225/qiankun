<!--
 * @Description: 客服处理表单组件
-->
<template>
  <div class="pr-form-wrapper">
    <div class="form-section-title">客服处理</div>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      inline
      label-width="80px"
      class="opinion-form"
    >
      <el-form-item label="是否回评" prop="sfReply">
        <el-select v-model="formData.sfReply" placeholder="请选择" clearable :disabled="disabled">
          <el-option
            v-for="item in YES_NO_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否删除" prop="sfDeleted">
        <el-select
          v-model="formData.sfDeleted"
          @change="handleSfDeletedChange"
          placeholder="请选择"
          clearable
          :disabled="disabled"
        >
          <el-option
            v-for="item in YES_NO_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="删除人" prop="deleter">
        <SelectUser
          v-model="formData.deleter"
          :multiple="false"
          :role="followUpStaffRoleId"
          placeholder="请选择删除人"
          :disabled="disabled"
          :needUserInfo="true"
          :showAvatarLable="true"
          :autoLoadOnInit="true"
          @change="handleDeleterChange"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态" :disabled="statusDisabled">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="statusOptionsDisabled(item.value)"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="最终方案" prop="finalSolution" class="full-width-item">
        <el-input
          v-model="formData.finalSolution"
          type="textarea"
          placeholder="请输入最终方案"
          maxlength="500"
          show-word-limit
          :rows="3"
          :disabled="disabled"
        />
      </el-form-item>

      <el-form-item label="备注" prop="customerServiceRemark" class="full-width-item">
        <el-input
          v-model="formData.customerServiceRemark"
          type="textarea"
          placeholder="请输入备注"
          maxlength="300"
          show-word-limit
          :rows="3"
          :disabled="disabled"
        />
      </el-form-item>

      <el-form-item label="反馈截图" prop="feedbackScreenshot" class="full-width-item">
        <UploadTransfer
          v-model="formData.feedbackScreenshot"
          :limit="5"
          accept-type="image"
          :disabled="disabled"
          :upload-data="{ code: 'PUBLIC_OPINION_SERVICE' }"
          value-type="string"
          tip="支持上传图片，单个文件不超过20M，最多5张"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="tsx" setup>
import { YES_NO_OPTIONS, type DataItem } from '../../page/config'
import UploadTransfer from '@/components/common/upload/transfer.vue'
import SelectUser from '@/components/common/user/selectUser.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
const { dictDataList } = inject('PublicOpinionRegistrationForm') as {
  dictDataList: Ref<Record<string, any[]>>
}
const { viewType } = inject('PublicOpinionRegistrationDetails') as {
  viewType: Ref<string>
}
interface Props {
  modelValue: DataItem
  disabled?: boolean
  statusDisabled?: boolean // 状态字段是否禁用（公关处理时可编辑）
  roleList?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  statusDisabled: false,
  roleList: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: DataItem]
}>()

const formRef = ref<FormInstance>()
const user: any = useUserStore().user || {}

const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 获取角色ID
const getRole = (name: string) => {
  const tar: any = props.roleList?.find((rs: any) => rs.name === name)
  return tar?.id || ''
}
const followUpStaffRoleId = computed(() => getRole('客诉请求'))
// 状态选项
const statusOptions = computed(() => dictDataList.value['pi_status'] || [])

// 表单验证规则
const rules = computed<FormRules>(() => ({
  sfReply: [{ required: true, message: '请选择是否回评', trigger: 'change' }],
  sfDeleted: [{ required: true, message: '请选择是否删除', trigger: 'change' }],
  deleter: [
    { required: formData.value.sfDeleted == 1, message: '请选择删除人', trigger: 'change' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  feedbackScreenshot: [{ required: true, message: '请上传反馈截图', trigger: 'change' }]
}))

// 初始化删除人为当前登录用户
watch(
  () => formData.value.deleter,
  (val, oldVal) => {
    console.log(viewType, 'viewType.value')
    if (!val && !oldVal && user.userNo && viewType.value === 'service') {
      setTimeout(() => {
        formData.value.deleter = user.userNo
        // 同时初始化 deleterInfo
        formData.value.deleterInfo = {
          userId: user.userNo,
          realName: user.realName,
          avatarOrigin: user.avatarUrl
        }
      }, 100)
    }
  },
  { immediate: true }
)

const handleDeleterChange = (val: any) => {
  formData.value.deleterInfo = val
}

const statusOptionsDisabled = (value: any) => {
  return value === '01' && ['service', 'pr'].includes(viewType.value)
}

const handleSfDeletedChange = (val: any) => {
  if (val === 0) {
    formData.value.deleter = ''
    formData.value.deleterInfo = null
    formData.value.deleteTime = ''
  }
}

// 暴露验证方法
const validate = async (): Promise<boolean> => {
  if (!formRef?.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

// 清除验证
const clearValidate = () => {
  formRef?.value?.clearValidate()
}

defineExpose({ validate, clearValidate })
</script>

<style lang="scss" scoped>
@use '../styles.scss';
</style>
