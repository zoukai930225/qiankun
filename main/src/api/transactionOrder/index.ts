import request from '@/config/axios'

// 分页
export const getDetailList = (params: any) => {
  return request.get({ url: `/api/supplementOrderOperationInfo/list`, params });
};

// 详情
export const getDetail = (id: string) => {
  return request.get({ url: `/api/supplementOrderOperationInfo/get/${id}` });
};

// 更新
export const saveDetail = (data: any, type: string) => {
  return request.post({ url: `/api/supplementOrderOperationInfo/${type === 'add' ? 'save' : 'update'}`, data });
};

// 抢单
export const grabOrder = (data: any) => {
  return request.post({ url: `/api/supplementOrderOperationInfo/grabOrder`, data });
};

// 导出
export const exportDataInfo = (params: any) => {
  return request.download({ url: `/api/supplementOrderOperationInfo/list/export`, params });
};
