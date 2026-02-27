import request from '@/config/axios'

const API_PREFIX = '/api/bpCandidateProduct'

/**
 * 分页查询参选产品列表
 */
export const getCandidateProductPage = (data: any) =>
  request.post({ url: `${API_PREFIX}/list`, data })

/**
 * 新增参选产品
 */
export const addCandidateProduct = (data: any) =>
  request.post({ url: `${API_PREFIX}/add`, data, showLoading: true })

/**
 * 编辑参选产品
 */
export const updateCandidateProduct = (data: any) =>
  request.post({ url: `${API_PREFIX}/update`, data, showLoading: true })

/**
 * 获取参选产品详情
 */
export const getCandidateProductDetail = (id: string | number) =>
  request.get({ url: `${API_PREFIX}/detail/${id}` })

export const getCandidateProductSupplierOptions = () =>
  request.get({ url: `${API_PREFIX}/supplierOptions` })

export const deleteCandidateProduct = (id: string | number) =>
  request.get({ url: `${API_PREFIX}/delete/${id}`, showLoading: true })

const REVIEW_PREFIX = '/api/bpSelectionProductReviewInfo'
const SELECTION_PREFIX = '/api/bpSelectionProductInfo'

export const getSelectionProductReviewList = (candidateProductId: string | number) =>
  request.get({ url: `${REVIEW_PREFIX}/list/${candidateProductId}` })

export const addSelectionProductQuotation = (data: any) =>
  request.post({ url: `${REVIEW_PREFIX}/quotation/add`, data, showLoading: true })

export const updateSelectionProductQuotation = (data: any) =>
  request.post({ url: `${REVIEW_PREFIX}/quotation/update`, data, showLoading: true })

export const getSelectionProductQuotationDetail = (candidateProductId: string | number) =>
  request.get({
    url: `${REVIEW_PREFIX}/quotation/detailByCandidateId/${candidateProductId}`
  })

export const saveSelectionProductReview = (data: any) =>
  request.post({ url: `${REVIEW_PREFIX}/saveReview`, data, showLoading: true })

export const getSelectionProductDetail = (candidateProductId: string | number) =>
  request.get({ url: `${SELECTION_PREFIX}/detail/${candidateProductId}` })

export const saveSelectionProductInfo = (data: any) =>
  request.post({ url: `${SELECTION_PREFIX}/saveSelection`, data, showLoading: true })

export const planningConfirmDetail = (candidateProductId: string | number) =>
  request.get({ url: `${API_PREFIX}/planningConfirmDetail/${candidateProductId}` })

export const confirmResultOptions = (candidateProductId: string | number) =>
  request.get({ url: `${API_PREFIX}/confirmResultOptions/${candidateProductId}` })

export const savePlanningConfirm = (data: any) =>
  request.post({ url: `${API_PREFIX}/savePlanningConfirm`, data, showLoading: true })

// /api/sysCategory/list
export const getCategoryList = () => request.get({ url: `/api/sysCategory/queryCategoryTree` })

// /api/bpCandidateProduct/matchSupplier
export const matchSupplier = (data: any) =>
  request.post({ url: `${API_PREFIX}/matchSupplier`, data, showLoading: true })
