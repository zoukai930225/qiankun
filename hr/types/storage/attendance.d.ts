declare namespace StorageAttendance {
  /**
   * 获取考勤列表参数
   */
  interface GetListParams {
    /**
     * 考勤日期结束时间
     */
    attendanceDateEnd?: string
    /**
     * 考勤日期开始时间
     */
    attendanceDateStart?: string
    /**
     * 考勤状态(0/1)
     */
    attendanceStatus?: number
    /**
     * 部门Id
     */
    departmentId?: string
    /**
     * 当前页
     */
    page?: number
    /**
     * 当前页数
     */
    pageSize?: number
    /**
     * 用户姓名
     */
    userName?: string
  }

  /**
   * 考勤列表item
   */
  interface ListItem {
    /**
     * 日汇总集合
     */
    attendanceDaySummaryVos?: AttendanceDaySummaryVo[]
    /**
     * 考勤状态(正常/异常)
     */
    attendanceStatusName?: '正常' | '异常'
    /**
     * 部门Id
     */
    departmentId?: string
    /**
     * 部门名称
     */
    departmentName?: string
    /**
     * 用户id
     */
    userId?: string
    /**
     * 人员姓名
     */
    userName?: string
  }
  /**
   * 日汇总集合
   */
  interface AttendanceDaySummaryVo {
    /**
     * 考勤日期
     */
    attendanceDate?: string
    /**
     * 考勤状态(正常/异常)
     */
    attendanceStatus?: '正常' | '异常'
    /**
     * 考勤日汇总表Id
     */
    attendanceSummaryId?: string
    /**
     * 打卡记录
     */
    checkInRecordVos?: CheckInRecordVo2[]
    /**
     * 备注
     */
    remark?: string
    /**
     * 班次类型（0：白班，1：夜班）
     */
    shiftType?: '夜班' | '白班'
    /**
     *
     */
    leaveType?: string
    changed: 0 | 1
  }

  /**
   * 考勤状态（0：迟到，1：早退，2：缺卡，3：请假，4：休假，5：正常）
   */
  type AttendanceStatus = 0 | 1 | 2 | 3 | 4 | 5
  type AttendanceType = '0' | '1' | '2' | '3' | '4' | '5'
  interface CheckInRecordVo1 {
    attendanceStatus?: AttendanceStatus
    /**
     * 下班时间
     */
    checkTimeEnd?: string
    /**
     * 上班时间
     */
    checkTimeStart?: string
    /**
     *
     */
    isCheckRecordChange?: boolean
    /**
     *
     */
    isAttendanceStatusChange?: boolean
  }
  interface CheckInRecordVo2 extends CheckInRecordVo1 {
    attendanceStatus: AttendanceType
  }

  /**
   * 获取详情列表参数 & 获取变更明细参数
   */
  interface GetUpdateDetailParams {
    /**
     * 变更人姓名
     */
    changeUserName?: string
    /**
     * 变更开始时间
     */
    changeDateStart?: string
    /**
     * 变更结束时间
     */
    changeDateEnd?: string
    /**
     * 考勤结束时间
     */
    attendanceDateEnd?: string
    /**
     * 考勤结束时间
     */
    attendanceDateStart?: string
    /**
     * 当前页
     */
    page?: number
    /**
     * 当前页数
     */
    pageSize?: number
    /**
     * 用户Id
     */
    userId?: string
  }

  /**
   * 考勤详情
   */
  interface AttendanceDetail {
    basicInfo: BaseInfo
    page: {
      records: AttendanceDetailItem[]
      total: number
    }
  }

  /**
   * 基础信息
   */
  interface BaseInfo {
    /**
     * 部门名称
     */
    departmentName?: string
    /**
     * 早退次数
     */
    earlyCount?: string
    /**
     * 职位名称
     */
    jobName?: string
    /**
     * 迟到次数
     */
    lateCount?: string
    /**
     * 缺卡次数
     */
    missingCardsCount?: string
    /**
     * 用户名称
     */
    userName?: string
  }

  /**
   * 详情列表项
   */
  interface AttendanceDetailItem {
    /**
     * 考勤日期
     */
    attendanceDate?: string
    /**
     * 考勤状态(正常/异常)
     */
    attendanceStatus?: '正常' | '异常'
    /**
     * 考勤日汇总表Id
     */
    attendanceSummaryId?: string
    /**
     * 打卡记录
     */
    checkInRecordVos?: CheckInRecordVo2[]
    /**
     * 备注
     */
    remark?: string
    /**
     * 班次类型（0：白班，1：夜班）
     */
    shiftType?: '白班' | '夜班'
  }

  /**
   * 变更明细列表
   */
  interface UpdateListItem {
    /**
     * 变更内容
     */
    changeContent?: string
    /**
     * 变更日期
     */
    changeDate?: string
    /**
     * 变更人姓名
     */
    changeUserName?: string
  }

  /**
   * 获取人员考勤单日详情参数
   */
  interface GetDailyDetailParams {
    /**
     * 用户id
     */
    userId: string
    /**
     * 考勤日期
     */
    date: string
  }

  /**
   * 人员考勤单日详情
   */
  interface DailyDetail {
    /**
     * 考勤日期
     */
    attendanceDate?: string
    /**
     * 考勤状态(正常/异常)
     */
    attendanceStatus?: 0 | 1
    /**
     * 打卡记录
     */
    checkInRecordVos?: CheckInRecordVo1[]
    /**
     * 备注
     */
    remark?: string
    /**
     * 班次类型（0：白班，1：夜班）
     */
    shiftType?: 0 | 1
    /**
     *
     */
    isAttendanceStatusChange?: boolean
    /**
     *
     */
    isShiftTypeChange?: boolean
  }

  /**
   * 人员考勤变更参数
   */
  interface UpdateAttendanceParams {
    /**
     * 考勤日期
     */
    attendanceDate?: string
    /**
     * 考勤状态(0：正常，1：异常)
     */
    attendanceStatus?: 0 | 1
    /**
     * 打卡记录
     */
    checkInRecordVos?: CheckInRecordDto[]
    /**
     * 班次类型是否存在变更
     */
    isShiftTypeChange?: boolean
    /**
     * 备注
     */
    remark?: string
    /**
     * 班次类型（0：白班，1：夜班）
     */
    shiftType?: number
    /**
     * 用户Id
     */
    userId?: string
    isAttendanceStatusChange?: boolean
  }

  interface CheckInRecordDto {
    /**
     * 考勤状态（0：迟到，1：早退，2：缺卡，3：请假，4：休假，5：正常）
     */
    attendanceStatus?: AttendanceStatus
    /**
     * 下班时间
     */
    checkTimeEnd?: string
    /**
     * 上班时间
     */
    checkTimeStart?: string
    /**
     * 考勤状态是否存在变更
     */
    isAttendanceStatusChange?: boolean
    /**
     * 打卡记录是否存在变更
     */
    isCheckRecordChange?: boolean
    /**
     * 记录序号
     */
    recordNumber?: number
  }

  /**
   * 触发计算状态打卡记录参数
   */
  interface TriggerCalculationStatusParams {
    /**
     * 考勤日期
     */
    attendanceDate?: string
    /**
     * 打卡记录
     */
    checkInRecords?: TriggerCheckInRecordDto[]
    /**
     * 班次类型（0：白班，1夜班）
     */
    shiftType?: 0 | 1
  }

  /**
   * 触发计算状态打卡记录Dto
   */
  interface TriggerCheckInRecordDto {
    /**
     * 下班时间
     */
    checkTimeEnd?: string
    /**
     * 上班时间
     */
    checkTimeStart?: string
    /**
     * 记录序号
     */
    recordNumber?: number
  }

  /**
   * 触发计算状态打卡记录
   */
  interface TriggerCalculationStatus {
    /**
     * 考勤状态
     */
    attendanceStatus?: 0 | 1
    /**
     * 时段状态
     */
    triggerRecordVos?: TriggerRecordVo[]
  }

  interface TriggerRecordVo {
    /**
     * 时段状态
     */
    attendanceStatus?: 0 | 1 | 2 | 3 | 4 | 5
    /**
     * 时段序号
     */
    recordNumber?: number
  }

  //================================================ 班次设置 =========================================================

  /**
   * 获取班次列表参数
   */
  interface GetShiftListParams {
    /**
     * 关键词
     */
    keyWord?: string
    /**
     * 当前页
     */
    page?: number
    /**
     * 当前页数
     */
    pageSize?: number
  }

  /**
   * 班次列表
   */
  interface ShiftList {
    /**
     * 创建人
     */
    createdName?: string
    /**
     * 班次唯一Id
     */
    id?: string
    /**
     * 班次名称
     */
    shiftName?: string
    /**
     * 考勤时间
     */
    shiftTimes?: ShiftTimeVo[]
    /**
     * 最后更新时间
     */
    updatedAt?: string
  }

  /**
   * 考勤时间
   */
  interface ShiftTimeVo {
    /**
     * 下班时间
     */
    workEndTime?: string
    /**
     * 下班时间偏移量（0：当日，1：次日）
     */
    workEndTimeOffset?: 0 | 1
    /**
     * 上班时间
     */
    workStartTime?: string
    /**
     * 上班时间偏移量（0：当日，1：次日）
     */
    workStartTimeOffset?: 0 | 1
  }

  /**
   * 查看班次详情参数
   */
  interface GetShiftDetailParams {
    /**
     * 班次id
     */
    id: string
  }

  /**
   * 班次详情
   */
  interface ShiftDetail {
    /**
     * 班次id
     */
    shiftId?: string
    /**
     * 班次类型
     */
    shiftType?: 0 | 1
    /**
     * 班次名称
     */
    shiftName?: string
    /**
     * 班次规则配置
     */
    shiftRuleVos: ShiftRuleVo[]
    /**
     * 工作小时数
     */
    workHours?: number
    /**
     * 工作分钟数
     */
    workMinutes?: number
  }

  /**
   * 班次规则配置
   */
  interface ShiftRuleVo {
    /**
     * 缺卡阈值
     */
    absentCheckIn?: number
    /**
     * 缺卡阈值
     */
    absentCheckOut?: number
    /**
     * 早退阈值
     */
    earlyLeaveThreshold?: number
    /**
     * 班次规则唯一id
     */
    id?: string
    /**
     * 迟到阈值
     */
    lateThreshold?: number
    /**
     * 最大提前打卡（分钟）
     */
    maxEarlyCheckIn?: number
    /**
     * 最大延后打卡
     */
    maxLateCheckOut?: number
    /**
     * 规则名称
     */
    ruleName?: string
    /**
     * 规则序号
     */
    ruleNumber?: number
    /**
     * 班次名称
     */
    shiftName?: string
    /**
     * 下班时间
     */
    workEndTime?: string
    /**
     * 下班时间偏移量（0：当日，1：次日）
     */
    workEndTimeOffset?: 0 | 1
    /**
     * 上班时间
     */
    workStartTime?: string
    /**
     * 上班时间偏移量（0：当日，1：次日）
     */
    workStartTimeOffset?: 0 | 1
  }

  /**
   * 新增 & 修改班次参数
   */
  interface UpdateShiftParams {
    /**
     * 班次唯一id
     */
    id?: string
    /**
     * 班次名称
     */
    shiftName?: string
    /**
     * 班次规则配置
     */
    shiftRuleVos: ShiftRuleVo[]
    /**
     * 工作小时数
     */
    workHours?: number
    /**
     * 工作分钟数
     */
    workMinutes?: number
  }
}
