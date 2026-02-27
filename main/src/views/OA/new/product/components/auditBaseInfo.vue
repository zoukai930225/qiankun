<!--
 * @Date: 2025-07-12 10:59:18
-->
<template>
  <div class="audit-base-info">
    <!-- 标题区域 -->
    <div class="header">
      <span class="desc"></span>
      <div class="title">基础信息</div>
    </div>

    <!-- 中间内容区域 -->
    <div class="content">
      <div class="item header-item-wapper" v-if="selectedItems?.length > 0">
        <div class="row item-wapper header-item">
          <div class="size">颜色</div>
          <div class="size">尺寸</div>
        </div>
      </div>
      <div class="item" v-for="(item, index) in selectedItems" :key="index">
        <div class="row item-wapper">
          <div class="size">{{ item.color }}</div>
          <div class="size">{{ item.size }}</div>
        </div>
      </div>
    </div>

    <!-- 审核按钮区域 -->
    <div class="footer">
      <el-button
        type="primary"
        v-if="showSubmitButtonFlag"
        :loading="btnLoading"
        @click="handleSubmit"
        >提交</el-button
      >
      <el-button type="primary" v-if="showAuditButtonFlag" @click="handleAudit">审核</el-button>
    </div>

    <!-- 审核 -->
    <AuditDialog
      ref="auditDialogRef"
      @success="handleAuditSuccess"
      :selectedItems="selectedItems"
      :designPictureGodownId="designPictureGodownId"
    />
  </div>
</template>

<script lang="ts" setup>
import AuditDialog from './auditDialog.vue'

import { submitPrenatalSample } from '@/api/oa/new/develop'
const message = useMessage() // 消息弹窗

const props = defineProps({
  selectedItems: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  designPictureGodownId: {
    type: String,
    default: ''
  },
  examineButtonFlag: {
    //是否展示审核按钮
    type: Boolean,
    default: false
  },
  submitButtonFlag: {
    //是否展示提交按钮
    type: Boolean,
    default: false
  }
})

const auditDialogRef = ref()

const showSubmitButtonFlag = computed(() => {
  return (
    props.submitButtonFlag && //有权限
    props.selectedItems.length > 0 && //有选中项
    props.selectedItems[0].isSubmit == 1 //有后端标识
  )
})

const handleAudit = () => {
  if (props.selectedItems.length == 0) {
    message.error('请至少选择一项产前样信息进行审核')
    return
  }
  // 处理审核逻辑
  if (auditDialogRef?.value) {
    auditDialogRef.value.open(props.selectedItems)
  }
}

const showAuditButtonFlag = computed(() => {
  // 审核按钮
  return (
    props.examineButtonFlag && //有后端标识
    props.selectedItems.length > 0 && //有选中项
    props.selectedItems[0].status == 2 &&
    props.selectedItems[0].isExamine == 1
  )
})

const emit = defineEmits(['submit'])

const btnLoading = ref(false)
const handleSubmit = async () => {
  try {
    // 提交逻辑
    if (props.selectedItems.length == 0) {
      message.error('请至少选择一项产前样信息进行提交')
      return
    }

    // 二次确认
    const confirm = await message.confirm('确认提交产前样信息吗？')
    if (!confirm) return
    // 可以在这里添加提交逻辑
    btnLoading.value = true
    const data = {
      designPictureGodownId: props.selectedItems[0].designPictureGodownId,
      npPrenatalSampleInfoList: props.selectedItems.map((item) => {
        return {
          id: item.id,
          color: item.color,
          size: item.size
        }
      })
    }
    await submitPrenatalSample(data)
    btnLoading.value = false
    emit('submit')
    message.success('提交成功')
  } catch (error) {
    btnLoading.value = false
    message.error('提交失败')
  }
}

const handleAuditSuccess = () => {
  emit('submit')
}
</script>

<style lang="scss" scoped>
.audit-base-info {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  height: 507px;
}

.header {
  flex: 0 0 auto;
  padding: 16px 20px;
  box-sizing: border-box;
  border-color: #f0f0f0;
  background: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 8px 8px 0 0;

  .desc {
    background: #0064ff;
    display: inline-block;
    width: 3px;
    height: 10px;
    margin-right: 6px;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0px;
    color: #333333;
  }
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #ffffff;

  .item {
    margin-bottom: 14px;
    border-bottom: 1px solid #e5e5e5;
    box-sizing: border-box;
    .row {
      display: flex;
      margin-bottom: 12px;
    }
    .item-wapper {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .size {
      flex: 1;
      padding-left: 14px;
      box-sizing: border-box;
      color: #333333;
      font-size: 14px;
    }
    .header-item {
      background: #f4f6fa;
      margin-bottom: 0;
      padding: 15px 0;
      box-sizing: border-box;
      .size {
        color: #666666;
      }
    }
  }
  .header-item-wapper {
    border-bottom: none;
    background: #f4f6fa;
  }
}

.footer {
  flex: 0 0 auto;
  padding: 10px 20px;
  box-sizing: border-box;
  text-align: right;
  background: #ffffff;
  border-top: 1px solid #eceaea;
  border-radius: 0 0 8px 8px;
}

.row-center {
  width: 100%;
}

.shenhe {
  display: flex;
  flex-direction: column;
  align-items: start;

  .title {
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    letter-spacing: 0px;
    font-variation-settings: 'opsz' auto;
    /* 文字/一级 */
    color: #333333;
    margin-bottom: 26px;
  }
}
</style>
