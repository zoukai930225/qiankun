import request from '@/config/axios'

// 售前周数据
export const customerServiceDataPreSalesWeek = () => {
  return request.get({ url: '/api/CustomerServiceData/pre-salesWeek' })
}

// 售前月数据
export const customerServiceDataPreSalesMonth = () => {
  return request.get({ url: '/api/CustomerServiceData/pre-salesMonth' })
}

// 售后周数据
export const customerServiceDataAfterSalesWeek = () => {
  return request.get({ url: '/api/CustomerServiceData/after-salesWeek' })
}

// 售后月数据
export const customerServiceDataAfterSalesMonth = () => {
  return request.get({ url: '/api/CustomerServiceData/after-salesMonth' })
}
