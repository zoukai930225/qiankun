<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer" :size="968">
      <div>
        <div class="drawerTitle">{{ drawerTitle }}</div>
      </div>
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="100px">
        <div class="drawerContent">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="一级异常" prop="exceptionType">
                <el-select class="dialogFormItemWidth" v-model="formData.exceptionType" placeholder="请选择一级程序异常类型"
                  disabled>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TASK_PROGRAM_EXCEPTION_TYPE_1, true)"
                    :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="二级异常" prop="exceptionTypeTwo">
                <el-select class="dialogFormItemWidth" v-model="formData.exceptionTypeTwo" placeholder="请选择二级程序异常类型"
                  disabled>
                  <el-option v-for="dict in secondLevelOptions" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="处理类型" prop="handleType">
                <el-select class="dialogFormItemWidth" v-model="formData.handleType" placeholder="请选择程序处理类型" disabled>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.TASK_PROGRAM_HANDLE_TYPE, true)"
                    :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理时间" prop="handleTime">
                <el-date-picker v-model="formData.handleTime" type="datetime" placeholder="请选择" style="width: 328px"
                  value-format="YYYY-MM-DD HH:mm:ss" readonly />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="处理结果" prop="handleResult">
                <el-select class="dialogFormItemWidth" v-model="formData.handleResult" placeholder="请选择处理结果" disabled>
                  <el-option v-for="dict in getIntDictOptions(
                    DICT_TYPE.TASK_PROGRAM_HANDLE_RESULT_TYPE,
                    true
                  )" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <s-text-area v-model="formData.remark" :placeholder="formData.remark ? formData.remark : '暂无备注信息'"
              class="dialogFormItemWidth" style="width: 100%" :autosize="{ minRows: 6, maxRows: 8 }" readonly />
          </el-form-item>
          <el-form-item label="上传图片">
            <UploadImg :bussiness-code="UPLOAD_FILE_BISSONESSCODE.DATA_BOARD" v-model:modelValue="imgUrlList"
              :disabled="true" />
          </el-form-item>
        </div>
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>请求信息</div>
          </div>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="请求节点:">
                <el-input v-model="formData.executeNode" readonly class="dialogFormItemWidth" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求IP:">
                <el-input v-model="formData.remoteAddr" readonly class="dialogFormItemWidth" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- OSS地址，点击下载 -->
          <el-form-item label="请求文件:">
            <el-input v-model="formData.ossUrl" placeholder="" class="dialogFormItemWidth ossUrl" readonly
              style="width: 100%" @click="downloadFile" />
          </el-form-item>
          <el-form-item label="请求入参:">
            <s-text-area v-model="formData.requestParams" readonly class="dialogFormItemWidth" :rows="5"
              style="width: 100%" />
          </el-form-item>
        </div>
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>返回信息</div>
          </div>

          <el-form-item label="返回结果:">
            <s-text-area v-model="formData.resultParams" readonly class="dialogFormItemWidth" :rows="5"
              style="width: 100%" />
          </el-form-item>
        </div>
      </el-form>
      <!-- <div class="drawerFooter">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm"> 提 交</el-button>
      </div> -->
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddTask' })
import STextArea from "@/components/common/input/s-textarea.vue";
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import UploadImg from './uploadImg.vue'
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
import * as DashboardApi from '@/api/dashboard'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
// 监听异常类型一级变化，二级清空
const secondLevelOptions = ref<any>([])
const formData = ref({
  executeRecordId: undefined, //程序处理记录id
  exceptionType: undefined, //程序异常类型一级
  exceptionTypeTwo: undefined, //程序异常类型二级
  handleType: undefined, //程序处理类型
  handleResult: undefined, //处理结果
  handleTime: undefined, //处理时间
  remark: undefined, //备注
  ossUrl: undefined, //OSS地址
  requestParams: undefined, //请求参数
  resultParams: undefined, //返回结果
  executeNode: undefined, //请求节点
  remoteAddr: undefined, //请求IP
  handleImg: undefined //处理图片
})
const formRules = reactive({})
const imgUrlList = ref([]) // 上传的图片列表
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (executeRecordId?: string) => {
  drawerVisible.value = true
  drawerTitle.value = '处理记录'
  resetForm()
  console.log('executeRecordId', executeRecordId)

  // 修改时，设置数据
  if (executeRecordId) {
    formLoading.value = true
    try {
      const data = await DashboardApi.getProgramHandleRecord({ executeRecordId: executeRecordId })
      if (data) {
        formData.value = data
        if (data.exceptionType) {
          secondLevelOptions.value = getIntDictOptions(data.exceptionType, true)
        }
        if (data.handleImg && data.handleImg !== '') {
          imgUrlList.value = data.handleImg.split(',').map((item) => ({ url: item }))
        }
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    executeRecordId: undefined,
    exceptionType: undefined,
    exceptionTypeTwo: undefined,
    handleType: undefined,
    handleResult: undefined,
    handleTime: undefined,
    remark: undefined,
    ossUrl: undefined,
    requestParams: undefined,
    resultParams: undefined,
    executeNode: undefined,
    remoteAddr: undefined,
    handleImg: undefined
  }
  imgUrlList.value = []
  secondLevelOptions.value = []
  formRef.value?.resetFields()
}

const downloadFile = () => {
  const link = document.createElement('a')
  link.href = formData.value.ossUrl
  link.download = '接口文件'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style lang="scss" scoped>
@use '@/styles/eldrawer1.scss';

.tst {
  color: #01983c30;
}

:deep(.ossUrl .el-input__inner) {
  color: #0064ff;
  cursor: pointer;
  text-decoration: underline;
}

:deep(.el-upload-list__item) {
  width: 110px;
  height: 110px;
}

:deep(.el-upload-list--text) {
  display: flex;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}
</style>
