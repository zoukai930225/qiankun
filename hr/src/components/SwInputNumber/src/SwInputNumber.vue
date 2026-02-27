<template>
  <div
    @mouseenter="handleMouseMoveEnter"
    @mouseleave="showClose = false"
    class="w-100%"
    @keydown.enter="emit('keydown.enter')"
  >
    <el-input-number
      v-bind="{ ...$attrs, ...props, validateEvent: true }"
      @update:model-value="handleModelUpdate"
      @change="handleChange"
      @focus="emit('focus', $event)"
      @blur="handleBlur"
      @input="(val) => emit('input', val)"
    >
      <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]>
        <slot :name="slotName"></slot>
      </template>

      <template #suffix>
        <el-icon v-if="showClose && clearabled" class="close" @click="handleClear">
          <CircleClose />
        </el-icon>
      </template>
    </el-input-number>
  </div>
</template>

<script lang="ts" setup>
import type { InputNumberProps } from 'element-plus'
import { inject } from 'vue'
import type { FormItemContext } from 'element-plus'

// 注入表单项上下文
const formItemContext = inject<FormItemContext | null>('elFormItem', null)

const props = withDefaults(
  defineProps<Partial<InputNumberProps & { style?: any; clearabled?: boolean }>>(),
  {
    modelValue: undefined,
    controls: false,
    precision: 0,
    max: 99999999,
    min: 0,
    'value-on-clear': 0,
    clearabled: true
  }
)

const emit = defineEmits<{
  (e: 'change', cur?: number | undefined, prev?: number | undefined): void
  (e: 'blur', value: FocusEvent): void
  (e: 'focus', value: FocusEvent): void
  (e: 'input', value: number | null | undefined): void
  (e: 'update:modelValue', value: number | undefined): void
  (e: 'clear')
  (e: 'keydown.enter')
}>()

const showClose = ref(false)

// 处理值更新
const handleModelUpdate = (val: number | undefined) => {
  emit('update:modelValue', val)
}

// 处理change事件 - 同时触发校验
const handleChange = (cur?: number | undefined, prev?: number | undefined) => {
  emit('change', cur, prev)
  // 触发表单校验
  formItemContext?.validate('change')
}

// 处理blur事件 - 保持原有校验
const handleBlur = (e: FocusEvent) => {
  emit('blur', e)
  // 保留blur时的校验
  formItemContext?.validate('blur')
}

// 处理清除操作
const handleClear = () => {
  emit('update:modelValue', undefined)
  emit('change', undefined)
  emit('clear')
  // 清除后也触发校验
  formItemContext?.validate('change')
}

function handleMouseMoveEnter() {
  if (props.clearabled && !props.readonly && !props.disabled) {
    showClose.value = true
  }
}
</script>

<style lang="less" scoped>
.close {
  cursor: pointer;
}

:deep(.el-input__wrapper) {
  padding-left: 10px !important;
  padding-right: 10px !important;

  box-sizing: border-box;
  width: 100%;
}

:deep(.el-input__inner) {
  text-align: left !important;
}

.el-input-number {
  width: 100%;
}
</style>
