/*
 * @Date: 2024-06-07 14:17:38
 */
export const download0 = (data: Blob, fileName: string, mineType: string) => {
  // 创建 blob
  const blob = new Blob([data], { type: mineType })
  // 创建 href 超链接，点击进行下载
  window.URL = window.URL || window.webkitURL
  const href = URL.createObjectURL(blob)
  const downA = document.createElement('a')
  downA.href = href
  downA.download = fileName
  downA.click()
  // 销毁超连接
  window.URL.revokeObjectURL(href)
}

// 触发下载
export function downloadBlob(blob: Blob | null, filename: string) {
  if (!blob) return

  // 创建隐藏的下载链接
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename // 设置文件名（如 "canvas.png"）

  // 兼容性处理：部分浏览器需将链接添加到 DOM 中
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // 释放内存
  URL.revokeObjectURL(link.href)
}

const download = {
  // 下载 Excel 方法
  excel: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/vnd.ms-excel')
  },
  // 下载 Word 方法
  word: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/msword')
  },
  // 下载 Zip 方法
  zip: (data: Blob, fileName: string) => {
    download0(data, fileName, 'application/zip')
  },
  // 下载 Html 方法
  html: (data: Blob, fileName: string) => {
    download0(data, fileName, 'text/html')
  },
  // 下载 Markdown 方法
  markdown: (data: Blob, fileName: string) => {
    download0(data, fileName, 'text/markdown')
  }
}

export const downloadByUrl = (href: string, fileName?: string) => {
  const downA = document.createElement('a')
  downA.href = href
  downA.download = fileName || ''
  downA.click()
  window.URL.revokeObjectURL(href)
}

/**
 * 此方法可以有效设置下载文件的文件名
 * @param href 文件路径
 * @param fileName 文件名
 */
export function downloadByUrl2(href: string, fileName: string) {
  fetch(href)
    .then((res) => res.blob())
    .then((blob) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      URL.revokeObjectURL(link.href)
    })
}

export default download
