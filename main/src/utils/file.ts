// https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/test/newProduct/559d99d4-beba-480d-a8b6-4685be865da8.xlsx?name=漪夢奈特的練角大補帖※四月更新版本.xlsx

import axios from 'axios'
import { v4 as uuid } from 'uuid'

/**
 * 判断URL是否为PDF文件
 * @param {string} fileNameOrUrl - 需要检查的文件名或URL
 * @returns {boolean} - 如果是PDF文件返回true，否则返回false
 */
export function isPDF(fileNameOrUrl: string): boolean {
  const reg = /\.(pdf)$/

  // 如果看起来像URL，先提取扩展名
  if (fileNameOrUrl.includes('://') || fileNameOrUrl.includes('?')) {
    const ext = getFileExtensionFromUrl(fileNameOrUrl)
    return reg.test(`.${ext}`)
  }

  return reg.test(fileNameOrUrl.toLowerCase())
}

/**
 * 判断URL是否为Excel文件
 * @param {string} fileNameOrUrl - 需要检查的文件名或URL
 * @returns {boolean} - 如果是Excel文件返回true，否则返回false
 */
export function isExcel(fileNameOrUrl: string): boolean {
  const reg = /\.(xlsx|xls)$/

  // 如果看起来像URL，先提取扩展名
  if (fileNameOrUrl.includes('://') || fileNameOrUrl.includes('?')) {
    const ext = getFileExtensionFromUrl(fileNameOrUrl)
    return reg.test(`.${ext}`)
  }

  return reg.test(fileNameOrUrl.toLowerCase())
}

/**
 * 判断URL是否为Word文件
 * @param {string} fileNameOrUrl - 需要检查的文件名或URL
 * @returns {boolean} - 如果是Word文件返回true，否则返回false
 */
export function isWord(fileNameOrUrl: string): boolean {
  const reg = /\.(doc|docx)$/

  // 如果看起来像URL，先提取扩展名
  if (fileNameOrUrl.includes('://') || fileNameOrUrl.includes('?')) {
    const ext = getFileExtensionFromUrl(fileNameOrUrl)
    return reg.test(`.${ext}`)
  }

  return reg.test(fileNameOrUrl.toLowerCase())
}

/**
 * 判断URL是否为PPT文件
 * @param {string} fileNameOrUrl - 需要检查的文件名或URL
 * @returns {boolean} - 如果是PPT文件返回true，否则返回false
 */
export function isPPT(fileNameOrUrl: string): boolean {
  const reg = /\.(ppt|pptx)$/

  // 如果看起来像URL，先提取扩展名
  if (fileNameOrUrl.includes('://') || fileNameOrUrl.includes('?')) {
    const ext = getFileExtensionFromUrl(fileNameOrUrl)
    return reg.test(`.${ext}`)
  }

  return reg.test(fileNameOrUrl.toLowerCase())
}

/**
 * 判断URL是否为文档类型
 * @param {string} fileNameOrUrl - 需要检查的文件名或URL
 * @returns {boolean} - 如果是文档类型返回true，否则返回false
 */
export function isDocument(fileNameOrUrl: string): boolean {
  return (
    isPDF(fileNameOrUrl) || isExcel(fileNameOrUrl) || isWord(fileNameOrUrl) || isPPT(fileNameOrUrl)
  )
}

/**
 * 从URL中提取文件扩展名
 * 支持从name参数中提取，如果没有则从URL路径中提取
 * @param {string} url - 文件URL
 * @returns {string} - 文件扩展名（不包含点号）
 */
export function getFileExtensionFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)

    // 优先从name参数获取
    const nameParam = urlObj.searchParams.get('name')
    if (nameParam) {
      const ext = nameParam.split('.').pop()?.toLowerCase()
      if (ext) return ext
    }

    // 从路径中获取
    const pathname = urlObj.pathname
    const ext = pathname.split('.').pop()?.toLowerCase()
    return ext || ''
  } catch (error) {
    // 如果不是有效的URL，直接从字符串中提取
    const parts = url.split('.')
    return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : ''
  }
}

/**
 * 判断URL是否为图片文件
 * @param {string} fileNameOrUrl - 需要检查的文件名或URL
 * @returns {boolean} - 如果是图片文件返回true，否则返回false
 */
export function isImage(fileNameOrUrl: string): boolean {
  const reg = /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|tiff|tif|heic|heif)$/

  // 如果看起来像URL，先提取扩展名
  if (fileNameOrUrl?.includes('://') || fileNameOrUrl?.includes('?')) {
    const ext = getFileExtensionFromUrl(fileNameOrUrl)
    return reg.test(`.${ext}`)
  }

  return reg.test(fileNameOrUrl?.toLowerCase())
}

/**
 * 微软在线文档预览链接
 * @param {string} url - 需要预览的文件URL 必须是公开链接
 * @returns {string} - 预览链接
 */
export function microsoftOnlinePreviewUrl(url: string): string {
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
}

/**
 * 从响应头Content-Disposition中提取文件名
 * @param {string} contentDisposition - Content-Disposition头部值
 * @returns {string} - 提取的文件名或默认文件名
 */
export function getFileNameFromContentDisposition(contentDisposition: string): string {
  let fileName = 'download'

  if (contentDisposition) {
    // 处理 filename= 格式
    const filenameMatch = contentDisposition.match(/filename=(.+)/)
    if (filenameMatch) {
      fileName = filenameMatch[1].replace(/['"]/g, '') // 移除引号
    }

    // 处理 filename*= 格式 (RFC 5987)
    const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/)
    if (filenameStarMatch && filenameStarMatch.length > 1) {
      fileName = decodeURIComponent(filenameStarMatch[1])
    }

    // 处理中文文件名编码
    if (fileName.includes('%')) {
      try {
        fileName = decodeURIComponent(fileName)
      } catch (e) {
        console.warn('Failed to decode filename:', fileName)
      }
    }
  }

  return fileName
}

/**
 * 处理带响应头的文件流导出下载
 * @param {any} response - axios响应对象，包含data和headers
 * @param {string} defaultFileName - 默认文件名（当无法从响应头获取时使用）
 * @returns {void}
 */
export function downloadFileFromResponse(
  response: any,
  defaultFileName: string = 'download.xlsx'
): void {
  const blob = response.data || response

  // 从响应头获取文件名
  let fileName = defaultFileName
  if (response.headers && response.headers['content-disposition']) {
    fileName = getFileNameFromContentDisposition(response.headers['content-disposition'])
  }

  // 如果仍然没有扩展名，使用默认扩展名
  if (!fileName.includes('.')) {
    fileName = `${fileName}.xlsx`
  }

  // 创建下载链接
  const blobUrl = window.URL.createObjectURL(new Blob([blob]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = blobUrl
  link.download = fileName

  // 添加到 DOM 并触发下载
  document.body.appendChild(link)
  link.click()

  // 清理
  document.body.removeChild(link)
  window.URL.revokeObjectURL(blobUrl)
}

/**
 * 处理文件流导出下载
 * @param {Blob} blob - 文件流数据
 * @param {string} fileName - 文件名（不包含扩展名）
 * @param {string} fileExtension - 文件扩展名（如：xlsx, pdf, docx）
 * @returns {void}
 */
export function downloadFileStream(
  blob: Blob,
  fileName: string,
  fileExtension: string = 'xlsx'
): void {
  // 根据文件扩展名设置对应的 MIME 类型
  const mimeTypes: Record<string, string> = {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword',
    zip: 'application/zip',
    csv: 'text/csv'
  }

  const mimeType = mimeTypes[fileExtension.toLowerCase()] || 'application/octet-stream'
  const fullFileName = `${fileName}.${fileExtension}`

  // 创建下载链接
  const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: mimeType }))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = blobUrl
  link.download = fullFileName

  // 添加到 DOM 并触发下载
  document.body.appendChild(link)
  link.click()

  // 清理
  document.body.removeChild(link)
  window.URL.revokeObjectURL(blobUrl)
}
export const previewPdf = async (url: string, rawName?: string): Promise<boolean> => {
  // 使用唯一的窗口名称，避免返回当前窗口引用
  const windowName = `pdf_preview_${uuid()}`
  const previewWindow = window.open('about:blank', windowName)

  if (!previewWindow) {
    window.open(url, '_blank')
    return false
  }

  // 确保打开的是新窗口而不是当前窗口
  if (previewWindow === window) {
    window.open(url, '_blank')
    return false
  }

  // 显示加载中状态
  previewWindow.document.write(
    '<html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">加载中...</body></html>'
  )

  let displayName = '预览'
  if (rawName) {
    try {
      displayName = decodeURIComponent(rawName)
    } catch (error) {
      displayName = rawName
    }
  }

  const escapeHtml = (text?: string) =>
    (text ?? '').replace(/[<>"'&]/g, (match) => {
      switch (match) {
        case '<':
          return '&lt;'
        case '>':
          return '&gt;'
        case '"':
          return '&quot;'
        case "'":
          return '&#39;'
        case '&':
          return '&amp;'
        default:
          return match
      }
    })

  try {
    const response = await fetch(url, { credentials: 'include' })
    if (!response.ok) {
      throw new Error(`加载PDF失败: ${response.status}`)
    }
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    const revoke = () => {
      URL.revokeObjectURL(blobUrl)
      previewWindow.removeEventListener('beforeunload', revoke)
    }

    previewWindow.addEventListener('beforeunload', revoke, { once: true })
    previewWindow.document.open()
    previewWindow.document.write(
      `<!DOCTYPE html><html><head><title>${escapeHtml(
        displayName
      )}</title></head><body style="margin:0;background:#f5f5f5;"><iframe src="${blobUrl}" frameborder="0" style="border:none;width:100%;height:100vh;"></iframe></body></html>`
    )
    previewWindow.document.close()
    return true
  } catch (error) {
    console.error('PDF 预览失败:', error)
    previewWindow.close()
    window.open(url, '_blank')
    return false
  }
}
const parseFileNameFromUrl = (url: string, fallbackName?: string): string => {
  try {
    const urlObj = new URL(url)
    const nameParam = urlObj.searchParams.get('name')
    if (nameParam) {
      return decodeURIComponent(nameParam)
    }
    const pathname = urlObj.pathname
    const lastSegment = pathname.split('/').pop()
    if (lastSegment) {
      return decodeURIComponent(lastSegment)
    }
  } catch (error) {
    const segments = url.split('/')
    const lastSegment = segments.pop()
    if (lastSegment) {
      return decodeURIComponent(lastSegment)
    }
  }
  return fallbackName || uuid()
}

export const downloadFileByUrl = async (url: string, rawName?: string): Promise<boolean> => {
  if (!url) {
    return false
  }
  try {
    const response = await axios.get(url, {
      responseType: 'blob',
      withCredentials: true
    })

    let fileName = rawName ? decodeURIComponent(rawName) : undefined
    const contentDisposition = response.headers['content-disposition']
    if (contentDisposition) {
      fileName = getFileNameFromContentDisposition(contentDisposition)
    }
    fileName = parseFileNameFromUrl(url, fileName)

    const blob = response.data
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = blobUrl
    link.download = fileName

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
    return true
  } catch (error) {
    console.error('文件下载失败:', error)
    // window.open(url, '_self')
    return false
  }
}
