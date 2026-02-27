<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="分类:" prop="classificationName">
            <el-input
              v-model.trim="queryParams.classificationName"
              placeholder="分类"
              clearable
              @keydown.enter="getList"
            />
          </el-form-item>
          <el-form-item label="工种:" prop="rolesMask">
            <el-select
              v-model="queryParams.rolesMask"
              placeholder="全部"
              clearable
              @change="getList"
            >
              <el-option
                v-for="item in rolesMasks"
                :key="item.code"
                :value="item.code!"
                :label="item.rolesMaskName"
              />
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
          <el-button @click="resetQuery" class="commonResetBtn"> 重置 </el-button>
          <el-button type="primary" @click="onPlus">
            <el-icon class="mr4px"><Plus /></el-icon>
            新增
          </el-button>
        </div>
      </div>
    </div>

    <main-table
      :table-data="tableData"
      :options="goodsClassficationTable"
      :loading="loading"
      max-height="640px"
    >
      <template #rolesMask="{ row }">
        {{ transformRoles(row.rolesMask, rolesMasks) }}
      </template>
      <template #dayPricing="{ row }">{{ +row.dayPricing }}</template>
      <template #nightPricing="{ row }">{{ +row.nightPricing }}</template>
      <template #crossWorkPricing="{ row }">{{ +row.crossWorkPricing }}</template>
      <template #hotSellPricing="{ row }">{{ +row.hotSellPricing || '--' }}</template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="onEdit(row)">编辑</el-button>
        <el-button type="primary" link @click="onCode(row)">商家编码</el-button>
        <el-button type="danger" link @click="onDelete(row.id)">删除</el-button>
      </template>
    </main-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <code-dialog v-model:is-show="isShowCodeDialog" :row-data="rowData" @refresh="getList" />

  <add-or-edit
    ref="addAndEditRef"
    v-model:is-show="isShowAddDialog"
    :row-data="rowData"
    :drawer-type="drawerType"
    @refresh="handleQuery"
  />
</template>
<script setup lang="ts">
import { getRolesMasks } from '@/api/storage/system'
import MainTable from '../components/table.vue'
import { goodsClassficationTable, transformRoles } from '../options'
import {
  deleteClassification,
  getGoodsClassficationList
} from '@/api/storage/system/goodsClassfication'
import CodeDialog from './components/codeDialog.vue'
const AddOrEdit = defineAsyncComponent(() => import('./components/add&edit.vue'))

defineOptions({ name: 'StorageSystemGoodsClassification' })

const message = useMessage()

const tableData = ref<StorageSystem.GoodsClassfication.List>([])
const rolesMasks = ref<StorageSystem.PersonalManagement.RolesMaskItem[]>([])
const rowData = ref<StorageSystem.GoodsClassfication.ListItem>({})
const queryParams = reactive<StorageSystem.GoodsClassfication.GetListParams>({
  page: 1,
  pageSize: 10
})
const loading = ref(true)
const total = ref(1)
const queryFormRef = ref()
const isShowCodeDialog = ref(false)
const isShowAddDialog = ref(false)
const drawerType = ref<'add' | 'edit'>('add')
const addAndEditRef = ref()

/**
 * 搜索
 */
function handleQuery() {
  queryParams.page = 1
  getList()
}

/**
 * 重置
 */
function resetQuery() {
  queryFormRef.value.resetFields()
  getList()
}

/**
 * 获取列表数据
 */
async function getList() {
  loading.value = true
  try {
    const res = await getGoodsClassficationList(queryParams)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}

/** 获取工种列表 */
async function getRoles() {
  try {
    const res = await getRolesMasks()
    rolesMasks.value = res
  } catch (error) {}
}

async function onEdit(row: StorageSystem.GoodsClassfication.ListItem) {
  rowData.value = row
  drawerType.value = 'edit'
  isShowAddDialog.value = true
  await nextTick()
  await addAndEditRef.value.getRenderData()
}

function openCodeDialog() {
  isShowCodeDialog.value = true
}

function onCode(row: StorageSystem.GoodsClassfication.ListItem) {
  rowData.value = row
  openCodeDialog()
}

async function onDelete(id: string) {
  try {
    await message.confirm('确定删除分类吗？')

    const res = await deleteClassification(id)
    if (res.success) {
      message.success('删除成功')
      getList()
    }
  } catch (error) {}
}

async function onPlus() {
  drawerType.value = 'add'
  isShowAddDialog.value = true
  await nextTick()
  await addAndEditRef.value.getRenderData()
}

onBeforeMount(async () => {
  await getRoles()
  await getList()
})

onActivated(async () => {
  await getList()
})
</script>

<style lang="less" scoped>
:deep(.el-form) {
  .el-input__wrapper,
  .el-select__wrapper {
    width: 200px;
    box-sizing: border-box;
  }
}
</style>
