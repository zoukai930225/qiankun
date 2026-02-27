<template>
  <search-card v-loading="loading">
    <template #search>
      <div class="box_content">
        <div class="box" v-for="item in boxArr" :class="cur === item.type ? 'actived' : ''" @click="getBoxDetail(item)">
          <div class="box_title">{{ item.title }}</div>
          <div class="box_value">{{ assetsStatistics[item.type] || '-' }}</div>
        </div>
      </div>
      <el-divider></el-divider>
      <s-w-search-form class="rt_qi_search" :schema="searchSchema" :expand-threshold="4" show-expand expand-text="展开"
        collapse-text="收起" @search="handleQuery" @reset="resetQuery" ref="queryFormRef">
        <el-button type="primary" :disabled="ids.length === 0" @click="handleConfirm"
          :loading="confirmLoading">资产确认</el-button>
      </s-w-search-form>
    </template>
    <template #list="listProps">
      <!-- 列表 -->
      <el-table :header-cell-style="appStore.headerCellStyle" :data="list"
        :max-height="((listProps?.height || 500) - 35)" :show-overflow-tooltip="true" row-class-name="commonTableRow1"
        class="SWCommonTable" v-horizontal-scroll="'always'" ref="tableRef" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column label="人员" prop="name" min-width="160" fixed="left">
          <template v-slot="{ row }">
            <div class="row-center">
              <el-avatar :size="18" :src="row.tx" v-if="row.tx" />
              <el-avatar :size="18" icon="UserFilled" v-else />
              <div style="margin-left: 8px;">{{ row.name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属公司" prop="contractCompanyName" min-width="160" show-overflow-tooltip
          :formatter="(row: any) => formatterValue(row, 'contractCompanyName', '-')" />
        <el-table-column label="所属部门" prop="departmentName" min-width="160" show-overflow-tooltip
          :formatter="(row: any) => formatterValue(row, 'departmentName', '-')" />
        <el-table-column label="资产数量" prop="num" width="150">
          <template v-slot="{ row }">
            {{ numberFormateShow(row.num) || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="人员状态" prop="status" min-width="160">
          <template v-slot="{ row }">
            <div class="row-center">
              <div class="status-icon" :class="'status-icon-' + row.status"></div>
              <div>{{ getDictLabel(DICT_TYPE.FEISHU_STATUS, row.status) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="资产状态" prop="zczt" min-width="160">
          <template v-slot="{ row }">
            <div class="tag-item" :class="{ 'tag-item-done': row.zczt === 1 }">
              {{ getDictLabel(DICT_TYPE.ZCTJ_QRZT, row.zczt) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发送时间" prop="sendAt" min-width="170"
          :formatter="(row: any) => formatTime(row.sendAt, 'yyyy-MM-dd HH:mm:ss') || '-'" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDetail(row)">资产明细</el-button>
            <el-button link type="primary" @click="openHistory(row)">确认记录</el-button>
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
      <div class="pagination">
        <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
          @pagination="getList" style="position: absolute;right: 0;margin: 0;" />
      </div>
    </template>
  </search-card>
  <confirmRecordDrawer ref="confirmRecordDrawerRef" />
</template>


<script lang="tsx">
export default { name: 'AssetStatisticsList' };
</script>

<script lang="tsx" setup>
import Menuitem from '@/views/hrAdmin/resources/components/Menuitem.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { formatterValue, formatTime } from "@/utils";
import { numberFormateShow } from '@/utils/formatter'
import { getAssetPage, addAssetConfirms, getAssetStatistics } from '@/api/hrAdmin/assetStatistics/index'
import confirmRecordDrawer from './components/confirmRecordDrawer.vue';
import { cloneDeep } from 'lodash-es'
import { useAppStore } from '@/store/modules/app'
import { getAllDeptTree } from '@/api/system/dept'
import { FormSchema } from '@/types/form';
import UserSelect from './components/userSelect.vue';
import useDialog from '@/hooks/web/useDialog'
import { defineAsyncComponent } from 'vue'

const appStore = useAppStore()
const router = useRouter()
const message = useMessage()

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]);// 列表的数据
const cur = ref('')

class SearchItem {
  userIds: string[] = [];
  userId: string = '';
  departId: string = '';
  ryzt: string = '2';
  zczt: string = '';
  fssj: string = '';
  page: number = 1;
  size: number = 10;
}

const queryParams = ref({ ...new SearchItem() })
const { openDialog, closeAll } = useDialog()
const departId = ref<any>('') // 部门id

const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单
const tableRef = ref() // 列表的ref
const ids = ref<any[]>([]); // 选中的id
const selects = ref<any[]>([]); // 选中的行
const confirmLoading = ref(false) // 确认按钮的loading
const assetsStatistics = ref({})
const boxArr = ref([{
  type: 'kxzcs',
  title: '空闲中资产',
  width: '1480px',
},
{
  type: 'syzzcs',
  title: '使用中资产',
  width: '1480px',
},
{
  type: 'yjyzcs',
  title: '已借用资产',
  width: '1480px',
},
{
  type: 'dghzcs',
  title: '待归还资产',
  width: '1480px',
},
{
  type: 'zgzcs',
  title: '自购设备',
  width: '1480px',
},
{
  type: 'zlzcs',
  title: '租赁设备',
  width: '1480px',
}])
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

// 部门搜索
const handleSearch = (value) => {
  queryParams.value.page = 1
  if (value && Array.isArray(value) && value.length > 0) {
    let id = value[value.length - 1]
    const ids = [] as any[]
    searchDepartId(menuList.value, ids, id)
    console.log(ids)
    queryParams.value.departId = ids.join(',')
    departId.value = value[value.length - 1]
  } else {
    queryParams.value.departId = ''
    departId.value = ''
  }
  getList()
}

const searchDepartId = (attr: any[], ids: any[] = [], id: any) => {
  attr.map(item => {
    if (id === item.id) {
      ids.push(item.id)
      getAllChildrenDepartId(item, ids)
    } else if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      searchDepartId(item.children, ids, id)
    }
  })
}

const getAllChildrenDepartId = (value: any, ids: any[] = []) => {
  if (value.children && Array.isArray(value.children) && value.children.length > 0) {
    value.children.map(item => {
      ids.push(item.id)
      getAllChildrenDepartId(item, ids)
    })
  }
}


/** 重置按钮操作 */
const resetQuery = () => {
  // queryFormRef?.value?.resetDate()
  queryParams.value = { ...new SearchItem() }
  tableRef.value?.clearSelection()
  ids.value = []
  selects.value = []
  departId.value = ''
  // handleQuery()
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const res = await getAssetPage(queryParams.value)
    list.value = res && res.records && Array.isArray(res.records) ? res.records : []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}


const handleDetail = (row: any) => {
  router.push({
    name: 'AssetStatisticsDetailList',
    query: {
      userId: row.userId,
    }
  })
}
//资产确认
const handleConfirm = async () => {
  if (ids.value.length === 0) return
  try {
    const names = selects.value.map((item: any) => item.name).join('，')
    const nums = selects.value.map((item: any) => item.num)
    let allNums = 0
    for (let i = 0; i < nums.length; i++) {
      allNums += nums[i] || 0
    }
    // 二次确认
    await message.confirm(`是否确定将员工 [ ${names} ] 合计 [ ${allNums} ] 件资产全部确认？`)
    confirmLoading.value = true
    // 发起
    await addAssetConfirms({ userIds: ids.value.join(',') })
    message.success('资产确认成功！')
    tableRef.value?.clearSelection()
    ids.value = []
    selects.value = []
    // 刷新列表
    await getList()
  } catch { } finally {
    confirmLoading.value = false
  }
}

onMounted(() => {
  handleQuery()
  initMenu()
  initAssetsStatistics()
})

const initAssetsStatistics = async () => {
  try {
    const res = await getAssetStatistics({})
    const { kxzcs, syzzcs, yjyzcs, dghzcs, zgzcs, zlzcs } = res
    assetsStatistics.value = { kxzcs, syzzcs, yjyzcs, dghzcs, zgzcs, zlzcs }
  } catch (e) { }
}

const handleSelectionChange = (selction: any[]) => {
  ids.value = selction.map((item: any) => item.userId)
  selects.value = cloneDeep(selction)
}

const confirmRecordDrawerRef = ref()
const openHistory = (row: any) => {
  confirmRecordDrawerRef.value?.open(row)
}
//
const selectableHandle = (row: any) => row.zczt !== 1

const menuList = ref<any[]>([])

const initMenu = async () => {
  try {
    const data = await getAllDeptTree()
    menuList.value = data
  } catch (error) { }
}

const searchSchema: Array<FormSchema> = [
  {
    field: 'userIds',
    label: '人员',
    customRender: (_item, _model) => <UserSelect placeholder='请选择' v-model={queryParams.value.userIds}
      onChange={(val: any) => userChange(val, 'userId')} />
  },
  {
    field: 'departId',
    label: '所属部门',
    customRender: (_item, _model) => <Menuitem v-model={queryParams.value.departId} onChange={(val: any) => handleSearch(val)} />
  },
  {
    field: 'ryzt',
    label: '人员状态',
    component: 'Select',
    value: '2',
    componentProps: {
      placeholder: '请选择',
      options: getIntDictOptions(DICT_TYPE.FEISHU_STATUS, true),
      collapseTags: false,
      collapseTagsTooltip: false,
      multiple: false,
      clearable: true,
      filterable: true,
      onChange: (val: any) => valueChange(val, 'ryzt')
    }
  },
  {
    field: 'zczt',
    label: '资产状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: getIntDictOptions(DICT_TYPE.ZCTJ_QRZT, true),
      collapseTags: false,
      collapseTagsTooltip: false,
      multiple: false,
      clearable: true,
      filterable: true,
      onChange: (val: any) => valueChange(val, 'zczt')
    }
  },
  {
    field: 'fssj',
    label: '发送时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'fssj'),
    }
  },
];

const timeChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value });
  obj[`${name}ks`] = val?.length ? val[0] : null;
  obj[`${name}js`] = val?.length ? val[1] : null;
  queryParams.value = { ...obj };
  handleQuery();
};

const valueChange = (val: any, name: string) => {
  if (queryParams.value[name] !== val) {
    queryParams.value[name] = val;
    handleQuery();
  }
};

const userChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value });
  obj[name] = val?.length ? val.join(',') : '';
  queryParams.value = { ...obj };
  handleQuery();
};

const getBoxDetail = (item) => {
  cur.value = item.type
  openDialog({
    title: item.title,
    width: item.width,
    content: defineAsyncComponent(() => import('./components/invDialog.vue')),
    props: { type: item.type },
    showConfirmFooter: false,
    appendToBody: false,
    footer: false,
    onClose: () => {
      cur.value = ''
    }
  })
}

provide('assets_statistics_handle', {
  closeAll
})

// 5s钟刷新一次
let timer = setInterval(() => {
  initAssetsStatistics()
}, 5000)

onBeforeUnmount(() => {
  clearInterval(timer)
})



</script>
<style lang="scss" scoped>
:deep(.el-divider--horizontal) {
  margin: 20px 0;
}

.status-icon {
  width: 8px;
  height: 8px;
  border-radius: 10px;
  margin-right: 10px;

  &-1 {
    background-color: #0064FF;
  }

  &-2 {
    background-color: #349B34;
  }

  &-3 {
    background-color: #EB3737;
  }

  &-4 {
    background-color: #DB6A0F;
  }

  &-5 {
    background-color: #999999;
  }
}

.pagination {
  margin-top: 10px;
  text-align: right;
  width: 100%;
  height: 35px;
  position: relative;
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

:deep(.commonTableRow1) {
  height: 64px;
  border-radius: 4px;
}

.box_content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .box {
    flex: 1;
    height: 100px;
    border-radius: 8px;
    padding: 16px;
    gap: 12px;
    background: #F8F8F9;
    box-sizing: border-box;
    border: 1px solid #E5E5E5;
    margin-right: 16px;
    cursor: pointer;

    &.actived {
      background-color: #EBF3FE;
    }

    &:hover {
      background-color: #EBF3FE;
    }

    // &:hover {
    //   background-color: #EBF3FE;
    // }

    &:last-child {
      margin: 0;
    }

    .box_title {
      position: static;
      left: 16px;
      top: 16px;
      width: 70px;
      height: 20px;
      font-size: 14px;
      color: #666666;
    }

    .box_value {
      margin-top: 12px;
      /* 自动布局子元素 */
      width: 44px;
      height: 36px;
      font-size: 24px;
      font-weight: 500;
      line-height: 150%;
      font-variation-settings: "opsz" auto;
      /* 文字/一级 */
      color: #333333;
    }
  }
}
</style>