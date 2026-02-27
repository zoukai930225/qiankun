// src/types/html2pdf-plus.d.ts
import type { jsPDF } from 'jspdf'
import type { Options as Html2CanvasOptions } from 'html2canvas'

declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number]
    filename?: string
    image?: {
      type: 'jpeg' | 'png'
      quality: number
    }
    html2canvas?: Html2CanvasOptions
    jsPDF?: {
      unit: 'pt' | 'mm' | 'cm' | 'in'
      format: string | [number, number]
      orientation: 'portrait' | 'landscape'
    }
    pagebreak?: {
      mode?: ('avoid-all' | 'css' | 'legacy')[]
      before?: string | HTMLElement | (() => HTMLElement)
      after?: string | HTMLElement | (() => HTMLElement)
      avoid?: string | HTMLElement | (() => HTMLElement)
    }
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf
    from(source: HTMLElement | string | HTMLCanvasElement): Html2Pdf
    save(filename?: string): Promise<void>
    output(type: 'blob' | 'datauristring'): Promise<Blob | string>
  }

  const html2pdf: () => Html2Pdf
  export default html2pdf
}
