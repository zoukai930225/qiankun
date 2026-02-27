export class GcDataItem {
  gmvRangeStart: number | string = 0
  gmvRangeEnd: number | string = 0
  bonusLevel: number | string = 0
  editRatio: number | string = 0
  directorRatio: number | string = 0
  addFlag?: boolean = false
}
export class GcDataRules {
  groupId: string = ''
  month: string = ''
  workId?: string | null = null
  list: Array<GcDataItem> = []
}

export class QcDataRules {
  groupId: string = ''
  month: string = ''
  workId?: string | null = null
  owningProjectId: string = ''
  consumptionTotal: number | string = 0
  consumptionPoint: number | string = 0
  roiCoefficient: number | string = 0
  totalBonusPackage: number | string = 0
  list: Array<QcDataItem> = []
  clipFirstPlaceRatio?: number | null = null
  clipSecondPlaceRatio?: number | null = null
  clipThirdPlaceRatio?: number | null = null
}
export class QcDataItem {
  consumptionRangeStart: number | string = 0
  consumptionRangeEnd: number | string = 0
  score: number | string = 0
  editor: number | string = 0
  director: number | string = 0
  addFlag?: boolean = false
}
