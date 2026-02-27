<script lang="ts" setup>
import { computed } from 'vue' // 1. 引入 computed

defineSlots<{
  default?: () => any
  footer?: () => any
  header?: () => any
}>()

const props = withDefaults(
  defineProps<{
    useScrollBar?: boolean
    bodyStyle?: () => Record<string, string>
  }>(),
  {
    useScrollBar: false,
    bodyStyle: () => ({
      padding: '20px'
    })
  }
)

// 2. 创建计算属性，合并 padding 和自定义样式
const cardBodyStyle = computed(() => {
  return {
    ...props.bodyStyle // 合并 props 中的 bodyStyle
  }
})
</script>

<template>
  <ElCard class="flux-wrap" shadow="never" :body-style="cardBodyStyle">
    <section v-if="$slots.header" class="flux-header">
      <slot name="header"></slot>
    </section>

    <section class="flux-body" :class="{ 'mb-44px': $slots.footer }">
      <el-scrollbar
        v-if="props.useScrollBar"
        class="flux-body-scrollbar"
        :wrap-style="{ overflowX: 'hidden' }"
      >
        <slot></slot>
      </el-scrollbar>
      <slot v-else></slot>
    </section>

    <template v-if="$slots.footer">
      <div class="flux-footer">
        <slot name="footer"></slot>
      </div>
    </template>
  </ElCard>
</template>

<style lang="scss" scoped>
:deep(.el-scrollbar) {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.flux-wrap {
  background: #ffffff;
  // border-color: #ffffff;
  border: unset;
  // box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
  border-radius: 10px;
  height: calc(100vh - 108px);
  position: relative;

  :deep(.el-card__body) {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;

    // 注意：如果在 bodyStyle 中设置了 padding，
    // 这里 flex 布局下的子元素（header/body/footer）可能会受到 padding 的挤压。
    // 如果你的设计是 header/footer 贴边，而只有中间内容有 padding，
    // 那么应该把 bodyStyle 应用在 .flux-body 上，而不是 el-card__body 上。

    .flux-body {
      padding-top: 1px;
      flex: 1;
      height: 0;
      overflow: hidden auto;
    }
    .flux-footer {
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: #fff;
      // 如果 el-card__body 有 padding，footer 的 absolute 定位
      // 可能会需要负 margin 或者调整 left/width 来抵消 padding
      padding: 10px 20px;
      left: 0;
      box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
      min-height: 52px;
      z-index: 1000;
    }
  }
}
</style>
