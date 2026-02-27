<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-29 13:12:19
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2025-12-29 17:29:03
-->
<template>
  <ex-screen>
    <query-scheme
      :scheme="scheme"
      v-model="searchData"
      name="Inventorytuning"
      :show-expand="false"
    />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="Inventorytuning"
      :column="column"
      :table-data="dataList"
      :list-name="'库存调优列表'"
    />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Inventorytuning' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import { usePage, SearchItem } from './config'
import request from '@/config/axios'

const {
  dataList,
  page,
  loading,
  scheme,
  btns,
  searchData,
  column,
  screen,
  stateInfo,
  statistics,
  handleColumn,
  setRouterInfo
} = usePage({})

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage
    ? { ...searchData.value }
    : { ...searchData.value, pageNum: page.value.page, pageSize: page.value.size }
}

// 查询
const onSearch = async () => {
  const params: any = setParamsData()
  loading.value = true
  const res = await request.get({ url: `/api/stageBacklog/queryWarning`, params: params })
  dataList.value = res.records
  page.value = { ...page.value, total: res.total }
  loading.value = false
}

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  onSearch()
}

// 按钮回调
const onButtonClick = (_btn: BtnItem) => {
  // 处理自定义按钮逻辑（导出功能由模板自动处理）
  if (_btn.fun === 'refresh') {
    onSearch()
  }
}

onMounted(() => {
  dataList.value = []
  onSearch()
})

setRouterInfo()

provide('InventorytuningForm', {
  searchData,
  dataList,
  page,
  loading,
  stateInfo,
  statistics,
  setParamsData,
  resetForm,
  onSearch,
  onButtonClick
})
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
