<template>
  <div class="g-query-form-body" ref="formRef">
    <el-form :model="formData" inline :label-position="labelPosition as any" :rules="rules">
      <el-form-item v-for="sch in schemeList" :prop="sch.field" :label-width="sch.labelWidth"
        :class="[labelArray(sch.label) ? 'form_label_half' : '']">
        <template #label>
          <span v-if="!labelArray(sch.label)" :style="labelStyle(sch)" class="g-query-form-label">{{
            sch.label
          }}</span>
          <span v-if="labelArray(sch.label)" :style="labelStyle(sch)"
            class="g-query-form-label g-query-form-label-half">{{ sch.label[0] }}</span>
          <span v-if="labelArray(sch.label)" :style="labelStyle(sch)"
            class="g-query-form-label g-query-form-label-half">{{ sch.label[1] }}</span>
        </template>
        <el-input :style="formStyle(sch)" v-if="!sch.isCustom && sch.component === 'Input'"
          v-model="formData[sch.field]" v-bind="sch.componentProps"
          :placeholder="sch?.componentProps?.placeholder || `请输入${sch.label}`" @keydown.enter="searchData()"
          @change="searchData()" />
        <el-input-number :style="formStyle(sch)" v-if="!sch.isCustom && sch.component === 'InputNumber'"
          v-model="formData[sch.field]" v-bind="sch.componentProps" @change="searchData()" :controls="false" />
        <el-date-picker :style="formStyle(sch)" v-if="!sch.isCustom && sch.component === 'DatePicker'"
          @change="searchData()" v-model="formData[sch.field]" v-bind="sch.componentProps"
          :placeholder="sch?.componentProps?.placeholder || `请选择${sch.label}`"
          :start-placeholder="sch?.componentProps?.startPlaceholder || '开始时间'"
          :end-placeholder="sch?.componentProps?.endPlaceholder || '结束时间'" />
        <el-select :style="formStyle(sch)" v-if="!sch.isCustom && sch.component === 'Select'" @change="searchData()"
          v-model="formData[sch.field]" :placeholder="sch?.componentProps?.placeholder || `请选择${sch.label}`"
          v-bind="sch.componentProps">
          <el-option v-for="ops in sch.options" :label="ops.label" :value="ops.value" :disabled="ops.disabled" />
        </el-select>
        <el-select-v2 :style="formStyle(sch)" v-if="!sch.isCustom && sch.component === 'SelectV2'"
          v-model="formData[sch.field]" :placeholder="sch?.componentProps?.placeholder || `请选择${sch.label}`"
          v-bind="sch.componentProps" :options="sch?.options || []" @change="searchData()" filterable />
        <component :style="formStyle(sch)" v-if="sch.isCustom" v-model:value="formData[sch.field]"
          v-model="formData[sch.field]" :is="sch.customRender(sch)" v-bind="sch.componentProps"
          @change="searchData()" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
export default { name: 'SchemeForm' }
</script>

<script lang="ts" setup>
import { Scheme, FromProvideType } from '../../config/type'
import { debounce } from 'lodash-es'

const formData: any = defineModel()

const props = defineProps({
  name: { type: String, default: '' },
  rules: { type: Object, default: () => { } },
  labelPosition: { type: String, default: 'right' },
  schemeList: { type: Array<Scheme>, default: () => [] }
})

const { onSearch, page } = inject(`${props.name}Form`) as FromProvideType

const labelArray = (text: string | Array<string>) => {
  let success: boolean = false
  if (typeof text === 'object' && text !== null && text.constructor === Array) {
    success = true
  }
  return success
}

const labelStyle = (sch: any) => {
  return {
    width: `${sch.labelWidth - 10}px`,
    textAlign: props.labelPosition
  } as any
}

const formStyle = (item: Scheme) => {
  return { ...item.style, width: `${item.width}px !important` }
}

const searchData = debounce(() => {
  page.value = { ...page.value, page: 1 }
  onSearch()
}, 500)
</script>

<style lang="scss" scoped>
@use '../style.scss';
</style>
