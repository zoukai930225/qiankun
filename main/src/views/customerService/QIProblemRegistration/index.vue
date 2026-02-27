<template>
  <ContentWrap>
    <seacher-form ref="searchRef" />
    <!-- <div class="wapper">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="mb-0px"
            label-width="80px"
          >
            <el-row :gutter="15">
              <el-col :span="5">
                <el-form-item label="质检类型" prop="qualityInspectionType">
                  <el-select
                    v-model="queryParams.qualityInspectionType"
                    placeholder="请选择质检类型"
                    filterable
                    clearable
                    multiple
                     collapse-tags
                    class="!w240px"
                  >
                    <el-option
                      v-for="item in getIntDictOptions(
                        DICT_TYPE.QUALITY_INSPECTION_TYPE,
                        true
                      )"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="问题风险程度" prop="problemRiskLevel" class="textWapper">
                  <el-select
                    class="!w240px"
                    v-model="queryParams.problemRiskLevel"
                    placeholder="请选择风险程度"
                    multiple
                    collapse-tags
                    clearable
                  >
                    <el-option
                      v-for="item in getIntDictOptions(
                        DICT_TYPE.PROBLEM_RISK_LEVEL,
                        true
                      )"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="店铺" prop="store">
                  <StoreSelect v-model="queryParams.store"  class="!w240px"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="订单号" prop="orderNo">
                  <el-input v-model="queryParams.orderNo"  placeholder="请输入订单号" class="!w240px" />
                </el-form-item>
              </el-col>
              <el-col :span="4" class="w-100%">
                <div class="action-wapper">

                    <el-button @click="handleQuery">
                      <Icon  icon="ep:search"  />
                      搜索
                    </el-button>
                    <el-button @click="resetQuery" class="ml-0">
                      重置
                    </el-button>
                    <el-button @click="addBtnClick">新增</el-button>
                    <div class="expand-button" @click="handleExpandClick">
                      <span class="expand-text">
                        {{isExpand ? '收起' :'展开'}}
                      </span>
                      <Icon
                        class="expand-icon"
                        :icon="isExpand ? 'ep:arrow-up' : 'ep:arrow-down'"
                        :size="12"
                      />
                    </div>
                  </div>
              </el-col>
            </el-row>
             <el-row :gutter="15" v-show="isExpand">
              <el-col :span="5">
                <el-form-item label="旺旺名(客服)" prop="customerName" class="textWapper">
                    <el-input v-model="queryParams.customerName"  placeholder="请输入旺旺名(客服)" class="!w240px" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item  label="登记人" prop="registrationId">
                   <SelectUser  v-model="queryParams.registrationId" :role="getRole('质检人员')"  :multiple="false" class="!w240px"  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item  label="问题对接人" prop="handleId" class="textWapper">
                   <SelectUser  v-model="queryParams.handleId" :multiple="false" :role="getRole('质检问题处理人')" class="!w240px"  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="登记日期">

                  <el-date-picker
                    v-model="registerTimeRange"
                    type="daterange"
                    class="!w220px"
                     valueFormat="YYYY-MM-DD"
                      format = "YYYY-MM-DD"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="处理日期">

                  <el-date-picker
                    v-model="handleTimeRange"
                    type="daterange"
                     class="!w220px"
                     valueFormat="YYYY-MM-DD"
                      format = "YYYY-MM-DD"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    clearable
                  />
                </el-form-item>
              </el-col>
             </el-row>
          </el-form>
        </div> -->
    <el-tabs v-model="tabsVal" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="全部" name="1">
        <div></div>
      </el-tab-pane>
      <el-tab-pane label="我的" name="2">
        <div></div>
      </el-tab-pane>
    </el-tabs>

    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      :row-class-name="rowClassName"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      :tooltip-options="{ popperClass: 'cust_width' }"
    >
      <el-table-column
        label="质检类型"
        prop="qualityInspectionType"
        min-width="120"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div class="row">
            {{
              getIntDictOptions(DICT_TYPE.QUALITY_INSPECTION_TYPE, true).find(
                (x) => x.value === scope.row.qualityInspectionType
              )?.label || '-'
            }}
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
      <el-table-column label="店铺" prop="storeName" min-width="120" show-overflow-tooltip>
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
                width: row.platFormId && getImageUrl(row.platFormId) ? 'calc(100% - 22px)' : '100%'
              }"
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
            >
              {{ row.storeName }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNo" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <div class="row">
            {{ scope.row.orderNo || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户ID" prop="customerId" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <div class="row">
            {{ scope.row.customerId || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="旺旺名(客服)"
        prop="customerName"
        min-width="180"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div class="row">
            {{ scope.row.customerName || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属分组" prop="groupName" min-width="180" show-overflow-tooltip>
        <template #default="scope">
          <div class="row">
            {{ scope.row.groupName || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="具体问题描述"
        prop="problemRemark"
        min-width="180"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div class="row">
            {{ scope.row.problemRemark || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="改善建议" prop="improveSugges" min-width="180" show-overflow-tooltip>
        <template #default="scope">
          <div class="row">
            {{ scope.row.improveSugges || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="问题截图" prop="imagesUrls" min-width="120" show-overflow-tooltip>
        <template #default="{ row }">
          <line-image :urls="row.imagesUrls"></line-image>
        </template>
      </el-table-column>
      <el-table-column label="登记人" prop="registrarName" min-width="120" show-overflow-tooltip>
        <template #default="scope">
          <div class="row">
            <LineAvatar
              :user="{ image: scope.row.registrationAvatarOrigin, name: scope.row.registrarName }"
              image="image"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="登记日期"
        prop="registrationTime"
        min-width="120"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div class="row">
            {{ scope.row.registrationTime || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="期望处理日期"
        prop="expectHandleTime"
        min-width="120"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div class="row">
            {{ scope.row.expectHandleTime || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="问题对接人" prop="handlerName" min-width="120" show-overflow-tooltip>
        <template #default="scope">
          <div class="row">
            <LineAvatar
              :user="{ image: scope.row.handlerAvatarOrigin, name: scope.row.handlerName }"
              image="image"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="问题是否完成闭环"
        prop="warehouseIssueComplete"
        min-width="120"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div class="row">
            {{
              scope.row.warehouseIssueComplete === 0
                ? '未完成'
                : scope.row.warehouseIssueComplete === 1
                  ? '已完成'
                  : '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="处理日期" prop="handleTime" min-width="120" show-overflow-tooltip>
        <template #default="scope">
          <div class="row">
            {{ scope.row.handleTime || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="具体跟进情况"
        prop="followUpStatus"
        min-width="180"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div class="row">
            {{ scope.row.followUpStatus || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="处理截图" prop="handleUrls" min-width="120" show-overflow-tooltip>
        <template #default="{ row }">
          <line-image :urls="row.handleUrls"></line-image>
        </template>
      </el-table-column>

      <el-table-column
        label="操作按钮"
        :show-overflow-tooltip="false"
        fixed="right"
        :width="tabsVal === '2' ? 200 : 100"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            @click="openForm('edit', row.id)"
            link
            v-if="isCreater && tabsVal === '2' && row.isHandle === 0"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            @click="openForm('handle', row.id)"
            link
            v-if="ishandler && tabsVal === '2' && Number(row.warehouseIssueComplete) === 0"
          >
            处理
          </el-button>
          <el-button type="primary" @click="openForm('detail', row.id)" link> 详情 </el-button>
          <el-button
            type="danger"
            @click="handleDelete(row.id)"
            link
            v-if="isCreater && tabsVal === '2'"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <Pagination
        :total="page.total"
        v-model:page="page.page"
        v-model:limit="page.size"
        @pagination="getList()"
      />
    </div>
  </ContentWrap>
  <detail-drawer
    :key="refresh"
    ref="formRef"
    @success="getList"
    @handleRefresh="handleRefresh"
    :role="getRole('质检问题处理人')"
  />
</template>

<script lang="ts" setup>
// defineOptions({ name: 'QIProblemRegistration' })
import { useAppStore } from '@/store/modules/app'
import { getIntDictOptions } from '@/utils/dict'
import * as QIProblemRegistrationApi from '@/api/customerService/QIProblemRegistration'
import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import DetailDrawer from './components/detailDrawer.vue'
import { DICT_TYPE } from '@/utils/dict'
import { useRole } from '@/hooks/common/useRole'
import LineImage from '@/components/template/table/components/lineImage.vue'
import seacherForm from './components/seacher.vue'
import { PageItem } from './components/Type'
import { getImageUrl } from '@/utils'
import request from '@/config/axios'
const appStore = useAppStore()

const { permissionList, roleList, getPermissionInfo, getRole, grabCheck } = useRole('客服')

const refresh = ref(0)
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const page = ref<PageItem>({ ...new PageItem() })

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  qualityInspectionType: '',
  problemRiskLevel: '',
  store: '',
  orderNo: '',
  customerName: '',
  registrationId: '',
  handleId: '',
  registerTimeBegin: '',
  registerTimeEnd: '',
  handleTimeBegin: '',
  handleTimeEnd: '',
  page: 1,
  size: 10,
  selectClass: '1'
})
const isCreater = computed(() =>
  permissionList.value
    .map((ps: any) => ps.name)
    .join(',')
    .includes('质检人员')
)
const ishandler = computed(() =>
  permissionList.value
    .map((ps: any) => ps.name)
    .join(',')
    .includes('质检问题处理人')
)
const route = useRoute()

const tabsVal = ref('2')

const registerTimeRange = ref([])
const handleTimeRange = ref([])

const searchRef = ref()

// 客服人员分组配置列表
const customerConfigList = ref([])
const getCusList = async () => {
  request.get({ url: '/api/personnelGroup/getGroup' }).then((res: any) => {
    customerConfigList.value = res.map((rs: any) => ({
      ...rs,
      label: rs.customerName,
      value: rs.customerName
    }))
  })
}

const riskOptions = getIntDictOptions(DICT_TYPE.PROBLEM_RISK_LEVEL, true) || []
const riskLevelClassMap: Record<string, string> = {}
const riskLevelLabelMap: Record<string, string> = {}

const defaultClassMap: Record<string, string> = {
  '1': 'risk-high',
  '2': 'risk-medium',
  '3': 'risk-low'
}

const defaultLabelMap: Record<string, string> = {
  '1': '高风险',
  '2': '中风险',
  '3': '低风险'
}

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
  } else if (defaultClassMap[key]) {
    riskLevelClassMap[key] = defaultClassMap[key]
  }
})

Object.entries(defaultClassMap).forEach(([key, value]) => {
  riskLevelClassMap[key] = value
})

Object.entries(defaultLabelMap).forEach(([key, value]) => {
  riskLevelLabelMap[key] = value
})

const getRiskLabel = (riskValue: unknown) => {
  if (riskValue === undefined || riskValue === null || riskValue === '') return ''
  return riskLevelLabelMap[String(riskValue)] || ''
}

const rowClassName = ({ row }: { row: any }) => {
  // const riskClass = getRiskClass(row.problemRiskLevel)
  // return ['commonTableRow', riskClass].filter(Boolean).join(' ')
  return ['commonTableRow'].join(' ')
}

watchEffect(() => {
  if (registerTimeRange.value && registerTimeRange.value.length === 2) {
    queryParams.value.registerTimeBegin = registerTimeRange.value[0]
    queryParams.value.registerTimeEnd = registerTimeRange.value[1]
  } else {
    queryParams.value.registerTimeBegin = ''
    queryParams.value.registerTimeEnd = ''
  }
})
watchEffect(() => {
  if (handleTimeRange.value && handleTimeRange.value.length === 2) {
    queryParams.value.handleTimeBegin = handleTimeRange.value[0]
    queryParams.value.handleTimeEnd = handleTimeRange.value[1]
  } else {
    queryParams.value.handleTimeBegin = ''
    queryParams.value.handleTimeEnd = ''
  }
})

const isExpand = ref(false)

const tabsInit = () => {
  tabsVal.value = '2'
}
const handleClick = (tab) => {
  const { props } = tab
  searchRef?.value?.tabsClick(props.name)
  handleQuery()
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
  if (selectClass) {
    tabsVal.value = selectClass
  }

  await nextTick()

  searchRef.value?.tabsClick?.(tabsVal.value)

  const mergedQuery: Record<string, any> = { ...route.query }
  if (selectClass) {
    mergedQuery.selectClass = selectClass
  }
  console.log(mergedQuery)
  searchRef.value?.applyRouteQuery?.(mergedQuery)
}

const resolveRouteId = (): string => {
  const id = route.query?.id
  return resolveSingleQueryValue(id)
}

// 新增按钮点击
const handleAdd = (value) => {
  openForm('add', '')
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  handleRefresh(true)
  nextTick(() => {
    if (formRef.value) {
      formRef.value.open(type, id)
    }
  })
}

/** 搜索按钮操作 */
const handleQuery = () => {
  page.value.page = 1
  getList()
}

const handleRefresh = (val) => {
  refresh.value++
}

/** 查询列表 */
const getList = async (id = '',ids?:string) => {
  loading.value = true
  try {
    const { qualityInspectionType, handleId, registrationId, ...formParam } =
      searchRef?.value?.queryParams
    formParam.qualityInspectionType = qualityInspectionType.join(',')
    console.log('res', registrationId, handleId)
    formParam.registrationId = Array.isArray(registrationId) ? registrationId.join(',') : ''
    formParam.handleId = Array.isArray(handleId) ? handleId.join(',') : ''
    const reuqetParam = { ...formParam, ...page.value, id,ids }
    const data = await QIProblemRegistrationApi.pageList(reuqetParam)
    // 给每一项添加一个showPassword属性
    list.value = (data.records || []).map((item) => {
      return {
        ...item
      }
    })
    page.value = { ...new PageItem(data) }
  } finally {
    loading.value = false
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await QIProblemRegistrationApi.deleteById({ id })
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getPermissionInfo(async () => {
    await nextTick()
    await initFiltersFromRoute()
    const targetId = resolveRouteId()
    const ids = route.query?.ids as string | undefined
    if (ids) {
      await getList('',ids)
    } else if(targetId) {
      await getList(targetId)
    }else{
      await getList()
    }
  })
  if (route.query?.id || route.query?.ids) {
    const newUrl = window.location.href.replace(/\?.*$/, '')
    history.replaceState({}, '', newUrl)
  }
})
provide('QIProblemRegistration', {
  permissionList,
  roleList,
  getList,
  isCreater,
  ishandler,
  handleAdd,
  tabsInit,
})
</script>

<style lang="scss" scoped>
:deep(.el-popper.cust_width) {
  max-width: 600px;
}

.textWapper {
  :deep(.el-form-item__label) {
    line-height: 16px !important;
    text-align: right;
  }
}
.test-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  width: 100%;
  height: 100%;
  // padding: 11px;
  box-sizing: border-box;
  // background-color: #f2f6fc;
  background-color: #fff;
}
.header-wrapper {
  background-color: #fff;
  padding: 16px 20px;
  box-sizing: border-box;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  &-title {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #333;
    margin: 0 0 16px 0;
  }
}
.select-wapper {
  width: 100%;
}
.custom-left-select {
  width: 110px;
  :deep(.el-select__wrapper) {
    border: 1px solid #dcdfe6;
    border-right: none !important;
    box-shadow: none !important;
    border-radius: 0px 0px 0px 0px;
    background-color: #e5e5e5;
  }
}
.custom-right-select {
  width: 200px;
  :deep(.el-select__wrapper) {
    border-radius: 0px 4px 4px 0px;
  }
}
.el-date-picker {
  width: 400px;
}
.user {
  display: flex;
  align-items: center;
  .ava {
    margin-right: 10px;
  }
}
.action-wapper {
  width: calc(100% + 40px);
  height: 30px;
  margin-left: -40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-button + .el-button {
    margin-left: 0px !important;
  }
}
.expand-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #0064ff;
  font-size: 14px;
  transition: color 0.3s;
  white-space: nowrap;

  &:hover {
    // 换个颜色
    color: #0064ff;
  }

  .expand-text {
    user-select: none;
  }

  .expand-icon {
    margin-left: 4px;
    transition: transform 0.3s ease;
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
