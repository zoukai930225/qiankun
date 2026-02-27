declare namespace StorageSalary {
  module Statement {
    interface GetListParams {
      /**
       * 实际出勤
       */
      actAttendance?: string
      /**
       * 平均时薪
       */
      averageHourSalary?: string
      /**
       * 数据月份
       */
      dataMonth?: string
      /**
       * 部门id
       */
      departmentId?: string
      /**
       * 部门名称
       */
      departmentName?: string
      /**
       * id
       */
      id?: string
      /**
       * 页数
       */
      page?: number
      /**
       * 每页大小
       */
      size?: number
      /**
       * 总计产量
       */
      totalQuantity?: number
      /**
       * 合计薪资
       */
      totalSalary?: string
      /**
       * 用户id
       */
      userId?: string
      /**
       * 用户名称
       */
      userName?: string
    }

    interface ListItem {
      /**
       * 实际出勤
       */
      actAttendance?: number
      /**
       * 平均时薪
       */
      averageHourSalary?: number
      /**
       * 数据月份
       */
      dataMonth?: string
      /**
       * 部门id
       */
      departmentId?: string
      /**
       * 部门名称
       */
      departmentName?: string
      /**
       * id
       */
      id?: string
      /**
       * 总计产量
       */
      totalQuantity?: number
      /**
       * 合计薪资
       */
      totalSalary?: number
      /**
       * 用户id
       */
      userId?: string
      /**
       * 用户名称
       */
      userName?: string
    }
  }

  module Examien {
    interface GetListParams {
      /**
       * 日期
       */
      dataDate?: string
      /**
       * 页数
       */
      page?: number
      /**
       * 班次类型;0：白班，1：夜班
       */
      shiftType?: number | 'ALL'
      /**
       * 每页大小
       */
      size?: number
      /**
       * 用户名称
       */
      userName?: string
      /**
       * 工种编码
       */
      rolesMask?: string
    }

    interface ListItem {
      /**
       * 实际出勤
       */
      actAttendance?: number
      /**
       * 平均时薪
       */
      averageHourSalary?: number
      /**
       * 本组数据
       */
      currentRolesMask?: CurrentRolesMasks
      /**
       * 当日薪资
       */
      dailySalary?: number
      /**
       * 日期
       */
      dataDate?: string
      /**
       * id
       */
      id?: string
      /**
       * 跨组数据
       */
      otherRolesMasks?: CurrentRolesMasks[]
      /**
       * 班次类型;0：白班，1：夜班
       */
      shiftType?: number | string
      /**
       * 用户名称
       */
      userName?: string
      [key: string]: any
    }

    interface CurrentRolesMasks {
      /**
       * 薪资核算方式;字典accounting_method
       */
      accountingMethod?: string
      /**
       * 明细
       */
      detailVos?: DetailVos[]
      /**
       * 时长
       */
      duration?: number
      /**
       * id
       */
      id?: string
      /**
       * 验货薪资表id
       */
      inspectionSalaryId?: string
      /**
       * 件数
       */
      quantity?: number
      /**
       * 工种（编码）;字典roles_mask
       */
      rolesMask?: string
      /**
       * 工种名称
       */
      rolesMaskName?: string
      [key: string]: any
    }

    interface DetailVos {
      /**
       * 分类id
       */
      classificationId?: string
      /**
       * 分类名称
       */
      classificationName?: string
      /**
       * 跨工计价
       */
      crossWorkPricing?: number
      /**
       * 白班计价
       */
      dayPricing?: number
      /**
       * id
       */
      id?: string
      /**
       * 验货薪资表id
       */
      inspectionSalaryId?: string
      /**
       * 夜班计价
       */
      nightPricing?: number
      /**
       * 货品编码
       */
      productCode?: string
      /**
       * 货品名称
       */
      productName?: string
      /**
       * 件数
       */
      quantity?: number
      /**
       * 工种（编码）;字典roles_mask
       */
      rolesMask?: string
      /**
       * 规格码
       */
      specCode?: string
      /**
       * 规格名称
       */
      specName?: string
      /**
       * 商家编码
       */
      specNo?: string
      /** 是否是拦截件 */
      interceptFlag?: 0 | 1
      [key: string]: any
    }

    interface Detail {
      /**
       * 本组数据
       */
      currentRolesMask?: CurrentRolesMasks
      /**
       * 日期
       */
      dataDate?: string
      /**
       * id
       */
      id?: string
      /**
       * 跨组数据
       */
      otherRolesMasks?: CurrentRolesMasks[]
      /**
       * 班次类型;字典shift_type
       */
      shiftType?: string
      /**
       * 用户名称
       */
      userName?: string
      /**用户id */
      userId?: string
    }

    interface UpdateParams {
      /**
       * 薪资核算方式;字典accounting_method
       */
      accountingMethod?: string
      /**
       * 时长
       */
      duration?: number
      /**
       * 工种（编码）
       */
      rolesMask?: string
      /**
       * 薪资表id
       */
      salaryId?: string
      /** 新增明细 */
      addSalaryDetailVos?: AddSalaryDetailVos[]
      /** 更新明细 */
      updateSalaryDetailVos?: AddSalaryDetailVos[]
      /** 删除明细 */
      deleteSalaryDetailVos?: AddSalaryDetailVos[]
      /** 班次 */
      shiftType?: string
    }

    interface AddSalaryDetailVos {
      /**
       * 分类id
       */
      classificationId?: string
      /**
       * 件数
       */
      quantity?: number
      /**
       * 工种（编码）;字典roles_mask
       */
      rolesMask?: string
      /**
       * 薪资表id
       */
      salaryId?: string
    }

    interface GetInfoDetailParams {
      /**
       * 分类id
       */
      classificationId?: string
      /**
       * 查询关键字
       */
      keyword?: string
      /**关键字类型 */
      keywordType?: number
      /**
       * 页数
       */
      page?: number
      /**
       * 工种（编码）;字典roles_mask
       */
      rolesMask?: string
      /**
       * 薪资表id
       */
      salaryId?: string
      /**
       * 每页大小
       */
      size?: number
      type?: number
    }

    interface InforDetailItem {
      /**
       * 分类id
       */
      classificationId?: string
      /**
       * 分类名称
       */
      classificationName?: string
      /**
       * 跨工计价
       */
      crossWorkPricing?: number
      /**
       * 白班计价
       */
      dayPricing?: number
      /**
       * id
       */
      id?: string
      /**
       * 夜班计价
       */
      nightPricing?: number
      /**
       * 货品编码
       */
      productCode?: string
      /**
       * 货品名称
       */
      productName?: string
      /**
       * 件数
       */
      quantity?: string
      /**
       * 工种（编码）;字典roles_mask
       */
      rolesMask?: string
      /**
       * 薪资表id
       */
      salaryId?: string
      /**
       * 商家编码
       */
      specNo?: string
    }
  }

  module Quality {
    interface BtnOption {
      value: number
      option: () => void
      label: string
    }
  }
}

declare type TableOption = {
  label?: string
  prop?: string
  slotName?: string
  width?: number | string
  minWidth?: number | string
  align?: 'center' | 'left' | 'right'
  fixed?: false | 'left' | 'right'
  type?: 'default' | 'selection' | 'index' | 'expand' | 'options'
  showOverFlowTooltip?: boolean | any
  transform?: (cellValue: any, row?: any, rowIndex?: number) => any
  tooltipFormatter?<T>(data: TableTooltipData<T>): VNode | string
  indexMethod?: (index: number) => any
  selectable?: (row: any, index?: number) => boolean
  required?: boolean
  isForm?: boolean
  rules?: (row, index, data?: any[]) => any
  formLabel?: (params: any) => string
  formLabelWidth?: number | string
  filterKey?: string
  // filters?: { text: string; value: string }[]
  // filterMethod?: (value: string, row: any, column?: TableColumnCtx<any>) => boolean
  formatter?: <T>(
    row?: any,
    column?: TableColumnCtx<T>,
    cellValue?: any,
    index?: number
  ) => VNode | string
  headertip?: string
  filterType?: 'string' | 'number'
}[]
