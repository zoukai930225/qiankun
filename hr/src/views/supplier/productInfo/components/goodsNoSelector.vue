<template>
  <el-select-v2
    v-model="value"
    placeholder="请选择"
    filterable
    remote
    clearable
    :disabled="disabled"
    reserve-keyword
    remote-show-suffix
    :remote-method="remoteMethod"
    :loading="loading"
    :options="optionOptions"
    @change="(val) => emit('change', val)"
  />
</template>
<script lang="ts" setup>
import { getListGoodsNo, getListSpecNo } from '@/api/productManage/deadStock'

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  type: 1 | 2
  goodsNo?: string
  isFirstCall?: boolean
}>()

const emit = defineEmits(['update:model-value', 'change'])

const loading = ref(false)
const optionOptions = ref<{ label: string; value: string }[]>([])
const value = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:model-value', val)
  }
})

async function remoteMethod(val: string) {
  // console.log('被调用a', val)
  loading.value = true
  try {
    let queryVal = val
    if (props.isFirstCall && props.goodsNo && !val) {
      queryVal = props.goodsNo

      value.value = props.goodsNo
    }
    if (props.type === 1) {
      const res = await getListGoodsNo({ goodsNo: queryVal })
      optionOptions.value = res?.map((item) => ({
        value: item.goodsNo,
        label: item.goodsNo
      }))
    } else {
      const res = await getListSpecNo({ specNo: queryVal })
      optionOptions.value = res?.map((item) => ({
        value: item.code,
        label: item.name
      }))
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>
<style lang="less" scoped></style>
