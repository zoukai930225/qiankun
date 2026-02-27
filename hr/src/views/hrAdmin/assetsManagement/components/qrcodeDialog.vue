<template>
  <div class="qrcode-dialog">
    <div class="toolbar">
      <el-button type="primary" size="small" :loading="downloading" @click="downloadImage"
        >下载</el-button
      >
    </div>
    <div class="image-wrap">
      <el-image
        v-if="displayUrl"
        :src="displayUrl"
        fit="contain"
        :preview-src-list="[displayUrl]"
      />
      <div v-else class="empty">暂无图片</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import QRCode from 'qrcode'

const props = defineProps<{ imgUrl: string; fileName?: string }>()

const downloading = ref(false)

const generatedUrl = ref('')
const displayUrl = computed(() => generatedUrl.value)

onMounted(async () => {
  try {
    const { protocol, hostname } = window.location
    const origin = `${protocol}//${hostname}:8889`
    const target = `${origin}/#/pages/fixedAsset/apply`

    generatedUrl.value = await QRCode.toDataURL(target, {
      errorCorrectionLevel: 'H',
      width: 180,
      margin: 2
    })
    console.log('target', target, generatedUrl.value, 'generatedUrl')
  } catch (e) {
    ElMessage.error('二维码生成失败')
  }
})

const downloadImage = async () => {
  const url = displayUrl.value
  if (!url) return
  try {
    downloading.value = true
    let href = ''
    // 处理 base64 或远程图片两种情况
    if (url.startsWith('data:')) {
      href = url
    }
    const a = document.createElement('a')
    a.href = href
    a.download = `${props.fileName || '二维码'}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    if (!url.startsWith('data:')) {
      URL.revokeObjectURL(href)
    }
  } catch (e) {
    ElMessage.error('下载失败')
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped lang="scss">
.qrcode-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  .toolbar {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }
  .image-wrap {
    width: 360px;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    :deep(img),
    :deep(.el-image) {
      max-width: 100%;
    }
    .empty {
      color: #909399;
      font-size: 14px;
    }
  }
}
</style>
