<template>
  <el-form-item ref="formItemRef" :prop="prop" :label="label" :rules="computedRules"
    :class="label && label.length > 4 ? 'text-warpper' : ''">
    <template v-if="$slots.label" #label>
      <slot name="label"></slot>
    </template>
    <el-tooltip :append-to-body="false" :disabled="!showTooltip" :content="`${innerValue}`" placement="top"
      :show-after="500" popper-style="max-width: 600px;">
      <el-input ref="inputRef" v-model="innerValue" :autofocus="autofocus"
        :placeholder="placeholder ? placeholder : `请输入${label}`" :maxlength="maxLength" :show-word-limit="showWordLimit"
        :clearable="clearable" :disabled="disabled" type="text" @input="handleInput" @blur="handleBlur"
        @change="handleChange" @keydown.enter="handleEnter">
        <!-- 插槽支持 -->
        <template v-if="$slots.prepend" #prepend>
          <slot name="prepend"></slot>
        </template>
        <template v-if="$slots.append" #append>
          <slot name="append"></slot>
        </template>
        <template v-if="$slots.prefix" #prefix>
          <slot name="prefix"></slot>
        </template>
        <template v-if="$slots.suffix" #suffix>
          <slot name="suffix"></slot>
        </template>
      </el-input>
    </el-tooltip>
  </el-form-item>
</template>

<script lang="ts">
export default {
  name: 'SwTextInput'
}
</script>

<script lang="ts" setup>
const emits = defineEmits(['update:modelValue', 'input', 'blur', 'change', 'validate'])
const props = defineProps({
  // 双向绑定值
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // 标签文本
  label: {
    type: String,
    default: ''
  },
  // 属性名
  prop: {
    type: String,
    default: ''
  },
  // 占位符
  placeholder: {
    type: String,
    default: ''
  },
  // 最大长度
  maxLength: {
    type: Number,
    default: 50
  },
  // 是否显示字数统计
  showWordLimit: {
    type: Boolean,
    default: false
  },
  // 是否可清空
  clearable: {
    type: Boolean,
    default: true
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 自动聚焦
  autofocus: {
    type: Boolean,
    default: false
  },
  // 正则表达式
  pattern: {
    type: [RegExp, String],
    default: null
  },
  // 正则校验失败时的提示信息
  patternMessage: {
    type: String,
    default: '输入格式不正确'
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false
  },
  // 必填提示信息
  requiredMessage: {
    type: String,
    default: ''
  },
  // 自定义校验规则
  customRules: {
    type: Array,
    default: () => []
  }
})

const innerValue: Ref<string | number> = ref(props.modelValue)
const inputRef: Ref<any> = ref()
const formItemRef: Ref<any> = ref()

const formatWidth = computed(() => {
  return typeof props.width === 'number' ? `${props.width}px` : props.width
})

// 是否显示tooltip
const showTooltip = computed(() => {
  if (!inputRef.value) return false
  const inputEl = inputRef?.value?.$el.querySelector('input');
  return inputEl.scrollWidth > inputEl.clientWidth && props.disabled
})

// 计算最终的校验规则
const computedRules: any = computed(() => {
  const rules = [...props.customRules]

  // 必填规则
  if (props.required) {
    rules.push({
      required: true,
      message: props.placeholder ? props.placeholder : `请输入${props.label}`,
      trigger: ['blur', 'change']
    })
  }

  // 正则校验规则
  if (props.pattern) {
    let regex = props.pattern
    if (typeof regex === 'string') {
      // 处理字符串形式的正则
      regex = new RegExp(regex)
    }

    rules.push({
      validator: (rule, value, callback) => {
        if (!value || regex.test(value)) {
          callback()
        } else {
          callback(new Error(props.patternMessage))
        }
      },
      trigger: ['blur', 'change']
    })
  }

  // 长度限制规则
  rules.push({
    max: props.maxLength,
    message: `${props.label || '内容长度'}不能超过${props.maxLength}个字符`,
    trigger: ['blur', 'change']
  })
  return rules
})

watch(() => props.modelValue, (newVal) => {
  if (newVal !== innerValue.value) {
    innerValue.value = newVal
  }
})

watch(innerValue, (newVal) => {
  if (newVal !== props.modelValue) {
    emits('update:modelValue', newVal)
  }
})

const handleInput = (value) => {
  emits('input', value)
}

const checkPattern = (value) => {
  if (props.pattern) {
    let regex = props.pattern
    if (typeof regex === 'string') {
      // 处理字符串形式的正则
      regex = new RegExp(regex)
    }
    if (value && !regex.test(value)) {
      inputRef.value.ref.parentElement.style.boxShadow = '0 0 0 1px var(--el-color-danger) inset'
    } else {
      inputRef.value.ref.parentElement.style.boxShadow = '0 0 0 1px var(--el-disabled-border-color) inset'
    }
  }
}

const handleEnter = (event) => {
  // 使当前输入框失去焦点
  event.target.blur();
}

const handleBlur = (event) => {
  emits('blur', event)
}

const handleChange = (value) => {
  emits('change', value)
}

</script>

<style lang="scss" scoped>
.sw-text-input {
  position: relative;
}

.text-warpper {
  :deep(.el-form-item__label) {
    line-height: 16px;
  }
}

:deep(.el-input) {
  min-width: 240px;
  .el-input__wrapper {
    box-shadow: 0 0 0 1px #e5e5e5 inset;
  }

  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  &.is-disabled {

    /* 超出文本显示省略号 */
    .el-input__inner {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>