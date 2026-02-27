<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer">
      <div>
        <div class="drawerTitle">
          {{ drawerTitle }}
          <img
            src="@/assets/imgs/dashboard/programGroup/close1.png"
            alt=""
            @click="drawerVisible = false"
          />
        </div>
      </div>
      <div class="drawerContent">
        <div class="drawerContent-title">
          <div class="drawerContent-title-icon"></div><div>字段</div>
        </div>
        <el-form
          class="dialogForm"
          ref="formRef"
          v-loading="formLoading"
          :model="formData"
          :rules="formRules"
          label-width="95px"
        >
          <el-form-item label="任务名称" prop="taskName">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.taskName"
              placeholder="请输入任务名称"
            />
          </el-form-item>
          <!-- <el-form-item label="任务编码" prop="taskCode">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.taskCode"
              placeholder="请输入编码"
            />
          </el-form-item> -->

          <el-form-item label="执行频率" prop="executeFrequency">
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.executeFrequency"
              placeholder="请选择执行频率"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.TASK_EXECUTE_FREQUENCY, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="次数" prop="executeNumber">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.executeNumber"
              placeholder="请输入次数"
              type="number"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddTask' })
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as rpaApi from '@/api/rpaManage'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  taskName: undefined,
  taskCode: undefined,
  executeFrequency: undefined,
  executeNumber: undefined,
  remark: undefined
})
const formRules = reactive({
  taskName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  taskCode: [{ required: true, message: '任务编码不能为空', trigger: 'blur' }]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  // console.log('---', type, id)
  drawerVisible.value = true
  drawerTitle.value =
    type === 'create' ? '新增' : type === 'update' ? '编辑' : type === 'view' ? '查看' : ''
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await rpaApi.saveOrupdateTask(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

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
    const data = formData.value as any
    if (formType.value === 'create') {
      data.id = undefined
      await rpaApi.saveOrupdateTask(data)
      message.success(t('common.createSuccess'))
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    taskName: undefined,
    taskCode: undefined,
    executeFrequency: undefined,
    executeNumber: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
.drawerTitle {
  font-family: AlibabaPuHuiTi_2_75_SemiBold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 600;
  margin: 0 0 18px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.drawerContent {
  width: 100%;
  padding: 20px 20px 20px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }
}
.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
.dialogFormItemWidth {
  width: 100%;
}
</style>
