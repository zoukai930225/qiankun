<template>
  <el-upload
    v-if="enableEdit"
    style="width: 100%"
    v-model:file-list="fileList"
    :action="importUrl"
    class="upload"
    :headers="uploadHeaders"
    name="files"
    :show-file-list="false"
    :data="{ code: 'NEW_PRODUCT', businessForeignKey: uuid }"
    :on-error="uploadError"
    :on-success="uploadSuccess"
    :before-upload="beforeUpload"
    :disabled="disabled"
  >
    <el-button type="primary" :loading="uploadLoading" :disabled="disabled">点击上传</el-button>
  </el-upload>

  <ul class="file-list" v-if="showUploadFileList.length > 0" :class="{ 'file-list1': !enableEdit }">
    <li v-for="(item, index) in showUploadFileList" :key="item.url">
      <div>
        <el-icon class="document">
          <Document />
        </el-icon>
        <span class="name" @click="previewHandle(item)">{{ item.name }}</span>
      </div>

      <el-icon v-if="enableEdit && !disabled" class="close" @click="delHandle(item, index)">
        <Close />
      </el-icon>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { generateUUID } from '@/utils'
import { getAccessToken } from '@/utils/auth'
import { createImageViewer } from '@/components/ImageViewer'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadLoading = ref(false) //上传loading
const fileList = ref([]) // 上传文件列表

const message = useMessage() // 消息弹窗

const uuid = generateUUID() // 生成唯一标识符

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  enableEdit: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  uoloadFileList: {
    type: Array,
    default: () => []
  }
})
const uploadList = ref([]) // 初始化 uploadList

const showUploadFileList = computed(() => {
  return props.enableEdit ? uploadList.value : props.uoloadFileList
})

watch(
  () => props.modelValue,
  (newVal) => {
    console.log('watch props.modelValue:', newVal)

    if (newVal && newVal.length > 0) {
      uploadList.value = newVal
    } else {
      uploadList.value = []
    }
  },
  {
    immediate: true, // 立即执行一次
    deep: true // 深度监听
  }
)
const emit = defineEmits(['update:modelValue'])
onMounted(() => {
  nextTick(() => {
    console.log('props.modelValue:', props.modelValue)
  })
})

onUnmounted(() => {
  console.log('unmounted')
})

// 图片上传成功提示
const uploadSuccess = (res: any): void => {
  uploadList.value.push({ url: res.data[0].fileUrl, name: res.data[0].fileName })
  uploadLoading.value = false
  emit('update:modelValue', uploadList.value)
  console.log('uploadSuccess', uploadList.value)
}

// 图片预览
const previewHandle = (file) => {
  const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
  const extension = file.url.toLowerCase()
  const isImg = imageFormats.some((value) => extension.includes(value))
  console.log(isImg)
  if (isImg) {
    createImageViewer({
      zIndex: 9999999,
      urlList: [file.url]
    })
  } else {
    // window.location.href = file.url
    window.open(file.url, '_blank')
  }
}
const delHandle = (item, index) => {
  uploadList.value.splice(index, 1)
}
// 图片上传错误提示
const uploadError = () => {
  uploadLoading.value = false
  message.notifyError('图片上传失败，请您重新上传！')
}

const beforeUpload = (file) => {
  uploadLoading.value = true
}
</script>

<style lang="scss" scoped>
.file-list1 {
  margin-top: 3px;
}
.file-list {
  // margin: 0;
  width: 100%;

  padding-inline-start: 0;
  // margin-left: 100px;
  // padding-left: 0;

  li {
    list-style: none;
    // padding: 0;
    // margin: 0;
    // position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 26px;
    margin-bottom: 5px;
    cursor: pointer;

    .name {
      padding-left: 6px;
      font-size: 14px;
    }

    .document {
      width: 14px;
      height: 14px;
      color: #909399;
      padding-left: 6px;
      padding-top: 6px;
    }

    .close {
      // display: none;
      // position: absolute;
      // right: 10px;
      // top: 5px;
      color: #606266;
    }

    &:hover {
      background-color: #f5f7fa;

      .name {
        color: #0064ff;
      }

      .close {
        display: block;
      }
    }
  }
}
</style>
