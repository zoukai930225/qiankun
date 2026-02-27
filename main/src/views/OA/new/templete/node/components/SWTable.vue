<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <el-table :data="sortedTableData" width="100%" v-loading="loading" v-horizontal-scroll="'always'"
      class="SWCommonTable templateTable" row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle"
      @sort-change="handleSortChange" show-overflow-tooltip row-key="id">
      <!-- <el-table-column label="" width="50">
        <img class="dragHandle" src="@/assets/imgs/system/fieldManageConfig/drog.png" alt="" />
      </el-table-column> -->
      <el-table-column v-for="field in showTableColumns" :key="field.id" :prop="field.code" :label="field.name"
        :sortable="field.supportSort" :min-width="columnMinWidth(field)"
        :show-overflow-tooltip="field.type === 8 ? false : true" :class="{ 'is-sorted': sortProp === field.code }">
        <template #default="{ row }">
          <!-- 文本 -->
          <el-input v-if="isEditable(row, field) && field.type === 0 && field.edit" v-model="row[field.code]"
            @keyup.enter="handleBlur(row, field.code)" @blur="handleBlur(row, field.code)" :maxlength="field.maxLength"
            :placeholder="field.placeholder || detaultPlaceholderMap[field.type]" />
          <span v-else-if="field.type === 0" class="tableValueStyle" @dblclick="handleDoubleClick(row, field.code)">
            {{ formatTableValue(row, field.code) }}
          </span>

          <!-- 数字 -->
          <el-input v-if="isEditable(row, field) && field.type == 1" v-model="row[field.code]" type="number" :min="1"
            @keyup.enter="handleBlur(row, field.code)" @blur="handleBlur(row, field.code)" :maxlength="field.maxLength"
            :placeholder="field.placeholder || detaultPlaceholderMap[field.type]"
            @input="(el) => handleInput(el, row, field.code)" />
          <span v-else-if="field.type === 1" class="tableValueStyle" @dblclick="handleDoubleClick(row, field.code)">
            {{ formatTableValue(row, field.code) }}
          </span>

          <!-- 单选 -->
          <el-select v-model="row[field.code]" v-if="isEditable(row, field) && field.type == 2"
            :placeholder="field.placeholder || detaultPlaceholderMap[field.type]" clearable value-on-clear=""
            @visible-change="(val) => handleVisibleChange(row, field.code, val)" @clear="handleClear(row, field.code)">
            <el-option v-for="dict in field.code === 'submitType'
              ? permissionList || []
              : field.options || []" :key="field.code === 'submitType' ? dict.id : dict.value"
              :label="field.code === 'submitType' ? dict.name : dict.label"
              :value="field.code === 'submitType' ? dict.id : dict.value" />
          </el-select>
          <div v-else-if="field.type === 2" class="tableValueStyle" style="width: 100%"
            @dblclick="handleDoubleClick(row, field.code)">
            {{ formatTableValue(row, field.code) || '--' }}
          </div>

          <!-- 多选 -->
          <el-select v-model="row[field.code]" v-if="isEditable(row, field) && field.type == 3"
            :placeholder="field.placeholder || detaultPlaceholderMap[field.type]" clearable multiple value-on-clear=""
            @visible-change="(val) => handleMutipleVisibleChange(row, field.code, val)"
            @remove-tag="(val) => handleMutipleRemoveTag(row, field.code, val)"
            @clear="handleMutipleClear(row, field.code)">
            <el-option v-for="dict in field.options || []" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
          <span v-else-if="field.type == 3" class="tableValueStyle" @dblclick="handleDoubleClick(row, field.code)">
            {{ formatTableValue(row, field.code) }}
          </span>

          <!-- 其他 - 当字段code为depName时，显示部门选择器 -->
          <el-cascader v-if="field.code === 'depName' && isEditable(row, field)" v-model="row.depName" filterable
            clearable popper-class="cascader-popper" value-on-clear=""
            :placeholder="field.placeholder || detaultPlaceholderMap[field.type]" :props="customProps"
            :options="departmentTreeData" @visible-change="(val) => handleCascaderVisibleChange(row, 'depName', val)"
            @clear="handleCascaderClear(row, 'depName')" />
          <span v-else-if="field.code === 'depName'" class="tableValueStyle"
            @dblclick="handleDoubleClick(row, field.code)">
            {{ formatTableValue(row, field.code) }}
          </span>

          <!-- 日期 -->
          <el-date-picker style="width: 150px" v-if="isEditable(row, field) && (field.type === 4 || field.type === 5)"
            v-model="row[field.code]" :type="field.type === 4 ? 'date' : field.type === 5 ? 'datetime' : 'date'"
            :placeholder="field.placeholder || detaultPlaceholderMap[field.type]"
            @change="handleDateChange(row, field.code, field.type)"
            @blur="handleDateChange(row, field.code, field.type)" />
          <span v-else-if="field.type === 4" class="tableValueStyle" @dblclick="handleDoubleClick(row, field.code)">
            {{ formatCustomDate(row[field.code], 'yyyy-MM-dd') }}
          </span>
          <span v-else-if="field.type === 5" class="tableValueStyle" @dblclick="handleDoubleClick(row, field.code)">
            {{ formatCustomDate(row[field.code], 'yyyy-MM-dd HH:mm:ss') }}
          </span>

          <!-- 选择负责人 -->
          <div v-if="isEditable(row, field) && field.type === 8"
            style="width: 220px; max-height: 100px; display: flex; overflow: auto">
            <!-- {{ row[`${field.code}List`] }} -->
            <div v-if="field.code === 'personInCharge' && row.submitType !== '4'">--</div>
            <SWSelectPeople v-else :isEdit="true" v-model:modelValue="row[`${field.code}List`]" type="operate"
              :getSearchList="remoteMethod" @save-select-people="saveSelectPeople(row, field.code)" />
          </div>
          <div v-else-if="(!isEditable(row, field) && field.type === 8) || field.type === 8"
            @dblclick="handleDoubleClick(row, field.code)"
            style="width: 220px; max-height: 100px; display: flex; overflow: auto">
            <!-- {{ JSON.parse(row[`${field.code}List`]) }} -->
            <div v-if="field.code === 'personInCharge' && row.submitType !== '4'">--</div>
            <div v-else>
              <SWSelectPeople :isEdit="false" v-if="isValidJson(row[`${field.code}List`])"
                v-model:modelValue="row[`${field.code}List`]" />
              <span v-else>--</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 添加操作列 -->
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="auditConfig(row)" class="btn normal">审核配置</el-button>
          <el-button link type="primary" @click="handleNodeCategory(row)" class="btn normal">细分品类</el-button>
          <el-button link type="primary" @click="handleEdit(row)" class="btn normal">编辑</el-button>
          <el-button link type="danger" @click="handleDel(row)" class="btn del">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import * as DeptApi from '@/api/system/dept'
import SWSelectPeople from './SWSelectPeople.vue'
import Sortable from 'sortablejs'
import { getDictDataPage } from '@/api/system/dict/dict.data'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { useDepartmentStore } from '@/store/modules/dept'
import { format } from 'date-fns'

const departmentStore = useDepartmentStore()
const message = useMessage() // 消息弹窗
const appStore = useAppStore()
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

const personList = ref([])
const personalIsReqeusting = ref(false)

const formatCustomDate = (dateString, formatString = 'yyyy-MM-dd HH:mm:ss') => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return format(date, formatString)
}


const remoteMethod = async (value) => {
  if (personList.value.length > 0 || personalIsReqeusting.value) {
    return personList.value || []
  }
  const params = {
    status: 2
  }
  personalIsReqeusting.value = true
  const data = await PersonRosterApi.getPersonRosterAvatarOriginList(params).catch(() => {
    personalIsReqeusting.value = false
  })
  personalIsReqeusting.value = false
  personList.value = data || []
  return data || []
}

const columnMinWidth = (field) => {
  if (field.code === 'nodeCode') {
    return '220px'
  }
  if (field.code === 'preNodeCode' || field.code === 'nextNodeCode') {
    return '300px'
  }
  if (field.code === 'nodeName') {
    return '140px'
  }
  if (field.code === 'submitType') {
    return '180px'
  } else if (field.type === 8) {
    return '240px'
  }
  return '100px'
}

const isValidJson = (str) => {
  // 检查str是否是字符串
  if (typeof str !== 'string') {
    return false
  }
  try {
    const parsed = JSON.parse(str)
    if (parsed) {
      return Array.isArray(parsed) && parsed.length > 0
    }
  } catch (e) {
    console.error('Invalid JSON:', e)
    return false
  }
}

const saveSelectPeople = (row, fieldCode) => {
  // console.log('fieldCode', row[fieldCode]);
  // row.editeCode = undefined
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')
  console.log('fieldCode', row[fieldCode])

  emit('blur', row, fieldCode)
}

// 定义类型
interface Field {
  id: string
  listDisplay: boolean
  name: string
  code: string
  state: number
  type: number
  supportSort: boolean
  dictCode: string
  options: any[]
  maxLength: string
  placeholder: string
  edit: boolean
}
// 0 文本 1 数字 2 单选 3 多选 4 日期 5 日期时间 6 开关 7 其他-部门
const detaultPlaceholderMap = {
  0: '请输入',
  1: '请输入',
  2: '请选择',
  3: '请选择',
  4: '请选择',
  5: '请选择',
  6: '',
  7: '请选择'
}

// 数字类型输入框的限制
const handleInput = (el, row, code) => {
  el > 10000 ? (row[code] = 10000) : (row[code] = el)
  if (el > 10000) {
    message.error('输入值最大不能超过10000')
  }
}

const sortProp = ref('')
//@ts-ignore
const sortOrder = ref<'ascending' | 'descending'>('')
const handleSortChange = ({ prop, order }) => {
  sortProp.value = prop
  sortOrder.value = order
  // 排序字段 1-顺序 2-倒叙 null-不排序
  const custorOrder = order == 'ascending' ? 1 : order == 'descending' ? 2 : null
  emit('sortChange', { prop, custorOrder })
}

const props = defineProps({
  tableColumns: {
    type: Array as PropType<Field[]>,
    default: () => []
  },
  tableData: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  permissionList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  templateCodeList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const sortedTableData = ref<any[]>([])
watch(
  () => props.tableData,
  (newData) => {
    sortedTableData.value = [...newData]
  },
  { immediate: true }
)

// 获取字典值
interface DicItem {
  id: string
  name: string
}

const dicList = ref<DicItem[]>([])

const initDicList = async () => {
  const params = {
    page: 1,
    size: 1000,
    type: 1
  }
  const res = await getDictDataPage(params)
  dicList.value = res.data || []
}

// 获取周休标签
const getweeklyRestLabels = (values, code) => {
  if (!Array.isArray(values) || values.length === 0) {
    return ''
  }
  const labels = values.map((item) => {
    return getDictLabel(code, item)
  })

  // 使用join方法将数组元素拼接成字符串
  return labels.join(',')
}

const formatTableValue = (row, code) => {
  // console.log('formatTableValue', code)

  let value = row[code]
  if (code === 'submitType') {
    const item = props.permissionList.find((item) => item.id === value)
    //提交人员类型
    return (item && item.name) || '--'
  }
  const column = showTableColumns.value.find((item) => item.code === code)

  // 检查是否是单选类型且dictCode有值
  if (column?.type === 2 && column.dictCode) {
    // 使用字典值来查找对应的选项
    let dictData = dicList.value.find((dict) => dict.id == column.dictCode)
    if (dictData) {
      const dictName = getDictLabel(dictData.code, value)
      return dictName || ''
    }
  } else if (column?.type === 2) {
    // 处理自定义选项的情况
    const selectItem = column.options?.find((item) => item.value === value)
    console.log('---', selectItem)
    return selectItem ? selectItem.value : ''
  }

  // 检查是否是多选类型且dictCode有值
  if (column?.type === 3 && column.dictCode) {
    // console.log('具体的值', value)
    // value = value && value.length > 0 ? value.split(',') : []
    // console.log('value', value)
    // 使用字典值来查找对应的选项
    let dictData = dicList.value.find((dict) => dict.id == column.dictCode)
    if (dictData) {
      const dictName = getweeklyRestLabels(value, dictData.code)
      // console.log('dictName', dictName)
      return dictName || ''
    }
  } else if (column?.type === 3) {
    // 处理自定义选项的情况
    // console.log('item.所选', value)
    const matchingValues = value
      .map((val) => {
        const selectItem = column.options?.find((item) => item.value === val)
        return selectItem ? selectItem.value : null
      })
      .filter((val) => val !== null)

    return matchingValues.length > 0 ? matchingValues.join(',') : ''
  }

  // 其他类型直接返回值
  return value
}

// 判断是否属于可编辑状态
const isEditable = (row, field) => {
  // console.log('row', row[field.code])
  return false
  const editablePropName = field.code + 'Editable'
  return row[editablePropName]
}

// 列表展示 && 启用状态
const showTableColumns = computed(() => {
  // 如果type为2或者3，但是options为null，则需要根据dictCode获取options
  props.tableColumns.forEach((item) => {
    if ((item.type === 2 || item.type === 3) && !item.options) {
      let dictData = dicList.value.find((dict) => dict.id == item.dictCode)
      if (dictData) {
        item.options = getIntDictOptions(dictData.code, true)
        // console.log('item.options', item.options);
      }
    }
  })

  return props.tableColumns.filter((item) => item.listDisplay && item.state == 1)
})

const emit = defineEmits([
  'pageChange',
  'edit',
  'auditConfig',
  'del',
  'sortChange',
  'dragNodeSort',
  'blur',
  'doubleClick',
  'handleSelctPeople',
  'handleNodeCategory'
])

const handleNodeCategory = (row: any) => {
  emit('handleNodeCategory', row)
}

const handleEdit = (row: any) => {
  emit('edit', row)
}

const auditConfig = (row: any) => {
  emit('auditConfig', row)
}
const handleDoubleClick = (row: any, propertyName: string) => {
  // 禁止列表编辑
  // return
  // row[propertyName + 'Editable'] = true
  // emit('doubleClick', { row, propertyName })
}

const handleBlur = (row, propertyName) => {
  emit('blur', row, propertyName)
}
const handleDel = (row: any) => {
  emit('del', row)
}
const handleClear = (row: any, code: string) => {
  emit('blur', row, code)
}
/** 初始化拖动 */
const initSortable = () => {
  // 获取el-table DOM
  const el = document.querySelector('.templateTable .el-table__body-wrapper  table tbody')
  //
  // console.log('拖动的el', el)
  Sortable.create(el, {
    animation: 150,
    ghostClass: 'blue-background-class',
    handle: '.dragHandle', //拖拽图标的类名
    onEnd: async function (/**Event*/ evt) {
      const newIndex = evt.newIndex // 排序后的索引位置
      const oldIndex = evt.oldIndex // 排序前的索引位置
      const itemEl = evt.item // 拖拽 HTMLElement
      evt.to // 目标表
      evt.from // 上一个列表
      evt.oldIndex // 元素在旧父级中的旧索引
      evt.newIndex // 元素在新父级中的新索引
      evt.clone // 克隆元件
      evt.pullMode // 当项目在另一个可排序表中时：`“clone”`如果克隆，`true`如果移动

      // console.log('排序前的索引位置', oldIndex, '排序后的索引位置', newIndex)
      // 获取原始顺序的 ID 集合
      const originalIds = sortedTableData.value.map((item) => item.nodeName)
      // 从数据中移除旧位置的元素，并在新位置插入它
      const movedItem = sortedTableData.value.splice(oldIndex, 1)[0]
      sortedTableData.value.splice(newIndex, 0, movedItem)

      // 获取排序后的 ID 集合
      const sortedIds = sortedTableData.value.map(({ id }) => ({ id }))
      // const sortedIdsName = sortedTableData.value.map((item) => item.nodeName)
      // console.log('拖动前', originalIds)
      emit('dragNodeSort', { originalIds, sortedIds })

      // console.log('发送排序请求', sortedIdsName)
    },
    //点击选中元素事件
    onChoose: function (/**Event*/ evt) {
      evt.oldIndex
    },
    //取消选中事件
    onUnchoose: function (/**Event*/ evt) { }
  })
}

// 单选
const handleVisibleChange = (row: any, code: string, visible: boolean) => {
  if (!visible) {
    emit('blur', row, code)
  }
}

/**
 * 多选
 */
// 处理多选值
const handleArrayValue = (row: any, code: string) => {
  const rowCopy = { ...row }
  // 如果是多选类型，且值是数组，则需要将数组转化为字符串
  if (Array.isArray(rowCopy[code])) {
    rowCopy[code] = rowCopy[code].length > 0 ? rowCopy[code].join(',') : ''
  }
  return rowCopy
}
// 多选 收起面板事件
const handleMutipleVisibleChange = (row: any, code: string, visible: boolean) => {
  if (!visible) {
    const newRowCopy = handleArrayValue(row, code)
    emit('blur', newRowCopy, code)
  }
}
// 多选 移除单个标签事件
const handleMutipleRemoveTag = (row: any, code: string, sliceItem: any) => {
  const newRowCopy = handleArrayValue(row, code)
  // console.log('清空', newRowCopy[code]);
  emit('blur', newRowCopy, code)
}
// 多选 清空事件
const handleMutipleClear = (row: any, code: string) => {
  const rowCopy = { ...row }
  rowCopy[code] = ''
  // console.log('清空', rowCopy[code]);
  emit('blur', rowCopy, code)
}

// 下拉-部门树形
const customProps = {
  label: 'name',
  value: 'name',
  children: 'children'
}
const departmentTreeData = ref<any>([]) // 部门树形数据
const departmentLoading = ref(false)

const getDepartmentTree = async () => {
  departmentLoading.value = true
  try {
    const data = await DeptApi.getDeptPage({})
    departmentTreeData.value = data || []
  } finally {
    departmentLoading.value = false
  }
}

/**
 * 部门 级联选择器
 */
// 部门面板收起事件
const handleCascaderVisibleChange = (row: any, code: string, visible: boolean) => {
  if (!visible) {
    const rowCopy = { ...row }
    // 将部门数组转化为字符
    rowCopy[code].length > 0 ? (rowCopy[code] = rowCopy[code].join('/')) : (rowCopy[code] = '')
    emit('blur', rowCopy, code)
  }
}

// 部门清空
const handleCascaderClear = (row: any, code: string) => {
  const rowCopy = { ...row }
  rowCopy[code] = ''
  emit('blur', rowCopy, code)
}

// 日期
const handleDateChange = (row: any, code: string, type: number) => {
  const rowCopy = { ...row }
  const dateFormat = type === 4 ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
  rowCopy[code] = rowCopy[code] ? formatCustomDate(rowCopy[code], dateFormat) : ''

  emit('blur', rowCopy, code)
}

onMounted(() => {
  // initSelectData()
  initDicList()
  initSortable()
  departmentTreeData.value = departmentStore.departmentData || []
  // 获取部门数据
  // getDepartmentTree()
})
</script>

<style lang="scss" scoped>
// @use '@/styles/eltable.scss';
.btn {
  &.normal {
    color: #0064ff;
  }

  &.del {
    color: #ff0000;
  }

  &:hover {
    opacity: 0.8;
  }
}

.dragHandle {
  width: 12px;
  cursor: pointer;
}

:deep(.el-input__wrapper) {
  border: 1px solid #e5e5e5 !important;
  box-shadow: none !important;
}

/* 鼠标经过 */
:deep(.el-table__row:hover > td) {
  background-color: #f5f9ff !important;
}

a {
  text-decoration: none;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.linkColor {
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: rgb(113, 183, 255);
}

.tableValueStyle {
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}

.is-sorted .cell {
  background-color: #f5f5f5;
}
</style>
