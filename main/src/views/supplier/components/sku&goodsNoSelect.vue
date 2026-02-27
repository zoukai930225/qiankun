<template>
  <div class="flex flex-1">
    <el-select v-model="codeType" class="!w-110px" @change="handleChangeCodeType">
      <el-option v-for="(value, key) in codeTypes" :key="key" :value="key" :label="value.label" />
    </el-select>
    <scroll-select
      class-name="!flex-1"
      v-model:model-value="queryParams[codeType]"
      :api="codeTypes[codeType].api"
      :item-label-key="codeTypes[codeType].key"
      :item-value-key="codeTypes[codeType].key"
      :selectKey="codeTypes[codeType].key"
      :multiple="true"
      clearable
      @change="handleChange"
    />
  </div>
</template>
<script lang="ts" setup>
import { getInfoByGoodsCode, getInfoBySku2 } from '@/api/supplier/purchase'

const props = withDefaults(
  defineProps<{
    params: Record<string, any>
    goodsCodeKey?: string
    skuKey?: string
  }>(),
  {
    goodsCodeKey: 'goodsCode',
    skuKey: 'sku'
  }
)

const emit = defineEmits<{
  (e: 'changeValue', v: string): void
  (e: 'changeType', v: string): void
  (e: 'update:params', v: Record<string, any>): void
}>()

const codeTypes = {
  [props.goodsCodeKey]: {
    label: '货品编码',
    placeholder: '请输入货品编码',
    key: 'goodsCode',
    api: getInfoByGoodsCode
  },
  [props.skuKey]: {
    label: 'SKU编码',
    placeholder: '请输入SKU编码',
    key: 'sku',
    api: getInfoBySku2
  }
}
const codeType = ref(props.goodsCodeKey)

const queryParams = computed({
  get: () => props.params,
  set: (val) => emit('update:params', val)
})

function handleChangeCodeType() {
  let val = ''
  Object.keys(codeTypes).forEach((key) => {
    queryParams.value[key] && (val = queryParams.value[key])
    queryParams.value[key] = ''
  })
  val && emit('changeType', codeType.value)
}

function handleChange(val) {
  emit('changeValue', val)
}
</script>
<style lang="less" scoped>
.el-select {
  --el-select-width: calc(100% - 100px);
}
</style>
