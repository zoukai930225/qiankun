import { h, render, type AppContext, type VNode } from 'vue'
import { nextFrameTick } from '@/utils/util'

import { MultiTableExportUtil } from '@/utils/exportImg'
import { getQualityInspectionReportInfo } from '@/api/supplier/qcManagement/randomInspectionPlanConfiguration'
import { useLoadingStore } from '@/store/modules/loading'

import PreviewIndex from './index.vue'
import type { QualityInspectionReportInfo } from './types'
import { getDictLabel } from '@/utils/dict'
import { measurePerformance } from '@/hooks/web/useDrawer/utils'

const A4_WIDTH_PX = 1240
const A4_HEIGHT_PX = Math.round(A4_WIDTH_PX * Math.SQRT2)

const waitForImagesLoaded = async (root: HTMLElement) => {
  const images = Array.from(root.querySelectorAll('img'))
  if (!images.length) return
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve()
      }
      return new Promise<void>((resolve) => {
        const cleanup = () => {
          img.removeEventListener('load', cleanup)
          img.removeEventListener('error', cleanup)
          resolve()
        }
        img.addEventListener('load', cleanup, { once: true })
        img.addEventListener('error', cleanup, { once: true })
      })
    })
  )
}

const createHiddenHost = (): HTMLElement => {
  const host = document.createElement('div')
  host.style.position = 'fixed'
  host.style.left = '-9999px'
  host.style.top = '0'
  host.style.width = `${A4_WIDTH_PX}px`
  host.style.minHeight = `${A4_HEIGHT_PX}px`
  host.style.backgroundColor = '#ffffff'
  host.style.padding = '0'
  host.style.boxSizing = 'border-box'
  host.style.zIndex = '-1'
  host.style.pointerEvents = 'none'
  document.body.appendChild(host)
  return host
}

export interface ExportPreviewOptions {
  filename?: string
  reportId?: string | number
  report?: QualityInspectionReportInfo
}

export async function exportQualityPreview(
  appContext: AppContext | null | undefined,
  options: ExportPreviewOptions = {}
) {
  return measurePerformance('预览耗时统计', async () => {
    const host = createHiddenHost()
    let vnode: VNode | null = null
    const loadingStore = useLoadingStore()
    loadingStore.showLoading()

    try {
      const reportData = await fetchQualityPreviewReport(options)

      vnode = h(PreviewIndex, {
        report: reportData
      })

      if (appContext) {
        vnode.appContext = appContext
      }

      render(vnode, host)

      await nextFrameTick()

      const exportRoot = host.firstElementChild as HTMLElement | null
      if (!exportRoot) {
        throw new Error('预览渲染失败，未找到导出节点')
      }

      await waitForImagesLoaded(exportRoot)

      await MultiTableExportUtil.exportPdf(exportRoot, {
        filename: options.filename || '品质检验报告.pdf',
        format: 'a4',
        orientation: 'portrait',
        marginMm: 5,
        defaultWidths: [A4_WIDTH_PX],
        extraWidth: 0,
        padding: 0,
        containerPadding: 0,
        openInBrowser: true
      })
    } finally {
      loadingStore.hideLoading()
      if (vnode) {
        render(null, host)
      }
      if (host.parentNode) {
        host.parentNode.removeChild(host)
      }
    }
  })
}

const mergeStageSectionData = (payload: Record<string, any>): Record<string, any> => {
  const base = { ...(payload ?? {}) }
  const earlyMiddleInfo = base.earlyMiddleInfo ?? base.earlyInfo
  const lastInfo = base.lastInfo

  const resolvedCycleSource =
    base.qualityInspectionCycle ??
    (earlyMiddleInfo && earlyMiddleInfo.qualityInspectionCycle) ??
    (lastInfo && lastInfo.qualityInspectionCycle)
  const cycleText =
    resolvedCycleSource === undefined || resolvedCycleSource === null
      ? ''
      : String(resolvedCycleSource)

  let merged = { ...base }
  if (cycleText === '3') {
    if (lastInfo && typeof lastInfo === 'object') {
      merged = { ...merged, ...lastInfo }
    }
  } else if (earlyMiddleInfo && typeof earlyMiddleInfo === 'object') {
    merged = { ...merged, ...earlyMiddleInfo }
  }

  if (cycleText) {
    merged.qualityInspectionCycle =
      cycleText as QualityInspectionReportInfo['qualityInspectionCycle']
  }

  return merged
}

const parseListField = <T = any>(...candidates: unknown[]): T[] => {
  for (const candidate of candidates) {
    if (!candidate) continue
    if (Array.isArray(candidate)) {
      return candidate as T[]
    }
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim()
      if (!trimmed) continue
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed as T[]
        }
      } catch (_error) {}
    }
  }
  return []
}

const normalizeReport = (payload: any): QualityInspectionReportInfo => {
  const merged = mergeStageSectionData(payload ?? {})

  const report = { ...merged } as QualityInspectionReportInfo & Record<string, any>

  if (report.styleDescription !== undefined && report.styleDescription !== null) {
    const label = getDictLabel('style_description', report.styleDescription)
    if (label) {
      report.styleDescription = label
    }
  }

  report.dimenMeasureList = parseListField(
    report.dimenMeasureList,
    report.dimenMeasureJson,
    payload?.dimenMeasureList,
    payload?.dimenMeasureJson
  )

  report.problemDescriptionList = parseListField(
    report.problemDescriptionList,
    report.problemDescriptionJson,
    payload?.problemDescriptionList,
    payload?.problemDescriptionJson
  )

  report.spotCheckPlanList = parseListField(
    report.spotCheckPlanList,
    report.spotCheckPlanJson,
    payload?.spotCheckPlanList,
    payload?.spotCheckPlanJson
  )

  report.defectDescriptionList = parseListField(
    report.defectDescriptionList,
    report.defectDescriptionJson,
    payload?.defectDescriptionList,
    payload?.defectDescriptionJson
  )

  return report
}

const unwrapReportResponse = (payload: any): any => {
  if (!payload) return {}
  if (payload.data !== undefined) return payload.data ?? {}
  if (payload.result !== undefined) return payload.result ?? {}
  if (payload.record !== undefined) return payload.record ?? {}
  const collections = [payload.records, payload.list, payload.rows]
  for (const collection of collections) {
    if (Array.isArray(collection) && collection.length > 0) {
      return collection[0]
    }
  }
  return payload
}

export async function fetchQualityPreviewReport(
  options: ExportPreviewOptions
): Promise<QualityInspectionReportInfo> {
  if (options.report) {
    return normalizeReport(options.report)
  }

  const reportId = options.reportId
  if (reportId === undefined || reportId === null || reportId === '') {
    throw new Error('缺少质检报告标识参数')
  }

  const response = await getQualityInspectionReportInfo(String(reportId))
  const payload = unwrapReportResponse(response)
  return normalizeReport(payload)
}
