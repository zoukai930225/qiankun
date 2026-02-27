<template>
  <div class="flex flex-column">
    <!-- 图片列表 -->
    <div class="imgList" v-if="imageList.length">
      <div v-for="(file, index) in imageList" :key="index" class="img">
        <el-image :src="file.fileUrl" :preview-teleported="true" :preview-src-list="[file.fileUrl]" fit="cover"
          style="width: 40px;height: 40px;border-radius:2px" />
      </div>
    </div>

    <!-- 文件列表 -->
    <div class="fileList" :class="alignType" v-if="fileList.length">
      <div v-for="(file, index) in fileList" :key="index" class="fileLink" @click="downloadAttachFile(file)">
        <img :src="getFileIcon(file.fileName)" style="width: 18px;height: 18px;" />
        <el-tooltip :content="file.fileName" :offset="6" popper-style="max-width: 200px;word-break: break-all;">
          <span class="text1">{{ file.fileName }}</span>
        </el-tooltip>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { getFileIcon } from '@/utils/index'
import { splitImgOrFile, downloadAttachFile } from "@/views/OA/factory/hooks"
const props = defineProps({
  fileUrls: { type: String, default: '' },
  alignType: { type: String, default: '' },
})

const imageList = ref<any>([])
const fileList = ref<any>([])

const initValue = () => {
  const { imageUrls, fileUrls } = splitImgOrFile(props.fileUrls)
  imageList.value = imageUrls
  fileList.value = fileUrls
}

onMounted(() => {
  initValue();
});

watchEffect(() => {
  initValue();
});

</script>
<style lang="scss" scoped>
.imgList {
  display: grid;
  grid-template-columns: repeat(auto-fill, 40px);
  grid-gap: 6px;

  .img {
    margin-right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 2px
  }
}

.fileList {
  &.row {
    display: flex;
    flex-wrap: wrap;
  }

  .fileLink {
    display: flex;
    align-items: center;
    width: 200px;
    margin-right: 10px;

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
