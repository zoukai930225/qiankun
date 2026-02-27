<template>
  <el-dialog
    class="commomDialig"
    v-model="dialogVisible"
    :title="''"
    style="
      background: linear-gradient(
        226deg,
        #f2f3ff 0%,
        #ffffff 39%,
        #ffffff 88%,
        #e8f6fd 95%,
        #f0f8ff 100%
      );
      border-radius: 14px;
      width: 420px;
      height: 211px;
    "
  >
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin: 20px 0 10px;
      "
    >
      <el-form
        class="dialogForm"
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
      >
        <el-form-item label="" prop="executeType">
          <el-select
            class="dialogFormItemWidth"
            v-model="formData.executeType"
            placeholder="请选择"
            clearable
            @change="handleTypeChange"
            prefix-icon="Search"
            style="width: 380px"
          >
            <template #prefix>
              <img src="@/assets/imgs/feishuSend/date.png" alt="" style="width: 12px" />
            </template>
            <el-option
              v-for="dict in typeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-select
          v-if="formData.executeType !== '1'"
          style="width: 150px; margin-right: 20px"
          v-model="formData.date"
          placeholder="请选择"
          clearable
        >
          <template #prefix>
            <img src="@/assets/imgs/feishuSend/date.png" alt="" style="width: 12px" />
          </template>
          <el-option
            v-for="dict in dataList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>

        <el-time-picker
          v-model="formData.executeTime"
          popper-class="pickTime"
          placeholder="请选择时间"
          :style="{ width: formData.executeType === '1' ? '380px' : '210px' }"
        />
      </el-form>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">保 存</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import * as StoreApi from '@/api/system/store'
import { Search } from '@element-plus/icons-vue'
defineOptions({ name: 'StoreFormForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  executeType: '', // 类型：DAILY - 每日；WEEKLY - 每周；MONTHLY - 每月
  date: '', // 日期
  executeTime: '', // 时间
  dayOfWeek: undefined,
  dayOfMonth: undefined
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref

// 类型选择 -必选
const typeOptions = [
  { label: '每日', value: '1' },
  { label: '每周', value: '2' },
  { label: '每月', value: '3' }
]

const weekList = [
  { label: '周一', value: '1' },
  { label: '周二', value: '2' },
  { label: '周三', value: '3' },
  { label: '周四', value: '4' },
  { label: '周五', value: '5' },
  { label: '周六', value: '6' },
  { label: '周日', value: '7' }
]

// 每月几号的选择
const dayList = [
  { label: '1号', value: '1' },
  { label: '2号', value: '2' },
  { label: '3号', value: '3' },
  { label: '4号', value: '4' },
  { label: '5号', value: '5' },
  { label: '6号', value: '6' },
  { label: '7号', value: '7' },
  { label: '8号', value: '8' },
  { label: '9号', value: '9' },
  { label: '10号', value: '10' },
  { label: '11号', value: '11' },
  { label: '12号', value: '12' },
  { label: '13号', value: '13' },
  { label: '14号', value: '14' },
  { label: '15号', value: '15' },
  { label: '16号', value: '16' },
  { label: '17号', value: '17' },
  { label: '18号', value: '18' },
  { label: '19号', value: '19' },
  { label: '20号', value: '20' },
  { label: '21号', value: '21' },
  { label: '22号', value: '22' },
  { label: '23号', value: '23' },
  { label: '24号', value: '24' },
  { label: '25号', value: '25' },
  { label: '26号', value: '26' },
  { label: '27号', value: '27' },
  { label: '28号', value: '28' },
  { label: '29号', value: '29' },
  { label: '30号', value: '30' },
  { label: '31号', value: '31' },
  { label: '最后一日', value: '32' }
]
const dataList = ref<any>([])
// 类型选择
const handleTypeChange = (val: string) => {
  const listMap = {
    2: weekList,
    3: dayList
  }
  dataList.value = listMap[val] || [] // 如果val不是预期的值，则dataList.value将被设置为空数组
  formData.value.date = ''
  formData.value.executeTime = ''
}

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true

  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await StoreApi.getStoreDetail(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getFormattedTime = (dateString) => {
  const date = new Date(dateString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

/** 提交表单 */
const emit = defineEmits(['submit']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = { ...formData.value }
    data.executeTime = getFormattedTime(data.executeTime)
    // 每日
    if (data.executeType === '1') {
      data.dayOfWeek = undefined
      data.dayOfMonth = undefined
    } else if (data.executeType === '2') {
      // 每周
      data.dayOfWeek = data.date
      data.dayOfMonth = undefined
    } else if (data.executeType === '3') {
      // 每月
      data.dayOfWeek = undefined
      data.dayOfMonth = data.date
    }

    dialogVisible.value = false
    // 发送操作成功的事件
    let dataToEmit = { ...data }

    delete dataToEmit.date
    emit('submit', dataToEmit)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    executeType: '',
    date: '',
    executeTime: '',
    dayOfWeek: undefined,
    dayOfMonth: undefined
  }
  formRef.value?.resetFields()
}
</script>

<style lang="scss">
:deep(.el-input__wrapper){
  height: 30px !important;
  line-height: 30px !important;
}

.pickTime .el-time-spinner__item:hover:not(.disabled):not(.active) {
  color: #0064ff !important;
}

.pickTime .el-time-spinner__item.is-active:not(.is-disabled) {
  color: #0064ff !important;
}
</style>
