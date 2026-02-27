// src/utils/pdf-export.ts
import html2pdf from 'html2pdf.js'
import type { Html2PdfOptions } from 'html2pdf.js'
import { ElLoading } from 'element-plus';

const message = useMessage()
/**
 * 导出指定 DOM 元素为 PDF
 * @param dom 目标 DOM 元素
 * @param filename 导出文件名（不含 .pdf 后缀）
 * @param options 自定义配置（可选）
 */
export const exportToPdf = async (
  dom: HTMLElement,
  filename: string,
  options?: Partial<Html2PdfOptions>,
  style?: any
) => {
  if (!dom) {
    ElMessage.error('未找到导出目标元素')
    return
  }

  const loading = ElLoading.service({ fullscreen: true, text: '文件导出中......' });

  // 默认配置（适配 Element Plus 组件样式）
  const defaultOptions: Html2PdfOptions = {
    margin: 5, // pdf边距，单位mm，数组形式表示上右下左
    filename: `${filename}.pdf`, //导出的 PDF 文件名（无需加 .pdf 后缀）
    image: { type: 'jpeg', quality: 1 }, // 图片配置（type：图片格式 'jpeg'/'png'；quality：质量 0-1）
    enableLinks: false,
    html2canvas: {
      scale: 1.5, // 解决模糊问题
      useCORS: true, // 支持跨域图片（Element Plus 图标或远程图片）
      allowTaint: false,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      ...style
    },
    jsPDF: {
      unit: 'mm',
      format: 'a3',
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['avoid-all', 'css'], // 避免 Element Plus 表格跨页截断
      avoid: '.row_8', // 避免表格行被截断
      before: '.page-break'
    }
  }

  try {
    // 合并默认配置与用户配置
    const finalOptions = { ...defaultOptions, ...options }
    // 执行导出
    await html2pdf().set(finalOptions).from(dom).save()
    loading && loading.close();
    message.success('PDF 导出成功')
  } catch (error) {
    loading && loading.close();
    console.error('PDF 导出失败:', error)
    message.error('PDF 导出失败，请重试')
  }
}
