<template>
  <s-w-dialog
    :model-value="modelValue"
    title="考核人数"
    width="890"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <el-button
      type="primary"
      class="mb-16px"
      :loading="quickRingLoading"
      :disabled="isAllAssessed || quickRingLoading"
      @click="handleFeishu()"
    >
      <img src="@/assets/svgs/supplier/bell.svg" class="mr-6px" alt="" />
      一键提醒
    </el-button>

    <sw-table :options="assessUserNumTable" :data="tableData" :loading="loading" border>
      <template #options="{ row, index }">
        <s-w-table-btns
          ref="swTableBtnsRef"
          :row="row"
          :options="btnsOptions[index] || []"
          :row-index="index"
          :can-loading-btn="['提醒评分']"
        />
      </template>

      <template #assessmentUser="{ col }">
        <div class="orderHandler">
          <div class="orderHandler-item">
            <el-avatar class="mr8px" :size="18" :src="col?.avatarOrigin || DefaultAvatar" />
            <div class="name">{{ col?.name }}</div>
          </div>
        </div>
      </template>

      <template #isAssessment="{ col }">
        <div class="status" :style="{ color: col?.color, background: col?.bg }">{{
          col?.label
        }}</div>
      </template>
    </sw-table>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import {
  sendQuizNotifyCardApi,
  supplierAssessmentQueryAssessmentUserApi
} from '@/api/supplier/assess'
import SwTable from '../../../components/table.vue'
import { assessUserNumTable } from '../option'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'
import { AuditBtn } from '@/views/supplier/changeAudit/option'
import { toReactive } from '@vueuse/core'

interface Props {
  modelValue: boolean
  rowData: Supplier.Assess.SupplierAssessmentQuizVo
}

interface Emit {
  (e: 'update:model-value', value: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const message = useMessage()

const tableData = ref<Supplier.Assess.SupplierAssessmentUserDto[]>([])
const loading = ref(false)
const quickRingLoading = ref(false)

const isAllAssessed = computed(() => tableData.value.every((row) => row.isAssessment))

/** 计算按钮配置 */
const btnsOptions = computed(
  () =>
    tableData.value.map(({ isAssessment }) => {
      const hideBtns: AuditBtn[] = [
        new AuditBtn('提醒评分', handleFeishu, { disabled: isAssessment })
      ]
      return toReactive(hideBtns)
    }) || []
)

function handleClosed() {
  emit('update:model-value', false)
}

async function getDetail() {
  if (!props.rowData.id) return
  try {
    loading.value = true
    const res = await supplierAssessmentQueryAssessmentUserApi(props.rowData.id)
    if (res) {
      tableData.value = res
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleOpen() {
  getDetail()
}

async function handleFeishu(row?: Supplier.Assess.SupplierAssessmentUserDto) {
  try {
    if (!row) {
      quickRingLoading.value = true
    }

    const res = await sendQuizNotifyCardApi({
      quizId: props.rowData.id || '',
      notifyAll: !row,
      assessmentUserIds: row ? [row.assessmentUserId || ''] : undefined
    })

    if (res.success) {
      message.success('提醒消息已发送')
      getDetail()
    }
  } catch (error) {
  } finally {
    if (!row) {
      quickRingLoading.value = false
    }
  }
}
</script>
<style lang="less" scoped>
@import url(../../../index.scss);
</style>
