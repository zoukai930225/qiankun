import html2canvas from 'html2canvas-plus'

// 导出图片工具类
export const MultiTableExportUtil = {
  // 获取表格真实宽度
  getTableWidth(container: HTMLElement, defaultWidth: number): number {
    // 尝试获取表格体的宽度属性
    const tableBody = container.querySelector('.el-table__body') as HTMLElement
    if (tableBody) {
      // 尝试从style.width获取
      let width = tableBody.style.width
      if (width && width.endsWith('px')) {
        return parseInt(width)
      }

      // 尝试从width属性获取
      width = tableBody.getAttribute('width') || ''
      if (width) {
        return parseInt(width)
      }

      // 尝试获取表格的总宽度
      if (tableBody.scrollWidth > 0) {
        return tableBody.scrollWidth
      }
    }

    // 尝试获取表头的宽度
    const tableHeader = container.querySelector('.el-table__header') as HTMLElement
    if (tableHeader) {
      let width = tableHeader.style.width
      if (width && width.endsWith('px')) {
        return parseInt(width)
      }

      width = tableHeader.getAttribute('width') || ''
      if (width) {
        return parseInt(width)
      }

      if (tableHeader.scrollWidth > 0) {
        return tableHeader.scrollWidth
      }
    }

    // 默认宽度
    return defaultWidth
  },

  // 创建临时容器，并复制canvas内容
  async createTempContainer(
    originalElement: HTMLElement,
    width: number,
    padding = 20
  ): Promise<HTMLElement> {
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'
    container.style.width = width + 'px'
    container.style.backgroundColor = '#ffffff'
    container.style.padding = `${padding}px`
    const clonedElement = originalElement.cloneNode(true) as HTMLElement
    container.appendChild(clonedElement)
    document.body.appendChild(container)

    // 等待一帧，确保DOM已渲染
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    // 确保表格单元格可以换行
    const tableCells = container.querySelectorAll('td, th')
    tableCells.forEach((cell) => {
      const htmlCell = cell as HTMLElement
      htmlCell.style.whiteSpace = 'normal'
      htmlCell.style.wordBreak = 'break-all'
      htmlCell.style.wordWrap = 'break-word'
      htmlCell.style.overflowWrap = 'break-word'
      // // 对于需要换行的单元格类型，强制设置换行样式
      // const needsWrap =
      //   htmlCell.classList.contains('value-cell') ||
      //   htmlCell.classList.contains('tolerance-col') ||
      //   htmlCell.classList.contains('issue-content') ||
      //   htmlCell.classList.contains('part-name-col')

      // if (needsWrap) {
      //   htmlCell.style.whiteSpace = 'normal'
      //   htmlCell.style.wordBreak = 'break-all'
      //   htmlCell.style.wordWrap = 'break-word'
      //   htmlCell.style.overflowWrap = 'break-word'
      // }
    })

    // 再次等待一帧，确保样式应用后布局已更新
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    // 复制所有canvas的内容
    const originalCanvases = originalElement.querySelectorAll('canvas')
    const cloneCanvases = container.querySelectorAll('canvas')

    if (originalCanvases.length !== cloneCanvases.length) {
      console.warn('Original and clone canvas counts do not match')
    }

    originalCanvases.forEach((originalCanvas, index) => {
      if (index >= cloneCanvases.length) return

      const cloneCanvas = cloneCanvases[index]

      // 确保尺寸匹配
      cloneCanvas.width = originalCanvas.width
      cloneCanvas.height = originalCanvas.height
      cloneCanvas.style.width = originalCanvas.style.width
      cloneCanvas.style.height = originalCanvas.style.height

      // 复制内容
      const cloneCtx = cloneCanvas.getContext('2d')
      if (cloneCtx) {
        try {
          cloneCtx.drawImage(originalCanvas, 0, 0)
        } catch (error) {
          console.error('Failed to copy canvas content:', error)
        }
      }
    })

    return container
  },

  // 生成单个表格的图像
  async captureElement(
    element: HTMLElement,
    width: number,
    containerPadding = 20
  ): Promise<HTMLCanvasElement> {
    const container = await this.createTempContainer(element, width, containerPadding)
    try {
      const canvas = await html2canvas(container, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      })
      return canvas
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container)
      }
    }
  },

  // 合并多个图像为一个
  mergeCanvases(canvases: HTMLCanvasElement[], padding: number = 20): HTMLCanvasElement {
    // 找出最大宽度
    const finalWidth = Math.max(...canvases.map((canvas) => canvas.width))

    // 计算总高度（包含间距）
    const finalHeight = canvases.reduce((height, canvas, index) => {
      return height + canvas.height + (index > 0 ? padding : 0)
    }, 0)

    // 创建最终画布
    const finalCanvas = document.createElement('canvas')
    finalCanvas.width = finalWidth
    finalCanvas.height = finalHeight

    const ctx = finalCanvas.getContext('2d')
    if (!ctx) {
      throw new Error('无法获取canvas上下文')
    }

    // 设置白色背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, finalWidth, finalHeight)

    // 绘制每个画布
    let yOffset = 0
    canvases.forEach((canvas, index) => {
      if (index > 0) {
        yOffset += padding
      }
      ctx.drawImage(canvas, 0, yOffset)
      yOffset += canvas.height
    })

    return finalCanvas
  },

  // 下载图片
  downloadImage(canvas: HTMLCanvasElement, filename: string): void {
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.click()
  },

  // 导出多个元素为一个图片
  async exportElements(
    elements: HTMLElement[],
    options: {
      filename: string
      defaultWidths?: number[]
      padding?: number
      extraWidth?: number
      containerPadding?: number
    }
  ): Promise<void> {
    try {
      if (!elements || elements.length === 0) {
        throw new Error('没有提供要导出的元素')
      }

      // 让出一帧，确保 loading 先渲染
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

      const extraWidth = options.extraWidth ?? 40
      const mergePadding = options.padding ?? 20
      const containerPadding = options.containerPadding ?? 20
      const defaultWidths = options.defaultWidths || Array(elements.length).fill(1500)

      // 获取每个元素的宽度
      const widths = elements.map((element, index) => {
        // 对于表格元素，尝试获取表格真实宽度
        if (element.querySelector('.el-table__body')) {
          return this.getTableWidth(element, defaultWidths[index]) + extraWidth
        }
        // 对于其他元素，使用scrollWidth
        return Math.max(element.scrollWidth, defaultWidths[index]) + extraWidth
      })

      console.log('width', widths)

      // 捕获所有元素
      const canvases = await Promise.all(
        elements.map((element, index) =>
          this.captureElement(element, widths[index], containerPadding)
        )
      )

      // 合并图像
      const mergedCanvas = this.mergeCanvases(canvases, mergePadding)

      // 下载图像
      this.downloadImage(mergedCanvas, options.filename)
    } catch (error) {
      console.error('导出图片失败:', error)
    }
  },

  // 统一导出 PDF 方法
  async exportPdf(
    elements: HTMLElement | HTMLElement[],
    options: {
      filename: string
      defaultWidths?: number[]
      padding?: number
      extraWidth?: number
      format?: 'a4' | 'a3' | 'a2' | 'auto'
      orientation?: 'portrait' | 'landscape'
      marginMm?: number
      containerPadding?: number
      openInBrowser?: boolean // 新增选项
    }
  ): Promise<void> {
    try {
      const elementList = Array.isArray(elements) ? elements : [elements]
      if (elementList.length === 0) throw new Error('没有提供要导出的元素')

      // 让出一帧，确保 loading 先渲染
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

      const extraWidth = options.extraWidth ?? 40
      const mergePadding = options.padding ?? 20
      const containerPadding = options.containerPadding ?? 20
      const defaultWidths = options.defaultWidths || Array(elementList.length).fill(1500)

      // 计算每个元素应渲染的宽度
      const widths = elementList.map((el, index) => {
        // 针对element table 处理
        if (el.querySelector('.el-table__body')) {
          return this.getTableWidth(el, defaultWidths[index]) + extraWidth
        }
        return Math.max(el.scrollWidth, defaultWidths[index]) + extraWidth
      })

      // 抓取画布
      const canvases = await Promise.all(
        elementList.map((el, index) => this.captureElement(el, widths[index], containerPadding))
      )

      // 如有多个，纵向合并
      const finalCanvas =
        canvases.length > 1 ? this.mergeCanvases(canvases, mergePadding) : canvases[0]

      // 纸张与方向
      const fmt = options.format || 'auto'
      const pdfFormat =
        fmt === 'auto'
          ? finalCanvas.width > 2200
            ? 'a2'
            : finalCanvas.width > 1500
              ? 'a3'
              : 'a4'
          : fmt
      const orientation = options.orientation || 'landscape'
      const margin = options.marginMm ?? 10

      const { default: jsPDF } = await import('jspdf')
      const pdf = new jsPDF({
        orientation: orientation as any,
        unit: 'mm',
        format: pdfFormat as any
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const usableWidth = pageWidth - margin * 2
      const usableHeight = pageHeight - margin * 2

      // 计算单页像素高度（依据宽度等比缩放）
      const imgHeightPerPagePx = Math.floor((usableHeight * finalCanvas.width) / usableWidth)

      const ctx = finalCanvas.getContext('2d')
      if (!ctx) throw new Error('无法获取画布上下文')

      let renderedHeight = 0
      while (renderedHeight < finalCanvas.height) {
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = finalCanvas.width
        pageCanvas.height = Math.min(imgHeightPerPagePx, finalCanvas.height - renderedHeight)

        const pageCtx = pageCanvas.getContext('2d')
        if (!pageCtx) throw new Error('无法创建分页画布')

        pageCtx.putImageData(
          ctx.getImageData(0, renderedHeight, finalCanvas.width, pageCanvas.height),
          0,
          0
        )

        const imgData = pageCanvas.toDataURL('image/jpeg', 1)
        const drawWidth = usableWidth
        const drawHeight = (drawWidth * pageCanvas.height) / pageCanvas.width

        pdf.addImage(imgData, 'JPEG', margin, margin, drawWidth, drawHeight, undefined, 'FAST')

        renderedHeight += imgHeightPerPagePx
        if (renderedHeight < finalCanvas.height) pdf.addPage()
      }

      // 根据选项决定是下载还是在浏览器中打开
      if (options.openInBrowser) {
        const blob = pdf.output('blob')
        const blobUrl = URL.createObjectURL(blob)
        const previewWindow = window.open('', '_blank')
        /**
         * 
         *  const pdfBlob = pdf.output('blob')
            const blobUrl = URL.createObjectURL(pdfBlob)
            const newWindow = window.open(blobUrl, '_blank')
            为啥不这样搞 让浏览器内置 PDF 查看器直接预览时，Chrome
            会按打印模式来渲染，默认会把背景色/边框这些“背景图形”去掉
         */

        if (previewWindow) {
          const safeTitle = (options.filename || '预览').replace(/[<>"'&]/g, '')
          const revokeBlobUrl = () => {
            URL.revokeObjectURL(blobUrl)
            previewWindow.removeEventListener('beforeunload', revokeBlobUrl)
          }

          previewWindow.addEventListener('beforeunload', revokeBlobUrl, { once: true })
          previewWindow.document.open()
          previewWindow.document.write(
            `<!DOCTYPE html><html><head><title>${safeTitle}</title></head><body style="margin:0"><iframe src="${blobUrl}" frameborder="0" style="border:none;width:100%;height:100vh;"></iframe></body></html>`
          )
          previewWindow.document.close()
        } else {
          URL.revokeObjectURL(blobUrl)
          console.warn('无法打开新窗口预览PDF，改为触发下载')
          pdf.save(options.filename)
        }
      } else {
        // 默认下载
        pdf.save(options.filename)
      }
    } catch (error) {
      console.error('导出PDF失败:', error)
      throw error
    }
  }
}
