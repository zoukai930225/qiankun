import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/**
 * 获取人员考勤列表
 */
export function getAttendanceList(params: StorageAttendance.GetListParams) {
  return request.get<GetRes<StorageAttendance.ListItem>>({
    url: '/api/attendance/pageQuery',
    params
  })
}

/**
 * 获取考勤详情
 */
export function getAttendanceDetail(params: StorageAttendance.GetUpdateDetailParams) {
  return request.get<StorageAttendance.AttendanceDetail>({
    url: '/api/attendance/detail',
    params
  })
}

/**
 * 获取变更明细
 */
export function getAttendanceUpdateDetail(params: StorageAttendance.GetUpdateDetailParams) {
  return request.get<GetRes<StorageAttendance.UpdateListItem>>({
    url: '/api/attendance/changeDetail',
    params
  })
}

/**
 * 获取人员考勤单日详情
 */
export function getAttendanceDailyDetail(params: StorageAttendance.GetDailyDetailParams) {
  return request.get<StorageAttendance.DailyDetail>({
    url: '/api/attendance/changeAttendanceDetail',
    params
  })
}

/**
 * 人员考勤变更
 */
export function updateAttendanceDetail(data: StorageAttendance.UpdateAttendanceParams) {
  return request.postOriginal({
    url: '/api/attendance/changeAttendance',
    data
  })
}

/**
 * 触发计算时段状态以及考勤状态
 */
export function triggerCalculationStatus(data: StorageAttendance.TriggerCalculationStatusParams) {
  return request.post<StorageAttendance.TriggerCalculationStatus>({
    url: '/api/attendance/triggerCalculationStatus',
    data
  })
}

/** 查看原始考勤记录 */
export function getOriginalRecord(params: { userId: string; date: string }) {
  return request.get<
    {
      attendanceDate: string
      attendanceTime: string
      attendanceLocation: string
    }[]
  >({
    url: '/api/attendance/original/attendance',
    params
  })
}

/**  */
export function getDeptTreeByKefan() {
  return request.get({ url: '/api/department/getDeptTreeByKefan', params: {} })
}

// ================== 班次设置 ================

/**
 * 获取班次设置列表
 */
export function getShiftList(params: StorageAttendance.GetShiftListParams) {
  return request.get<GetRes<StorageAttendance.ShiftList>>({
    url: '/api/attendance/shiftPeriod/pageQuery',
    params
  })
}

/**
 * 获取班次详情
 */
export function getShiftDetail(params: StorageAttendance.GetShiftDetailParams) {
  return request.get<StorageAttendance.ShiftDetail>({
    url: `/api/attendance/shiftPeriod/detail/${params.id}`
  })
}

/**
 * 提交班次信息
 */
export function postShiftDetail(data: StorageAttendance.UpdateShiftParams) {
  return request.postOriginal({
    url: `/api/attendance/shiftPeriod/saveOrUpdate`,
    data
  })
}

/**
 * 删除班次
 */
export function deleteShift(id: string) {
  return request.deleteOriginal({
    url: `/api/attendance/shiftPeriod/delete/${id}`
  })
}
