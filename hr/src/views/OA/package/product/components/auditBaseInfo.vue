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
      <div class="item" v-for="(item, index) in selectedItems" :key="index">
        <div class="row">
          <div class="input row">
            <div style="width: 50px" class="title">颜色</div>
            <div class="desc-input">{{ item.color }}</div>
          </div>
          <div class="input row">
            <div style="width: 50px" class="title">尺码</div>
            <div class="desc-input">{{ item.size }}</div>
          </div>
        </div>
        <!-- 提交人看的 -->
        <div class="row-center" v-if="submitButtonFlag">
          <SWUploadFile ref="swUploadFileRef" v-model:modelValue="item.prenatalSamplePictureUrl" :onlyUploadImg="true"
            :width="386" :limit="1" :enableEdit="showSubmitButtonFlag" />
        </div>
        <!--  审核人看的-->
        <div class="row-center shenhe" v-if="examineButtonFlag && item?.prenatalSamplePictureUrl">
          <div class="title">已上传文件</div>
          <div>
            <el-image style="width: 34px; height: 34px" :src="item?.prenatalSamplePictureUrl[0]?.url" :zoom-rate="1.2"
              :max-scale="7" :min-scale="0.2" :preview-src-list="[item?.prenatalSamplePictureUrl[0]?.url]" show-progress
              :initial-index="4" fit="cover" />
          </div>
        </div>
      </div>
    </div>

    <!-- 审核按钮区域 -->
    <div class="footer">
      <el-button type="primary" v-if="showSubmitButtonFlag" :loading="btnLoading" @click="handleSubmit">提交</el-button>
      <el-button type="primary" v-if="showAuditButtonFlag" @click="handleAudit">审核</el-button>
    </div>

    <!-- 审核 -->
    <AuditDialog ref="auditDialogRef" @success="handleAuditSuccess" :selectedItems="selectedItems"
      :designPictureGodownId="designPictureGodownId" />
  </div>
</template>

<script lang="ts" setup>
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
import AuditDialog from './auditDialog.vue'

import { submitPrenatalSample } from '@/api/oa/new/develop'
import { emit } from 'process'
const message = useMessage() // 消息弹窗

const props = defineProps({
  selectedItems: {
    type: Array,
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
  },
  isBatch: {
    //是否批量操作
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
    if (!props.selectedItems[0].prenatalSamplePictureUrl[0]?.url) {
      message.error('请上传产前样图片')
      return
    }

    // 二次确认
    const confirm = await message.confirm('确认提交产前样信息吗？')
    if (!confirm) return
    // 可以在这里添加提交逻辑
    btnLoading.value = true
    const data = {
      id: props.selectedItems[0].id,
      designPictureGodownId: props.selectedItems[0].designPictureGodownId,
      prenatalSamplePictureUrl: props.selectedItems[0].prenatalSamplePictureUrl[0]?.url || ''
    }
    await submitPrenatalSample(data)
    btnLoading.value = false
    emit('submit') // 提交后隐藏提交按钮
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
  // height: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  height: 507px;
  // overflow-y: scroll;
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
    margin-bottom: 16px;
    border-bottom: 1px solid #eceaea;
    padding-bottom: 27px;
    box-sizing: border-box;

    .row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;

      .input {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;

        .title {
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: normal;
          line-height: normal;
          text-align: right;
          letter-spacing: 0px;
          font-variation-settings: 'opsz' auto;
          /* 文字/一级 */
          color: #333333;
        }

        .desc-input {
          width: 100%;
          padding: 0px 10px 0px 12px;
          height: 36px;
          line-height: 36px;
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: normal;
          letter-spacing: 0px;
          font-variation-settings: 'opsz' auto;
          /* 文字/一级 */
          color: #333333;
          background: #f8f8f9;
          box-sizing: border-box;
          border: 1px solid #e5e5e5;
        }
      }
    }

    .uploaded-files {
      .title-desc {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: normal;
        line-height: 20px;
        letter-spacing: 0px;
        font-variation-settings: 'opsz' auto;
        /* 文字/一级 */
        color: #333333;
      }

      .file {
        display: flex;
        align-items: center;
        gap: 8px;

        .file-img {
          width: 50px;
          height: 50px;
          border-radius: 4px;
          object-fit: cover;
        }

        .file-name {
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}

.footer {
  flex: 0 0 auto;
  padding: 10px 20px;
  box-sizing: border-box;
  background: #f8f8f9;
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
