<template>
  <div v-if="drawerVisible">
    <el-drawer custom-class="addDrawer" v-model="drawerVisible" title="运营信息" size="968">
      <div class="drawerContent">
        <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
          label-width="150px">
          <el-form-item label="类型" prop="productType" required
            :rules="[{ required: true, message: '请选择类型', trigger: 'change' }]">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ getproductType(formData.productType) }}</div>
            </div>
            <el-select v-else class="dialogFormItemWidth" v-model="formData.productType" placeholder="请选择类型" clearable>
              <el-option v-for="dict in productTypeColumnOptions" :key="dict.code" :label="dict.value"
                :value="dict.code" />
            </el-select>
          </el-form-item>

          <el-form-item label="竞品信息" prop="competitorsInfo">
            <div class="seeBg" @click="openHanleCompetitorsInfo" style="cursor: pointer">
              <div class="seeBg-text" style="color: #1890ff">点击维护</div>
            </div>
            <!-- <el-input
              class="dialogFormItemWidth"
              v-model="formData.competitorsInfo"
              placeholder=""
            /> -->
          </el-form-item>

          <el-form-item label="上架时间" prop="listingTime">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formatCustomDate(formData.listingTime) }}</div>
            </div>
            <el-date-picker v-else v-model="formData.listingTime" type="date" placeholder="请选择上架时间"
              style="width: 100%" />
          </el-form-item>

          <el-form-item label="包装方式" prop="packageMethod">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.packageMethod }}</div>
            </div>
            <el-select v-else class="dialogFormItemWidth" v-model="formData.packageMethod" placeholder="请选择包装方式"
              clearable @change="handlePackageMethodChange">
              <el-option label="常规包装" value="常规包装" />
              <el-option label="非常规包装" value="非常规包装" />
            </el-select>
          </el-form-item>

          <el-form-item label="" prop="unRoutinePackagePicture" v-if="formData.packageMethod === '非常规包装'">
            <el-upload :accept="fileType.join(',')" :action="importUrl" :before-upload="beforeUpload"
              :headers="uploadHeaders" class="upload" :multiple="false" name="files"
              :data="{ code: 'NEW_PRODUCT', businessForeignKey: formData.id }" :on-error="uploadError"
              :on-success="(e) => uploadSuccess(e, $index)" :show-file-list="false">
              <template v-if="formData.unRoutinePackagePicture">
                <img :src="formData.unRoutinePackagePicture" class="upload-image" />
                <div class="upload-handle" @click.stop>
                  <div class="handle-icon" @click="imagePreview(formData.unRoutinePackagePicture)">
                    <Icon icon="ep:zoom-in" />
                  </div>
                </div>
              </template>
              <el-icon v-else class="avatar-uploader-icon" size="20">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="产品等级" prop="productGrade">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.productGrade }}</div>
            </div>
            <el-select v-else class="dialogFormItemWidth" v-model="formData.productGrade" placeholder="请选择产品等级"
              clearable>
              <el-option label="A级" value="A" />
              <el-option label="B级" value="B" />
              <el-option label="C级" value="C" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="售价" prop="monthCount">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.price }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.price" placeholder="请输入售价" />
          </el-form-item>
          <div class="longlabel">
            <el-form-item label="营销策略-预估月销量" prop="monthCount">
              <div v-if="formType === 'view'" class="seeBg">
                <div class="seeBg-text">{{ formData.monthCount }}</div>
              </div>
              <el-input v-else class="dialogFormItemWidth" v-model="formData.monthCount" placeholder="请输入营销策略-预估月销量" />
            </el-form-item>
          </div>
          <el-form-item label="运营备注" prop="operationRemark">
            <div v-if="formType === 'view'" class="seeBg">
              <div class="seeBg-text">{{ formData.operationRemark }}</div>
            </div>
            <s-text-area v-else :autosize="{ minRows: 3, maxRows: 4 }" class="dialogFormItemWidth"
              v-model="formData.operationRemark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <div class="drawerFooter">
          <el-button @click="drawerVisible = false">关 闭</el-button>
          <el-button v-if="formType !== 'view'" @click="handleTempSave">暂 存</el-button>
          <el-button v-if="formType !== 'view'" :disabled="formLoading" type="primary" @click="openConfirmDialog">
            提 交</el-button>
        </div>
      </div>
    </el-drawer>
    <confirmDialog ref="confirmDialogRef" @confirm="handleConfirmComplete" :title="'系统提醒'" cancelText="关闭"
      confirmText="确认" content="是否结束运营阶段的信息填写，并流转到产研阶段？" />
    <!-- 竞品信息 -->
    <CompetitorDrawer ref="competitorRef" :isCompetitorEditable="formData.operationStatus !== '3'" />
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { checkPermi } from '@/utils/permission'
import { formatCustomDate } from './../utils'
const message = useMessage() // 消息弹窗
import type { UploadProps } from 'element-plus'
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const fileType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
import { getAccessToken } from '@/utils/auth'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
import confirmDialog from './confirmDialog.vue'
import CompetitorDrawer from './competitorDrawer.vue'
import * as NodeManageAccountApi from '@/api/rpaManage/nodeManage'
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
import { createImageViewer } from '@/components/ImageViewer'
import { sendFeiShuMessageForTask } from '@/api/oa/new/develop'

type FileTypes =
  | 'image/apng'
  | 'image/bmp'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/pjpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/tiff'
  | 'image/webp'
  | 'image/x-icon'

const formData = ref({
  id: '',
  productType: '',
  price: '',
  competitorsInfo: '',
  listingTime: '',
  packageMethod: '',
  productGrade: '',
  monthCount: '',
  unRoutinePackagePicture: '',
  operationRemark: '',
  operationStatus: '' //运营状态(0-未指派,1-未开始,2-进行中,3-已结束)
})

const formRef = ref() // 表单 Ref

const formRules = reactive({})

// 获取产品类型选项名称
const getproductType = (productType) => {
  const options = productTypeColumnOptions.value.filter((item) => item.code === productType)
  return options.length > 0 ? options[0].value : ''
}

/** 打开弹窗 */
const productTypeColumnOptions = ref()
const open = async (row: any, tableColumns: any, type: string) => {
  drawerVisible.value = true
  formType.value = type
  resetForm()
  formData.value = row
  console.log('该行数据', row)
  const productTypeColumn = tableColumns.find((item) => item.code === 'productType')
  productTypeColumnOptions.value = productTypeColumn.options // 获取产品类型选项

  console.log('该行表格列', productTypeColumnOptions.value)
}
// 如果是非常规包装，需要上传图片
const handlePackageMethodChange = () => {
  if (formData.value.packageMethod === '非常规包装') {
  }
}

// 打开竞品信息
const competitorRef = ref()
const openHanleCompetitorsInfo = () => {
  // 打开竞品信息弹窗
  competitorRef.value.open(formData.value.id)
}
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
      await NodeManageAccountApi.saveNodeManage(data)
      message.success('新增成功')
    } else {
      await NodeManageAccountApi.updateNodeManage(data)
      message.success('修改')
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
    id: '',
    productType: '',
    price: '',
    competitorsInfo: '',
    listingTime: '',
    packageMethod: '',
    productGrade: '',
    monthCount: '',
    unRoutinePackagePicture: '',
    operationRemark: '',
    operationStatus: ''
  }
  formRef.value?.resetFields()
}

// 打开确认弹窗
const confirmDialogRef = ref() // 确认弹窗的 Ref
const openConfirmDialog = async () => {
  if (!checkPermi(['oa:newDevelop:maintainInfo'])) {
    return message.error('您没有权限维护运营信息')
  }
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  confirmDialogRef.value.open()
}

// 点击暂存按钮
const handleTempSave = async () => {
  if (!checkPermi(['oa:newDevelop:maintainInfo'])) {
    return message.error('您没有权限维护运营信息')
  }
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  formData.value.operationStatus = '2'
  emit('update', formData.value)
  drawerVisible.value = false
}

// 确认弹窗的回调
const handleConfirmComplete = async () => {
  formData.value.operationStatus = '3'
  await sendFeiShuMessageForTask({
    devPlanId: formData.value.id,
    process: '1', //(0-选完运营负责人,1-提交,2-选完设计师买手)
    sendIds: ''
  })
  emit('update', formData.value)
  drawerVisible.value = false
}

// 上传图片
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const fileSize = 5
  const imgSize = rawFile.size / 1024 / 1024 < fileSize
  const imgType = fileType
  if (!imgType.includes(rawFile.type as FileTypes))
    message.notifyWarning('上传图片不符合所需的格式！')
  if (!imgSize) message.notifyWarning(`上传图片大小不能超过 ${fileSize}M！`)
  return imgType.includes(rawFile.type as FileTypes) && imgSize
}

// 图片上传成功提示
const uploadSuccess = async (res: any, index: number) => {
  formData.value.unRoutinePackagePicture = res.data[0].fileUrl
  // saveHandle(dataList.value[index])
  // console.log(dataList.value)
  console.log('--', res)
}

// 图片上传错误提示
const uploadError = () => {
  message.notifyError('图片上传失败，请您重新上传！')
}

const imagePreview = (path: string) => {
  createImageViewer({
    zIndex: 9999999,
    urlList: [path]
  })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success', 'update']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
// 修改表单label的行高
// :deep(.longlabel .el-form-item--default .el-form-item__label) {
//   line-height: 1.5;
// }
.drawerTitle {
  font-family: AlibabaPuHuiTi_2_75_SemiBold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 600;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 16px 20px 1px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;

  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  .seeBg {
    width: 100%;
    height: 32px;
    // background: url('@/assets/imgs/team/target_input_disable.png');
    background: #f8f8f9;
    border-radius: 4px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;

    &-text {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      padding-left: 16px;
      line-height: 32px;
    }
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

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer__header) {
  margin-bottom: 0px;
}

:deep(.el-drawer__title) {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 500;
}

:deep(.el-drawer) {
  border-radius: 12px 0px 0px 0px;
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

:deep(.el-drawer__body) {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

:deep(.el-input__wrapper) {
  background: transparent;
  border-radius: 4px;
  box-shadow: none;
}

// :deep(.el-table .cell) {
//   margin-left: 5px;
// }

// :deep(.el-table) {
//   --el-table-row-hover-bg-color: transparent;
// }

:deep(.upload) {
  width: 80px;
  height: 80px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }

  .el-upload {
    position: relative;
    width: 80px;
    height: 80px;

    .upload-empty {
      width: 80px;
      height: 80px;
    }

    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      box-sizing: border-box;
      text-align: center;

      .handle-icon {
        color: #fff;
      }
    }

    &:hover {
      .upload-handle {
        opacity: 1;
      }
    }
  }

  .upload-image {
    width: 80px;
    height: 80px;
  }
}
</style>
