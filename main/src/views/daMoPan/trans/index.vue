<template>
  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="mb-5px"
            label-width="78px"
          >
            <el-form-item label="数据日期" prop="beginDate">
              <el-date-picker
                :clearable="false"
                v-model="times"
                type="daterange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item label="类目" prop="category">
              <el-select
                v-model="queryParams.category"
                placeholder="请选择类目"
                style="width: 220px"
                filterable
              >
                <el-option
                  v-for="option in getDicList()"
                  :key="option.code"
                  :label="option.label"
                  :value="option.code"
              /></el-select>
            </el-form-item>
            <el-form-item label="店铺" prop="store">
              <StoreRangePlus
                v-model="queryParams.store"
                @change="getList"
                placeholder="请选择店铺"
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

            <el-button @click="handleDownload" type="primary"> 导出 </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      row-class-name="commonTableRow"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="类目" prop="category" min-width="150" />
      <el-table-column label="店铺" prop="store" min-width="150" />
      <el-table-column label="数据日期" prop="dataDate" min-width="200">
        <template #default="scope">
          {{ scope.row.dataDate || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="1次搜索点击" prop="singleSearchClick" min-width="100">
        <template #default="scope">
          <div class="row">
            {{ scope.row.singleSearchClick || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="多次搜索点击" prop="multipleSearchClick" min-width="200">
        <template #default="scope">
          <div class="row-center">
            {{ scope.row.multipleSearchClick || '-' }}
          </div>
        </template>
      </el-table-column>
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
  </ContentWrap>
</template>

<script lang="ts" setup>
defineOptions({ name: 'DaMoPanTrans' })
import { useAppStore } from '@/store/modules/app'
import * as dharmaApi from '@/api/daMoPan/index'
import download from '@/utils/download'
import { DICT_TYPE, getDictOptions } from '@/utils/dict'
import dayjs from 'dayjs'
import { isArray, cloneDeep } from 'lodash-es'
import { getLast7Days } from '@/utils/formatTime'
const appStore = useAppStore()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  beginDate: '', //开始时间
  endDate: '', //结束时间
  category: '', //类目
  store: '' //店铺
})
const queryFormRef = ref() // 搜索的表单

const times = ref<any[]>(getLast7Days())

//导出
const handleDownload = async () => {
  const loadingInstance = ElLoading.service({ fullscreen: false, text: '数据导出中......' })
  try {
    if (isArray(times.value) && times.value.length === 2) {
      queryParams.value.beginDate = dayjs(times.value[0]).format('YYYY-MM-DD')
      queryParams.value.endDate = dayjs(times.value[1]).format('YYYY-MM-DD')
    }
    const data = await dharmaApi.exportData(cloneDeep(queryParams.value))
    const fileName = `达摩盘类目趋势统计`
    download.excel(data, fileName)
    message.success('导出成功')
  } finally {
    loadingInstance.close()
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  times.value = getLast7Days()
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (isArray(times.value) && times.value.length === 2) {
      queryParams.value.beginDate = dayjs(times.value[0]).format('YYYY-MM-DD')
      queryParams.value.endDate = dayjs(times.value[1]).format('YYYY-MM-DD')
    } else {
      queryParams.value.beginDate = ''
      queryParams.value.endDate = ''
    }
    const data = await dharmaApi.getDharmaList(queryParams.value).catch(() => {})
    if (data) {
      list.value = data.records
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  getList()
})

const getDicList = () => {
  //@ts-ignore
  return getDictOptions(DICT_TYPE.DHARMA_DISC_CATEGORY_TREND_CATEGORY)
}
</script>

<style lang="less" scoped></style>
