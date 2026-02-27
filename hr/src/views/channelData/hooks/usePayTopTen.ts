import { imgToBase64 } from '@/utils/img'
import html2canvas from 'html2canvas-plus'
const message = useMessage() // 消息弹窗

export const imgExportRef = ref()
export const imgExportHeight = ref(0)
export const exportImgMainRef = ref()
export const imgExporting = ref(false)
// 导出图片
export const exportImg = async (imgName: string) => {
  imgExporting.value = true
  imgExportHeight.value = exportImgMainRef.value.clientHeight
  nextTick(async () => {
    try {
      const canvas = await html2canvas(imgExportRef.value)
      const img = canvas.toDataURL('image/png')
      // 创建一个a标签模拟点击进行下载
      const downloadLink = document.createElement('a')
      downloadLink.id = 'imgDownload'
      downloadLink.style.display = 'none'
      downloadLink.href = img
      downloadLink.download = imgName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      imgExporting.value = false
    } catch (error) {
      imgExporting.value = false
      message.warning('导出图片失败')
    }
  })
}

export const imgBase64Dict = ref({})
// 获取图片的base64
export const imageToBase64 = async (url: string) => {
  if (imgBase64Dict[`${url}`]) {
    return
  }
  imgToBase64(url)
    .then((base64) => {
      imgBase64Dict.value[`${url}`] = base64
    })
    .catch((error) => {
      console.error(error) // 处理错误
    })
}

// 动态标题 处理日期
export const handleDynamicTitle = (dateRange: any): string => {
  if (dateRange.length >= 2) {
    const startArr = dateRange[0].split('-') || []
    const endArr = dateRange[1].split('-') || []
    let startDate = ''
    let endDate = ''
    if (startArr.length >= 3) {
      startDate = `${Number(startArr[1])}月${Number(startArr[2])}`
    }
    if (endArr.length >= 3) {
      endDate = `${Number(endArr[1])}月${Number(endArr[2])}日`
    }
    if (startArr[1] === endArr[1] && startArr[2] === endArr[2]) {
      return `${startDate}`
    } else {
      if (startArr[1] === endArr[1]) {
        return `${startDate} ~ ${endArr[2]}日`
      } else {
        return `${startDate} ~ ${endDate}`
      }
    }
  } else {
    return ''
  }
}
