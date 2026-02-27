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
      :data="formData"
      ref="uploadRef"
      :before-upload="beforeUploadImg"
      :on-success="handleSuccessImg"
      :on-error="handleUploadImgError"
      :on-preview="handlePictureCardPreview"
      :disabled="disabled"
    >
      <template #default>
        <div class="upload-cus" v-loading="uploadImg">
          <img src="@/assets/imgs/team/add-default-img.png" class="add-default-img" />
          <span class="upload-cus-title">上传图片</span></div
        >

        <!-- <el-icon><Plus /></el-icon> -->
      </template>

      <!-- <template #file="{ file, index }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-delete" @click="handleRemoveImg(file, index)">
              <el-icon><Delete /></el-icon>
            </span>
            <span class="el-upload-list__item-preview" @click="handlePreviewImg(file, index)">
              <el-icon><CirclePlus /></el-icon>
            </span>
          </span>
        </div>
      </template> -->
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" class="preview-img" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { UploadProps, UploadUserFile } from 'element-plus'
import { getAccessToken } from '@/utils/auth'

const message = useMessage() // 消息弹窗
defineOptions({ name: 'SWuploadImg' })
const importUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/oss/upload'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
const dialogVisible = ref(false)
const uploadImg = ref(false)
const dialogImageUrl = ref('')
const props = defineProps({
  modelValue: {
    type: Array as () => UploadUserFile[],
    default: () => {
      return []
    }
  },
  bussinessCode: {
    type: String as () => string,
    default: ''
  },
  disabled: {
    type: Boolean as () => boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
// 文件列表
const imgFileList: Ref<UploadUserFile[]> = computed({
  get: () => {
    // console.log('拿到的图片', props.modelValue);
    if (typeof props.modelValue === 'string' && props.modelValue !== '') {
      // console.log('走到里面',props.modelValue);
      return props.modelValue.split(',').map((item: string) => {
        return {
          name: item,
          url: item
        }
      })
    } else {
      return props.modelValue
    }
  },
  set: (val: []) => {
    console.log('set', val)
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
  // console.log('---上传成功', imgFileList.value);
  uploadImg.value = false
}

const handleUploadImgError = () => {
  uploadImg.value = false
}

const handleRemoveImg = (file, index) => {
  // console.log('---',imgFileList.value);
  imgFileList.value.splice(index, 1)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 请求携带参数
const formData = computed(() => {
  if (props.bussinessCode) {
    return { bussinessCode: props.bussinessCode }
  } else {
    return {}
  }
})
onMounted(() => {
  // console.log('---mounted');
})

onUnmounted(() => {
  imgFileList.value = []
  // console.log('---销毁');
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
    border-radius: 8px;

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
.preview-img {
  width: 100%;
}
</style>
