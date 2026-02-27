<template>
  <SpecialCard>
    <el-row :gutter="24">
      <el-col :span="20" class="!flex-1">
        <el-form label-width="90" :model="queryParams" ref="formRef">
          <el-row :gutter="12">
            <el-col :span="6">
              <!-- 关键词 -->
              <el-form-item prop="query" label="关键词" label-width="auto">
                <el-input
                  v-model.trim="queryParams.query"
                  clearable
                  placeholder="请输入关键词"
                  :style="{ width: '220px' }"
                  @keydown.enter="handleQuery"
                  @clear="handleQuery"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>

      <el-col :span="4" class="!flex justify-end !min-w-350px">
        <el-button @click="handleQuery" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
          重置
        </el-button>
        <el-button
          v-if="permissionSet.has('SupplierAssessRulesLevel:Add')"
          type="primary"
          @click="handleAddLevel"
        >
          <Icon icon="ep:plus" class="mr-4px" /> 新增等级</el-button
        >
      </el-col>
    </el-row>

    <sw-table :options="levelTable" :data="tableData" :loading="loading" border>
      <template
        v-for="slot in getDictOptions(DICT_TYPE.SUPPLIER_GRADE_HANDLING_SCHEME)"
        :key="slot.value"
        #[slot.label]="{ row }"
      >
        <el-checkbox
          class="!cursor-not-allowed"
          :model-value="row.handlingScheme.split(',').includes(slot.value)"
          readonly
        />
      </template>

      <template #options="{ row }">
        <el-button
          v-if="permissionSet.has('SupplierAssessRulesLevel:Edit')"
          link
          type="primary"
          @click="handleEdit(row)"
          >编辑</el-button
        >
        <el-button
          v-if="permissionSet.has('SupplierAssessRulesLevel:Delete')"
          link
          type="danger"
          :loading="row.removeLoading"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
      </template>
    </sw-table>

    <template #footer>
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </template>
  </SpecialCard>

  <add-level-drawer
    v-model:model-value="addDrawerOption.modelValue"
    :title="addDrawerOption.title"
    :row-data="addDrawerOption.rowData"
    @refresh="handleQuery"
  />
</template>

<script lang="tsx" setup>
import SwTable from '../../components/table.vue'
import { levelTable } from './options'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
import SpecialCard from '../../components/specialCard.vue'
import { removeSupplierGradeApi, supplierGradePageApi } from '@/api/supplier/assess'
import { getPermission } from '@/utils'
const AddLevelDrawer = defineAsyncComponent(() => import('./components/addLevelDrawer.vue'))

defineOptions({ name: 'SupplierAssessRulesLevel' })

const message = useMessage()
const permissionSet = new Set(getPermission())

const queryParams = reactive({
  page: 1,
  size: 10,
  query: ''
})
const tableData = ref<Supplier.Assess.SupplierGrade[]>([])
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
    const res = await supplierGradePageApi(queryParams)

    tableData.value = res.records
    total.value = res.total
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

async function handleAddLevel() {
  addDrawerOption.modelValue = true
  addDrawerOption.title = '新增等级'
  delete addDrawerOption.rowData
}

async function handleEdit(row) {
  addDrawerOption.modelValue = true
  addDrawerOption.title = '编辑等级'
  addDrawerOption.rowData = { ...row }
}

async function handleDelete(row: Supplier.Assess.SupplierGrade) {
  if (!row.id) return
  try {
    await message.confirm('删除后会影响供应商等级分布，是否确定删除？')
    row.removeLoading = true

    const res = await removeSupplierGradeApi({ id: row.id })
    if (res.success) {
      nextTick(() => {
        ElMessage.success('删除成功！')
      })
      handleQuery()
    }
  } catch (error) {}
}

onBeforeMount(getList)

onActivated(getList)
</script>
<style lang="less" scoped>
@import url(../../index.scss);

:deep(.el-checkbox__input) {
  cursor: not-allowed;
}
</style>
