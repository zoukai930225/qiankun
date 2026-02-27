declare namespace Monitor {
  type TableOption = {
    label?: string
    prop?: string
    width?: number | string
    align?: 'center' | 'left' | 'right'
    fixed?: false | 'left' | 'right'
    type?: 'default' | 'selection' | 'index' | 'expand'
    transform?: (params: string | number) => any
  }[]

  module DeadStock {
    /** 品类 */
    type Category = 0 | 1 | 2 | 3 | 4 | 5 | 6
    /** 季节分类 */
    type SeasonCategory = 0 | 1 | 2 | 3
    /** 类别 */
    type Type = 0 | 1
    /** 滞销滞卖列表Item */
    interface ListItem {
      /**
       * 品类;0-季节品、1-男裤、2-内衣、3-女裤、4-配饰/女装、5-袜子、6-胸垫
       */
      category?: Category
      /**
       * 企业(字典code)
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
       * 日期
       */
      dataDate?: string
      id?: string
      /**
       * 库存
       */
      inventory?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 七天销量
       */
      salesSevenDays?: string
      /**
       * 季节分类;0-春夏、1-秋冬、2-四季品
       */
      seasonCategory?: SeasonCategory
      /**
       * 店铺
       */
      store?: string
      /**
       * 总货值
       */
      totalCargoValue?: string
      /**
       * 总货值-占比
       */
      totalCargoValuePercent?: string
      /**
       * 周转天数
       */
      turnaroundDays?: string
      /**
       * 类别;0-滞销、1-滞卖
       */
      type?: Type
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      /**
       * 昨日货值
       */
      yesterdayCargoValue?: string
      /**
       * 昨日货值-占比
       */
      yesterdayCargoValuePercent?: string
      /**
       * 昨日销量
       */
      yesterdaySales?: string
      [key: string]: any
    }

    /** 滞销滞卖统计 */
    interface Statistics {
      /**
       * 库存
       */
      inventory?: string
      /**
       * 库存-较昨日百分比
       */
      inventoryPercent?: string
      /**
       * 七天销量
       */
      salesSevenDays?: string
      /**
       * 七天销量-较昨日百分比
       */
      salesSevenDaysPercent?: string
      /**
       * 总货值
       */
      totalCargoValue?: string
      /**
       * 总货值-较昨日百分比
       */
      totalCargoValuePercent?: string
      /**
       * 周转天数
       */
      turnaroundDays?: string
      /**
       * 昨日货值
       */
      yesterdayCargoValue?: string
      /**
       * 昨日货值-较昨日百分比
       */
      yesterdayCargoValuePercent?: string
      /**
       * 昨日销量
       */
      yesterdaySales?: string
      /**
       * 昨日销量-较昨日百分比
       */
      yesterdaySalesPercent?: string
      beforeLastMonth?: number
    }

    /** 滞销滞卖图表 */
    type ChartsDataItem = Pick<
      ListItem,
      'category' | 'type' | 'totalCargoValue' | 'yesterdayCargoValue'
    > & {
      [key: string]: any
    }
  }
}
