<template>
  <ContentWrap v-loading="importBtnLoading" element-loading-text="数据导入中...">
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="72px" label-position="right">
          <el-row :gutter="0">
            <el-col :span="6">
              <el-form-item label="日期:" prop="dataDate">
                <el-date-picker v-model="queryParams.dataDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                  placeholder="请选择日期" @change="handleQuery" :clearable="false" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="品类:" prop="category">
                <el-select v-model="queryParams.category" placeholder="全部" clearable @change="handleQuery">
                  <el-option v-for="item in categoryOps" :key="item.value" :value="item.value" :label="item.label" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="类别:" prop="type">
                <el-select v-model="queryParams.type" placeholder="全部" clearable @change="handleQuery">
                  <el-option v-for="item in typeOps" :key="item.value" :value="item.value" :label="item.label" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="季节分类:" prop="seasonCategory">
                <el-select v-model="queryParams.seasonCategory" placeholder="全部" clearable @change="handleQuery">
                  <el-option v-for="item in seasonCategoryOps" :key="item.value" :value="item.value"
                    :label="item.label" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="isExpand" :gutter="0">
            <el-col :span="6">
              <el-form-item prop="productNumber" label="编码:">
                <el-input v-model.trim="queryParams.productNumber" placeholder="请输入货品编码" clearable :maxlength="30"
                  @keydown.enter="handleQuery" @clear="handleQuery" @blur="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="productName" label="货品名称:">
                <el-input v-model.trim="queryParams.productName" placeholder="请输入货品名称" :maxlength="30" clearable
                  @keydown.enter="handleQuery" @clear="handleQuery" @blur="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="directorName" label="责任人:">
                <el-input v-model.trim="queryParams.directorName" placeholder="请输入责任人" clearable :maxlength="10"
                  @keydown.enter="handleQuery" @clear="handleQuery" @blur="handleQuery" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="onReset">
            <el-icon class="mr4px">
              <Refresh />
            </el-icon> 重置</el-button>
          <el-button type="primary" @click="openDrawer()">
            <el-icon class="mr4px">
              <Plus />
            </el-icon> 新增
          </el-button>
          <el-button @click="handleDelete()"> 待同步商品 </el-button>
          <el-button @click="handleDelete()"> 批量删除 </el-button>
          <el-upload :action="uploadUrl" class="ml16px" :show-file-list="false" :headers="uploadHeaders"
            :on-success="handleImportSuccess" :before-upload="() => (importBtnLoading = true)"
            :on-error="() => (importBtnLoading = false)" :disabled="importBtnLoading">
            <el-button> 导入 </el-button>
          </el-upload>
          <el-button class="ml16px" @click="handleEport" :loading="exportLoading"
            :disabled="exportLoading">导出</el-button>
          <el-button @click="isExpand = !isExpand" link type="primary" class="ml16px">
            <img :src="isExpand ? UpIcon : DownIcon" alt="" class="mr4px w10px h6px" />
            {{ isExpand ? '收起' : '展开' }}
          </el-button>
        </div>
      </div>
    </div>

    <el-divider class="mt0" />

    <main-table :table-data="tableData" :options="tableOptions" :loading="loading" @selection-change="selectChange"
      :max-height="isExpand ? 570 : 620">
      <template #operator="{ row }">
        <el-button link type="primary" @click="openDrawer(row.productNumber, row.codeType)">编辑</el-button>
        <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
      </template>
      <template #image="{ row }">
        <el-image :src="row.image" alt="" fit="contain" :preview-src-list="[row.image]" preview-teleported
          :max-scale="5" />
      </template>
    </main-table>

    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size" @pagination="getList" />
  </ContentWrap>
  <drawer v-model:is-show="isShow" :id="rowId" :type="rowType" :date="queryParams.dataDate || ''"
    @refresh="handleQuery" />
</template>
<script setup lang="ts">
import { categoryOps, seasonCategoryOps, typeOps, tableOptions } from './options'
import MainTable from './components/table.vue'
import Drawer from './components/drawer.vue'
import { exportData, getTable } from '@/api/productManage/deadStock'
import UpIcon from '@/assets/imgs/common/filter_expand_up.png'
import DownIcon from '@/assets/imgs/common/filter_expand_down.png'
import { useCache } from '@/hooks/web/useCache'
import { deleteData } from '../../../api/productManage/deadStock'
import download from '@/utils/download'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'ProductManageDeadStock' })

const { wsCache } = useCache()
const message = useMessage()

const queryParams = ref<ProductManage.DeadStock.GetListParams>({
  page: 1,
  size: 10
})
const tableData = ref<ProductManage.DeadStock.ListItem[]>([])
const total = ref(0)
const isExpand = ref(false)
const selectIds = ref<string[]>([])
const isShow = ref(false)
const exportLoading = ref(false)
const rowId = ref<string>()
const rowType = ref<number>()
const queryFormRef = ref()
const AccessTokenKey = 'ACCESS_TOKEN'
const uploadHeaders = {
  token: wsCache.get(AccessTokenKey) ? wsCache.get(AccessTokenKey) : wsCache.get('ACCESS_TOKEN')
}
const importBtnLoading = ref(false)
const loading = ref(false)

const uploadUrl = computed(
  () =>
    `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_URL}/api/opUnsalableGoods/import?dataDate=${queryParams.value.dataDate}`
)

function handleImportSuccess(res) {
  if (res.success) {
    message.success('导入成功')
  }
  importBtnLoading.value = false
  handleQuery()
}

async function handleEport() {
  exportLoading.value = true
  try {
    const res = await exportData(queryParams.value)
    if (res.success) message.success('导出成功')
    download.excel(res, '滞销滞卖货品清单.xlsx')
  } catch (error) {
  } finally {
    exportLoading.value = false
  }
}

async function getList() {
  loading.value = true
  try {
    const res = await getTable(queryParams.value)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}
function handleQuery() {
  queryParams.value.page = 1
  getList()
}
function onReset() {
  queryFormRef.value.resetFields()
  handleQuery()
}
function openDrawer(id?: string, type?: number) {
  rowId.value = id
  rowType.value = type
  isShow.value = true
}
async function handleDelete(id?: string) {
  if (!id && !selectIds.value.length) return message.warning('未选择任何需要删除的数据')

  await message.confirm('删除当前内容可能造成数据丢失，是否确定删除？')

  let res: any
  if (id) {
    res = await deleteData(id)
  } else {
    res = await deleteData(selectIds.value.join(','))
  }

  if (res.success) {
    message.success('删除成功')
    getList()
  }
}
function selectChange(val: ProductManage.DeadStock.ListItem[]) {
  selectIds.value = val.map((item) => item.id!)
}

onActivated(() => {
  getList()
})

onBeforeMount(() => {
  const today = new Date()
  const day = today.getDate()
  today.setDate(day - 1)
  queryParams.value.dataDate = formatDate(today, 'YYYY-MM-DD')
  getList()
})
</script>

<style lang="less" scoped>
.el-button {
  height: 12px;
  font-size: 12px;
  box-sizing: content-box;
  padding: 10px 15px;

  &.is-link {
    height: 32px;
    padding-left: 0;
    padding-right: 0;
    box-sizing: border-box;
  }
}

:deep(.el-input__wrapper) {
  padding: 0 11px;
}

.el-divider {
  margin-top: 0;
}

.commonTopFilterWrap-search {
  margin-left: 0;
}

.commonTopFilterWrap-filter {
  flex: 1;

  :deep(.el-form) {
    flex: 1;

    .el-form-item {
      width: calc(100% - 24px);
      margin-right: 12px;
    }
  }
}

:deep(.el-table) {
  .is-link {
    height: auto;
    padding-left: 0;
    padding-right: 0;
  }
}

.el-image {
  width: 64px;
  height: 64px;
}

.el-card {
  min-width: 1200px;
}
</style>
