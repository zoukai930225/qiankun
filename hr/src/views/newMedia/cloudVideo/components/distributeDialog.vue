<template>
  <SWDialog
    v-model="drawerVisible"
    title="分配"
    @closed="reset"
    show-title-line
    show-bottom-line
    :beforeClose="beforeClose"
    width="524px"
  >
    <el-form
      :model="formParams"
      label-width="55px"
      :rules="fromRules"
      ref="formRef"
      v-loding="drawerLoading"
      style="margin-top: 20px"
    >
      <el-form-item label="内容id" prop="contentId">
        <el-input v-model.trim="formParams.contentId" class="form-width" :disabled="true" />
      </el-form-item>
      <el-form-item label="渠道" prop="channel">
        <el-select
          style="width: 100%"
          v-model="formParams.channel"
          placeholder="请选择"
          :disabled="true"
        >
          <el-option
            v-for="dict in channelList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="编导" prop="directorId">
        <SelectUser
          v-model="formParams.directorId"
          :role="getRole('编导')"
          :multiple="false"
          ref="directorRef"
          :feedBackOptions="directorFeedbackOptions"
          :extra-options="otherOption"
          :showAvatarLable="true"
        />
      </el-form-item>
      <el-form-item label="剪辑" prop="editId">
        <SelectUser
          v-model="formParams.editId"
          :role="getRole('剪辑')"
          :multiple="false"
          ref="editRef"
          :feedBackOptions="editFeedbackOptions"
          :extra-options="otherOption"
          :showAvatarLable="true"
        />
      </el-form-item>
      <el-form-item label="投手" prop="contributorId">
        <SelectUser
          v-model="formParams.contributorId"
          :role="getRole('投手')"
          :multiple="false"
          ref="contributorRef"
          :feedBackOptions="contributorFeedbackOptions"
          :extra-options="otherOption"
          :showAvatarLable="true"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCloseDrawer" style="margin-top: 20px">取消</el-button>
      <el-button
        type="primary"
        class="mr20px"
        :disabled="drawerLoading"
        style="margin-top: 20px"
        @click="submitForm"
        >确认</el-button
      >
    </template>
  </SWDialog>
</template>
<script lang="ts" setup>
defineOptions({ name: 'DistributeDialog' })
import { consistency } from '@/utils'
import { channelList } from '../common'
import { cloneDeep } from 'lodash-es'
import { useRole } from '@/hooks/common/useRole'
import { contributonUser } from '@/api/yunVideo/index'
import SelectUser from '@/components/common/user/selectUserWithOther.vue'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
const message = useMessage()
const drawerVisible = ref(false)
const drawerLoading = ref(false)
const directorFeedbackOptions = ref<any[]>([])
const editFeedbackOptions = ref<any[]>([])
const contributorFeedbackOptions = ref<any[]>([])
// 请求参数
const OTHER_VALUE = 'qita'

const normalizeInitValue = (value?: string | number) => {
  if (value === 'other') return OTHER_VALUE
  if (value === OTHER_VALUE) return OTHER_VALUE
  return value ?? undefined
}

const normalizeSubmitValue = (value: string | number | undefined | null) => {
  if (value === OTHER_VALUE) return OTHER_VALUE
  if (value === '' || value === undefined || value === null) return undefined
  return value
}

const otherOption = [
  {
    userId: OTHER_VALUE,
    realName: '其他',
    avatarOrigin: DefaultAvatar
  }
]

interface FormParams {
  id?: string | number
  contentId: string
  channel: string
  directorId?: string | number
  editId?: string | number
  contributorId?: string | number
}

const createDefaultForm = (): FormParams => ({
  id: undefined,
  contentId: '', // 内容id
  channel: '',
  directorId: undefined, //编导
  editId: undefined, //剪辑
  contributorId: undefined //投手
})

const formParams = ref<FormParams>(createDefaultForm())
const hostoryData = ref<any>({})
const formRef = ref()
const fromRules = reactive({})
//打开弹框
const open = async (data: any) => {
  drawerVisible.value = true
  formParams.value.contentId = data.contentId
  formParams.value.channel = data.channel
  formParams.value.id = data.id
  formParams.value.directorId = normalizeInitValue(data.directorId)
  formParams.value.editId = normalizeInitValue(data.editId)
  formParams.value.contributorId = normalizeInitValue(data.contributorId)
  hostoryData.value = cloneDeep(formParams.value)
  drawerLoading.value = true
  if (data.directorId) {
    directorFeedbackOptions.value = [
      { userId: data.directorId, realName: data.directorName, avatarOrigin: data.directorHeadImg }
    ]
  }

  if (data.editId) {
    editFeedbackOptions.value = [
      { userId: data.editId, realName: data.editName, avatarOrigin: data.editHeadImg }
    ]
  }

  if (data.contributorId) {
    contributorFeedbackOptions.value = [
      {
        userId: data.contributorId,
        realName: data.contributorName,
        avatarOrigin: data.contributorHeadImg
      }
    ]
  }

  if (getRole('编导')) {
    drawerLoading.value = false
  } else {
    getPermissionInfo(() => {
      drawerLoading.value = false
    })
  }
}

onMounted(() => {
  getPermissionInfo(() => {})
})

const reset = () => {
  formParams.value = createDefaultForm()
  hostoryData.value = {}
  directorFeedbackOptions.value = []
  editFeedbackOptions.value = []
  contributorFeedbackOptions.value = []
  drawerLoading.value = false
}

const { getRole, getPermissionInfo } = useRole('新媒体')

const beforeClose = (done: Function) => {
  consistency(hostoryData.value, formParams.value, done)
}
const handleCloseDrawer = () => {
  beforeClose(() => {
    drawerVisible.value = false
  })
}

const submitForm = async () => {
  drawerLoading.value = true
  try {
    const payload = {
      ...formParams.value,
      directorId: normalizeSubmitValue(formParams.value.directorId),
      editId: normalizeSubmitValue(formParams.value.editId),
      contributorId: normalizeSubmitValue(formParams.value.contributorId)
    }
    await contributonUser(payload)
    message.success('分配成功！')
    emits('success')
    drawerVisible.value = false
  } catch (err) {
  } finally {
    drawerLoading.value = false
  }
}
const emits = defineEmits(['success'])
defineExpose({ open })
</script>
<style lang="scss" scoped>
.form-width {
  width: 432px !important;
}
</style>
