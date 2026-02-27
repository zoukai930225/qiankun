import { Layout } from '@/utils/routerHelper'

const { t } = useI18n()
/**
 * redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
 hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

 alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
 只有一个时，会将那个子路由当做根路由显示在侧边栏，
 若你想不管路由下面的 children 声明的个数都显示你的根路由，
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
 一直显示根路由(默认 false)

 title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

 icon: 'svg-name'          设置该路由的图标

 noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

 breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

 affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

 noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

 activeMenu: '/dashboard'  显示高亮的路由路径

 followAuth: '/dashboard'  跟随哪个路由进行权限过滤

 canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
 }
 **/

const bigScreenRouter = [
  {
    path: '/dataV',
    component: () => import('@/views/dataV/index.vue'),
    name: 'DataV',
    meta: {
      hidden: true,
      title: '数据可视化',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/index',
    component: () => import('@/views/dataV/bigScreen.vue'),
    name: 'BigScreen',
    meta: {
      hidden: true,
      title: '数据大屏',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/xhs',
    component: () => import('@/views/dataV/xhs.vue'),
    name: 'BigScreenXhs',
    meta: {
      hidden: true,
      title: '小红书数据大屏',
      noTagsView: true
    }
  },

  {
    path: '/bigScreen/teamPreview',
    component: () => import('@/views/dataV/teamPreview.vue'),
    name: 'BigScreenTeamPreview',
    meta: {
      hidden: true,
      title: '净利完成率排行',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/targetProfitRank',
    component: () => import('@/views/dataV/teamPreview.vue'),
    name: 'BigScreenTargetProfitRank',
    meta: {
      hidden: true,
      title: '目标净利润排行',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/saleRank',
    component: () => import('@/views/dataV/saleRank.vue'),
    name: 'BigScreenSaleRank',
    meta: {
      hidden: true,
      title: '销售排行',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/saleRankExport',
    component: () => import('@/views/dataV/saleRankExport.vue'),
    name: 'BigScreenSaleRankExport',
    meta: {
      hidden: true,
      title: '销售排行导出',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/newGoodsBoard',
    component: () => import('@/views/dataV/newGoods.vue'),
    name: 'BigScreenNewGoodsBoard',
    meta: {
      hidden: true,
      title: '新品商品指标看板',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/warehouseLargeScreen',
    component: () => import('@/views/dataV/warehouseLargeScreen.vue'),
    name: 'warehouseLargeScreen',
    meta: {
      hidden: true,
      title: '仓储大屏',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/warehouseOrderScreen',
    component: () => import('@/views/dataV/warehouseOrderScreen/index.vue'),
    name: 'WarehouseOrderScreen',
    meta: {
      hidden: true,
      title: '仓储订单大屏',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/BILargeScreen',
    component: () => import('@/views/dataV/BILargeScreen.vue'),
    name: 'BILargeScreen',
    meta: {
      hidden: true,
      title: 'BI数据大屏',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/countDown',
    component: () => import('@/views/dataV/countdown.vue'),
    name: 'CountDown',
    meta: {
      hidden: true,
      title: '十亿倒计时',
      noTagsView: true
    }
  },
  {
    path: '/bigScreen/newGoodProgressBoard',
    component: () => import('@/views/dataV/newGoodProgressBoard.vue'),
    name: 'OANewGoodProgressBoard',
    meta: {
      hidden: true,
      title: '新品进度看板',
      noTagsView: true
    }
  }
]

// 为微应用在主系统下的入口路径提供一个静态路由，
// 避免首次进入 /admin/hrAdmin/resources/dashboard 时路由未就绪导致的 No match 警告
const hrAdminMicroRouter: AppRouteRecordRaw[] = [
  {
    path: '/admin/hrAdmin',
    component: Layout,
    name: 'HrAdminRootStatic',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'resources/dashboard',
        component: () => import('@/views/hrAdmin/resources/dashboard.vue'),
        name: 'HrAdminResourcesDashboardStatic',
        meta: {
          hidden: true,
          noCache: true,
          noTagsView: true
        }
      }
    ]
  }
]
const otrRouter = () => {
  return [
    {
      path: '/otr',
      component: Layout,
      redirect: '/otr/index',
      name: 'OTRIndexParent',
      meta: {},
      children: [
        {
          path: '/otr/index',
          component: () => import('@/views/OTR/index.vue'),
          name: 'OTRIndex',
          meta: {
            title: t('router.home'),
            icon: 'ep:home-filled',
            noCache: false,
            affix: true
          }
        },
        {
          path: '/otr/questionnaireSet/index',
          component: () => import('@/views/OTR/questionnaireSet/index.vue'),
          name: 'QuestionnaireSetList',
          meta: {
            title: '问卷管理列表',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: 'activitySet',
            activeSubMenu: ''
          }
        },
        {
          path: '/otr/reviewInvitation/index',
          component: () => import('@/views/OTR/reviewInvitation/index.vue'),
          name: 'ReviewInvitaion',
          meta: {
            title: '评价邀请',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: 'activitySet',
            activeSubMenu: ''
          }
        },
        {
          path: '/otr/evaluationRelationship',
          component: () => import('@/views/OTR/evaluationRelationship/index.vue'),
          name: 'EvaluationRelationship',
          meta: {
            title: '评价关系',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: 'activitySet',
            activeSubMenu: ''
          }
        },
        {
          path: '/otr/bonusPoint/index',
          component: () => import('@/views/OTR/bonusPoint/index.vue'),
          name: 'BonusPoint',
          meta: {
            title: '加分项',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: 'activitySet',
            activeSubMenu: ''
          }
        },
        {
          path: '/otr/InventoryCalibration/index',
          component: () => import('@/views/OTR/InventoryCalibration/index.vue'),
          name: 'InventoryCalibration',
          meta: {
            title: '盘点校准',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: 'activitySet',
            activeSubMenu: ''
          }
        },
        {
          path: '/otr/inventoryResult/index',
          component: () => import('@/views/OTR/inventoryResult/index.vue'),
          name: 'InventoryResult',
          meta: {
            title: '盘点结果',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: 'activitySet',
            activeSubMenu: ''
          }
        }
      ]
    },
    {
      path: '/otr/pdf',
      component: () => import('@/views/OTR/pdf/index.vue'),
      name: 'OTRPdf',
      meta: {
        hidden: true,
        title: '人才盘点报告',
        noTagsView: true
      }
    },
    {
      path: '/otr/pdf/download',
      component: () => import('@/views/OTR/pdf/download.vue'),
      name: 'OTRPdfDownload',
      meta: {
        hidden: true,
        title: '人才盘点报告下载',
        noTagsView: true
      }
    }
  ]
}

const oaRouter = () => {
  return [
    {
      path: '/admin/oa/',
      component: Layout,
      name: 'oa',
      meta: {
        hidden: true
      },
      children: [
        {
          path: '/admin/oa/new/templete/node/:templeteId',
          component: () => import('@/views/OA/new/templete/node/index.vue'),
          name: 'TempleteNode',
          meta: {
            title: '节点数据',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/oa',
            activeSubMenu: '/admin/oa/new/templete/node'
          }
        },
        {
          path: '/admin/oa/new/plan/nodeDetail/:planId',
          component: () => import('@/views/OA/new/nodeDetail/plan.vue'),
          name: 'NodeDetail',
          meta: {
            title: '企划管理进度详情',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/oa',
            activeSubMenu: '/admin/PRD/new/plan'
          }
        },
        {
          path: '/admin/oa/package/plan/nodeDetail/:planId',
          component: () => import('@/views/OA/package/nodeDetail/plan.vue'),
          name: 'PackageNodeDetail',
          meta: {
            title: '企划管理进度详情（包装）',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/oa',
            activeSubMenu: '/admin/PRD/package/plan'
          }
        },
        {
          path: '/admin/oa/new/plan/devPlanDetail/:developPlanId',
          component: () => import('@/views/OA/new/nodeDetail/devPlan.vue'),
          name: 'DevPlanDetail',
          meta: {
            title: '开发任务进度详情',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/oa',
            activeSubMenu: '/admin/PRD/new/develop'
          }
        },
        {
          path: '/admin/oa/package/plan/devPlanDetail/:developPlanId',
          component: () => import('@/views/OA/package/nodeDetail/devPlan.vue'),
          name: 'DevPlanDetail',
          meta: {
            title: '开发任务进度详情(包装)',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/oa',
            activeSubMenu: '/admin/PRD/package/develop'
          }
        },
        {
          path: '/admin/oa/new/product/progress/:id',
          component: () => import('@/views/OA/new/product/progress.vue'),
          name: 'ProductProgress',
          meta: {
            title: '进度维护',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/oa',
            activeSubMenu: '/admin/PRD/new/product'
          }
        },
        {
          path: '/admin/oa/package/product/progress/:id',
          component: () => import('@/views/OA/package/product/progress.vue'),
          name: 'PackageProductProgress',
          meta: {
            title: '进度维护(包装)',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/oa',
            activeSubMenu: '/admin/PRD/package/product'
          }
        },
        {
          path: '/admin/PRD/factory/plan/progress/:id',
          component: () => import('@/views/OA/factory/plan/progress.vue'),
          name: 'FactoryProductProgress',
          meta: {
            title: '进度维护(工厂二开)',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/PRD',
            activeSubMenu: '/admin/PRD/factory/plan'
          }
        },
        {
          path: '/admin/oa/new/product/packageGallery/detail',
          component: () => import('@/views/OA/assetLibrary/packLibrary/components/packsDetail.vue'),
          name: 'PackageGallery',
          meta: {
            title: '包装库详情',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/oa',
            activeSubMenu: '/admin/PRD/package/product'
          }
        },
        {
          path: '/admin/oa/PRD/productLibrary/detail/:id',
          component: () => import('@/views/OA/productLibrary/detail.vue'),
          name: 'ProductLibrary',
          meta: {
            title: '产品库详情',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/oa',
            activeSubMenu: '/admin/PRD/productLibrary'
          }
        },
        {
          path: '/admin/offline/new/detail/:id',
          component: () => import('@/views/offline/offlineNew/page/detail.vue'),
          name: 'offlineNew',
          meta: {
            title: '资料信息',
            noCache: true,
            hidden: true,
            canTo: true,
            icon: '',
            activeMenu: '/admin/offline',
            activeSubMenu: '/admin/offline/new'
          }
        }
      ]
    }
  ]
}

const StorageRouter = () => [
  {
    path: '/admin/storage/',
    component: Layout,
    name: 'storage',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/admin/storage/attendance/attendanceList/detail/:id',
        component: () => import('@/views/storage/attendance/attendanceList/detail.vue'),
        name: 'attendanceDetail',
        meta: {
          title: '考勤详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/storage/attendance',
          activeSubMenu: '/admin/storage/attendance/attendanceList'
        }
      },
      {
        path: '/admin/storage/attendance/attendanceList/updateDetail/:id',
        component: () => import('@/views/storage/attendance/attendanceList/updateDetail.vue'),
        name: 'attendanceUpdateDetail',
        meta: {
          title: '考勤变更明细',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/storage/attendance',
          activeSubMenu: '/admin/storage/attendance/attendanceList'
        }
      }
    ]
  }
]

const supplierRouter = () => [
  {
    path: '/admin/SC/supplier/',
    component: Layout,
    name: 'purchase',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/admin/SC/supplier/purchase/add',
        component: () => import('@/views/supplier/purchase/add.vue'),
        name: 'PurchaseAdd',
        meta: {
          title: '采购需求-新增',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/purchase',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/purchase/edit/:id',
        component: () => import('@/views/supplier/purchase/edit.vue'),
        name: 'PurchaseEdit',
        meta: {
          title: '采购需求-编辑',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/purchase',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/purchase/audit/:id',
        component: () => import('@/views/supplier/purchase/audit.vue'),
        name: 'PurchaseAudit',
        meta: {
          title: '采购需求-审核',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/purchase',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/purchase/mergeProduct',
        component: () => import('@/views/supplier/purchase/mergeProduct.vue'),
        name: 'PurchaseMergeProduct',
        meta: {
          title: '采购需求-合并',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/purchase',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/product/add/',
        component: () => import('@/views/supplier/product/add.vue'),
        name: 'PurchaseProductOrderAdd',
        meta: {
          title: '采购生产订单-新增',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/product',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/product/edit/:id',
        component: () => import('@/views/supplier/product/edit.vue'),
        name: 'PurchaseProductOrderEdit',
        meta: {
          title: '采购生产订单-编辑',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/product',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/product/audit/:id',
        component: () => import('@/views/supplier/product/audit.vue'),
        name: 'PurchaseProductOrderAudit',
        meta: {
          title: '采购生产订单-审核',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/product',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/product/change/:id',
        component: () => import('@/views/supplier/product/change.vue'),
        name: 'PurchaseProductOrderChange',
        meta: {
          title: '采购生产订单-变更',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/product',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/product/contract/:id',
        component: () => import('@/views/supplier/product/contract.vue'),
        name: 'PurchaseContract',
        meta: {
          title: '采购合同',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/product',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/changeAudit/audit/:id',
        component: () => import('@/views/supplier/changeAudit/pages/audit.vue'),
        name: 'PurchaseProductOrderChangeAudit',
        meta: {
          title: '采购生产订单-变更审核',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/changeAudit',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/contract/check/:id',
        component: () => import('@/views/supplier/product/contract.vue'),
        name: 'SupplierContractCheck',
        meta: {
          title: '采购合同-查看',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/contract',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/contract/edit/:id',
        component: () => import('@/views/supplier/product/contract.vue'),
        name: 'SupplierContractEdit',
        meta: {
          title: '采购合同-编辑',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/contract',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/supplierProduct/add',
        component: () => import('@/views/supplier/supplierProduct/add.vue'),
        name: 'SupplierProductAdd',
        meta: {
          title: '供应商产品-新增',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/supplierProduct',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/supplierProduct/edit/:id',
        component: () => import('@/views/supplier/supplierProduct/edit.vue'),
        name: 'SupplierProductEdit',
        meta: {
          title: '供应商产品-编辑',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/supplierProduct',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/supplierProduct/:id',
        component: () => import('@/views/supplier/supplierProduct/sku.vue'),
        name: 'SupplierProductSku',
        meta: {
          title: '供应商产品-SKU明细',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/supplierProduct',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/appointment/add',
        component: () => import('@/views/supplier/appointment/add.vue'),
        name: 'PurchaseAppointmentOrderAdd',
        meta: {
          title: '预约发货-新增',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/appointment',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/appointment/edit/:id',
        component: () => import('@/views/supplier/appointment/edit.vue'),
        name: 'PurchaseAppointmentOrderEdit',
        meta: {
          title: '预约发货-编辑',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/appointment',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/appointment/check/:id',
        component: () => import('@/views/supplier/appointment/edit.vue'),
        name: 'PurchaseAppointmentOrderCheck',
        meta: {
          title: '预约发货-查看',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/appointment',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/productInfo/newPage',
        component: () => import('@/views/supplier/productInfo/newPage/newPage.vue'),
        name: 'productInfoNewPage',
        meta: {
          title: 'SKU明细',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/productInfo',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/appointment/audit',
        component: () => import('@/views/supplier/appointmentAudit/audit.vue'),
        name: 'PurchaseAppointmentOrderAudit',
        meta: {
          title: '预约发货-审核',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/appointmentAudit',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/storageReceiving/detail',
        component: () => import('@/views/supplier/storageReceiving/detail.vue'),
        name: 'StorageReceivingDetail',
        meta: {
          title: '仓库收货-查看',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/storageReceiving/index',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/supplierAssess/assess/detail',
        component: () => import('@/views/supplier/supplierAssess/assess/detail.vue'),
        name: 'SupplierAssessDetail',
        meta: {
          title: '供应商考核-查看',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/supplier/supplierAssess/assess',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/purchaseApplication/detail/:id',
        component: () => import('@/views/supplier/purchaseApplication/add.vue'),
        name: 'SupplierPurchaseApplicationDetail',
        meta: {
          title: '运营备货-查看',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/admin/supplier/purchaseApplication',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/purchaseApplication/audit/:id',
        component: () => import('@/views/supplier/purchaseApplication/audit.vue'),
        name: 'SupplierPurchaseApplicationAudit',
        meta: {
          title: '运营备货-审核',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/admin/supplier/purchaseApplication',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/purchaseApplication/progress/:sourceBusinessId',
        component: () => import('@/views/supplier/purchaseApplication/progress.vue'),
        name: 'SupplierPurchaseApplicationProgress',
        meta: {
          title: '运营备货-采购进度',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/admin/supplier/purchaseApplication',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/purchaseApplication/edit/:id',
        component: () => import('@/views/supplier/purchaseApplication/edit.vue'),
        name: 'SupplierPurchaseApplicationEdit',
        meta: {
          title: '运营备货-编辑',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/admin/supplier/purchaseApplication',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/purchaseApplication/add',
        component: () => import('@/views/supplier/purchaseApplication/add.vue'),
        name: 'SupplierPurchaseApplicationAdd',
        meta: {
          title: '运营备货-新增',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/admin/supplier/purchaseApplication',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/supplierAssess/assessData/detail',
        component: () => import('@/views/supplier/supplierAssess/assessData/detail.vue'),
        name: 'SupplierAssessDataDetail',
        meta: {
          title: '考核数据-查看',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/admin/supplier/assessData',
          keepAlive: true
        }
      },
      {
        path: '/admin/SC/supplier/supplierBlock',
        component: () => import('@/views/supplier/supplierBlock/index.vue'),
        name: 'SupplierBlock',
        meta: {
          title: '供应商拉黑记录',
          noCache: false,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/SC/supplier',
          activeSubMenu: '/admin/SC/admin/supplier/index',
          keepAlive: true
        }
      }
    ]
  }
]

const remainingRouter: AppRouteRecordRaw[] = [
  {
    path: '/thirdAuth/callback',
    component: () => import('@/views/callback/index.vue'),
    name: 'CallBack',
    meta: {
      hidden: true,
      title: '三方API授权回调',
      noTagsView: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'RedirectParent',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/admin/index',
    name: 'Home',
    meta: {},
    children: [
      {
        path: 'admin/index',
        component: () => import('@/views/Home/page.vue'),
        name: 'HomePage',
        meta: {
          title: t('router.home'),
          icon: 'ep:home-filled',
          noCache: false,
          affix: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'UserInfo',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'Profile',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: t('common.profile')
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/empty',
    component: () => import('@/views/Empty/Empty.vue'),
    name: 'Empty',
    meta: {
      hidden: true,
      title: t('空页面'),
      noTagsView: true
    }
  },
  {
    path: '/questionnaire',
    component: () => import('@/views/questionnaire/index.vue'),
    name: 'Questionnaire',
    meta: {
      hidden: true,
      title: t('问卷'),
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: 'Error',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  {
    path: '/dict',
    component: Layout,
    name: 'dict',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'type/data/:dictType',
        component: () => import('@/views/system/dict/data/index.vue'),
        name: 'SystemDictData',
        meta: {
          title: '字典数据',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/system',
          activeSubMenu: '/admin/system/set/dict'
        }
      }
    ]
  },
  {
    path: '/admin/system/thirdPartyFields/index',
    component: Layout,
    name: 'thirdPartyFields',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/admin/system/thirdPartyFields/data/index/:businessId',
        component: () => import('@/views/system/thirdPartyFields/data/index.vue'),
        name: 'SystemData',
        meta: {
          title: '三方字段数据',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/system',
          activeSubMenu: '/admin/system/set/thirdPartyFields'
        }
      }
    ]
  },
  {
    path: '/redBook',
    component: Layout,
    name: 'redBook',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/admin/redBook/detail/:id',
        component: () => import('@/views/redBook/staticsDetail.vue'),
        name: 'StaticsDetail',
        meta: {
          title: '详情统计',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/redBook',
          activeSubMenu: '/admin/redBook/index/index'
        }
      }
    ]
  },
  {
    path: '/expert/index',
    component: Layout,
    name: 'expert',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/expert/log/:id',
        component: () => import('@/views/expert/log.vue'),
        name: 'OperateLog',
        meta: {
          title: '达人日志',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/expert',
          activeSubMenu: '/expert'
        }
      }
    ]
  },

  {
    path: '/system/authority/permission/index',
    component: Layout,
    name: 'permission',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/admin/system/permission/userList/:id',
        component: () => import('@/views/system/permission/userList.vue'),
        name: 'PermissionUsers',
        meta: {
          title: '分配用户',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/system',
          activeSubMenu: '/admin/system/authority/permission'
        }
      }
    ]
  },
  {
    path: '/admin/set/thirdPlatform',
    component: Layout,
    name: 'thirdPlatform',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/admin/set/thirdPlatform/seller/:platform',
        component: () => import('@/views/system/thirdPlatform/sellerInfo.vue'),
        name: 'ThirdPlatformSeller',
        meta: {
          title: '商户信息',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/admin/system',
          activeSubMenu: '/admin/system/set/thirdPlatform'
        }
      }
    ]
  },
  {
    path: '/admin/customerService',
    component: Layout,
    name: 'customerService',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/admin/customerService/commentRiskControl/commentDetail',
        component: () => import('@/views/customerService/commentRiskControl/detail.vue'),
        name: 'commentDetail',
        meta: {
          title: '查看详情',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/admin/customerService',
          activeSubMenu: '/admin/customerService/commentRiskControl'
        }
      },
      {
        path: '/admin/customerService/commentRiskControl/commentInfo',
        component: () => import('@/views/customerService/commentRiskControl/info.vue'),
        name: 'commentInfo',
        meta: {
          title: '评论信息',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/admin/customerService',
          activeSubMenu: '/admin/customerService/commentRiskControl'
        }
      }
    ]
  },
  {
    path: '/admin/PRD/new',
    component: Layout,
    name: 'prdNew',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/admin/PRD/new/progressBoard',
        component: () => import('@/views/OA/new/board/index.vue'),
        name: 'OANewBoard',
        meta: {
          title: '新品进度看板',
          noCache: false,
          hidden: true,
          canTo: true,
          activeMenu: '/admin/PRD/new',
          activeSubMenu: '/admin/PRD/new'
        }
      }
    ]
  },
  {
    path: '/admin/components/optimize',
    component: Layout,
    name: 'Optimize',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/optimize/index.vue'),
        name: 'ComOptimize',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: '组件开发'
        }
      }
    ]
  },
  {
    path: '/supplier/questionnaire',
    component: () => import('@/views/supplier/questionnaire/index.vue'),
    name: 'SupplierQuestionnaire',
    meta: {
      hidden: true,
      title: t('问卷'),
      noTagsView: true
    }
  },
  {
    path: '/supplier/questionnaire/quizList',
    component: () => import('@/views/supplier/questionnaire/quizList.vue'),
    name: 'SupplierQuestionnaireList',
    meta: {
      hidden: true,
      title: t('问卷'),
      noTagsView: true
    }
  },
  {
    path: '/test',
    component: Layout,
    name: 'OptimizeTest',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/OA/new/templete/page/index.vue'),
        name: 'OaNewTemplete',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: '创建页面'
        }
      }
    ]
  },
  // 运营中心
  {
    path: '/admin/maintenance',
    component: Layout,
    name: 'Maintenance',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'synchronized',
        component: () => import('@/views/maintenance/synchronized/page/index.vue'),
        name: 'Synchronized',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          title: '待同步货品'
        }
      }
    ]
  },
  ...bigScreenRouter,
  ...otrRouter(),
  ...oaRouter(),
  ...StorageRouter(),
  ...supplierRouter(),
  ...hrAdminMicroRouter
]

export default remainingRouter
