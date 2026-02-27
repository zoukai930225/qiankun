import { Ref } from 'vue'

export class PageItem {
  size: number
  page: number
  total: number
  constructor(data: any = {}) {
    this.size = data?.size || 10
    this.page = data?.current || 1
    this.total = data?.total || 0
  }
}

export class SearchItem {
  store: string = ''
  customerName: string = ''
  orderNo: string = ''
  customerId: string = ''
  violatingPublicOpinion: string = ''
  problemRiskLevel: string = ''
  productId: string = ''
  rootCause: string = ''
  customerPlanTimeService: string = ''
  customerTimeFeedback: string = ''
  registrationIds: Array<string> = []
  registrationId: string = ''
  handleIds: Array<string> = []
  handleId: string = ''
  inspectionTimeBegin: string = ''
  inspectionTimeEnd: string = ''
  expectHandleTimeBegin: string = ''
  expectHandleTimeEnd: string = ''
  completeTimeBegin: string = ''
  completeTimeEnd: string = ''
  warehouseIssueComplete: number | '' = ''
  selectClass: string = ''
}

export class DataItem {
  store: string = ''
  customerName: string = ''
  orderNo: string = ''
  customerId: string = ''
  violatingPublicOpinion: string = ''
  problemRiskLevel: string = ''
  productId: string = ''
  problemRemark: string = ''
  rootCause: string = ''
  specificReason: string = ''
  inspectionTime: string = ''
  id: string = ''
  expectHandleTime: string = ''
  customerPlanTimeService: string = ''
  customerTimeFeedback: string = ''
  customerTimeHandle: string = ''
  handler: string = ''
  handlerAvatarOrigin: string = ''
  handlerName: string = ''
  imagesUrls: string = ''
  warehouseIssueComplete: any
  completeTime: string = ''
  feedbackResult: string = ''
  handleUrls: string = ''
  isHandle: number = 0
  groupName: string = ''
}

export interface TabsProvideType {
  activeValue: Ref<String>
  permissionList: Ref<Array<any>>
  roleList: Ref<Array<any>>
  getDataList: () => void
  detailsView: (row: any, type: string) => void
  customerConfigList:Ref<Array<any>>
}

export interface DetailProvideType {
  dataValue: Ref<DataItem>
  disabled: Ref<boolean>
  isStorage: Ref<boolean>
  type: Ref<String>
  feedBackOptions: Ref<Array<any>>
  updetaValue: (value: DataItem) => void
  customerConfigList:Ref<Array<any>>
}

export const warehouseIssueCompleteOptions: Array<any> = [
  { label: '已完成', value: 1 },
  { label: '未完成', value: 0 }
]
