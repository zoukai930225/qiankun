declare namespace StorageSystem {
  type TableOption = {
    label?: string
    prop?: string
    width?: number | string
    align?: 'center' | 'left' | 'right'
    fixed?: false | 'left' | 'right'
    type?: 'default' | 'selection' | 'index' | 'expand'
  }[]

  module PersonalManagement {
    /**
     * 获取人员管理表格内容的参数
     */
    interface GetListParams {
      /**
       * 员工编号/姓名
       */
      employee?: string
      /**
       * 当前页
       */
      page?: number
      /**
       * 当前页数
       */
      pageSize?: number
      /**
       * 薪酬结算方式（1：计件，2：计时）
       */
      salarySettlementType?: '1' | '2'
      /**
       * 员工状态(1:试用期，2：在职，3：离职)
       */
      status?: 1 | 2 | 3
    }

    /**
     * 人员管理表格
     */
    interface ListItem {
      /**
       * 部门名称
       */
      deptName?: string
      /**
       * 人员姓名
       */
      employeeName?: string
      /**
       * 员工编号
       */
      employeeNo?: string
      /**
       * 性别
       */
      gender?: 1 | 2 | 3
      /**
       * 手机号
       */
      mobile?: string
      /**
       * 工种（编码逗号分隔）
       */
      rolesMask?: string
      /**
       * 薪酬结算方式（1：计件，2：计时）
       */
      salarySettlementType?: 1 | 2
      /**
       * 员工状态(1:试用期，2：在职，3：离职)
       */
      status?: 1 | 2 | 3
      userId?: string
    }

    /**
     * 修改人员信息参数
     */
    interface UpdateInfoParams {
      /**
       * 工种（编码逗号分隔）
       */
      rolesMask?: string
      /**
       * 薪酬结算方式（1：计件，2：计时）
       */
      salarySettlementType?: 1 | 2
      /**
       * 员工状态(1:试用期，2：在职，3：离职)
       */
      status?: 1 | 2 | 3
      /**
       * 用户id
       */
      userId?: string
    }

    /**
     * 工种列表
     */
    interface RolesMaskItem {
      /**
       * 工种字典编码
       */
      code?: string
      /**
       * 工种名称
       */
      rolesMaskName?: string
    }
  }

  module GoodsClassfication {
    /** 获取分类列表参数 */
    interface GetListParams {
      /**
       * 分类名称
       */
      classificationName?: string
      /**
       * 当前页
       */
      page?: number
      /**
       * 当前页数
       */
      pageSize?: number
      /**
       * 工种（编码）
       */
      rolesMask?: string
    }

    /** 货品分类列表item */
    interface ListItem {
      /**
       * 分类名称
       */
      classificationName?: string
      /**
       * 跨工计价
       */
      crossWorkPricing?: string
      /**
       * 白班计价
       */
      dayPricing?: string
      /**
       * 货品分类唯一Id
       */
      id?: string
      /**
       * 夜班计价
       */
      nightPricing?: string
      /**
       * 工种（编码）
       */
      rolesMask?: string
      /**
       * 关联信息
       */
      specClassificationRelationVos?: SpecClassificationRelationVo[]
    }

    interface SpecClassificationRelationVo {
      /**
       * 分类id
       */
      classificationId?: string
      /**
       * 分类名称
       */
      classificationName?: string
      /**
       * 关联状态（0：未关联，1：已关联）
       */
      relationStatus?: 0 | 1
      /**
       * 规格码
       */
      specCode?: string
      /**
       * 单品唯一键
       */
      specId?: string
      /**
       * 规格名称
       */
      specName?: string
      /**
       * 商品编码
       */
      specNo?: string
      [key: string]: any
    }

    /** 分类列表 */
    type List = ListItem[]

    /** 保存分类及关联配置信息参数 */
    interface SaveParams {
      /**
       * 分类名称
       */
      classificationName?: string
      /**
       * 跨工计价
       */
      crossWorkPricing?: string
      /**
       * 白班计价
       */
      dayPricing?: string
      /**
       * 分类id（修改时必传，保存不串）
       */
      id?: string
      /**
       * 夜班计价
       */
      nightPricing?: string
      /**
       * 工种（编码）
       */
      rolesMask?: string
      /**
       * 关联商品id集合
       */
      specClassificationRelationDto?: SpecClassificationRelationDto[]
      /** 爆款计价 */
      hotSellPricing?: string
    }

    interface SpecClassificationRelationDto {
      specId?: string
    }

    /** 获取已关联的商品信息 */
    interface GetRelatedParams {
      /**
       * 分类id
       */
      id?: string
      /**
       * 商品编码
       */
      specNo?: string
    }

    /** 获取所有商品信息参数 */
    interface GetGoodsInfoParams {
      /**
       * 当前页
       */
      page?: number
      /**
       * 当前页数
       */
      pageSize?: number
      /**
       * 关联状态枚举（0：未关联，1：已关联）
       */
      relationStatus?: number
      /**
       * 商家编码
       */
      specNo?: string
      /**
       * 工种
       */
      rolesMask?: string
    }

    /** 当前工种下的货品分类列表 */
    interface CurrentClassificationListItem {
      code: string
      name: string
    }
  }
}
