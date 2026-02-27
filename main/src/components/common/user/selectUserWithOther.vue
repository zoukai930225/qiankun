<template>
  <el-select
    v-model="dataValue"
    :placeholder="placeholder"
    :multiple="multiple"
    :disabled="disabled"
    filterable
    clearable
    :collapse-tags="multiple"
    :collapse-tags-tooltip="multiple"
    :loading="loading"
    popper-class="eloption"
    :popper-append-to-body="true"
    :suffix-icon="suffixIcon"
    @focus="handleFocus"
    @change="handleChange"
  >
    <el-option
      v-for="item in mergedOptions"
      :key="item.userId"
      :label="item.realName"
      :value="item.userId"
      :disabled="item.disabled"
    >
      <div class="peopleOption">
        <div class="left-wapper">
          <img class="img" :src="item?.avatarOrigin || avatarLogo" alt="" />
          <div class="info">
            <span class="text name">{{ item.realName }}</span>
            <span class="text desc">{{ item.dept || '--' }}</span>
          </div>
        </div>
      </div>
    </el-option>

    <template v-if="showAvatarLable" #label="{ label, value }">
      <div class="row-center">
        <el-avatar :src="getOptionAvatar(value)" :size="20" class="ava" />
        {{ label }}
      </div>
    </template>
  </el-select>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import avatarLogo from '@/assets/imgs/avatar_logo.png'
import { getUserList } from '@/api/system/user'

interface UserOption {
  userId: string | number
  realName: string
  avatarOrigin?: string
  disabled?: boolean
  dept?: string
  [key: string]: any
}

const props = defineProps({
  placeholder: { type: String, default: '请选择' },
  role: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  showAvatarLable: { type: Boolean, default: false },
  suffixIcon: { type: String, default: 'ArrowDown' },
  feedBackOptions: {
    type: Array as PropType<UserOption[]>,
    default: () => []
  },
  extraOptions: {
    type: Array as PropType<UserOption[]>,
    default: () => []
  },
  needUserInfo: { type: Boolean, default: false }
})

const emit = defineEmits(['change', 'loaded'])

const dataValue = defineModel<any>()

const loading = ref(false)
const apiOptions = ref<UserOption[]>([])

const mergedOptions = computed<UserOption[]>(() => {
  const map = new Map<UserOption['userId'], UserOption>()

  const merge = (list: UserOption[]) => {
    list.forEach((item) => {
      const exist = map.get(item.userId)
      map.set(item.userId, exist ? { ...exist, ...item } : { ...item })
    })
  }

  merge(apiOptions.value)
  merge(props.feedBackOptions)
  merge(props.extraOptions)

  return Array.from(map.values())
})

const fallbackOtherOption = computed<UserOption | undefined>(() => {
  return mergedOptions.value.find((item) => {
    const id = String(item.userId ?? '')
    return id === 'qita' || id === 'other' || item.realName === '其他'
  })
})

const ensureModelShape = () => {
  if (props.multiple && !Array.isArray(dataValue.value)) {
    dataValue.value = []
  }
}

const fetchOptions = async () => {
  if (!props.role) {
    apiOptions.value = []
    return
  }
  loading.value = true
  try {
    const res: any = await getUserList({ page: 1, pageSize: 9999, role: props.role })
    apiOptions.value = Array.isArray(res?.records) ? res.records : []
    emit('loaded', apiOptions.value)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.role,
  () => {
    fetchOptions()
  },
  { immediate: true }
)

watch(
  () => props.feedBackOptions,
  (list) => {
    if (!list?.length) return
    if (
      !props.multiple &&
      dataValue.value &&
      !mergedOptions.value.some((item) => item.userId === dataValue.value)
    ) {
      // 保证单选情况下已选项仍可显示
      apiOptions.value = [...apiOptions.value, ...list]
    }
  },
  { deep: true }
)

onMounted(() => {
  ensureModelShape()
})

const handleFocus = () => {
  if (!apiOptions.value.length && !loading.value) {
    fetchOptions()
  }
}

const handleChange = () => {
  if (props.needUserInfo) {
    if (props.multiple) {
      const selectedList = Array.isArray(dataValue.value)
        ? dataValue.value
            .map((id: UserOption['userId']) =>
              mergedOptions.value.find((item) => item.userId === id)
            )
            .filter(Boolean)
        : []
      emit('change', selectedList)
    } else {
      const user = mergedOptions.value.find((item) => item.userId === dataValue.value)
      emit('change', user)
    }
  } else {
    emit('change', dataValue.value)
  }
}

const getOptionAvatar = (userId: UserOption['userId']) => {
  return mergedOptions.value.find((item) => item.userId === userId)?.avatarOrigin || avatarLogo
}

const ensureFallbackOption = () => {
  if (props.multiple) return

  const value = dataValue.value
  if (value === undefined || value === null || value === '') return

  const exist = mergedOptions.value.some((item) => item.userId === value)
  if (!exist && fallbackOtherOption.value) {
    dataValue.value = fallbackOtherOption.value.userId
  }
}

watch(
  () => mergedOptions.value,
  () => {
    ensureFallbackOption()
  },
  { deep: true }
)

watch(
  () => dataValue.value,
  (val, oldVal) => {
    if (val === oldVal) return
    ensureFallbackOption()
  }
)

const reset = () => {
  dataValue.value = props.multiple ? [] : undefined
}

const refresh = () => {
  fetchOptions()
}

defineExpose({
  reset,
  refresh,
  dataValue,
  get mergedOptions() {
    return mergedOptions.value
  }
})
</script>

<style scoped lang="scss">
.peopleOption {
  padding: 5px 12px;
  width: calc(100% - 24px);
  height: calc(50px - 10px);
  line-height: calc(50px - 10px);

  .left-wapper {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 100%;
  }

  .img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .info {
    display: inline-flex;
    flex-direction: column;
    margin-left: 14px;

    .text {
      height: 20px;
      line-height: 20px;
    }

    .name {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: #333333;
    }

    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}

.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
  line-height: 50px;
  padding: 0px;
  width: 100%;
}

.ava {
  margin-right: 10px;
}

.row-center {
  display: flex;
  align-items: center;
}
:deep(.el-select) {
  width: 100%;
}
</style>
