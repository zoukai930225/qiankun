<template>
  <ContentWrap>
    <div class="flex">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="填报日期" prop="createdTimeBegin">
          <el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
            value-format="YYYY-MM-DD" format="YYYY-MM-DD" style="width: 240px;" v-model="dateRange" @change="getList" />
        </el-form-item>
        <el-form-item label="填报人" prop="createdId">
          <SelectUser v-model="queryParams.createdId" :multiple="true" @change="getList" :showAvatarLable="true"
            style="width: 240px;" :role="getRole('QC权限')" />
        </el-form-item>
      </el-form>
      <el-button @click="resetQuery" class="commonResetBtn ml-auto"> 重置 </el-button>
    </div>
    <div class="listWrapper">
      <div class="listTitle">
        {{ ' 日报管理列表' }}
        <div class="btns">
          <component :is="easyBtnGroup(btns)" />
        </div>
      </div>
      <div class="list">
        <el-table class="SWCommonTable" :data="list" width="100%" v-horizontal-scroll="'always'"
          row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" v-loading="loading">
          <el-table-column label="填报日期" prop="submissionDate"></el-table-column>
          <el-table-column label="填报人" prop="createName">
            <template #default="{ row }">
              <lineAvatar :user="{ name: row.createName, avatarOrigin: row.createAvatarOrigin }" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createdAt"></el-table-column>
          <el-table-column label="最后修改时间" prop="updatedAt"></el-table-column>
          <el-table-column label="操作" fixed="right" :width="160">
            <template #default="{ row, $index }">
              <div class="fixedBtn">
                <s-w-table-btns :options="btnsOptions[$index] || []" :row="row" />
              </div>
            </template>
          </el-table-column>
          <template #empty>
            <div class="flex-column" style="align-items: center;">
              <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
              <span>暂无数据</span>
            </div>
          </template>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.size" v-model:page="queryParams.page" :total="total" @pagination="getList" />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { debounce } from "lodash-es";
import lineAvatar from '@/components/template/table/components/lineAvatar.vue';
import download from '@/utils/download'
import { queryQCDailyReportInfo, deleteQCDailyReportInfoById, exportData } from '@/api/supplier/qcManagement/qcDailyReport'
import { useRouteInfo } from "@/hooks/common/useRouteInfo";
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore()
import { useRole } from "@/hooks/common/useRole";
const { getPermissionInfo, getRole, grabCheck } = useRole('供应链');
const hasQCPermission = computed(() => grabCheck('QC权限'))
import { useUserStore } from '@/store/modules/user';
import { easyBtnGroup } from "../../components/twoFourSix";
import Icon from '@/components/Icon/src/Icon.vue'
import { AuditBtn } from "../../changeAudit/option";

const userStore = useUserStore();
const currentUserId = computed(() => userStore.user?.userNo) // 当前登录人 userId
// 判断编辑删除权限
const canEdit = (row: any) => { return row.createdId === currentUserId.value && hasQCPermission.value }
const message = useMessage()
const router = useRouter(), route = useRoute();
const { getRouteInfo } = useRouteInfo();

const openDailyReport = (type: string, row?: any) => {
  const id = row?.id || undefined
  router.push({ path: getRouteInfo('qcDailyReportEdit'), query: { id, type } })
}
const handleDel = async (row: any) => {
  await message.confirm('是否确认删除？')
  deleteQCDailyReportInfoById({ id: row.id }).then((res: any) => {
    console.log(res)
    message.success('删除成功')
    getList()
  }).catch(() => { })
}
const queryFormRef = ref()
const queryParams = ref<any>({
  createdId: '',
  createdTimeBegin: '',
  createdTimeEnd: '',
  page: 1,
  size: 10
})
const dateRange = ref<any>([])
const handleParams = () => {
  const params = { ...queryParams.value }
  params.createdId = params.createdId.length ? params.createdId.join(',') : ''
  if (dateRange.value?.length) {
    params.createdTimeBegin = dateRange.value[0]
    params.createdTimeEnd = dateRange.value[1]
  } else {
    params.createdTimeBegin = ''
    params.createdTimeEnd = ''
  }
  return params
}
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  dateRange.value = []
  getList()
}
const list = ref<any>([])
const total = ref(0)
const loading = ref(false)
const getList = async () => {
  loading.value = true
  const params = handleParams()
  queryQCDailyReportInfo(params).then((res: any) => {
    list.value = res.records || []
    total.value = res.total
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

// 操作按钮
const btns = computed(() => [
  {
    label: '数据看板',
    type: 'primary',
    permission: 'qcDailyReport:Dashboard',
    onClick: linkTo,
  },
  {
    label: '新增',
    type: 'primary',
    icon: <Icon icon="ep:plus" />,
    permission: 'qcDailyReport:Add',
    onClick: () => openDailyReport('add'),
  },
  {
    label: '导出',
    type: 'primary',
    icon: <Icon icon="ep:download" />,
    permission: 'qcDailyReport:Export',
    onClick: exportDailyReport,
  },
])

enum BTNS_KEY {
  /** 查看 */ CHECK,
  /** 修改 */ EDIT,
  /** 删除 */ DELETE
}

const BTNS_CONFIG: Record<
  BTNS_KEY,
  [string, (...arg: any[]) => any, Record<string, any> | undefined]
> = {
  [BTNS_KEY.CHECK]: ['查看', (row) => openDailyReport('view', row), { permission: 'qcDailyReport:Check' }],
  [BTNS_KEY.EDIT]: ['修改', (row) => openDailyReport('edit', row), { permission: 'qcDailyReport:Edit' }],
  [BTNS_KEY.DELETE]: ['删除', handleDel, { permission: 'qcDailyReport:Delete', type: 'danger' }],
}

// 表内操作列配置
const btnsOptions = computed(() =>
  list.value.map((row) => {
    const btnsKeys = new Set([BTNS_KEY.CHECK])
    if (canEdit(row)) btnsKeys.add(BTNS_KEY.DELETE).add(BTNS_KEY.EDIT)
    const rowBtns = Array.from(btnsKeys).sort((a, b) => a - b).map(ele => new AuditBtn(...BTNS_CONFIG[ele]))
    return rowBtns
  })
)

// 导出
const exportDailyReport = debounce(() => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '数据导出中...'
  })
  const params = handleParams()
  delete params.page
  delete params.size
  exportData(params).then((data: any) => {
    if (data) {
      download.excel(data, 'QC日报管理列表.xlsx')
    }
    loadingInstance.close()
  }).catch(() => {
    loadingInstance.close()
  })
})

const setRouterInfo = () => {
  dateRange.value = route.query.dateRange;
  const newUrl = window.location.href.replace(/\?.*$/, '');
  history.replaceState({}, '', newUrl);
};

const linkTo = () => {
  router.push({ name: 'QcBoard' });
};

// 初始化
onMounted(() => {
  getPermissionInfo(() => {
    getList()
  })
});

setRouterInfo();
</script>

<style lang="scss" scoped>
:deep(.el-form-item__content) {
  width: 240px;
}

.listWrapper {
  width: calc(100%);
  background: #ffffff;
  padding: 16px 0 30px 0;
  border-top: 1px solid #e6e6e6;

  .listTitle {
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;

    .btns {
      margin-left: auto;
    }
  }

  .list {
    margin-top: 10px;
  }
}
</style>
