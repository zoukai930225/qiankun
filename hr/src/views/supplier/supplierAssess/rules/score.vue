<template>
  <special-card>
    <el-row>
      <el-col :span="20" class="!flex-1">
        <el-form label-width="90" :model="queryParams" ref="formRef">
          <div class="flex">
            <el-form-item prop="query" label="类型" label-width="auto">
              <el-select-v2
                :style="{ width: '220px' }"
                v-model.trim="queryParams.type"
                clearable
                :options="scoreTypeOptions"
                placeholder="请选择类型"
                @change="handleQuery"
              />
            </el-form-item>

            <el-form-item prop="query" label="关键词">
              <el-input
                :style="{ width: '220px' }"
                v-model.trim="queryParams.query"
                clearable
                placeholder="请输入关键词"
                @keydown.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
          </div>
        </el-form>
      </el-col>

      <el-col :span="4" class="!flex justify-end min-w-350px">
        <el-button @click="handleQuery" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
          重置
        </el-button>
        <el-button
          v-if="permissionSet.has('supplierAssessRulesScore:Add')"
          type="primary"
          @click="handleAdd"
        >
          <el-icon class="mr1"><Plus /></el-icon>
          新增
        </el-button>
      </el-col>
    </el-row>

    <sw-table :options="scoreTable" :data="tableData" :loading="loading" border>
      <template
        v-for="slotName in [
          'dahuoshengchanjihua',
          'xianyoudingdan',
          'xinxiadingdan',
          'xinchanpinkaifa'
        ]"
        :key="slotName"
        #[slotName]="{ col }"
      >
        <el-checkbox :model-value="col === '1'" readonly />
      </template>

      <template #options="{ row }">
        <el-button
          v-if="permissionSet.has('supplierAssessRulesScore:Edit')"
          link
          type="primary"
          @click="handleEdit(row)"
          >编辑</el-button
        >
        <el-button
          v-if="permissionSet.has('supplierAssessRulesScore:Delete')"
          link
          type="danger"
          @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
    </sw-table>

    <template #footer>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </template>
  </special-card>

  <add-score-drawer
    v-model:model-value="addDrawerOption.modelValue"
    :title="addDrawerOption.title"
    :row-data="addDrawerOption.rowData"
    @refresh="handleQuery"
  />
</template>

<script lang="tsx" setup>
import SwTable from '../../components/table.vue'
import { scoreTable, scoreTypeOptions } from './options'
import { removeSupplierScoreChangeApi, supplierScoreChangeApi } from '@/api/supplier/assess'
import SpecialCard from '../../components/specialCard.vue'
import { getPermission } from '@/utils'
const AddScoreDrawer = defineAsyncComponent(() => import('./components/addScoreDrawer.vue'))

defineOptions({ name: 'SupplierAssessRulesScore' })

const message = useMessage()
const permissionSet = new Set(getPermission())

const queryParams = reactive<Supplier.Assess.SupplierScoreChangePageRequest>({
  page: 1,
  size: 10,
  type: ''
})
const tableData = ref<Supplier.Assess.SupplierScoreChangeRow[]>([])
const total = ref(0)
const addDrawerOption = reactive({
  modelValue: false,
  title: '',
  rowData: {} as any
})
const loading = ref(false)

async function getList() {
  loading.value = true
  try {
    const res = await supplierScoreChangeApi(queryParams)

    if (res) {
      tableData.value = res.records
      total.value = res.total
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

async function handleQuery() {
  queryParams.page = 1
  getList()
}
function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, ''])),
    { page: 1, size: 10 }
  )
  handleQuery()
}

async function handleAdd() {
  addDrawerOption.modelValue = true
  addDrawerOption.title = '新增加减分项'
  delete addDrawerOption.rowData
}

async function handleEdit(row) {
  addDrawerOption.modelValue = true
  addDrawerOption.title = '编辑加减分项'
  addDrawerOption.rowData = { ...row }
}

async function handleDelete(row) {
  try {
    await message.confirm('删除后会影响供应商等级分布，是否确定删除？')

    const res = await removeSupplierScoreChangeApi({ id: row.id })

    if (res.success) {
      ElMessage.success('删除成功！')
      handleQuery()
    }
  } catch (error) {}
}

onBeforeMount(getList)
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
