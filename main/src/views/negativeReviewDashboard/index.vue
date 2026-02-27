<template>
  <content-wrap>
    <s-w-search-form
      ref="searchFormRef"
      :schema="searchSchema"
      :expand-threshold="3"
      show-expand
      expand-text="展开"
      collapse-text="收起"
      @search="onSearch"
      @reset="onReset"
      auto-search-on-change
    >
      <FilterOpenBoard
        class="commonAddBtn"
        style="margin: 0 16px"
        :list="addList"
        :current-code="currentAddCode"
        @add-btn-click="addBtnClick"
      />
      <el-button @click="exportData" :loading="exportLoading" style="width: 60px" type="primary">
        导出
      </el-button>
    </s-w-search-form>

    <div>
      <list-table
        :list="list"
        :total="total"
        :loading="loading"
        @edit-category="handleEditCategory"
      />
      <div class="pagination">
        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParams.size"
          v-model:page="queryParams.page"
          :total="total"
          @pagination="getList"
        />
      </div>

      <!-- 编辑分类弹窗 -->
      <EditCategory ref="editCategoryRef" @success="getList" />
      <!-- 中差评数量情况 -->
      <DrawerFirstType ref="drawerFirstTypeRef" @close="currentAddCode = ''" />
      <!-- 一级分类 -->
      <DrawerFirstCategory ref="drawerFirstCategoryRef" @close="currentAddCode = ''" />
      <!-- 二级分类 -->
      <DrawerSecondCategory ref="drawerSecondCategoryRef" @close="currentAddCode = ''" />
    </div>
  </content-wrap>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
// import { Search } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { StoreItem, DictItem } from './type'
import * as negativeReviewDashboardApi from '@/api/negativeReviewDashboard'
import { onNegativeReviewDashboardStore } from '@/store/modules/negativeReviewDashboard'
const negativeReviewDashboardStore = onNegativeReviewDashboardStore()
import EditCategory from './components/editeditCategoryDialog.vue'
import listTable from './components/listTable.vue'
import FilterOpenBoard from './components/filterOpenBoard.vue' //数据看板
import DrawerFirstType from './components/drawer/drawerFirstType.vue' //前两个
import DrawerFirstCategory from './components/drawer/drawerFirstCategory.vue'
import DrawerSecondCategory from './components/drawer/drawerSecondCategory.vue'
import download from '@/utils/download'
import { FormSchema } from '@/types/form'
const message = useMessage() // 消息弹窗

const yesterday = dayjs().subtract(1, 'day')

const startOfYesterday = yesterday.startOf('day').format('YYYY-MM-DD')
const endOfYesterday = yesterday.endOf('day').format('YYYY-MM-DD')

// 数据看板
const addList = ref([
  {
    label: '中差评数量情况',
    code: '1'
  },
  {
    label: '中差评原因产品(日度中差评数量大于2)',
    code: '2'
  },
  {
    label: '中差评原因一级分类',
    code: '3'
  },
  {
    label: '中差评原因（日度中差评数量大于3）',
    code: '4'
  }
])
// 当前数据看板按钮code码
const currentAddCode = ref()

// 数据看板按钮点击
const drawerFirstTypeRef = ref()
const drawerFirstCategoryRef = ref()
const drawerSecondCategoryRef = ref()
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === '1' || currentAddCode.value === '2') {
      drawerFirstTypeRef.value.open(currentAddCode.value)
    } else if (currentAddCode.value === '3') {
      drawerFirstCategoryRef.value.open(currentAddCode.value)
    } else if (currentAddCode.value === '4') {
      drawerSecondCategoryRef.value.open(currentAddCode.value)
    }
  }
}

// 打开编辑分类弹窗
const editCategoryRef = ref<{ open: (id: string) => void } | null>(null)
const handleEditCategory = (id: string) => {
  editCategoryRef.value?.open(id)
}

// 查询参数（分页和接口参数容器）
const queryParams = ref({
  size: 10,
  page: 1,
  store: 'ALL', // 店铺编码
  goodsParam: '', // 商品ID/商品编码
  primaryClassification: '', // 一级分类
  secondaryClassification: '', // 二级分类
  isHasPicture: '', // 是否有图
  startTime: '', // 初次评价开始日期
  endTime: '' // 初次评价结束日期
})

// s-w-search-form
const searchFormRef = ref()
const storeList = ref<StoreItem[]>([])
const storeOptions = computed(() =>
  storeList.value.map((s) => ({ label: s.storeName, value: s.storeCode }))
)

// 一级分类/二级分类列表
const oneLevelList = ref<DictItem[]>([])
const twoLevelList = ref<DictItem[]>([])
const dataMap = ref({})

const searchSchema = computed<FormSchema[]>(() => [
  {
    field: 'goodsParam',
    label: '商品主键',
    component: 'Input',
    componentProps: {
      placeholder: '请输入商品ID/商品编码',
      clearable: true
    },
    value: ''
  },
  {
    field: 'dateRange',
    label: '初次评价日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '-',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD'
    },
    value: [startOfYesterday, endOfYesterday]
  },
  {
    field: 'store',
    label: '店铺',
    component: 'Select',
    componentProps: {
      placeholder: '请选择店铺',
      clearable: true,
      filterable: true,
      options: storeOptions.value
    },
    value: 'ALL'
  },
  {
    field: 'primaryClassification',
    label: '一级分类',
    component: 'Select',
    componentProps: {
      placeholder: '请选择一级分类',
      clearable: true,
      filterable: true,
      options: oneLevelList.value,
      onChange: (val: string) => handleFirstLevelChange(val)
    },
    value: ''
  },
  {
    field: 'secondaryClassification',
    label: '二级分类',
    component: 'Select',
    componentProps: {
      placeholder: '请选择二级分类',
      clearable: true,
      filterable: true,
      options: twoLevelList.value
    },
    value: ''
  },
  {
    field: 'isHasPicture',
    label: '是否有图',
    component: 'Select',
    componentProps: {
      placeholder: '请选择是否有图',
      clearable: true,
      options: getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)
    },
    value: ''
  }
])

/** 搜索触发 */
const onSearch = (val: any) => {
  queryParams.value.page = 1
  queryParams.value.store = val.store ?? 'ALL'
  queryParams.value.goodsParam = val.goodsParam ?? ''
  queryParams.value.primaryClassification = val.primaryClassification ?? ''
  queryParams.value.secondaryClassification = val.secondaryClassification ?? ''
  queryParams.value.isHasPicture = val.isHasPicture ?? ''
  if (Array.isArray(val.dateRange) && val.dateRange.length > 0) {
    queryParams.value.startTime = dayjs(val.dateRange[0]).format('YYYY-MM-DD')
    queryParams.value.endTime = dayjs(val.dateRange[1]).format('YYYY-MM-DD')
  } else {
    queryParams.value.startTime = ''
    queryParams.value.endTime = ''
  }
  getList()
}

/** 重置触发 */
const onReset = () => {
  queryParams.value = {
    ...queryParams.value,
    page: 1,
    store: 'ALL',
    goodsParam: '',
    primaryClassification: '',
    secondaryClassification: '',
    isHasPicture: '',
    startTime: startOfYesterday,
    endTime: endOfYesterday
  }
  twoLevelList.value = []
  // 同步表单默认值
  searchFormRef.value?.setValues({
    store: 'ALL',
    goodsParam: '',
    primaryClassification: '',
    secondaryClassification: '',
    isHasPicture: '',
    dateRange: [startOfYesterday, endOfYesterday]
  })
  // getList()
}

/** 获取店铺列表 */
const getStoreList = async () => {
  const res = await negativeReviewDashboardApi.getNegativeReviewShopList()
  storeList.value = res || []
  storeList.value.unshift({ storeCode: 'ALL', storeName: '全部' })
  negativeReviewDashboardStore.storeList = storeList.value
}

// 列表数据
const loading = ref(false) // 加载状态
const total = ref(0)
const list = ref<any>([])
const getList = async () => {
  try {
    loading.value = true

    const params = { ...queryParams.value }

    const res = await negativeReviewDashboardApi.getNegativeReviewList(params)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

// 获取查询条件 一级分类/二级分类的下拉列表
const getEvaluation = async () => {
  const res = await negativeReviewDashboardApi.getEvaluationList({})
  oneLevelList.value = []
  if (res) {
    dataMap.value = res
    const subKeys = Object.keys(res.中差评)
    // 赋值给 一级分类列表
    if (subKeys.length == 0) return
    oneLevelList.value = subKeys.map((key) => ({
      label: key,
      value: key
    }))
    console.log('一级分类', oneLevelList.value)
  }
}

// 选择一级分类时更新二级列表
const handleFirstLevelChange = (val?: string) => {
  // 切换一级分类时，清空二级分类名称
  searchFormRef.value?.setValues({ secondaryClassification: '' })
  twoLevelList.value = []

  const primary = val || searchFormRef.value?.formModel?.primaryClassification
  // 当一级分类为空或没有二级分类时，清空二级分类列表
  if (!primary || !dataMap.value['中差评']?.[primary]) return

  // 赋值给二级分类列表
  twoLevelList.value = dataMap.value['中差评'][primary].map((item) => ({
    label: item.levelThreeLabel,
    value: item.levelThreeLabel
  }))
  console.log('二级分类', twoLevelList.value)
}

const exportLoading = ref(false) // 导出状态
const exportData = async () => {
  try {
    exportLoading.value = true
    const params = { ...queryParams.value }
    const res = await negativeReviewDashboardApi.exportNegativeReviewList(params)
    if (res) {
      download.excel(res, `中差评数据.xls`)
      message.success('导出成功')
    }
  } catch {
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

onMounted(async () => {
  getEvaluation()
  await getStoreList()
  // 触发一次默认搜索，加载昨日数据
  searchFormRef.value?.search?.()
})
</script>

<style lang="scss" scoped>
// 查询条件
.negativeReviewDashboardTopFilter {
  background-color: #fff;
  padding: 20px 20px 0 20px;
  border-radius: 12px 12px 0 0;
  min-width: 1000px;
}

::deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}

::deep(.el-form--inline .el-form-item) {
  margin-right: 16px;
}

// 表格样式
.table-wrapper {
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 0 0 12px 12px;

  .tab-wrapper {
    .tabs-label {
      display: flex;
      align-items: center;
    }

    .tab-icon {
      width: 16px;
      margin-right: 8px;
    }

    :deep(.el-tabs__item.is-active),
    :deep(.el-tabs__item:hover) {
      color: #0064ff;
    }

    :deep(.el-tabs__active-bar) {
      background-color: #0064ff;
    }
  }
}

// 分页
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
