<template>
  <div class="feature-descriptions-wrapper" :class="[`order-${(index % 5) + 1}`]">
    <div class="custom-descriptions-table">
      <div class="custom-descriptions-row index-row">
        <div
          :class="`custom-descriptions-label index-label index-label-${index + 1} draggable-handle`"
          style="width: 120px"
          title="点击拖拽卡片调整顺序"
        >
          {{ index + 1 }}
        </div>

        <div class="custom-descriptions-content feature-card-actions">
          <div v-if="isEdit" class="actions-wrapper">
            <el-button link type="primary" :icon="Edit" @click="handleEdit">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button link type="danger" :icon="Delete" @click="handleDel">删除</el-button>
          </div>
        </div>
      </div>

      <div
        v-for="(field, i) in dataFields"
        :key="i"
        class="custom-descriptions-row data-row"
        :class="{ 'image-row': field.isImage }"
      >
        <div
          class="custom-descriptions-label data-row-label"
          :class="{
            'image-row-label': field.isImage,
            'normal-row-label': !field.isImage
          }"
          style="width: 120px"
        >
          {{ field.label }}
        </div>

        <div
          class="custom-descriptions-content data-row-content"
          :class="{
            'image-row-content': field.isImage,
            'normal-row-content': !field.isImage
          }"
        >
          <template v-if="field.isImage">
            <el-image
              :src="getNestedValue(forms, field.key)"
              style="width: 50px; height: 50px"
              :preview-teleported="true"
              :preview-src-list="[getNestedValue(forms, field.key)]"
              v-if="getNestedValue(forms, field.key)"
            />
          </template>

          <template v-else-if="field.isLink">
            <el-scrollbar class="scrollable-content">
              <el-link type="primary" :underline="false" target="_blank">
                {{ getNestedValue(forms, field.key) }}
              </el-link>
            </el-scrollbar>
          </template>
           <template v-else-if="field.isBoolean">
            <el-scrollbar class="scrollable-content">
              {{ getNestedValue(forms, field.key) ? '是' : '否' }}
            </el-scrollbar>
          </template>

          <template v-else>
            <el-scrollbar class="scrollable-content">
              {{ getNestedValue(forms, field.key) }}
            </el-scrollbar>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import { ElButton, ElDivider, ElImage, ElLink } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'

const getNestedValue = (obj: any, path: string) => {
  if (!obj || !path) return ''
  const parts = path.split('.')
  let current = obj
  for (const part of parts) {
    if (current === null || current === undefined) {
      return ''
    }
    current = current[part]
  }
  return current !== null && current !== undefined ? current : ''
}

export interface DescriptionField {
  label: string
  key: string
  isImage?: boolean
  isLink?: boolean
  isBoolean?: boolean
}

interface GenericForm extends Record<string, any> {
  id: string
}

const props = defineProps<{
  /** 描述卡片的数据对象 */
  forms: GenericForm
  /** 当前卡片在列表中的索引 */
  index: number
  /** 是否处于编辑模式 */
  isEdit: boolean
  /** 定义卡片中需要展示的字段和顺序 */
  dataFields: DescriptionField[]
  /** 触发事件时带入的类型（'features', 'competitor', 'sellingPoint'） */
  cardType: 'features' | 'competitor' | 'sellingPoint'
}>()

const emit = defineEmits<{
  (e: 'delete', id: string, type: string): void
  (e: 'update', type: string, id: string): void
}>()

const handleEdit = () => {
  emit('update', props.cardType, props.forms.id)
}

const handleDel = () => {
  emit('delete', props.forms.id, props.cardType)
}
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

// 颜色变量
$label-default-bg: #f4f6fa;
$label-color: #666666;
$content-color: #333333;
$border-color: #e5e5e5;
$index-color-1: #ffc7b5;
$index-color-2: #dcf3dc;
$index-color-3: rgba(255, 242, 204, 1);
$index-color-4: rgba(204, 239, 255, 1);

// 通用行高和内边距
$padding-vertical: 12px;
$padding-horizontal: 10px;

.feature-descriptions-wrapper {
  margin-bottom: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #f8f8f9;
}

.custom-descriptions-table {
  display: grid;
  // 定义两列：120px 标签列 和 剩余空间 内容列
  grid-template-columns: 120px 1fr;
  // 仅在最外层设置左边框和上边框，内部单元格设置右边框和下边框
  border: 1px solid $border-color;
  border-bottom: none; // 边框通过单元格底部边框实现

  // 拖拽手柄样式：仅在可编辑时生效
  // .feature-descriptions-wrapper:has(.actions-wrapper) & {
  //   cursor: grab;
  //   &:active {
  //     cursor: grabbing;
  //   }
  // }
}

.custom-descriptions-row {
  display: contents; // 允许子元素直接参与父容器的 grid 布局
}

.custom-descriptions-label,
.custom-descriptions-content {
  // 默认样式，模拟 el-descriptions__cell
  padding: $padding-vertical $padding-horizontal;
  border-bottom: 1px solid $border-color;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.5;
  word-break: break-all;
  overflow-wrap: anywhere;
}

/* --- 标签列 (Label Column) 样式 --- */
.custom-descriptions-label {
  // 定位到第一列
  grid-column: 1 / 2;
  background-color: $label-default-bg;
  color: $label-color;
  border-right: 1px solid $border-color;
  vertical-align: middle;
  font-weight: normal;
  // display: flex;
  align-items: center;
}

/* --- 内容列 (Content Column) 样式 --- */
.custom-descriptions-content {
  // 定位到第二列
  grid-column: 2 / 3;
  background-color: white; // 内容区域默认白色背景
  color: $content-color;
}

/* --- 第一行: 索引和操作按钮 --- */
.index-row {
  // 编号文本样式
  .index-label {
    font-size: 14px;
    font-weight: bold;
    color: #333 !important;
    display: flex;
    align-items: center;

    // 拖拽手柄的光标样式：根据卡片内是否有 actions-wrapper（即是否为编辑模式）来决定
    // .feature-descriptions-wrapper:has(.actions-wrapper) & {
    //   cursor: grab;
    //   &:active {
    //     cursor: grabbing;
    //   }
    // }
  }

  // 动态索引标签背景色
  .index-label-1 {
    background-color: $index-color-1 !important;
  }
  .index-label-2 {
    background-color: $index-color-2 !important;
  }
  .index-label-3 {
    background-color: $index-color-3 !important;
  }
  .index-label-4 {
    background-color: $index-color-4 !important;
  }
  .index-label-5 {
    background-color: $label-default-bg !important;
  } // 默认颜色

  // 操作区域样式
  .feature-card-actions {
    height: 59px; // 保持与标签列对齐
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    background-color: #f8f8f9;
  }
}

/* --- 数据行: 图片和普通行 --- */

// 图片行
.image-row-label,
.image-row-content {
  // 图片行高度限制
  height: 73px;
  display: flex; // 确保图片居中或对齐
  align-items: center;
}
.image-row-label {
  vertical-align: middle;
}

// 普通行 (文本/链接)
.normal-row-label {
  height: 104px;
  vertical-align: top; // 标签从顶部开始对齐
}

.normal-row-content {
  height: 104px;
  // 内容区域是滚动条的父容器，取消默认 padding
  padding: 0;
  display: block; // 确保块级显示，以便子元素控制高度和滚动
}

// 需要滚动的内容 wrapper
.scrollable-content {
  height: 100%; // 占满父容器 155px
  overflow-y: auto; // 启用滚动条
  padding: $padding-vertical $padding-horizontal; // 滚动区域的内部 padding
}

// 链接的样式调整
.link-content {
  // 链接不需要滚动，使用默认 padding
  padding: $padding-vertical 0;
  display: block;
}
.link-content :deep(.el-link__inner) {
  word-break: break-all;
}

/* --- 拖拽时的动画和样式 --- */

// 拖拽中的元素的样式（vuedraggable 默认类）
:deep(.sortable-ghost) {
  opacity: 0.4; // 拖拽占位符半透明
  background: #c8ebfb;
}

// 正在拖拽的元素的样式（vuedraggable 默认类）
:deep(.sortable-chosen) {
  opacity: 1;
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, 0.1),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05); // 增加阴影以突出显示
}

// 添加过渡效果，让非拖拽元素的移动更平滑
.feature-descriptions-wrapper {
  transition: all 0.3s ease;
}

:deep(.el-scrollbar) {
  .el-scrollbar__view {
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
