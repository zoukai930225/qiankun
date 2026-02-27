<template>
  <div class="claim-dialog">
    <el-form label-width="48px">
      <el-form-item label="编导">
        <SelectUser
          v-model="form.directorId"
          :role="getRole('编导')"
          :multiple="false"
          :showAvatarLable="true"
          :extra-options="otherOption"
        />
      </el-form-item>

      <el-form-item label="剪辑">
        <SelectUser
          v-model="form.editId"
          :role="getRole('剪辑')"
          :multiple="false"
          :showAvatarLable="true"
          :extra-options="otherOption"
        />
      </el-form-item>

      <el-form-item label="投手">
        <SelectUser
          v-model="form.contributorId"
          :role="getRole('投手')"
          :multiple="false"
          :showAvatarLable="true"
          :extra-options="otherOption"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import { batchClaimMy } from '@/api/yunVideo/index'
import SelectUser from '@/components/common/user/selectUserWithOther.vue'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import { useRole } from '@/hooks/common/useRole'
import { getActivePinia } from 'pinia'
import { getCurrentInstance } from 'vue'

const props = defineProps<{
  ids: Array<string | number>
  initDirectorId?: string | number
  initEditId?: string | number
  initContributorId?: string | number
}>()

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

const { getRole, getPermissionInfo } = useRole('新媒体')
const message = useMessage()

const form = reactive({
  directorId: normalizeInitValue(props.initDirectorId),
  editId: normalizeInitValue(props.initEditId),
  contributorId: normalizeInitValue(props.initContributorId)
})

watch(
  () => [props.initDirectorId, props.initEditId, props.initContributorId],
  ([d, e, c]) => {
    form.directorId = normalizeInitValue(d)
    form.editId = normalizeInitValue(e)
    form.contributorId = normalizeInitValue(c)
  }
)

const otherOption = [
  {
    userId: OTHER_VALUE,
    realName: '其他',
    avatarOrigin: DefaultAvatar
  }
]

// 供 useDialog 调用
async function submit() {
  const { directorId, editId, contributorId } = form
  if (!directorId && !editId && !contributorId) {
    message.warning('请至少选择一位成员')
    throw new Error('至少选择一项')
  }
  await batchClaimMy({
    idList: props.ids,
    directorId: normalizeSubmitValue(directorId),
    editId: normalizeSubmitValue(editId),
    contributorId: normalizeSubmitValue(contributorId)
  })
  message.success('认领成功')
}

defineExpose({ submit })

onMounted(async () => {
  await getPermissionInfo()

  console.log('编导', getRole('编导'))
  console.log('剪辑', getRole('剪辑'))
  console.log('投手', getRole('投手'))
  // 调试 Pinia 是否可用
  const instance = getCurrentInstance()
  console.log('Content Pinia Debug:', {
    activePinia: getActivePinia(),
    contextPinia: instance?.appContext.config.globalProperties.$pinia,
    providesPinia: instance?.appContext.provides.pinia
  })
})
</script>

<style scoped lang="scss">
.row-center {
  display: flex;
  align-items: center;
}
.width-260 {
  width: 260px;
}
.ml12 {
  margin-left: 12px;
}
.mr6 {
  margin-right: 6px;
}
.other-label {
  display: inline-flex;
  align-items: center;
}
.claim-dialog :deep(.el-input__wrapper) {
  box-shadow: none;
}
</style>
