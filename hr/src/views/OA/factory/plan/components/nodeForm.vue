<template>
  <div>
    <el-descriptions :column="2" border label-width="79">
      <el-descriptions-item :span="2">
        <template #label>
          负责人
        </template>
        <personListPopover :person-list="data?.responsiblerList" :showCount="2" />
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template #label>
          计划结束
        </template>
        <span> {{ formatDateTime(data?.planEndTime) }}</span>
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template #label>
          实际结束
        </template>
        <span> {{ formatDateTime(data?.actualEndTime) }}</span>
      </el-descriptions-item>
      <el-descriptions-item :span="2" v-if="[0, 1].includes(data?.extraData?.procurementConfirmStatus)">
        <template #label>
          暂定下单原因
        </template>
        <span> {{ data?.extraData?.tentativeOrderReason }}</span>
      </el-descriptions-item>
    </el-descriptions>
    <el-form label-width="50" v-loading="loading" style="margin-top: 20px;">

      <!-- <el-form-item label="负责人">
      <div class="inputWrapper" style="width: 100%;">
        <personListPopover :person-list="data?.responsiblerList" :showCount="2" />
      </div>
    </el-form-item>
    <el-form-item label="节点计划结束时间" class="half">
      <el-input disabled :value="formatDateTime(data?.planEndTime)" />
    </el-form-item> -->
      <el-form-item label="备注">
        <s-text-area :value="data?.comment" disabled v-if="disabled" />
        <s-text-area v-model="formData.auditComment" v-else />
      </el-form-item>
      <el-form-item label="附件">
        <transfer :upLoad-data="{ code: 'FS_SUPPLIER_PLAN' }" is-btn v-model="formData.auditFile" accept-type="all"
          width="300" :tip="''" :is-drag="false" :disabled="disabled" />
        <!-- <uploadFile :business-code="'FS_SUPPLIER_PLAN'" v-model:model-value="attachUrls" disabled v-if="disabled"
          :showBtnStyle="true" :width="230" />
        <uploadFile :business-code="'FS_SUPPLIER_PLAN'" v-model:model-value="formData.auditFile" v-else
          :showBtnStyle="true" :width="230" /> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import Transfer from "@/components/common/upload/transfer.vue";
import personListPopover from '@/views/OA/factory/components/personListPopover.vue'
import { formatDateTime } from '@/views/OA/factory/planOld/components/node/nodeOptions'
const props = defineProps({
  data: {
    type: Object,
    default: () => { }
  },
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

const attachUrls = computed(() => {
  if (props.data?.attachmentUrl) {
    return props.data?.attachmentUrl.split(',').map((url: string) => ({ url }))
  } else {
    return []
  }
})

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

:deep(.el-descriptions__label) {
  font-weight: normal !important;
}

:deep(.file_list) {}
</style>
