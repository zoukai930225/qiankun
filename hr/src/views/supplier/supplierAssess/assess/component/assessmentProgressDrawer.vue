<template>
  <s-w-drawer :model-value="modelValue" :title="title" @open="handleOpen" @closed="handleClosed">
    <assessment-progress-content ref="contentRef" v-bind="props" :editable="true" />

    <template #footer>
      <el-button @click="handleClosed">取消</el-button>
      <el-button
        type="primary"
        v-if="isAnyAssessPerson && permissionSet.has('SupplierAssess:Check:Progress:Save')"
        @click="handleSubmit"
        >保存</el-button
      >
    </template>
  </s-w-drawer>
</template>

<script lang="ts">
// 类型定义
export interface Props {
  modelValue: boolean
  rowData: Supplier.Assess.SupplierAssessmentQuizVo
  title?: string
  api?: (params: any) => Promise<any>
}

export interface Emit {
  (e: 'update:model-value', value: boolean): void
  (e: 'refresh'): void
}
</script>

<script lang="ts" setup>
import {
  supplierAssessmentQueryAssessmentProgressApi,
  supplierAssessmentSaveQuiz
} from '@/api/supplier/assess'
import assessmentProgressContent from './assessmentProgressContent.vue'
import { getPermission } from '@/utils'

const message = useMessage()

// Props和Emit
const props = withDefaults(defineProps<Props>(), {
  title: '考核进度',
  api: supplierAssessmentQueryAssessmentProgressApi
})
const emit = defineEmits<Emit>()

const permissionSet = new Set(getPermission())

// 状态管理
const requestAbortController = ref<AbortController | null>(null)
const contentRef = ref<InstanceType<typeof assessmentProgressContent>>()

// 处理抽屉关闭
function handleClosed() {
  emit('update:model-value', false)
  contentRef.value?.expendClose()
}

async function handleSubmit() {
  await contentRef.value?.validate()

  try {
    const res = await supplierAssessmentSaveQuiz({
      ...props.rowData,
      detailList: contentRef.value?.progressInfo.flat().flat(),
      quizId: props.rowData.id
    })

    if (!res.success) return
    message.success('保存成功！')
    handleClosed()
    emit('refresh')
  } catch (error) {}
}

// 判断当前用户是不是任一模块的考核人
const isAnyAssessPerson = computed(() =>
  contentRef.value?.progressInfo.flat().some((progress) => progress.ratable)
)

// 处理抽屉打开
async function handleOpen() {
  await contentRef.value?.getDetail()
}

// 组件卸载前清理
onBeforeUnmount(() => {
  if (requestAbortController.value) {
    requestAbortController.value.abort()
  }
})
</script>
<style lang="less" scoped>
@import url(../../../index.scss);

// 空状态样式
.empty-state {
  padding: 40px 0;
  text-align: center;
}

// 卡片样式
.content {
  margin-bottom: 12px;

  :deep(.el-card__header) {
    padding: 15px;
    padding-bottom: 10px;
  }

  :deep(.el-card__body) {
    padding: 15px;
    overflow: hidden;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  :deep(.el-card__footer) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

// 隐藏状态
.hide {
  :deep(.el-card__body) {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }

  :deep(.el-card__footer) {
    border-top: 0;
  }
}

// 标题样式
.title {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;

  &::before {
    content: '';
    display: block;
    margin-right: 6px;
    width: 3px;
    height: 10px;
    background-color: #0064ff;
  }
}

// 考核人员样式
.assess-persons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 5px 0;
}

.order-handler-item {
  align-items: center;
}

.assessment-item {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}

// 状态标签样式
.status {
  border-radius: 14px;
  font-size: 14px;
}
</style>
