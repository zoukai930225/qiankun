<template>
  <SWDialog v-if="visible" v-model="visible" :width="width" :title="title" :showTitleLine="true" :showBottomLine="true">
    <el-form class="mt20px pl4px pr4px" labelPosition="right" labelWidth="80">
      <el-form-item label="淘汰原因" required>
        <s-text-area v-model="formData.remark" :autosize="{ minRows: 4 }" disabled />
      </el-form-item>
      <el-form-item label="附件">
        <div class="flex flex-column">
          <!-- 图片列表 -->
          <div class="imgList">
            <div v-for="(file, index) in imageList" :key="index" class="img">
              <el-image :src="file.fileUrl" :preview-teleported="true" :preview-src-list="[file.fileUrl]"
                :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" fit="cover" style="width: 90px;height: 90px;" />
            </div>
          </div>

          <!-- 文件列表 -->
          <div class="fileList">
            <div v-for="(file, index) in fileList" :key="index" class="fileLink" @click="downloadAttachFile(file)">
              <img :src="getFileIcon(file.fileName)" />
              <span>{{ file.fileName }}</span>
            </div>
          </div>

        </div>

      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose" class="mr20px mt20px">取消</el-button>
    </template>
  </SWDialog>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { defineProps } from 'vue'
import { isImgPath } from '@/utils/is'
import { downloadByUrl2 } from '@/utils/download'
import { getFileIcon } from '@/utils/index'
const props = defineProps({
  title: {
    type: String,
    default: '淘汰原因'
  },
  width: {
    type: String,
    default: '600px'
  },

})
const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)

const formData = ref()
const imageList = ref<any>([])
const fileList = ref<any>([])
// 打开
const open = async (data: any) => {
  visible.value = true
  formData.value = data
  formData.value.attachmentUrl = formData.value.attachmentUrl?.split(',').map((url: any) => {
    const fileName = url.split('?name=')[1]
    const isImage = isImgPath(url)
    return {
      fileUrl: url,
      fileName,
      isImage
    }
  })
  console.log(formData.value.attachmentUrl)
  imageList.value = formData.value.attachmentUrl.filter(att => att.isImage)
  fileList.value = formData.value.attachmentUrl.filter(att => !att.isImage)
}

// 下载附件
const downloadAttachFile = (file: any) => {
  downloadByUrl2(file.fileUrl, file.fileName)
}

defineExpose({ open })

onMounted(() => { })

const handleClose = () => {
  // 将visible的值设置为false
  visible.value = false
  // 触发close事件
  emit('close')
}

</script>

<style lang="scss" scoped>
:deep(.el-form-item--default .el-form-item__label) {
  line-height: 20px;
  text-align: right;
  display: flex;
  align-items: center;
  padding-left: 0px;
  font-size: 14px;
  text-align: right;
  color: #666666;
}

.imgList {
  display: flex;
  flex-wrap: wrap;

  .img {
    margin-right: 10px;
  }
}

.fileList {
  .fileLink {
    display: flex;
    align-items: center;

    img {
      margin-right: 4px;
    }

    &:hover {
      color: #0064ff;
      cursor: pointer;
    }
  }
}
</style>
