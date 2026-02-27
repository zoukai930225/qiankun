<template>
  <ContentWrap>
    <div class="mb-5px">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="auto">
            <el-form-item label="页面名称" prop="metricType" style="margin-right: 20px">
              <el-select style="width: 200px" v-model="queryParams.webCode" placeholder="请选择" clearable
                value-on-clear="" filterable @change="queryList">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.METRIC_WEB_CODE, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button class="commonSearchBtn" @click="queryList">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button class="commonResetBtn" style="margin-left: 0px" @click="resetList">
              重置
            </el-button>
            <el-button type="primary" @click="handleAdd">
              <Icon :size="14" icon="ep:plus" class="mr4px" />
              新增页面模块
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-table class="SWCommonTable" :data="dataList" width="100%" v-horizontal-scroll="'always'" stripe
      row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" v-loading="loading">
      <el-table-column label="页面CODE" prop="webCode" :width="150">
        <template #default="{ row }">
          <div class="row-center">
            <el-tooltip :content="row.webCode" :disabled="row.webCode?.length < 16">
              <span class="text1">{{ row.webCode || '-' }}</span>
            </el-tooltip>
            <el-icon :size="14" color="#999" style="cursor: pointer;" class="ml4px" @click="handleCopy(row.webCode)"
              v-if="row.webCode">
              <DocumentCopy />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="页面名称" prop="webName" :width="120" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'webName', '-')" />
      <el-table-column label="模块CODE" prop="moduleCode" :min-width="120">
        <template #default="{ row }">
          <div class="row-center">
            <el-tooltip :content="row.moduleCode" :disabled="row.moduleCode?.length < 16">
              <span class="text1">{{ row.moduleCode || '-' }}</span>
            </el-tooltip>
            <el-icon :size="14" color="#999" style="cursor: pointer;" class="ml4px" @click="handleCopy(row.moduleCode)"
              v-if="row.moduleCode">
              <DocumentCopy />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="模块名称" prop="moduleName" width="150px" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'moduleName', '-')" />
      <el-table-column label="对应业务表" prop="businessTable" width="120px" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'businessTable', '-')" />
      <el-table-column label="前端可选指标" prop="webSelectListDetail" min-width="250px">
        <template #default="{ row }">
          <TableTag :data="row.webSelectListDetail" :config="tagConfig" />
        </template>
      </el-table-column>
      <el-table-column label="前端默认指标" prop="webDefaultListDetail" min-width="250px">
        <template #default="{ row }">
          <TableTag :data="row.webDefaultListDetail" :config="tagConfig" />
        </template>
      </el-table-column>
      <el-table-column label="更新日期" prop="updatedTime" width="120px" show-overflow-tooltip
        :formatter="(row: any) => formatTime(row.updatedTime, 'yyyy-MM-dd')" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" style="color: #0064ff" @click="handleUpdate(row.id)">编辑</el-button>
          <el-button link type="primary" @click="handleCopyVal(row.id)">复制</el-button>
          <!-- <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button> -->
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
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList" />
    </div>
    <FormDrawer ref="addDrawerRef" @success="getList" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import TableTag from './components/TableTag.vue'
import { useAppStore } from '@/store/modules/app';
import { formatterValue, formatTime } from "@/utils";
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { getSysMetricGroupList, delSysMetricGroup } from '@/api/biControl/quota/index'
import FormDrawer from './components/formDrawer.vue';
import { copyText } from '@/utils/copyText'
const appStore = useAppStore();
const dataList = ref<any[]>([])
const loading = ref(false)
const message = useMessage();
const { t } = useI18n();
const queryParams = ref({
  webCode: "",
  page: 1,
  size: 10
})

const tagConfig = {
  lable: 'metricName',

}
const total = ref(0)
const queryList = () => {
  queryParams.value.page = 1;
  getList()
}

const resetList = () => {
  queryParams.value = {
    webCode: "",
    page: 1,
    size: 10
  }
  getList()
}

const getList = async () => {
  loading.value = true;
  try {
    const res = await getSysMetricGroupList(queryParams.value)
    total.value = res && res.total ? res.total : 0
    dataList.value = res && res.records ? res.records : []
  } catch (err) {

  } finally {
    loading.value = false;
  }
}
// 打开新增编辑抽屉
const addDrawerRef = ref()
const openDrawer = (type, id) => {
  addDrawerRef.value?.open(type, id)
}

// 编辑事件
const handleUpdate = (id: any) => {
  openDrawer('update', id)
}
const handleCopyVal = (id: any) => {
  openDrawer('copy', id)
}
const handleAdd = () => {
  openDrawer('add', '')
}
// 删除事件
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await delSysMetricGroup(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}
onMounted(() => {
  getList()
})

// 复制文本到剪贴板的函数
const handleCopy = async (text) => {
  await copyText(text)
  message.success(t('common.copySuccess'))
}
</script>
<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>