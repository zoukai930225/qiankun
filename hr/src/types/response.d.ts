
// 基础响应结构
interface BaseResponse<T = any> {
  code:number,
  data:T,
  message:string,
  success:boolean,
  timestamp:number
}

// 分页响应结构
interface PaginatedResponse<T> extends BaseResponse<T[]> {
 current:number
  pages:number,
  records:T[],
  size:number,
  total:number
}

// 导出类型
export type {
  BaseResponse,
  PaginatedResponse,
};