export type InspectionStage = 'early' | 'late'

export type QualityInspectionCycle = '1' | '2' | '3' | 1 | 2 | 3

export interface SizeDetail {
  standard?: string | number | null
  sample?: string | number | null
}

export type SizeDetailKey =
  | 'sizeDetailsOne'
  | 'sizeDetailsTwo'
  | 'sizeDetailsThree'
  | 'sizeDetailsFour'

export interface DimenMeasureItem {
  partName?: string
  tolerance?: string | number | null
  sizeDetailsOne?: SizeDetail
  sizeDetailsTwo?: SizeDetail
  sizeDetailsThree?: SizeDetail
  sizeDetailsFour?: SizeDetail
  [key: string]: unknown
}

export interface ProblemDescriptionItem {
  number?: string | number | null
  defectValue?:string | null
  defectNum?: string | number | null
  problemDescription?: string | null
}

export interface DefectDescriptionItem {
  defect?: string | number | null
  defectValue?: string | null
  serious?: string | null
  slight?: string | null
}

export interface SpotCheckPlanItem {
  batchRangeName?: string | null
  sampleSize?: string | number | null
  onePointFiveAc?: string | number | null
  onePointFiveRe?: string | number | null
  twoPointFiveAc?: string | number | null
  twoPointFiveRe?: string | number | null
  isHit?: string | number | null
}

export interface QualityInspectionReportInfo {
  qualityInspectionCycle?: QualityInspectionCycle
  supplier?: string
  supplierName?: string
  abbreviationCompany?: string | null
  createName?: string
  itemNumberIds?: string | number | null
  itemNumberNames?: string | null
  scPurchaseOrderNo?: string | null
  styleDescription?: string
  styleDescriptionValue?: string | null
  submissionDate?: string
  checksNumber?: string | number | null
  materialsAccessoriesTest?: string | number | null
  inspectionRecord?: string | number | null
  finishProductCheckRecord?: string | number | null
  dimenMeasureList?: DimenMeasureItem[]
  problemDescriptionList?: ProblemDescriptionItem[]
  testResults?: string | number | null
  inspectionQc?: string | null
  styleNo?: string | null
  deliveryTime?: string | null
  num?: string | number | null
  packQuantity?: string | number | null
  orderFollowId?: string | null
  crop?: string | null
  sew?: string | null
  inspection?: string | null
  pack?: string | null
  fabricColor?: string | number | null
  fabricCylinderDifference?: string | number | null
  fabricFeelWool?: string | number | null
  fabricGramWeight?: string | number | null
  fabricOrgan?: string | number | null
  fabricFeel?: string | number | null
  fabricPrint?: string | number | null
  fabricHomeWash?: string | number | null
  accessMainLabel?: string | number | null
  accessOrnament?: string | number | null
  accessRubberBand?: string | number | null
  accessIngredient?: string | number | null
  accessCareLabel?: string | number | null
  accessSuture?: string | number | null
  accessLogo?: string | number | null
  accessCertificate?: string | number | null
  packagFoldingMethod?: string | number | null
  packagBulk?: string | number | null
  packagBox?: string | number | null
  packagBag?: string | number | null
  institutionalTestFabric?: string | number | null
  institutionalReadyWear?: string | number | null
  institutionalLining?: string | number | null
  institutionalFunction?: string | number | null
  chestPatchesProductProcess?: string | number | null
  chestPatchesStyle?: string | number | null
  packingMethod?: string | null
  packingMethodValue?: string | null
  measureSituation?: string | number | null
  defectDescriptionList?: DefectDescriptionItem[]
  spotCheckPlanList?: SpotCheckPlanItem[]
  packagingFileIds?: string | null
  productFileIds?: string | null
  inspectionColorFileIds?: string | null
  logoFileIds?: string | null
  certificateFileIds?: string | null
  durabilityLabelFileIds?: string | null
  packQuantityFileIds?: string | null
  matAccTestQualified?: string | number | null
  dataCheckIsQualified?: string | number | null
  checkRecordIsQualified?: string | number | null
  inspectionRecordIsQualified?: string | number | null
  finishProductQualified?: string | number | null
  fileIds?: string | null
  comment?: string | null
}

export interface MeasurementCell {
  standard?: string | number | null
  sample?: string | number | null
  [key: string]: string | number | null | undefined
}

export interface MeasurementRow {
  index?: number
  partName: string
  tolerance: string | number | null
  measurements: Record<string, MeasurementCell | undefined>
}

export interface IssueItem {
  number?: string | number | null
  defectValue?:string | null
  description?: string | null
  defectNum?: string | number | null
}

export interface SizeColumnItem {
  /** 展示用文案，例如 160/85M */
  label: string
  /** 数据对应字段，例如 size_160_85M */
  key: string
  /** 对应尺寸明细字段，例如 sizeDetailsOne */
  detailKey?: SizeDetailKey
}

export interface PreviewPayload {
  report?: QualityInspectionReportInfo
}

export const DEFAULT_SIZE_COLUMNS: SizeColumnItem[] = [
  { label: '160/85M', key: 'size_160_85M', detailKey: 'sizeDetailsOne' },
  { label: '165/90L', key: 'size_165_90L', detailKey: 'sizeDetailsTwo' },
  { label: '170/95XL', key: 'size_170_95XL', detailKey: 'sizeDetailsThree' },
  { label: '175/100XXL', key: 'size_175_100XXL', detailKey: 'sizeDetailsFour' }
]

export const STAGE_LABEL_MAP: Record<'1' | '2' | '3', string> = {
  '1': '初期',
  '2': '中期',
  '3': '尾期'
}
