<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <SWDialog v-if="dialogVisible" v-model="dialogVisible" title="发货视频" width="600px">
    <el-carousel class="carousel" arrow="always">
      <el-carousel-item v-for="(file,index) in fileUrls" :key="index" class="carouselItem">
        <el-image :src="file.fileUrl" v-if="getFileType(file) === 'isImage'" class="previewFile" fit="contain"/>
        <video :src="file.fileUrl" class="previewFile" v-else controls></video>
      </el-carousel-item>
    </el-carousel>
  </SWDialog>
  
</template>

<script lang="ts" setup>
const dialogVisible = ref(false)

const fileUrls = ref<any>([])

const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
const getFileType = (file:any) => {
  const fileName = file.fileName 
  const type = fileName?.split('.')[1]
  return imageTypes.includes(type)
  ? 'isImage':'isVideo'
}

// 打开弹窗
const open = async (urls:[]) => {
  dialogVisible.value = true
  fileUrls.value = urls.map((url:string)=>{
    const fileUrl = url.split('?name=')[0]
    const fileName = url.split('?name=')[1]
    return {
      fileUrl,
      fileName
    }
  })

}



onMounted(() => {

})

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style scoped lang="scss">
.carousel{
  max-width: 100%;
  .carouselItem{
    max-width: 100%;
    margin: auto;
  }
}
.previewFile{
  width: 100%;
  height: 100%;
  margin: auto;
}
</style>
