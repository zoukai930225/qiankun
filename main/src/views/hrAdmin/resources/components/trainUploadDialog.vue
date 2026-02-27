<!-- 导师带领计划   name:毛天 date:2025年2月27日17:07:16 -->
<template>
  <div>
    <el-dialog v-model="dialogVisible" :before-close="handleClose" class="custom-dialog"
      style="width: 496px;height: 408px;padding: 0;border-radius: 5%;" :show-close="false">
      <div class="dialog-content">
        <img src="@/assets/imgs/train/slices/top2x.png" alt="" class="topImg" />
        <div class="titleText">带领计划上传</div>
        <img src="@/assets/imgs/train/slices/close22x.png" alt="" class="close" @click="handleClose" />
        <div class="body">
          <div class="bodyLeftText">带领计划上传：</div>
          <el-upload v-model:file-list="fileList" :action="uploadUrl" :data="{ bussinessCode: 'PERSON_MANAGE' }"
            list-type="picture-card" :auto-upload="true" style="margin-left: 118px; overflow-x: auto"
            handleStart="handleStart" :http-request="httpRequest" :on-success="success">
            <el-icon>
              <Plus />
            </el-icon>

            <template #file="{ file }">
              <div class="pic">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <!-- <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <el-icon><Download /></el-icon>
                </span> -->
                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
          <div class="bodyBottomText">备注：</div>
          <s-text-area v-model="textarea" style="width: 320px" :rows="5" placeholder="备注备注备注" class="textarea" />
        </div>
        <div class="closeButton" @click="handleClose">关 闭</div>
        <div class="submitButton" @click="submit">保 存</div>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogVisible2">
      <img w-full :src="dialogImageUrl" alt="Preview Image" class="preview-img" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { newEmployeeOnboardSave, newEmployeeOnboardupdate } from '@/api/hrAdmin/train/index'
import { useUpload } from '@/components/UploadFile/src/useUpload'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { defineProps, ref } from 'vue'
const { uploadUrl, httpRequest } = useUpload()
const message = useMessage() // 消息弹窗
interface Props {
  list: Array<{ [key: string]: any }> // 对象数组
  userId: string
  newEmployeeLedId?: string
}

const props = withDefaults(defineProps<Props>(), {
  list: Array<any>, // 明确数组元素的类型
  userId: '',
  newEmployeeLedId: '' // 设置默认值
})

// 控制弹窗显示/隐藏
const dialogVisible = ref(false)
const dialogImageUrl = ref<any>('')
const dialogVisible2 = ref(false)
const disabled = ref(false)
const textarea = ref('')
// 关闭弹窗的逻辑
const handleClose = () => {
  dialogVisible.value = false
  fileList.value = []
  textarea.value = ''
}
const fileList = ref([]) // 绑定文件列表

const handleRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter((item: any) => item.uid !== file.uid)
}
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url
  dialogVisible2.value = true
}

const openDialog = () => {
  dialogVisible.value = true
}

const getList = () => {
  emit('getList')
}
const emit = defineEmits(['getList'])
// 提交
const success = (response1) => {
  (fileList.value.filter((item: any) => item?.response?.data === response1.data)[0] as any).url = response1.data
  console.log(response1, 'response1')
  console.log(fileList.value, 'fileList')
}
const submit = async () => {
  // fileList.value.filter(item=>item.url = item.response.data)
  if (props.newEmployeeLedId) {
    // 更新接口
    const params = {
      userId: props.userId,
      notes: textarea.value,
      fileUrl: fileList.value.map((item: any) => item.url).join(',')
    }
    newEmployeeOnboardupdate(params).then(() => {
      handleClose()
      message.success('成功')
      getList()
    })
  } else {
    // 新增接口
    if (!fileList.value) {
      message.error('图片为必传项')
    }
    const params = {
      userId: props.userId,
      notes: textarea.value,
      fileUrl: fileList.value.map((item: any) => item.url).join(',')
    }
    newEmployeeOnboardSave(params).then(() => {
      handleClose()
      message.success('成功')
      getList()
    })
  }
}
const listGive = (arr, text) => {
  fileList.value = arr.map((item: any) => ({ url: item }))
  textarea.value = text
}
// 可以将方法暴露给父组件
defineExpose({
  openDialog,
  listGive
})
</script>

<style lang="scss" scoped>
:deep() {

  .el-dialog {
    .el-dialog__body {
      border-radius: 5%;
    }

    .el-dialog__header {
      padding: 0 !important;
    }
  }
}

.dialog-content {
  // position: absolute;
  // top: -50px;
  // left: -148px;
  width: 496px;
  height: 388px;
  // margin: -120px;
  padding: 20px 0 0 0;
  background-image: url('@/assets/imgs/train/slices/upload2x.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 5%;
}

.titleText {
  display: inline-block;
  width: 90px;
  height: 21px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 15px;
  color: #333333;
  line-height: 21px;
  text-align: left;
  font-style: normal;
}

.topImg {
  margin-left: 20px;
  margin-right: 20px;
  width: 14px;
  height: 15px;
  vertical-align: middle;
}

.close {
  margin-left: 320px;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  cursor: pointer;
}

.body {
  position: relative;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 72px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.bodyLeftText {
  position: absolute;
  left: 20px;
  width: 98px;
  height: 20px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  text-align: left;
  font-style: normal;
}

.pic {
  width: 100%;
  height: 100%;
}

:deep(.el-upload-list--picture-card) {
  flex-wrap: nowrap;
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload-list__item) {
  width: 100px;
  height: 100px;
}

:deep(.el-upload-list__item-actions) {
  width: 100px;
  height: 100px;
}

.bodyBottomText {
  position: absolute;
  top: 150px;
  left: 20px;
  width: 42px;
  height: 20px;
  font-family: AlibabaPuHuiTi_2_55_Regular;
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  text-align: center;
  font-style: normal;
}

.textarea {
  margin-left: 118px;
  margin-top: 20px;
}

.closeButton {
  position: absolute;
  width: 68px;
  height: 32px;
  bottom: 20px;
  right: 110px;
  text-align: center;
  line-height: 32px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  cursor: pointer;
}

.submitButton {
  position: absolute;
  width: 68px;
  height: 32px;
  bottom: 20px;
  right: 20px;
  background: #0064ff;
  border-radius: 4px;
  cursor: pointer;
  font-family: AlibabaPuHuiTi_2_55_Regular;
  font-size: 12px;
  color: #ffffff;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  text-align: center;
  line-height: 32px;
}

.preview-img {
  width: 100%;
}
</style>
