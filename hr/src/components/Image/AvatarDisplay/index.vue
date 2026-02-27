<template>
  <!-- 单个头像 -->
  <!-- 多个叠叠乐 -->
  <div class="avatar-display-wrapper">
    <ul
      class="avatar-display"
      :class="{
        'avatar-display-multiple': displayAvatars.length > 1,
        'avatar-display-single': displayAvatars.length === 1
      }"
    >
      <template v-for="(item, index) in displayAvatars" :key="index">
        <el-tooltip
          v-if="index === displayAvatars.length - 1 && showTooltip"
          effect="light"
          placement="bottom"
          popper-class="avatar-tooltip"
          :teleported="true"
        >
          <template #content>
            <ul class="avatar-tooltip-list">
              <li
                class="avatar-tooltip-item"
                v-for="(avatar, avatarIndex) in avatars"
                :key="`tooltip-avatar-${avatarIndex}`"
              >
                <div
                  v-if="avatarIndex % 3 === 0"
                  :style="{ top: `${(avatarIndex / 3) * 45}px` }"
                  class="split-line"
                ></div>
                <el-avatar
                  :src="avatar.src || DefaultAvatar"
                  :size="size"
                  class="avatar-tooltip-avatar"
                />
                <span class="avatar-tooltip-name" :style="tooltipNameStyle">{{
                  avatar.name || '-'
                }}</span>
              </li>
            </ul>
          </template>
          <li
            class="avatar-display-item"
            :style="{
              '--avatar-margin-left': getAvatarMarginLeft(index),
              '--avatar-z': getAvatarZIndex(index)
            }"
          >
            <el-avatar :src="item.src || DefaultAvatar" :size="size" />
            <span class="name">
              <span class="name-text" :style="nameStyle">{{ item.name || '-' }}</span>
            </span>
          </li>
        </el-tooltip>
        <li
          v-else
          class="avatar-display-item"
          :style="{
            '--avatar-margin-left': getAvatarMarginLeft(index),
            '--avatar-z': getAvatarZIndex(index)
          }"
        >
          <el-avatar :src="item.src || DefaultAvatar" :size="size" />
          <span v-if="index === displayAvatars.length - 1" class="name">
            <span class="name-text" :style="nameStyle">{{ item.name || '-' }}</span>
          </span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import { computed, toRefs } from 'vue'
import type { PropType } from 'vue'

interface Avatar {
  name?: string
  src?: string
}

const props = defineProps({
  avatars: {
    type: Array as PropType<Avatar[]>,
    default: () => []
  },
  size: {
    type: Number,
    default: 20
  },
  nameSize: {
    type: Number,
    default: 14
  },
  nameStyle: {
    type: Object,
    default: () => ({})
  },
  tooltipNameStyle: {
    type: Object,
    default: () => ({})
  },
  limit: {
    type: Number,
    default: 3
  },
  overlapSpacing: {
    type: Number,
    default: 8
  }
})

const { avatars, size, limit, nameSize, nameStyle, tooltipNameStyle } = toRefs(props)

const displayAvatars = computed(() => avatars.value.slice(0, limit.value))
const showTooltip = computed(() => avatars.value.length > 1)
const translateStep = computed(() => props.overlapSpacing - (size.value + 4))

// 改为计算 margin-left,第一个元素不需要 margin
const getAvatarMarginLeft = (index: number) => (index === 0 ? '0px' : `${translateStep.value}px`)

const getAvatarZIndex = (index: number) => `${displayAvatars.value.length + index}`
</script>

<style scoped lang="scss">
.avatar-display {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  width: fit-content;
  padding: 0;

  &.avatar-display-multiple {
    .name {
      background-color: #d5e2ff;
    }
  }

  .avatar-display-item {
    --avatar-margin-left: 0px;
    --avatar-z: 1;
    position: relative;
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 1px;

    margin-left: var(--avatar-margin-left);

    :deep(.el-avatar) {
      position: relative;
      z-index: var(--avatar-z);
      flex-shrink: 0;
    }

    .name {
      color: #3d3d3d;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0px;
      white-space: nowrap;
      position: relative;
      display: flex;
      align-items: center;
      margin-left: calc(-1 * (v-bind(size) * 1px));
      height: 100%;
      padding: 0 8px 0 calc(v-bind(size) * 1px);
      border-radius: calc(v-bind(size) * 1px / 2);

      .name-text {
        font-size: calc(v-bind(nameSize) * 1px);
      }
    }
  }
}
</style>

<!-- 全局样式:需要在全局 CSS 文件中添加,或在 App.vue 的 style 标签中添加(不加 scoped) -->
<style lang="scss">
// 由于 teleported="true",tooltip 会挂载到 body,需要使用全局样式
.avatar-tooltip {
  max-width: 356px !important;
  padding: 16px 20px !important;
  z-index: 9999 !important;

  .el-tooltip__content {
    padding: 16px !important;
    white-space: normal !important;
    min-width: 320px !important;
  }

  .avatar-tooltip-list {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    column-gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
  }

  .avatar-tooltip-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 45px;
    line-height: 45px;
    padding: 0 8px;

    .split-line {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #e5e5e5;
    }
  }

  .avatar-tooltip-name {
    flex-shrink: 0;
    white-space: nowrap;
    font-size: v-bind(nameSize + 'px');
  }

  .avatar-tooltip-avatar {
    transform: unset !important;
  }
}
</style>
