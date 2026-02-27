<template>
  <!-- 搜索 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="仓库名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入仓库名称"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
              :prefix-icon="Search"
              class="searchFormItemWidth"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              style="width: 200px"
              v-model="statusList"
              placeholder="请选择仓库状态"
              clearable
              multiple
              @change="changeStatus"
            >
              <el-option :value="1" label="启用">启用</el-option>
              <el-option :value="2" label="停用">停用</el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
          <special-dropdown :btns="btnOps" :loading-btns="['导出']" />
        </div>
      </div>
    </div>
    <div class="form">
      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        v-horizontal-scroll="'always'"
        :row-style="getRowStyle"
        border
      >
        <el-table-column label="仓库名称" prop="name" min-width="120">
          <template #default="{ row }">
            {{ row.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="仓库地址" prop="address" min-width="360">
          <template #default="{ row }">
            {{ row.address || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="contacts" min-width="120">
          <template #default="{ row }">
            {{ row.contacts || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="contactNumber" min-width="120">
          <template #default="{ row }">
            {{ row.contactNumber || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="收货能力" prop="receivingCapability" min-width="120">
          <template #default="{ row }">
            {{ row.receivingCapability || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="60">
          <template #default="{ row }">
            {{ getStatusLabel(row.status) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createdName" min-width="120">
          <template #default="{ row }">
            {{ row.createdName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" min-width="180">
          <template #default="{ row }">
            {{ row.createdAt || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="更新人" prop="updatedName" min-width="120">
          <template #default="{ row }">
            {{ row.updatedName || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updatedAt" min-width="180">
          <template #default="{ row }">
            {{ row.updatedAt || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right" width="160">
          <template #default="{ row, $index }">
            <s-w-table-btns
              :options="btnsOptions[$index] || []"
              :row="row"
              :row-index="$index"
              :can-loading-btn="['停用', '启用']"
            />
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-img">
            <img src="@/assets/imgs/common/empty_list.png" alt="" />
            <div>暂无数据</div>
          </div>
        </template>
      </el-table>
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>
  </ContentWrap>

  <!-- 编辑页面 -->
  <editForm ref="editFormRef" @success="getList" />
</template>
<script lang="tsx" setup>
import { Search } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import editForm from './components/editDrawer.vue'
import * as WarehouseInfoApi from '@/api/supplier/warehouseInfo'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import specialDropdown from '../components/specialDropdown.vue'
import Icon from '@/components/Icon/src/Icon.vue'
import { AuditBtn } from '../changeAudit/option'
import { toReactive } from '@vueuse/core'

const appStore = useAppStore()
const route = useRoute()
defineOptions({ name: 'WarehouseInfo' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 列表的数
const queryParams = reactive({
  page: 1,
  size: 10,
  name: '',
  status: ''
})
const statusList = ref<any>([])
const changeStatus = (vals) => {
  queryParams.status = vals.length ? vals.join(',') : ''
  getList()
}
const queryFormRef = ref()
const statusMap = ref({})
const btnOps = [
  {
    label: '新增',
    option: () => openEditForm('add', ''),
    permission: `${String(route.name)}:Add`,
    icon: <Icon icon="ep:plus" />
  }
]
enum BTNS_KEY {
  /** 启用 */ RUN,
  /** 停用 */ PAUSE,
  /** 查看 */ CHECK,
  /** 编辑 */ EDIT
}

const BASE_BTN_CONFIGS: Record<BTNS_KEY, [string, (...arg: any[]) => void, any]> = {
  [BTNS_KEY.CHECK]: [
    '查看',
    (row) => openEditForm('show', row.id),
    { permission: `${String(route.name)}:Check` }
  ],
  [BTNS_KEY.EDIT]: [
    '编辑',
    (row) => openEditForm('update', row.id),
    { permission: `${String(route.name)}:Edit` }
  ],
  [BTNS_KEY.RUN]: [
    '启用',
    (row) => changeWarehouseStatus(row.status, row.id),
    { permission: `${String(route.name)}:Run` }
  ],
  [BTNS_KEY.PAUSE]: [
    '停用',
    (row) => changeWarehouseStatus(row.status, row.id),
    { permission: `${String(route.name)}:Pause`, type: 'danger' }
  ]
}

/**计算按钮配置 */
const btnsOptions = computed<any>(() =>
  list.value.map(({ status }) => {
    const hideBtnKeys = new Set([BTNS_KEY.EDIT, BTNS_KEY.CHECK])

    switch (status) {
      case '1':
        hideBtnKeys.add(BTNS_KEY.PAUSE)
        break
      case '2':
        hideBtnKeys.add(BTNS_KEY.RUN)
        break
      default:
        break
    }

    const hideBtns = Array.from(hideBtnKeys)
      .sort((a, b) => a - b)
      .map((key) => new AuditBtn(...BASE_BTN_CONFIGS[key]))

    return toReactive(hideBtns)
  })
)

getIntDictOptions(DICT_TYPE.SC_WAREHOUSE_STATUS).forEach((el) => {
  statusMap[el.value] = el.label
})
const getStatusLabel = (val) => {
  return statusMap[val]
}
// 编辑/新增页面
const editFormRef = ref()
const openEditForm = (type, id?: string) => {
  editFormRef.value?.open(type, id)
}
// 停用/启用仓库
const changeWarehouseStatus = async (status, id) => {
  if (status === '1') {
    // 启用状态 改为停用
    const params = {
      id,
      status: '2'
    }
    await message.confirm('您确定停用该仓库吗，停用后供应商将无法对改仓库进行发货！')
    await WarehouseInfoApi.updateStatusWarehouse(params)
    message.success('仓库状态修改成功')
  }
  if (status === '2') {
    // 停用状态 改为启用
    const params = {
      id,
      status: '1'
    }
    await message.confirm('您确定启用该仓库吗？')
    await WarehouseInfoApi.updateStatusWarehouse(params)
    message.success('仓库状态修改成功')
  }
  getList()
}
// 停用状态行加背景色
const getRowStyle = ({ row }) => {
  if (row.status === '2') {
    // 停用状态
    return { backgroundColor: '#f2f2f2' }
  } else {
    return {}
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarehouseInfoApi.getWarehouseList(queryParams)
    list.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  statusList.value = []
  handleQuery()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
<style scoped lang="scss">
.form {
  margin-top: 20px;
}
.editBtn {
  color: #0064ff;
}
.delBtn {
  color: #ea0000;
}
</style>
