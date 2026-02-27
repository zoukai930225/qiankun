<template>
  <div class="g-query" ref="formRef">
    <div class="g-query-form">
      <scheme-form :schemeList="schemeList" v-model="formData" :is-expand="isExpand" :name="name" />

      <div class="g-query-btn" ref="btnRef">
        <slot name="prependButtons"></slot>
        <el-button v-if="!noReset" @click="resetData()">重置</el-button>
        <slot name="appendButtons"></slot>
      </div>
    </div>

    <el-divider v-if="showDivider" class="g-query-divider">
      <el-button v-if="showExpand" link @click="isExpand = !isExpand">
        {{ txt }}
        <el-icon class="el-icon--right">
          <component :is="!isExpand ? 'ArrowDown' : 'ArrowUp'" />
        </el-icon>
      </el-button>
    </el-divider>
  </div>
</template>

<script lang="ts">
export default { name: 'QueryScheme' }
</script>

<script lang="ts" setup>
import SchemeForm from './components/schemeForm.vue'
import { Scheme, FromProvideType } from '../config/type'
import { cloneDeep, debounce } from 'lodash-es'

const btnRef = ref()
const formRef = ref()
let observer: ResizeObserver | null = null

const formData: any = defineModel()

const isExpand = ref<boolean>(),
  width = ref<number>(500)

const props = defineProps({
  name: { type: String, default: '' },
  id: { type: String, default: '' },
  rules: { type: Object, default: () => {} },
  labelPosition: { type: String, default: 'right' },
  scheme: { type: Array<any>, default: () => [] },
  expandTxt: { type: String, default: '展开' },
  collapseTxt: { type: String, default: '收起' },
  showExpand: { type: Boolean, default: true },
  noReset: { type: Boolean, default: false },
  showDivider: { type: Boolean, default: true }
})

const { resetForm } = inject(`${props.name}Form`) as FromProvideType

const txt = computed(() => (isExpand.value ? props.collapseTxt : props.expandTxt))

// --- 核心修复部分 ---
const schemeList = computed(() => {
  const list: Array<Scheme> = cloneDeep([...props.scheme.map((si: any) => ({ ...new Scheme(si) }))])

  if (props.showExpand && isExpand.value) {
    return list
  }

  // 初始化阈值为列表总长度（之前默认为4或在循环中被设为 index，导致未溢出时切掉最后一个）
  let threshold: number = list.length
  let sum: number = 0

  // 计算宽度
  const GAP = 10

  const lengths: Array<number> = list.map((li: any) => {
    // 保持原来的特殊逻辑，如果宽度是230则按240算（可能是特殊业务需求）
    const itemWidth = li.width
    return itemWidth + li.labelWidth + GAP
  })

  // 4. 根据剩余宽度 width.value 计算需要展示几个
  lengths.some((num: number, index: number) => {
    sum += num
    if (sum > width.value) {
      threshold = index // 只有当溢出时，才截断
      return true // 终止循环
    }
    return false
  })

  // 确保至少展示 1 个，防止容器极窄时全部消失
  return list.slice(0, Math.max(1, threshold))
})
// --------------------

const resetData = debounce(() => resetForm(), 500)

const calculateWidth = () => {
  if (formRef.value) {
    const containerW = formRef.value.offsetWidth
    // 获取按钮区域实际宽度，如果不存在则为0
    // 增加了一个 buffer (20px) 避免刚好卡死换行
    const btnW = btnRef.value ? btnRef.value.offsetWidth : 0
    width.value = containerW - btnW - 20
  }
}

// 统一处理 Resize
const handleResize = () => {
  window.requestAnimationFrame(() => {
    calculateWidth()
  })
}

// 监听逻辑
onMounted(() => {
  calculateWidth()
  window.addEventListener('resize', calculateWidth)

  observer = new ResizeObserver(handleResize)
  if (formRef.value) observer.observe(formRef.value)
  if (btnRef.value) observer.observe(btnRef.value)
})

onUnmounted(() => {
  observer && observer.disconnect()
  window.removeEventListener('resize', calculateWidth)
})
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
