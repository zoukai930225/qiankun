declare namespace StorageType {
  /**
   * 获取日报总览列表
   */
  interface GetReportListQuery {
    /**
     * 开始时间
     */
    beginDate?: string
    /**
     * 截止时间
     */
    endDate?: string
    /**
     * 开始
     */
    page: number
    /**
     * 分页大小
     */
    size: number
  }

  /**
   * 日报总览列表
   */
  interface ReportListItem {
    /**
     * 实际作业
     */
    actualWork: number
    /**
     * 创建时间
     */
    createdAt: string
    /**
     * 日报id
     */
    id: string
    /**
     * 操作人
     */
    operationName: string
    /**
     * 填报日期
     */
    reportDate: string
    /**
     * 最后修改时间
     */
    updatedAt: string
    /**
     * 工作时长
     */
    workHours: number
  }

  /**
   * 获取每日日报明细的参数
   */
  interface GetDailyReportDetailParams {
    id?: string
  }

  /**
   * 每日日报明细
   */
  interface DailyReportDetail {
    reportDate?: string
    data: DailyReportDetailItem[]
  }

  interface DailyReportDetailItem {
    type: string
    typeName: string
    data: DailyReportDetailItemRow[]
  }

  type DailyReportDetailItemRow = Partial<{
    id: string
    company: string
    isDeleted: boolean
    createdAt: string
    createdId: string
    updatedAt: string
    updatedId: string
    companyName: string
    workHours: number
    actualWork: number
    workEfficiency: number
    empId: string
    empName: '合计'
    type: string
    dailyReportId: string
    reportDate: string
    store: string
  }> & { isAdd?: boolean; isEdit?: boolean }

  /**
   * 新增日报参数
   */
  interface AddReportParams {
    /**
     * id
     */
    id?: string
    /**
     * 填报日期，格式 2024-03-07 00:00:00
     */
    reportDate: string
  }

  /**
   * 新增日报明细参数
   */
  interface AddReportDetailParams {
    /**
     * 实际作业
     */
    actualWork: number
    /**
     * 日报ID
     */
    dailyReportId: string
    /**
     * 员工id
     */
    empId: string
    /**
     * 员工名称
     */
    empName: string
    /**
     * 明细ID
     */
    id: string
    /**
     * 员工类型
     */
    type: string
    /**
     * 工作效率
     */
    workEfficiency: number
    /**
     * 工作时长
     */
    workHours: number
  }

  /**
   * 新增日报明细响应值
   */
  interface ReportDetail {
    /**
     * 实际作业
     */
    actualWork?: number
    /**
     * 公司
     */
    company?: string
    /**
     * 企业名称
     */
    companyName?: string
    /**
     * 创建时间
     */
    createdAt?: string
    /**
     * 创建人
     */
    createdId?: string
    /**
     * 每日报表id
     */
    dailyReportId?: string
    /**
     * 员工id
     */
    empId?: string
    /**
     * 姓名
     */
    empName?: string
    /**
     * 明细ID
     */
    id?: string
    /**
     * 是否删除;1-是0-否
     */
    isDeleted?: number
    /**
     * 填报日期
     */
    reportDate?: string
    /**
     * 店铺
     */
    store?: string
    /**
     * 类型
     */
    type?: string
    /**
     * 更新时间
     */
    updatedAt?: string
    /**
     * 更新人
     */
    updatedId?: string
    /**
     * 工作效率
     */
    workEfficiency?: number
    /**
     * 工作时长
     */
    workHours?: number
  }

  /**
   * 根据类型ID查人员列表的参数
   */
  interface GetPersonListParams {
    /**
     * 每日日报ID
     */
    dailyReportId: string
    /**
     * 类型
     */
    type: string
    /**
     * 人员姓名
     */
    empName: string
  }

  /**
   * 人员列表
   */
  interface PersonListItem {
    /**
     * 员工编号
     */
    empId?: string
    /**
     * 姓名
     */
    fullName?: string
  }

  /**
   * 根据日期间隔获取明细列表的参数
   */
  interface GetDailyDetailListParams {
    beginDate: string
    endDate: string
  }
}
