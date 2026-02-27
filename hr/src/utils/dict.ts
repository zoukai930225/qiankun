/*
 * @Date: 2024-06-07 14:17:38
 */
/**
 * 数据字典工具类
 */
import { useDictStoreWithOut } from '@/store/modules/dict'
import { ElementPlusInfoType } from '@/types/elementPlus'

const dictStore = useDictStoreWithOut()

/**
 * 获取 dictType 对应的数据字典数组
 *
 * @param dictType 数据类型
 * @returns {*|Array} 数据字典数组
 */
export interface DictDataType {
  shortName: string | number | undefined
  dictType: string
  label: string
  value: string | number
  code: string
  colorType: ElementPlusInfoType | ''
  cssClass: string
}

export const getDictOptions = (dictType: string) => {
  return dictStore.getDictByType(dictType) || []
}

export const getIntDictOptions = (dictType: string, fliterAll: Boolean = false): DictDataType[] => {
  // 获得通用的 DictDataType 列表
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  // 转换成 number 类型的 NumberDictDataType 类型
  // why 需要特殊转换：避免 IDEA 在 v-for="dict in getIntDictOptions(...)" 时，el-option 的 key 会告警
  const dictOption: DictDataType[] = []
  dictOptions.forEach((dict: DictDataType) => {
    if (!fliterAll || (fliterAll && dict.value != 'ALL')) {
      dictOption.push({
        ...dict
      })
    }
  })
  return dictOption
}

export const getStrDictOptions = (dictType: string) => {
  const dictOption: DictDataType[] = []
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: dict.value + ''
    })
  })
  return dictOption
}

/**
 * 获取指定字典类型的指定值对应的字典对象
 * @param dictType 字典类型
 * @param value 字典值
 * @return DictDataType 字典对象
 */
export const getDictObj = (dictType: string, value: any): DictDataType | undefined => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  for (const dict of dictOptions) {
    if (dict.value === value + '') {
      return dict
    }
  }
}

/**
 * 获得字典数据的文本展示
 *
 * @param dictType 字典类型
 * @param value 字典数据的值
 * @return 字典名称
 */
export const getDictLabel = (dictType: string, value: any): string => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  const dictLabel = ref('')
  dictOptions.forEach((dict: DictDataType) => {
    if (dict.value === value + '') {
      dictLabel.value = dict.label
    }
  })
  return dictLabel.value
}

/**
 * 获得字典数据的值
 *
 * @param dictType 字典类型
 * @param label 字典文本的值
 * @return 字典名称
 */
export const getDictValue = (dictType: string, label: any): string => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  const dictValue = ref('')
  dictOptions.forEach((dict: DictDataType) => {
    if (dict.label === label + '') {
      dictValue.value = dict.value as string
    }
  })
  return dictValue.value
}

export enum DICT_TYPE {
  SYSTEM_PARAM_OFFICE_AREA = 'office_area', // 办公区域
  SYSTEM_PARAM_PROGRAM = 'program', // 影刀运行环境
  YINGDAO_NOTE_TYPE = 'yingdao_note_type', // 影刀节点类型
  YINGDAO_ROBOT_STATUS = 'yingdao_robot_status', //   影刀机器人状态,
  SYSTEM_PARAM_WHETHER = 'whether', // 是否
  SYSTEM_PARAM_WORKINGNODE = 'yingdao_working_node', // 影刀正式运行节点
  SYSTEM_PARAM_WAREHOUSE = 'warehouse', // 仓库
  SYSTEM_PARAM_STORE = 'store', // 店铺SYSTEM_PARAM_STORE= 'store', // 店铺
  SYSTEM_PARAM_POST = 'post', // 岗位
  SYSTEM_PARAM_CATEGORY = 'category', // 品类
  SYSTEM_PARAM_VISUAL_CATEGORY = 'visualCategory', // 品类审批流?
  SYSTEM_PARAM_DYNAMIC_PARAMS = 'dynamic_params', // 系统动态参数
  SYSTEM_PARAM_CONSTANT_CONFIG = 'sys_config_type', // 系统常量参数类型
  SYSTEM_PARAM_DYNAMIC_COMPANY = 'company', // 企业

  SYSTEM_PARAM_CHANNEL = 'channel', // 渠道
  SYSTEM_PARAM_PRIORITY = 'priority', // 优先级
  SYSTEM_PARAM_FIELD_CHANNEL = 'field_channel', // 字段渠道
  SYSTEM_PARAM_PRODUCT_SOURCE = 'product_source', // 产品出处
  SYSTEM_PARAM_NEW_AND_OLD_PRODUCTS = 'new_and_old_products', // 新品老品
  SYSTEM_PARAM_STATUS = 'status', //状态

  SYSTEM_PARAM_PERMISSION_TYPE = 'permissionType', //权限类型
  SYSTEM_PARAM_STORE_FIRST_TABHEADER = 'store_first_tabHeader', // 日报店铺一级表头
  SYSTEM_PARAM_STORE_SECOND_TABHEADER = 'store_second_tabHeader', // 日报店铺二级表头
  SYSTEM_PARAM_COLOR = 'color', // 颜色库
  SYSTEM_PARAM_THIRD_PLATFORM = 'third_platform', // 三方开放平台
  SYSTEM_PARAM_DUTIES = 'duties', // 职务
  SYSTEM_PARAM_EDUCATION = 'education', // 学历
  SYSTEM_PARAM_ACADEMIC_DEGREE = 'academic_degree', // 学位
  SYSTEM_PARAM_DEMAND_TYPE = 'demandType', //需求类型
  SYSTEM_PARAM_NEW_PRODUCT = 'newProduct', //新品需求
  SYSTEM_PARAM_VISUAL_SUBNODE = 'visualSubNode', //视觉流程子节点

  FEISHU_EMPLOYOEE_TYPE = 'feishu_employee_type', //飞书人员类型
  FEISHU_STATUS = 'feishu_status', //飞书员工状态
  FEISHU_GENDER = 'feishu_gender', //飞书性别
  FEISHU_ETHNICITY = 'feishu_ethnicity', //飞书婚姻状况
  FEISHU_MATERITAL_STATUS = 'feishu_marital_status', //飞书婚姻状况
  FEISHU_POLITICAL_STATUS = 'feishu_political_status', //飞书政治面貌
  FEISHU_ID_TYPE = 'feishu_id_type', //飞书证件类型
  FEISHU_HUKOU_TYPE = 'feishu_hukou_type', //飞书户口类型
  FEISHU_EMPLOY_FORM_STATUS = 'feishu_employee_form_status', //飞书户口类型
  FEISHU_APPLICATION = 'feishu_application', //飞书转正申请
  FEISHU_APPLICATION_STATUS = 'feishu_application_status', //飞书转正状态
  FEISHU_DEPARTURE_TYPE = 'feishu_departure_type', //飞书离职类型
  FEISHU_DEPARTURE_REASON = 'feishu_departure_reason', //飞书离职原因
  FEISHU_CONTRACT_TYPE = 'feishu_contract_type', //飞书合同类型
  FEISHU_CANCEL_ONBOARDING_REASON = 'feishu_cancel_onboarding_reason', //飞书取消入职原因
  FEISHU_RELEATION = 'feishu_relationship', //飞书与主要紧急联系人的关系
  FEISHU_LEVEL = 'feishu_level', //飞书最高学历
  FEISHU_DEGREE = 'feishu_degree', //飞书最高学历学位

  PRODUCT_PARAM_PLATFORM = 'product_platform', //货品管理平台

  TASK_PROGRAM_TYPE = 'program_type', // 任务程序类型
  TASK_EXECUTE_FREQUENCY = 'task_execute_rate', // 任务执行频率

  TASK_PROGRAM_HANDLE_TYPE = 'program_handle_type', // 程序处理类型
  TASK_PROGRAM_EXCEPTION_TYPE = 'program_abnormal_type', // 程序异常类型
  TASK_PROGRAM_HANDLE_RESULT_TYPE = 'program_handle_result', // 处理结果类型

  TASK_PROGRAM_EXCEPTION_TYPE_1 = 'yingdao_error_level_one', // 影刀一级程序异常类型
  TASK_PROGRAM_TWOECHELON_EXECUTE_TYPE = 'dataBorad_twoEchelon_execute_type', //任务看板二级梯队触发类型

  RPA_PROGRAM_TYPE = 'rpa_program_type', // RPA程序类型
  ZT_COMPANY = 'ztzj_company', // 在途资金企业
  PR_COMPANY = 'pr_company', // 人力资源- 企业

  PRODUCT_TYPE_PROMOTION_REPORT_PRODUCT_CATEGORY = 'promotion_report_product_category', // 产品类型(推广产品对照关系)
  PRODUCT_TYPE_PROMOTION_REPORT_CROWD_ABBREVIATION = 'promotion_report_crowd_abbreviation', // 简称(推广人群对照关系)
  PRODUCT_TYPE_PROMOTION_REPORT_CROWD_CATEGORY = 'promotion_report_crowd_category', // 人群分类(推广人群对照关系)
  PRODUCT_TYPE_PROMOTION_REPORT_CROWD_BOX = 'promotion_report_crowd_box', // 黑盒/白盒(推广人群对照关系)

  SUBROUTINE_TYPE = 'subroutine_type', // 子程序应用类型
  APPLICATION_TYPE = 'application_type', // 应用类型
  YINGDAO_BROWSER = 'yingdao_browser', //影刀浏览器
  LOGIN_ACCOUNT_PLATFORM = 'login_account_platform', //登录账号平台
  GOODGLIST_SUPPLIER = 'supplier', // 供应商

  MONITORING_CATEGORY = 'Monitoring_Category', //监控类别
  THRESHOLD_TYPE = 'Threshold_Type', //阈值类型
  THRESHOLD_SETTING = 'Threshold_Setting', //阈值设定

  // 产品质检风格
  PRODUCT_QUALITY_CHECK_STYLE = 'quality_inspection_style', // 产品质检风格
  // 产品质检安全类别
  PRODUCT_QUALITY_CHECK_SECURITY_CATEGORY = 'quality_inspection_security_category', // 产品质检安全类别
  // 产品质检执行标准
  PRODUCT_QUALITY_CHECK_ENFORCE_STANDARD = 'quality_inspection_enforce_standard', // 产品质检执行标准
  //  产品质检尺码范围
  PRODUCT_QUALITY_CHECK_SIZE_RANGE = 'quality_inspection_size_range', // 产品质检尺码范围
  // 产品质检类目
  PRODUCT_QUALITY_CHECK_CATEGORY = 'quality_inspection_category', // 产品质检类目

  OTR_PROGRAM_TYPE = 'otr_program_type', // 人才盘点项目分类
  OTR_PROGRAM_DIMENSION = 'otr_program_dimension', // 人才盘点项目维度
  METRIC_VALUE = 'metric_value', // 点击率折线图指标值

  PRODUCT_RANK_VALUE = 'product_rank_value', //商品排行指标数据

  LISTING_CYCLE = 'listing_cycle', // 上架周期

  OTR_CALIBRATION_VIEW_RESIGN_EFFECT = 'otr_calibration_view_resignEffect', // 离职影响
  OTR_CALIBRATION_VIEW_RESIGN_POSSIBILITY = 'otr_calibration_view_resignPossibility', // 离职可能性
  OTR_CALIBRATION_VIEW_APPOINT_PLAN = 'otr_calibration_view_appointPlan', // 任用计划
  OTR_CALIBRATION_VIEW_PREFERMENT_POTENTIALITY = 'otr_calibration_view_prefermentPotentiality', // 校准意见晋升潜力

  COMPETITIVE_STORES = 'competitive_stores', // 竞品店铺

  TAG_CATEGORY_DATA = 'tag_category_data', // 标签类别
  PAID_PROMOTION = 'paid_promotion', // 付费推广数据跟踪

  SUPPLIER_TYPE = 'supplier_type', // 供应商类型
  SUPPLIER_CATEGORY = 'supplier_category', // 供应商擅长类目
  SUPPLIER_SITE_NATURE = 'supplier_site_nature', // 场地性质
  SUPPLIER_COMPANY_PROPERTY = 'supplier_company_property', // 公司性质
  SUPPLIER_PAYMENT_METHOD = 'supplier_payment_method', // 结算方式
  SUPPLIER_INVOICE_TYPE = 'supplier_invoice_type', // 发票类型
  SUPPLIER_PRODUCT_TYPE = 'supplier_product_type', // 产品类型
  SUPPLIER_CERTIFIED_QUALITY = 'supplier_certified_quality', // 认证质量体系
  SUPPLIER_INTERNAL_CONTROL_PRODUCTION = 'supplier_internal_control_production', // 生产内部管控

  // OA
  OA_DURATION_UNIT = 'np_node_duration_unit', // 时长单位
  OA_WEEKLY_REST = 'np_node_weekly_rest', // 周休
  OA_NP_NODE_EXAMINE_TYPE = 'np_node_examine_type', // 新品模板节点审核人员类型

  //客服系统
  CUSTOMER_CATEGORY = 'customer_category', // 客服系统类别

  RPA_TRIGGER_STATUS = 'rpa_trigger_status', //rpa应用触发状态
  RPA_UNIFIED_TYPE = 'rpa_unified_type', //rpa统一调度执行类型

  FABRIC = 'FABRIC', // 面料种类
  SYSTEM_PARAM_COMPANY_DICT = 'company_dict', // 企业名称（汉语）

  NP_WOMANPANTS_YX = 'np_womanpants_yx', // 新品女裤腰型
  NP_WOMANPANTS_BX = 'np_womanpants_bx', // 新品女裤版型
  NP_WOMANPANTS_FG = 'np_womanpants_fg', // 新品女裤风格
  NP_MANPANTS_BX = 'np_manpants_bx', // 新品男裤版型
  NP_MANPANTS_FG = 'np_manpants_fg', //新品男裤风格
  NP_BRA_BX = 'np_bra_bx', //新品文胸杯型
  NP_BRA_FG = 'np_bra_fg', //新品文胸风格
  NP_BRA_GN = 'np_bra_gn', //新品文胸功能
  NP_SOCKS_BX = 'np_socks_bx', //新品袜子版型
  NP_SOCKS_FG = 'np_socks_fg', //新品袜子风格
  NP_SOCKS_SIZE = 'np_sock_size', // 新品袜子袜号
  NP_SUSPENDERS_BX = 'np_suspenders_bx', //新品吊带背心版型
  NP_SUSPENDERS_BD = 'np_suspenders_bd', //新品吊带背心杯垫
  NP_SUSPENDERS_LX = 'np_suspenders_lx', //新品吊带背心领型
  NP_SUSPENDERS_FG = 'np_suspenders_fg', //新品吊带背心风格
  NP_SEASONAL_LB = 'np_seasonal_lb', //新品季节品类别
  NP_SEASONAL_FG = 'np_seasonal_fg', //新品季节品风格
  NP_PASTIES_BX = 'np_pasties_bx', //新品胸贴杯型
  NP_PASTIES_HD = 'np_pasties_hd', //新品胸贴厚度
  NP_PASTIES_GN = 'np_pasties_gn', //新品胸贴功能
  NP_JJF_JJ = 'np_jjf_jj', //新品家居服季节
  NP_JJF_KS = 'np_jjf_ks', //新品家居服款式
  NP_JJF_HD = 'np_jjf_hd', //新品家居服厚度
  NP_ENTERPRISE_STATUS = 'np_enterprise_status', //新品企划审核状态
  NP_PLAN_TEMPLATE = 'np_plan_template', // 新品企划模板
  NP_UNDERWEAR_BX = 'np_underwear_bx', //新品内衣杯型
  NP_UNDERWEAR_KS = 'np_underwear_ks', //新品内衣款式
  NP_UNDERWEAR_CATEGORY = 'np_underwear_category', //新品商品分类
  NP_PRODUCTGRADE = 'np_productGrade', //新品产品等级
  NP_PRENATAL_SAMPLE_EXAMINE_STATUS = 'np_prenatal_sample_examine_status', // 产前样审核状态
  NP_ENTERPRISE_PLANTYPE = 'np_enterprise_planType', // 企划类型
  NP_ENTERPRISE_PRODUCTTYPE = 'np_enterprise_productType', // 产品类型
  NP_CATEGORY_PRODUCT_TYPE = 'np_category_product_type',
  // 财务
  PRODUCT_CATEGORY = 'product_category', // 开票名称
  DUTY_AUTHORITY_ROLE = 'duty_authority_role', // 角色

  // 仓储
  SHIFT_TYPE = 'shift_type', // 班次
  ACCOUNTTING_METHOD = 'accounting_method', // 薪资结算方式
  ROLES_MASK = 'roles_mask', // 工种

  STANDARD_CATEGORY = 'standard_category', // 商品标准类目
  // 拍摄衣库一级分类
  SHOOTING_CLOTHING_WAREHOUSE = 'shooting_clothing_warehouse',
  // 拍摄衣库尺码
  SHOOTING_CLOTHING_WAREHOUSE_SIZE = 'shooting_clothing_warehouse_size',

  // 商品标准类目-二级
  // 商品标准类目-内衣-勿修改
  STANDARD_CATEGORY_UNDERWEAR = 'standard_category_underwear',
  // 商品标准类目-袜子-勿修改
  STANDARD_CATEGORY_SOCKS = 'standard_category_socks',
  // 商品标准类目-季节品-勿修改
  STANDARD_CATEGORY_SEASONAL = 'standard_category_seasonal',
  // 商品标准类目-胸贴-勿修改
  STANDARD_CATEGORY_PASTIES = 'standard_category_pasties',
  // 商品标准类目-女士内裤-勿修改
  STANDARD_CATEGORY_WOMENPANTS = 'standard_category_womenpants',
  // 商品标准类目-男士内裤-勿修改
  STANDARD_CATEGORY_MANPANTS = 'standard_category_manpants',

  // douyin_promotion_business_type  业务类型
  DOUYIN_PROMOTION_TYPE = 'douyin_promotion_type', // 千川类型,
  DOUYIN_PROMOTION_BUSINESS_TYPE = 'douyin_promotion_business_type', // 千川业务类型
  SALES_OUTBOUND_ORDER_ORDER_SOURCE = 'sales_outbound_order_order_source',

  // 货品信息
  SC_GOODS_CATEGORY = 'sc_goods_category', // 货品类目
  SC_PRODUCTON_CYCLE = 'sc_production_cycle', // 生产周期列表
  SC_GOODS_LEVEL = 'sc_goods_level', // 货品等级列表
  SC_GOODS_SEASON = 'sc_goods_season', // 货品季节列表

  // 仓库状态
  SC_WAREHOUSE_STATUS = 'sc_warehouse_status',
  //小红书展示类型
  XHS_PROMOTION_TYPE = 'xhs_promotion_type',

  //达摩盘类目趋势类目
  DHARMA_DISC_CATEGORY_TREND_CATEGORY = 'dharma_disc_category_trend_category',

  //新品设计图库产品尺码
  NP_DESIGN_PRODUCT_SIZE = 'np_design_product_size',

  //生意参谋市场排行榜单类型 - 运营中心 >> 市场数据 >> 淘系市场
  BUSINESS_ADVISOR_MARKET_RANK_LIST_TYPE = 'business_advisor_market_rank_list_type',

  /** 客服中心 客诉问题反馈 */
  CS_PROBLEM_FEEDBACK_CATEGORY = 'cs_problem_feedback_category', // 问题反馈品类
  CS_PROBLEM_FEEDBACK_FINISH_STATUS = 'cs_problem_feedback_finish_status', // 问题反馈品类
  CS_PROBLEM_FEEDBACK_HANDLE_DEPT = 'cs_problem_feedback_handle_dept', // 问题处理部门
  CS_PROBLEM_FEEDBACK_STATUS = 'cs_problem_feedback_status', // 问题处理部门
  CS_PROBLEM_FEEDBACK_TYPE = 'cs_problem_feedback_type', // 问题反馈类型
  /** 客服中心 客诉问题反馈 */
  //经营利润报表
  DAILY_COMPANY = 'daily_company',
  DATA_CHECK_SERVICE_TYPE = 'data_check_service_type', //数据检查服务类型
  CHECK_DATA_BASE_TYPE = 'check_data_base_type', //数据检查基础类型
  CHECK_DATA_DATE = 'check_data_date', //数据检查日期
  DATA_CHECK_TYPE = 'datacheck_type', //统计类型

  SUPPLIER_STATUS = 'supplier_status', // 供应商状态
  // 使用季节
  NP_USE_SEASON = 'np_use_season',
  // 适用性别
  NP_APPLY_GENDER = 'np_apply_gender',
  // 新品使用对象
  NP_USE_TARGET = 'np_use_target',

  SUPPLIER_COLLAB_MODE = 'sc_supplier_collab_mode', // 供应商合作模式

  SUPPLIER_IMG_TYPE = 'sc_supplier_inspection_img_type',
  /**需求来源 */
  SC_PR_REQUEST_SOURCE = 'sc_pr_request_source',

  /** 客服中心 客服仓库对接 */
  CS_WAREHOUSE_DOCKING_WAREHOUSE = 'cs_warehouse_docking_warehouse', //所属仓库

  CS_WAREHOUSE_DOCKING_ISSUE_TYPE = 'cs_warehouse_docking_issue_type', // 问题类型

  CS_WAREHOUSE_DOCKING_REFUND_ISSUE_TYPE = 'cs_warehouse_docking_refund_issue_type', // 问题类型
  /** 客服中心 客服仓库对接 */
  VC_HEADERVIDEO_STORECODE = 'vc_headervideo_storecode', // 渠道

  SAMPLE_MANAGEMENT_INVENTORY_APPLY_STATUS = 'sample_management_inventory_apply_status', // 样品管理 审核 状态

  // 新品模板审核配置节点名称
  NP_TEMPLATE_EXAMINE_DETAIL_NAME = 'np_template_examine_detail_name',

  //bi-指标管理-指标类型
  METRIC_TYPE = 'metric_type',
  //bi-指标管理-指标固定位置
  METRIC_FIXED_POSITION = 'metric_fixed_position',
  //bi-指标管理-指标字符类型
  METRIC_STR_TYPE = 'metric_str_type',
  //bi-指标管理-指标业务类型
  METRIC_BUSINESS_TYPE = 'metric_business_type',
  //bi-指标管理-指标页面编码
  METRIC_WEB_CODE = 'metric_web_code',
  //消息类型
  MESSAGE_NOTICE_TYPE = 'message_notice_type',
  // 资产相关
  ASSET_DETAIL_APPLY_TYPE = 'zcmx_sqlx', // 资产明细-申请类型
  ASSET_DETAIL_STATUS = 'zcmx_zt', // 资产明细-状态
  ASSET_APPLY_TYPE = 'zcsqlx', // 资产申请类型
  FIXED_ASSET_TYPE = 'gdzc_zclx', // 固定资产-资产类型
  SUPPLIER_ASSESSMENT_DIMENSION = 'supplier_assessment_dimension', // 供应商考核维度
  SUPPLIER_ASSESSMENT_TYPE = 'supplier_assessment_type', // 供应商考核维度
  //资产确认状态
  ZCTJ_QRZT = 'zctj_qrzt',

  FABRIC_CATEGORY = 'fabric_category', // 面料分类
  ORDEr_MIDDLE = 'supplement_order_middleground_invalid_default',
  //质检问题登记
  QUALITY_INSPECTION_TYPE = 'quality_inspection_type',
  PROBLEM_RISK_LEVEL = 'problem_risk_level',
  VIOLATING_PUBLIC_OPINION = 'violating_public_opinion', // 实时质检问题登记-触犯舆情
  ROOT_CAUSE = 'root_cause', // 实时质检问题登记-产生原因
  SPECTIFIC_REASON = 'specific_reason', // 实时质检问题登记-具体原因
  CUSTOMER_PLAN_TIME_SERVICE = 'customer_plan_time_service', // 实时质检问题登记-客服当时方案
  CUSTOMER_TIME_FEEDBACK = 'customer_time_feedback', // 实时质检问题登记-客服当时反馈
  VISUAL_PROCESS_NODE = 'visualProcessNode', // 日历可视化流程节点
  /** 供应商考核规则等级设置处理方案 */
  SUPPLIER_GRADE_HANDLING_SCHEME = 'supplier_grade_handling_scheme',
  /** 供应商考核等级分数 */
  SUPPLIER_GRADE_SCORE_RULE = 'supplier_grade_score_rule',

  DY_REFUND_PRODUCT_TYPE = 'dy_refund_product_type', //抖音退款商品类型

  /**预约发货方式 */
  SC_ASR_APPOINTMENT_TYPE = 'sc_asr_appointment_type',

  BI_REFUND_STATUS = 'bi_refund_status', //售后类型
  BI_SMALL_AMOUNT_RECEIPT = 'bi_small_amount_receipt', //是否小额

  VC_MODEL_LIB_MODEl_TYPE = 'vc_model_lib_model_type', //模特类型
  VC_MODEL_LIB_PRODUCT_TYPE = 'vc_model_lib_product_type', //产品类型
  /**运营备货调整原因 */
  OPS_REPLENISHMENT_ADJUSTMENT_REASON = 'ops_replenishment_adjustment_reason',
  /**产品类型 */
  OPS_REPLENISHMENT_PRODUCT_TYPE = 'ops_replenishment_request_product_type',
  /** 阶段 */
  NP_TEMPLETE_PHASE = 'np_template_phase',

  //旺店通加急订单审核结果
  EXAM_RESULT = 'urgent_order_status',

  // QC日报 具体事项
  SPECIFIC_MATTERS = 'specific_matters',

  // 品类负责人流程
  SYS_CATEGORY_MANAGER_PROCESS = 'sys_category_manager_process',

  // 品类负责人角色
  SYS_CATEGORY_MANAGER_ROLE = 'sys_category_manager_role',

  /** 货品类型 */
  NP_DESIGN_PRODUCT_TYPE = 'np_design_product_type',

  /**安全类别 */
  SECURITY_CATEGORY = 'SECURITY_CATEGORY',

  /**执行标准 */
  EXECUTION_STANDARDS = 'EXECUTION_STANDARDS',
  /**新品设计图库颜色 */
  NP_DESIGN_PRODUCT_COLOR = 'np_design_product_color',

  // 样品管理 申请用途
  APPLY_PURPOSE = 'apply_purpose',

  //来源平台
  ORG_TYPE = 'org_type',
  //人工维护损耗 - 计算指标
  CALCULATE_INDICATOR = 'calculateIndicator',
  /**奖金计算项目 */
  CONTENT_BONUS_CALCULATION_PROJECT = 'content_bonus_calculation_project',
  // 运营中心-权限管理-日志操作类型
  OP_DUTY_AUTHORITY_MANAGE_OPERATE_TYPE = 'op_duty_authority_manage_operate_type',
  //待办事项类型
  SYS_TODO_TYPE = 'sys_todo_type',
  // 二开回收原因
  SECCONDARY_DEVELOPMENT_REASON = 'secondary_development_reason',
  // 千川配置账户类型
  QC_ACCOUNT_TYPE = 'qc_account_type'
}
