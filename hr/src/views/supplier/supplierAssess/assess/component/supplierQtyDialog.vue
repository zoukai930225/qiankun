<template>
  <s-w-drawer
    :model-value="modelValue"
    width="1000"
    title="参与评分供应商"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <el-card shadow="never" class="!border-0 !rounded-8px">
      <el-row>
        <el-col :span="20" class="!flex-1">
          <el-form :model="queryParams" label-width="90px">
            <div class="flex flex-wrap">
              <el-form-item :prop="codeType" label-width="0">
                <el-input
                  v-model.trim="queryParams[codeType]"
                  :placeholder="codeTypes[codeType].placeholder"
                  clearable
                  class="!w-299px"
                  @keydown.enter="handleQuery"
                  @clear="handleQuery"
                >
                  <template #prepend>
                    <el-select v-model="codeType" @change="handleChangeCodeType">
                      <el-option
                        v-for="(value, key) in codeTypes"
                        :key="key"
                        :value="key"
                        :label="value.label"
                      />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="考核期" prop="period">
                <select-month
                  :style="{ width: '220px' }"
                  v-model="queryParams.period"
                  placeholder="请选择考核期"
                  @change="handleQuery"
                />
              </el-form-item>
            </div>
          </el-form>
        </el-col>
        <el-col :span="4" class="!flex justify-end !min-w-[min-content]">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
            重置
          </el-button>
        </el-col>
      </el-row>

      <special-table
        :options="supplierQtyTable"
        :data="tableData"
        :max-height="680"
        :loading="loading"
        border
      />
    </el-card>

    <template #footer>
      <div class="flex justify-end">
        <Pagination
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="getList"
        />
      </div>
    </template>
  </s-w-drawer>
</template>
<script lang="ts" setup>
import SelectMonth from '@/views/supplier/components/selectMonth.vue'
import specialTable from '@/views/supplier/components/table.vue'
import { supplierQtyTable } from '../option'
import { supplierAssessmentParticipatePageApi } from '@/api/supplier/assess'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:model-value', v: boolean): void
}>()

const codeTypes = {
  abbreviationCompany: { label: '供应商简称', placeholder: '请输入供应商简称' },
  fullCompany: { label: '公司名称', placeholder: '请输入公司名称' }
}
const codeType = ref('abbreviationCompany')
const queryParams = reactive<Supplier.Assess.GetAssessParams>({
  page: 1,
  size: 10
})
const total = ref(1)
const tableData = ref<any[]>([])

function handleQuery() {
  queryParams.page = 1
  getList()
}
const loading = ref(false)
const timer = ref<NodeJS.Timeout>()
function getList() {
  loading.value = true
  if (timer.value) clearTimeout(timer.value)
  timer.value = setTimeout(async () => {
    try {
      const res = await supplierAssessmentParticipatePageApi(queryParams)
      if (!res) return
      tableData.value = res.records
      total.value = res.total
    } catch (error) {
    } finally {
      loading.value = false
    }
  }, 500)
}
function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { page: 1, size: 10 }
  )
  getList()
}

function handleOpen() {
  handleQuery()
}

function handleClosed() {
  emit('update:model-value', false)
  tableData.value = []
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { page: 1, size: 10 }
  )
  total.value = 0
}

function handleChangeCodeType() {
  let val = ''
  Object.keys(codeTypes).forEach((key) => {
    queryParams[key] && (val = queryParams[key])
    queryParams[key] = ''
  })
  val && getList()
}
</script>
<style lang="less" scoped>
@import url(../../../index.scss);

:deep(.el-pagination) {
  margin: 0;
  float: none;
}
</style>
