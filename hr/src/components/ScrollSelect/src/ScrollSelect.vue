<template>
  <div class="el-select el-select--default" :class="className">
    <el-select
      v-bind="{ ...props }"
      v-model="values"
      remote
      filterable
      :remote-method="remoteMethod"
      collapse-tags
      collapse-tags-tooltip
      @popup-scroll="handlePopupScroll"
    >
      <template v-for="(_, slotName) in $slots" :key="slotName" #[slotName]="slotData">
        <slot :name="slotName" v-bind="slotData" :selectItem="selectItem"></slot>
      </template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </el-select>
  </div>
</template>
<script lang="ts" setup>
interface Params {
  page?: number
  size?: number
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    /**组件绑定的值 */
    modelValue?: string | number | (string | number)[]
    defaultLabel?: string
    /**搜索关键字参数名 */
    selectKey: string
    /**滚动触底调用的接口，必须是分页接口 */
    api: (params: Params, control?: any) => Promise<any>
    /**接口返回的用于设置label的字段 */
    itemLabelKey: string
    /**接口返回的用于设置value的字段 */
    itemValueKey: string
    /**接口定义的page字段 */
    pageKey?: string
    /**接口定义的pageSize字段 */
    sizeKey?: string
    disabled?: boolean
    /**调用接口时除了page，size，value以外的其他参数 */
    otherParams?: {
      [key: string]: any
    }
    /**是否多选，默认多选 */
    multiple?: boolean
    placeholder?: string
    /**select的style */
    style?: any
    clearable?: boolean
    className?: string
  }>(),
  {
    pageKey: 'page',
    sizeKey: 'size',
    multiple: true,
    placeholder: '请选择'
  }
)

const emit = defineEmits(['update:model-value', 'change'])

const options = ref<{ label: string; value: string | number }[]>([])
const page = ref(1)
const size = ref(10)
const selectValue = ref<string>()
const total = ref(0)
const loading = ref(false)
const selectItem = ref<any>()

// 1. 请求控制器：用于中断前一次未完成的请求
const abortController = ref<AbortController | null>(null)
// 2. 请求版本号：标记最新请求，仅处理最新版本的响应
const requestId = ref(0)

// 用于编辑时回显
watch(
  () => props.defaultLabel,
  (val) => {
    if (props.multiple) {
      const defaultLabels = val?.split(',')
      let ops: any[] = []
      defaultLabels?.forEach((label) => {
        remoteMethod(label)
        ops.push(...options.value)
        options.value = Array.from(new Map(ops.map((ele) => [ele.value, ele])).values())
      })
    } else {
      remoteMethod(val as string)
    }
  }
)

const values = computed({
  get: () => {
    if (props.modelValue === undefined || props.modelValue === null || props.modelValue === '') {
      return props.multiple ? [] : undefined
    }

    if (props.multiple) {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue
      } else if (typeof props.modelValue === 'string') {
        return props.modelValue.split(',').filter(Boolean)
      }
      return [props.modelValue]
    } else {
      return props.modelValue
    }
  },
  set: (val) => handleChange(val)
})

function handleChange(val: string | number | (string | number)[] | undefined) {
  const emitValue = props.multiple ? (Array.isArray(val) ? val.join(',') : '') : val

  emit('update:model-value', emitValue)

  if (typeof val === 'string' || typeof val === 'number') {
    selectItem.value = options.value.find((item) => item.value === val)
  } else if (Array.isArray(val)) {
    selectItem.value = options.value.find((item) => item.value === val[val.length - 1])
  }

  nextTick(() => {
    emit('change', val, selectItem.value)
  })
}

/**
 * 初始换数据
 * @value 初始默认label
 */
async function initDefaultValue(value: any) {
  if (props.multiple && value) {
    const labels = Array.from(new Set(value.split(',').filter(Boolean)))
    if (labels.length === 0) return
    page.value = 1
    for (const label of labels) {
      if (options.value.some((ele) => ele.label === label)) {
        continue
      }
      try {
        const params: Params = {
          [props.pageKey]: page.value,
          [props.sizeKey]: size.value,
          [props.selectKey]: label,
          ...props.otherParams
        }
        const res = await props.api(params)
        if (res?.records?.length) {
          const newOptions = res.records.map((item) => ({
            ...item,
            label: item[props.itemLabelKey]?.toString() || '',
            value: item[props.itemValueKey]
          }))
          options.value = Array.from<any>(
            new Map([
              ...options.value.map((ele) => [ele.label, ele]),
              ...newOptions.map((ele) => [ele.label, ele])
            ]).values()
          )
        } else {
          options.value.push({ label: value, value: value })
        }
      } catch (error) {
        console.error(`获取标签"${label}"的数据失败:`, error)
      }
    }
  } else {
    await remoteMethod(value || '')
    if (options.value.length === 0) {
      options.value.push({ label: value, value: value })
    }
    selectItem.value = options.value.find((ele) => ele.label === value)
  }
}

async function remoteMethod(val: string) {
  loading.value = true
  selectValue.value = val || undefined
  page.value = 1
  options.value = []

  if (abortController.value) {
    abortController.value.abort('新请求触发，中断旧请求')
  }
  abortController.value = new AbortController()
  const currentRequestId = ++requestId.value

  try {
    const params: Params = {
      [props.pageKey]: page.value,
      [props.sizeKey]: size.value,
      [props.selectKey]: selectValue.value,
      ...props.otherParams
    }

    const res = await props.api(params, abortController.value.signal)

    if (currentRequestId !== requestId.value) return

    total.value = res.total || 0

    options.value =
      res.records?.map((item) => ({
        ...item,
        label: item[props.itemLabelKey]?.toString() || '',
        value: item[props.itemValueKey]
      })) || []
  } catch (error) {
    console.error('远程获取数据失败:', error)
    options.value = []
  } finally {
    loading.value = false
  }
}

const canGetMore = ref(true)
async function handlePopupScroll({ scrollTop }) {
  const threshold = (scrollTop % (page.value * size.value * 34)) - 78

  if (
    threshold >= 340 * (page.value - 1) - 10 &&
    page.value * size.value < total.value &&
    canGetMore.value
  ) {
    canGetMore.value = false
    ++page.value
    try {
      const params: Params = {
        [props.pageKey]: page.value,
        [props.sizeKey]: size.value,
        [props.selectKey]: selectValue.value,
        ...props.otherParams
      }

      const res = await props.api(params)
      total.value = res.total || 0

      const newOptions =
        res.records?.map((item) => ({
          ...item,
          label: item[props.itemLabelKey]?.toString() || '',
          value: item[props.itemValueKey]
        })) || []

      options.value = [...options.value, ...newOptions]
    } catch (error) {
      console.error('加载更多失败:', error)
    } finally {
      setTimeout(() => {
        canGetMore.value = true
      }, 100)
    }
  }
}

function refresh() {
  options.value = []
  page.value = 1
  remoteMethod('')
}

onBeforeMount(refresh)

defineExpose({
  /**刷新列表 */
  refresh,
  /**初始化数据 */
  initDefaultValue,
  /**被选中项信息 */
  selectItem,
  remoteMethod
})
</script>
<style lang="less" scoped></style>
