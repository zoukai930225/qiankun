<!--
 * @Date: 2024-09-13 15:25:17
  上传图片
-->
<template>
  <div class="upload-img-wapper">
    <el-upload
      v-model:file-list="imgFileList"
      :action="importUrl"
      list-type="picture-card"
      :headers="uploadHeaders"
      ref="uploadRef"
      :before-upload="beforeUploadImg"
      :on-success="handleSuccessImg"
      :on-error="handleUploadImgError"
      :disabled="disabled"
    >
      <template #default>
        <div class="upload-cus" v-loading="uploadImg">
          <img src="@/assets/imgs/team/add-default-img.png" class="add-default-img" />
          <span class="upload-cus-title">添加产品图</span></div
        ></template
      >

      <template #file="{ file, index }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-delete"
              @click="handleRemoveImg(file, index)"
              v-if="!disabled"
            >
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { getAccessToken } from '@/utils/auth'
import type { UploadUserFile } from 'element-plus'
const message = useMessage() // 消息弹窗
defineOptions({ name: 'SWuploadImg' })
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/visualApproval/uploadAnnex'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头

const uploadImg = ref(false)

const props = defineProps({
  modelValue: {
    type: Array as () => UploadUserFile[],
    default: () => {
      return []
    }
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
// 文件列表
const imgFileList: Ref<UploadUserFile[]> = computed({
  get: () => {
    return props.modelValue
  },
  set: (val: []) => {
    emit('update:modelValue', val)
  }
})

// 图片上传前格式校验
const beforeUploadImg = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
    return false // 阻止文件上传
  }
  uploadImg.value = true
  return true // 允许文件上传
}

const handleSuccessImg = () => {
  uploadImg.value = false
}

const handleUploadImgError = () => {
  uploadImg.value = false
}

const handleRemoveImg = (file, index) => {
  imgFileList.value.splice(index, 1)
}

onMounted(() => {})

onUnmounted(() => {
  imgFileList.value = []
})
</script>

<style scoped lang="scss">
.upload-img-wapper {
  width: 100%;
  .upload-cus {
    width: 110px;
    height: 110px;
    font-size: 12px;
    color: #999999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px dashed #b8b8b8;
    background: white;

    .add-default-img {
      width: 30px;
      height: 26px;
      margin-bottom: 8px;
    }
    .upload-cus-title {
      height: 20px;
      font-size: 12px;
      color: #999999;
      line-height: 20px;
    }
  }
  .upload-cus:hover {
    border: 1px dashed #0064ff;
  }
}
</style>
