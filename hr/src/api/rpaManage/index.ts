import request from '@/config/axios'

// 查询影刀程序列表
export interface ProgramType {
  page: number
  size: number
  serviceCode?: string
  skName?: string
  devName?: string
  runEnvironment?: string
  proEnvironmentMessage?: string
}
// 查询影刀程序列表
export const getProgramList = (params) => {
  return request.get({
    url: '/api/sk-tabulate/list',
    params
  })
}
// 根据id查看影刀程序详情
export const getProgramDetail = (id: string) => {
  return request.get({
    url: `/api/sk-tabulate/${id}`
  })
}
// 根据id删除影刀程序
export const deleteProgram = (id: string) => {
  return request.get({
    url: `/api/sk-tabulate/delete/${id}`
  })
}
// 新增影刀程序
export const addProgram = (data: any) => {
  return request.post({
    url: '/api/sk-tabulate/create',
    data
  })
}
// 修改影刀程序
export const updateProgram = (data: any) => {
  return request.post({
    url: '/api/sk-tabulate/update',
    data
  })
}
// 根据code查看程序关联的参数列表
export const getProgramConfigList = (params) => {
  return request.get({
    url: '/api/sk-tabulate/skDynamicParamByCode',
    params
  })
}
// 查询参数列表
export const getConfigList = ({
  page = 1,
  size = 10,
  isCommonParam,
  paramsEnvironment,
  paramName,
  paramKey,
  paramValue
}) => {
  return request.get({
    url: '/api/sk-dynamic-param/list',
    params: {
      page,
      size,
      paramsEnvironment,
      paramName,
      paramKey,
      paramValue,
      isCommonParam
    }
  })
}
// 新增参数配置
export const addConfig = (data: any) => {
  return request.post({
    url: '/api/sk-dynamic-param/create',
    data
  })
}
// 修改参数配置
export const updateConfig = (data: any) => {
  return request.post({
    url: '/api/sk-dynamic-param/update',
    data
  })
}

// 修改参数配置
export const updateConfig1 = (data: any) => {
  return request.post({
    url: '/api/sk-dynamic-param/updateById',
    data
  })
}
// 根据id查看参数配置
export const getConfigDetail = (id: string) => {
  return request.get({
    url: `/api/sk-dynamic-param/${id}`
  })
}
// 根据id删除参数配置
export const deleteConfig = (id: string) => {
  return request.get({
    url: `/api/sk-dynamic-param/delete/${id}`
  })
}
// 参数配置绑定影刀程序
export const configBindProgram = (data: any) => {
  return request.post({
    url: '/api/sk-tabulate-param/batchCreate',
    data
  })
}
// 参数批量取消绑定影刀程序
export const configUnbindProgram = (data: any) => {
  return request.post({
    url: '/api/sk-tabulate-param/batchDelete',
    data
  })
}
// 根据参数id查询绑定影刀程序列表
export const getProgramListByParamId = (params) => {
  return request.get({
    url: `/api/sk-dynamic-param/querySkTabulateById`,
    params
  })
}
// 根据参数id查询未绑定影刀列表
export const getUnbindProgramListByParamId = (params) => {
  return request.get({
    url: `/api/sk-dynamic-param/queryUnbound`,
    params
  })
}

// 新增程序 下拉 任务列表

export const getTaskList = () => {
  return request.get({ url: '/api/dataBoard/task/list' })
}
// 新增/修改 任务信息保存
export const saveOrupdateTask = (data: any) => {
  return request.post({
    url: '/api/dataBoard/task/save',
    data
  })
}

// 查询负责人
export const getUserList = (params) => {
  return request.get({ url: '/api/user/list', params })
}
// ------------------------ 应用管理 -------------------------
// 应用列表
export const getProgramGroupList = (params) => {
  return request.get({ url: '/api/sk-tabulate-group/pageList', params })
}

// 新增应用
export const addProgramGroup = (data: any) => {
  return request.post({
    url: '/api/sk-tabulate-group/save',
    data
  })
}

// 修改应用信息
export const updateProgramGroup = (data: any) => {
  return request.post({
    url: '/api/sk-tabulate-group/update',
    data
  })
}
// 删除应用
export const deleteProgramGroup = (params) => {
  return request.get({
    url: `/api/sk-tabulate-group/delete`,
    params
  })
}

// 根据id回显应用信息
export const getProgramGroupDetail = (params) => {
  return request.get({
    url: `/api/sk-tabulate-group/getById`,
    params
  })
}

// 应用列表 下拉 新增程序
export const getProgramListForGroup = () => {
  return request.get({ url: '/api/sk-tabulate-group/list' })
}

// 选择应用 不用了
export const selectProgramGroup = (params) => {
  return request.get({
    url: '/api/sk-tabulate-group/getGroupList',
    params
  })
}

//选择应用 改成下面这个
export const getGroupListInfo = (data: any) => {
  return request.post({
    url: '/api/sk-tabulate-group/getGroupListInfo',
    data
  })
}

// 根据任务id查询应用
export const getProgramGroupListByTaskId = (params) => {
  return request.get({
    url: '/api/sk-tabulate-group/getGroupByTask',
    params
  })
}

// 新增梯队
export const addEchelon = (data: any) => {
  return request.post({
    url: '/api/dataBoard/echelon/save',
    data
  })
}

// ---------------------应用3.0-------------------------------------
// 查询应用列表(3.0)
export const getApplicationList = (params) => {
  return request.get({
    url: '/api/sk-tabulate-group/applicationList',
    params
  })
}

// 查询应用详情(3.0)
export const getApplicationDetail = (params) => {
  return request.get({
    url: '/api/sk-tabulate-group/getSk',
    params
  })
}

// 更新应用信息(3.0)
export const updateApplication = (data: any) => {
  return request.post({
    url: '/api/sk-tabulate-group/updateSkGroup',
    data
  })
}

// 删除应用(3.0)
export const deleteApplication = (params) => {
  return request.get({
    url: '/api/sk-tabulate-group/deleted',
    params
  })
}

// 新增应用(3.0)
export const addApplication = (data: any) => {
  return request.post({
    url: '/api/sk-tabulate-group/saveSkGroup',
    data
  })
}

// 执行RPA任务(3.0)
export const executeTask = (params: any) => {
  return request.get({
    url: '/api/sk-tabulate-group/executeRpaTask',
    params
  })
}

// -----------------------修改
// 查询负责人
export const getManagerList = () => {
  return request.get({ url: '/api/personRoster/getAll' })
}

// 公共参数 -分页查询
export const getCommonParamList = (params) => {
  return request.get({
    url: '/api/sk-dynamic-param/getParamList',
    params
  })
}

// 应用与公共参数绑定
export const bindCommonParam = (data: any) => {
  return request.post({
    url: '/api/sk-dynamic-param/bindingParam',
    data
  })
}

// 获取已选店铺列表
export const getSelectedShopList = (params) => {
  return request.get({
    url: '/api/skGroupType/pageByTypeId',
    params
  })
}

// 新增店铺
export const addShop = (data: any) => {
  return request.post({
    url: '/api/skGroupType/insertStore',
    data
  })
}

// 更新店铺
export const updateShop = (data: any) => {
  return request.post({
    url: '/api/skGroupType/updateStore',
    data
  })
}

// 编辑回显
export const getShopDetail = (params) => {
  return request.get({
    url: '/api/skGroupType/getStoreById',
    params
  })
}

// ----------4.0变动接口----------
// 应用列表最新接口
export const getApplicationListNew = (params) => {
  return request.get({
    url: '/api/sk-tabulate-group/getPageList',
    params
  })
}

// 获取店铺列表
export const getStoreList = (params) => {
  return request.get({
    url: '/api/store/list',
    params
  })
}

// --------------01.03迭代接口--------------
// 应用列表查看参数
export const getApplicationParamList = (params) => {
  return request.get({
    url: '/api/skGroupType/getParamPageList',
    params
  })
}

// 应用类型取消绑定
export const unbindApplicationType = (data: any) => {
  return request.post({
    url: '/api/sk-dynamic-param/batchUnBinding',
    data
  })
}

// 应用列表 - 二级梯队重跑

// 查询二级梯队应用列表
export const getEchelonList = (params) => {
  return request.get({
    url: '/api/sk-tabulate-group/getTwoEchelonGroupList',
    params
  })
}

// 修改二级梯队应用状态
export const updateEchelonStatus = (data: any) => {
  return request.post({
    url: '/api/sk-tabulate-group/updateTwoEchelonGroupStatus',
    data
  })
}

// 执行记录--
// 执行
export const executeRpa = (data: any) => {
  return request.post({
    url: '/api/dataBoard/executeRpa',
    data
  })
}

// 移除应用类型下的私有参数
export const removePrivateParam = (paramId: string) => {
  return request.get({
    url: '/api/skGroupType/deletedIsNotCommonParam?paramId=' + paramId
  })
}

// 20250412优化
// 删除任务
export const deleteTask = (id: string) => {
  return request.get({
    url: `/api/dataBoard/task/deleted?id=${id}`
  })
}

// 重执行
export const executeRpaApplication = (params: any) => {
  return request.get({
    url: '/api/dataCheckResult/executeRpaApplication',
    params
  })
}
