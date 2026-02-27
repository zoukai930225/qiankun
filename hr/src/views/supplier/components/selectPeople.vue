<!-- 目前只应用在搜索栏，表单待完善 -->
<template>
  <el-select
    ref="selectRef"
    v-bind="{ ...$attrs, ...props }"
    popper-class="eloption"
    :popper-append-to-body="true"
    :remote="remote"
    filterable
    v-model="value"
    :loading="loading"
    :remote-method="props.getListMethod === 'remote' ? remoteMethod : undefined"
    clearable
    @visible-change="visibleChange"
    collapse-tags
    collapse-tags-tooltip
  >
    <template #tag v-if="currentPersons.length">
      <div class="itemValue" v-for="(item, index) in currentPersons" :key="index">
        <img class="avatorLogo" :src="item?.avatarOrigin" alt="" />
        <span class="itemDesc">{{ item?.label }} </span>
        <img
          class="itemClose"
          src="@/assets/imgs/team/itemClose.png"
          @click.stop="emits('update:modelValue', '')"
          alt=""
        />
      </div>
    </template>
    <template #label="{ value }">
      <div
        class="flex items-center itemValue w-[min-content]"
        :class="{ 'one-person-label': !multiple }"
      >
        <el-avatar :src="getSelectedPerson(value)?.avatarOrigin" :size="16" />
        <span class="mx-4px color-#333">{{ getSelectedPerson(value)?.name }}</span>
      </div>
    </template>
    <el-option
      v-for="item in personList"
      :key="item.userId || ''"
      :value="item.userId || ''"
      :label="item?.name"
    >
      <div class="item">
        <div class="left-wapper">
          <img class="img" :src="item.avatarOrigin" alt="" />
          <div class="info">
            <span class="text name">{{ item.name }}</span>
            <span class="text jobName !font-size-12px">
              {{ item.jobName }}
            </span>
          </div>
        </div>
      </div>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { personRosterGetPerson } from '@/api/shop'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    api?: (params?: any) => Promise<any>
    list?: any[]
    getListMethod?: 'remote' | 'visible'
    multiple?: boolean
    /** 用于回写的参数，需要后端返回对应的name */
    callbackLabel?: string
    remote?: boolean
  }>(),
  {
    api: personRosterGetPerson,
    list: () => [],
    getListMethod: 'remote',
    multiple: true,
    remote: true
  }
)

const emits = defineEmits(['update:modelValue', 'change', 'update:list'])

/** 用于缓存历史列表，避免搜索后信息丢失 */
const personsOptionsMap = ref<Map<string, any>>(new Map())
const selectRef = ref()

const value = computed({
  get: () => (props.multiple ? props.modelValue?.split(',') || undefined : props.modelValue),
  set: (val) =>
    emits('update:modelValue', props.multiple ? (val as string[])?.join(',') || undefined : val)
})

const personList = computed({
  get: () => props.list,
  set: (val) => emits('update:list', val)
})
const loading = ref(false)
const currentPersons = computed(
  () =>
    personList.value.filter((person) => props.modelValue?.split(',').includes(person.value)) || []
)

watch(
  () => props.modelValue,
  (val) => emits('change', val)
)

// 回写逻辑
watch(
  () => props.callbackLabel,
  (val) => {
    if (!val) return
    const names = val?.split(',')
    names.forEach((name) => remoteMethod(name))
  },
  { once: true }
)

watch(
  () => props.list,
  (val) => {
    val.forEach((ele) => {
      personsOptionsMap.value.set(ele.userId, ele)
    })
  }
)

watch(
  () => [selectRef.value, props.modelValue],
  ([dom, val]) => {
    nextTick(() => {
      const target = (dom.$el as HTMLElement).querySelector('.el-tag')
      target?.classList[props.multiple && val?.split(',').length === 1 ? 'add' : 'remove'](
        'only-one'
      )
    })
  }
)

async function remoteMethod(value: string) {
  try {
    loading.value = true
    const res = await props.api(value)
    personList.value = res
  } catch (error) {
  } finally {
    loading.value = false
  }
}

async function visibleChange(visible: boolean) {
  if (!visible || props.getListMethod !== 'visible') return
  try {
    loading.value = true
    const res = await props.api()
    personList.value = res
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function getSelectedPerson(value: string) {
  return personsOptionsMap.value.get(value)
}
</script>

<style scoped lang="less">
.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}

.itemValue {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 26px;
  // width: 92px;
  padding-right: 0;
  border-radius: 13px;
  padding: 1px 0 1px;
  box-sizing: border-box;

  .itemDesc {
    font-size: 14px;
    color: #333333;
    margin-left: 6px;
    margin-right: 6px;
  }

  .avatorLogo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .itemClose {
    cursor: pointer;
    width: 6px;
    height: 6px;
    padding: 4px;
    margin-left: auto;
  }
}

.item {
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;

  .left-wapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .img {
    flex: 1;
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 14px;

    .text {
      height: 20px;
      line-height: 20px;
    }

    .name {
      font-size: 14px;
      color: #333333;
    }

    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}

.jobName {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
  min-height: 32px;
  //background: #fafafa;
  border-radius: 4px;
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.el-select__selected-item) {
  .el-tag {
    padding-left: 5px;
    border-radius: 12px 4px 4px 12px;
    background-color: #cad6f8;
  }
  .el-tag.only-one {
    border-radius: 12px;
  }

  &.el-tooltip__trigger {
    .el-tag {
      border-radius: 4px 12px 12px 4px;
      margin-left: -3px;
    }
  }
}
.one-person-label {
  padding: 0 5px;
  border-radius: 12px;
  background-color: #cad6f8;
}
.el-select-dropdown__item {
  display: flex;
  align-items: center;
}
</style>
