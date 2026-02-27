<template>
  <scheme-details ref="detailsRef" name="CategoryLog" :width="1540">
    <template #card>
      <div>
        <el-form inline :model="dataValue" label-width="auto">
          <el-form-item style="margin-right: 20px;">
            <el-select v-model="dataValue.channel" placeholder="请选择渠道" filterable clearable
              @change="handleChannelChange" style="width: 200px;">
              <el-option v-for="item in filterChannel" :key="item.value"
                :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-right: 20px;">
            <el-select v-model="dataValue.categroyType" placeholder="类目类型" style="width: 200px;">
              <el-option label="电商类目" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-right: 20px;">
            <CategoryCascader :channelCode="[dataValue.channel]" :disabled="!dataValue.channel"
              v-model="dataValue.completeCategoryName" @change="handleQuery" :cascader-props="{ checkStrictly: true }"
              disabled-channel />
          </el-form-item>
          <el-form-item>
            <timeRangeSelect v-model="dataValue" need-full @change="handleQuery" format="YYYY-MM-DD" :canClear="false"
              :width="200" />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-select v-model="dataValue.operateType" placeholder="请选择操作类型" filterable clearable @change="handleQuery"
              style="width: 200px;">
              <el-option v-for="item in getIntDictOptions(DICT_TYPE.OP_DUTY_AUTHORITY_MANAGE_OPERATE_TYPE)"
                :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="tableList"
          row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'" ref="tableRef" border
          :tooltip-options="{ popperClass: 'my-table-tooltip' }" max-height="calc(100vh - 220px)">
          <el-table-column prop="category" label="类目" width="180">
            <template #default="{ row }">
              <el-tooltip :content="row.channelCategoryName" placement="top">
                <span class="text1">{{ row.category }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="operateType" label="操作类型" width="150" show-overflow-tooltip
            :formatter="(row) => getDictLabel(DICT_TYPE.OP_DUTY_AUTHORITY_MANAGE_OPERATE_TYPE, row.operateType) || '-'" />
          <el-table-column prop="content" label="操作内容" min-width="180" show-overflow-tooltip
            :formatter="(row) => row.content || '-'" />
          <el-table-column prop="createdAt" label="操作时间" width="170"
            :formatter="(row) => dayjs(row.createdAt).isValid() ? dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-'" />
          <el-table-column prop="createdName" label="操作人" width="100" />
          <template #empty>
            <div class="flex-column" style="align-items: center;">
              <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" />
              <span>暂无数据</span>
            </div>
          </template>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-wrapper">
          <Pagination :total="total" v-model:page="dataValue.page" v-model:limit="dataValue.size"
            @pagination="getList" />
        </div>
      </div>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'CategoryLog' };
</script>

<script lang="tsx" setup>
import { cloneDeep } from "lodash-es";
import request from '@/config/axios';
import timeRangeSelect from '../../components/timeRangeSelect.vue';
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict';
import { useAppStore } from '@/store/modules/app';
import dayjs from "dayjs";
import CategoryCascader from '../../components/categoryCascader.vue'
const appStore = useAppStore();


const tableList = ref<any[]>([]);
class DataItem {
  page: number = 1;
  size: number = 10;
  bizType: number = 2;
  completeCategoryName: string[] = [];
  operateType: string | undefined = undefined;
  startTime: string = dayjs().subtract(29, 'day').format('YYYY-MM-DD');
  endTime: string = dayjs().format('YYYY-MM-DD');
  channel: string = '';
  categroyType: number = 1
};
const total = ref<number>(0);

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<any>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => viewType.value === 'view' ? '操作日志' : '编辑');

// 弹出通用
const openView = () => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    tableList.value = []
    total.value = 0
    dataValue.value = { ...new DataItem() };
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
    getList();
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
    });
  });
};

/** 搜索按钮操作 */
const handleQuery = () => {
  dataValue.value.page = 1
  getList()
}

const handleChannelChange = () => {
  dataValue.value.completeCategoryName = []
  handleQuery()
}
const reset = () => {
  dataValue.value = { ...new DataItem() };
  getList()
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = cloneDeep(dataValue.value);
    params.completeCategoryName = dataValue.value.completeCategoryName?.length > 0 ? dataValue.value.completeCategoryName.filter((val, i) => i > 0).join('>>') : '';
    delete params.categroyType
    const data = await request.get({ url: "/api/opDutyAuthorityManage/category/recordList", params: params })
    if (data) {
      tableList.value = Array.isArray(data.records) ? data.records : []
      total.value = data?.total ?? 0
    }
  } finally {
    loading.value = false
  }
}

const filterChannel = computed(() => getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true).filter(item => ['TaoBao', 'Tmall', 'Pdd', 'Douyin'].includes(item.value)))

defineExpose({ openView });

provide('CategoryLogDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
:deep(.my-table-tooltip) {
  max-width: 380px;
  max-height: 300px;
  overflow-y: auto;
  word-break: break-all;
}

:deep(.card_info) {
  .el-card__body {
    padding: 12px 5px 12px 12px !important;
  }
}
</style>
