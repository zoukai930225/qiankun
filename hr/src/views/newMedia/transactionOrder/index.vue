<template>
  <search-card v-loading="loading">
    <template #search>
      <transaction-search ref="searchRef" />
    </template>
    <template #list="listProps">
      <el-tabs v-model="activeValue" @tab-change="tabChange">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="我的" name="mine" />
      </el-tabs>
      <div class="orderList">
        <el-table
          class="SWCommonTable"
          :data="dataList"
          width="100%"
          v-horizontal-scroll="'always'"
          row-class-name="commonTableRow"
          :header-cell-style="appStore.headerCellStyle"
          :max-height="(listProps?.height || 500) - 90"
        >
          <el-table-column
            label="商品"
            prop="goodsId"
            min-width="247px"
            show-overflow-tooltip
            fixed="left"
          >
            <template #default="{ row }">
              <good-info :row="row" />
            </template>
          </el-table-column>
          <el-table-column
            label="类目"
            prop="categoryName"
            min-width="200px"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'categoryName', '-')"
          />
          <el-table-column
            label="下单SKU"
            prop="orderSku"
            min-width="210px"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'orderSku', '-')"
          />
          <el-table-column
            label="店铺"
            prop="storeName"
            min-width="220px"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'storeName', '-')"
          />
          <el-table-column
            label="主卖点"
            prop="salePoint"
            min-width="210px"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'salePoint', '-')"
          />
          <el-table-column
            label="补单日期"
            min-width="120px"
            prop="expectedDate"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'expectedDate', '-')"
          />
          <el-table-column
            label="填报人"
            prop="createdName"
            min-width="100px"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'createdName', '-')"
          />
          <el-table-column
            label="填报日期"
            min-width="120px"
            prop="createdAt"
            show-overflow-tooltip
            :formatter="(row: any) => timeShow(row.createdAt)"
          />
          <el-table-column
            label="内容排期"
            min-width="120px"
            prop="contentExpectedDate"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'contentExpectedDate', '-')"
          />
          <el-table-column
            label="评论人"
            prop="commentCreatedName"
            min-width="100px"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'commentCreatedName', '-')"
          />
          <el-table-column
            label="刷单日期"
            min-width="120px"
            prop="orderExpectedDate"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'orderExpectedDate', '-')"
          />
          <el-table-column
            label="中台人员"
            prop="middlegroundCreatedName"
            min-width="100px"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'middlegroundCreatedName', '-')"
          />
          <el-table-column label="状态" prop="status" min-width="95px" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tag
                :style="{
                  color: formatterLabel(statusOptions, row.status, 'txt'),
                  borderColor: 'transparent'
                }"
                round
                :color="formatterLabel(statusOptions, row.status, 'color')"
              >
                {{ formatterLabel(statusOptions, row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" :width="110" fixed="right" align="center">
            <template #default="{ row }">
              <!-- v-if="isEditShow(row)" -->
              <el-button
                v-if="isEditShow(row)"
                link
                type="primary"
                @click="detailsView(row, 'edit')"
                class="btn normal"
                >编辑</el-button
              >
              <el-button link type="primary" @click="detailsView(row, 'view')" class="btn normal"
                >详情</el-button
              >
              <el-button
                v-if="
                  activeValue === 'all' &&
                  ((grabCheck('评论') && row.status === 10) ||
                    (grabCheck('中台') && row.status === 20))
                "
                link
                type="primary"
                @click="detailsView(row, `grab_${row.status}`)"
                class="btn normal"
                >抢单</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            style="position: absolute; right: 0"
            v-model:current-page="page.page"
            v-model:page-size="page.size"
            :page-sizes="[10, 20, 25, 30, 50, 100]"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <transaction-order-details ref="detailsRef" @refresh="getDataList" />
    </template>
  </search-card>
</template>

<script lang="ts">
export default { name: 'TransactionOrder' }
</script>

<script lang="ts" setup>
import { PageItem, DataItem, statusOptions } from './components/type'
import TransactionOrderDetails from './components/details.vue'
import GoodInfo from '@/components/common/goods/goodInfo.vue'
import { formatterValue, formatterLabel } from '@/utils'
import { queryPermissionListByType } from '@/api/common'
import TransactionSearch from './components/search.vue'
import { getDetailList } from '@/api/transactionOrder'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

const userStore = useUserStore()

const appStore = useAppStore()

const detailsRef = ref(),
  searchRef = ref(),
  permissionList = ref<Array<any>>([]),
  roleList = ref<Array<any>>([])

const activeValue = ref<string>('all'),
  dataList = ref<Array<DataItem>>([]),
  loading = ref<boolean>(false),
  page = ref<PageItem>({ ...new PageItem() })

const grabCheck = (role: string) => {
  const permissionStr: string = permissionList.value.map((ps: any) => ps.name).join(',')
  return permissionStr.includes(role)
}

const isEditShow = (row: any) => {
  const user: any = (userStore.user as any)?.id || ''
  let success: boolean = false
  if (activeValue.value === 'mine') {
    if (row.status === 10 && grabCheck('运营')) {
      success = true
    } else if (
      grabCheck('评论') &&
      (!row.commentIsCommit || row.contentStatus !== 1) &&
      row.commentCreatedId === user
    ) {
      success = true
    } else if (
      grabCheck('中台') &&
      row.middlegroundCreatedId === user &&
      (!row.middlegroundIsCommit || !String(row?.commentStatus || '').includes('2'))
    ) {
      success = true
    }
  }
  return success
}

const timeShow = (time: any) => {
  return time ? dayjs(time).format('YYYY-MM-DD') : '-'
}

const tabChange = () => {
  page.value = { ...new PageItem() }
  getDataList()
}

const getDataList = () => {
  let params: any = cloneDeep({
    ...searchRef?.value?.queryParams,
    self: activeValue.value !== 'all',
    ...page.value
  })
  delete params.dateTime
  delete params.commentCreated
  delete params.middlegroundCreated
  delete params.created
  delete params.stores
  loading.value = true
  getDetailList({ ...params })
    .then((res: any) => {
      if (res) {
        dataList.value = res?.records || []
        page.value = { ...new PageItem(res) }
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const handleSizeChange = (size: number) => {
  page.value = {
    ...page.value,
    page: page.value.page * size > page.value.total ? 1 : page.value.page,
    size
  }
  getDataList()
}

const handleCurrentChange = (current: number) => {
  page.value = { ...page.value, page: current }
  getDataList()
}

const getPermissionInfo = (call: Function) => {
  const user: any = (userStore.user as any)?.permissionIds || []
  queryPermissionListByType('新媒体').then((res: any) => {
    if (res?.length) {
      roleList.value = res
      permissionList.value = res.filter((rs: any) => user.includes(rs.id))
      call()
    }
  })
}

onMounted(() => {
  getPermissionInfo(() => {
    getDataList()
  })
})

const detailsView = (item: any, type: string) => {
  detailsRef?.value?.open(item, type)
}

provide('transaction_order_handle', {
  permissionList,
  roleList,
  activeValue,
  detailsView,
  getDataList
})
</script>
<style lang="scss" scoped>
.orderList {
  height: calc(100vh - 328px);
}

.pagination {
  margin-top: 10px;
  text-align: right;
  width: 100%;
  height: 35px;
  position: relative;
}
</style>
