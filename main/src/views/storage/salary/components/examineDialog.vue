<template>
  <el-dialog
    v-model="isShow"
    :title="title"
    ref="dialogRef"
    :width="900"
    :append-to-body="true"
    :before-close="handleBeforeClose"
  >
    <el-divider />

    <el-form :model="queryParams" ref="formRef" :rules="rules">
      <el-row>
        <el-col :span="8">
          <el-form-item prop="keyword">
            <el-input
              v-model.trim="queryParams.keyword"
              placeholder="请输入关键词"
              clearable
              @keydown.enter="handleKeydown($event)"
              @clear="handleClearKeyword"
            >
              <template #prepend>
                <el-select v-model="keywordType" placeholder="类型" :style="{ width: '100px' }">
                  <el-option label="商家编码" :value="1" />
                  <el-option label="货品编码" :value="2" />
                  <el-option label="货品名称" :value="3" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="10">
          <el-form-item>
            <el-button class="mlauto searchBtn" @click="handleQuery">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <sw-table
      :table-data="tableData"
      :options="infoDialogTableOps"
      :loading="loading"
      :height="440"
      :showOverFlowTooltip="true"
    >
      <template #productName="{ col, row }">
        <div class="productName">
          <span>{{ col }}</span>
          <div v-if="row.hotSellFlag">
            <img class="ml14px" src="@/assets/svgs/storage/hot.svg" alt="" />
            <span :style="{ fontSize: '12px', color: '#EB3737', marginLeft: '6px' }">爆款</span>
          </div>
        </div>
      </template>
    </sw-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import SwTable from './table.vue'
import { infoDialogTableOps } from '../options'
import { getInfoDetail } from '@/api/storage/salary/examine'
import type { FormRules } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  title: string
  rowData: StorageSalary.Examien.DetailVos
  type: number
}>()

const emits = defineEmits(['update:modelValue', 'exportSuccess'])

const departmentIds = ref<string[]>([])
const queryParams = reactive<StorageSalary.Examien.GetInfoDetailParams>({
  page: 1,
  size: 10
})
const rules = ref<FormRules>({
  departmentId: [
    {
      required: true,
      validator: (_, __, callback) =>
        callback(departmentIds.value.length ? undefined : new Error('请选择部门'))
    }
  ],
  dataMonth: [{ required: true, message: '请选择月份' }]
})
const dialogRef = ref()
const tableData = ref()
const total = ref(1)
const loading = ref(false)
const formRef = ref()
const keywordType = ref(1)

const isShow = computed({
  get: () => {
    props.modelValue && getList()
    keywordType.value = 1
    return props.modelValue
  },
  set: (val) => {
    emits('update:modelValue', val)
  }
})

watch(
  () => queryParams.keywordType,
  (val) => (keywordType.value = val || 1)
)

function handleQuery() {
  queryParams.page = 1
  getList()
}

async function getList() {
  if (queryParams.keyword && keywordType.value) queryParams.keywordType = keywordType.value
  else delete queryParams.keywordType
  if (queryParams.keywordType && !queryParams.keyword) return
  if (!queryParams.keywordType && queryParams.keyword) return

  loading.value = true
  try {
    queryParams.rolesMask = props.rowData.rolesMask
    queryParams.salaryId = props.rowData.id
    queryParams.classificationId = props.rowData.classificationId
    queryParams.type = props.type

    const res = await getInfoDetail(queryParams)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleClearKeyword() {
  delete queryParams.keywordType
  handleQuery()
}

function handleKeydown(e: Event) {
  e.preventDefault()
  handleQuery()
}

function handleBeforeClose(done: () => void) {
  isShow.value = false
  formRef.value.resetFields()
  delete queryParams.keywordType
  done()
}
</script>

<style lang="less" scoped>
* {
  --el-input-width: 262px;
}

.el-divider {
  width: calc(100% + 32px);
  margin: 0 -16px 16px;
}

:deep(.el-dialog) {
  top: 0;
}

.el-form {
  :deep(.el-input) {
    width: 277px;
    align-items: center;

    .el-input-group__prepend {
      box-shadow: none;

      .el-select__wrapper {
        height: 36px;
      }
    }
  }
}

.productName {
  display: flex;
  align-items: center;
}

.searchBtn {
  color: #666;
  background: #f5f7fa;
  font-size: 12px;

  &:hover {
    background: var(--el-button-hover-bg-color);
    color: #0064ff;
  }
}
</style>
