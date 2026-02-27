<template>
  <el-upload
    class="upload-demo"
    :action="importUrl"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :file-list="fileList"
    list-type="picture"
    :limit="7"
    multiple
    :data="formData"
    name="files"
    :accept="acceptUploadFileType"
    :headers="uploadHeaders"
    :before-upload="beforeUpload"
    :on-success="uploadSuccess"
    :on-error ="handleError"
  >
    <el-button type="primary" :loading="loading" icon="plus" v-if="!isDetail" :disabled="fileList.length >= 7">点击上传</el-button>
    
    <template #file="{file,index}">
        <div class="item-img" :draggable="true">
            <el-image
            style="width: 104px; height: 104px;border-radius: 4px 4px;"
            :src="file.url"
            :preview-src-list="fileList.map(x => x.url)"
            :initial-index="index"
            fit="contain"
            preview-teleported
          />
            <div class="img-error" v-if="file.status === 'fail'">
              <span>上传失败</span>
            </div>
            <div class="img-del" @click="handleRemove(file)" v-if="!isDetail">
              <el-icon><close /></el-icon>
            </div>
        </div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getAccessToken } from '@/utils/auth'
import Sortable from 'sortablejs'

const loading =ref(false)
const message = useMessage();
const props =defineProps({
   upLoadList:{
      type:Array,
     default:() => []
   },
   isDetail:{
    type:Boolean
   }
})
const emits= defineEmits(['change','update:upLoadList'])
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
// 请求携带参数
const formData = computed(() => {
  return {
     code:"VC_MODEL_LIB",
     bigFile:true
  }
})

const fileList = ref<any[]>([
])

const handleRemove: any['onRemove'] = (uploadFile) => { 
   const fileUrl = uploadFile.response?.data[0].fileUrl || uploadFile.url
  fileList.value = fileList.value.filter(x => x.url !== fileUrl)
  console.log("fileList",fileList.value)
}

const handlePreview: any['onPreview'] = (file) => {
  console.log(file)
}
const acceptUploadFileType = computed(() => {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].join(',')
})
// 图片上传成功提示
const uploadSuccess = (res: any): void => {
   if(res.code !== 200) return
    fileList.value.push({
      name:res.data[0].fileName,
      url:res.data[0].fileUrl
    })
    emits('change',[...fileList.value.map(x => x.url)].join(','))
    loading.value = false
    message.success("上传文件成功")
}
const beforeUpload =() =>{
  loading.value = true
  return true
}
const handleError =(error) =>{
  loading.value = false
  message.success("上传文件失败")
}


const init =() =>{
   fileList.value = [...props.upLoadList]
   if(props.isDetail){
      nextTick(() =>{
         const ele = document.querySelector(".el-upload-list.el-upload-list--picture")
         ele.style.marginTop="-40px"
      })
   }
}
init()

watch(fileList,() =>{
    emits('update:upLoadList',[...fileList.value])
   emits('change',[...fileList.value.map(x => x.url)])
},{
   deep:true
})

// 初始化拖拽排序
const initSortable = () => {
  nextTick(() => {
    const uploadList = document.querySelector('.el-upload-list--picture')
    if (uploadList && !props.isDetail) {
      Sortable.create(uploadList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt
          if (oldIndex !== newIndex) {
            // 更新fileList顺序
            const updatedList = [...fileList.value]
            const [movedItem] = updatedList.splice(oldIndex, 1)
            updatedList.splice(newIndex, 0, movedItem)
            fileList.value = updatedList
            
            // 触发更新事件
            emits('change', [...fileList.value.map(x => x.url)].join(','))
            emits('update:upLoadList', [...fileList.value])
          }
        }
      })
    }
  })
}
// 在组件挂载和文件列表更新时初始化拖拽
onMounted(() => {
  initSortable()
})

watch(fileList, () => {
  initSortable()
}, {
  deep: true
})

</script>
<style lang="scss" scoped>
:deep(.el-upload-list--picture .el-upload-list__item){
  border: 0px;
  display: flex !important;
  padding: 0 !important;
  border-radius: 0px 0px 0px 0px;
}
:deep(.el-upload-list){
  width: 360px;
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  gap: 5px 5px;
}
.item-img{
  width: 104px;
  height: 104px;
  position: relative;
}
.img-del{
  width: 15px;
  height: 15px;
  background-color:#333333;
  opacity: 0.3;
  color: #fff;
  position: absolute;
  top:0px;
  right: 0px;
  // z-index: 1;
  font-size: 15px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
}
.img-error{
  width: 100%;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  text-align: center;
  color: red;
}
:deep(.sortable-ghost) {
  opacity: 0.5;
  background: #c8ebfb;
}
:deep(.sortable-chosen) {
  transform: rotate(3deg);
}

// 为拖拽项添加光标样式
:deep(.el-upload-list--picture .el-upload-list__item) {
  cursor: move;
}
</style>
