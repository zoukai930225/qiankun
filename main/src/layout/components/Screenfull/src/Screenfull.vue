<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'

defineOptions({ name: 'ScreenFull' })

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('screenfull')

defineProps({
  color: propTypes.string.def('')
})

const { toggle, isFullscreen } = useFullscreen()

const toggleFullscreen = () => {
  toggle()
}
</script>

<template>
  <div :class="[prefixCls, 'user-message']" @click="toggleFullscreen">
    <!-- <Icon class="item" color="#666" :icon="isFullscreen ? 'zmdi:fullscreen-exit' : 'ep:FullScreen'" :size="18" /> -->
    <el-icon class="item" color="#666" :size="18">
      <FullScreen v-if="!isFullscreen" />
      <Aim v-else />
    </el-icon>
    <div class="tips">{{ isFullscreen ? '退出全屏' : '全屏' }}</div>
  </div>
</template>

<style lang="scss" scoped>
.user-message {
  font-family: PingFang SC;
  font-size: 13px;
  height: 49px;
  color: #666666;
  text-align: center;

  &:hover {
    .item {
      color: #0064FF !important;
    }
  }

  .item {
    margin: 0 auto;
    margin-top: 5px;
    height: 20px;
    line-height: 20px;
  }

  .tips {
    height: 20px;
    line-height: 20px;
    display: inline-block;

  }
}
</style>
