<!--
 * @Date: 2024-09-13 15:25:17
  上传文件
-->
<template>
  <div class="upload-file-wapper">
    <div class="flex-column">
      <!-- 文件 -->
      <div v-if="otherList?.length" class="flex-row">
        <div v-for="(item, index) in otherList" :key="index" class="file-type">
          <div class="file-left">
            <img src="@/assets/imgs/team/file-ppt.png" class="file-desc" />
            <div class="flex-column">
              <span class="file-name">{{ item?.fileName || '' }}</span>
              <span class="file-size"></span>
            </div>
          </div>
          <img
            src="@/assets/imgs/team/file-close.png"
            @click="delFile(0, index)"
            class="file-close"
          />
        </div>
      </div>
      <!-- 图片 -->
      <div v-if="imgList?.length">
        <div class="file-img-wapper">
          <div class="file-img" v-for="(item, index) in imgList" :key="index">
            <img
              v-if="!disabled"
              src="@/assets/imgs/team/file-img-del.png"
              alt=""
              class="file-img-del"
              @click="delFile(1, index)"
            />
            <img :src="item?.ossPath" alt="" class="file-img-item" />
          </div>
          <el-upload
            v-model:file-list="allFileList"
            :action="importUrl"
            :headers="uploadHeaders"
            ref="fileuUploadRef"
            :on-success="handleSuccess"
            :show-file-list="false"
            :before-upload="handleBeforepload"
            :on-error="handleUploadError"
            :disabled="disabled"
          >
            <template #default>
              <div class="upload-cus" v-loading="uploading">
                <img src="@/assets/imgs/team/fujian.png" class="add-default-img" />
                <span>添加附件</span></div
              ></template
            >
          </el-upload>
        </div>
      </div>
    </div>
    <el-upload
      v-model:file-list="allFileList"
      :action="importUrl"
      :headers="uploadHeaders"
      ref="fileuUploadRef"
      :on-success="handleSuccess"
      :show-file-list="false"
      :before-upload="handleBeforepload"
      :on-error="handleUploadError"
      v-if="!imgList?.length"
    >
      <template #default>
        <div class="upload-cus" v-loading="uploading">
          <img src="@/assets/imgs/team/fujian.png" class="add-default-img" />
          <span>添加附件</span></div
        ></template
      >
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

const uploading = ref(false)

const props = defineProps({
  fileList: {
    type: Array as () => UploadUserFile[],
    default: () => {
      return []
    }
  },
  imgList: {
    type: Array as () => UploadUserFile[],
    default: () => {
      return []
    }
  },
  allFileList: {
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

const emit = defineEmits(['update:fileList', 'update:imgList', 'update:allFileList'])
// 文件列表
const otherList: Ref<UploadUserFile[]> = computed({
  get: () => {
    return props.fileList
  },
  set: (val: []) => {
    emit('update:fileList', val)
  }
})

const imgList: Ref<UploadUserFile[]> = computed({
  get: () => {
    return props.imgList
  },
  set: (val: []) => {
    emit('update:imgList', val)
  }
})

const allFileList: Ref<UploadUserFile[]> = computed({
  get: () => {
    return props.allFileList
  },
  set: (val: []) => {
    emit('update:allFileList', val)
  }
})

const delFile = (type, index) => {
  // type 0 文件 1 图片 index 第几个
  if (type == 1) {
    const arr = imgList.value
    arr.splice(index, 1)
    imgList.value = arr
  } else {
    const arr = otherList.value
    arr.splice(index, 1)
    otherList.value = arr
  }
}

const handleSuccess = (response) => {
  uploading.value = false
  const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
  const extension = response.data.fileType.toLowerCase()
  const isImg = imageFormats.includes(extension)
  if (isImg) {
    // @ts-ignore
    imgList.value.push(response.data)
  } else {
    // @ts-ignore
    otherList.value.push(response.data)
  }
}

const handleBeforepload = () => {
  uploading.value = true
}

const handleUploadError = () => {
  uploading.value = false
}

onMounted(() => {})

onUnmounted(() => {
  allFileList.value = []
})
</script>

<style scoped lang="scss">
.upload-file-wapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .flex-column {
    display: flex;
    flex-direction: column;
  }
  .flex-row {
    display: flex;
    flex-direction: row;
  }
  .file-type {
    width: 210px;
    height: 57px;
    background: #f9fbff;
    border-radius: 4px;
    border: 1px solid #e3eeff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px 6px 14px;
    box-sizing: border-box;
    margin-bottom: 8px;
    margin-right: 10px;

    .file-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      .file-name {
        font-weight: 400;
        font-size: 12px;
        color: #333333;
        line-height: 20px;
        width: 120px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2; /* 最多显示两行 */
      }
      .file-size {
        font-weight: 400;
        font-size: 12px;
        color: #999999;
        line-height: 20px;
      }
    }

    .file-desc {
      width: 22px;
      height: 26px;
      margin-right: 14px;
    }

    .file-close {
      width: 10px;
      height: 10px;
      cursor: pointer;
    }
  }

  .file-img-wapper {
    display: flex;
    flex-direction: row;

    .file-img {
      position: relative;
      border-radius: 10px;
      margin-right: 20px;
      margin-bottom: 10px;

      .file-img-del {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
      }
      .file-img-item {
        width: 110px;
        height: 110px;
      }
    }
  }
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
  }
  .upload-cus:hover {
    border: 1px dashed #0064ff;
  }
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
