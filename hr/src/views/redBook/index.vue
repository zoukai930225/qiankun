<template>
  <!-- 列表 -->
  <ContentWrap>
    <!-- 搜索工作栏 -->

    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            class="CommonSearchForm"
            style="border-bottom: 0px solid #f2f6fc"
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="90px"
          >
            <el-form-item label="关键词" prop="category">
              <el-select
                v-model="queryParams.category"
                placeholder="请选择关键词"
                clearable
                filterable
                style="width: 200px"
                @change="handleQuery"
                @clear="handleQuery"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="小红书账号" prop="account">
              <el-input
                :prefix-icon="Search"
                v-model="queryParams.account"
                placeholder="请输入小红书账号"
                clearable
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                class="!w-200px"
              />
            </el-form-item>

            <el-form-item label="标题:" prop="title">
              <el-input
                :prefix-icon="Search"
                v-model="queryParams.title"
                placeholder="请输入标题"
                clearable
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                class="!w-200px"
              />
            </el-form-item>
            <!-- <el-form-item label="文章类型:" prop="noteType">
              <el-select
                style="width: 200px"
                v-model="queryParams.noteType"
                placeholder="请选择文章类型"
                clearable
                @change="handleQuery"
                @clear="handleQuery"
              >
                <el-option
                  v-for="dict in XhsNoteTypeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="文章链接:" prop="link">
              <el-input
                :prefix-icon="Search"
                v-model="queryParams.link"
                placeholder="请输入文章链接"
                clearable
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                class="!w-200px"
              />
            </el-form-item> -->
            <!-- <el-form-item v-show="isExpand" label="运营人:" prop="createdId">
              <el-input
                :prefix-icon="Search"
                v-model="queryParams.createdId"
                placeholder="请输入运营"
                clearable
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                class="!w-200px"
              />
            </el-form-item> -->
            <el-form-item label="发布时间" prop="createdAt">
              <el-date-picker
                v-model="queryParams.createdAt"
                value-format="YYYY-MM-DD"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="!w-190px"
                @change="handleQuery"
                clearable
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="类型" prop="promotionType">
              <el-select
                v-model="queryParams.promotionType"
                placeholder="请选择类型"
                style="width: 200px"
                @clear="handleQuery"
                filterable
                @change="handleQuery"
                clearable
              >
                <el-option
                  v-for="option in getDicList()"
                  :key="option.code"
                  :label="option.label"
                  :value="option.code"
                />
              </el-select>
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
            <!-- <SWFilterAdd
              class="commonAddBtn"
              :list="addList"
              :current-code="currentAddCode"
              :loading="exporting"
              @addBtnClick="addBtnClick"
            /> -->
          </div>
        </div>
      </div>
      <!-- <SWFilterExpandAll
        :isExpand="isExpand"
        @expandClick="isExpand = !isExpand"
        style="margin-top: -15px"
      /> -->
    </div>
    <div class="CommonOperateButton button-wapper">
      <div class="flex-row" style="margin-left: auto">
        <div class="desc-item">
          <img src="../../assets/imgs/redBook/notice.png" alt="" class="desc-item-icon" />
          <span class="desc-item-key">笔记数:</span>
          <span class="desc-item-value"> {{ noteCount || 0 }}</span>
        </div>
        <div class="desc-item">
          <img src="../../assets/imgs/redBook/notice.png" alt="" class="desc-item-icon" />
          <span class="desc-item-key">点赞数:</span>
          <span class="desc-item-value"> {{ allLikedCount || 0 }}</span>
        </div>
        <div class="desc-item">
          <img src="../../assets/imgs/redBook/notice.png" alt="" class="desc-item-icon" />
          <span class="desc-item-key">收藏数:</span>
          <span class="desc-item-value"> {{ allCollectedCount || 0 }}</span>
        </div>
      </div>
    </div>
    <el-table
      ref="sortTableRef"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :stripe="true"
      @sort-change="handleSortChange"
      :show-overflow-tooltip="true"
      row-class-name="commonTableRow"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="关键词" prop="category" min-width="150" />
      <el-table-column label="小红书账号" prop="account" width="160" show-overflow-tooltip>
        <template #default="scope"> {{ scope.row.account || '-' }}</template>
      </el-table-column>
      <el-table-column label="标题" prop="title" min-width="150" show-overflow-tooltip>
        <!-- <template #default="scope">
          <div style="color: #0064ff" class="text1"> {{ scope.row.title || '-' }}</div>
        </template> -->
        <template #default="scope">
          <a :href="scope.row.link" target="_blank" class="single-line linkText noUnderlineText">
            {{ scope.row.title || '-' }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="promotionType" width="120">
        <template #default="scope">
          {{ getDictLabel(DICT_TYPE.XHS_PROMOTION_TYPE, scope.row.promotionType) || '-' }}</template
        >
      </el-table-column>
      <el-table-column label="图片" prop="cover" width="100">
        <template #default="scope">
          <div class="row">
            <ArticleCover v-if="scope.row.imgUrl" :cover="scope.row.imgUrl" />
            <div v-else>-</div>
          </div>
        </template>
      </el-table-column>

      <!-- <el-table-column label="类型" prop="type" align="center" width="100">
        <template #default="scope"> {{ XhsNoteTypeName(scope.row.noteType) }}</template>
      </el-table-column> -->

      <!-- <el-table-column label="文章链接" prop="link" min-width="240" :show-overflow-tooltip="false">
        <template #default="scope">
          <a :href="scope.row.link" target="_blank" class="single-line linkText noUnderlineText">
            {{ scope.row.link || '-' }}
          </a>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="笔记截图" prop="webImgUrl" width="100">
        <template #default="scope">
          <div class="row">
            <ArticleCover v-if="scope.row.webImgUrl" :cover="scope.row.webImgUrl" />
            <div v-else>-</div>
          </div>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="运营人" prop="createdId" width="100" /> -->
      <el-table-column
        sortable="custom"
        label="点赞数"
        prop="likedCountStr"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        sortable="custom"
        label="收藏数"
        prop="collectedCountStr"
        min-width="100"
        show-overflow-tooltip
      />

      <el-table-column
        sortable="custom"
        label="评论数"
        prop="commentCountStr"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        sortable="custom"
        :formatter="dateFormatter"
        label="笔记发布时间"
        prop="releaseTime"
        width="180"
      />
      <el-table-column
        sortable="custom"
        :formatter="dateFormatter"
        label="笔记最后更新时间"
        prop="lastUpdateTime"
        width="180"
      />
      <!-- <el-table-column :formatter="dateFormatter" label="创建时间" prop="createdAt" width="180" /> -->
      <el-table-column
        :formatter="dateFormatter"
        label="数据更新时间"
        prop="updatedAt"
        width="180"
      />
      <el-table-column fixed="right" width="70" label="操作">
        <template #default="scope">
          <div class="row-center" @click="seeStaticsDetail(scope.row)">
            <!-- <img class="operateSeeIcon" src="@/assets/imgs/common/operate_see.png" /> -->
            <div class="operateText">查看</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </ContentWrap>
  <!-- 表单弹窗 -->
  <AddArticleForm ref="formRef" @success="getList" />
  <!-- 表单弹窗：批量导入 -->
  <SWBatchImport ref="importFormRef" @success="getList" />
  <DetailChartDialog ref="detailChartDialogRef" />
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import ArticleCover from './components/articleCover.vue'
import AddArticleForm from './components/addArticle.vue'
import SWBatchImport from '/@/components/SWBatchImport/index.vue'
import DetailChartDialog from './components/chartDialog.vue'

import { dateFormatter } from '@/utils/formatTime'
import { useAppStore } from '@/store/modules/app'
import download from '@/utils/download'
import { XhsNoteTypeOptions, XhsNoteTypeName } from '@/types/enumOptions'

import * as RedBookBookApi from '@/api/redBook'
import { XhsListParam } from '@/api/redBook'
import { DICT_TYPE, getDictOptions, getDictLabel, getIntDictOptions } from '@/utils/dict'

const appStore = useAppStore()
const router = useRouter()

defineOptions({ name: 'RedBook' })

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive<{
  page: number
  size: number
  category: string
  title: string
  account: string
  createdAt: any
  orderType?: number // 1-点赞数升序 2-点赞数降序 3-收藏数升序 4-收藏数降序
  promotionType: string
}>({
  page: 1,
  size: 10,
  category: '',
  title: '',
  account: '',
  createdAt: '',
  orderType: undefined, // 1-点赞数升序 2-点赞数降序 3-收藏数升序 4-收藏数降序
  promotionType: ''
})
const queryFormRef = ref() // 搜索的表单
const sortTableRef = ref()
const allCollectedCount = ref(0) //总计收藏数
const allLikedCount = ref(0) //总计点赞数
const noteCount = ref(0) //笔记数

const categoryOptions = ref<string[]>([])
const loadCategoryOptions = async () => {
  try {
    const data = await RedBookBookApi.getXhsCategory().catch(() => {})
    let list: any[] = []
    if (Array.isArray(data)) {
      list = data
    } else if (data && Array.isArray(data.data)) {
      list = data.data
    }
    categoryOptions.value = list
      .map((v) => (typeof v === 'string' ? v.trim() : v))
      .filter((v) => v)
      .filter((v, i, arr) => arr.indexOf(v) === i)
  } finally {
  }
}

// const isExpand = ref(false) // 是否展开
// const addList = ref([
//   {
//     label: '文章录入',
//     code: 'articleImport'
//   },
//   {
//     label: '文章导入',
//     code: 'import'
//   },
//   {
//     label: '模版下载',
//     code: 'template'
//   }
// ])
// // 当前新增按钮code码
// const currentAddCode = ref('articleImport')

// // 新增按钮点击
// const addBtnClick = (value) => {
//   if (value) {
//     currentAddCode.value = value.code
//     if (currentAddCode.value === 'articleImport') {
//       addArticleAction()
//     } else if (currentAddCode.value === 'import') {
//       importData()
//     } else if (currentAddCode.value === 'template') {
//       templateFileDownload()
//     }
//   }
// }

/** 排序操作 */
const handleSortChange = (column) => {
  // 点赞数排序
  if (column.prop === 'likedCountStr') {
    if (column.order) {
      if (column.order === 'descending') {
        queryParams.orderType = 2
      } else if (column.order === 'ascending') {
        queryParams.orderType = 1
      }
    } else {
      queryParams.orderType = undefined
    }
  }
  // 收藏数排序
  if (column.prop === 'collectedCountStr') {
    if (column.order) {
      if (column.order === 'descending') {
        queryParams.orderType = 4
      } else if (column.order === 'ascending') {
        queryParams.orderType = 3
      }
    } else {
      queryParams.orderType = undefined
    }
  }

  // 评论数排序
  if (column.prop === 'commentCountStr') {
    if (column.order) {
      if (column.order === 'descending') {
        queryParams.orderType = 6
      } else if (column.order === 'ascending') {
        queryParams.orderType = 5
      }
    } else {
      queryParams.orderType = undefined
    }
  }

  // 笔记发布时间排序
  if (column.prop === 'releaseTime') {
    if (column.order) {
      if (column.order === 'descending') {
        queryParams.orderType = 8
      } else if (column.order === 'ascending') {
        queryParams.orderType = 7
      }
    } else {
      queryParams.orderType = undefined
    }
  }

  // 笔记本最后更新时间排序
  if (column.prop === 'lastUpdateTime') {
    if (column.order) {
      if (column.order === 'descending') {
        queryParams.orderType = 10
      } else if (column.order === 'ascending') {
        queryParams.orderType = 9
      }
    } else {
      queryParams.orderType = undefined
    }
  }
  getList()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = JSON.parse(JSON.stringify(queryParams))
    if (queryParams.createdAt && queryParams.createdAt.length > 1) {
      params['beginReleaseTime'] = queryParams.createdAt[0]
      params['endReleaseTime'] = queryParams.createdAt[1]
      params.createdAt = undefined
    }

    const data = await RedBookBookApi.getXhsList(params as XhsListParam).catch(() => {})
    list.value = data.data || []
    allCollectedCount.value = data.allCollectedCount
    allLikedCount.value = data.allLikedCount
    noteCount.value = data.noteCount

    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.orderType = undefined
  nextTick(() => {
    sortTableRef.value.clearSort()
  })
  handleQuery()
}

/** 文章录入操作 */
const formRef = ref()
const addArticleAction = () => {
  formRef.value.open()
}

const detailChartDialogRef = ref()
/** 查看统计详情 */
const seeStaticsDetail = (row) => {
  detailChartDialogRef.value?.open(row.id)

  // router.push({
  //   path: `/admin/redBook/detail/${row.id}`,
  //   query: { link: encodeURIComponent(row.link) }
  // })
}

/** 导入操作 */
const importFormRef = ref()
const importData = () => {
  importFormRef.value.open()
}

/** 小红书文章模版下载 */
const exporting = ref(false)
const templateFileDownload = async () => {
  exporting.value = true
  const data = await RedBookBookApi.xhsTemplateExport().catch(() => {
    exporting.value = false
  })
  exporting.value = false
  if (data) {
    download.excel(data, '小红书文章导入模板.xls')
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
  loadCategoryOptions()
})

const getDicList = () => {
  //@ts-ignore
  return getIntDictOptions(DICT_TYPE.XHS_PROMOTION_TYPE, true)
}
</script>

<style lang="scss" scoped>
:deep(.el-date-editor--daterange) {
  height: 37px;
}
:deep(.el-range-editor.el-input__wrapper) {
  padding-right: 0px;
}

.topStatics {
  padding-left: 16px;
  height: 48px;
  margin-bottom: 16px;
  background: #ecf5ff;
  &-title {
    font-size: 14px;
    color: #333;
    padding-right: 16px;
  }
  &-value {
    font-size: 16px;
    font-weight: 600;
    pointer-events: none;
    color: #126efe;
  }
  &-space {
    width: 44px;
  }
}
.button-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;

  .desc-item {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-left: 16px;
    .desc-item-icon {
      width: 12px;
      height: 12px;
    }
    .desc-item-key {
      font-weight: 400;
      font-size: 14px;
      color: #999999;
      line-height: 20px;
      margin: 0 8px 0 4px;
    }
    .desc-item-value {
      background: #f4f7fe;
      border-radius: 2px;
      line-height: 20px;
      padding: 0 7px;
      box-sizing: border-box;
    }
  }
}
</style>
