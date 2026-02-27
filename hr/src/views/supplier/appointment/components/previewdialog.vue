<template>
  <s-w-dialog
    ref="dialogRef"
    :model-value="modelValue"
    width="1170"
    @closed="handleClosed"
    @open="handleOpen"
  >
    <el-scrollbar v-loading="loading" :height="800">
      <preview-page :print-info="pageInfo!" ref="previewRef" />
    </el-scrollbar>

    <template #footer>
      <el-button @click="emit('update:model-value', false)">取消</el-button>
      <el-button type="primary" @click="printFn">
        <el-icon class="mr-4px"><Printer /></el-icon>
        打印
      </el-button>
      <el-button
        type="primary"
        :loading="exportLoading"
        :disabled="exportLoading"
        @click="downToPDF"
      >
        <el-icon><Download /></el-icon>
        导出
      </el-button>
    </template>
  </s-w-dialog>

  <print-page ref="printRef" :print-info="pageInfo!" />
</template>
<script lang="ts" setup>
import { getScPackingListPrintApi } from '@/api/supplier/appoint'
import previewPage from './previewPage.vue'
import printPage from './printPage.vue'
import { printStyle } from '../printStyle'
import { exportToPdf } from '@/utils/pdf'
import { formatDate } from '@/utils/formatTime'

const props = defineProps<{
  modelValue: boolean
  id: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean | undefined): void
}>()

const previewRef = ref()
const printRef = ref()
const pageInfo = ref<Supplier.Product.PrintInfo>({})
const loading = ref(false)

async function handleOpen() {
  try {
    await getInfo()
  } catch (error) {
    throw new Error('获取装箱单信息失败')
  }
}

async function getInfo() {
  try {
    loading.value = true
    const res = await getScPackingListPrintApi(props.id)
    if (res) {
      const data: Supplier.Product.ScPackingList[] = res.packingList
      data.forEach((row) => {
        row.boxNumber =
          row.startBoxNumber === row.endBoxNumber
            ? row.startBoxNumber!
            : `${row.startBoxNumber}~${row.endBoxNumber}`
      })

      pageInfo.value = res
    }
  } catch (error) {
    throw new Error('获取装箱单信息失败')
  } finally {
    loading.value = false
  }
}

function handleClosed() {
  emit('update:model-value', false)

  pageInfo.value = {}
}

/** 打印 */
async function printFn() {
  try {
    const printContentHtml = document.getElementById('print')?.innerHTML
    if (!printContentHtml) {
      console.error('打印内容为空')
      return
    }

    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.left = '-9999px'
    iframe.style.top = '-9999px'
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.border = 'none'

    document.body.appendChild(iframe)

    await new Promise((resolve) => {
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        resolve(null)
      } else {
        iframe.onload = resolve
        setTimeout(resolve, 2000)
      }
    })

    if (iframe.contentWindow && iframe.contentDocument) {
      const doc = iframe.contentDocument
      doc.open()
      doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>打印</title>
  <style>${printStyle}</style>
  <style>
    /* 确保打印区域可见 */
    body { margin: 0; padding: 0; }
    .print { display: block !important; }
  </style>
</head>
<body>
  ${printContentHtml}
</body>
</html>`)
      doc.close()

      await new Promise((resolve) => {
        setTimeout(resolve, 500)
      })

      iframe.contentWindow.print()

      setTimeout(() => {
        try {
          document.body.removeChild(iframe)
        } catch (e) {
          console.log('移除iframe失败:', e)
        }
      }, 1000)
    }
  } catch (error) {
    console.log('打印失败:', error)
  }
}

const exportLoading = ref(false)
async function downToPDF() {
  exportLoading.value = true
  if (!previewRef.value) {
    ElMessage.warning('打印组件未加载完成')
    return
  }

  try {
    const targetDom = previewRef.value.$el
    if (!targetDom) {
      ElMessage.error('未找到打印内容区域')
      return
    }
    await exportToPdf(targetDom, `装箱单_${formatDate(new Date(), 'YYYYMMDDHHmmss')}`)
  } catch (error) {
    console.log(error)
  } finally {
    exportLoading.value = false
  }
}

defineExpose({
  open: handleOpen
})
</script>
<style lang="less" scoped></style>
