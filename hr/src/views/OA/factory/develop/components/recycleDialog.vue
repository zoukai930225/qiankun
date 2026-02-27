<template>
  <scheme-dialog ref="recycleDialogRef" name="FactorydevelopRecycleDialog" :width="600">
    <template #card>
      <el-form ref="ruleFormRef" :model="dataValue" :rules="rules" label-width="80" v-loading="loading">
        <el-form-item label="回收原因" prop="recycleReason">
          <el-select
            v-model="dataValue.recycleReason"
            multiple
            filterable
          >
            <el-option
              v-for="item in getIntDictOptions('fs_recycled_reason', true)"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark" v-if="dataValue.recycleReason.includes('006')">
          <s-text-area
            v-model="dataValue.remark"
            placeholder="请输入备注"
            maxlength="200"
            show-word-limit
            :autosize="{ maxRows: 8, minRows: 8 }"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #button>
      <el-button @click="recycleDialogRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-dialog>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { FromProvideType } from '@/components/template/config/type'
import request from '@/config/axios'
import { getIntDictOptions } from '@/utils/dict'
import { cloneDeep, debounce } from 'lodash-es'
const { onSearch } = inject('FactorydevelopForm') as FromProvideType
const message = useMessage() // 消息弹窗

const recycleDialogRef = ref()
const rules = reactive({
  recycleReason: [{ required: true, message: '请选择回收原因', trigger: ['blur', 'change'] }],
  remark: [{required: true, message: '请输入备注', trigger: ['blur', 'change']}]
})

class DataValue {
  fsTaskId: string = ''
  recycleReason: any = []
  remark: string = ''
}
const reset = async () => {
  dataValue.value = new DataValue()
  nextTick(() => {
    ruleFormRef?.value?.resetFields()
  })
}

const ruleFormRef = ref()
const submitForm = debounce(async () => {
  ruleFormRef?.value?.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const data = { ...dataValue.value }
        data.recycleReason = data.recycleReason.join()
        await request.post({
          url: `/workflow-api/api/workflow/business/factorySecondary/recycledProduct/recycle`,
          data
        })
        message.success('操作成功')
        reset()
        recycleDialogRef?.value?.closed()
        onSearch()
      } finally {
        loading.value = false
      }
    }
  })
})

const dataValue = ref(new DataValue()),
  bukValue = ref({}),
  viewType = ref({}),
  title = ref('回收'),
  loading = ref(false)

const openDialog = (item: any, type: string) => {
  recycleDialogRef?.value?.openDialog(
    () => {
      dataValue.value = { ...new DataValue(), fsTaskId: item.id }
      bukValue.value = cloneDeep(dataValue.value)
      viewType.value = type
    },
    () => {
      ruleFormRef?.value?.clearValidate()
      // visible.value = true
    }
  )
}

provide('FactorydevelopRecycleDialogDetails', {
  dataValue,
  bukValue,
  viewType,
  title
})

defineExpose({ openDialog })
</script>

<style scoped lang="scss">
</style>
