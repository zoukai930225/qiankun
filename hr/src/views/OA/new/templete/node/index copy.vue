<template>
  <!-- 列表 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="100px"
          @submit.prevent="handleQuery"
        >
          <el-form-item label="名称" prop="nodeName">
            <el-input
              v-model="queryParams.nodeName"
              class="searchFormItemWidth"
              :prefix-icon="Search"
              clearable
              placeholder="请输入节点名称"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <!-- <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button> -->
          <SWFilterAdd
            class="commonAddBtn"
            :list="addList"
            :current-code="currentAddCode"
            :loading="refreshLoading"
            @add-btn-click="addBtnClick"
          />
        </div>
      </div>
    </div>
  </ContentWrap>
  <ContentWrap>
    <div class="tableWrap">
      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        class="SWCommonTable templateTable"
        header-row-class-name="headerRowClassName"
        header-cell-class-name="headerCellClassName"
        row-class-name="rowClassName"
        :show-overflow-tooltip="true"
        v-horizontal-scroll="'always'"
        element-loading-text="数据加载中..."
        row-key="id"
      >
        <el-table-column label="" width="50">
          <img class="dragHandle" src="@/assets/imgs/system/fieldManageConfig/drog.png" alt="" />
        </el-table-column>
        <el-table-column label="节点" prop="nodeName">
          <template #default="scope">
            <div v-if="!scope.row.nodeNameEditable">
              <!-- 显示状态 -->
              <span @dblclick="handleDoubleClick(scope.row, 'nodeName')">{{
                scope.row.nodeName
              }}</span>
            </div>
            <div v-else>
              <!-- 编辑状态 -->
              <el-input
                v-model="scope.row.nodeName"
                @blur="handleBlur(scope.row, 'nodeName')"
                @keyup.enter="handleBlur(scope.row, 'nodeName')"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="部门名称" prop="depName">
          <template #default="scope">
            <div v-if="!scope.row.depNameEditable">
              <!-- 显示状态 -->
              <span @dblclick="handleDoubleClick(scope.row, 'depName')">{{
                scope.row.depName
              }}</span>
            </div>
            <div v-else>
              <!-- 编辑状态 -->
              <el-cascader
                v-model="scope.row.depName"
                filterable
                clearable
                value-on-clear=""
                placeholder="请选择"
                :props="customProps"
                :options="departmentTreeData"
                @visible-change="(val) => handleCascaderVisibleChange(scope.row, 'depName', val)"
                @clear="handleCascaderClear(scope.row, 'depName')"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="节点顺序" prop="nodeOrder">
          <template #default="scope">
            <div v-if="!scope.row.nodeOrderEditable">
              <!-- 显示状态 -->
              <span @dblclick="handleDoubleClick(scope.row, 'nodeOrder')">{{
                scope.row.nodeOrder
              }}</span>
            </div>
            <div v-else>
              <!-- 编辑状态 -->
              <el-input
                v-model="scope.row.nodeOrder"
                type="number"
                min="1"
                @blur="handleBlur(scope.row, 'nodeOrder')"
                @keyup.enter="handleBlur(scope.row, 'nodeOrder')"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="自动开始" prop="autoStart">
          <template #default="scope">
            <div v-if="!scope.row.autoStartEditable">
              <!-- 显示状态 -->
              <span @dblclick="handleDoubleClick(scope.row, 'autoStart')">{{
                getDictLabel(DICT_TYPE.SYSTEM_PARAM_WHETHER, scope.row.autoStart)
              }}</span>
            </div>
            <div v-else>
              <!-- 编辑状态 -->
              <el-select
                ref="autoStartSelectRef"
                v-model="scope.row.autoStart"
                placeholder="请选择"
                clearable
                value-on-clear=""
                @visible-change="(val) => handleVisibleChange(scope.row, 'autoStart', val)"
                @clear="handleSelectClear(scope.row, 'autoStart')"
                @blur="handleSelectBlur(scope.row, 'autoStart')"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="预警时长" prop="warningDuration">
          <template #default="scope">
            <div v-if="!scope.row.warningDurationEditable">
              <!-- 显示状态 -->
              <span @dblclick="handleDoubleClick(scope.row, 'warningDuration')">{{
                scope.row.warningDuration
              }}</span>
            </div>
            <div v-else>
              <!-- 编辑状态 -->
              <el-input
                v-model="scope.row.warningDuration"
                type="number"
                min="1"
                @blur="handleBlur(scope.row, 'warningDuration')"
                @keyup.enter="handleBlur(scope.row, 'warningDuration')"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="基准时长" prop="basisDuration">
          <template #default="scope">
            <div v-if="!scope.row.basisDurationEditable">
              <!-- 显示状态 -->
              <span @dblclick="handleDoubleClick(scope.row, 'basisDuration')">{{
                scope.row.basisDuration
              }}</span>
            </div>
            <div v-else>
              <!-- 编辑状态 -->
              <el-input
                v-model="scope.row.basisDuration"
                type="number"
                min="1"
                @blur="handleBlur(scope.row, 'basisDuration')"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时长单位" prop="durationUnit">
          <template #default="scope">
            <div v-if="!scope.row.durationUnitEditable">
              <!-- 显示状态 -->
              <span @dblclick="handleDoubleClick(scope.row, 'durationUnit')">{{
                getDictLabel(DICT_TYPE.OA_DURATION_UNIT, scope.row.durationUnit)
              }}</span>
            </div>
            <div v-else>
              <!-- 编辑状态 -->
              <el-select
                v-model="scope.row.durationUnit"
                placeholder="请选择"
                clearable
                value-on-clear=""
                @visible-change="(val) => handleVisibleChange(scope.row, 'durationUnit', val)"
                @blur="handleSelectBlur(scope.row, 'durationUnit')"
                @clear="handleSelectClear(scope.row, 'durationUnit')"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.OA_DURATION_UNIT, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="周休" prop="weeklyRest">
          <template #default="scope">
            <div v-if="!scope.row.weeklyRestEditable">
              <!-- 显示状态 -->
              <span @dblclick="handleDoubleClick(scope.row, 'weeklyRest')">
                {{ getweeklyRestLabels(scope.row.weeklyRest) }}
              </span>
            </div>
            <div v-else>
              <!-- 编辑状态 -->
              <el-select
                v-model="scope.row.weeklyRest"
                placeholder="请选择"
                clearable
                multiple
                value-on-clear=""
                @visible-change="
                  (val) => handleWeeklyRestVisibleChange(scope.row, 'weeklyRest', val)
                "
                @blur="handleSelectBlur(scope.row, 'weeklyRest')"
                @clear="handleSelectClear(scope.row, 'weeklyRest')"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.OA_WEEKLY_REST, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          :show-overflow-tooltip="false"
          width="100"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-button type="danger" icon="delete" @click="handleDelete(scope.row.id)" link>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import Sortable from 'sortablejs'
import * as DeptApi from '@/api/system/dept'
import * as TempleteApi from '@/api/oa/new/templete'
import { ref } from 'vue'
import { useDepartmentStore } from '@/store/modules/dept'
import { useAppStore } from '@/store/modules/app'
const departmentStore = useDepartmentStore()
const appStore = useAppStore()
const route = useRoute() // 路由
defineOptions({ name: 'TempleteNode' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<any[]>([]) // 表格数据

const queryFormRef = ref() // 查询条件
const queryParams = ref({
  nodeName: '' // 节点名称
})

// 获取周休标签
const getweeklyRestLabels = (values) => {
  if (!values || values.length === 0) {
    return ''
  }
  const labels = values.map((item) => {
    return getDictLabel(DICT_TYPE.OA_WEEKLY_REST, item)
  })

  // 使用join方法将数组元素拼接成字符串
  return labels.join(',')
}

// 表格属性 需要编辑
const properties = [
  'nodeName',
  'depName',
  'nodeOrder',
  'autoStart',
  'warningDuration',
  'basisDuration',
  'durationUnit',
  'weeklyRest'
]

const refreshLoading = ref(false)
const addList = ref([
  {
    label: '新增节点',
    code: 'add'
  }
])
// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = async (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      createNewRow()
    }
  }
}

// 新增
const createNewRow = async () => {
  const newRow = {}

  // 初始化每个属性及其Editable属性为true
  properties.forEach((prop) => {
    // 对于weeklyRest属性，初始化为空数组

    newRow[prop] = ''

    newRow[prop + 'Editable'] = true
  })
  // 先请求保存接口，刷新列表后新增的这一条数据就有了唯一id
  await TempleteApi.saveNode({ ...newRow, templateId: route.params.templeteId })
  await getList()
}

/** 查询列表 */
const getList = async () => {
  try {
    loading.value = true
    let formData = new FormData()
    formData.append(
      'queryParam',
      JSON.stringify({
        ...queryParams.value
      })
    )
    if (route.params.templeteId) {
      formData.append('templateId', route.params.templeteId as string) //在请求参数里加上模版id
    }

    const res = await TempleteApi.nodeList({
      data: formData
    })
    loading.value = false
    list.value = res || []
    // console.log('处理前数据', list.value)
    // 根据节点排序进行排序
    list.value.sort((a, b) => a.nodeOrder - b.nodeOrder)

    // 给每个数据添加可编辑状态
    function addEditableAndTempValueProperties(data) {
      return data.map((item) => {
        const newItem = { ...item }
        properties.forEach((prop) => {
          newItem[prop + 'Editable'] = item[prop] === '' || item[prop].length === 0 // 初始状态为可编辑
          newItem[prop + 'OriginalValue'] = item[prop] // 保存原始值,如果后面需要恢复初始值
        })

        return newItem
      })
    }
    list.value = addEditableAndTempValueProperties(list.value)

    list.value.forEach((item) => {
      // 处理周休，如果字符串不为空，则分割成数组，否则设置为空数组
      item.weeklyRest = item.weeklyRest.length > 0 ? item.weeklyRest.split(',') : []

      // 判断预警时长，基准时长，节点顺序是否等于0，如果等于0或未定义，则赋值为1
      item.warningDuration = item.warningDuration || 1
      item.basisDuration = item.basisDuration || 1
      item.nodeOrder = item.nodeOrder || 1
    })

    console.log('处理后数据', list.value)
  } catch (error) {
    loading.value = false
  }
}

/** 搜索操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await TempleteApi.deleteNode(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化拖动 */
const initSortable = () => {
  // 获取el-table DOM
  const el = document.querySelector('.templateTable .el-table__body-wrapper  table tbody')
  //
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

      // 获取原始顺序的 ID 集合
      const originalIds = list.value.map((item) => item.name)
      // 从数据中移除旧位置的元素，并在新位置插入它
      const movedItem = list.value.splice(oldIndex, 1)[0]
      list.value.splice(newIndex, 0, movedItem)

      // 获取排序后的 ID 集合
      const sortedIds = list.value.map(({ id }) => ({ id }))

      await TempleteApi.dragNodeSort(sortedIds)
      message.success('操作成功')
      await getList()

      // 发送排序请求
      // console.log('原始顺序的 ID 集合:', originalIds)
      console.log('发送排序请求', sortedIds)
    },
    //点击选中元素事件
    onChoose: function (/**Event*/ evt) {
      evt.oldIndex
    },
    //取消选中事件
    onUnchoose: function (/**Event*/ evt) {}
  })
}

/** 双击事件 */
const handleDoubleClick = (item, propertyName) => {
  item[propertyName + 'Editable'] = true

  // 如果是部门名称，需要将数据处理成数组，回显
  if (propertyName === 'depName') {
    console.log('双击事件', item[propertyName])
    // 打开面板的时候，处理回显
    item[propertyName] = item[propertyName].split('/')
    console.log('双击事件处理后', item[propertyName])
  }
  if (propertyName === 'weeklyRest') {
    // 打开面板的时候，处理回显
    item[propertyName] = item[propertyName].split(',')
  }
}

/** 普通输入框失去焦点事件 */
const handleBlur = async (row, propertyName) => {
  if (propertyName === 'nodeName' && row[propertyName] === '') return // 节点名称不能为空
  const rowCopy = { ...row }
  handleSubmitData(rowCopy) // 保存数据
}

// 部门选择
const handleCascaderVisibleChange = async (row, propertyName, visible) => {
  if (!visible) {
    const rowCopy = { ...row }
    // 将部门数组转化为字符
    if (rowCopy[propertyName].length > 0) {
      rowCopy[propertyName] = rowCopy[propertyName].join('/')
    } else {
      rowCopy[propertyName] = ''
    }

    handleSubmitData(rowCopy) // 保存数据
  }
}

// 部门选择清空
const handleCascaderClear = async (row, propertyName) => {
  console.log('清空', row[propertyName])
  const rowCopy = { ...row }
  handleSubmitData(rowCopy) // 保存数据
}

// 选择器 关闭面板
const handleVisibleChange = async (row, propertyName, visible) => {
  if (!visible) {
    console.log('关闭面板', row[propertyName])
    const rowCopy = { ...row }

    handleSubmitData(rowCopy) // 保存数据
  }
}

// 选择器 失去焦点事件
const handleSelectBlur = async (row, propertyName) => {
  const rowCopy = { ...row }

  handleSubmitData(rowCopy) // 保存数据
}

// 选择清空
const handleSelectClear = async (row, propertyName) => {
  console.log('清空', row[propertyName])
  const rowCopy = { ...row }
  handleSubmitData(rowCopy) // 保存数据
}

// 周休
const handleWeeklyRestVisibleChange = async (row, propertyName, visible) => {
  if (!visible) {
    const rowCopy = { ...row }
    handleSubmitData(rowCopy) // 保存数据
    console.log('请求参数', rowCopy)
  }
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

// 处理提交数据
const handleSubmitData = async (rowCopy) => {
  // 判断部门是否为数组
  if (Array.isArray(rowCopy.depName) && rowCopy.depName.length > 0) {
    rowCopy.depName = rowCopy.depName.join('/')
  }

  // 处理周休
  if (rowCopy['weeklyRest'].length > 0) {
    rowCopy['weeklyRest'] = rowCopy['weeklyRest'].join(',')
  } else {
    rowCopy['weeklyRest'] = ''
  }

  // 剔除jsonData属性以及Editable和OriginalValue属性
  const rowWithoutSpecialFields = Object.keys(rowCopy).reduce((acc, key) => {
    if (!key.endsWith('Editable') && !key.endsWith('OriginalValue') && key !== 'jsonData') {
      acc[key] = rowCopy[key]
    }
    return acc
  }, {})

  await TempleteApi.updateNode({
    ...rowWithoutSpecialFields,
    templateId: route.params.templeteId
  })
  message.success('修改成功')
  // 刷新列表
  await getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
  initSortable()
  departmentTreeData.value = departmentStore.departmentData || []
  // 获取部门数据
  getDepartmentTree()
})
</script>

<style lang="scss" scoped>
@use '@/styles/eltable.scss';
.dragHandle {
  width: 12px;
  cursor: pointer;
}
:deep(.tableWrap .el-input__wrapper) {
  border: 1px solid #e5e5e5;
  box-shadow: none;
}

// 密码显示隐藏
.icon-view-password {
  cursor: pointer;
  margin-left: 5px;
  vertical-align: middle;
}
</style>
