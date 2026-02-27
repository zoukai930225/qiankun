import request from '@/config/axios'

// 查询评论风控列表
export const getCommentList = (params: {}) => {
  return request.get({ url: '/api/comment-on-risk/list', params })
}

// 新增操作
export const saveComment = (data: any) => {
  return request.post({ url: `/api/comment-on-risk/save`, data })
}

// 更新操作
export const updateComment = (data: any) => {
  return request.post({ url: `/api/comment-on-risk/update`, data })
}

// 编辑回显 查询
export const queryPersonAssignment = (params: {}) => {
  return request.get({ url: `/api/comment-on-risk/queryPersonAssignment`, params })
}

// 查询详情
export const queryDetailsComment = (params: {}) => {
  return request.get({ url: `/api/comment-on-risk/queryDetails`, params })
}

// 查询评论信息
export const queryComments = (params: {}) => {
  return request.get({ url: '/api/comment-on-risk/queryCommentsByUserId', params })
}

// 批量处理评论
export const disposeComment = (data: any) => {
  return request.post({ url: `/api/comment-on-risk/dispose`, data })
}

// 删除功能
export const deleteComment = (params: {}) => {
  return request.get({ url: '/api/comment-on-risk/delete', params })
}
