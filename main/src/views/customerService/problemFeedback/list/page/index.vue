<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="List" :show-expand="true" />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="List"
      :column="column"
      :table-data="dataList"
      :list-name="'客服问题反馈列表'"
      :isSelection="hasChangePer"
      ref="tableRef"
    />
    <list-details ref="detailsRef" />
    <DashboardDrawer ref="boardRef" />

    <!-- 修改对接人 -->
    <el-dialog v-model="dialogVisible" title="修改对接人" width="500">
      <el-form>
        <el-form-item label="修改对接人">
          <SelectUser
            v-model="updateDirectorForm.updateUserId"
            :multiple="false"
            :showAvatarLable="true"
            :role="getRole('客服处理人')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="changeDirector"
            :disabled="submitLoading"
            :loading="submitLoading"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'List' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import ListDetails from '../details/index.vue'
import DashboardDrawer from '../../components/dashboardDrawer.vue'
import { useRole } from '@/hooks/common/useRole'
// import { getIntDictOptions } from '@/utils/dict';
import { usePage, SearchItem } from './config'
import * as problemFeedbackApi from '@/api/customerService/problemFeedback'
import { getList } from '@/api/customerService/problemFeedback'
import { useUserStore } from '@/store/modules/user'
import SelectUser from '@/components/common/user/selectUser.vue'
import request from '@/config/axios'
import { hasPermissionsJs } from '@/utils/index'
const hasChangePer = computed(() => hasPermissionsJs(['problemFeedback:updateDirector']))
const userStore = useUserStore()
const router = useRouter()
const message = useMessage()
const detailsRef = ref<any>(),
  tableRef = ref(),
  plateRef = ref(),
  boardRef = ref()

const userInfo = computed(() => userStore.user)

const { getPermissionInfo, grabCheck, getRole } = useRole('客服')
provide('getRole', { getRole, grabCheck })

const {
  dataList,
  page,
  loading,
  scheme,
  btns,
  searchData,
  column,
  screen,
  stateInfo,
  statistics,
  handleColumn,
  setRouterInfo
} = usePage({
  userInfo: toRef(userInfo, 'value'),
  getRole: getRole,
  grabCheck: grabCheck,
  hasChangePer: toRef(hasChangePer, 'value')
})

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  const params = { ...searchData.value }
  if (params.feedbackDate?.length) {
    params.feedbackDateStart = params.feedbackDate[0]
    params.feedbackDateEnd = params.feedbackDate[1]
  } else {
    params.feedbackDateStart = ''
    params.feedbackDateEnd = ''
  }
  params.category = params.categoryList?.length ? params.categoryList.join(',') : ''
  params.type = params.typeList?.length ? params.typeList.join(',') : ''
  params.handleDept = params.handleDeptList?.length ? params.handleDeptList.join(',') : ''
  params.finishStatus = params.finishStatusList?.length ? params.finishStatusList.join(',') : ''
  params.status = params.statusList?.length ? params.statusList.join(',') : ''
  delete params.categoryList
  delete params.feedbackDate
  delete params.typeList
  delete params.handleDeptList
  delete params.finishStatusList
  delete params.statusList
  return noPage ? params : { ...params, page: page.value.page, size: page.value.size }
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  loading.value = true
  getList(params)
    .then((res: any) => {
      dataList.value = res.records?.length ? [...res.records] : []
      page.value = { ...page.value, total: res.total }
    })
    .finally(() => {
      getStateInfo()
      loading.value = false
    })
}

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  onSearch()
}

// 状态筛选查询（无状态筛选可删除）
const getStateInfo = () => {
  // const params: any = setParamsData();
  // request.post({ url: `/api/employeeMonthlyAssessment/statistics`, data: params }).then((res: any) => {
  //   res && (stateInfo.value = { ...res });
  // });
}

// 修改对接人
const dialogVisible = ref(false)
const updateDirectorForm = ref({
  idList: [],
  updateUserId: ''
})
const submitLoading = ref(false)
const changeDirector = () => {
  if (!updateDirectorForm.value.updateUserId) return message.warning('请选择问题对接负责人')
  submitLoading.value = true
  request
    .post({ url: `/api/csProblemFeedback/batchUpdateHandleUser`, data: updateDirectorForm.value })
    .then((res: any) => {
      res && message.success('修改成功')
      submitLoading.value = false
      dialogVisible.value = false
      onSearch()
    })
    .catch(() => {
      submitLoading.value = false
    })
}

// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  ;['board'].includes(btn.fun) && boardRef?.value?.open()
  ;['sumBoard'].includes(btn.fun) && router.push({ name: 'CustomerComplaintSummaryDashboard' })
  if (btn.fun === 'changeDirector') {
    updateDirectorForm.value.updateUserId = ''
    if (selectRows.value?.length) {
      dialogVisible.value = true
      updateDirectorForm.value.idList = selectRows.value.map((el: any) => el.id)
    } else {
      message.alertWarning('请选择数据进行修改')
    }
  }
}

const selectRows = computed(() => tableRef?.value?.selectRows || [])
// 操作列回调
const viewDetails = async (type: string, item?: any, btn?: any) => {
  if (type === 'delete') {
    await message.confirm('请确认是否删除')
    await problemFeedbackApi.deleteById({ id: item.id })
    message.success('删除成功')
    onSearch()
  } else {
    detailsRef?.value?.openView(item, type)
  }
}

onMounted(() => {
  getPermissionInfo(() => {
    dataList.value = []
    onSearch()
  })
})

setRouterInfo()

provide('ListForm', {
  searchData,
  dataList,
  page,
  loading,
  stateInfo,
  statistics,
  setParamsData,
  resetForm,
  onSearch,
  onButtonClick,
  viewDetails
})
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
