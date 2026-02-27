<template>
  <el-card ref="card" shadow="never">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <el-button v-if="pageType !== 1" type="primary" @click="add">新增</el-button>
      </div>
    </template>
    <el-table
      :border="border"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="tableData"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      :show-summary="true"
      :summary-method="getSum"
      :span-method="arraySpanMethod"
    >
      <el-table-column label="人员姓名">
        <template #default="{ row, $index }">
          <el-form
            v-if="row.isAdd"
            :model="formData[$index]"
            :ref="`formRef${$index}`"
            :rules="rules"
            inline-message
            inline
          >
            <el-form-item prop="empId" label=" " class="pr4">
              <el-select
                popper-class="eloption"
                :popper-append-to-body="true"
                v-model="formData[$index].empId"
                placeholder="请选择"
                remote
                filterable
                clearable
                :remote-method="getPeople"
                :loading="selectLoading"
                @change="(value) => selectPeople(value, $index)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :value="item.empId"
                  :label="item.fullName"
                />
                <template #loading>
                  <el-icon class="is-loading">
                    <svg class="circular" viewBox="0 0 20 20">
                      <g class="path2 loading-path" stroke-width="0">
                        <circle r="3.375" class="dot1" rx="0" ry="0" />
                        <circle r="3.375" class="dot2" rx="0" ry="0" />
                        <circle r="3.375" class="dot4" rx="0" ry="0" />
                        <circle r="3.375" class="dot3" rx="0" ry="0" />
                      </g>
                    </svg>
                  </el-icon>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="workHours" label=" " class="pl4 pr4">
              <el-input
                v-model="formData[$index].workHours"
                clearable
                placeholder="请输入工作时长"
                @input="(val) => handleInput(val, $index, 'workHours')"
                @blur="computeEfficiency(row)"
              />
            </el-form-item>
            <el-form-item prop="actualWork" label=" " class="pl4">
              <el-input
                v-model="formData[$index].actualWork"
                clearable
                placeholder="请输入实际作业"
                @input="(val) => handleInput(val, $index, 'actualWork')"
                @blur="computeEfficiency(row)"
              />
            </el-form-item>
          </el-form>
          <span v-else>{{ row.empName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作时长" prop="workHours">
        <template #default="{ row, $index }">
          <el-form
            v-if="row.isEdit"
            :model="formData[$index]"
            :ref="`formRef${$index}`"
            :rules="rules"
            inline-message
            inline
          >
            <el-form-item prop="workHours" label=" " class="pr4">
              <el-input
                v-model="formData[$index].workHours"
                clearable
                placeholder="请输入工作时长"
                @input="(val) => handleInput(val, $index, 'workHours')"
                @blur="computeEfficiency(row)"
              />
            </el-form-item>
            <el-form-item prop="actualWork" label=" " class="pl4">
              <el-input
                v-model="formData[$index].actualWork"
                clearable
                placeholder="请输入实际作业"
                @input="(val) => handleInput(val, $index, 'actualWork')"
                @blur="computeEfficiency(row)"
              />
            </el-form-item>
          </el-form>
          <span v-else>{{ row.workHours }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际作业" prop="actualWork" />
      <el-table-column label="工作效率（件/时）">
        <template #default="{ row }">
          <span>{{ row.workEfficiency || computeEfficiency(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="pageType !== 1" label="操作" prop="empName" width="180" align="center">
        <template #default="{ row, $index }">
          <el-button v-if="row.isEdit || row.isAdd" link type="primary" @click="save(row, $index)"
            >保存</el-button
          >
          <el-button v-if="row.isEdit || row.isAdd" link type="primary" @click="cancel(row, $index)"
            >取消</el-button
          >
          <div v-else>
            <el-button link type="primary" @click="edit(row, $index)">修改</el-button>
            <el-button link type="primary" @click="remove(row, $index)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { TableColumnCtx } from 'element-plus'
import { delReportDetail, getPersonList, getReportDetail } from '@/api/storage/report'
import { cloneDeep } from 'lodash-es'

interface SummaryMethodProps<T = any> {
  columns: TableColumnCtx<T>[]
  data: T[]
}

const props = defineProps<{
  data: any
  title: string
  pageType?: 1 | 2
  border?: boolean
  rowData?: StorageType.ReportListItem
  type?: string
  id?: string
}>()

const emit = defineEmits(['refresh', 'validateDailyReportId', 'update:data'])
const tableData = ref<StorageType.DailyReportDetailItemRow[]>([])
const appStore = useAppStore()
const loading = ref(false)
const formData = ref<Partial<StorageType.AddReportDetailParams>[]>([])
const rules = ref({
  empId: [
    {
      required: true,
      message: '请输入'
    },
    {
      validator: (_: any, value: any, callback: any) => {
        if (
          formData.value.filter((ele) => {
            if (ele.empId) {
              return ele.empId === value
            } else {
              return false
            }
          }).length > 1
        ) {
          callback(new Error('人员重复，请重新选择'))
        } else {
          callback()
        }
      }
    }
  ],
  workHours: [
    {
      required: true,
      message: '请输入'
    },
    {
      validator: (_: any, value: any, callback: any) => {
        if (!+value) {
          callback(new Error('工时不能为空'))
        } else {
          callback()
        }
      }
    }
  ],
  actualWork: [
    {
      required: true,
      message: '请输入'
    }
  ]
})
const options = ref<any[]>([])
const selectLoading = ref(false)
const message = useMessage()

class FormDataFectory implements Partial<StorageType.AddReportDetailParams> {
  actualWork = undefined
  dailyReportId = props.rowData?.id || ''
  empId = ''
  empName = ''
  id = props.data.id
  type = props.type || ''
  workEfficiency = undefined
  workHours = undefined
}

// 新增
function add() {
  formData.value.unshift(new FormDataFectory())
  tableData.value.unshift({
    isAdd: true
  })
}

// 修改
// 用于修改取消数据还原
const originalRow = ref<any>()
function edit(row: StorageType.DailyReportDetailItemRow, index: number) {
  originalRow.value = cloneDeep(row)
  row.isEdit = true
  formData.value[index].workHours = row.workHours || 0
  formData.value[index].actualWork = row.actualWork || 0
}

// 删除
async function remove(row: StorageType.DailyReportDetailItemRow, index: number) {
  try {
    await message.confirm('确认删除吗？删除后将无法恢复')
    const res = await delReportDetail(row.id || '')
    if (res && res.success) {
      message.success('删除成功')
      tableData.value.splice(index, 1)
      formData.value.splice(index, 1)
    }
  } catch (error) {}
}

// 获取表单
const instance = getCurrentInstance()
function getFormDOM(index: number) {
  const formRefName = `formRef${index}`
  const form = instance?.refs[formRefName]
  if (form) {
    return form as any
  }
}

// 保存
async function save(row: StorageType.DailyReportDetailItemRow, index: number) {
  emit('validateDailyReportId')
  if (!props.rowData?.id) return
  formData.value[index].dailyReportId || (formData.value[index].dailyReportId = props.rowData?.id)
  try {
    getFormDOM(index).validate(async (valid: boolean) => {
      if (valid) {
        const res = await getReportDetail(
          formData.value[index] as StorageType.AddReportDetailParams
        )
        tableData.value[index] = res as any
        message.success('保存成功')
        row.isAdd = false
        row.isEdit = false
      }
    })
  } catch (error) {
  } finally {
  }
}

// 取消
function cancel(row: StorageType.DailyReportDetailItemRow, index: number) {
  if (row.isAdd) {
    tableData.value.splice(index, 1)
    formData.value.splice(index, 1)
  } else {
    row.isEdit = false
    Object.keys(row).forEach((key) => {
      row[key] = originalRow.value[key]
    })
    formData.value[index] = new FormDataFectory()
  }
}

// 输入时获取效率
function computeEfficiencyByInput(index: number) {
  const { actualWork, workHours } = formData.value[index]
  if (Number(actualWork) && Number(workHours)) {
    tableData.value[index].workEfficiency =
      Math.round(
        (Number(formData.value[index].actualWork) / Number(formData.value[index].workHours)) * 100
      ) / 100
  } else {
    tableData.value[index].workEfficiency = 0
  }
}

// 获取每行工作效率
function computeEfficiency(row: StorageType.DailyReportDetailItemRow) {
  if (row?.actualWork && row?.workHours) {
    if (Number(row?.workHours)) {
      const result = Math.round(Number(row?.actualWork / row?.workHours) * 100) / 100
      return result
    } else {
      return 0
    }
  } else {
    return 0
  }
}

// 合计方法
function getSum(params: SummaryMethodProps) {
  const { columns, data } = params
  const sums: any[] = []

  columns.forEach((column, index) => {
    switch (index) {
      case 0:
        sums[index] = h('div', {}, '合计')
        break
      case 3:
        if (sums[1]) {
          const sum = Math.round(Number(sums[2] / sums[1]) * 100) / 100
          sums[index] = Number.isNaN(sum) ? 0 : sum
        } else {
          sums[index] = 0
        }
        break
      case 4:
        sums[index] = undefined
        break
      default:
        const values = data.map((item) => Number(item[column.property]))
        sums[index] = Math.round(Number(values.reduce((a, b) => a + (b ? b : 0), 0)) * 100) / 100
        break
    }
  })

  return sums
}

function arraySpanMethod({ row, columnIndex }) {
  if (row.isAdd) {
    let res: [number, number] = [0, 0]
    switch (columnIndex) {
      case 0:
        res = [1, 3]
        break
      case 4:
        res = [1, 1]
        break
      case 3:
        res = [1, 1]
        break
      default:
        res = [0, 0]
        break
    }
    return res
  } else if (row.isEdit) {
    let res: [number, number] = [0, 0]
    switch (columnIndex) {
      case 1:
        res = [1, 2]
        break
      case 2:
        res = [0, 0]
        break
      default:
        res = [1, 1]
        break
    }
    return res
  }
}

// 获取人员列表
async function getPeople(value: string) {
  options.value = [] // 重置，优化
  selectLoading.value = true
  try {
    const res = await getPersonList({
      type: props.type || '',
      dailyReportId: props.rowData?.id || '',
      empName: value
    })
    if (res && res.length > 0) {
      options.value = res
    }
  } catch (error) {
  } finally {
    selectLoading.value = false
  }
}

// 选择人员的响应
function selectPeople(value: string, index: number) {
  formData.value[index].empName = options.value.find((el) => el.empId === value).fullName
}

// 限制输入格式
function handleInput(value: string, index: number, key: string) {
  // 使用正则表达式过滤输入，只保留数字和小数点
  const filteredValue = value.replace(/[^\d.]/g, '')
  // 处理多个小数点的情况
  const parts = filteredValue.split('.')
  if (parts.length > 2) {
    formData.value[index][key] = parts[0] + '.' + parts[1]
  } else {
    formData.value[index][key] = filteredValue.replace(/^(\d+.\d{2})\d*/, '$1')
  }
  computeEfficiencyByInput(index)
}

watch(
  () => tableData.value,
  (val) => emit('update:data', val),
  {
    deep: true
  }
)

onMounted(() => {
  tableData.value = [
    ...props.data
      .map((el: StorageType.DailyReportDetailItemRow) => {
        el.isAdd = false
        el.isEdit = false
        return el
      })
      .filter((el: StorageType.DailyReportDetailItemRow) => el.empName !== '合计')
  ]

  formData.value = [...props.data]
})
</script>
<style scoped lang="less">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
:deep(.el-scrollbar__view) {
  width: 100%;
}
</style>
