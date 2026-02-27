<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="88px"
          @submit.prevent
        >
          <el-form-item label="日期" prop="timeRange">
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD HH:mm:ss"
              clearable
              @change="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="executeStatus">
            <el-select
              class="searchFormItemWidth"
              style="width: 200px"
              v-model="queryParams.executeStatus"
              placeholder="请选择"
              clearable
              value-on-clear=""
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.RPA_TRIGGER_STATUS, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应用类型" prop="appTypeName" label-width="110px">
            <el-select
              class="dialogFormItemWidth"
              v-model="queryParams.appTypeName"
              placeholder="请选择"
              clearable
              filterable
              style="width: 200px"
              value-on-clear=""
              @change="handleQuery"
            >
              <el-option
                v-for="dict in rpaDashboardData.typeList"
                :key="dict.id"
                :label="dict.typeName"
                :value="dict.typeName"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-show="isExpand" label="店铺" prop="storeName">
            <el-select
              class="dialogFormItemWidth"
              v-model="queryParams.storeName"
              placeholder="请选择"
              clearable
              filterable
              value-on-clear=""
              style="width: 200px"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in storeList"
                :key="dict.id"
                :label="dict.name"
                :value="dict.name"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-show="isExpand" label="节点" prop="nodeId">
            <el-select
              class="dialogFormItemWidth"
              style="width: 200px"
              v-model="queryParams.nodeId"
              placeholder="请选择"
              clearable
              filterable
              value-on-clear=""
              @change="handleQuery"
            >
              <el-option
                v-for="dict in nodeList"
                :key="dict.id"
                :label="dict.loginUserName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="执行类型" prop="executeType" label-width="110px" v-show="isExpand">
            <el-select
              v-model="queryParams.executeType"
              placeholder="请选择"
              clearable
              value-on-clear=""
              style="width: 200px"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.RPA_UNIFIED_TYPE, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="isExpand" label="负责人" prop="rpaPersonInCharge">
            <el-select
              v-model="queryParams.rpaPersonInCharge"
              placeholder="请选择"
              clearable
              filterable
              style="width: 210px"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in rpaDashboardData.resUserList"
                :key="dict.id"
                :label="dict.realName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>

          <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
        </div>
      </div>
    </div>
  </ContentWrap>

  <ContentWrap>
    <s-table
      ref="tableRef"
      :columns="columns"
      :fetch="loadTableData"
      :fetch-params="queryParams"
      :pagination-map="{ pageNum: 'page', pageSize: 'size' }"
    >
      <template #appTypeName="{ row }">
        <el-tooltip placement="top">
          {{ row.appTypeName || '--' }}
          <template #content>
            {{ row.appTypeCode || '--' }}
          </template>
        </el-tooltip>
      </template>

      <template #storeName="{ row }">
        <el-tooltip placement="top">
          {{ row.storeName || '--' }}
          <template #content>
            {{ row.storeCode || '--' }}
          </template>
        </el-tooltip>
      </template>

      <template #executeType="{ row }">
        {{ getDictLabel(DICT_TYPE.RPA_UNIFIED_TYPE, row.executeType) || '--' }}
      </template>

      <template #triggerTime="{ row }">
        {{ row.triggerTime ? dayjs(row.triggerTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}
      </template>

      <template #nodeId="{ row }">
        {{ getNodeLoginUserName(row.nodeId) }}
      </template>

      <template #executeStatus="{ row }">
        {{ getDictLabel(DICT_TYPE.RPA_TRIGGER_STATUS, row.executeStatus) || '--' }}
      </template>

      <template #rpaPersonInCharge="{ row }">
        {{ getUserRealName(row.rpaPersonInCharge) || '--' }}
      </template>

      <template #action="{ row }">
        <el-button type="primary" @click="openInterfaceInfo(row)" link> 详情 </el-button>
        <el-button type="primary" @click="startReRun(row)" link> 重跑 </el-button>
      </template>
    </s-table>
  </ContentWrap>

  <InterfaceInfo ref="interfaceInfoRef" />
</template>

<script lang="ts" setup>
import { TableColumn } from './table' // 引入 STable 相关的类型定义
import * as DashboardApi from '@/api/dashboard'
import * as rpaApi from '@/api/rpaManage'
import * as NodeManageAccountApi from '@/api/rpaManage/nodeManage'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
import { onMounted, ref, reactive } from 'vue'
import InterfaceInfo from './InterfaceInfoRecord.vue'
import { useRpaDashboardStore } from '@/store/modules/rpaDashboard'

const now = new Date()
const startOfDay = formatDate(
  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
  'YYYY-MM-DD HH:mm:ss'
)
const endOfDay = formatDate(
  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
  'YYYY-MM-DD HH:mm:ss'
)

const rpaDashboardData = useRpaDashboardStore()
const timeRange = ref([startOfDay, endOfDay])
const isExpand = ref(false)
const message = useMessage()
const tableRef = ref() // STable 实例

// 查询参数 (移除 page 和 size，由 STable 内部接管，但保留在这里作为外部过滤条件容器)
const queryParams = ref({
  appTypeName: '',
  storeName: '',
  executeType: '',
  executeStatus: '',
  rpaPersonInCharge: '',
  nodeId: ''
})

// === 表格列配置 ===
const columns: TableColumn[] = [
  { prop: 'appTypeName', label: '应用类型名称', minWidth: 220, showOverflowTooltip: false }, // 使用插槽
  { prop: 'storeName', label: '店铺名称', minWidth: 220, showOverflowTooltip: false }, // 使用插槽
  { prop: 'executeType', label: '执行类型' }, // 使用插槽
  { prop: 'triggerTime', label: '触发时间', minWidth: 180 }, // 使用插槽
  { prop: 'nodeId', label: '执行节点', minWidth: 180 }, // 使用插槽
  { prop: 'triggerLog', label: 'API调用日志', minWidth: 180 },
  { prop: 'executeStatus', label: '状态', minWidth: 90 }, // 使用插槽
  { prop: 'rpaPersonInCharge', label: '负责人' }, // 使用插槽
  { prop: 'executeUserName', label: '执行人' },
  { prop: 'duration', label: '运行时长' },
  { prop: 'startTime', label: '执行开始时间', minWidth: 160 },
  { prop: 'endTime', label: '执行结束时间', minWidth: 160 },
  { prop: 'action', label: '操作', width: 120, align: 'center', fixed: 'right' } // 使用插槽
]

// === 数据获取方法 (适配 STable) ===
// params 参数包含了分页信息 (page, size) 和 fetchParams (queryParams) 的合并结果
const loadTableData = async (params: any) => {
  // 处理时间区间
  if (timeRange.value && timeRange.value.length > 0) {
    params.triggerStartTime = timeRange.value[0]
    params.triggerEndTime = timeRange.value[1]
  }

  // 调用 API
  // 注意：STable 会自动处理 loading 状态，不需要手动维护 loading 变量
  return await DashboardApi.getExecuteRecordList(params)
}

// === 搜索与重置 ===
const queryFormRef = ref()

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  timeRange.value = [startOfDay, endOfDay]
  handleQuery()
}

const handleQuery = () => {
  // 调用 STable 的刷新方法，true 表示重置页码到第一页
  tableRef.value?.refresh(true)
}

// === 辅助函数保持不变 ===
// 获取用户真实姓名
const getUserRealName = (superintendents: string) => {
  if (!superintendents) return '--'
  const superintendentArray = superintendents.split(',')
  return superintendentArray
    .map((superintendent) => {
      const user = rpaDashboardData.resUserList.find((item) => item.id === superintendent.trim())
      return user ? user.realName : superintendent
    })
    .join(',')
}

// 详情弹窗
const interfaceInfoRef = ref()
const openInterfaceInfo = (item: any) => {
  if (interfaceInfoRef.value) {
    interfaceInfoRef.value.open(item.id, nodeList.value)
  }
}

/** 开始重跑 */
const startReRun = async (data: any) => {
  let {
    appTypeCode,
    appTypeId,
    storeCode,
    yingdaoParams,
    storeName,
    nodeId,
    appTypeName,
    typeCategory,
    appId
  } = data

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  try {
    await ElMessageBox.confirm('是否确定执行重跑？', '系统提醒', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning'
    })

    let postData = {
      typeCode: appTypeCode,
      storeId: storeCode,
      executeType: 3,
      restockTime: formatDate(new Date(yesterday), 'YYYY-MM-DD'),
      yingdaoParams,
      typeId: appTypeId,
      nodeId,
      typeName: appTypeName,
      storeName,
      typeCategory,
      id: appId,
      status: 'enable'
    }
    let res = await rpaApi.executeRpa(postData)
    message.success(res)
    // 重跑成功后刷新表格
    tableRef.value?.refresh()
  } catch (e) {
    console.log('取消执行或执行失败', e)
  }
}

// 获取节点列表
const nodeList = ref<any[]>([])
const getNodeList = async () => {
  const data = await NodeManageAccountApi.getNodeManageList({ page: 1, size: 99999 })
  nodeList.value = data.data
}

// 列表 -根据节点id获取节点名称
const getNodeLoginUserName = (id: string) => {
  const node = nodeList.value.find((item) => item.id === id)
  return node?.loginUserName || '--'
}

// 获取店铺列表
const storeList = ref<any[]>([])
const getStoreList = async () => {
  const data = await rpaApi.getStoreList({ page: 1, size: 99999 })
  storeList.value = data.data
}

// 暴露给外部的方法
const setQueryParams = (key: string, value: any) => {
  if (['triggerStartTime', 'triggerEndTime'].includes(key)) {
    if (key === 'triggerStartTime') {
      timeRange.value[0] = formatDate(new Date(value), 'YYYY-MM-DD HH:mm:ss')
    } else {
      timeRange.value[1] = formatDate(new Date(value), 'YYYY-MM-DD HH:mm:ss')
    }
  } else if (Object.keys(queryParams.value).includes(key)) {
    queryParams.value[key] = value
  }
  // 参数变化后自动刷新
  handleQuery()
}

// 新增：批量设置查询参数并刷新
const setBatchQueryParams = async (params: Record<string, any>) => {
  // 2. 确保店铺列表已加载 (防止列表为空导致无法匹配名称)
  if (storeList.value.length === 0) {
    await getStoreList()
  }

  // 3. 遍历并赋值
  for (const key in params) {
    const value = params[key]
    if (!value) continue

    // 特殊处理店铺：如果是 storeName 或者 storeCode，都尝试匹配出正确的名称
    if (key === 'storeName' || key === 'storeCode') {
      // 尝试在列表中查找 (匹配 name 或 code)
      const targetStore = storeList.value.find(
        (s) => s.name === value || s.code === value || s.storeCode === value || s.value === value
      )

      if (targetStore) {
        queryParams.value.storeName = targetStore.name
      } else {
        // 如果找不到匹配项，直接赋值传入的值 (兜底)
        queryParams.value.storeName = value
      }
      continue
    }

    // 常规字段赋值
    if (Object.keys(queryParams.value).includes(key)) {
      queryParams.value[key] = value
    }
  }

  // 4. 执行查询
  handleQuery()
}

onMounted(() => {
  getNodeList()
  getStoreList()
  // STable 设置了 autoLoad 默认为 true，所以组件挂载时会自动调用 loadTableData，不需要手动 getList
})

defineExpose({ setQueryParams, refresh: handleQuery, setBatchQueryParams })
</script>

<style lang="scss" scoped></style>
