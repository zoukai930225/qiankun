declare namespace Supplier {
  interface Person {
    /**
     * 转正申请
     */
    application?: string
    /**
     * 转正状态
     */
    applicationStatus?: string
    /**
     * 飞书头像
     */
    avatarOrigin?: string
    /**
     * 银行卡号
     */
    bankAccountNumber?: string
    /**
     * 开户行
     */
    bankName?: string
    /**
     * 出生日期
     */
    birthday?: string
    /**
     * 取消入职备注
     */
    cancelOnboardingNotes?: string
    /**
     * 取消入职原因
     */
    cancelOnboardingReason?: string
    /**
     * 城市
     */
    city?: string
    /**
     * 企业
     */
    company?: string
    /**
     * 合同公司ID
     */
    contractCompanyId?: string
    /**
     * 合同公司
     */
    contractCompanyName?: string
    /**
     * 合同到期日期
     */
    contractExpirationDate?: string
    /**
     * 劳动合同签订次数
     */
    contractSignTimes?: string
    /**
     * 合同开始日期
     */
    contractStartDate?: string
    /**
     * 合同类型
     */
    contractType?: string
    /**
     * 转正日期
     */
    conversionDate?: string
    /**
     * 国家
     */
    county?: string
    /**
     * 创建时间
     */
    createdAt?: string
    /**
     * 创建人ID
     */
    createdId?: string
    /**
     * 飞书-数据创建时间
     */
    createTime?: string
    /**
     * 飞书的部门ID
     */
    departmentId?: string
    /**
     * 部门名称
     */
    departmentName?: string
    /**
     * 离职备注
     */
    departureNotes?: string
    /**
     * 离职原因
     */
    departureReason?: string
    /**
     * 离职类型
     */
    departureType?: string
    /**
     * 飞书备注
     */
    description?: string
    /**
     * 学历集合
     */
    educations?: string
    /**
     * 邮箱
     */
    email?: string
    /**
     * 紧急联系人集合
     */
    emergencyContacts?: string
    /**
     * 入职登记表状态
     */
    employeeFormStatus?: string
    /**
     * 工号
     */
    employeeNo?: string
    /**
     * 人员类型
     */
    employeeType?: string
    /**
     * 英文名
     */
    enName?: string
    /**
     * 参加工作日期
     */
    enteredWorkforceDate?: string
    /**
     * 民族
     */
    ethnicity?: string
    /**
     * 家庭地址
     */
    familyAddress?: string
    fixedAssetsNumbers?: number
    /**
     * 前工作经历-公司
     */
    formerWorkExpCompany?: string
    /**
     * 前工作经历-部门
     */
    formerWorkExpDepartment?: string
    /**
     * 前工作经历-工作描述
     */
    formerWorkExpDescription?: string
    /**
     * 前工作经历-截止日期
     */
    formerWorkExpEnd?: string
    /**
     * 前工作经历-职位
     */
    formerWorkExpJob?: string
    /**
     * 前工作经历-开始日期
     */
    formerWorkExpStart?: string
    /**
     * 性别
     */
    gender?: string
    /**
     * 最高学历学位
     */
    highestLevelOfEduDegree?: string
    /**
     * 最高学历结束日期
     */
    highestLevelOfEduEnd?: string
    /**
     * 最高学历
     */
    highestLevelOfEduLevel?: string
    /**
     * 最高学历专业
     */
    highestLevelOfEduMajor?: string
    /**
     * 最高学历毕业学校
     */
    highestLevelOfEduSchool?: string
    /**
     * 最高学历开始日期
     */
    highestLevelOfEduStart?: string
    /**
     * 入职日期
     */
    hireDate?: string
    /**
     * 户口所在地
     */
    hukouLocation?: string
    /**
     * 户口类型
     */
    hukouType?: string
    /**
     * 证件号
     */
    idNumber?: string
    /**
     * 证件类型
     */
    idType?: string
    /**
     * 是否删除，1-是，0-否
     */
    isDeleted?: number
    /**
     * 职位ID
     */
    jobId?: string
    /**
     * 职级ID
     */
    jobLevelId?: string
    /**
     * 职级名称
     */
    jobLevelName?: string
    /**
     * 职位名称
     */
    jobName?: string
    /**
     * 离职日期
     */
    lastDay?: string
    /**
     * 上级英文名
     */
    managerEnName?: string
    /**
     * 上级中文名
     */
    managerName?: string
    /**
     * 上级用户ID
     */
    managerUserId?: string
    /**
     * 婚姻状况
     */
    maritalStatus?: string
    /**
     * 手机号码
     */
    mobile?: string
    /**
     * 中文名
     */
    name?: string
    /**
     * 籍贯ISO编码
     */
    nativeRegionIsoCode?: string
    /**
     * 籍贯名称
     */
    nativeRegionName?: string
    /**
     * 昵称
     */
    nickName?: string
    /**
     * 个人邮箱
     */
    personalEmail?: string
    /**
     * 政治面貌
     */
    politicalStatus?: string
    /**
     * 主要紧急联系人手机号码
     */
    primaryEmergencyContactMobile?: string
    /**
     * 主要紧急联系人姓名
     */
    primaryEmergencyContactName?: string
    /**
     * 与主要紧急联系人的关系
     */
    primaryEmergencyContactRelationship?: string
    /**
     * 试用期（月）
     */
    probationMonths?: string
    /**
     * 公积金账号
     */
    providentFundAccount?: string
    /**
     * 实际用户id
     */
    realUserId?: string
    /**
     * 社保账号
     */
    socialSecurityAccount?: string
    /**
     * 员工状态
     */
    status?: string
    /**
     * 唯一ID
     */
    unionId?: string
    /**
     * 更新时间
     */
    updatedAt?: string
    /**
     * 更新人ID
     */
    updatedId?: string
    /**
     * 飞书-数据更新时间
     */
    updateTime?: string
    /**
     * 员工ID
     */
    userId?: string
    /**
     * 工作经验集合
     */
    workExps?: string
    /**
     * 工作地点ID
     */
    workLocationId?: string
    /**
     * 工作地点名称
     */
    workLocationName?: string
    /**
     * 工位
     */
    workStation?: string
    [property: string]: any
  }
  module Purchase {
    interface GetListParams {
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
       * 创建人姓名
       */
      createUser?: string
      /**
       * 已完成数量
       */
      finishGoodsQuantityTotal?: number
      /**
       * 货品数
       */
      goodsNumTotal?: number
      /**
       * 补单货品量
       */
      goodsQuantityTotal?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 最晚清单时间
       */
      latestTime?: string
      /**
       * 当前页码
       */
      page: number
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 需求备注
       */
      remarks?: string
      /**
       * 需求单名称
       */
      scPurchaseRequestOrderName?: string
      /**
       * 需求单编号
       */
      scPurchaseRequestOrderNo?: string
      /**
       * 每页大小
       */
      size: number
      /**
       * 商家编码 明细 需求单查询使用
       */
      skuQuery?: string
      /**
       * 状态;0-编辑中1-未开始2-生产中3-已清单4-手动结单
       */
      status?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      // [property: string]: any
      /**商家编码 */
      sku?: string
      /** 跟单人id */
      orderHandleId?: string
      /** 供应商 */
      supplierQuery?: string
      /**采购生产单编号 */
      scPurchaseOrderNo?: string

      queryType?: 0 | 1
      [key: string]: any
    }

    interface ExportRequest {
      /**
       * 货品编码查询
       */
      goodsNo?: string
      /**
       * idList
       */
      idList?: string[]
      /**
       * 采购需求单名称
       */
      scPurchaseRequestOrderName?: string
      /**
       * 采购需求单no
       */
      scPurchaseRequestOrderNo?: string
      /**
       * sku查询
       */
      skuQuery?: string
      /**
       * 需求单状态 逗号拼接
       */
      status?: string
      /**
       * 需求单状态列表 后端使用
       */
      statusList?: string[]
      [property: string]: any
    }

    type ListItem = Partial<GetListParams>
    interface ScGoodsInfoVO {
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 货品编码
       */
      goodsNo?: string
      /**
       * 迭代码
       */
      iterateCode?: string
      /**
       * 迭代款
       */
      iterateStyle?: string
      /**
       * 商家编码
       */
      sku?: string
      /**
       * 规格码
       */
      specCode?: string
      /**
       * 规格名称
       */
      specName?: string
      sourceBusinessId?: string
      [key: string]: any
    }

    interface FormItem {
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
       * 首单时间
       */
      firstOrderTime?: string
      /**
       * 规格码
       */
      formCode?: string
      /**
       * 规格名称
       */
      formName?: string
      /**
       * 货品编码
       */
      goodsCode?: string
      /**
       * 已发货数量
       */
      goodsDeliveryQuantity?: number
      /**
       * 已入库数量
       */
      goodsInboundQuantity?: number
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 已下单数量
       */
      goodsPlaceQuantity?: number
      /**
       * 补单量
       */
      goodsQuantity?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 迭代码
       */
      iterateCode?: string
      /**
       * 迭代款
       */
      iterateStyle?: string
      /**
       * 跟单人员;关联sys_person_roster的user_id,会有多个
       */
      orderHandlerId?: string
      /**
       * 需求清单时间
       */
      orderItemTime?: string
      /**
       * 实际首单时间
       */
      firstOrderTime?: string
      /**
       * 实际清单时间
       */
      firstOrderTime?: string
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 需求单id
       */
      scPurchaseRequestOrderId?: string
      /**
       * 需求单ids
       */
      scPurchaseRequestOrderIdList?: string[]
      /**
       * 商家编码
       */
      sku?: string
      /**
       * 供应商
       */
      supplier?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
    }

    interface FormData {
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
       * 创建人姓名
       */
      createUser?: Person
      /**
       * 已完成数量
       */
      finishGoodsQuantityTotal?: number
      /**
       * 货品数
       */
      goodsNumTotal?: number
      /**
       * 补单货品量
       */
      goodsQuantityTotal?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 最晚清单时间
       */
      latestTime?: string
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 需求备注
       */
      remarks?: string
      /**
       * 需求单明细
       */
      scpurchaseRequestOrderDetailList?: FormItem[]
      /**
       * 需求单名称
       */
      scPurchaseRequestOrderName?: string
      /**
       * 需求单编号
       */
      scPurchaseRequestOrderNo?: string
      /**
       * 商家编码 明细 需求单查询使用
       */
      skuQuery?: string
      status?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
    }

    /**
     * 筛选条件
     *
     * PurchaseRequestPoolPageQuery
     */
    interface PurchaseRequestPoolPageQuery {
      /**
       * 货品编码
       */
      goodsNoQuery?: string
      /**
       * 当前页码
       */
      pageNum?: number
      /**
       * 需求单号
       */
      requestNo?: string
      /**
       * 需求来源
       */
      requestSource?: string
      /**
       * 需求来源列表 后端使用
       */
      requestSourceList?: string[]
      /**
       * 每页大小
       */
      size?: number
      /**
       * sku
       */
      skuQuery?: string
      /**
       * 状态,逗号拼接
       */
      status?: string
      /**
       * 状态列表 后端使用
       */
      statusList?: string[]
      [property: string]: any
    }

    /**
     * 采购需求池;
     *
     * ScPurchaseRequestPool
     */
    interface ScPurchaseRequestPool {
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
       * 申请人对象
       */
      createdUser?: PersonRoster
      detailList?: ScPurchaseRequestPoolDetail[]
      /**
       * 附件保存地址
       */
      fileUrl?: string
      /**
       * 货品编码
       */
      goodsNos?: string[]
      /**
       * 货品数
       */
      goodsNumTotal?: number
      /**
       * 补单货品量
       */
      goodsQuantityTotal?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 期望到货时间
       */
      latestTime?: string
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 备注
       */
      remarks?: string
      /**
       * 需求单单号
       */
      requestNos?: string[]
      /**
       * 需求来源  字典项 sc_pr_request_source
       */
      requestSource?: string
      /**
       * 售卖渠道 字典项 channel
       */
      salesChannel?: string
      /**
       * 来源业务id
       */
      sourceBusinessId?: string
      /**
       * 状态;0-待排产 10-已分配
       */
      status?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
    }

    /**
     * ScPrApprovalPageQuery
     */
    interface ScPrApprovalPageQuery {
      /**
       * 审核状态: 0-待审核, 1-已审核 2-全部
       */
      auditStatus?: string
      /**
       * 当前用户 后端使用
       */
      currentUserId?: string
      /**
       * 货品编码(精确)
       */
      goodsNo?: string
      /**
       * 当前页码
       */
      pageNum?: number
      /**
       * 需求来源（例如：销售订单、库存补货等）
       */
      requestSource?: string
      /**
       * 需求来源列表 后端使用
       */
      requestSourceList?: string[]
      /**
       * 需求单编号（支持模糊查询）
       */
      scPurchaseRequestOrderNo?: string
      /**
       * 每页显示数量
       */
      size?: number
      /**
       * SKU编码（模糊查询）
       */
      skuQuery?: string
      /**
       * 状态,逗号拼接
       */
      status?: string
      /**
       * 状态列表 后端使用
       */
      statusList?: string[]
      [property: string]: any
    }

    /**
     * 采购需求单审批列表返回对象
     *
     * ScPrApprovalVO
     */
    interface ScPrApprovalVO {
      /**
       * 审核状态：待审核 / 已审核
       */
      auditStatusDesc?: string
      /**
       * 申请人id
       */
      createdId?: string
      /**
       * 创建时间
       */
      createTime?: string
      /**
       * 申请人
       */
      creator?: PersonRoster
      /**
       * 货品编码
       */
      goodsNos?: string[]
      /**
       * 货品数量
       */
      goodsNumTotal?: number
      /**
       * 补单量
       */
      goodsQuantityTotal?: number
      id?: string
      /**
       * 最晚清单时间
       */
      latestListTime?: string
      /**
       * 待审核权限
       */
      pendingReviewerAll?: string
      /**
       * 需求来源
       */
      requestSource?: string
      /**
       * 审核人
       */
      reviewer?: PersonRoster[]
      /**
       * 历史审核人id
       */
      reviewerHis?: string
      /**
       * 需求名称
       */
      scPurchaseRequestOrderName?: string
      /**
       * 需求编码
       */
      scPurchaseRequestOrderNo?: string
      /**
       * 状态
       */
      status?: string
      [property: string]: any
    }
  }

  module Appoint {
    /**
     * 订单状态
     * 0-未提交 10-待审核 20-审核通过 30-已打印装箱单 40-审核不通过
     */
    type AuditStatus = '0' | '10' | '20' | '30' | '40'
    interface GetPageParams {
      /** 采购生产订单编码 */
      scPurchaseOrderNo?: string
      /** 预约发货单编码 */
      advancedShippingRequestOrderNo?: string
      /** 订单状态 */
      auditStatus?: string
      page: number
      size: number
      goodsNo?: string
      auditTimeStart?: string
      auditTimeEnd?: string
      supplierId?: string
    }

    interface PageItem {
      /**
       * 预约发货单编号
       */
      advancedShippingRequestOrderNo?: string
      /**
       * 预约日期
       */
      appointmentDate?: string
      /**
       * 备注
       */
      asrRemarks?: string
      /**
       * 审核人
       */
      auditPersonId?: string
      /**
       * 审核状态;0-未提交、10-待审核、20-审核通过、30-已打印装箱单、40-审核不通过
       */
      auditStatus?: string
      /**
       * 审核时间
       */
      auditTime?: string
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
       * 创建人
       */
      createUser?: PersonRoster
      /**
       * 发货数量
       */
      deliveryGoodsQuantityTotal?: number
      /**
       * 预计到货时间
       */
      estimatedArrivalTime?: string
      /**
       * 货品数
       */
      goodsNumTotal?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 采购量
       */
      purchasedGoodsQuantityTotal?: number
      /**
       * 收货仓库;关联仓库信息表
       */
      receivingWarehouse?: string
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 预约发货明细
       */
      scAdvancedShippingRequestOrderDetailList?: ScAdvancedShippingRequestOrderDetail[]
      /**
       * 采购生产单id
       */
      scPurchaseOrderId?: string
      /**
       * 采购生产单编号
       */
      scPurchaseOrderNo?: string
      /**
       * 采购需求单id
       */
      scPurchaseRequestOrderId?: string
      /**
       * 下单时间
       */
      submitTime?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      /**
       * 旺店通单号
       */
      wdtPurchaseNo?: string
      [property: string]: any
    }

    /** 预约发货单明细 */
    interface ScAdvancedShippingRequestOrderDetail {
      /**
       * 预约发货单id
       */
      advancedShippingRequestOrderId?: string
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
       * 发货数量
       */
      deliveryGoodsQuantity?: number
      /**
       * 规格码
       */
      formCode?: string
      /**
       * 规格名称
       */
      formName?: string
      /**
       * 货品编码
       */
      goodsCode?: string
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 补单量
       */
      goodsQuantity?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 迭代码
       */
      iterateCode?: string
      /**
       * 迭代款
       */
      iterateStyle?: string
      /**
       * 期望到货时间
       */
      orderArrivalTime?: string
      /**
       * 采购数量
       */
      purchasedGoodsQuantity?: number
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 生产单明细id
       */
      scPurchaseOrderDetailId?: string
      /**
       * 需求单明细id
       */
      scPurchaseRequestOrderDetailId?: string
      /**
       * 商家编码
       */
      sku?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      /** 待发货 */
      remainingDeliveryQuantity: number
      [property: string]: any
    }

    /** 创建人信息 */
    interface PersonRoster {}

    interface UpdatePickingBox {
      /**
       * 预约发货单id
       */
      advancedShippingRequestOrderId?: string
      /**
       * 是否保存并打印: 0:否 1:是
       */
      printFlag?: number
      /**
       * 列表
       */
      scPackingListVos?: ScPackingListVo[]
      [property: string]: any
    }

    interface ScPackingListVo {
      /**
       * 预约发货单id
       */
      advancedShippingRequestOrderId?: string
      /**
       * 每箱数量
       */
      boxQuantity?: number
      /**
       * 结束箱号
       */
      endBoxNumber?: number
      /**
       * 规格码
       */
      formCode?: string
      /**
       * 规格名称
       */
      formName?: string
      /**
       * 货品编码
       */
      goodsCode?: string
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 生产单明细id
       */
      scPurchaseOrderDetailId?: string
      /**
       * 需求单明细id
       */
      scPurchaseRequestOrderDetailId?: string
      /**
       * 商家编码
       */
      sku?: string
      /**
       * 排序
       */
      sort?: number
      /**
       * 开始箱号
       */
      startBoxNumber?: number
      /**
       * 总数
       */
      totalQuantity?: number
      [property: string]: any
    }

    interface AddProductListParams {
      /**
       * 商品编码（内部商品编号）
       */
      goodsCode?: string
      pageNum?: number
      /**
       * 供应商商品编号
       */
      providerGoodsNo?: string
      size?: number
      /**
       * SKU 编码
       */
      sku?: string
      /**
       * 供应商id
       */
      supplierId?: string
      [property: string]: any
    }

    interface SupplierPoDetailSummaryDTO {
      /**
       * 裸货采购价
       */
      baseProdCost?: number
      /**
       * 成品采购价;finishGoodsCost
       */
      fgCost?: number
      /**
       * 合同首批日期
       */
      firstBatchTime?: string
      /**
       * 规格名称
       */
      formCode?: string
      /**
       * 规格码
       */
      formName?: string
      /**
       * 货品编码
       */
      goodsCode?: string
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 图片
       */
      imgUrl?: string
      /**
       * 迭代码
       */
      iterateCode?: string
      /**
       * 迭代款
       */
      iterateStyle?: string
      /**
       * 合同清单时间
       */
      orderArrivalTime?: string
      /**
       * 关联po单数量
       */
      poCount?: number
      /**
       * 生产单明细id，逗号拼接
       */
      poDetailIds?: string
      /**
       * 生产单明细id，逗号拼接
       */
      poIds?: string
      /**
       * 供应商货号
       */
      providerGoodsNo?: string
      /**
       * 采购数量
       */
      purchasedGoodsQuantity?: number
      /**
       * 待发量（剩余发货量）
       */
      remainingDeliveryQuantity?: number
      /**
       * 商家编码
       */
      sku?: string
      [property: string]: any
    }
  }

  module Product {
    interface GetPageParams {
      supplierId?: string
      /**采购生产订单编码 */
      scPurchaseOrderNo?: string
      /**货品编码 */
      goodsCode?: string
      /**订单状态 多选逗号拼接 */
      status?: string
      /** 供应商id */
      supplierId: string
      page: number
      size: number
      goodsNo?: string
      firstBatchStartTime?: string
      firstBatchEndTime?: string
      latestArrivalStartTime?: string
      latestArrivalEndTime?: string
      isAll?: boolean
      [key: string]: any
    }

    interface PageItem {
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
       * 创建人姓名
       */
      createUser?: PersonRoster
      /**
       * 已完成数量
       */
      finishGoodsQuantityTotal?: number
      /**
       * 货品数
       */
      goodsNumTotal?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 最晚交货时间
       */
      latestTime?: string
      /**
       * 采购量
       */
      purchasedGoodsQuantityTotal?: number
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 采购需求单备注
       */
      scPrRemarks?: string
      /**
       * 采购生产明细列表
       */
      scPurchaseOrderDetailList?: ScPurchaseOrderDetail[]
      /**
       * 采购生产单号
       */
      scPurchaseOrderNo?: string
      /**
       * 采购需求单id
       */
      scPurchaseRequestOrderId?: string
      /**
       * 采购需求单名称
       */
      scPurchaseRequestOrderName?: string
      /**
       * 采购需求单no
       */
      scPurchaseRequestOrderNo?: string
      /**
       * 商家编码 查询使用
       */
      skuQuery?: string
      /**
       * 状态;0未提交、1待排产、2已发货、3部分到货、4已清单、5手动结单
       */
      status?: string
      /**
       * 下单时间
       */
      submitTime?: string
      /**
       * 供应商 逗号拼接
       */
      supplier?: string
      /**
       * 供应商信息列表
       */
      supplierList?: ScPurchaseOrderSupplierRelation[]
      /**
       * 供应商 查询使用
       */
      supplierQuery?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
    }

    interface GetDetailParams {
      /** 供应商id */
      supplierId: string
      /** 生产订单id */
      id: string
    }

    interface DetailItem {
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
       * 创建人姓名
       */
      createUser?: PersonRoster
      /**
       * 已完成数量
       */
      finishGoodsQuantityTotal?: number
      /**
       * 货品数
       */
      goodsNumTotal?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 最晚交货时间
       */
      latestTime?: string
      /**
       * 采购量
       */
      purchasedGoodsQuantityTotal?: number
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 备注(生产单)
       */
      scPoRemarks?: string
      /**
       * 采购需求单备注
       */
      scPrRemarks?: string
      /**
       * 采购生产明细列表
       */
      scPurchaseOrderDetailList?: ScPurchaseOrderDetail[]
      /**
       * 采购生产单号
       */
      scPurchaseOrderNo?: string
      /**
       * 采购需求单id
       */
      scPurchaseRequestOrderId?: string
      /**
       * 采购需求单名称
       */
      scPurchaseRequestOrderName?: string
      /**
       * 采购需求单no
       */
      scPurchaseRequestOrderNo?: string
      /**
       * 商家编码 查询使用
       */
      skuQuery?: string
      /**
       * 状态;0未提交、1待排产、2已发货、3部分到货、4已清单、5手动结单
       */
      status?: string
      /**
       * 下单时间
       */
      submitTime?: string
      /**
       * 供应商 逗号拼接
       */
      supplier?: string
      /**
       * 供应商信息列表
       */
      supplierList?: ScPurchaseOrderSupplierRelation[]
      /**
       * 供应商 查询使用
       */
      supplierQuery?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
    }

    interface UpdateParams {
      /**
       * 预约发货单编号
       */
      advancedShippingRequestOrderNo?: string
      /**
       * 预约日期
       */
      appointmentDate?: string
      /**
       * 备注
       */
      asrRemarks?: string
      /**
       * 审核人
       */
      auditPersonId?: string
      /**
       * 审核状态;0-未提交、10-待审核、20-审核通过、30-已打印装箱单、40-审核不通过
       */
      auditStatus?: string
      /**
       * 审核时间
       */
      auditTime?: string
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
       * 创建人
       */
      createUser?: Appoint.PersonRoster
      /**
       * 发货数量
       */
      deliveryGoodsQuantityTotal?: number
      /**
       * 预计到货时间
       */
      estimatedArrivalTime?: string
      /**
       * 货品数
       */
      goodsNumTotal?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 采购量
       */
      purchasedGoodsQuantityTotal?: number
      /**
       * 收货仓库;关联仓库信息表
       */
      receivingWarehouse?: string
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 预约发货明细
       */
      scAdvancedShippingRequestOrderDetailList?: Supplier.Appoint.ScAdvancedShippingRequestOrderDetail[]
      /**
       * 采购生产单id
       */
      scPurchaseOrderId?: string
      /**
       * 采购生产单编号
       */
      scPurchaseOrderNo?: string
      /**
       * 采购需求单id
       */
      scPurchaseRequestOrderId?: string
      /**
       * 下单时间
       */
      submitTime?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      /**
       * 旺店通单号
       */
      wdtPurchaseNo?: string
      /** 跟单人 */
      orderHandlerId?: string
      /** 跟单人实体 */
      orderHandler?: {
        name: string
        userId: string
      }[]
      /** 仓库实体 */
      receivingWarehouseVo?: ReceivingWarehouseVo
      /** 是否有审核记录 */
      auditLogFlag?: number
      /**供应商ID */
      supplierId?: string
      /**预约发货方式 */
      appointmentType?: string
      [key: string]: any
    }

    interface ReceivingWarehouseVo {
      /**
       * 地址
       */
      address?: string
      /**
       * 联系电话
       */
      contactNumber?: string
      /**
       * 联系人
       */
      contacts?: string
      /**
       * 创建时间
       */
      createdAt?: string
      /**
       * 创建人
       */
      createdName?: string
      /**
       * ERP仓库
       */
      erpWarehouseCode?: string
      erpWarehouseCodes?: string[]
      /**
       * id
       */
      id?: string
      /**
       * 名称
       */
      name?: string
      /**
       * 收货能力
       */
      receivingCapability?: number
      /**
       * 备注
       */
      remark?: string
      /**
       * 状态;字典sc_warehouse_status
       */
      status?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedName?: string
      [property: string]: any
    }

    interface PrintInfo {
      /**
       * 预约发货单编号
       */
      advancedShippingRequestOrderNo?: string
      /**
       * 发货日期
       */
      deliveryDate?: string
      /**
       * 预计到货时间
       */
      estimatedArrivalTime?: string
      /**
       * 装箱单明细
       */
      packingList?: ScPackingList[]
      /**
       * 收货仓库实体
       */
      receivingWarehouseVo?: ScWarehouseVo
      /**
       * 供应商名称
       */
      supplierName?: string
      /**
       * 旺店通单号（采购单号）
       */
      wdtPurchaseNo?: string
      [property: string]: any
    }

    interface ScWarehouseVo {
      /**
       * 地址
       */
      address?: string
      /**
       * 联系电话
       */
      contactNumber?: string
      /**
       * 联系人
       */
      contacts?: string
      /**
       * 创建时间
       */
      createdAt?: string
      /**
       * 创建人
       */
      createdName?: string
      /**
       * ERP仓库
       */
      erpWarehouseCode?: string
      erpWarehouseCodes?: string[]
      /**
       * id
       */
      id?: string
      /**
       * 名称
       */
      name?: string
      /**
       * 收货能力
       */
      receivingCapability?: number
      /**
       * 备注
       */
      remark?: string
      /**
       * 状态;字典sc_warehouse_status
       */
      status?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedName?: string
      [property: string]: any
    }

    interface ScPackingList {
      /**
       * 预约发货单id
       */
      advancedShippingRequestOrderId?: string
      /**
       * 每箱数量
       */
      boxQuantity?: number
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
       * 结束箱号
       */
      endBoxNumber?: number
      /**
       * 规格码
       */
      formCode?: string
      /**
       * 规格名称
       */
      formName?: string
      /**
       * 货品编码
       */
      goodsCode?: string
      /**
       * 货品名称
       */
      goodsName?: string
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 商家编码
       */
      sku?: string
      /**
       * 排序
       */
      sort?: number
      /**
       * 开始箱号
       */
      startBoxNumber?: number
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
    }
  }

  module ChangeAudit {
    interface GetListParams {
      /**
       * 变更申请状态;10跟单审核中20计划审核中30审批成功40审批失败
       */
      changeStatus?: string
      /**
       * 货品编码
       */
      goodsNo?: string
      /**
       * 页数
       */
      page?: number
      /**
       * 生产单编号
       */
      scPurchaseOrderNo?: string
      /**
       * 采购需求单编号
       */
      scPurchaseRequestOrderNo?: string
      /**
       * 页大小
       */
      size?: number
      /**
       * 商家编码
       */
      sku?: string
      /**
       * 供应商
       */
      supplier?: string
      [property: string]: any
    }

    interface ListItem {
      /**
       * 申请人ID（对应字段：created_id）
       */
      applicant?: string
      /**
       * 变更后货品数（对应字段：change_goods_num_total）
       */
      changeGoodsNumTotal?: number
      /**
       * 变更后采购数量（对应字段：change_purchased_goods_quantity_total）
       */
      changePurchasedGoodsQuantityTotal?: number
      /**
       * 变更状态（对应字段：change_status）
       * 状态说明：
       * 10 - 跟单审核中
       * 20 - 计划审核中
       * 30 - 审批成功
       * 40 - 审批失败
       */
      changeStatus?: string
      /**
       * 创建时间（对应字段：created_at）
       */
      createdAt?: string
      /**
       * 一级审批人（对应字段：first_approve_person）
       */
      firstApprovePerson?: string
      /**
       * 一级审批时间（对应字段：first_approve_time）
       */
      firstApproveTime?: string
      /**
       * 原货品数（对应字段：goods_num_total）
       */
      goodsNumTotal?: number
      /**
       * 跟单人ID（对应字段：order_handler_id）
       */
      orderHandlerId?: string
      /**
       * 原采购数量（对应字段：purchased_goods_quantity_total）
       */
      purchasedGoodsQuantityotal?: number
      /**
       * 生产单编号（对应字段：sc_purchase_order_no）
       */
      scPurchaseOrderNo?: string
      /**
       * 采购需求单编号（对应字段：sc_purchase_request_order_no）
       */
      scPurchaseRequestOrderNo?: string
      /**
       * 二级审批人（对应字段：second_approve_person）
       */
      secondApprovePerson?: string
      /**
       * 二级审批时间（对应字段：second_approve_time）
       */
      secondApproveTime?: string
      /**
       * 供应商名称（对应字段：supplier_name）
       */
      supplierName?: string
      [property: string]: any
    }

    interface AuditParams {
      /**
       * 审批意见
       */
      auditComment?: string
      /**
       * 审批状态 1通过2拒绝
       */
      auditStatus?: string
      /**
       * 变更状态
       */
      changeStatus?: string
      /**
       * 采购订单变更申请ID
       */
      id?: string
      [property: string]: any
    }
  }

  module SupplierProduct {
    interface GetPageParams {
      /**
       * 分类编码
       */
      categoryCode?: string[]
      /**
       * 货品编码
       */
      goodsNo?: string
      /**
       * 是否下架 1是0否
       */
      outOfStock?: string
      /**
       * 页码
       */
      pageNum?: number
      /**
       * 页大小
       */
      pageSize?: number
      /**
       * 供应商ID集合
       */
      supplierIds?: string[]
      [property: string]: any
    }

    interface PageItem {
      /**
       * 平均采购价
       */
      avgPurchasePrice?: number
      /**
       * 类目
       */
      category?: string
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 货品编号
       */
      goodsNo?: string
      id?: string
      /**
       * 最后采购价格
       */
      lastPurchasePrice?: number
      /**
       * 最后采购时间
       */
      lastPurchaseTime?: string
      /**
       * 是否下架;1：是 0：否
       */
      outOfStock?: number
      /**
       * 供应商信息
       */
      supplierBasicInfoBO?: SupplierBasicInfoBO
      /**
       * 供应商货号
       */
      supplierGoodsNo?: string
      /**
       * 供应商id
       */
      supplierId?: string
      /**
       * 更新时间
       */
      updateAt?: string
      updateId?: string
      /**
       * 更新人名称
       */
      updateName?: string
      [property: string]: any
    }

    interface SupplierBasicInfoBO {
      supplierId?: string
      supplierName?: string
      [property: string]: any
    }

    interface ModifyTaxRateOrPriceParams {
      /**
       * 裸货价格
       */
      baseProdCost?: number
      /**
       * 成品采购价格
       */
      fgCost?: number
      /**
       * 供应商货品id集合
       */
      supplierGoodsIds?: string[]
      /**
       * 税率
       */
      taxRate?: number
      /**
       * 仓库包装成本
       */
      whPackCost?: number
      [property: string]: any
    }

    interface SaveOrUpdateSupplierGoodsParam {
      /**
       * 供应商货品明细
       */
      details?: SupplierGoodsDetailDTO[]
      /**
       * 货品id
       */
      goodsId?: string
      /**
       * 供应商货品id，新增为空，编辑不为空
       */
      supplierGoodsId?: string
      /**
       * 供应商货号
       */
      supplierGoodsNo?: string
      /**
       * 供应商id
       */
      supplierId?: string
      [property: string]: any
    }

    interface SupplierGoodsDetailDTO {
      /**
       * 裸货采购价
       */
      baseProdCost?: number
      /**
       * 折扣
       */
      discountRate?: number
      /**
       * 是否启用 1启用 0停用
       */
      enable?: number
      /**
       * 成品采购价
       */
      fgCost?: number
      /**
       * 最小采购数量
       */
      minPurchaseQty?: number
      /**
       * sku
       */
      sku?: string
      /**
       * 税率
       */
      taxRate?: number
      /**
       * 仓库包装成本
       */
      whPackCost?: number
      [property: string]: any
    }

    /**
     * 未绑定的供应商货品列表(新增时选择货品下拉框数据)
     */
    interface ScGoodsManagerVO {
      /**
       * 货品别名
       */
      alias?: string
      /**
       * 类目
       */
      category?: string
      /**
       * 类目展示名称
       */
      categoryDisplay?: string
      /**
       * erp货品分类
       */
      className?: string
      /**
       * 货品成分
       */
      composition?: string
      /**
       * 创建时间
       */
      createTime?: string
      /**
       * 货品执行标准
       */
      executionStandards?: string
      /**
       * 货品id
       */
      goodsId?: string
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 货品编码
       */
      goodsNo?: string
      /**
       * 迭代款
       */
      iterateStyle?: string
      /**
       * 商品等级
       */
      level?: string
      /**
       * 商品等级展示名称
       */
      levelDisplay?: string
      /**
       * 是否下架;
       */
      outOfStock?: number
      /**
       * 下架状态展示名称
       */
      outOfStockDisplay?: string
      /**
       * 生产周期
       */
      productionCycle?: string
      /**
       * 生产周期展示名称
       */
      productionCycleDisplay?: string
      /**
       * 季节
       */
      season?: string
      /**
       * 季节展示名称
       */
      seasonDisplay?: string
      /**
       * 安全技术类别
       */
      securityTechnologyCategory?: string
      /**
       * 性别
       */
      sex?: string
      /**
       * 性别展示名称
       */
      sexDisplay?: string
      /**
       * 供应商信息
       */
      suppliers?: ScGoodsSupplierBO[]
      /**
       * 供应商展示名称
       */
      suppliersDisplay?: string
      /**
       * 跟单人员展示名称,逗号隔开
       */
      userDisplay?: string
      /**
       * 跟单人员集合
       */
      users?: ScGoodsUserBO[]
      /**
       * 年份
       */
      year?: string
      [property: string]: any
    }

    /**
     * ScGoodsSupplierBO
     */
    interface ScGoodsSupplierBO {
      /**
       * 货品id
       */
      goodsId?: string
      /**
       * 供应商id
       */
      supplierId?: string
      /**
       * 供应商名称
       */
      supplierName?: string
      [property: string]: any
    }

    /**
     * com.secretWorld.common.basicData.entity.oa.PersonRoster
     *
     * ScGoodsUserBO
     */
    interface ScGoodsUserBO {
      avatarOrigin?: string
      goodsId?: string
      userId?: string
      userName?: string
      [property: string]: any
    }

    interface SkuInfoVO {
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 货品编码
       */
      goodsNo?: string
      /**
       * 商品图片
       */
      imgUrl?: string
      /**
       * sku
       */
      sku?: string
      /**
       * 规格编码
       */
      specCode?: string
      /**
       * 规格名称
       */
      specName?: string
      [property: string]: any
    }

    interface GetSkuPageParams {
      /**
       * 是否启用 1启用，0停用
       */
      enable?: number
      /**
       * 是否下架;1：是 0：否
       */
      outOfStock?: number
      /**
       * 页码
       */
      pageNum?: number
      /**
       * 页大小
       */
      pageSize?: number
      /**
       * sku编码
       */
      sku?: string
      /**
       * 供应商货品id
       */
      supplierGoodsId?: string
      [property: string]: any
    }

    interface SupplierGoodsDetailVO {
      /**
       * 评价采购价
       */
      avgPrice?: number
      /**
       * 裸货采购价
       */
      baseProdCost?: number
      /**
       * 折扣
       */
      discountRate?: number
      /**
       * 启用状态;1-启用，0-停用
       */
      enable?: number
      /**
       * 成品采购价
       */
      fgCost?: number
      /**
       * 货品名称
       */
      goodsName?: string
      id?: string
      /**
       * 图片
       */
      imgUrl?: string
      /**
       * 最后采购价
       */
      lastPurchasePrice?: number
      /**
       * 最新采购时间
       */
      latestPurchaseTime?: string
      /**
       * 最小采购量
       */
      minPurchaseQty?: number
      /**
       * 是否下架;1：是 0：否
       */
      outOfStock?: number
      /**
       * 是否下架
       */
      outOfStockDisplay?: string
      /**
       * sku编码
       */
      sku?: string
      /**
       * 规格编码
       */
      specCode?: string
      /**
       * 规格名称
       */
      specName?: string
      /**
       * 税率
       */
      taxRate?: number
      /**
       * 更新时间
       */
      updatedAt?: string
      /**
       * 更新人头像
       */
      updatedAvatarOrigin?: string
      /**
       * 更新人id
       */
      updatedId?: string
      /**
       * 更新人
       */
      updatedName?: string
      /**
       * 仓库包装成本
       */
      whPackCost?: number
      [property: string]: any
    }

    interface UpdateSkuDetail {
      /**
       * 裸货价格
       */
      baseProdCost?: number
      /**
       * 折扣
       */
      discountRate?: number
      /**
       * 成品采购价格
       */
      fgCost?: number
      /**
       * 最小采购数量
       */
      minPurchaseQty?: number
      /**
       * 供应商货品明细id
       */
      supplierGoodsDetailId?: string
      /**
       * 税率
       */
      taxRate?: number
      /**
       * 仓库包装成本
       */
      whPackCost?: number
      [property: string]: any
    }

    interface ModifySkuTaxRateOrPriceParam {
      /**
       * 裸货价格
       */
      baseProdCost?: number
      /**
       * 成品采购价格
       */
      fgCost?: number
      /**
       * 供应商货品明细id
       */
      supplierGoodsDetailIds?: string[]
      /**
       * 税率
       */
      taxRate?: number
      /**
       * 仓库包装成本
       */
      whPackCost?: number
      [property: string]: any
    }
  }

  module Assess {
    interface GetAssessParams {
      /**
       * 公司简称
       */
      abbreviationCompany?: string
      /**
       * 公司全称
       */
      fullCompany?: string
      /**
       * 页数
       */
      page?: number
      /**
       * 每页数量
       */
      size?: number
      /**
       * 供应商状态
       */
      supplierStatus?: string
      /**
       * 供应商类型
       */
      supplierType?: string
      [key: string]: any
    }

    interface AssessPage extends Omit<GetAssessParams, 'page' | 'size'> {
      [key: string]: any
    }

    interface AssessPageDetailRequest {
      supplierId?: string
      /**
       * 考核状态 1-进行中 2-已截止
       */
      assessmentStatus?: string
      /**
       * 考核类型;字典supplier_assessment_type
       */
      assessmentType?: string
      /**
       * 创建类型;0:单次创建   1.重复创建
       */
      createType?: number
      /**
       * 考核维度;字典supplier_assessment_ dimension
       */
      dimension?: string
      /**
       * 结束时间
       */
      endTime?: string
      /**
       * 页数
       */
      page?: number
      /**
       * 每页数量
       */
      size?: number
      /**
       * 开始时间
       */
      startTime?: string
      [property: string]: any
    }

    interface SupplierAssessmentQuizDto {
      /**
       * 公司简称
       */
      abbreviationCompany?: string
      /**
       * 公司全称
       */
      fullCompany?: string
      /**
       * 考核信息
       */
      quizVoLists?: PageSupplierAssessmentQuizVo
      /**
       * 供应商状态
       */
      supplierStatus?: string
      /**
       * 供应商类型
       */
      supplierType?: string
      [property: string]: any
    }

    /** 考核信息 */
    interface PageSupplierAssessmentQuizVo {
      records?: SupplierAssessmentQuizVo[]
      total?: number
    }

    interface SupplierAssessmentQuizVo {
      /**
       * 考核类型;字典supplier_assessment_type
       */
      assessmentType?: string
      /**
       * 考核状态   1:进行中  2:已截止
       */
      assessmentStatus?: string
      /**
       * 考核人数
       */
      assessmentUserNum?: number
      /**
       * 问卷创建类型;0:单次创建   1.重复创建
       */
      createType?: number
      /**
       * 考核维度;字典supplier_assessment_ dimension
       */
      dimension?: string
      /**
       * 问卷填写结束时间
       */
      endTime?: string
      /**
       * 考核等级;考核截止后计算的等级
       */
      grade?: string
      /**
       * id
       */
      id?: string
      /**
       * 考核期
       */
      period?: string
      /**
       * 问卷填写开始时间
       */
      startTime?: string
      /**
       * 供应商id
       */
      supplierId?: string
      /**
       * 最终总得分;考核截止后计算的总得分
       */
      totalScore?: number
      [property: string]: any
    }

    interface SupplierAssessmentUserDto {
      /**
       * 考核模块名称
       */
      assessmentModuleName?: string
      /**
       * 考核人对象
       */
      assessmentUser?: PersonRoster
      /**
       * 考核人部门
       */
      assessmentUserDepartment?: string
      /**
       * 考核人id
       */
      assessmentUserId?: string
      /**
       * 是否考核
       */
      isAssessment?: boolean
      /**
       * 供应商考核问卷id
       */
      quizId?: string
      /**
       * 供应商id
       */
      supplierId?: string
      /**评分时间 */
      createdAt?: string
      [property: string]: any
    }

    interface SupplierAssessmentQuizDetailDto {
      /**
       * 考核项名称
       */
      assessmentItemName?: string
      /**
       * 考核项排序
       */
      assessmentItemSort?: number
      /**
       * 考核模块名称
       */
      assessmentModuleName?: string
      /**
       * 考核模块排序
       */
      assessmentModuleSort?: number
      /**
       * 考核人对象
       */
      assessmentUser?: PersonRoster
      /**
       * 考核人id
       */
      assessmentUserId?: string
      /**
       * 备注
       */
      comment?: string
      /**
       * id
       */
      id?: string
      /**
       * 考核项满分
       */
      maxScore?: number
      /**
       * 供应商考核问卷id
       */
      quizId?: string
      /**
       * 考核项规则
       */
      rules?: string
      /**
       * 考核项得分
       */
      score?: number
      /**
       * 提交时间
       */
      submitTime?: string
      [property: string]: any
    }

    interface PersonRoster extends SupplierProduct.ScGoodsUserBO {}

    interface SupplierAssessmentQuizExtraScore {
      /**
       * 备注
       */
      comment?: string
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
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 名称
       */
      name?: string
      /**
       * 供应商考核问卷id
       */
      quizId?: string
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 评分规则
       */
      rule?: string
      /**
       * 分值
       */
      score?: number
      /**
       * 类型;1加分2减分
       */
      type?: number
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
      creator?: PersonRoster
    }

    interface SupplierScoreChangePageRequest {
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
       * 结束分数
       */
      endScore?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 名称
       */
      name?: string
      /**
       * 当前页码
       */
      page: number
      /**
       * 模糊查询条件
       */
      query?: string
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 规则
       */
      rule?: string
      /**
       * 每页大小
       */
      size: number
      /**
       * 开始分数
       */
      startScore?: number
      /**
       * 类型;1加分2减分
       */
      type?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
    }

    type SupplierScoreChangeRow = Omit<
      Supplier.Assess.SupplierScoreChangePageRequest,
      'page' | 'size'
    > & {
      id?: string
    }

    interface AssessDataPageRequest {
      /**
       * 公司简称
       */
      abbreviationCompany?: string
      /**
       * 考核维度
       */
      dimension?: string
      /**
       * 填写结束时间
       */
      endTime?: string
      /**
       * 公司全称
       */
      fullCompany?: string
      /**
       * 考核等级
       */
      grade?: string
      /**
       * 页数
       */
      page?: number
      /**
       * 考核期
       */
      period?: string
      /**
       * 每页数量
       */
      size?: number
      /**
       * 填写开始时间
       */
      startTime?: string
      /**
       * 供应商类型
       */
      supplierType?: string
      /**同步开始时间 */
      syncStartTime?: string
      /**同步结束时间 */
      syncEndTime?: string
      [property: string]: any
    }

    interface SupplierAssessmentDataDto {
      /**
       * 公司简称
       */
      abbreviationCompany?: string
      /**
       * 考核类型
       */
      assessmentType?: string
      /**
       * 公司名称
       */
      fullCompany?: string
      /**
       * 考核等级
       */
      grade?: string
      /**
       * 考核期
       */
      period?: string
      /**
       * 考核id
       */
      quizId?: string
      /**
       * 供应商id
       */
      supplierId?: string
      /**
       * 供应商状态
       */
      supplierStatus?: string
      /**
       * 供应商类型
       */
      supplierType?: string
      /**
       * 同步时间
       */
      syncTime?: string
      /**
       * 考核总分
       */
      totalScore?: number
      [property: string]: any
    }

    interface SupplierGrade {
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
       * 后续计划描述
       */
      followUpPlan?: string
      /**
       * 等级;A,B,C,D
       */
      grade?: string
      /**
       * 处理方案，逗号拼接，关联字典:supplier_grade_handling_scheme
       */
      handlingScheme?: string
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 模糊查询条件
       */
      query?: string
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 分数规则
       */
      scoreRule?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
    }

    interface GetSupplierGradePaginQueryRequest extends SupplierGrade {
      /**
       * 当前页码
       */
      page: number
      /**
       * 每页大小
       */
      size: number
    }

    interface GetAssessmentTypeListRequest {
      queryKey: string
      assessmentType: string
    }

    interface AssessmentTypeList {
      /**
       * 考核类型，关联字典表supplier_assessment_type
       */
      assessmentType?: string
      /**
       * 考核部门id 关联sys_department
       */
      departmentId?: string
      id?: string
      /**
       * 考核指标id
       */
      itemId?: string
      /**
       * 考核指标名称
       */
      itemName?: string
      /**
       * 考核指标排序
       */
      itemSort?: number
      /**
       * 考核管理人员id，逗号拼接
       */
      managerId?: string
      /**
       * 考核模块名称
       */
      name?: string
      /**
       * 考核规则
       */
      rules?: string
      /**
       * 分数
       */
      score?: number
      /**
       * 排序
       */
      sort?: number
      [property: string]: any
    }

    interface AddOrEditRequest {
      /**
       * 考核类型，关联字典表supplier_assessment_type
       */
      assessmentType?: string
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
       * 考核部门id 关联sys_department
       */
      departmentId?: string
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      items?: AssessmentTypeList[]
      /**
       * 考核管理人员id，逗号拼接
       */
      managerId?: string
      /**
       * 考核模块名称
       */
      name?: string
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 排序
       */
      sort?: number
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
    }
  }

  module Ledger {
    interface Request {
      /**
       * 实际入库金额筛选
       */
      actualInboundAmountQuery?: NumQuery
      /**
       * 实际入库数量筛选
       */
      actualInboundNumQuery?: NumQuery
      /**
       * 是否剔除结单未发数
       */
      excludeFinishOrder?: boolean
      /**
       * 货品编码
       */
      goodsNo?: string
      /**
       * 在途数量筛选条件
       */
      inboundNumQuery?: NumQuery
      /**
       * 页码
       */
      pageNum?: number
      /**
       * 每页数量
       */
      pageSize?: number
      /**
       * 采购数量搜索条件
       */
      purchaseNumQuery?: NumQuery
      /**
       * 采购结束时间
       */
      purchaseTimeEnd?: string
      /**
       * 采购开始时间
       */
      purchaseTimeStart?: string
      /**
       * 供应商id
       */
      supplierId?: string
      /**
       * 未发数量筛选条件
       */
      unDeliveryNumQuery?: NumQuery
      // [property: string]: any
    }

    interface SupplierOrderListVO {
      /**
       * 供应商采购列表
       */
      orderList?: SupplierOrderList
      /**
       * 汇总信息
       */
      totalInfo?: TotalInfo
      [property: string]: any
    }

    interface SupplierOrderList {
      /**
       * 实际入库金额
       */
      actualInboundAmount?: number
      /**
       * 实际入库数量
       */
      actualInboundNum?: number
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 货品编码
       */
      goodsNo?: string
      /**
       * 图片
       */
      imgUrl?: string
      /**
       * 在途数量
       */
      inboundNum?: number
      /**
       * 采购数量
       */
      purchaseNum?: number
      /**
       * sku编码
       */
      sku?: string
      /**
       * 规格编码
       */
      specCode?: string
      /**
       * 规格名称
       */
      specName?: string
      /**
       * 供应商id
       */
      supplierId?: string
      /**
       * 供应商名称
       */
      supplierName?: string
      /**
       * 未发数量
       */
      unDeliveryNum?: number
      [property: string]: any
    }

    interface TotalInfo {
      /**
       * 实际入库金额
       */
      totalActualInboundAmount?: number
      /**
       * 实际入库数量
       */
      totalActualInboundNum?: number
      /**
       * 在途数量
       */
      totalInboundNum?: number
      /**
       * 采购数量
       */
      totalPurchaseNum?: number
      /**
       * 未发数量
       */
      totalUnDeliveryNum?: number
      [property: string]: any
    }

    interface OrderHandlerListRequest {
      /**
       * 实际入库金额筛选
       */
      actualInboundAmountQuery?: NumQuery
      /**
       * 实际入库数量筛选
       */
      actualInboundNumQuery?: NumQuery
      /**
       * 入库裸货数量筛选条件
       */
      baseGoodsInboundNumQuery?: NumQuery
      /**
       * 是否剔除结单未发数
       */
      excludeFinishOrder?: boolean
      /**
       * 货品编码
       */
      goodsNo?: string
      goodsNos?: string[]
      /**
       * 入库成品数筛选
       */
      inboundFgGoodsNumQuery?: NumQuery
      /**
       * 在途数量筛选条件
       */
      inboundNumQuery?: NumQuery
      /**
       * 在厂数量筛选条件
       */
      inFactoryNumQuery?: NumQuery
      /**
       * 跟单员id
       */
      orderHandlerId?: string
      orderHandlerIds?: string[]
      /**
       * 页码
       */
      pageNum?: number
      /**
       * 每页数量
       */
      pageSize?: number
      /**
       * 计划完成率筛选
       */
      plannedCompletionRateQuery?: NumQuery
      /**
       * 计划数量筛选条件
       */
      plannedOrderNumQuery?: NumQuery
      /**
       * 采购完成率筛选
       */
      purchaseCompletionRateQuery?: NumQuery
      /**
       * 采购数量搜索条件
       */
      purchaseNumQuery?: NumQuery
      /**
       * 采购时间结束
       */
      purchaseTimeEnd?: string
      /**
       * 采购时间开始
       */
      purchaseTimeStart?: string
      /**
       * sku编码
       */
      sku?: string
      skus?: string[]
      /**
       * 未分配数量筛选条件
       */
      unAllocatedNumQuery?: NumQuery
    }

    interface NumQuery {
      /**
       * 范围筛选结束数量
       */
      rangeEnd?: number
      /**
       * 范围筛选开始数量
       */
      rangeStart?: number
      /**
       * 排序，1-正序，2-倒序
       */
      sort?: number
      [property: string]: any
    }

    interface OrderHandlerOrderList {
      /**
       * 实际入库金额筛选
       */
      actualInboundAmountTotal?: number
      /**
       * 实际入库数量筛选
       */
      actualInboundTotal?: number
      /**
       * 入库裸货数量汇总
       */
      baseGoodsInboundTotal?: number
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 货品编码
       */
      goodsNo?: string
      /**
       * 图片
       */
      imgUrl?: string
      /**
       * 入库成品数筛选
       */
      inboundFgGoodsTotal?: number
      /**
       * 在途数量汇总
       */
      inboundTotal?: number
      /**
       * 在厂数量汇总
       */
      inFactoryTotal?: number
      /**
       * 跟单员
       */
      orderHandler?: PersonRoster
      /**
       * 计划数量汇总
       */
      plannedOrderTotal?: number
      /**
       * 采购数量搜索条件
       */
      purchaseTotal?: number
      /**
       * sku编码
       */
      sku?: string
      /**
       * 规格编码
       */
      specCode?: string
      /**
       * 规格名称
       */
      specName?: string
      /**
       * 未分配数量汇总
       */
      unAllocatedTotal?: number
      [property: string]: any
    }

    interface ScPurchaseOrder {
      /**
       * 锁定前状态
       */
      beforeLockStatus?: string
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
       * 创建人姓名
       */
      createUser?: PersonRoster
      /**
       * 已完成数量
       */
      finishGoodsQuantityTotal?: number
      firstBatchTime?: string
      /**
       * 已发货数量
       */
      goodsDeliveryQuantityTotal?: number
      /**
       * 款号
       */
      goodsNos?: string[]
      /**
       * 货品数
       */
      goodsNumTotal?: number
      /**
       * 待发货数量
       */
      goodsUnDeliveryQuantityTotal?: number
      id?: string
      /**
       * 是否删除 1-是 0-否
       */
      isDeleted?: number
      /**
       * 最晚交货时间
       */
      latestArrivalTime?: string
      /**
       * 最晚交货时间
       */
      latestTime?: string
      /**
       * 清单时间
       */
      listTime?: string
      /**
       * 手动结单时间
       */
      manualCloseTime?: string
      /**
       * 操作标志 1保存 2保存并提交
       */
      operationFlag?: string
      /**
       * 跟单人实体
       */
      orderHandler?: PersonRoster
      /**
       * 跟单人
       */
      orderHandlerId?: string
      /**
       * 采购量
       */
      purchasedGoodsQuantityTotal?: number
      /**
       * 是否记录修改数据
       */
      recordChangeDataFlag?: boolean
      /**
       * 是否有撤回记录: 0-无, 1-有
       */
      revokeLogFlag?: number
      /**
       * 备注(生产单)
       */
      scPoRemarks?: string
      /**
       * 采购需求单备注
       */
      scPrRemarks?: string
      /**
       * 采购生产明细列表
       */
      scPurchaseOrderDetailList?: ScPurchaseOrderDetail[]
      /**
       * 采购生产单号
       */
      scPurchaseOrderNo?: string
      /**
       * 采购需求单id
       */
      scPurchaseRequestOrderId?: string
      /**
       * 采购需求单名称
       */
      scPurchaseRequestOrderName?: string
      /**
       * 采购需求单no
       */
      scPurchaseRequestOrderNo?: string
      /**
       * 商家编码 查询使用
       */
      skuQuery?: string
      /**
       * 状态;0未提交、10待排产、13已确认、20已发货、30部分到货、40已清单、50手动结单
       */
      status?: string
      /**
       * 提交时间
       */
      submitTime?: string
      /**
       * 供应商 逗号拼接
       */
      supplier?: string
      /**
       * 供应商款号
       */
      supplierGoodsNos?: string[]
      /**
       * 供应商信息列表
       */
      supplierList?: ScPurchaseOrderSupplierRelation[]
      /**
       * 供应商名称 逗号拼接
       */
      supplierName?: string
      /**
       * 供应商 查询使用
       */
      supplierQuery?: string
      /**
       * 修改时间
       */
      updatedAt?: string
      /**
       * 修改人
       */
      updatedId?: string
      [property: string]: any
    }
  }

  module PurchaseApplication {
    interface Request {
      /**
       * 货品编码
       */
      goodsCode?: string
      /**
       * 页码
       */
      page?: number
      /**
       * 申请人id
       */
      requesterId?: string
      /**
       * 数据量
       */
      size?: number
      /**
       * SKU编码（模糊搜索）
       */
      sku?: string
      /**
       * 状态
       */
      status?: string
      [property: string]: any
    }

    interface Record {
      /**
       * 申请时间
       */
      createdAt: string
      /**
       * 期望到货日期
       */
      expectedArrivalTime: string
      /**
       * 货品编码
       */
      goodsCode: string
      /**
       * 货品量
       */
      goodsQuantity: number
      /**
       * 待审核人
       */
      pendingReviewer: string
      /**
       * 申请人
       */
      requester: any
      /**
       * 申请量
       */
      requestQuantity: number
      /**
       * 状态
       */
      status: string
      [property: string]: any
    }
    interface AddRequest {
      /**
       * 调整说明
       */
      adjustmentReason?: string
      /**
       * 调整原因id
       */
      adjustmentType?: number
      /**
       * 明细
       */
      detail?: Detail[]
      /**
       * 附件地址
       */
      fileUrl?: string
      /**
       * 是否提交；0-否，1-是
       */
      isAutoSub?: number
      /**
       * 售卖渠道字典编码Code
       */
      salesChannelCode?: string
      [property: string]: any
    }
    interface Detail {
      estimatePrice?: number
      expectedArrivalTime?: string
      formCode?: string
      formName?: string
      goodsCode?: string
      goodsName?: string
      imgUrl?: string
      requestQuantity?: number
      sku?: string
      [property: string]: any
    }
  }

  module Contract {
    /** 分页列表参数 */
    interface GetPageReq {
      /**
       * 合同编号
       */
      contractNo?: string
      /**
       * 合同首批结束时间
       */
      firstBatchEndTime?: string
      /**
       * 合同首批开始时间
       */
      firstBatchStartTime?: string
      /**
       * 货品编码
       */
      goodsCodeQuery?: string
      /**
       * 合同清单结束时间
       */
      latestArrivalEndTime?: string
      /**
       * 合同清单开始时间
       */
      latestArrivalStartTime?: string
      /**
       * 跟单人id 后端使用
       */
      orderHandlerId?: string
      /**
       * 页数
       */
      page?: number
      /**
       * 采购生产订单编码
       */
      poNo?: string
      /**
       * 产前样时间结束
       */
      productBeforeEndDate?: string
      /**
       * 产前样时间开始
       */
      productBeforeStartDate?: string
      /**
       * 页大小
       */
      size?: number
      /**
       * 供应商id
       */
      supplierId?: string
      /**
       * 供应商id列表
       */
      supplierIdList?: string[]
      /** 合同状态 */
      status?: string
    }

    /** 分页返回数据 */
    interface ScPoContractPageVo {
      /**
       * 合同编号
       */
      contractNo?: string
      /**
       * 创建时间
       */
      createdAt?: string
      /**
       * 采购合同日期
       */
      date?: string
      /**
       * 签约错误原因
       */
      errMsg?: string
      /**
       * 合同首批日期
       */
      firstBatchTime?: string
      /**
       * 货品编码
       */
      goodsCodes?: string[]
      /**
       * id
       */
      id?: string
      /**
       * 合同清单日期
       */
      latestArrivalTime?: string
      /**
       * 跟单人对象
       */
      orderHandler?: Person
      /**
       * 跟单人
       */
      orderHandlerId?: string
      /**
       * 生产单id
       */
      poId?: string
      /**
       * 生产单单号
       */
      poNo?: string
      /**
       * 产前样时间
       */
      productBeforeDate?: string
      /**
       * 签约人
       */
      secondName?: string
      /**
       * 手机号
       */
      secondPhone?: string
      /**
       * 签约时间
       */
      signDate?: string
      /**
       * 状态;0草稿10待签约20签约成功30签约失败
       */
      status?: string
      /**
       * 供应商id
       */
      supplierId?: string
      /**
       * 供应商名称
       */
      supplierName?: string
      /**
       * 等待时间
       */
      waitDate?: string
      [property: string]: any
    }
  }

  module FullData {
    /**
     * Req
     */
    interface Request {
      /**
       * 类目列表
       */
      categories?: string[]
      /**
       * 统计日期 例如‘2025-01-01’
       */
      date?: string
      /**
       * 统计维度，goods:货品数据，category:货品品类数据，sku:sku数据
       */
      dimension?: string
      /**
       * 过滤条件
       */
      filters?: Filter[]
      /**
       * 货品列表
       */
      goodsNos?: string[]
      /**
       * 排序条件
       */
      orders?: Order[]
      /**
       * 页码
       */
      pageNum?: number
      /**
       * 页大小
       */
      pageSize?: number
      /**
       * sku列表
       */
      skus?: string[]
      [property: string]: any
    }

    /**
     * com.secretWorld.data.entity.supplier.statistic.FullDataModels.Filter
     *
     * Filter
     */
    interface Filter {
      /**
       * 过滤字段名
       */
      column?: string
      /**
       * 大于等于
       */
      ge?: number
      /**
       * 小于等于
       */
      le?: number
      [property: string]: any
    }

    /**
     * com.secretWorld.data.entity.supplier.statistic.FullDataModels.Order
     *
     * Order
     */
    interface Order {
      /**
       * 排序字段名
       */
      column?: string
      /**
       * 排序方式 asc升序，desc降序
       */
      order?: string
      [property: string]: any
    }

    interface FullDataVO {
      /**
       * 货品品类
       */
      category?: string
      /**
       * 货品品类编号
       */
      categoryCode?: string
      /**
       * 45天销量周转
       */
      fortyFiveTurnover?: number
      /**
       * 14天销量周转
       */
      fourteenTurnover?: number
      /**
       * 货品名称
       */
      goodsName?: string
      /**
       * 货品编号
       */
      goodsNo?: string
      /**
       * 图片
       */
      imgUrl?: string
      /**
       * 在厂
       */
      inFactory?: number
      /**
       * 在途
       */
      inTransit?: number
      /**
       * 在仓
       */
      inventory?: number
      /**
       * 45天销量
       */
      salesNumFortyFive?: number
      /**
       * 14日销量
       */
      salesNumFourteen?: number
      /**
       * 7天销量
       */
      salesNumSeven?: number
      /**
       * 60天销量
       */
      salesNumSixty?: number
      /**
       * 30日销量
       */
      salesNumThirty?: number
      /**
       * 昨日销量
       */
      salesNumYesterday?: number
      /**
       * 30天销量趋势
       */
      salesTrend30Days?: Sales[]
      /**
       * 7天销量周转
       */
      sevenTurnover?: number
      /**
       * 60天销量周转
       */
      sixtyTurnover?: number
      /**
       * sku编码
       */
      sku?: string
      /**
       * 规格码
       */
      specCode?: string
      /**
       * 规格名称
       */
      specName?: string
      /**
       * 30天销量周转
       */
      thirtyTurnover?: number
      /**
       * 合计
       */
      total?: Total
      /**
       * 总库存
       */
      totalInventory?: number
      /**
       * '待分配数量'
       */
      unScheduled?: number
      /**
       * 昨日销量周转
       */
      yesterdayTurnover?: number
      [property: string]: any
    }

    interface Sales {
      /**
       * 日期
       */
      date?: string
      /**
       * 销量
       */
      num?: number
      [property: string]: any
    }
  }
}
