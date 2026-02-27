<template>
  <flux-wrap>
    <template #header>
      <s-w-search-form
        ref="searchFormRef"
        :schema="searchSchema"
        :expand-threshold="4"
        show-expand
        label-width="68px"
        auto-search-on-change
        @search="onSearch"
        @reset="onReset"
      >
        <hover-split-dropdown :items="actionItems" main-text="新建" @select="onActionSelect" />
      </s-w-search-form>
    </template>
    <s-table
      ref="tableRef"
      :columns="columns"
      :fetch="fetchAssetList"
      :fetch-params="queryParams"
      :pagination-map="{ pageNum: 'page', pageSize: 'pageSize' }"
      :reserve-index="true"
      stripe
      :show-overflow-tooltip="true"
      :onSortChange="onSortChange"
      :onSelectionChange="onSelectionChange"
      @pagination-change="onPaginationChange"
      pagination-teleport="#hr-admin-assets-management-footer"
      row-key="id"
    />
    <template #footer>
      <div id="hr-admin-assets-management-footer"> </div>
    </template>
  </flux-wrap>
  <SWBatchImport
    ref="importFormRef"
    :importType="1"
    @success="refreshTable"
    @fail="handleFailure"
  />
  <LinkDialog ref="linkDialogRef" @success="refreshTable" />
</template>
<script lang="tsx" setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { FormSchema } from '@/types/form'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as DeptApi from '@/api/system/dept'
import * as Asset from '@/api/hrAdmin/asset'
import { getAssetPage, getAssetAreaAll } from '@/api/hrAdmin/asset'
// removed: dialog-based EditForm
import { copyText } from '@/utils/copyText'
import { useMessage } from '@/hooks/web/useMessage'
import HoverSplitDropdown, {
  type HoverSplitItem
} from '@/components/Button/hoverSplitDropdown/index'
import SWBatchImport from '@/components/SWBatchImport/index.vue'
import download from '@/utils/download'
import { downloadByUrl } from '@/utils/download'
import PrintComponent from '@/views/hrAdmin/assetManagement/components/printComponent.vue'
import LinkDialog from '@/views/hrAdmin/assetManagement/components/linkDialog.vue'
import showMoreBtnIcon from '@/assets/imgs/common/show_more_btn.png'
import useDialog from '@/hooks/web/useDialog'
import useDrawer from '@/hooks/web/useDrawer'
import { defineAsyncComponent } from 'vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const company = computed(() => userStore?.user?.company)
const message = useMessage()

const { openDialog } = useDialog()
const { openDrawer } = useDrawer()
const QrcodeDialog = defineAsyncComponent(() => import('./components/qrcodeDialog.vue'))
const AreaDrawer = defineAsyncComponent(() => import('./components/areaDrawer.vue'))
const AssetEdit = defineAsyncComponent(() => import('./components/edit.vue'))
const BatchSeeting = defineAsyncComponent(() => import('./components/batchSeeting.vue'))

const searchFormRef = ref()
const tableRef = ref()
const importFormRef = ref()
const linkDialogRef = ref()
const selectedRows = ref<any[]>([])

const paginationTotal = ref(0)
const hasData = computed(() => paginationTotal.value > 0)

// 与 assetIndex.vue 保持一致的状态选项
const statusOptions = [
  { label: '使用中', value: '使用中' },
  { label: '空闲中', value: '空闲中' },
  { label: '报废', value: '报废' }
]

// 部门树缓存，便于在搜索时通过 id 定位节点
const deptTreeOptions = ref<any[]>([])

// 操作下拉项
const actionItems: HoverSplitItem[] = [
  { label: '新建', value: 'create', active: true },
  { label: '模版下载', value: 'template' },
  { label: '导入', value: 'import' },
  { label: '导出', value: 'export' },
  { label: '创建二维码', value: 'qrcode' },
  { label: '区域设置', value: 'area' },
  { label: '批量设置', value: 'batchSetting' },
  { label: '批量删除', value: 'batchDelete' }
]

// 查询参数（可与后续列表请求对接）
const queryParams = ref({
  page: 1,
  pageSize: 10,
  name: undefined as string | undefined, // 品名
  number: undefined as string | undefined, // 编号
  user: undefined as string | undefined, // 使用人
  department: undefined as any, // 所属部门（选择的最后一级名称）
  status: undefined as string | undefined, // 设备状态
  area: undefined as string | undefined, // 区域
  asc: undefined as number | undefined, // 排序（1/2=品名升降，3/4=编号升降）
  userId: undefined as any // 用户id（如需路由带参可在此扩展）
})

const deptCascaderProps = {
  label: 'name',
  value: 'id',
  children: 'children',
  checkStrictly: true
}

const searchSchema = ref<FormSchema[]>([
  {
    field: 'name',
    label: '品名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入品名',
      clearable: true
    }
  },
  {
    field: 'number',
    label: '编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入编号',
      clearable: true
    }
  },
  {
    field: 'user',
    label: '使用人',
    component: 'Input',
    componentProps: {
      placeholder: '请输入使用人',
      clearable: true
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择设备状态',
      clearable: true,
      options: statusOptions
    }
  },
  {
    field: 'area',
    label: '区域',
    component: 'Select',
    componentProps: {
      placeholder: '请选择区域',
      clearable: true,
      options: []
    }
  },
  // {
  //   field: 'department',
  //   label: '所属部门',
  //   formItemProps: { labelWidth: 68 },
  //   component: 'Cascader',
  //   componentProps: {
  //     placeholder: '请选择部门',
  //     clearable: true,
  //     filterable: true,
  //     props: deptCascaderProps,
  //     options: []
  //   }
  // },
  {
    field: 'zclx',
    label: '资产类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择资产类型',
      clearable: true,
      options: getIntDictOptions(DICT_TYPE.FIXED_ASSET_TYPE, true)
    }
  },
  {
    field: 'uniquelyCoded',
    label: '设备唯一ID',
    component: 'Input',
    componentProps: {
      placeholder: '请输入设备唯一ID',
      clearable: true
    }
  },
  {
    field: 'sblx',
    label: '设备类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择设备类型',
      options: [
        { label: '自购', value: '自购' },
        { label: '租赁', value: '租赁' }
      ],
      clearable: true
    }
  },
  {
    field: 'zlgs',
    label: '租赁公司',
    component: 'Input',
    componentProps: {
      placeholder: '请输入租赁公司',
      clearable: true
    }
  }
])

// 纠正部门树中每个节点的 pid，使其等于父节点的 id（用于修正第二层 pid 错误）
const fixDeptPidInPlace = (nodes: any[], parentId?: string | number) => {
  if (!Array.isArray(nodes)) return
  for (const node of nodes) {
    if (parentId !== undefined && parentId !== null) {
      node.pid = parentId
    }
    const childArr = Array.isArray(node?.children) ? node.children : []
    if (childArr.length > 0) {
      fixDeptPidInPlace(childArr, node.id)
    }
  }
}

const loadDeptTree = async () => {
  try {
    const data = await DeptApi.getAllDeptTree()
    const tree = Array.isArray(data) ? data : []
    fixDeptPidInPlace(tree)
    deptTreeOptions.value = tree
    const schema = searchSchema.value.find((it) => it.field === 'department')
    if (schema && schema.componentProps) {
      schema.componentProps.options = deptTreeOptions.value
      schema.componentProps = { ...schema.componentProps }
    }
  } catch (e) {}
}

const areaOptions = ref([])
const loadAreaOptions = async () => {
  try {
    const data = await getAssetAreaAll()
    const options = Array.isArray(data)
      ? data.map((it: any) => ({
          label: it?.qymc,
          value: it?.id,
          sszz: it?.sszz
        }))
      : []
    // 固定资产2.1优化
    if (company.value === 'SecretWorld') {
      areaOptions.value = options
    } else {
      areaOptions.value = options.filter((item: any) => item.sszz === company.value)
    }
    const schema = searchSchema.value.find((it) => it.field === 'area')
    if (schema && schema.componentProps) {
      schema.componentProps.options = areaOptions.value
      schema.componentProps = { ...schema.componentProps }
    }
    return getList()
  } catch (e) {}
}

// 根据 id 在部门树中查找节点
const findDeptNodeById = (nodes: any[], id: string | number): any | null => {
  const stack = Array.isArray(nodes) ? [...nodes] : []
  while (stack.length) {
    const node = stack.shift()
    if (!node) continue
    if (String(node.id) === String(id)) return node
    const children = Array.isArray(node.children) ? node.children : []
    for (const child of children) stack.push(child)
  }
  return null
}

// 在部门树中查找节点及其父节点
const findDeptNodeAndParentById = (
  nodes: any[],
  id: string | number
): { node: any | null; parent: any | null } => {
  const queue: Array<{ node: any; parent: any | null }> = Array.isArray(nodes)
    ? nodes.map((n) => ({ node: n, parent: null }))
    : []
  while (queue.length) {
    const current = queue.shift()
    if (!current) continue
    const { node, parent } = current
    if (String(node?.id) === String(id)) {
      return { node, parent }
    }
    const children = Array.isArray(node?.children) ? node.children : []
    for (const child of children) {
      queue.push({ node: child, parent: node })
    }
  }
  return { node: null, parent: null }
}

// 收集所有子级（所有层级）的名称
const collectDescendantNames = (node: any): string[] => {
  const result: string[] = []
  const children = Array.isArray(node?.children) ? node.children : []
  for (const child of children) {
    if (child?.name) result.push(String(child.name))
    if (Array.isArray(child?.children) && child.children.length > 0) {
      result.push(...collectDescendantNames(child))
    }
  }
  return result
}

onMounted(() => {
  loadDeptTree()
})

const clearTableSelection = () => {
  tableRef.value?.getTableRef()?.clearSelection?.()
}

const onSearch = (model: any) => {
  const { department, ...rest } = model || {}
  let deptParam: string | undefined
  if (Array.isArray(department) && department.length > 0) {
    const selectedId = department[department.length - 1]
    const { node } = findDeptNodeAndParentById(deptTreeOptions.value, selectedId)
    if (node) {
      const namesSet = new Set<string>()
      if (node?.name) namesSet.add(String(node.name))
      const descendants = collectDescendantNames(node)
      for (const n of descendants) namesSet.add(n)
      deptParam = Array.from(namesSet).join(',')
    } else {
      // 兜底：未找到节点则传选中的值
      deptParam = selectedId as any
    }
  } else {
    deptParam = undefined
  }
  queryParams.value = { ...queryParams.value, page: 1, ...rest, department: deptParam }
  refreshTable()
}

const onReset = () => {
  queryParams.value = {
    page: 1,
    pageSize: 10,
    name: undefined,
    number: undefined,
    user: undefined,
    department: undefined,
    status: undefined,
    area: undefined,
    asc: undefined,
    userId: undefined
  }
  // refreshTable()
}

const importTemplateFileDownload = async () => {
  try {
    const data = await Asset.importTemplateExport()
    if (data) {
      download.excel(data, '固定资产导入模板.xls')
    } else {
      message.error('导入模板下载失败')
    }
  } catch (e) {
    message.error('导入模板下载失败')
  }
}

const templateFileDownload = async () => {
  try {
    const data = await Asset.exportAsset()
    if (data) {
      download.excel(data, '资产管理导出.xls')
      message.success('导出成功')
    } else {
      message.error('导出失败')
    }
  } catch (e) {
    message.error('导出失败')
  }
}

const refreshTable = async () => {
  clearTableSelection()
  await nextTick()
  tableRef.value?.refresh(true)
}

const onSelectionChange = (selection: any[]) => {
  selectedRows.value = Array.isArray(selection) ? selection : []
}

const onPaginationChange = (p: { page: number; pageSize: number; total: number }) => {
  paginationTotal.value = Number(p?.total) || 0
  console.log(paginationTotal.value)
}

// 字典翻译
const translateCompany = (row: any) => {
  const Company = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY).find(
    (option) => option.value === row.company
  )
  return Company ? Company.label : row.company
}
const translateArea = (row: any) => {
  const Area = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_OFFICE_AREA).find(
    (option) => option.value === row.area
  )
  return Area ? Area.label : row.area
}

// 排序（与 assetIndex.vue 兼容）：1/2=品名升降，3/4=编号升降
const onSortChange = (sort: { prop?: string; order?: 'ascending' | 'descending' | null }) => {
  let ascVal: number | undefined
  const { prop, order } = sort || {}
  if (!order || !prop) {
    ascVal = undefined
  } else if (prop === 'name') {
    ascVal = order === 'ascending' ? 1 : 2
  } else if (prop === 'number') {
    ascVal = order === 'ascending' ? 3 : 4
  } else {
    ascVal = undefined
  }
  queryParams.value.asc = ascVal
  queryParams.value.page = 1
  refreshTable()
}

// 复制编号
const handleCopy = async (text: string) => {
  await copyText(text)
}

// 查看/删除/关联
const openForm = (type: 'create' | 'update', id?: string) => {
  openDrawer({
    title: type === 'create' ? '新建' : '查看',
    size: 936,
    content: AssetEdit,
    props: { mode: type, id, onRefresh: () => refreshTable() },
    showConfirmFooter: true,
    confirmText: '确定',
    cancelText: '取消',
    onSuccess: () => {
      refreshTable()
    }
  })
}
const handleDelete = async (row: any) => {
  try {
    if (row?.status === '使用中') {
      await message.confirm(
        '该资产正在使用中，删除后将同步清除相关人员数据，是否继续删除？',
        '系统提醒',
        true
      )
    } else {
      await message.delConfirm('确认删除该资产吗')
    }
    await Asset.deleteAsset({ ids: [row.id] })
    message.success('删除成功')
    refreshTable()
  } catch (e) {}
}

const linkBtnClick = (row: any) => {
  linkDialogRef.value?.open?.(row.id)
}

// 获取表格选中行
const getSelectedRows = (): any[] => {
  return selectedRows.value
}

// 操作：新建
const onCreate = () => {
  openForm('create')
}

// 操作：选择下拉
const onActionSelect = async (cmd: any) => {
  switch (cmd) {
    case 'create':
      onCreate()
      break
    case 'template':
      importTemplateFileDownload()
      break
    case 'import':
      importFormRef.value?.open?.()
      break
    case 'export':
      templateFileDownload()
      break
    case 'batchDelete': {
      const rows = getSelectedRows()
      if (!rows.length) {
        message.error('请先选中数据！')
        return
      }
      try {
        await message.delConfirm()
        const ids = rows.map((r) => r.id)
        await Asset.deleteAsset({ ids })
        message.success('删除成功')
        refreshTable()
      } catch (e) {}
      break
    }
    case 'qrcode':
      {
        openDialog({
          title: '创建二维码',
          width: '400px',
          content: QrcodeDialog,
          props: {
            fileName: '二维码'
          },
          showConfirmFooter: false
        })
      }
      break
    case 'area':
      openDrawer({
        title: '区域设置',
        size: 840,
        content: AreaDrawer,
        footer: false,
        beforeClose: (done) => {
          areaOptions.value = []
          refreshTable()
          done()
        }
      })
      break
    case 'batchSetting':
      {
        if(!selectedRows.value || selectedRows.value.length === 0) {
          message.warning('未选择资产')
          return
        }
        openDialog({
          title: '批量设置',
          width: '400px',
          content: BatchSeeting,
          props: {
            areaOptions: areaOptions.value,
            fixedAssetIds: selectedRows.value
          },
          onSuccess: async () => {
            await nextTick()
            refreshTable()
          }
        })
      }
      break
    default:
      break
  }
}

// s-table 列配置
const columns = ref<any[]>([
  {
    type: 'selection',
    width: 50,
    fixed: 'left',
    reserveSelection: true
  },
  {
    prop: 'images',
    label: '资产照片',
    width: 82,
    customRender: ({ row }) => {
      const src = row.images
        ? row.images
        : 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/fixedAssetPic/aca4b270-d3b3-490e-959d-39085f2155ed.png'
      return (
        <el-image
          src={src}
          preview-teleported
          style="width: 56px; height: 56px; vertical-align: middle"
          preview-src-list={row.images ? [row.images] : []}
        ></el-image>
      )
    }
  },
  {
    prop: 'name',
    label: '品名',
    minWidth: 170,
    sortable: true,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'number',
    label: '编号',
    minWidth: 140,
    showOverflowTooltip: true,
    sortable: true,
    customRender: ({ row }) => (
      <div
        style="cursor: pointer; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        onClick={() => handleCopy(row.number)}
      >
        {row.number || '-'}
      </div>
    ),
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'areaName',
    label: '区域',
    minWidth: 116,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'zclxName',
    label: '资产类型',
    minWidth: 116,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'sblx',
    label: '设备类型',
    minWidth: 100,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'zlgs',
    label: '租赁公司',
    minWidth: 180,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'kcsl',
    label: '库存',
    minWidth: 100,
    customRender: ({ row }) => {
      if (row.kcsl === -1) {
        return '无限库存'
      } else if (row.kcsl) {
        return `${row.yykcs}/${row.kcsl}`
      } else {
        return '-'
      }
    },
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'user',
    label: '使用人',
    minWidth: 100,
    customRender: ({ row }) => row.user || '行政仓库',
    align: 'left',
    headerAlign: 'left'
  },
  { prop: 'price', label: '价格', minWidth: 100, align: 'right', headerAlign: 'right' },
  {
    prop: 'status',
    label: '状态',
    align: 'left',
    headerAlign: 'left',
    minWidth: 100,
    customRender: ({ row }) => {
      return row.status ? (
        <div
          style={{
            display: 'inline-block',
            fontSize: '14px',
            padding: '4px 16px',
            textAlign: 'center',
            borderRadius: '158px',
            background:
              row.status === '使用中'
                ? 'rgba(52, 155, 52, 0.2)'
                : row.status === '空闲中'
                  ? 'rgba(0, 100, 255, 0.2)'
                  : 'rgba(255, 0, 0, 0.2)',
            minWidth: '74px',
            color:
              row.status === '使用中' ? '#349B34' : row.status === '空闲中' ? '#0064FF' : '#FF0000'
          }}
        >
          {row.status}
        </div>
      ) : (
        '-'
      )
    }
  },
  {
    prop: 'uniquelyCoded',
    label: '设备唯一ID',
    minWidth: 116,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    headerAlign: 'left',
    align: 'left',
    width: 185,
    showOverflowTooltip: false,
    customRender: ({ row }) => (
      <div class="actions left">
        <el-button type="primary" link onClick={() => openForm('update', row.id)}>
          查看
        </el-button>
        {/* <el-button type="primary" link onClick={() => linkBtnClick(row)}>
          关联
        </el-button> */}
        <el-button type="danger" link onClick={() => handleDelete(row)}>
          删除
        </el-button>
        <el-popover
          placement="bottom"
          width={85}
          trigger="hover"
          showArrow={false}
          popperClass="assetManageCustomPopper"
          v-slots={{
            reference: () => <img class="commonShowMoreIcon ml-5px" src={showMoreBtnIcon} />,
            default: () => (
              <div class="flex flex-col">
                <PrintComponent
                  class="item"
                  data={{
                    barcodeEncode: row.barcodeEncode,
                    barcodeFileUrl: row.barcodeFileUrl,
                    number: row.number
                  }}
                />
              </div>
            )
          }}
        />
      </div>
    )
  }
])

// s-table 获取数据
const fetchAssetList = async (params: any) => {
  if(!areaOptions.value || areaOptions.value.length === 0) {
    return loadAreaOptions()
  } else {
    return getList(params)
  }
}

const getList = async (params: any) => {
  // 将 s-table 的分页参数映射到后端期望
  const { page, pageSize, ...rest } = params || {}
  const reqParams = {
    ...queryParams.value,
    ...rest,
    page: page || queryParams.value.page || 1,
    pageSize: pageSize || queryParams.value.pageSize || 10
  }
  const area = reqParams['area']
  // 固定资产2.1优化
  if(area) {
    reqParams['areas'] = area ? [area] : []
  } else {
    if(company.value !== 'SecretWorld' && !area) {
      reqParams['areas'] = areaOptions.value.map((item: any) => item.value)
    }
  }
  delete reqParams['area']
  const res: any = await getAssetPage(reqParams)
  return {
    records: Array.isArray(res?.record) ? res.record : [],
    total: Number(res?.total) || 0
  }
}

// 处理导入报错
const handleFailure = (res: any) => {
  try {
    const { data } = res
    downloadByUrl(data)
  } catch (e) {}
}
</script>
<style scoped lang="scss">
.rightShowMoreMenu {
  // background: #ffffff;
  // box-shadow: 0px 0px 6px 0px rgba(0, 31, 72, 0.21);
  // border-radius: 4px;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // .item {
  //   width: 100%;
  //   height: 28px;
  //   margin-bottom: 6px;
  //   text-align: center;
  //   line-height: 28px;
  // }
}

:deep(.sw-search) {
  .el-form {
    .el-form-item {
      margin-right: 16px;
    }

    .el-select,
    .el-date-editor,
    .el-input {
      width: 235px;
      box-sizing: border-box;
    }
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
