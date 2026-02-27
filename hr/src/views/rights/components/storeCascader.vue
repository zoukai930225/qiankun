<template>
  <el-cascader
    v-model="value"
    :options="storeOptions"
    placeholder="请选择店铺"
    :props="storeProp"
    :show-all-levels="false"
    :max-collapse-tags="1"
    collapse-tags
    clearable
    @change="handleChange"
  >
    <template #default="{ data }">
      <div class="center">
        <img class="logo" :src="getImageUrl(data.value)" alt="" />
        <span>
          {{ data.label }}
        </span>
      </div>
    </template>
  </el-cascader>
</template>
<script lang="ts" setup>
import { storeProps } from '../options'
import { getImageUrl } from '@/utils'
import { useRightsStore } from '@/store/modules/rights'

const rights = useRightsStore()

const props = withDefaults(
  defineProps<{
    modelValue?: string
    multiple?: boolean
    justStore?: boolean
  }>(),
  {
    multiple: true
  }
)

const emit = defineEmits(['update:model-value', 'change'])

const value = ref<string[][]>([])

const storeProp = computed(() => (props.multiple ? storeProps : {}))

watch(
  () => props.modelValue,
  (val) => {
    if (!val) value.value = []
  }
)

const storeOptions = computed(() => {
  if (rights.channel && props.justStore) {
    return rights.storeOptions.find((item) => item.value === rights.channel)?.children
  } else {
    return rights.storeOptions
  }
})

function handleChange(val: string[][]) {
  emit(
    'update:model-value',
    props.multiple ? val?.map((item) => item[item.length - 1]).join(',') : val?.[val.length - 1]
  )
  emit('change')
}
</script>
<style lang="less" scoped>
.logo {
  max-width: 18px;
  max-height: 18px;
  margin-right: 8px;
}

.center {
  display: flex;
  align-items: center;
}
</style>
