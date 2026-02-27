<!--
 * @Date: 2025-07-22 08:46:34
-->
<template>
  <el-dialog title="应用范围" v-model="dialogVisible" :show-close="false" style="
      width: 570px;
      background: linear-gradient(226deg, #ffffff 0%, #ffffff 88%, #e8f6fd 95%, #f0f8ff 100%);
      border-radius: 14px;
    ">
    <template #header>
      <div class="header">
        <div>淘汰原因</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
      </div>
    </template>
    <div class="container">
      <el-form :model="currentDetail" ref="formRef" label-position="right" label-width="90px">
        <el-form-item label="淘汰原因" prop="remark">
          <s-text-area disabled v-model="currentDetail.eliminationReasons" placeholder="请输入淘汰原因" />
        </el-form-item>
        <el-form-item label="附件" prop="attachmentUrl">
          <!-- currentDetail.attachmentUrl 里面包含图片和附件的字符串，现在要求图片和附件分开渲染 图片展示缩略图 附件展示名称 -->
          <div>
            <div v-for="(imgItem, imgIndex) in formatImg(currentDetail.attachmentUrl)" :key="imgIndex">
              <el-image :src="imgItem.url" class="notice-img" style="width: 64px; height: 64px" :zoom-rate="1.2"
                :max-scale="7" :min-scale="0.2"
                :preview-src-list="formatImg(currentDetail.attachmentUrl).map((img) => img.url)" show-progress
                :initial-index="imgIndex" fit="cover" />
            </div>

            <div v-for="(fileItem, fileIndex) in formatFile(currentDetail.attachmentUrl)" :key="fileIndex">
              <a :href="fileItem.url">{{ fileItem.name }}</a>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
const dialogVisible = ref(false)
const message = useMessage() // 消息弹窗

const form = ref({
  remark: '',
  attachmentUrl: []
})

const currentDetail = ref()
const open = (item) => {
  dialogVisible.value = true
  currentDetail.value = item // 设置当前供应商详情
}
const formRef = ref() // 表单引用

const emit = defineEmits(['success']) // 定义 success 事件

const formatImg = (attachmentUrl) => {
  if (!attachmentUrl) return []

  return attachmentUrl
    .split(',')
    .map((item) => {
      return {
        url: item,
        name: item.split('?')[1] // 获取文件名
      }
    })
    .filter((item) => {
      return (
        (item.name &&
          (item.name.endsWith('.jpg') ||
            item.name.endsWith('.png') ||
            item.name.endsWith('.jpeg'))) ||
        (item.url &&
          (item.url.endsWith('.jpg') || item.url.endsWith('.png') || item.url.endsWith('.jpeg')))
      )
    })
}

const formatFile = (attachmentUrl) => {
  if (!attachmentUrl) return []
  // 只要文件不要图片
  return attachmentUrl
    .split(',')
    .map((item) => {
      return {
        url: item,
        name: item?.split('?')[1]?.split('=')[1] // 获取文件名
      }
    })
    .filter((item) => {
      return (
        item.name &&
        !(item.name.endsWith('.jpg') || item.name.endsWith('.png') || item.name.endsWith('.jpeg'))
      )
    })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
/* 隐藏滚动条，但保持滚动功能 */
::-webkit-scrollbar {
  display: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  img {
    width: 14px;
    cursor: pointer;
  }
}

.container {}
</style>
