<!--
 * @Description: 舆情登记信息表单组件
-->
<template>
  <div class="pr-form-wrapper">
    <div class="form-section-title">登记信息</div>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      inline
      label-width="80px"
      class="opinion-form"
    >
      <el-form-item label="风险程度" prop="riskLevel">
        <el-select
          v-model="formData.riskLevel"
          placeholder="请选择风险程度"
          clearable
          :disabled="disabled"
        >
          <el-option
            v-for="item in riskLevelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布平台" prop="publishPlatform">
        <el-select
          v-model="formData.publishPlatform"
          placeholder="请选择发布平台"
          clearable
          :disabled="disabled"
        >
          <el-option
            v-for="item in publishPlatformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="发布类型" prop="publishType">
        <el-select
          v-model="formData.publishType"
          placeholder="请选择发布类型"
          clearable
          :disabled="disabled"
        >
          <el-option
            v-for="item in publishTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="发布日期" prop="publishDate">
        <el-date-picker
          v-model="formData.publishDate"
          type="date"
          placeholder="请选择发布日期"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="产品类别" prop="productCategory">
        <el-select
          v-model="formData.productCategory"
          placeholder="请选择产品类别"
          clearable
          :disabled="disabled"
        >
          <el-option
            v-for="item in productTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品编码" prop="productCode">
        <GoodCode
          url="/api/wdtSpec/listSpecNo"
          v-model="formData.productCode"
          placeholder="请输入产品编码"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNumber">
        <el-input
          v-model="formData.orderNumber"
          placeholder="请输入订单号"
          maxlength="50"
          show-word-limit
          :disabled="disabled"
        />
      </el-form-item>

      <el-form-item label="种草达人" prop="grassInfluencer">
        <el-input
          v-model="formData.grassInfluencer"
          placeholder="请输入种草达人"
          maxlength="50"
          show-word-limit
          :disabled="disabled"
        />
      </el-form-item>

      <el-form-item label="发帖ID昵称" prop="postIdNickname">
        <el-input
          v-model="formData.postIdNickname"
          placeholder="请输入发帖ID昵称"
          maxlength="50"
          show-word-limit
          :disabled="disabled"
        >
        </el-input>
        <template #label>
          <span class="label-text">发帖ID<br />昵称</span>
        </template>
      </el-form-item>

      <el-form-item label="主评ID昵称" prop="mainCommentIdNickname">
        <el-input
          v-model="formData.mainCommentIdNickname"
          placeholder="请输入主评ID昵称"
          maxlength="50"
          show-word-limit
          :disabled="disabled"
        />
        <template #label>
          <span class="label-text">主评ID<br />昵称</span>
        </template>
      </el-form-item>

      <el-form-item label="舆情类型" prop="opinionTypeArr">
        <el-cascader
          v-model="formData.opinionTypeArr"
          :options="OPINION_TYPE_OPTIONS as any"
          :props="{
            label: 'label',
            value: 'value',
            children: 'children',
            checkStrictly: false
          }"
          separator=">"
          placeholder="请选择舆情类型"
          clearable
          :disabled="disabled"
        />
      </el-form-item>

      <el-form-item label="跟进客服" prop="followUpCustomerId">
        <SelectUser
          v-model:value="formData.followUpCustomerId"
          :role="followUpStaffRoleId"
          :multiple="true"
          placeholder="请选择跟进客服"
          :disabled="disabled"
          :needUserInfo="true"
          :showAvatarLable="true"
          :autoLoadOnInit="true"
          @change="handleFollowUpCustomerIdChange"
        />
      </el-form-item>

      <el-form-item label="舆情公关" prop="publicOpinionPr">
        <SelectUser
          v-model:value="formData.publicOpinionPr"
          :role="prManagerRoleId"
          :multiple="false"
          placeholder="请选择舆情公关"
          :disabled="disabled"
          :needUserInfo="true"
          :showAvatarLable="true"
          :autoLoadOnInit="true"
          :autoSelectFirst="true"
          @change="handlePublicOpinionPrChange"
        />
      </el-form-item>

      <el-form-item label="原文链接" prop="originalLink" class="full-width-item">
        <el-input
          v-model="formData.originalLink"
          type="textarea"
          placeholder="请输入原文链接"
          maxlength="500"
          show-word-limit
          :rows="4"
          :disabled="disabled"
        />
      </el-form-item>

      <el-form-item label="原文内容" prop="originalContent" class="full-width-item">
        <el-input
          v-model="formData.originalContent"
          type="textarea"
          placeholder="请输入原文内容"
          maxlength="500"
          show-word-limit
          :rows="5"
          :disabled="disabled"
        />
      </el-form-item>

      <el-form-item label="图片" prop="picture" class="full-width-item">
        <UploadTransfer
          v-model="formData.picture"
          :limit="5"
          accept-type="image"
          :disabled="disabled"
          :upload-data="{ code: 'PUBLIC_OPINION' }"
          value-type="string"
          tip="支持上传图片，单个文件不超过20M，最多5张"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="tsx" setup>
import { type DataItem } from '../../page/config'
import { OPINION_TYPE_OPTIONS } from '../../data/opinionTypes'
import UploadTransfer from '@/components/common/upload/transfer.vue'
import SelectUser from '@/components/common/user/selectUser.vue'
import type { FormInstance, FormRules } from 'element-plus'
import GoodCode from '@/components/template/query/components/goodCode.vue'
interface Props {
  modelValue: DataItem
  disabled?: boolean
  roleList?: any[]
}
const { dictDataList } = inject('PublicOpinionRegistrationForm') as {
  dictDataList: Ref<Record<string, any[]>>
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  roleList: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: DataItem]
}>()

const formRef = ref<FormInstance>()

const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const publishPlatformOptions = computed(() => dictDataList.value['pi_publishing_platform'] || [])
const publishTypeOptions = computed(() => dictDataList.value['pi_publishing_type'] || [])
const productTypeOptions = computed(() => dictDataList.value['pi_product_type'] || [])
const riskLevelOptions = computed(() => dictDataList.value['pi_risk_level'] || [])
// 获取角色ID
const getRole = (name: string) => {
  const tar: any = props.roleList?.find((rs: any) => rs.name === name)
  return tar?.id || ''
}

// 跟进客服角色ID
const followUpStaffRoleId = computed(() => getRole('客诉请求'))
// 舆情公关角色ID
const prManagerRoleId = computed(() => getRole('舆情公关'))

// 舆情公关单选转换
// const prManagerModel = computed({
//   get: () => (formData.value.prManagerId ? [formData.value.prManagerId] : []),
//   set: (val: string[]) => {
//     formData.value.prManagerId = val?.[0] || ''
//   }
// })

// 表单验证规则
const rules = computed<FormRules>(() => ({
  riskLevel: [{ required: true, message: '请选择风险程度', trigger: 'change' }],
  publishPlatform: [{ required: true, message: '请选择发布平台', trigger: 'change' }],
  publishType: [{ required: true, message: '请选择发布类型', trigger: 'change' }],
  publishDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
  productCategory: [{ required: true, message: '请选择产品类别', trigger: 'change' }],
  postIdNickname: [{ required: true, message: '请输入发帖ID昵称', trigger: 'blur' }],
  // mainCommentIdNickname: [{ required: true, message: '请输入主评ID昵称', trigger: 'blur' }],
  opinionTypeArr: [{ required: true, message: '请选择舆情类型', trigger: 'change' }],
  followUpCustomerId: [
    { required: true, type: 'array', min: 1, message: '请选择跟进客服', trigger: 'change' }
  ],
  publicOpinionPr: [{ required: true, message: '请选择舆情公关', trigger: 'change' }],
  originalLink: [{ required: true, message: '请输入原文链接', trigger: 'blur' }],
  originalContent: [{ required: true, message: '请输入原文内容', trigger: 'blur' }],
  picture: [{ required: true, message: '请上传图片', trigger: 'change' }]
}))

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

const handleFollowUpCustomerIdChange = (val: any) => {
  formData.value.followUpCustomerInfo = val
}
const handlePublicOpinionPrChange = (val: any) => {
  formData.value.publicOpinionPrInfo = val
}
</script>

<style lang="scss" scoped>
@use '../styles.scss';
.registration-form-wrapper {
}
.label-text {
  line-height: 16px;
}
</style>
