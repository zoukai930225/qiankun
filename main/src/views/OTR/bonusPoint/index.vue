<template>
  <div class="bonusPointWrap">
    <!-- 搜索工作栏 -->
    <ContentWrap :border-radius="0">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="-mb-15px"
            @submit.prevent
          >
            <el-form-item label="部门" prop="departmentId">
              <el-cascader
                v-model="departmentSelectedArr"
                filterable
                clearable
                placeholder="请选择"
                :props="customProps"
                :options="departmentTreeData"
              />
            </el-form-item>
            <el-form-item label="编号/名称" prop="keyword">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.keyword"
                clearable
                placeholder="请输入编号、名称搜索"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
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
            <SWFilterAdd
              class="commonAddBtn"
              :list="addList"
              :current-code="currentAddCode"
              @add-btn-click="addBtnClick"
            />

            <el-button @click="importTemplate" type="primary" style="margin-left: 16px">
              导入
            </el-button>
            <el-button type="primary" @click="downloadTemplate" style="margin-left: 16px">
              模板下载
            </el-button>
          </div>
        </div>
      </div>
    </ContentWrap>
    <ContentWrap>
      <el-table
        :header-cell-style="appStore.headerCellStyle"
        :data="list"
        :show-overflow-tooltip="true"
        row-class-name="commonTableRow1"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column label="部门名称" prop="departmentName" />
        <el-table-column label="人员名称" prop="personName" />
        <el-table-column label="工号" prop="employeeNo" />
        <el-table-column label="手机号" prop="mobile" />
        <el-table-column label="加分值" prop="addValue">
          <template #default="scope">
            <div
              @dblclick="handleDoubleClick(scope.row, 'addValue')"
              v-if="!scope.row.addValueEditable"
              >{{ scope.row.addValue || '-' }}</div
            >
            <div style="display: flex; align-items: center; margin-left: 10px" class="bonusPoint">
              <el-input
                v-model="scope.row.addValue"
                style="width: 140px"
                v-if="scope.row.addValueEditable"
                type="number"
                :min="0"
                oninput="if(value.length > 10 || (value.indexOf('.') != -1 && value.slice(value.indexOf('.')).length > 3)) value = value.slice(0, value.length - 1)"
              />
              <div
                v-if="scope.row.addValueEditable"
                class="cursor_pointer"
                style="display: flex; align-items: center; margin-left: 10px"
              >
                <img
                  src="@/assets/imgs/common/confirm.svg"
                  @click="saveEdit(scope.row, 'addValue')"
                  alt="提交"
                />
                <div class="line"> | </div>
                <img
                  src="@/assets/imgs/common/cancel.svg"
                  @click="concelEdit(scope.row, 'addValue')"
                  alt="取消"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" width="360">
          <template #default="scope">
            <div
              @dblclick="handleDoubleClick(scope.row, 'remark')"
              v-if="!scope.row.remarkEditable"
              >{{ scope.row.remark || '-' }}</div
            >
            <div style="display: flex; align-items: center; margin-left: 10px" class="bonusPoint">
              <el-input
                v-model="scope.row.remark"
                style="width: 140px"
                v-if="scope.row.remarkEditable"
              />
              <div
                v-if="scope.row.remarkEditable"
                class="cursor_pointer"
                style="display: flex; align-items: center; margin-left: 10px"
              >
                <img
                  src="@/assets/imgs/common/confirm.svg"
                  @click="saveEdit(scope.row, 'remark')"
                  alt="提交"
                />
                <div class="line"> | </div>
                <img
                  src="@/assets/imgs/common/cancel.svg"
                  @click="concelEdit(scope.row, 'remark')"
                  alt="取消"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作按钮"
          :show-overflow-tooltip="false"
          width="120"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              type="danger"
              style="cursor: pointer"
              @click="handleDelete(scope.row.id)"
              link
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />

    <!-- 新建 -->
    <AddForm ref="addDialogRef" @success="getList" />
    <!-- 导入 -->
    <UploadDialog ref="uploadDialogRef" @success="getList" @error="handleError" />
    <!-- 导入错误列表 -->
    <UploadErrorListDialog ref="uploadErrorListDialogRef" />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import AddForm from './components/addForm.vue'
import UploadErrorListDialog from './components/uploadErrorListDialog.vue'
import UploadDialog from './components/uploadDialog.vue'
import * as DeptApi from '@/api/system/dept'
import * as BonusPointApi from '@/api/otr/bonusPoint'
import { useDepartmentStore } from '@/store/modules/dept'
const departmentStore = useDepartmentStore()
defineOptions({ name: 'BonusPoint' })

const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const route = useRoute()
const inventoryId = route.query.inventoryId || ''

const total = ref(0) // 列表的总页数

const list = ref<any[]>([]) // 表格数据

const queryParams = reactive({
  page: 1,
  size: 10,
  keyword: '',
  departmentId: '',
  inventoryId: inventoryId
})
const queryFormRef = ref() // 搜索的表单
const addDialogRef = ref() // 新增弹窗
const addList = ref([
  {
    label: '新建',
    code: 'add'
  }
])

// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

const downloadTemplate = () => {
  const url = 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/template/rcpd_jfx.xls'
  window.open(url)
}

const importTemplate = () => {
  openUploadDialog(queryParams.inventoryId)
}

// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openForm('create')
    }
  }
}

// 新增
const openForm = (type: string, id?: string) => {
  if (addDialogRef.value) {
    addDialogRef.value.open(type, queryParams.inventoryId, id)
  }
}

// 打开导入弹窗
const uploadDialogRef = ref()
const openUploadDialog = (inventoryId) => {
  if (uploadDialogRef.value) {
    uploadDialogRef.value.open(inventoryId)
  }
}

// 上传错误列表弹窗
const handleError = (data) => {
  openUploadErrorListDialog(data)
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 查询列表 */
const loading = ref(false)
const getList = async () => {
  loading.value = true
  try {
    list.value = []
    const data = await BonusPointApi.getBonusPointList(queryParams).catch(() => {
      loading.value = false
    })
    list.value = data.records || []
    total.value = data.total || 0

    // 函数用于为每个属性添加Editable和OriginalValue属性
    function addEditableAndTempValueProperties(data) {
      return data.map((item) => {
        return {
          ...item,
          addValueEditable: false,
          addValueOriginalValue: item.addValue,
          remarkEditable: false,
          remarkOriginalValue: item.remark
        }
      })
    }

    // 使用函数并赋值给list.value
    list.value = addEditableAndTempValueProperties(list.value)
  } finally {
    loading.value = false
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await BonusPointApi.deleteBonusPoint({ id: id })
    message.success('删除成功')
    // 刷新列表
    await getList()
  } catch {}
}

// 双击
const handleDoubleClick = (item, propertyName) => {
  item[propertyName + 'Editable'] = true
  console.log('handleDoubleClick', item)
}

// 保存编辑
const saveEdit = async (item, propertyName) => {
  // 判断是否大于0
  if (item[propertyName] <= 0) {
    message.error('加分值必须大于0')
    return
  }
  item[propertyName] = item[propertyName]
  console.log('提交成功', item)
  await BonusPointApi.editBonusPoint(item)
    .then(() => {
      item[propertyName + 'Editable'] = false // 关闭编辑模式
      message.success('修改成功')
      getList()
    })
    .catch(() => {
      console.log('提交失败')
    })
}
// 取消编辑
const concelEdit = (item, propertyName) => {
  console.log('取消', item)
  // item.value = item.addValueOriginalValue
  // item.addValueEditable = false
  item[propertyName + 'Editable'] = false // 关闭编辑模式
  item[propertyName] = item[propertyName + 'OriginalValue']
}

const uploadErrorListDialogRef = ref(null)
// 打开上传错误列表弹窗
const openUploadErrorListDialog = (data) => {
  if (uploadErrorListDialogRef.value) {
    uploadErrorListDialogRef.value.open(data)
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 下拉-部门树形

const customProps = {
  label: 'name',
  value: 'id',
  children: 'children'
}
const departmentTreeData = ref<any>([]) // 部门树形数据
const departmentSelectedArr = ref([]) // 选中的部门id数组
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

// 监听渠道选择的变化
watch(departmentSelectedArr, (val) => {
  console.log('选择的部门', val)
  if (val && val.length > 0) {
    //  将选择的val的最后一个值赋值给queryParams.departmentId
    queryParams.departmentId = val[val.length - 1]
    getList()
  } else {
    // 清空选择
    queryParams.departmentId = ''
    getList()
  }
})

onMounted(() => {
  departmentTreeData.value = departmentStore.departmentData || []
  // 获取部门数据
  getDepartmentTree()
  // 获取列表数据
  getList()
})
</script>

<style lang="scss" scoped>
.loading {
  width: 100px;
  height: 100px;
  background-color: pink;
}
.OTRCommonMainContainer {
  background: #fff;
  &-tabs {
    margin-left: 20px;
    padding-top: 20px;
  }
}
.OTRCommonMainContainer-tabs .custom-tabs-label {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.OTRCommonMainContainer-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
.evluationMemberPopover {
  margin-right: 10px;
}
.evluationMember {
  width: 66px;
  height: 26px;
  background: rgba(210, 238, 251, 0.42);
  border-radius: 13px;
  font-size: 14px;
  color: #0064ff;
  line-height: 26px;
  text-align: center;
}

:deep(.bonusPoint .el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #e5e5e5;
}

/* 分隔线 */
.line {
  color: #b3bac9;
  margin: 0 6px;
}
</style>
