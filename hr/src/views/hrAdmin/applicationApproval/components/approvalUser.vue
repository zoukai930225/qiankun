<template>
  <div class="approval-user-dialog">
    <el-form :model="form" label-width="88px">
      <el-form-item label="审核人员">
        <SWSelectPeople :isEdit="true" v-model:modelValue="selectedUsers" class="w-full" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'

interface OptionItem {
  label: string
  value: string | number
}

interface SelectedUser {
  userId: string | number
  name: string
  avatarOrigin?: string
  departmentName?: string
}

const props = withDefaults(
  defineProps<{
    // 预设的审核人员，可选
    presetUsers?: OptionItem[]
    // 预选中的人员 id 集合，可选
    defaultSelected?: Array<string | number>
    // 关联记录（单选/多选时传入以便后续提交），可选
    records?: any[]
  }>(),
  {}
)

const message = useMessage()

const form = ref<{ userIds: Array<string | number> }>({
  userIds: Array.isArray(props?.defaultSelected) ? props.defaultSelected : []
})

const fallbackOptions: OptionItem[] = [
  { label: '大大秦', value: 'user_1' },
  { label: '奔奔', value: 'user_2' },
  { label: '李四', value: 'user_3' },
  { label: '王五', value: 'user_4' }
]

const userOptions = computed<OptionItem[]>(() => {
  return Array.isArray(props.presetUsers) && props.presetUsers.length > 0
    ? props.presetUsers
    : fallbackOptions
})

// SWSelectPeople 选中值（人员对象数组），与 form.userIds 做桥接
const selectedUsers = ref<SelectedUser[]>([])

// 远程搜索函数：将现有的 userOptions 映射为 SWSelectPeople 需要的结构
const getSearchList = async (keyword: string) => {
  const list = userOptions.value || []
  return list.map((opt) => ({
    userId: String(opt.value),
    name: String(opt.label),
    avatarOrigin: '',
    departmentName: ''
  }))
}

// 初始化：把 defaultSelected 映射为人员对象，便于 SWSelectPeople 展示
onMounted(() => {
  if (Array.isArray(props.defaultSelected) && props.defaultSelected.length > 0) {
    const mapped = props.defaultSelected.map((id) => {
      const opt = userOptions.value.find((o) => o.value === id)
      return {
        userId: id,
        name: opt?.label ?? String(id),
        avatarOrigin: '',
        departmentName: ''
      } as SelectedUser
    })
    selectedUsers.value = mapped
  }
})

// 同步 SWSelectPeople 的对象数组到原有的 ids 数组
watch(
  () => selectedUsers.value,
  (arr) => {
    form.value.userIds = (arr || []).map((u) => u.userId)
  },
  { deep: true }
)

// 提供 submit 以便外部 openDialog 的确认按钮调用
const submit = async () => {
  if (!form.value.userIds || form.value.userIds.length === 0) {
    message.warning('请选择审核人员')
    throw new Error('NO_SELECTED')
  }
  // TODO: 接入后端保存审核人员接口，例如 bindApprovers({ userIds, records })
  // await api.bindApprovers({ userIds: form.value.userIds, records: props.records || [] })
}

defineExpose({ submit })
</script>

<style scoped>
.approval-user-dialog {
  padding: 8px 4px;
}
</style>
