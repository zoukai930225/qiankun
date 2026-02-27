<template>
  <div class="feature-descriptions-wrapper">
    <el-descriptions :column="1" border size="default" class="form-descriptions" id="form-descriptions"
      label-width="100px">
      <el-descriptions-item :label="`${index + 1}`" class-name="form-descriptions-item-content"
        label-class-name="form-descriptions-item-label">
        <div v-if="isEdit" class="feature-card-actions">
          <el-button link type="primary" :icon="Edit" @click="handleEdit" size="small">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" :icon="Delete" @click="handleDel" size="small">删除</el-button>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="属性（款式，材质，工艺，参数）">
        <div class="long-text-content">{{ forms.attributeType }}</div>
      </el-descriptions-item>

      <el-descriptions-item label="属性用处">
        <div class="long-text-content">{{ forms.attributeUse }}</div>
      </el-descriptions-item>

      <el-descriptions-item label="用处的优势">
        <div class="long-text-content">{{ forms.advantage }}</div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { ElDescriptions, ElDescriptionsItem, ElButton } from 'element-plus';
import { Edit, Delete } from '@element-plus/icons-vue';

// 定义接口以规范数据结构
interface FeatureForm {
  id: string;
  attributeType: string;
  attributeUse: string;
  advantage: string;
  [key: string]: any;
}

const props = defineProps<{
  forms: FeatureForm;
  index: number;
  isEdit: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete', id: string, type: string): void;
  (e: 'update', type: string, id: string): void;
}>();

const handleEdit = () => {
  emit('update', 'features', props.forms.id);
};

const handleDel = () => {
  emit('delete', props.forms.id, 'features');
};
</script>

<style scoped lang="scss">
.feature-descriptions-wrapper {
  // 保持与原 featureCard 相同的宽度，并设置底部间距
  width: 427px;
  margin-bottom: 20px;
  border-radius: 4px;
  overflow: hidden; // 确保边框和圆角正确显示
  background: #f8f8f9; // 背景色与原卡片相同

  /* 模拟原卡片的编号颜色主题 */
  :deep(#form-descriptions) {

    // 编号文本样式

    .form-descriptions-item-label {
      font-size: 14px;
      font-weight: bold;
      color: #333 !important;
      // line-height: 22px;
    }

    .form-descriptions-item-content {
      // display: flex;
      // align-items: center;
      // line-height: 18px;
    }

    .feature-card-actions {
      // height: 100%;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    }
  }
}
</style>
