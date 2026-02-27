<template>
  <ContentWrap>

    <!-- <flux-wrap> -->
      <!-- <template #header> -->
        <s-w-search-form
          :schema="schema"
          @search="onSearch"
          auto-search-on-change
          :expand-threshold="4"
        >
          <!-- <el-button type="primary" @click="onAdd">
            <el-icon :size="12" class="mr-5px">
              <Plus />
            </el-icon>
            新增
          </el-button> -->
        </s-w-search-form>
      <!-- </template> -->
  
      <s-table
        ref="tableRef"
        border
        :columns="columns"
        :fetch="getList"
        :fetch-params="queryParams"
        row-key="id"
        pagination-teleport="#supplier-fabric-management-center-footer"
      >
        <template #actions="{ row }">
          <div class="actions left">
            <el-button link type="primary" @click="openChooseRecord(row)">选用记录</el-button>
            <el-button link type="primary" @click="choose(row)" v-if="row?.showChooseButton">面料选用</el-button>
            <el-button link type="primary" @click="onView(row)">查看详情</el-button>
            <!-- <el-button link type="primary" @click="onEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="onDelete(row)">删除</el-button> -->
          </div>
        </template>
      </s-table>
  
      <!-- <template #footer> -->
        <div id="supplier-fabric-management-center-footer"></div>
      <!-- </template> -->
    <!-- </flux-wrap> -->
  </ContentWrap>
</template>
<script lang="tsx" setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import type { FormSchema } from '@/types/form'
import type { TableColumn } from '@/components/SWTable/src/table'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useDrawer } from '@/hooks/web/useDrawer'
import Form from './components/form.vue'
import Detail from './components/detail.vue'
import {
  getFabricCenterPage,
  getFabricClassSelectlist,
  deleteFabricCenter
} from '@/api/supplier/fabricManagement/center'
import { useMessage } from '@/hooks/web/useMessage'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'

defineOptions({ name: 'SupplierFabricManagementCenter' })

const tableRef = ref()
const { openDrawer } = useDrawer()
const message = useMessage()
const router = useRouter()

// 查询参数（按后端字段命名）
const queryParams = ref<any>({
  categorys: [],
  category: '',
  fabricClassId: '',
  name: '',
  planTimeBegin: '',
  planTimeEnd: ''
})

// 分类下拉（本地筛选，初始化加载一次）
const fabricClassOptions = ref<any[]>([])
const fabricClassLoading = ref(false)

const loadInitialFabricClassOptions = async () => {
  fabricClassLoading.value = true
  try {
    const res: any = await getFabricClassSelectlist({ name: '' })
    let list: any[] = []
    if (Array.isArray(res?.records)) list = res.records
    else if (Array.isArray(res?.data)) list = res.data
    else if (Array.isArray(res)) list = res
    fabricClassOptions.value = list
  } catch (e) {
    fabricClassOptions.value = []
  } finally {
    fabricClassLoading.value = false
  }
}

onMounted(() => {
  loadInitialFabricClassOptions()
})

const schema = ref<FormSchema[]>([
  {
    field: 'fabricName',
    label: '面料名称',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    itemWidth: 220
  },
  {
    field: 'categorys',
    label: '品类',
    // component: 'Select',
    // componentProps: {
    //   placeholder: '请选择',
    //   clearable: true,
    //   options: getIntDictOptions(DICT_TYPE.FABRIC_CATEGORY, true)
    // },
    itemWidth: 220,
    customRender: () => (
      <CategorySelect
        v-model={queryParams.value.categorys}
        onChange={() => onSearch(queryParams.value)}
        multiple={true}
      ></CategorySelect>
    )
  },
  {
    field: 'applicableType',
    label: '适用类型',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    itemWidth: 220
  },
  {
    field: 'planningTime',
    label: '企划时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      valueFormat: 'YYYY-MM-DD',
      clearable: true
    },
    itemWidth: 320
  },
  {
    field: 'fabricCategoryId',
    label: '面料分类',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      clearable: true,
      filterable: true,
      loading: false,
      options: [],
      optionsAlias: { labelField: 'name', valueField: 'id' }
    },
    itemWidth: 220
  }
])

watch(fabricClassOptions, (arr) => {
  const target = schema.value.find((s) => s.field === 'fabricCategoryId')
  if (target) {
    target.componentProps = {
      ...(target.componentProps || {}),
      options: arr
    }
  }
})
watch(fabricClassLoading, (bol) => {
  const target = schema.value.find((s) => s.field === 'fabricCategoryId')
  if (target) {
    target.componentProps = {
      ...(target.componentProps || {}),
      loading: bol
    }
  }
})

const onSearch = async (val: any) => {
  const [planStartTime, planEndTime] = val?.planningTime || []
  queryParams.value = {
    categorys: val?.categorys?.length ? val?.categorys : [],
    category: val?.categorys?.length ? val?.categorys.join() : '',
    fabricClassId: val?.fabricCategoryId || '',
    name: val?.fabricName || '',
    planTimeBegin: planStartTime || '',
    planTimeEnd: planEndTime || '',
    applicableType: val?.applicableType || ''
  }
  await nextTick()
  tableRef.value?.refresh?.(true)
}

const getList = (params: any) => {
  const data = {...params}
  delete data.categorys
  return getFabricCenterPage(data)
}

// 解析行数据中的图片列表（支持数组、逗号分隔、JSON 数组、单链接、多字段兜底）
const getImageList = (row: any): string[] => {
  const candidate =
    row?.images ||
    row?.image ||
    row?.imageUrls ||
    row?.imageUrl ||
    row?.mainImageUrl ||
    row?.mainImageList
  if (!candidate) return []
  if (Array.isArray(candidate)) return candidate.filter(Boolean)
  if (typeof candidate === 'string') {
    const text = candidate.trim()
    if (!text) return []
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) return parsed.filter(Boolean)
    } catch {}
    if (text.includes(','))
      return text
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    return [text]
  }
  return []
}

// 表格列
const columns: TableColumn[] = [
  {
    prop: 'name',
    label: '面料名称',
    minWidth: 180,
    align: 'left',
    headerAlign: 'left',
    showOverflowTooltip: true
  },
  {
    prop: 'completeCategoryName',
    label: '品类',
    minWidth: 120,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'applicableType',
    label: '适用类型',
    minWidth: 120,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'planTime',
    label: '企划时间',
    minWidth: 160,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'planQuarter',
    label: '企划季度',
    minWidth: 120,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'classNames',
    label: '面料分类',
    minWidth: 180,
    align: 'left',
    headerAlign: 'left',
    showOverflowTooltip: true
  },
  {
    prop: 'weavingNumber',
    label: '面料支数',
    minWidth: 120,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'gramWeight',
    label: '面料克重',
    minWidth: 120,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'actions',
    label: '操作',
    width: 240,
    fixed: 'right',
    align: 'left',
    showOverflowTooltip: false,
    headerAlign: 'left'
  }
]

const onAdd = () => {
  openDrawer({
    title: '新增',
    content: Form,
    showConfirmFooter: true,
    confirmText: '提交',
    cancelText: '取消',
    width: '936px',
    wrapperStyle: { padding: 'unset', backgroundColor: 'unset' },
    onSuccess: () => {
      tableRef.value?.refresh?.(true)
    }
  })
}
const onView = (row: any) => {
  openDrawer({
    title: '查看详情',
    content: Detail,
    showConfirmFooter: false,
    props: { id: row?.id },
    width: '936px',
    wrapperStyle: { padding: 'unset', backgroundColor: 'unset' }
  })
}
const onEdit = (row: any) => {
  openDrawer({
    title: '编辑',
    content: Form,
    showConfirmFooter: true,
    confirmText: '提交',
    cancelText: '取消',
    props: { id: row?.id },
    width: '936px',
    wrapperStyle: { padding: 'unset', backgroundColor: 'unset' },
    onSuccess: () => {
      tableRef.value?.refresh?.(true)
    }
  })
}
const onDelete = async (row: any) => {
  try {
    await message.delConfirm('是否确认删除？')
    await deleteFabricCenter(row?.id)
    message.success('删除成功')
    tableRef.value?.refresh?.(true)
  } catch (e) {
    // 用户取消或接口异常，无需额外处理
  }
}

// 选用记录
const openChooseRecord = (row: any) => {
  openDrawer({
    title: '选用记录',
    content: defineAsyncComponent(() => import('./components/chooseRecord.vue')),
    showConfirmFooter: false,
    props: { id: row?.id },
    width: '1050px',
    wrapperStyle: { padding: 'unset', backgroundColor: 'unset' }
  })
}

// 面料选用
const choose = (row: any) => {
  router.push({
    path: '/admin/PRD/fabricManagement/fabricDevelopment',
    query: {
      id: row?.fabricDevelopId || '',
      type: '1'
    }
  })
}
</script>
<style scoped lang="scss">
:deep(.s-table-container) {
  .el-popper {
    max-width: 240px;
    text-align: left;
    background: rgba(0, 0, 0, 0.75);
    font-size: 14px;
  }
}
:deep() {
  .el-table__row {
    .el-table__cell {
      padding: 14px 0 !important;
    }
  }
}
</style>
