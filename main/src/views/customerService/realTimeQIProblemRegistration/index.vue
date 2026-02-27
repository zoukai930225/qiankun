<template>
  <search-card v-loading="loading">
    <template #search>
      <real-time-q-i-search ref="searchRef" />
    </template>
    <template #list="listProps">
      <el-tabs v-model="activeValue" @tab-change="tabChange">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="我的" name="mine" />
      </el-tabs>
      <div class="qiList">
        <el-table
          class="SWCommonTable"
          :data="dataList"
          width="100%"
          v-horizontal-scroll="'always'"
          :row-class-name="rowClassName"
          :header-cell-style="appStore.headerCellStyle"
          :max-height="(listProps?.height || 500) - 90"
          :tooltip-options="{ popperClass: 'cust_width' }"
        >
          <el-table-column label="店铺" prop="storeName" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="row-center">
                <img
                  v-if="row.platFormId && getImageUrl(row.platFormId)"
                  style="width: 14px; height: 14px; margin-right: 8px"
                  :src="getImageUrl(row.platFormId)"
                  alt=""
                />
                <div
                  :style="{
                    width:
                      row.platFormId && getImageUrl(row.platFormId) ? 'calc(100% - 22px)' : '100%'
                  }"
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                >
                  {{ row.storeName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="问题风险程度"
            prop="problemRiskLevel"
            min-width="120"
            show-overflow-tooltip
          >
            <template #default="scope">
              <div class="row">
                <span
                  v-if="getRiskLabel(scope.row.problemRiskLevel)"
                  class="risk-tag"
                  :class="riskLevelClassMap[String(scope.row.problemRiskLevel ?? '')] || ''"
                >
                  {{ getRiskLabel(scope.row.problemRiskLevel) }}
                </span>
                <span v-else>-</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="旺旺名(客服)"
            prop="customerName"
            min-width="180"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'customerName', '-')"
          />
          <el-table-column
            label="所属分组"
            prop="groupName"
            min-width="180"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'groupName', '-')"
          />
          <el-table-column
            label="订单号"
            prop="orderNo"
            min-width="200"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'orderNo', '-')"
          />
          <el-table-column
            label="产品编码"
            min-width="200"
            prop="productId"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'productId', '-')"
          />
          <el-table-column
            label="客户ID"
            prop="customerId"
            min-width="200"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'customerId', '-')"
          />
          <el-table-column
            label="触犯舆情"
            prop="violating PublicOpinion"
            min-width="200"
            show-overflow-tooltip
            :formatter="
              (row: any) =>
                formatterLabel(
                  getIntDictOptions(DICT_TYPE.VIOLATING_PUBLIC_OPINION),
                  row.violatingPublicOpinion
                )
            "
          />
          <el-table-column
            label="客户问题描述"
            prop="problemRemark"
            min-width="200"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'problemRemark', '-')"
          />
          <el-table-column
            label="产生原因"
            prop="rootCause"
            min-width="120"
            show-overflow-tooltip
            :formatter="
              (row: any) => formatterLabel(getIntDictOptions(DICT_TYPE.ROOT_CAUSE), row.rootCause)
            "
          />
          <el-table-column
            label="具体原因"
            min-width="160"
            prop="specificReason"
            show-overflow-tooltip
            :formatter="
              (row: any) =>
                formatterLabel(getIntDictOptions(DICT_TYPE.SPECTIFIC_REASON), row.specificReason)
            "
          />
          <el-table-column
            label="登记人"
            prop="registrarName"
            min-width="100"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'registrarName', '-')"
          >
            <template #default="{ row }">
              <div class="user" v-if="row.registrar">
                <el-avatar
                  :src="row.registrationAvatarOrigin || DefaultAvatar"
                  :size="20"
                  class="ava"
                />
                <span>{{ row.registrarName }}</span>
              </div>
              <span v-else>{{ '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="质检时间"
            min-width="160"
            prop="inspectionTime"
            show-overflow-tooltip
            :formatter="(row: any) => formatTime(row.inspectionTime, 'yyyy-MM-dd HH:mm') || '-'"
          />
          <el-table-column
            label="期望完成时间"
            prop="expectHandleTime"
            min-width="160"
            show-overflow-tooltip
            :formatter="(row: any) => formatTime(row.expectHandleTime, 'yyyy-MM-dd HH:mm') || '-'"
          />
          <el-table-column
            label="客服当时方案"
            prop="customerPlanTimeService"
            min-width="150"
            show-overflow-tooltip
            :formatter="
              (row: any) =>
                formatterLabel(
                  getIntDictOptions(DICT_TYPE.CUSTOMER_PLAN_TIME_SERVICE),
                  row.customerPlanTimeService
                )
            "
          />
          <el-table-column
            label="客户当时反馈"
            prop="customerTimeFeedback"
            min-width="160"
            show-overflow-tooltip
            :formatter="
              (row: any) =>
                formatterLabel(
                  getIntDictOptions(DICT_TYPE.CUSTOMER_TIME_FEEDBACK),
                  row.customerTimeFeedback
                )
            "
          />
          <el-table-column
            label="客服当时处理"
            prop="customerTimeHandle"
            min-width="200"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'customerTimeHandle', '-')"
          />
          <el-table-column label="问题截图" prop="imagesUrls" min-width="100">
            <template #default="{ row }">
              <line-image :urls="row.imagesUrls"></line-image>
            </template>
          </el-table-column>
          <el-table-column
            label="问题对接人"
            prop="handlerName"
            min-width="100"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'handlerName', '-')"
          >
            <template #default="{ row }">
              <div class="user" v-if="row.handler">
                <el-avatar :src="row.handlerAvatarOrigin || DefaultAvatar" :size="20" class="ava" />
                <span>{{ row.handlerName }}</span>
              </div>
              <span v-else>{{ '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="反馈当日最终结果"
            prop="feedbackResult"
            min-width="200"
            show-overflow-tooltip
            :formatter="(row: any) => formatterValue(row, 'feedbackResult', '-')"
          />
          <el-table-column label="处理截图" prop="handleUrls" min-width="100px">
            <template #default="{ row }">
              <line-image :urls="row.handleUrls"></line-image>
            </template>
          </el-table-column>
          <el-table-column
            label="是否完结"
            prop="warehouseIssueComplete"
            min-width="100"
            show-overflow-tooltip
            :formatter="
              (row: any) =>
                row.warehouseIssueComplete !== null
                  ? formatterLabel(warehouseIssueCompleteOptions, row.warehouseIssueComplete)
                  : '-'
            "
          />
          <el-table-column
            label="完结时间"
            prop="completeTime"
            min-width="160"
            show-overflow-tooltip
            :formatter="(row: any) => formatTime(row.completeTime, 'yyyy-MM-dd HH:mm') || '-'"
          />
          <el-table-column label="操作" :width="activeValue === 'all' ? 100 : 150" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="isEditShow(row)"
                link
                type="primary"
                @click="detailsView(row, 'edit')"
                class="btn normal"
                >编辑</el-button
              >
              <el-button
                v-if="isHandleShow(row)"
                link
                type="primary"
                @click="detailsView(row, 'handle')"
                class="btn normal"
                >处理</el-button
              >
              <el-button link type="primary" @click="detailsView(row, 'view')" class="btn normal"
                >详情</el-button
              >
              <el-button type="danger" v-if="isDelShow(row)" @click="handleDel(row.id)" link>
                删除
              </el-button>
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
    </template>
  </search-card>
  <real-time-q-i-details ref="detailsRef" @refresh="getDataList" />
</template>

<script lang="ts">
export default { name: 'RealTimeQIProblemRegistration' }
</script>

<script lang="ts" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import { PageItem, DataItem, warehouseIssueCompleteOptions } from './components/type'
import RealTimeQIDetails from './components/details.vue'
import LineImage from '@/components/template/table/components/lineImage.vue'
import { getImageUrl, formatterValue, formatterLabel, formatTime } from '@/utils'
import { queryPermissionListByType } from '@/api/common'
import RealTimeQISearch from './components/search.vue'
import { getQIList, deleteQI } from '@/api/customerService/realTImeQIProblemRegistration'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import request from '@/config/axios';

const route = useRoute()

const message = useMessage() // 消息弹窗

const userStore = useUserStore()

// 当前登陆人 userId
const currentUserId = computed(() => userStore.user?.userNo)

const appStore = useAppStore()

const detailsRef = ref(),
  searchRef = ref(),
  permissionList = ref<Array<any>>([]),
  roleList = ref<Array<any>>([])

const riskOptions = getIntDictOptions(DICT_TYPE.PROBLEM_RISK_LEVEL, true) || []
const riskLevelClassMap: Record<string, string> = {}
const riskLevelLabelMap: Record<string, string> = {}
riskOptions.forEach((item: any) => {
  const value = item?.value
  const label = item?.label || ''
  if (value === undefined || value === null) return
  const key = String(value)
  riskLevelLabelMap[key] = label
  if (label.includes('低')) {
    riskLevelClassMap[key] = 'risk-low'
  } else if (label.includes('中')) {
    riskLevelClassMap[key] = 'risk-medium'
  } else if (label.includes('高')) {
    riskLevelClassMap[key] = 'risk-high'
  }
})

// 强制值-风险映射：1-高风险、2-中风险、3-低风险
riskLevelClassMap['1'] = 'risk-high'
riskLevelClassMap['2'] = 'risk-medium'
riskLevelClassMap['3'] = 'risk-low'

riskLevelLabelMap['1'] = '高风险'
riskLevelLabelMap['2'] = '中风险'
riskLevelLabelMap['3'] = '低风险'

const getRiskLabel = (riskValue: unknown) => {
  if (riskValue === undefined || riskValue === null || riskValue === '') return ''
  return riskLevelLabelMap[String(riskValue)] || ''
}

const rowClassName = () => ['commonTableRow'].join(' ')

const activeValue = ref<string>('mine'),
  dataList = ref<Array<DataItem>>([]),
  loading = ref<boolean>(false),
  page = ref<PageItem>({ ...new PageItem() })

const tabChange = () => {
  page.value = { ...new PageItem() }
  getDataList()
}

const getPermissionInfo = (call: Function) => {
  const user: any = (userStore.user as any)?.permissionIds || []
  queryPermissionListByType('客服').then((res: any) => {
    if (res?.length) {
      roleList.value = res
      permissionList.value = res.filter((rs: any) => user.includes(rs.id))
      call()
    }
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

const resolveSingleQueryValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }
  return typeof value === 'string' ? value : ''
}

const normalizeSelectClass = (value: unknown): '1' | '2' | '' => {
  const str = resolveSingleQueryValue(value)
  return str === '1' || str === '2' ? str : ''
}

const initFiltersFromRoute = async () => {
  const selectClass = normalizeSelectClass(route.query?.selectClass)
  if (selectClass === '1') {
    activeValue.value = 'all'
  } else if (selectClass === '2') {
    activeValue.value = 'mine'
  }

  await nextTick()

  const mergedQuery: Record<string, any> = { ...route.query }
  if (selectClass) {
    mergedQuery.selectClass = selectClass
  }

  if (searchRef.value?.applyRouteQuery) {
    await searchRef.value.applyRouteQuery(mergedQuery)
  }
}

const resolveRouteId = (): string => {
  const id = route.query?.id
  return resolveSingleQueryValue(id)
}

const getDataList = (id: string = '',ids?:string ) => {
  let params: any = {
    ...searchRef?.value?.queryParams,
    selectClass: activeValue.value === 'all' ? '1' : '2',
    ...page.value,
    id,
    ids
  }
  delete params['registrationIds']
  delete params['handleIds']
  loading.value = true
  getQIList({ ...params })
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

// 删除
const handleDel = async (id: string) => {
  try {
    // 删除的二次确认
    await message.confirm('是否确定删除？')
    // 发起删除
    await deleteQI({ id }).catch((err) => {
      console.log(err)
    })
    message.success('删除成功')
    // 刷新列表
    await getDataList()
  } catch {}
}

const isEditShow = (row: any) => {
  //不可编辑: tab栏为我的 || 当前状态为完成状态 || 非当前登录者创建
  if (activeValue.value === 'all' || row.isHandle === 1 || row.createdId !== currentUserId.value)
    return false
  return true
}

const isDelShow = (row: any) => {
  //不可删除: tab栏为我的 || 非当前登录者创建
  if (activeValue.value === 'all' || row.createdId !== currentUserId.value) return false
  return true
}

const isHandleShow = (row: any) => {
  //不可处理: 当前状态为完成状态 || tab栏为全部
  if (activeValue.value === 'all' || Number(row.warehouseIssueComplete) === 1 || row.handler !== currentUserId.value)
    return false
  return true
}

onMounted(() => {
  getPermissionInfo(async () => {
    await nextTick()
    await initFiltersFromRoute()
    const targetId = resolveRouteId()
    const ids = route.query?.ids as string | undefined
    if(ids){
      await getDataList('',ids)
    }else if (targetId) {
      await getDataList(targetId)
    } else {
      await getDataList()
    }
  })
})

if (route.query?.id || route.query?.ids) {
  const newUrl = window.location.href.replace(/\?.*$/, '')
  history.replaceState({}, '', newUrl)
}

const detailsView = (item: any, type: string) => {
  detailsRef?.value?.open(item, type)
}

provide('realtimeqi_handle', { permissionList, roleList, activeValue, detailsView, getDataList, })
</script>

<style lang="scss" scoped>
.qiList {
  height: calc(100vh - 328px);
}

:deep(.el-popper.cust_width) {
  max-width: 600px;
}

.pagination {
  margin-top: 10px;
  text-align: right;
  width: 100%;
  height: 35px;
  position: relative;
}

.user {
  display: flex;
  align-items: center;

  .ava {
    margin-right: 6px;
  }

  span {
    color: #333;
  }
}

:deep(.risk-low td) {
  background-color: #d6ebd6 !important;
}

:deep(.risk-medium td) {
  background-color: rgba(219, 106, 15, 0.1) !important;
}

:deep(.risk-high td) {
  background-color: rgba(235, 55, 55, 0.1) !important;
}

.risk-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 16px;
  border-radius: 158px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.risk-tag.risk-low {
  background-color: #d6ebd6;
  color: #349b34;
}

.risk-tag.risk-medium {
  background-color: rgba(219, 106, 15, 0.1);
  color: #db6a0f;
}

.risk-tag.risk-high {
  background-color: rgba(235, 55, 55, 0.1);
  color: #eb3737;
}
</style>
