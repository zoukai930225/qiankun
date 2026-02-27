<template>
  <el-popover
    :visible="!!isOpenCooperate"
    ref="popoverRef"
    :width="200"
    placement="bottom-end"
    @after-leave="handleAfterLeave"
  >
    <template #reference>
      <el-button link :style="style" type="primary" @click="handleBeforeEnterCooperate">
        <slot>协办</slot>
      </el-button>
    </template>
    <el-form :model="formData" ref="cooperateRef">
      <el-form-item :rules="cooperateRules" prop="assistantId">
        <select-people
          :api="getListApi"
          v-model:list="personList"
          :remote="remote"
          v-model="formData.assistantId"
          :multiple="false"
          placeholder="请选择"
          get-list-method="visible"
        />
      </el-form-item>
    </el-form>
    <div class="flex justify-end">
      <el-button size="small" @click="handleLeaveCooperate"> 取消 </el-button>
      <el-button size="small" type="primary" :loading="loading" @click="handleConfirmAssistant">
        确定
      </el-button>
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
import selectPeople from '../../components/selectPeople.vue'
import { getScPersonsApi } from '@/api/supplier/purchase'
import { FormInstance, PopoverInstance } from 'element-plus'

const props = withDefaults(
  defineProps<{
    row: any
    loading?: boolean
    style?: any
    remote?: boolean
    getListApi?: (...arg: any[]) => Promise<any[]>
  }>(),
  {
    getListApi: getScPersonsApi,
    remote: true
  }
)

const emit = defineEmits(['refresh', 'changeShowHide', 'closeOthers', 'submit'])

const isOpenCooperate = ref(false)
const formData = ref({
  assistantId: ''
})
const cooperateRules = {
  required: true,
  message: '请选择'
}
const cooperateRef = ref<FormInstance>()
const personList = ref<any[]>([])
const popoverRef = ref<PopoverInstance>()
// 1. 请求控制器：用于中断前一次未完成的请求
const abortController = ref<AbortController | null>(null)
// 2. 请求版本号：标记最新请求，仅处理最新版本的响应
const requestId = ref(0)

watch(isOpenCooperate, (val) => val && emit('closeOthers'))

async function handleBeforeEnterCooperate() {
  isOpenCooperate.value = true

  if (!props.remote) {
    try {
      if (abortController.value) {
        abortController.value.abort('新请求触发，中断旧请求')
      }
      abortController.value = new AbortController()
      const currentRequestId = ++requestId.value

      const res = await props.getListApi(abortController.value.signal)
      if (currentRequestId !== requestId.value) return

      personList.value = res
    } catch (error) {}
  }
}

function handleLeaveCooperate() {
  close()
}

async function handleConfirmAssistant() {
  await cooperateRef.value?.validate()
  emit('submit', formData.value.assistantId)
}

function close() {
  popoverRef.value?.hide()
}

function handleAfterLeave() {
  isOpenCooperate.value = false
  cooperateRef.value?.resetFields()
}

defineExpose({ close })
</script>
<style lang="less" scoped>
@import url(../../index.scss);

.el-select-dropdown__item {
  display: flex;
  align-items: center;
  padding-top: 4px;
  padding-bottom: 4px;
  overflow: hidden;
  box-sizing: border-box;
  height: max-content;
  width: 100%;
}
</style>
