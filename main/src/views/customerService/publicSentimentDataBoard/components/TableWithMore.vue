<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2026-01-12 18:36:14
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-01-13 09:38:56
-->
<!--
 * @Description: 带"更多"功能的表格组件
 * 支持限制显示行数，点击"更多"在弹窗中展示完整数据
-->
<template>
  <div class="table-with-more">
    <!-- 主表格区域 -->
    <div class="table-container">
      <el-table :data="displayData" border v-bind="$attrs">
        <slot />
      </el-table>
    </div>

    <!-- 完整数据弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="dialog-table-wrapper">
        <el-table :data="tableData" border max-height="500px" v-bind="$attrs">
          <slot />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'

interface Props {
  tableData: any[] // 完整表格数据
  displayLimit?: number // 主表格显示的行数限制，默认5条
  dialogTitle?: string // 弹窗标题
}

const props = withDefaults(defineProps<Props>(), {
  displayLimit: 5,
  dialogTitle: '完整数据'
})

// 弹窗显示状态
const dialogVisible = ref(false)

// 主表格显示的数据（限制行数）
const displayData = computed(() => {
  return props.tableData.slice(0, props.displayLimit)
})

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true
}

defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>
@use '../style.scss';
</style>
