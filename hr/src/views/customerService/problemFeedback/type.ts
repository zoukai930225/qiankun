export interface Request {
  /**
   * 实际完成日期
   */
  actualCompleteDate?: string
  /**
   * 品类:字典cs_problem_feedback_category
   */
  category?: string
  /**
   * 问题情况说明
   */
  description?: string
  /**
   * 问题对接负责人
   */
  directorId?: string
  directorName?: string
  /**
   * 预计完成日期
   */
  estimatedCompleteDate?: string
  /**
   * 反馈日期
   */
  feedbackDate?: string
  feedbackDateEnd?: string
  feedbackDateStart?: string
  /**
   * 反馈人
   */
  feedbackPersonId?: string
  feedbackPersonName?: string
  /**
   * 是否按时完成:字典cs_problem_feedback_finish_status
   */
  finishStatus?: number
  /**
   * 问题处理部门:字典cs_problem_feedback_handle_dept
   */
  handleDept?: string
  /**
   * id
   */
  id?: string
  /**
   * 图片
   */
  image?: string
  /**
   * 最新进展
   */
  latestProgress?: string
  /**
   * 页数
   */
  page?: number
  /**
   * 每页大小
   */
  size?: number
  /**
   * 状态:字典cs_problem_feedback_status
   */
  status?: string
  /**
   * 问题反馈类型:字典cs_problem_feedback_type
   */
  type?: string
  [property: string]: any
}
