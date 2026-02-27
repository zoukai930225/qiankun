<template>
  <el-dialog
    :append-to-body="false"
    class="commomDialig executeDialog"
    v-model="visible"
    destroy-on-close
  >
    <el-form
      ref="executeFormRef"
      :model="executePostData"
      :rules="executeFormRules"
      v-loading="formLoading"
      label-width="100px"
    >
      <el-form-item label="执行类型" prop="executeType">
        <el-select
          v-model="executePostData.executeType"
          placeholder="请选择"
          value-on-clear=""
          style="width: 240px"
          @change="executeTypeChange"
        >
          <el-option
            v-for="dict in getRpaTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行时间" prop="restockTime" v-if="executePostData.executeType !== '1'">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width: 240px; box-sizing: border-box"
        />
      </el-form-item>

      <el-form-item label="影刀登录账户" prop="loginUserName" v-if="isRPA">
        <el-select
          v-model="executePostData.loginUserName"
          placeholder="请选择"
          value-on-clear=""
          filterable
          style="width: 240px"
        >
          <el-option
            v-for="dict in nodeList"
            :key="dict.id"
            :label="dict.loginUserName"
            :value="dict.loginUserName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="运行环境" prop="runEnvironment" v-if="isRPA">
        <el-select
          class="searchFormItemWidth"
          v-model="executePostData.runEnvironment"
          placeholder="请选择"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM, true)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :disabled="formLoading" @click="submitExecuteForm">执 行</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { executeRpaApplication } from '@/api/rpaManage'
import * as NodeManageAccountApi from '@/api/rpaManage/nodeManage'

const message = useMessage()

const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  row: { type: Object, default: () => ({}) }
})

const visible = ref<boolean>(false)
const formLoading = ref<boolean>(false)
const executeFormRef = ref()
const dateRange = ref<string[]>([])
const serviceCode = ref<string>('')
const nodeList = ref<any[]>([])
const isRPA = ref<boolean>(false)
const recordId = ref<string | number>('')

// 仅保留必要参数

const executeFormRules = {
  executeType: [
    {
      required: true,
      message: '请选择执行类型',
      trigger: ['change']
    }
  ]
}

// 执行 - 执行类型下拉选项（与列表页保持一致，去掉“重新执行”选项值=3）
const getRpaTypeOptions = computed(() => {
  const options = getIntDictOptions(DICT_TYPE.RPA_UNIFIED_TYPE, true)
  return options.filter((item) => item.value !== '3')
})

interface ExecuteForm {
  executeType: string
  restockTime: string
  restockEndTime: string
  loginUserName?: string
  runEnvironment?: string | number
}
const executePostData = ref<ExecuteForm>({
  executeType: '1',
  restockTime: '',
  restockEndTime: ''
})

const resetForm = () => {
  executePostData.value = {
    executeType: '1',
    restockTime: '',
    restockEndTime: ''
  }
  dateRange.value = []
}

const executeTypeChange = () => {
  dateRange.value = []
}

// 打开弹窗时初始化
watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
    if (val) {
      resetForm()
      // 仅取 serviceCode 用于提交
      const r: any = props.row || {}
      serviceCode.value = r.serviceCode || ''
      recordId.value = r.id || ''
      // 同步 isRPA 逻辑：与 rpaManage/listIndex.vue 一致
      isRPA.value = r.typeCategory === 'RPA'
      if (isRPA.value) {
        executePostData.value.loginUserName = r.loginUserName || ''
        executePostData.value.runEnvironment = r.runEnvironment || ''
      }
    }
  }
)

watch(
  () => visible.value,
  (val) => emit('update:modelValue', val)
)

onMounted(async () => {
  const data = await NodeManageAccountApi.getNodeManageList({ page: 1, size: 99999 })
  nodeList.value = data?.data || []
})

// 仅提交 serviceCode + executeType + restockTime + restockEndTime
const submitExecuteForm = async () => {
  if (!executeFormRef.value) return
  const valid = await executeFormRef.value.validate()
  if (!valid) return
  try {
    formLoading.value = true
    if (dateRange.value && dateRange.value.length > 0) {
      executePostData.value.restockTime = dateRange.value[0]
      executePostData.value.restockEndTime = dateRange.value[1]
    }

    const postData: any = {
      id: recordId.value,
      serviceCode: serviceCode.value,
      executeType: executePostData.value.executeType,
      restockTime: executePostData.value.restockTime,
      restockEndTime: executePostData.value.restockEndTime
    }
    if (isRPA.value) {
      if (executePostData.value.loginUserName)
        postData.loginUserName = executePostData.value.loginUserName
      if (
        executePostData.value.runEnvironment !== undefined &&
        executePostData.value.runEnvironment !== ''
      ) {
        postData.runEnvironment = executePostData.value.runEnvironment
      }
    }

    await executeRpaApplication(postData)
    message.success('执行成功')
    visible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-form) {
  .el-form-item {
    // margin: 0 20px 18px 0;
    // margin-bottom: unset;
  }

  .el-select,
  .el-date-editor,
  .el-input {
    width: 240px;
    box-sizing: border-box;
    .el-input__wrapper {
      padding-top: unset;
      padding-bottom: unset;
    }
  }
}
</style>
<style lang="scss">
.executeDialog {
  width: 420px;
  background: linear-gradient(
    226deg,
    #f2f3ff 0%,
    #ffffff 39%,
    #ffffff 88%,
    #e8f6fd 95%,
    #f0f8ff 100%
  );
  border-radius: 14px;
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}
</style>
