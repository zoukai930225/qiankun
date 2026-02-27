<template>
  <div class="nineGridForm__dialog">
    <el-dialog class="commomDialig" v-model="dialogVisible" :show-close="false">
      <el-form
        class="dialogForm"
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="九宫格" prop="nineGridId">
          <el-select
            class="dialogFormItemWidth"
            v-model="formData.nineGridId"
            placeholder="请选择类型"
            clearable
          >
            <el-option
              v-for="dict in nineGridList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm" v-if="showConfirm"
          >确 认</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as activitySetApi from '@/api/otr/activitySet'

defineOptions({ name: 'NineGridForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formData = ref({
  nineGridId: ''
})

const formRules = reactive({})

const formRef = ref() // 表单 Ref
const nineGridList = ref([]) // 九宫格列表
const activityId = ref('') // 活动ID

defineProps({
  showConfirm: {
    type: Boolean,
    default: false
  }
})
/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true

  resetForm()
  // 修改时，设置数据
  activityId.value = id
  formLoading.value = true
  try {
    const data = await activitySetApi.getNineGridInfo(activityId.value)
    formData.value.nineGridId = data
    getList()
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 获取九宫格列表
const loading = ref(false) // 列表的加载中
const getList = async () => {
  console.log('被触发')
  loading.value = true
  try {
    const data = await activitySetApi.getNineGridList().catch(() => {})
    if (data) {
      nineGridList.value = data.map((v) => ({ label: v.gridName, value: v.id }))
    }
  } finally {
    loading.value = false
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value

    console.log('提交的数据', data)
    await activitySetApi.submitNineGrid(activityId.value, data.nineGridId || '')
    message.success('设置成功')

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    nineGridId: ''
  }
  activityId.value = ''
  formRef.value?.resetFields()
}
</script>

<style lang="scss">
.nineGridForm__dialog {
  .el-dialog {
    width: 500px;
    background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 50%, #f0f8ff 100%);
  }
}
</style>
