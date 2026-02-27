<template>
  <content-wrap>
    <s-w-search-form
      :schema="searchSchema"
      @search="handleSearch"
      @reset="handleReset"
      ref="searchFormRef"
      :expand-threshold="4"
      default-expand-all
      auto-search-on-change
      :show-search-button="false"
    />
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane :label="item.title" :name="item.name" v-for="item in tabList" :key="item.name">
        <template #label>
          <div class="row-center">
            <div>{{ item.title }}</div>
            <el-popover :content="item.titp" :width="300">
              <template #reference>
                <div style="padding-left: 5px; height: 19px" class="row-center">
                  <el-icon color="#cccccc" size="14">
                    <QuestionFilled />
                  </el-icon>
                </div>
              </template>
            </el-popover>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <!-- 列表 -->
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      row-class-name="commonTableRow"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      height="calc(100vh - 325px)"
      @sort-change="handleTableSort"
      ref="tableRef"
      stripe
      :default-sort="{ prop: 'cycleCqc', order: 'descending' }"
    >
      <el-table-column
        label="排名"
        prop="rank"
        width="120"
        align="right"
        sortable="custom"
        fixed="left"
      />
      <el-table-column label="商品" prop="goodsId" min-width="200">
        <template #default="scope">
          <div class="row-center">
            <el-popover
              placement="right"
              :width="348"
              trigger="hover"
              :show-arrow="false"
              :offset="20"
            >
              <template #reference>
                <div class="goodImg">
                  <img
                    style="width: 42px; height: 42px; border-radius: 4px"
                    :src="scope.row.goodsImage"
                  />
                </div>
              </template>
              <GoodCard
                :good="{
                  materialName: scope.row.goodsTitle || '-',
                  materialId: scope.row.goodsId,
                  goodsImage: scope.row.goodsImage,
                  channel: scope.row.channel || ''
                }"
              />
            </el-popover>
            <div class="goodName" @click="toShop(scope.row.goodsUrl)">{{
              scope.row.goodsTitle || '-'
            }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="排名跃升"
        prop="cycleCqc"
        width="120"
        align="center"
        sortable="custom"
      >
        <template #default="scope">
          <span
            v-if="!!scope.row.cycleCqc"
            :style="
              scope.row.isRankRise === 0
                ? 'color:#909399'
                : scope.row.isRankRise === 1
                  ? 'color:#F56C6C'
                  : 'color:#67C23A'
            "
            style="display: inline-flex; align-items: center"
          >
            <el-icon v-if="scope.row.isRankRise === 1" style="margin-right: 4px"><Top /></el-icon>
            <el-icon v-else-if="scope.row.isRankRise === -1" style="margin-right: 4px"
              ><Bottom
            /></el-icon>
            {{ scope.row.cycleCqc }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="跃升轨迹"
        prop="jumpTrajectory"
        width="150"
        align="right"
        v-if="queryParams.dateType === 0"
      />
      <el-table-column label="类目" prop="category" min-width="220">
        <template #default="scope">
          {{ scope.row.category || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="商品关键词" prop="coreKeyWordList" min-width="220">
        <template #default="scope">
          <div class="flex gap-2 flex-wrap" v-if="scope.row.coreKeyWordList.length > 0">
            <el-tag color="#EFF2FB" v-for="(item, index) in scope.row.coreKeyWordList" :key="index"
              ><span style="color: #717ddf">{{ item }}</span></el-tag
            >
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺" prop="shopTitle" min-width="180" show-overflow-tooltip>
        <template #default="scope">
          <div class="row-center" @click="toShop(scope.row.shopUrl)" style="cursor: pointer">
            <img
              v-if="getImageUrl(scope.row.channel)"
              style="width: 18px; height: 18px; margin-right: 8px"
              :src="getImageUrl(scope.row.channel)"
            />
            <div class="goodName" style="width: calc(100% - 26px)">{{
              scope.row.shopTitle || '-'
            }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="支付买家" prop="payBuyerCount" min-width="150" align="right">
        <template #default="scope">
          {{ scope.row.payBuyerCount || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="访客量" prop="uv" min-width="150" align="right">
        <template #default="scope">
          {{ scope.row.uv || '-' }}
        </template>
      </el-table-column>
      <template #empty>
        <div class="empty">
          <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
          <span>暂无数据</span>
        </div>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>
  </content-wrap>
</template>

<script lang="ts" setup>
defineOptions({ name: 'TbMarket' })
import { useAppStore } from '@/store/modules/app'
import * as tbMarkeApi from '@/api/markrtData/tbMarket'
import { DICT_TYPE, getDictOptions } from '@/utils/dict'
import { productInfoStore } from '@/store/modules/productInfo'
import { getImageUrl } from '@/utils/index'
import dayjs from 'dayjs'
import GoodCard from '@/components/common/goods/goodCard.vue'
import { FormSchema } from '@/types/form'
import { nextTick } from 'vue'
import { Top, Bottom } from '@element-plus/icons-vue'

const productInfoData = productInfoStore()

// s-w-search-form
const searchFormRef = ref()
const lastestDay = ref('')

// 下拉-部门树形
const customProps = {
  label: 'categoryName',
  value: 'categoryId',
  children: 'children'
}

// s-w-search-form 搜索事件
function handleSearch(formData: any, isReset) {
  if (isReset) {
    return
  }
  console.log(formData, 'formData')
  const { categoryId, listType, dataDate, dateType } = formData
  // 类目
  if (!Array.isArray(categoryId)) {
    queryParams.value.categoryId = categoryId
  } else {
    queryParams.value.categoryId = categoryId[categoryId.length - 1] || ''
  }
  // 榜单类型
  if (listType) {
    queryParams.value.listType = listType
  }
  if (Array.isArray(dataDate) && dataDate.length > 1) {
    queryParams.value.beginDate = dataDate[1]
  }
  queryParams.value.dateType = dateType
  // queryParams.value.categoryId = categoryId
  queryParams.value.page = 1
  getList()
}

// s-w-search-form 重置事件
async function handleReset() {
  Object.assign(queryParams.value, {
    categoryId: '50008889',
    listType: 'trade_volume',
    page: 1,
    size: 10,
    orderField: 'cycleCqc',
    orderRule: 'desc',
    beginDate: lastestDay.value,
    dateType: '0'
  })
  tableRef.value?.sort('cycleCqc', 'descending')
  // getList()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

function handleTypeChange(val: string) {
  queryParams.value.listType = val
  // nextTick(() => {
  //   handleQuery()
  // })
}
// 预先计算榜单类型选项（避免使用未声明函数）
const listTypeOptions = getDictOptions(DICT_TYPE.BUSINESS_ADVISOR_MARKET_RANK_LIST_TYPE).map(
  (it: any) => ({ label: it.label, value: it.code })
)

// schema
const searchSchema = ref<FormSchema[]>([
  {
    field: 'categoryId',
    label: '类目',
    component: 'Cascader',
    componentProps: {
      options: productInfoData.categoryOptions,
      props: customProps
    },
    value: ['1625', '50008889']
  },
  {
    field: 'listType',
    label: '榜单类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择榜单类型',
      filterable: true,
      options: listTypeOptions
    },
    value: 'trade_volume'
  },
  {
    field: 'dateType',
    label: '数据维度',
    component: 'Select',
    componentProps: {
      clearable: false,
      placeholder: '请选择数据维度',
      options: [
        { label: '单日', value: '0' },
        { label: '7天', value: '7' },
        { label: '30天', value: '30' }
      ]
    },
    value: '0'
  },
  {
    field: 'dataDate',
    label: '统计时间',
    component: 'StatisticsDateRange',
    componentProps: {
      clearable: false,
      pickerType: 'date',
      diffField: 'dateType',
      placeholder: '选择日期',
      disabledDate: (time: Date) => {
        return lastestDay.value ? time.getTime() > new Date(lastestDay.value).getTime() : false
      }
    },
    value: ''
  }
])

// 当类目选项变更时，同步到 schema 的级联组件
watch(
  () => productInfoData.categoryOptions,
  (options) => {
    const schema = searchSchema.value.find((item) => item.field === 'categoryId')
    if (schema && schema.componentProps) {
      schema.componentProps.options = options || []
      schema.componentProps = { ...schema.componentProps }
    }
  },
  { immediate: true, deep: true }
)

const appStore = useAppStore()

const tabList = [
  {
    title: '跃升50+',
    name: 'first',
    value: 1,
    titp: '该tab下展示，与上一统计周期相比，本统计周期排名跃升 ≥50 名的商品'
  },
  {
    title: '新晋前50',
    name: 'second',
    value: 2,
    titp: '该tab下展示，与上一统计周期相比，本统计周期新进入前50名的商品'
  },
  {
    title: '50再跃升10+',
    name: 'third',
    value: 3,
    titp: '该tab下展示，上一统计周期已经排名在前50，但本统计周期再次跃升10名以上的商品'
  },
  {
    title: '新晋增速前10',
    name: 'fourth',
    value: 4,
    titp: '该tab下展示，榜单类型是「交易增速」的在本统计周期内新上榜前10且买家人数 ≥50 人的商品'
  }
]

const activeName = ref(tabList[0].name)

const tableRef = ref()
const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

const queryParams = ref<any>({
  categoryId: '',
  listType: 'trade_volume',
  beginDate: '',
  tabType: 1,
  dateType: '0',
  page: 1,
  size: 10,
  orderField: 'cycleCqc',
  orderRule: 'desc'
})
// 已移除未使用的 resetQuery 与 color 常量
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.value.tabType = tabList.find((item) => item.name === activeName.value)?.value || 1
    const { ...requestParams } = queryParams.value
    const data = await tbMarkeApi.getList(requestParams as any)
    if (data) {
      list.value = data.records
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

//获取类目树
const getCateTree = async () => {
  const res = await tbMarkeApi.getCateTree()
  productInfoData.categoryOptions = res || [] // 更新到store中
  getDefaultCategryId(res)
}

function getDefaultCategryId(data) {
  if (Array.isArray(data) && data.length > 0) {
    if (Array.isArray(data[0].children) && data[0].children.length > 0) {
      getDefaultCategryId(data[0].children)
    } else {
      queryParams.value.categoryId = data[0].categoryId
    }
  } else {
    return ''
  }
}
//切换标签
function handleClick() {
  queryParams.value.orderField = 'cycleCqc'
  queryParams.value.orderRule = 'desc'
  list.value = []
  total.value = 0
  nextTick(() => {
    tableRef.value.sort('cycleCqc', 'descending')
  })
}
async function getLatestDay() {
  try {
    const latest = await tbMarkeApi.getLatestDay()
    if (latest) {
      const dateStr = dayjs(latest).format('YYYY-MM-DD')
      lastestDay.value = dateStr
      const dataDateSchema = searchSchema.value.find((item) => item.field === 'dataDate')
      if (dataDateSchema) dataDateSchema.value = dateStr
      queryParams.value.beginDate = dateStr
    }
  } catch (e) {
    console.log(e)
  }
}
/** 初始化 **/
onMounted(async () => {
  await getCateTree()
  // 初始化展示区间
  await getLatestDay()
  getList()
})

//表格排序
function handleTableSort(data) {
  if (data.order === 'ascending') {
    queryParams.value.orderRule = 'asc'
  } else {
    queryParams.value.orderRule = 'desc'
  }
  queryParams.value.orderField = data.prop
  handleQuery()
}

// 类目变化   // 处理级联选择变化
// const handleCascaderChange = (value) => {
//   console.log(value, 'value')
//   // 取每一项的最后一个数据
//   if (!Array.isArray(value)) {
//     queryParams.value.categoryId = ''
//   } else {
//     queryParams.value.categoryId = value[value.length - 1]
//   }
//   // handleQuery()
// }

//打开店铺
function toShop(url) {
  window.open(url)
}
</script>

<style lang="scss" scoped>
.table-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: auto;
  font-size: 18px;
  margin-bottom: 10px;
  height: 85px;
  background-repeat: no-repeat;
  background-image: url('@/assets/imgs/channelData/header_bg.png');
  background-size: cover;

  &-left,
  &-right {
    width: 20px;
    height: 32px;
  }

  &__time {
    font-size: 16px;
    color: #333;
    font-weight: lighter;
    margin-top: 5px;
  }

  &-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 15px;
    align-items: center;
  }
}

.goodImg {
  width: 42px;
  height: 42px;
  border-radius: 2px;
  margin-right: 8px;
}

.goodName {
  width: calc(100% - 70px);
  font-size: 14px;
  color: #0064ff;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  cursor: pointer;
}

.commonTopFilterWrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
