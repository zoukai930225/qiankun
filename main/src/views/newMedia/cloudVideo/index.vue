<template>
  <ContentWrap>
    <div class="rule-form">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter" style="width: calc(100% - 70px)">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="66px">
            <el-form-item label="统计时间" class="each-form upload-time">
              <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD" end-placeholder="结束日期" :clearable="false"
                @change="handleQuery">
                <template #range-separator><span style="color: #000">至</span></template>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="商品主键" class="each-form">
              <el-input class="width-220" v-model.trim="queryParams.keyword" placeholder="请输入商品ID/编码/名称" clearable
                @change="inputSearch" @keydown.enter="inputSearch" @clear="inputSearch" />
            </el-form-item>
            <el-form-item label="编导" class="each-form">
              <SelectUserWithOther :extra-options="otherOption" v-model="queryParams.directorId" :role="getRole('编导')"
                :multiple="false" @change="handleQuery" :disabled="directorStatus" class="width-220"
                :showAvatarLable="true" />
            </el-form-item>
            <el-form-item label="剪辑" class="each-form">
              <SelectUserWithOther :extra-options="otherOption" v-model="queryParams.editId" :role="getRole('剪辑')"
                :multiple="false" @change="handleQuery" :disabled="editStatus" class="width-220"
                :showAvatarLable="true" />
            </el-form-item>
            <el-form-item label="投手" class="each-form">
              <SelectUserWithOther :extra-options="otherOption" v-model="queryParams.contributorId"
                :role="getRole('投手')" :multiple="false" @change="handleQuery" class="width-220" :showAvatarLable="true"
                :disabled="contributorStatus" />
            </el-form-item>
            <template v-if="isExpand">
              <el-form-item label="内容ID" class="right-20">
                <el-input class="width-220" v-model.trim="queryParams.contentIdLike" placeholder="请输入内容ID" clearable
                  @change="inputSearch" @keydown.enter="inputSearch" @clear="inputSearch" />
              </el-form-item>
              <el-form-item label="渠道" class="right-20">
                <el-select class="width-220" v-model="queryParams.channel" placeholder="请选择" clearable filterable
                  @change="handleQuery">
                  <el-option v-for="dict in channelList" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="类目" class="right-20">
                <el-select class="width-220" v-model="queryParams.categoryId" placeholder="请选择" clearable filterable
                  @change="handleQuery">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.STANDARD_CATEGORY, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </template>
          </el-form>
        </div>
        <div class="row-center" style="width: 70px; align-items: flex-start">
          <el-button class="commonResetBtn new-btn-font" @click="resetQuery" style="width: 60px">
            重置
          </el-button>
        </div>
      </div>
      <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand">
        <template #expandDown>
          <el-icon style="margin-right: auto">
            <ArrowDown :size="12" color="#666666" />
          </el-icon>
        </template>
        <template #expandUp>
          <el-icon style="margin-right: auto">
            <ArrowUp :size="12" color="#666666" />
          </el-icon>
        </template>
      </SWFilterExpandAll>
      <div class="row-center table-top">
        <div class="row-center">
          <div>列表状态：</div>
          <div class="right-20">
            <el-badge :value="directorCount" color="#EB3737" :show-zero="false" badge-class="my-badge"
              :max="directorCount > 99 ? directorCount : 99">
              <el-checkbox label="编导未认领" v-model="directorStatus" border @change="handleQuery"
                :disabled="queryParams.directorId" />
            </el-badge>
          </div>
          <div class="right-20">
            <el-badge :value="editCount" color="#EB3737" :show-zero="false" badge-class="my-badge"
              :max="editCount > 99 ? editCount : 99">
              <el-checkbox label="剪辑未认领" border v-model="editStatus" @change="handleQuery"
                :disabled="queryParams.editId" />
            </el-badge>
          </div>
          <div>
            <el-badge :value="contributorCount" color="#EB3737" :show-zero="false" badge-class="my-badge"
              :max="contributorCount > 99 ? contributorCount : 99">
              <el-checkbox label="投手未认领" border v-model="contributorStatus" @change="handleQuery"
                :disabled="queryParams.contributorId" />
            </el-badge>
          </div>
        </div>
        <div class="row-center">
          <el-button type="primary" @click="exportData" :loading="exportLoading">
            <img src="@/assets/imgs/export-white.svg" class="export-icon" />
            导出
          </el-button>
          <el-button type="primary" @click="handleMultipleClaim" :loading="batchLoading">
            <el-image :src="MultipleIcon" class="multiple-icon" />
            批量认领
          </el-button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
      :show-overflow-tooltip="false" row-class-name="commonTableRow" class="SWCommonTable"
      v-horizontal-scroll="'always'" border ref="tableRef" @selection-change="handleSelectionChange">
      <!--         :selectable="handleSelectable" -->
      <el-table-column type="selection" :selectable="handleSelectable" width="50" fixed="left" align="center" />
      <el-table-column label="商品" prop="goodsName" width="225" fixed="left">
        <template v-slot="{ row }">
          <div class="row-center">
            <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20"
              :disabled="!row.goodsId && !row.goods_id">
              <template #reference>
                <el-image class="goods-image" :src="row.goodsImage || getImgUrlById(row.goodsId)" fit="fill"
                  v-if="row.goodsImage || row.goodsId">
                  <template #error>
                    <div class="image-slot">
                      <el-icon :size="30"><icon-picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <el-avatar shape="square" :size="64" icon="Picture" v-else
                  style="cursor: pointer; background-color: #e5e5e5" />
              </template>
              <GoodCard :good="{
                materialName: row.goodsName,
                materialId: row.goodsId,
                channel: row.channelType
              }" />
            </el-popover>
            <el-tooltip effect="dark" :content="row.goodsName" placement="top"
              :disabled="!row.goodsName || row.goodsName.length < 18">
              <div class="goods-title text2">{{ row.goodsName || '--' }}</div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="视频" prop="videoUrl" width="100">
        <template v-slot="{ row }">
          <line-video :urls="row.videoUrl" title="视频" v-if="row.openVideoUrl">
            <div class="row-center goods-image" style="background-color: #e5e5e5">
              <el-image :style="{ cursor: row.videoUrl ? 'pointer' : 'default' }" :src="row.coverUrl" fit="contain"
                style="width: 64px; height: 64px" />
            </div>
          </line-video>
          <div class="row-center goods-image" style="background-color: #e5e5e5" v-else>
            <el-image :src="row.coverUrl" fit="contain" style="width: 64px; height: 64px; cursor: pointer"
              @click="openVideo(row.videoUrl)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="内容ID" prop="contentId" min-width="120" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'contentId', '-')" />
      <el-table-column label="渠道" prop="name" min-width="150">
        <template v-slot="{ row }">
          <div class="row-center">
            <img v-if="row.channelType && getImageUrl(row.channelType)" class="channel-img"
              :src="getImageUrl(row.channelType)" object-fit="contain" />
            <div>{{ getLable(channelList, row.channel) || '--' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类目" prop="categoryId" min-width="110" show-overflow-tooltip>
        <template v-slot="{ row }">
          <div class="text2">{{
            getDictLabel(DICT_TYPE.STANDARD_CATEGORY, row.categoryId) || '-'
          }}</div>
        </template>
      </el-table-column>
      <el-table-column label="编导" prop="directorName" min-width="100">
        <template v-slot="{ row }">
          <line-avatar :user="row" name="directorName" image="directorHeadImg" v-if="row.directorId" />
          <div v-else class="row-center">
            <emptyTag />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="剪辑" prop="editName" min-width="100">
        <template v-slot="{ row }">
          <line-avatar :user="row" name="editName" image="editHeadImg" v-if="row.editId" />
          <div v-else class="row-center">
            <emptyTag />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="投手" prop="contributorName" min-width="100">
        <template v-slot="{ row }">
          <line-avatar :user="row" name="contributorName" image="contributorHeadImg" v-if="row.contributorId" />
          <div v-else class="row-center">
            <emptyTag />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="统计时间">
        <template #header>
          <div class="row-center" style="justify-content: center">
            <div>{{ getTableTime }}</div>
            <el-tooltip effect="dark" content="按照统计时间展示数据信息" placement="top" popper-style="max-width:128px">
              <img src="@/assets/imgs/newMedia/question-grey.svg" class="question-icon" /></el-tooltip>
          </div>
        </template>
        <el-table-column label="浏览量" prop="viewCount" min-width="90" align="right"
          :formatter="(row: any) => numberFormateShow(row.viewCount) || '0'" />
        <el-table-column label="成交金额(元)" prop="zhongcaoAmount" min-width="150" align="right">
          <template v-slot="{ row }">
            <span style="margin-right: 15px">{{
              numberFormateShow(row.zhongcaoAmount) || '0'
            }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
          <!--  v-if="canClaim(row)" -->
          <el-button v-if="canClaim(row)" link type="primary" @click="openClaim(row)"
            :loading="row.loading">认领</el-button>
          <!--   v-if="grabCheck('云视频管理员')" -->
          <el-button v-if="grabCheck('云视频管理员')" link type="primary" @click="openDistribute(row)">分配</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <div class="flex-column" style="align-items: center">
          <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" />
          <span>暂无数据</span>
        </div>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList" />
    </div>
    <detail-drawer ref="detailDrawerRef" />
    <distribute-dialog ref="distributeDialogRef" @success="handleDirectorSuccess" />
    <iframeVideo ref="iframeVideoRef" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import GoodCard from '@/components/common/goods/goodCard.vue'
import LineVideo from '@/components/template/table/components/lineVideo.vue'
import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import SelectUserWithOther from '@/components/common/user/selectUserWithOther.vue'
import { formatterValue, getImageUrl } from '@/utils'
import { numberFormateShow } from '@/utils/formatter'
import DetailDrawer from './components/detailDrawer.vue'
import DistributeDialog from './components/distributeDialog.vue'
import { cloneDeep, debounce } from 'lodash-es'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { channelList, getLable } from './common'
import { getGoodsWorksInfo, getGoodsDate, exportList, getNotClaimCount } from '@/api/yunVideo/index'
import download from '@/utils/download'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
import { getImgUrlById } from '@/utils/index'
import { useRole } from '@/hooks/common/useRole'
const { grabCheck, getPermissionInfo, getRole } = useRole('新媒体')
import iframeVideo from './components/iframeVideo.vue'
import { defineAsyncComponent } from 'vue'
import { useDialog } from '@/hooks/web/useDialog'
const { openDialog } = useDialog()
const isExpand = ref(true)
const list = ref<any[]>([])
const loading = ref(false)
const message = useMessage()
const detailDrawerRef = ref<any>()
import emptyTag from './components/emptyTag.vue'
import MultipleIcon from '@/assets/svgs/multiple-op.svg'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'

const otherOption = [
  {
    userId: 'qita',
    realName: '其他',
    avatarOrigin: DefaultAvatar
  }
]

const queryParams = ref<any>({
  page: 1,
  size: 10,
  keyword: undefined, //商品主键
  directorId: undefined, //编导
  editId: undefined, //剪辑
  contributorId: undefined, //投手
  contentIdLike: undefined, //内容ID
  channel: undefined, //渠道
  categoryId: undefined //类目
})
const total = ref(0)
const queryFormRef = ref()
const tableRef = ref()
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value = {
    page: 1,
    size: 10,
    keyword: undefined, //商品主键
    directorId: undefined, //编导
    editId: undefined, //剪辑
    contributorId: undefined, //投手
    contentIdLike: undefined, //内容ID
    channel: undefined, //渠道
    categoryId: undefined //类目
  }
  times.value = [dataDate.value, dataDate.value]
  tableRef.value?.clearSelection()
  multipleSelection.value = []
  ids.value = []
  getList()
  getNums()
}
//编导
const directorStatus = ref(false)
//剪辑
const editStatus = ref(false)
//投手
const contributorStatus = ref(false)
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getNums()
  getList()
}
//统计时间
const dataDate = ref('')
const times = ref<any[]>([])
const dealParams = (needPage: boolean = false) => {
  const params = cloneDeep(queryParams.value)
  Object.keys(params).forEach((key) => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }
  })
  if (directorStatus.value) {
    params.directorNotClaim = true
  }
  if (editStatus.value) {
    params.editNotClaim = true
  }
  if (contributorStatus.value) {
    params.contributorNotClaim = true
  }
  if (times.value?.length === 2 && times.value[0] && times.value[1]) {
    params.dataDateStart = times.value[0]
    params.dataDateEnd = times.value[1]
  }
  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}

const getList = async () => {
  loading.value = true
  try {
    const data = await getGoodsWorksInfo(dealParams(true))
    if (data?.records?.length) {
      data.records.map(
        (item) =>
        (item.openVideoUrl = [
          '.mp4',
          '.avi',
          '.mov',
          '.wmv',
          '.flv',
          '.mkv',
          '.webm',
          '.m4v',
          '.3gp',
          '.mpeg/.mpg',
          '.rmvb',
          '.ts',
          '.vob'
        ].includes('.' + item.videoUrl.split('.').pop()))
      )
      list.value = data.records
      total.value = data.total
    } else {
      list.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}

const contributorCount = ref(0)
const directorCount = ref(0)
const editCount = ref(0)

const getNums = async () => {
  const params: any = cloneDeep({ ...dealParams() });
  delete params.contributorNotClaim;
  delete params.directorNotClaim;
  delete params.editNotClaim;
  const data = await getNotClaimCount(params)
  contributorCount.value = data.contributorCount || 0
  directorCount.value = data.directorCount || 0
  editCount.value = data.editCount || 0
}

const route = useRoute()
const title = ref<any>('')
onMounted(() => {
  title.value = route.meta.title
  getPermissionInfo(() => {
    init()
  })
})

const init = async () => {
  try {
    loading.value = true
    const res = await getGoodsDate()
    dataDate.value = res
    times.value = [res, res]
    handleQuery()
  } catch (err) {
  } finally {
    loading.value = false
  }
}

const exportLoading = ref(false)
//导出
const exportData = async () => {
  try {
    exportLoading.value = true
    const data = await exportList(dealParams())
    message.success('导出成功')
    if (data) {
      download.excel(data, `云视频列表(统计时间:${getTableTime.value}).xlsx`)
    }
  } catch (err) {
  } finally {
    exportLoading.value = false
  }
}
//详情
const handleDetail = (row: any) => {
  const params = cloneDeep(row)
  Object.assign(params, { dataDateStart: times.value[0], dataDateEnd: times.value[1] })
  detailDrawerRef.value.open(params)
}
//认领改为表单弹窗
const openClaim = async (row: any) => {
  await openDialog({
    title: '认领',
    width: 520,
    content: defineAsyncComponent(() => import('./components/claimDialog.vue')),
    props: {
      ids: [row.id],
      initDirectorId: row.directorId,
      initEditId: row.editId,
      initContributorId: row.contributorId
    },
    onSuccess: () => {
      getList()
      getNums()
    }
  })
}
const distributeDialogRef = ref<any>()
//分配
const openDistribute = (row: any) => {
  distributeDialogRef.value?.open(row)
}

//当前是否可以认领
const canClaim = (row: any) => {
  if (!grabCheck('编导') && !grabCheck('剪辑') && !grabCheck('投手')) return false
  const rules: any[] = []
  if (grabCheck('编导')) {
    rules.push('directorId')
  }
  if (grabCheck('剪辑')) {
    rules.push('editId')
  }
  if (grabCheck('投手')) {
    rules.push('contributorId')
  }

  return rules.some((rule) => !row[rule])
}

const iframeVideoRef = ref()

const openVideo = (url: string) => {
  iframeVideoRef.value.open(url)
  // window.open(url)
}

const handleDirectorSuccess = () => {
  getNums()
  getList()
}

const inputSearch = debounce(async () => {
  handleQuery()
}, 1000)

const handleSelectable = (row: any) => {
  return canClaim(row)
}

const getTableTime = computed(() => {
  if (times.value?.length === 2 && times.value[0] && times.value[1]) {
    return `${times.value[0]} 至 ${times.value[1]}`
  }
  return '-'
})
const multipleSelection = ref<any[]>([])
const ids = ref<any[]>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = cloneDeep(val)
  ids.value = multipleSelection.value.map((item) => item.id)
}

const batchLoading = ref(false)
//批量认领改为表单弹窗
const handleMultipleClaim = async () => {
  if (ids.value.length === 0) {
    await message.error('无认领数据请选择后操作！')
    return
  }
  batchLoading.value = true
  await openDialog({
    title: '批量认领',
    width: 520,
    content: defineAsyncComponent(() => import('./components/claimDialog.vue')),
    props: {
      ids: ids.value
    },
    onSuccess: () => {
      message.success('认领成功')
      tableRef.value?.clearSelection()
      multipleSelection.value = []
      ids.value = []
      getList()
      getNums()
    },
    onCancel: () => {
      batchLoading.value = false
    }
  })
  batchLoading.value = false
}
</script>
<style lang="scss" scoped>
.table-top {
  justify-content: space-between;
  font-size: 16px;
  color: #333333;
  font-weight: 500;
  margin-bottom: 12px;
  width: 100%;
}

.SWCommonTable {
  & {
    --el-table-border-color: #e5e5e5;
  }
}

.export-icon {
  width: 12px;
  height: 12px;
  margin-right: 10px;
}

.goods-image {
  width: 64px;
  height: 64px;
  border-radius: 3px;
  cursor: pointer;
}

.goods-title {
  margin-left: 10px;
  width: 127px;
  color: #0064ff;
}

.channel-img {
  width: 20px;
  margin-right: 3px;
}

.question-icon {
  margin-left: 3px;
  width: 12px;
  height: 12px;
  cursor: pointer;
}

.rule-form {
  & {
    --el-input-inner-height: 30px;
  }

  :deep(.el-form-item__label) {
    padding: 0 10px 0 0;
  }

  .each-form {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  :deep(.SWFilterExpandAll-middle-text) {
    color: #666666;
  }

  :deep(.SWFilterExpandAll) {
    margin-bottom: 15px;
  }

  :deep(.el-input) {
    width: 220px !important;
  }

  :deep(.el-input__wrapper) {
    height: 30px;
    padding: 0 11px;
    box-shadow: none;
    border: 1px solid #e5e5e5;

    &:hover {
      box-shadow: none;
      border-color: #0064ff;
    }

    .is-focus {
      box-shadow: none;
      border-color: #0064ff;
    }
  }

  :deep(.el-input__inner) {
    height: 30px;
    line-height: 30px;
  }
}

.right-20 {
  margin-right: 20px !important;
}

.width-220 {
  width: 220px !important;
}

:deep(.my-badge) {
  height: 14px;
  font-size: 10px;
  margin-right: 3px;
}

.new-btn-font {
  font-size: 14px;
}

.upload-time {
  :deep(.el-range-editor.el-input__wrapper) {
    padding: 0;
  }

  :deep(.el-date-editor) {
    width: 220px;
  }
}

.multiple-icon {
  width: 11px;
  height: 12px;
  margin-right: 10px;
}
</style>
