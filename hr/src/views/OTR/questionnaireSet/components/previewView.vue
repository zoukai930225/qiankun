<!--
 * @Date: 2024-10-12 14:05:20
-->
<template>
  <div>
    <Dialog v-model="dialogTableVisible" title="预览问卷" width="95%" @close="close">
      <div class="title">{{ detail?.surveyName }}</div>
      <div class="wapper">
        <div class="content">
          <div style="margin-bottom: 18px" v-for="item in detail?.programDtoList" :key="item.id">
            <PreviewSingleChoice v-if="item.type == 0" :detail="item" :review="true" />
            <PreviewEssayQuestions v-if="item.type == 1" :detail="item" :review="true" />
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import PreviewSingleChoice from './previewSingleChoice.vue'
import PreviewEssayQuestions from './previewEssayQuestions.vue'
const dialogTableVisible = ref(false)

const detail = ref()
// 打开
const open = (res) => {
  dialogTableVisible.value = true
  detail.value = res
}

const close = () => {
  detail.value = {}
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.wapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .content {
    width: 800px;
  }
}
</style>
<style scoped>
:deep(.el-dialog) {
  padding: 0px;
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}
:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  max-height: 85vh;
  min-height: 85vh;
}
:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
.title {
  text-align: center;
  font-weight: 600;
  margin-bottom: 40px;
}
</style>
