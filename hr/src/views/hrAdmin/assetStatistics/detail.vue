<template>
  <ContentWrap>
    <div class="mb-5px">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="auto">
            <el-form-item label="品名" prop="pname" style="margin-right: 20px">
              <el-input style="width: 200px" value-on-clear="" v-model.trim="queryParams.pname" placeholder="请输入"
                clearable @keyup.enter="handleQuery" @clear="handleQuery" />
            </el-form-item>
            <el-form-item label="申请类型" prop="sqlx" style="margin-right: 20px">
              <el-select style="width: 200px" v-model="queryParams.sqlx" placeholder="请选择" @change="handleQuery"
                clearable>
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ASSET_DETAIL_APPLY_TYPE, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="申请时间" style="margin-right: 20px">
              <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期"
                @change="handleQuery" format="YYYY-MM-DD" value-format="YYYY-MM-DD" end-placeholder="结束日期"
                :disabled-date="disabledDate" style="width: 260px;" />
            </el-form-item>
            <el-form-item label="状态" prop="status" style="margin-right: 20px">
              <el-select style="width: 200px" v-model="queryParams.status" placeholder="请选择" @change="handleQuery"
                clearable>
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ASSET_DETAIL_STATUS, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <template v-if="isExpand">
              <el-form-item label="资产类型" prop="zclx" style="margin-right: 20px">
                <el-select style="width: 200px" v-model="queryParams.zclx" placeholder="请选择" @change="handleQuery"
                  clearable>
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.FIXED_ASSET_TYPE, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </template>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button class="commonResetBtn" @click="resetQuery">
            重置
          </el-button>
          <el-button type="primary" :disabled="ids.length === 0" :loading="releaseLoading" @click="releaseBanch">
            批量释放
          </el-button>
          <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
      :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'"
      ref="tableRef" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" fixed="left" />
      <el-table-column label="资产照片" prop="name" width="120" fixed="left">
        <template v-slot="{ row }">
          <el-image style="width: 56px; height: 56px" :src="row.imageUrl" fit="fill" v-if="row.imageUrl"
            :preview-src-list="[row.imageUrl]" :z-index="9999" preview-teleported>
            <template #error>
              <div class="image-slot">
                <el-icon :size="30"><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
          <el-avatar shape="square" :size="56" icon="Box" v-else />
        </template>
      </el-table-column>
      <el-table-column label="品名" prop="pname" min-width="140" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'pname', '-')" fixed="left" />
      <el-table-column label="编号" prop="number" min-width="140" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'number', '-')" />
      <el-table-column label="区域" prop="area" min-width="140" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'area', '-')" />
      <el-table-column label="资产类型" prop="zclx" width="120">
        <template v-slot="{ row }">
          {{ getDictLabel(DICT_TYPE.FIXED_ASSET_TYPE, row.zclx) }}
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="sqsj" width="180"
        :formatter="(row: any) => formatTime(row.sqsj, 'yyyy-MM-dd HH:mm:ss') || '-'" />
      <el-table-column label="申请类型" prop="sqlx" width="100">
        <template v-slot="{ row }">
          <div class="row-center">
            <div class="status-icon" :class="'status-icon-' + row.sqlx"></div>
            <div>{{ getDictLabel(DICT_TYPE.ASSET_DETAIL_APPLY_TYPE, row.sqlx) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="归还时间" prop="yghsj" width="180"
        :formatter="(row: any) => formatTime(row.yghsj, 'yyyy-MM-dd HH:mm:ss') || '-'" />
      <el-table-column label="数量" prop="num" width="120" align="right">
        <template v-slot="{ row }">
          {{ numberFormateShow(row.num) || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" min-width="140">
        <template v-slot="{ row }">
          <div class="tag-item" :class="{ 'tag-item-done': Number(row.status) === 1 }">
            {{ getDictLabel(DICT_TYPE.ASSET_DETAIL_STATUS, row.status) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template v-slot="{ row }">
          <el-button link type="primary" @click="releaseSingle(row)" :loading="row.loading">释放</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <div class="flex-column" style="align-items: center;">
          <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
          <span>暂无数据</span>
        </div>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList" />
    </div>

  </ContentWrap>
</template>

<script lang="ts">
export default { name: 'AssetStatisticsDetailList' };
</script>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { numberFormateShow } from '@/utils/formatter'
import { formatterValue, formatTime } from "@/utils";
import { getAssetDetailPage, batchDetailAssetDetail } from '@/api/hrAdmin/assetStatistics/index'
import { cloneDeep } from 'lodash-es';

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()
const message = useMessage()
const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]);// 列表的数据

const queryParams = ref({
  id: "",
  pname: '',//品名
  sqlx: '',//申请类型
  status: '', // 状态
  zczt: '', // 资产状态
  zclx: '', // 资产类型
  userId: '',
  page: 1,
  size: 10
})
const isExpand = ref(true)
const times = ref<any[]>([])
const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const tableRef = ref() // 列表的ref
const ids = ref<any[]>([]); // 选中的id
const selections = ref<any[]>([]); // 选中的数据

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  tableRef.value?.clearSelection()
  ids.value = []
  times.value = []
  selections.value = []
  handleQuery()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 查询列表 */
const getList = async () => {
  if (!route.query.userId) {
    message.error("未携带必要信息！")
    router.back()
    return
  }
  loading.value = true
  try {
    const params: any = cloneDeep(queryParams.value)
    params.userId = route.query.userId;
    if (times.value && Array.isArray(times.value) && times.value.length === 2 && times.value[0] && times.value[1]) {
      params.sqsjks = times.value[0];
      params.sqsjjs = times.value[1];
    }
    const res = await getAssetDetailPage(params)
    list.value = res && res.records && Array.isArray(res.records) ? res.records : []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
const handleSelectionChange = (selction: any[]) => {
  ids.value = selction.map((item: any) => item.id)
  selections.value = cloneDeep(selction)
}

const releaseLoading = ref(false)
//单个释放
const releaseSingle = async (row: any) => {
  const infos = `确定要释放编号为${row.number}的${row.pname}资产吗？`
  try {
    // 二次确认
    await message.confirm(`${infos}`)
    row.loading = true
    await batchDetailAssetDetail({ ids: row.id })
    message.success("释放成功！")
    getList()
  } catch (err) { } finally {
    row.loading = false
  }
}
//批量释放
const releaseBanch = async () => {
  if (ids.value.length === 0) return
  const infos: string[] = [];
  selections.value.map(item => {
    infos.push(`编号为 ${item.number}的${item.pname}资产`)
  })
  const allInfo = `确定要释放${infos.join("、")}吗？`
  try {
    await message.confirm(`${allInfo}`)
    releaseLoading.value = true
    await batchDetailAssetDetail({ ids: ids.value.join(",") })
    message.success("批量释放成功！")
    tableRef.value?.clearSelection()
    ids.value = []
    selections.value = []
    getList()
  } catch (err) { } finally {
    releaseLoading.value = false
  }

}


onMounted(() => {
  getList()
})

</script>
<style lang="scss" scoped>
.status-icon {
  width: 8px;
  height: 8px;
  border-radius: 10px;
  margin-right: 10px;

  &-1 {
    background-color: #0064FF;
  }

  &-2 {
    background-color: #DB6A0F;
  }
}

.tag-item {
  width: 74px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 28px;
  font-size: 14px;
  color: #666666;
  background-color: #E5E5E5;

  &-done {
    color: #349B34;
    background-color: #D6EBD6;
  }
}
</style>