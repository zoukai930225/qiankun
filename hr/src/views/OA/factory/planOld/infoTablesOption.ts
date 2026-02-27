export const infoTables = [
  // 基本信息表格
  {
    tableTitle: '基本信息',
    columns: 3,
    key: 'basicInfo',
    tableColumns: [
      {
        label: '供应商名称',
        key: 'supplierName',
        span: 1
      },
      {
        label: '货品编码',
        key: 'productCode',
        span: 1
      },
      {
        label: '系列',
        key: 'series',
        span: 1
      },
      {
        label: '品类',
        key: 'category',
        span: 1
      },
      {
        label: '版师',
        key: 'patternMakers',
        span: 1
      },
      {
        label: '设计师/买手',
        key: 'designers',
        span: 1
      },
      {
        label: '采购人员',
        key: 'purchaseUser',
        span: 1
      },
      {
        label: '二开审核',
        key: 'fsDevPlanExaminer',
        span: 1
      },
      {
        label: '下单人员',
        key: 'fsAssignedOrderPersonnel',
        span: 1
      },
      {
        label: '二开原因',
        key: 'secondaryDevReason',
        span: 3
      },
      
    ]
  },
  // 供应商信息
  {
    tableTitle: '供应商信息',
    columns: 3,
    key: 'supplierInfo',
    tableColumns: [
      // {
      //   label: '裸货价(不含税)(元)',
      //   key: 'productCostExcludingTax',
      //   span: 1
      // },
      {
        label: '裸货价(含税)(元)',
        key: 'productCostIncludingTax',
        span: 1
      },
      {
        label: '包装人工费(元)',
        key: 'packagingManpower',
        span: 1
      },
      {
        label: '成品价(元)',
        key: 'finishedProductCost',
        span: 1
      },
      {
        label: '总起订量',
        key: 'sumOrderQuantity',
        span: 1
      },
      {
        label: '生产周期',
        key: 'productionCycle',
        span: 1
      },
      {
        label: '包材费用(元)',
        key: 'packagingCost',
        span: 1
      },
      {
        label: '产品成本补充',
        key: 'productCostRemark',
        span: 3
      },
      {
        label: '备注',
        key: 'remark',
        span: 3
      },
      // {
      //   label: '报价单',
      //   key: 'attachmentUrl',
      //   span: 3,
      //   isFileUrl: true
      // },
    ]
  },
  {
    tableTitle: '打样进度',
    columns: 3,
    key: 'supplierInfo',
    tableColumns: [
      {
        label: '大货下单时间',
        key: 'bulkGoodsOrderTime',
        span: 1
      },
    ]
  },
  {
    tableTitle: '下单信息',
    columns: 3,
    key: 'orderInfo',
    mock: false,
    tableColumns: [
      {
        label: '大货下单时间',
        key: 'bulkGoodsOrderTime',
        span: 1
      },
    ]
  },
  // 采购信息
  {
    tableTitle: '采购信息',
    columns: 3,
    key: 'purchaseInfo',
    tableColumns: [
      {
        label: '大货下单时间',
        key: 'bulkGoodsOrderTime',
        span: 1
      },
      {
        label: '首批到仓时间',
        key: 'firstArrivedWarehouseTime',
        span: 1
      },
      {
        label: '产前样时间',
        key: 'prenatalSamplingTime',
        span: 1
      },
      {
        label: '预计清单到货时间',
        key: 'listEstimatedDeliveryTime',
        span: 3
      },
    ]
  }

]

export const documentList = [
  // {
  //   label:'供需单',
  //   key:'1'
  // },
  {
    label: '报价单',
    key: 'quotationSheetFile',
    formKey: 'supplierInfo',
  },
  {
    label: '销量预估',
    key: 'salesForecast',
    formKey: 'basicInfo',
  },
  {
    label: '附件',
    key: 'fileUrl',
    formKey: 'fileUrl',
  }
]