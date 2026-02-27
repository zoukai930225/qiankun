<!-- 用于表格操作单元格按钮 -->
<!-- 按钮超过三个时，只展示前两个，后面的按钮用下拉框展示 -->
<template>
  <div class="options">
    <el-tooltip
      v-for="(btn, index) in staticBtns"
      :key="index"
      :disabled="!btn.disabled || !btn.disabledDesc"
      :content="btn.disabledDesc"
      :show-after="200"
    >
      <slot :name="`${btn.label}`" :btn="btn" :index="index">
        <el-button
          :link="link"
          :type="btn.type || 'primary'"
          :loading="btn.loading"
          :disabled="btn.disabled || btn.loading"
          @click="handleClickStaticBtn(btn)"
          >{{ btn.label }}</el-button
        >
      </slot>
    </el-tooltip>
    <el-popover
      placement="bottom-end"
      v-if="hideBtns.length"
      :width="width"
      :visible="isShowHide"
      :show-after="200"
      :hide-after="200"
      :popper-style="{ minWidth: 'auto' }"
    >
      <template #reference>
        <div class="p-4px ml10px flex items-center">
          <img src="@/assets/svgs/moreBtn.svg" class="w-14px" alt="" />
        </div>
      </template>
      <div class="hideBtns">
        <slot
          v-for="(btn, index) in hideBtns"
          :key="index"
          :name="`${btn.label}`"
          :btn="btn"
          :index="index"
        >
          <el-button
            link
            :type="btn.type"
            :loading="btn.loading"
            :disabled="btn.disabled || btn.loading"
            @click="handleClickStaticBtn(btn)"
            >{{ btn.label }}</el-button
          >
        </slot>
      </div>
    </el-popover>
  </div>
</template>
<script lang="ts" setup>
import { getPermission } from '@/utils'
import { ButtonType } from 'element-plus'

const props = withDefaults(
  defineProps<{
    /** 当前行的数据 */
    row: any
    /** 当前行的下标 */
    rowIndex?: number
    /** 按钮组配置 */
    options: {
      /**按钮名称 */
      label: string
      /**按钮行为 */
      method: (params?: any, index?: number) => any
      /**按钮类型 */
      type?: ButtonType
      /**loading, 用于防抖，显示加载状态 */
      loading?: boolean
      /**是否不可点击 */
      disabled?: boolean
      /**失效时浮窗展示的文字 */
      disabledDesc?: string
      /** 权限 */
      permission?: string
    }[]
    /**静态按钮最多显示的个数 */
    staticBtnsNum?: number
    /**需要显示loading的按钮名称，数组元素是按钮名 */
    canLoadingBtn?: string[]
    /**需要保持菜单停留的按钮 */
    holdBtn?: string[]
    /**宽度 */
    width?: number | string

    link?: boolean
  }>(),
  {
    staticBtnsNum: 3,
    width: 'max-content',
    link: true
  }
)

const btnOptios = computed(() =>
  props.options.filter((ele) => {
    const permission = getPermission()
    return ele.permission ? permission.includes(ele.permission) : true
  })
)
const isShowHide = ref<boolean | undefined>(undefined)

/** 固定展示的按钮 */
const staticBtns = computed(() => btnOptios.value?.slice(0, props.staticBtnsNum) || [])
/** 隐藏的按钮 */
const hideBtns = computed(
  () => btnOptios.value?.slice(props.staticBtnsNum, btnOptios.value?.length) || []
)

async function handleClickStaticBtn(btn) {
  btn.loading = props.canLoadingBtn?.includes(btn.label)
  const isStayBtn = props.holdBtn?.includes(btn.label)
  isStayBtn && (isShowHide.value = true)
  try {
    await btn.method(props.row, props.rowIndex)
  } catch (error) {
  } finally {
    if (btn.loading) {
      const timer = setTimeout(() => {
        btn.loading = false
        clearTimeout(timer)
      }, 500)
    }
  }
}

function changeShowHide() {
  isShowHide.value = isShowHide.value === undefined ? true : undefined
}

function finishLoading(label: string) {
  const target = staticBtns.value.find((btn) => btn.label === label)
  if (!target) return
  target.loading = false
}

defineExpose({ changeShowHide, finishLoading })
</script>
<style lang="less" scoped>
.el-button {
  margin-left: 10px;

  &:first-of-type {
    margin-left: 0;
  }
}
.hideBtns {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;

  :deep(.el-button) {
    display: flex;
    justify-content: flex-start;
    margin-left: 0;
    margin: 4px 0;
    margin-left: 0 !important;

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}

.options {
  display: flex;
  align-items: center;
  width: min-content;
}
</style>
