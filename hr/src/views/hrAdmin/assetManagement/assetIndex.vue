<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" :label-width="55">
            <el-form-item label="品名" prop="name">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.name"
                placeholder="请输入品名"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="编号" prop="number">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.number"
                placeholder="请输入编号"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="使用人" prop="user">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.user"
                placeholder="请输入使用人"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.status"
                placeholder="请选择设备状态"
                clearable
                @change="handleQuery"
                @clear="handleQuery"
              >
                <el-option
                  v-for="dict in statusList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item v-show="isExpand" label="区域" prop="area">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.area"
                placeholder="请选择区域"
                clearable
                @change="handleQuery"
                @clear="handleQuery"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_OFFICE_AREA, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-show="isExpand" label="所属部门" prop="department" label-width="68">
              <!-- <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.department"
                placeholder="请输入所属部门"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              /> -->
              <Menuitem ref="menuitemRef" @change="handleSearch" />
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
              重置
            </el-button>
            <el-button
              style="margin-left: 8px; font-size: 12px; color: #666666"
              @click="batchDelete"
            >
              批量删除
            </el-button>
            <!-- 新建 -->
            <SWFilterAdd
              class="commonAddBtn"
              :list="addList"
              :current-code="currentAddCode"
              :loading="addBtnLoading"
              @add-btn-click="addBtnClick"
            />
          </div>
        </div>
      </div>
      <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
    </div>

    <el-table
      :data="list"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      key="table1"
      :stripe="true"
      :show-overflow-tooltip="true"
      row-class-name="commonTableRow"
      @selection-change="handleSelectionChange"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="资产照片" prop="images" width="100px">
        <template #default="scope">
          <div class="row-center">
            <el-image
              :src="scope.row.images ? scope.row.images : asset_default"
              :preview-src-list="[scope.row.images]"
              preview-teleported
              style="width: 56px; height: 56px; vertical-align: middle"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    src="https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/fixedAssetPic/aca4b270-d3b3-490e-959d-39085f2155ed.png"
                    alt=""
                    style="width: 56px; height: 56px; vertical-align: middle"
                  />
                </div>
              </template>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品名" prop="name" min-width="100">
        <template #header>
          <div class="flex-row">
            <span>品名</span>
            <div class="flex-column">
              <img
                class="ml-5px mt-5px"
                @click="handleSort(1)"
                v-if="queryParams.asc == 1"
                src="@/assets/imgs/common/caret-top_active.png"
                alt=""
                style="width: 8px"
              />
              <img
                class="ml-5px mt-5px"
                @click="handleSort(1)"
                v-else
                src="@/assets/imgs/common/caret-top.png"
                alt=""
                style="width: 8px"
              />
              <img
                class="ml-5px mt-5px"
                @click="handleSort(2)"
                v-if="queryParams.asc == 2"
                src="@/assets/imgs/common/caret-bottom_active.png"
                alt=""
                style="width: 8px"
              />
              <img
                class="ml-5px mt-5px"
                @click="handleSort(2)"
                v-else
                src="@/assets/imgs/common/caret-bottom.png"
                alt=""
                style="width: 8px"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="number" min-width="120" :show-overflow-tooltip="false">
        <template #header>
          <div class="flex-row">
            <span>编号</span>
            <div class="flex-column">
              <img
                class="ml-5px mt-5px"
                @click="handleSort(3)"
                v-if="queryParams.asc == 3"
                src="@/assets/imgs/common/caret-top_active.png"
                alt=""
                style="width: 8px"
              />
              <img
                class="ml-5px mt-5px"
                @click="handleSort(3)"
                v-else
                src="@/assets/imgs/common/caret-top.png"
                alt=""
                style="width: 8px"
              />
              <img
                class="ml-5px mt-5px"
                @click="handleSort(4)"
                v-if="queryParams.asc == 4"
                src="@/assets/imgs/common/caret-bottom_active.png"
                alt=""
                style="width: 8px"
              />
              <img
                class="ml-5px mt-5px"
                @click="handleSort(4)"
                v-else
                src="@/assets/imgs/common/caret-bottom.png"
                alt=""
                style="width: 8px"
              />
            </div>
          </div>
        </template>
        <template #default="scope">
          <div style="cursor: pointer" @click="handleCopy(scope.row.number)">
            {{ scope.row.number }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="区域" prop="area" :formatter="translateArea" min-width="150" />
      <el-table-column
        label="所属公司"
        prop="company"
        :formatter="translateCompany"
        min-width="180"
      />
      <el-table-column label="所属部门" prop="department" min-width="100">
        <template #default="scope">
          <div>
            {{ scope.row.secondDepartment }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="使用人" prop="user" min-width="100" />
      <el-table-column label="价格" prop="price" min-width="100" />
      <el-table-column label="状态" prop="status" min-width="100">
        <template #default="scope">
          <div class="row-center">
            <div
              :style="{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                marginRight: '8px',
                background:
                  scope.row.status === '使用中'
                    ? '#34cd02'
                    : scope.row.status === '空闲中'
                      ? '#2F8DF5'
                      : 'red'
              }"
            ></div>
            <div>{{ scope.row.status }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="120">
        <template #default="scope">
          <div class="row-center">
            <div class="row-center" @click="openForm('update', scope.row.id)">
              <!-- <img class="operateSeeIcon" src="@/assets/imgs/common/operate_see.png" /> -->
              <div class="operateText">查看</div>
            </div>
            <!-- 打印操作 -->
            <!-- <printComponent
              :data="{
                barcodeEncode: scope.row.barcodeEncode,
                barcodeFileUrl: scope.row.barcodeFileUrl,
                number: scope.row.number
              }"
            /> -->
            <div style="width: 14px"></div>
            <div class="row-center" @click="handleDelete(scope.row.id)">
              <!-- <img class="operateSeeIcon" src="@/assets/imgs/common/operate_delete.png" /> -->
              <div class="operateTextDel">删除</div>
            </div>
            <div style="width: 14px"></div>
            <el-popover
              ref="rightElPopperRef"
              placement="bottom"
              :width="85"
              trigger="hover"
              :show-arrow="false"
              popper-class="assetManageCustomPopper"
            >
              <template #reference>
                <img class="commonShowMoreIcon" src="@/assets/imgs/common/show_more_btn.png" />
              </template>
              <div class="rightShowMoreMenu">
                <div style="height: 10px"></div>
                <div
                  class="item"
                  style="background: #f3f4f7; color: #0078ff; cursor: pointer"
                  @click="linkBtnClick(scope.row)"
                  >关联</div
                >
                <printComponent
                  class="item"
                  :data="{
                    barcodeEncode: scope.row.barcodeEncode,
                    barcodeFileUrl: scope.row.barcodeFileUrl,
                    number: scope.row.number
                  }"
                />
                <div style="height: 4px"></div>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <EditForm ref="formRef" @success="getList" />
  <!-- 表单弹窗：导入 -->
  <SWBatchImport ref="importFormRef" :importType="1" @success="getList" />
  <LinkDialog ref="linkDialogRef" @success="getList" />
</template>

<script lang="ts" setup>
defineOptions({ name: 'AssetIndex' })
import { useAppStore } from '@/store/modules/app'
import EditForm from './components/editForm.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import download from '@/utils/download'
import * as Asset from '@/api/hrAdmin/asset'
import { copyText } from '@/utils/copyText'
import SWBatchImport from '@/components/SWBatchImport/index.vue' // 导入组件
import SWFilterAdd from '@/components/SWBaseComponent/SWFilterAdd/index.vue' // 导入组件
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
import printComponent from './components/printComponent.vue' //打印组件
import LinkDialog from './components/linkDialog.vue'

import asset_default from '@/assets/imgs/asset_default.png'
import { Search } from '@element-plus/icons-vue'
import Menuitem from './components/Menuitem.vue'
const route = useRoute()
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const appStore = useAppStore()

const isExpand = ref(false) // 是否展开

const routeUserId = ref(route.query.userId) // 用户id

/** 导入操作 */
const importFormRef = ref()
const importData = () => {
  importFormRef.value.open()
}

const addList = ref([
  {
    label: '新建',
    code: 'add'
  },
  {
    label: '导入模版下载',
    code: 'template'
  },
  {
    label: '导入',
    code: 'import'
  },
  {
    label: '导出',
    code: 'export'
  }
])
// 当前新增按钮code码
const currentAddCode = ref('add')
const addBtnLoading = ref(false)

// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openForm('create')
    } else if (currentAddCode.value === 'template') {
      importTemplateFileDownload()
    } else if (currentAddCode.value === 'import') {
      importData()
    } else if (currentAddCode.value === 'export') {
      templateFileDownload()
    }
  }
}

// 设备状态
const statusList = [
  { label: '使用中', value: '使用中' },
  { label: '空闲中', value: '空闲中' },
  { label: '报废', value: '报废' }
]

/**
 * 多选
 */
const multipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}

/** 查询字典类型列表 */
const total = ref(10) // 列表的总页数
const list = ref<any[]>([])
const loading = ref(false) // 列表的加载中
const getList = async () => {
  loading.value = true
  try {
    const data = await Asset.getAssetPage(queryParams.value).catch(() => {
      loading.value = false
    })
    list.value = data.record || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}
// 所属公司
const translateCompany = (row) => {
  const Company = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY).find(
    (option) => option.value === row.company
  )
  return Company ? Company.label : row.company
}
// const getFilteredDictOptions = (dictType) => {
//   return getIntDictOptions(dictType)
// }
// 区域
const translateArea = (row) => {
  const Area = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_OFFICE_AREA).find(
    (option) => option.value === row.area
  )
  return Area ? Area.label : row.area
}

/** 搜索按钮操作 */
const queryFormRef = ref() // 搜索的表单
const queryParams = ref({
  page: 1,
  pageSize: 10,
  name: undefined, //品名
  number: undefined, //编号
  user: undefined, //使用人
  department: undefined, //所属部门
  status: undefined, //设备状态
  area: undefined, //区域
  asc: undefined, //排序
  userId: routeUserId //用户id
})
// 搜索
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

const menuitemRef = ref()
/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.value = {
    page: 1,
    pageSize: 10,
    name: undefined, //品名
    number: undefined, //编号
    user: undefined, //使用人
    department: undefined, //所属部门
    area: undefined, //区域
    status: undefined, //设备状态
    asc: undefined, //排序
    userId: undefined //用户id
  }

  queryFormRef.value.resetFields()
  menuitemRef.value?.reset?.()
  handleQuery()
}

// 批量删除
const batchDelete = async () => {
  if (multipleSelection.value.length === 0) {
    message.error('请先选中数据！')
  } else {
    try {
      await message.delConfirm()
      const ids = ref<string[]>([])
      multipleSelection.value.forEach((item) => {
        ids.value.push(item.id)
      })
      await Asset.deleteAsset({ ids: ids.value })
      message.success(t('common.delSuccess'))
      await getList()
    } catch {}
  }
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id)
  }
}
/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    await message.delConfirm()
    const ids = ref<string[]>([])
    if (id) {
      ids.value.push(id)
    }
    await Asset.deleteAsset({ ids: ids.value })
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

// 复制文本到剪贴板的函数
const handleCopy = async (text) => {
  await copyText(text)
}

// 处理排序
const handleSort = (sortOrderType) => {
  queryParams.value.asc = sortOrderType
  queryParams.value.page = 1
  getList()
}

/** 导入模版下载 */

const importTemplateFileDownload = async () => {
  addBtnLoading.value = true
  const data = await Asset.importTemplateExport().catch(() => {
    addBtnLoading.value = false
  })
  addBtnLoading.value = false
  if (data) {
    download.excel(data, '固定资产导入模板.xls')
  }
}

/** 导出功能 */
const templateFileDownload = async () => {
  try {
    addBtnLoading.value = true
    const data = await Asset.exportAsset()
    if (data) {
      download.excel(data, '资产管理导出.xls')
      message.success('导出成功')
    } else {
      message.error('导出失败')
    }
  } catch (error) {
    message.error('导出失败')
  } finally {
    addBtnLoading.value = false
  }
}

const rightElPopperRef = ref()
const linkDialogRef = ref()
// 关联
const linkBtnClick = (row) => {
  rightElPopperRef.value.hide()
  linkDialogRef.value.open(row.id)
}

// 搜索
const handleSearch = (value, length) => {
  console.log(String(value), 'value')
  queryParams.value.page = 1
  queryParams.value.department = value
  // if (value) {
  //   queryParams.value.department = value[value.length - 1]
  // }
  if (length === 2) {
    getList()
  }
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  align-items: center;
  cursor: pointer;
}
:deep(.el-button) {
  margin-left: 0px;
}
.rightShowMoreMenu {
  // margin: -13px;
  // margin-top: -18px;
  background: #ffffff;
  box-shadow: 0px 0px 6px 0px rgba(0, 31, 72, 0.21);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .item {
    width: 100%;
    height: 28px;
    margin-bottom: 6px;
    text-align: center;
    line-height: 28px;
  }
}
</style>
<style lang="scss">
.assetManageCustomPopper {
  min-width: 85px !important;
  margin: 0px !important;
  padding: 0px !important;
}
</style>
