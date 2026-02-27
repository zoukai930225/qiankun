<template>
  <ContentWrap>
    <div class="mb-5px">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="auto">
            <el-form-item label="指标CODE" prop="metricCode" style="margin-right: 20px">
              <el-input style="width: 200px" value-on-clear="" v-model.trim="queryParams.metricCode" placeholder="指标名称/CODE"
                clearable @keyup.enter="queryList" />
            </el-form-item>
            <el-form-item label="指标类型" prop="metricType" style="margin-right: 20px">
              <el-select style="width: 200px" v-model="queryParams.metricType" placeholder="请选择" clearable
                value-on-clear="" filterable @change="queryList">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.METRIC_TYPE, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="指标描述" prop="metricDescription" style="margin-right: 20px">
              <el-input style="width: 200px" value-on-clear="" v-model.trim="queryParams.metricDescription"
                placeholder="请输入" clearable @keyup.enter="queryList" />
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
              新增指标
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-table class="SWCommonTable" :data="dataList" width="100%" v-horizontal-scroll="'always'" stripe
      row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" v-loading="loading">
      <el-table-column label="指标名称" prop="metricName" min-width="180px" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'metricName', '-')" />
      <el-table-column label="指标CODE" prop="metricCode" min-width="150px" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'metricCode', '-')" />
      <el-table-column label="指标类型" prop="metricType" width="120px" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ getDictLabel(DICT_TYPE.METRIC_TYPE, row.metricType) || '-' }}</span>
        </template></el-table-column>
      <el-table-column label="指标描述" prop="metricDescription" min-width="180px" show-overflow-tooltip
        :formatter="(row: any) => formatterValue(row, 'metricDescription', '-')" />
      <el-table-column label="更新时间" prop="updatedTime" width="120px" show-overflow-tooltip
        :formatter="(row: any) => formatTime(row.updatedTime, 'yyyy-MM-dd')" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" style="color: #0064ff" @click="handleUpdate(row.id)">编辑</el-button>
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
import { useAppStore } from '@/store/modules/app';
import { formatterValue, formatTime } from "@/utils";
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { getSysMetricManagementList, delSysMetricManagement } from '@/api/biControl/quota/index'
import FormDrawer from './components/formDrawer.vue';
const appStore = useAppStore();
const dataList = ref<any[]>([]);
const message = useMessage();
const { t } = useI18n()
const loading = ref(false) // 列表的加载中
const queryParams = ref({
  //指标编码
  metricType: "",
  metricDescription: "",
  metricCode: "",
  page: 1,
  size: 10
})
const total = ref(0)
const queryList = () => {
  queryParams.value.page = 1;
  getList()
}

const resetList = () => {
  queryParams.value = {
    //指标编码
    metricType: "",
    metricDescription: "",
    metricCode: "",
    page: 1,
    size: 10
  }
  getList()
}
const getList = async () => {
  loading.value = true;
  try {
    const res = await getSysMetricManagementList(queryParams.value)
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

const handleAdd = () => {
  openDrawer('add', '')
}
// 删除事件
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await delSysMetricManagement(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>