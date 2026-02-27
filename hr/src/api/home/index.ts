import request from '@/config/axios'

// 获取背景图
export const getWorkBenchImg = () => {
  return request.get({ url: '/api/config/getCode/WORK_BENCH_IMG' })
}

// 获取文字接口（第一行）
export const getFirstLine = () => {
  return request.get({ url: '/api/config/getCode/WORK_BENCH_TEXT_ONE' })
}

// 获取文字接口（第二行）
export const getSecondLine = () => {
  return request.get({ url: '/api/config/getCode/WORK_BENCH_TEXT_TWO' })
}
