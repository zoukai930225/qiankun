<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" @close="reset" @before-close="beforeClose"
    :show-befor-close="true">
    <div class="content" v-loading="drawerLoading">
      <el-form :model="formParams" label-width="100" :rules="fromRules" ref="formRef">
        <el-row>
          <el-col :span="12">
            <el-form-item label="指标CODE" prop="metricCode">
              <el-input v-model.trim="formParams.metricCode" class="!w300px" placeholder="请输入指标CODE，如：totalScan"
                :disabled="drawerType !== 'add'" />
            </el-form-item>
            <el-form-item label="指标类型" prop="metricType">
              <el-select class="!w300px" v-model="formParams.metricType" placeholder="请选择" value-on-clear="">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.METRIC_TYPE, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="指标列宽" prop="metricColumnWidth">
              <el-input-number v-model="formParams.metricColumnWidth" :min="0" controls-position="right"
                class="!w300px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指标名称" prop="metricName">
              <el-input v-model.trim="formParams.metricName" class="!w300px" placeholder="请输入指标名称" />
            </el-form-item>
            <el-form-item label="固定位置" prop="metricFixedPosition">
              <el-select class="!w300px" v-model="formParams.metricFixedPosition" clearable placeholder="请选择固定位置">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.METRIC_FIXED_POSITION, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="字符类型" prop="metricStrType">
              <el-select class="!w300px" v-model="formParams.metricStrType" placeholder="请选择字符类型">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.METRIC_STR_TYPE, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="计算表达式" prop="metricExpression">
          <s-text-area v-model="formParams.metricExpression" style="width: 100%;" placeholder="SUM(xse) - SUM(tkje)"
            :autosize="{ minRows: 2, maxRows: 4 }"  />
        </el-form-item>
        <el-form-item label="指标描述" prop="metricDescription">
          <s-text-area v-model="formParams.metricDescription" style="width: 100%;" placeholder="请输入指标描述"
            :autosize="{ minRows: 2, maxRows: 4 }"  />
        </el-form-item>
        <el-form-item label="指标详情" prop="metricDetail">
          <Editor height="200px" v-model:modelValue="formParams.metricDetail" ref="myEdit" v-if="drawerVisible" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="handleCloseDrawer">关闭</el-button>
      <el-button type="primary" class="mr20px" @click="submitForm" :disabled="drawerLoading">提交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getSysMetricManagementById, saveAndUpdateSysMetricManagement } from '@/api/biControl/quota/index'
import { consistency } from "@/utils";
import { cloneDeep } from 'lodash-es';
const message = useMessage() // 消息弹窗
//弹框显示
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
// 请求参数
const formParams = ref({
  //指标CODE
  metricCode: "",
  //列宽
  metricColumnWidth: 120,
  metricDescription: "",
  metricExpression: "",
  metricFixedPosition: "",
  //指标名称
  metricName: "",
  metricStrType: "",
  metricType: "",
  id: undefined,
  metricDetail: ""
})

const formRef = ref()
const fromRules = reactive({
  metricCode: [{ required: true, message: '请输入指标CODE', trigger: 'blur' },
  {
    pattern: /^[a-zA-Z]+$/, message: '指标CODE只能输入英文', trigger: 'blur'
  }],
  metricName: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
})
const hostoryData = ref({})
const myEdit = ref()
let interNum = 0 as any
//判断富文本是否渲染完成
const isEditReady = () => {
  return new Promise((resolve) => {
    interNum = setInterval(async () => {
      const val = await myEdit.value?.getEditorRef()
      if (!!val) {
        clearInterval(interNum)
        resolve(true)
      }
    }, 50)
  })
}
//打开弹框
const open = async (type, id) => {

  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = type === 'add' ? '新增' : type === 'edit' ? '编辑' : '查看'
  await isEditReady()
  if (id) {
    formParams.value.id = id
    try {
      drawerLoading.value = true
      const data = await getSysMetricManagementById(id)
      if (data) {
        const detail = {} as any
        Object.keys(data).forEach(key => {
          if (Object.keys(formParams.value).includes(key)) {
            detail[key] = data[key]
          }
        })
        if (!detail.metricDetail) {
          detail.metricDetail = ''
        }
        formParams.value = detail
        hostoryData.value = cloneDeep(detail)
      }
    } finally {
      drawerLoading.value = false
    }
  } else {
    hostoryData.value = cloneDeep(formParams.value)
  }
}

// 提交表单
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  await formRef.value.validate()

  // 提交请求
  drawerLoading.value = true
  try {
    const data = formParams.value as any

    if (drawerType.value === 'add') {
      data.id = undefined
      await saveAndUpdateSysMetricManagement(data)
      // reset()
      message.success('新增成功')
    } else {
      await saveAndUpdateSysMetricManagement(data)
      // reset()
      message.success('修改成功')
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emits('success')
  } finally {
    drawerLoading.value = false
  }
}
const beforeClose = (done: Function) => {
  consistency(hostoryData.value, formParams.value, () => {
    reset()
    done()
  })
};

const handleCloseDrawer = () => {
  beforeClose(() => {
    drawerVisible.value = false;
  });
}

const reset = () => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  formParams.value = {
    //指标CODE
    metricCode: "",
    //列宽
    metricColumnWidth: 120,
    metricDescription: "",
    metricExpression: "",
    metricFixedPosition: "",
    //指标名称
    metricName: "",
    metricStrType: "",
    metricType: "",
    id: undefined,
    metricDetail: ""
  }
  if (interNum) {
    clearInterval(interNum)
    interNum = 0
  }
}

const emits = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="less" scoped>
.content {
  background-color: #fff;
  width: 100%;
  min-height: 100%;
  border-radius: 20px;
  padding: 20px;
}
</style>
