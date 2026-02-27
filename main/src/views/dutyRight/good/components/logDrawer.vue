<template>
  <scheme-details ref="detailsRef" name="StoreLog" :width="1200">
    <template #card>
      <div>
        <el-form inline :model="dataValue" label-width="auto">
          <el-form-item style="margin-right: 20px;">
            <el-select v-model="dataValue.bizId" filterable clearable remote placeholder="商品名/商品ID"
              :remote-method="remoteMethod" :loading="searchLoading" style="width: 200px" class="goods-select"
              @change="handleQuery">
              <el-option v-for="item in options" :key="item.id" :label="item.goodsName" :value="item.goodsId" />
            </el-select>
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
          <el-table-column prop="goodsName" label="商品" width="210">
            <template #default="{ row }">
              <div class="row-center">
                <img :src="row.goodsImage" class="storeImg" alt="" />
                <el-tooltip :content="row.goodsName" placement="top"
                  popper-style="max-width:200px;word-break:break-all;">
                  <div class="ml5px text1" style="max-width: 150px;">{{ row.goodsName }}</div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="bizId" label="商品Id" width="120" show-overflow-tooltip></el-table-column>
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
export default { name: 'StoreLog' };
</script>

<script lang="tsx" setup>
import { cloneDeep } from "lodash-es";
import request from '@/config/axios';
import timeRangeSelect from '../../components/timeRangeSelect.vue';
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict';
import { useAppStore } from '@/store/modules/app';
// import storeCell from './storeCell.vue';
import dayjs from "dayjs";
const appStore = useAppStore();


const tableList = ref<any[]>([]);
class DataItem {
  page: number = 1;
  size: number = 10;
  bizType: number = 3;
  bizId: string = '';
  operateType: string | undefined = undefined;
  startTime: string = dayjs().subtract(29, 'day').format('YYYY-MM-DD');
  endTime: string = dayjs().format('YYYY-MM-DD');
};
const total = ref<number>(0);

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<any>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false), searchLoading = ref<boolean>(false), options = ref<any[]>([]);

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
const reset = () => {
  dataValue.value = { ...new DataItem() };
  getList()
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = cloneDeep(dataValue.value);

    const data = await request.get({ url: "/api/opDutyAuthorityManage/goods/recordList", params: params })
    if (data) {
      tableList.value = Array.isArray(data.records) ? data.records : []
      total.value = data?.total ?? 0
    }
  } finally {
    loading.value = false
  }
}

const remoteMethod = (query: string) => {
  if (query) {
    searchLoading.value = true
    request.get({
      url: '/api/goods-person-responsibility/list',
      params: {
        nameAndId: query,
        page: 1,
        size: 20
      }
    }).then((res: any) => {
      options.value = Array.isArray(res?.records) ? res?.records : []
    }).finally(() => {
      searchLoading.value = false
    })
  } else {
    options.value = []
  }
}

defineExpose({ openView });

provide('StoreLogDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
:deep(.my-table-tooltip) {
  max-width: 380px;
  max-height: 300px;
  overflow-y: auto;
  word-break: break-all;
}

.storeImg {
  width: 30px;
  height: 30px;
  border-radius: 4px;
}

:deep(.card_info) {
  .el-card__body {
    padding: 12px 5px 12px 12px !important;
  }
}
</style>
