<template>
  <div>
    <el-descriptions :column="2" border label-width="86">
      <el-descriptions-item :span="2">
        <template #label>
          <span class="title"> 负责人</span>
        </template>
        <personListPopover :person-list="getSubmitPersonInfo()" :showCount="2" />
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template #label>
          <span class="title"> 计划结束</span>

        </template>
        <span> {{ formatDateTime(formData?.planEndTime) }}</span>
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template #label>
          <span class="title"> 实际结束</span>
        </template>
        <span> {{ formatDateTime(formData?.actualEndTime) }}</span>
      </el-descriptions-item>
    </el-descriptions>
    <el-form label-width="50" v-loading="loading" style="margin-top: 10px;margin-left: -8px;">
      <el-form-item label="备注">
        <s-text-area v-model.trim="formData.remarks" placeholder="请输入" :autosize="{ minRows: 3, maxRows: 3 }"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="附件">
        <transfer :upload-data="{ code: 'NEW_PRODUCT' }" is-btn :width="320" v-model="formData.docUrl" accept-type="all"
          :tip="''" :is-drag="false" :disabled="disabled" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import Transfer from "@/components/common/upload/transfer.vue";
import personListPopover from '@/views/OA/factory/components/personListPopover.vue'
import { formatDateTime } from '@/views/OA/factory/planOld/components/node/nodeOptions'
import {
  handleJSONParse,
} from '@/views/OA/new/product/utils.js'
const props = defineProps({
  formData: {
    type: Object,
    default: () => { }
  },
  disabled: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})


// 获取提交人信息
const getSubmitPersonInfo = () => {
  if (props.formData) {
    if (Number(props.formData.status || '') === 1) {
      // 已结束
      return handleJSONParse(props.formData.submitPersonList || [])
    } else {
      return handleJSONParse(props.formData.personInChargeList || [])
    }
  } else {
    return []
  }
}

</script>

<style lang="scss" scoped>
.inputWrapper {
  height: 32px;
  background: #f8f8f9;
  box-shadow: 0 0 0 1px #e5e5e5 inset;
  padding: 1px 11px;
  border-radius: 4px;
}

.half {
  :deep() {
    .el-form-item__label {
      line-height: 16px;
      text-align: right;
    }
  }
}

.title {
  font-weight: 400;
  font-size: 14px;
  color: #666666;
}
</style>
