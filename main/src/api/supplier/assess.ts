import request from '@/config/axios'

interface GetRes<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  extras?: any
}

//////////////////////////供应商考核///////////////////////////////////////

export function supplierAssessmentSupplierPageApi(data: Supplier.Assess.GetAssessParams) {
  return request.post<GetRes<Supplier.Assess.AssessPage>>({
    url: '/api/supplierAssessment/supplierPage',
    data
  })
}

/**供应商考核-供应商考核查看详情 */
export function supplierAssessmentQueryAssessmentApi(
  data: Supplier.Assess.AssessPageDetailRequest
) {
  return request.post<Supplier.Assess.SupplierAssessmentQuizDto>({
    url: '/api/supplierAssessment/queryAssessment',
    data
  })
}

/**供应商考核-考核人数查询 */
export function supplierAssessmentQueryAssessmentUserApi(quizId: string) {
  return request.get<Supplier.Assess.SupplierAssessmentUserDto[]>({
    url: `/api/supplierAssessment/queryAssessmentUser/${quizId}`
  })
}

/**供应商考核-供应商考核进度 */
export function supplierAssessmentQueryAssessmentProgressApi(quizId: string) {
  return request.get<Supplier.Assess.SupplierAssessmentUserDto[]>({
    url: `/api/supplierAssessment/queryAssessmentProgress/${quizId}`
  })
}

/** 供应商考核-供应商考核问卷保存 */
export function supplierAssessmentSaveQuiz(data: any) {
  return request.postOriginal({
    url: '/api/supplierAssessment/saveQuiz',
    data
  })
}

/**供应商考核-供应商考核加减赋分项目列表 */
export function supplierAssessmentPageQuizExtraScoreApi(quizId: string) {
  return request.get<Supplier.Assess.SupplierAssessmentQuizExtraScore[]>({
    url: `/api/supplierAssessment/quizExtraScoreListByQuizId/${quizId}`
  })
}

/**供应商考核-删除考核加减赋分项目 */
export function supplierAssessmentDeleteQuizExtraScoreApi(quizExtraScoreId: string) {
  return request.postOriginal({
    url: `/api/supplierAssessment/deleteQuizExtraScore/${quizExtraScoreId}`
  })
}

/**供应商考核-修改/新增考核加减赋分项目 */
export function updateQuizExtraScoreApi(data: Supplier.Assess.SupplierAssessmentQuizExtraScore) {
  return request.postOriginal({
    url: data.id
      ? '/api/supplierAssessment/updateQuizExtraScore'
      : '/api/supplierAssessment/addQuizExtraScore',
    data
  })
}

/** 供应商考核-供应商考核加减赋分项目操作记录分页 */
export function pageQuizExtraScoreLogApi(data: { page?: number; quizId?: string; size?: number }) {
  return request.post<GetRes<Supplier.Assess.SupplierAssessmentQuizExtraScore>>({
    url: '/api/supplierAssessment/PageQuizExtraScoreLog',
    data
  })
}

/** 供应商考核-供应商考核删除 */
export function deleteAssessmentApi(quizId: string) {
  return request.postOriginal({
    url: `/api/supplierAssessment/deleteAssessment/${quizId}`
  })
}

/**供应商考核-发送飞书消息提醒 */
export function sendQuizNotifyCardApi(data: {
  quizId: string
  notifyAll: boolean
  assessmentUserIds?: string[]
}) {
  return request.postOriginal({
    url: '/api/supplierAssessment/sendQuizNotifyCard',
    data
  })
}

/** 供应商考核-发送飞书消息提醒(一键提醒) */
export function sendQuizNotifyCardAllApi(data) {
  return request.postOriginal({
    url: '/api/supplierAssessment/sendQuizNotifyCardAll',
    data
  })
}

/** 数据看板 */
export function supplierAssessmentDataBoardApi() {
  return request.get({
    url: '/api/supplierAssessment/dataBoard'
  })
}

/** 参与评分供应商分页列表 */
export function supplierAssessmentParticipatePageApi(data: any) {
  return request.post({
    url: '/api/supplierAssessment/participatePage',
    data
  })
}

/** 供应商考核-已完成评分/未完成评分 */
export function supplierAssessmentCompletedPageApi(data: any) {
  return request.post({
    url: '/api/supplierAssessment/completedPage',
    data
  })
}

/** 供应商考核-供应商考核问卷同步数据 */
export function supplierAssessmentQuizCalculateByIdsApi(data: string[]) {
  return request.postOriginal({
    url: '/api/supplierAssessment/quizCalculateByIds',
    data
  })
}

///////////////////////考核数据////////////////////////////////////////////

/**供应商考核数据-分页查询 */
export function supplierAssessmentDataPageQueryApi(data: Supplier.Assess.AssessDataPageRequest) {
  return request.post<GetRes<Supplier.Assess.SupplierAssessmentDataDto>>({
    url: '/api/supplierAssessmentData/pageQuery',
    data
  })
}

/**供应商考核数据-分数明细 */
export function queryAssessmentDataScoreApi(quizId: string, params?: any) {
  return request.get<Supplier.Assess.SupplierAssessmentUserDto[]>({
    url: `/api/supplierAssessmentData/queryAssessmentDataScore/${quizId}`,
    params
  })
}

/**供应商考核数据-查看详情 */
export function supplierAssessmentDataQueryAssessmentDataApi(
  data: Supplier.Assess.AssessPageDetailRequest
) {
  return request.post({
    url: '/api/supplierAssessmentData/queryAssessmentData',
    data
  })
}

/////////////////////等级标准/////////////////////////////////////////////

/** 通过ID查询单条数据 */
export function getsupplierGradeByIdApi(id: string) {
  return request.get<Supplier.Assess.SupplierGrade>({
    url: `/api/supplierGrade/${id}`
  })
}

/** 分页查询 */
export function supplierGradePageApi(params: Supplier.Assess.GetSupplierGradePaginQueryRequest) {
  return request.get<GetRes<Supplier.Assess.SupplierGrade>>({
    url: '/api/supplierGrade/paginQuery',
    params
  })
}

/**新增数据 */
export function addSupplierGradeApi(data: Supplier.Assess.SupplierGrade) {
  return request.postOriginal({
    url: '/api/supplierGrade',
    data
  })
}

/**编辑数据 */
export function editSupplierGradeApi(data: Supplier.Assess.SupplierGrade) {
  return request.putOriginal({
    url: '/api/supplierGrade',
    data
  })
}

/**通过主键删除数据 */
export function removeSupplierGradeApi(params: { id: string }) {
  return request.deleteOriginal({
    url: '/api/supplierGrade',
    params
  })
}

///////////////////////////// 加减分项 //////////////////////////////////////////

/**通过ID查询单条数据 */
export function getSupplierScoreChangeByIdApi(id: string) {
  return request.get({
    url: `/api/supplierScoreChange/${id}`
  })
}

/**分页查询加减分 */
export function supplierScoreChangeApi(params: Supplier.Assess.SupplierScoreChangePageRequest) {
  return request.get<GetRes<Omit<Supplier.Assess.SupplierScoreChangePageRequest, 'page' | 'size'>>>(
    {
      url: '/api/supplierScoreChange/paginQuery',
      params
    }
  )
}

/**新增数据 */
export function addSupplierScoreChangeApi(
  data: Omit<Supplier.Assess.SupplierScoreChangePageRequest, 'page' | 'size'>
) {
  return request.postOriginal({
    url: '/api/supplierScoreChange',
    data
  })
}

/**更新数据 */
export function editSupplierScoreChangeApi(
  data: Omit<Supplier.Assess.SupplierScoreChangePageRequest, 'page' | 'size'> & { id?: string }
) {
  return request.putOriginal({
    url: '/api/supplierScoreChange',
    data
  })
}

/**通过主键删除数据 */
export function removeSupplierScoreChangeApi(params: { id: string }) {
  return request.deleteOriginal({
    url: '/api/supplierScoreChange',
    params
  })
}

/////////////////////////// 考核类型/////////////////////////////////////////

/**通过ID查询单条数据 */
export function getAssessmentTypeByIdApi(id: string) {
  return request.get({
    url: `/api/supplierAssessmentType/${id}`
  })
}

/**查询全部考核类型 */
export function getAssessmentTypeListApi(params: Supplier.Assess.GetAssessmentTypeListRequest) {
  return request.post<Supplier.Assess.AssessmentTypeList[]>({
    url: '/api/supplierAssessmentType/queryAll',
    // url: 'http://127.0.0.1:4523/m1/4344737-3988140-default/api/supplierAssessmentType/queryAll  ',
    params
  })
}

/**新增数据或更新数据 */
export function addAssessmentTypeApi(data: Supplier.Assess.AddOrEditRequest) {
  return request.postOriginal({
    url: '/api/supplierAssessmentType/saveOrUpdate',
    data
  })
}

/**通过主键删除数据 */
export function removeAssessmentTypeApi(params: { id: string }) {
  return request.deleteOriginal({
    url: '/api/supplierAssessmentType',
    params
  })
}

/**获取全部部门列表 */
export function getAllDepartmentList() {
  return request.get({
    url: '/api/supplierAssessmentType/getSecretWorldDepartment'
  })
}
