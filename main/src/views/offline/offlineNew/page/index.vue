<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="OfflineNew" :show-expand="false" />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="OfflineNew"
      :column="column"
      :table-data="dataList"
      :list-name="'新品流程列表'"
    />
    <offline-new-details ref="detailsRef" />

    <sample-confirm ref="sampleComfirmRef"></sample-confirm>

    <price-quote ref="priceQuoteRef"></price-quote>

    <pattern-confirm ref="patternConfirmRef"></pattern-confirm>

    <color-sample-confirm ref="colorSampleConfirmRef"></color-sample-confirm>
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'OfflineNew' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import OfflineNewDetails from '../details/index.vue'
import { useRole } from '@/hooks/common/useRole'
import { getIntDictOptions } from '@/utils/dict'
import { usePage, SearchItem } from './config'
import request from '@/config/axios'
import { useDialog } from '@/hooks/web/useDialog'
import { formatTime } from '@/utils'
// import patternAssign from '../components/patternAssign.vue'
// const patternAssign = defineAsyncComponent(() => import(''))
import personAssign from '../components/personAssign.vue'
// const patternConfirm = defineAsyncComponent(() => import(''))
import patternConfirm from '../components/patternConfirm.vue'
import sampleConfirm from '../components/sampleConfirm.vue'
import sampleAudit from '../components/sampleAudit.vue'
import commonConfirm from '../components/commonConfirm.vue'
import techPackage from '../components/techPackage.vue'
import priceQuote from '../components/priceQuote.vue'
import terminate from '../components/terminate.vue'
import handover from '../components/handover.vue'
import colorSampleConfirm from '../components/colorSampleConfirm.vue'
const { getPermissionInfo, getRole, grabCheck } = useRole('线下新品')
provide('roles', { getRole })
const { openDialog } = useDialog()

const router = useRouter()

const detailsRef = ref<any>(),
  priceQuoteRef = ref(),
  patternConfirmRef = ref(),
  colorSampleConfirmRef = ref()

const hasTemPerm = computed(
  () => grabCheck('线下-新品离职交接操作人员') || grabCheck('线下-新品流程管理员')
)
const hasAddPerm = computed(
  () => grabCheck('线下-新品建档权限') || grabCheck('线下-新品流程管理员')
)
const userInfo = ref<any>({})

const allNodeList = ref([])
const getNodeList = async () => {
  const res = await request.get({ url: '/api/offline/np/base/node/list', params: {} })
  allNodeList.value = res.length
    ? res.map((item: any) => {
        return {
          label: item?.nodeName,
          value: item?.nodeCode
        }
      })
    : []
}

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
} = usePage({ userInfo: toRef(userInfo, 'value'), hasTemPerm, hasAddPerm, allNodeList })

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage
    ? { ...searchData.value }
    : { ...searchData.value, page: page.value.page, pageSize: page.value.size }
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  loading.value = true
  request
    .get({ url: `/api/offline/np/base/pageQuery`, params })
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

// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  if (['handover'].includes(btn.fun)) {
    openDialog({
      title: '离职交接',
      width: '600px',
      content: handover,
      props: {},
      confirmText: '确定',
      cancelText: '取消',
      alignCenter: true,
      footerStyle: { borderTop: 'solid 1px #f0f0f0' },
      onSuccess: () => {
        onSearch()
      }
    })
    return
  }
  // ['board'].includes(btn.fun) && boardRef?.value?.openView();
  // ['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun);
}

const personMap = {
  patternAssign: '版师分配',
  sampleWorkerAssign: '样工分配',
  merchandiserAssign: '跟单分配',
  colorSampleConfirm: '齐色样确认',
  preProductionConfirm: '产前样确认',
  firstEightConfirm: '首八件确认'
}

const btnLoading = ref(false),
  sampleComfirmRef = ref()
// 操作列回调
const viewDetails = async (type: string, item?: any, btn?: any) => {
  const baseInfoId = item?.baseInfoId
  const currentNodeCode = item?.currentNodeCode
  // 版师分配,样工分配,跟单分配
  if (type === 'patternAssign' || type === 'sampleWorkerAssign' || type === 'merchandiserAssign') {
    const props = { baseInfoId, currentNodeCode, type }
    if (type === 'sampleWorkerAssign') {
      if (btnLoading.value) return
      btnLoading.value = true
      try {
        const res = await request.get({
          url: `/api/offline/np/process/getSampleWorkerAssignInfo/${baseInfoId}`,
          params: {}
        })
        if (res) {
          Object.assign(props, {
            sampleWorkers: res?.sampleWorkerList || [],
            sampleWorkerRemark: res?.remark || ''
          })
        }
      } finally {
        btnLoading.value = false
      }
    }
    openDialog({
      title: personMap[type],
      width: '600px',
      content: personAssign,
      props,
      confirmText: '确定',
      cancelText: '取消',
      alignCenter: true,
      footerStyle: { borderTop: 'solid 1px #f0f0f0' },
      onSuccess: () => {
        // message.success('批量拒绝成功')
        // clearTableSelection()
        // refreshTable()
        onSearch()
      }
    })
    return
  }

  // 打版确认
  if (type === 'patternConfirm') {
    patternConfirmRef.value.openView(item, 'add')
    // if (btnLoading.value) return
    // btnLoading.value = true
    // try {
    //   const res = await request.get({
    //     url: `/api/offline/np/process/getPatternConfirmInfo/${baseInfoId}`,
    //     params: {}
    //   })

    //   if (res) {
    //     openDialog({
    //       title: '打版确认',
    //       width: '600px',
    //       content: patternConfirm,
    //       props: {
    //         baseInfoId,
    //         currentNodeCode,
    //         patternMaker: res?.patternMakerList || [],
    //         assignTime: res?.assignTime ? formatTime(res.assignTime, 'yyyy-MM-dd HH:mm:ss') : '-',
    //         remark: res?.remark || '-'
    //       },
    //       confirmText: '确定',
    //       cancelText: '取消',
    //       alignCenter: true,
    //       footerStyle: { borderTop: 'solid 1px #f0f0f0' },
    //       onSuccess: () => {
    //         // message.success('批量拒绝成功')
    //         // clearTableSelection()
    //         // refreshTable()
    //         onSearch()
    //       }
    //     })
    //   }
    // } finally {
    //   btnLoading.value = false
    // }
    return
  }

  //样衣确认
  if (type === 'sampleConfirm') {
    sampleComfirmRef?.value.openView(item, type)
    return
  }

  // 样衣审核
  if (type === 'sampleAudit') {
    openDialog({
      title: '样衣审核',
      width: '600px',
      content: sampleAudit,
      props: {
        baseInfoId,
        currentNodeCode
      },
      confirmText: '确定',
      cancelText: '取消',
      alignCenter: true,
      footerStyle: { borderTop: 'solid 1px #f0f0f0' },
      onSuccess: () => {
        // message.success('批量拒绝成功')
        // clearTableSelection()
        // refreshTable()
        onSearch()
      }
    })
    return
  }

  // 齐色样确认
  if (type === 'colorSampleConfirm') {
    colorSampleConfirmRef.value.openView(item, 'add')
    return
  }

  // 产前样确认,首八件确认
  if (type === 'preProductionConfirm' || type === 'firstEightConfirm') {
    openDialog({
      title: personMap[type],
      width: '600px',
      content: commonConfirm,
      props: {
        baseInfoId,
        currentNodeCode,
        type
      },
      confirmText: '确定',
      cancelText: '取消',
      alignCenter: true,
      footerStyle: { borderTop: 'solid 1px #f0f0f0' },
      onSuccess: () => {
        // message.success('批量拒绝成功')
        // clearTableSelection()
        // refreshTable()
        onSearch()
      }
    })
    return
  }

  // 工艺包上传
  if (type === 'techPackage') {
    if (btnLoading.value) return
    btnLoading.value = true
    try {
      const res = await request.get({
        url: `/api/offline/np/process/getTechPackageInfo/${baseInfoId}`,
        params: {}
      })
      if (res) {
        console.log(res)
        openDialog({
          title: '工艺包上传',
          width: '600px',
          content: techPackage,
          props: {
            baseInfoId,
            currentNodeCode,
            paperRemark: res?.paperRemark || '',
            paperAttachmentUrl: res?.paperAttachmentUrl || '',
            technicalAttachmentUrl: res?.technicalAttachmentUrl || '',
            technicalRemark: res?.technicalRemark || '',
            displayPaper: res?.displayPaper || false,
            displayTechnical: res?.displayTechnical || false
          },
          confirmText: '确定',
          cancelText: '取消',
          alignCenter: true,
          footerStyle: { borderTop: 'solid 1px #f0f0f0' },
          onSuccess: () => {
            // message.success('批量拒绝成功')
            // clearTableSelection()
            // refreshTable()
            onSearch()
          }
        })
      }
    } finally {
      btnLoading.value = false
    }
    return
  }

  // 报价核价
  if (type === 'priceQuote') {
    priceQuoteRef?.value.openView(item, type)
    return
  }

  // 资料信息
  if (type === 'info') {
    router.push({
      path: '/admin/offline/new/detail/' + baseInfoId
    })
    return
  }

  // 提前结束
  if (type === 'terminate') {
    openDialog({
      title: '流程结束',
      width: '600px',
      content: terminate,
      props: {
        baseInfoId
      },
      confirmText: '确定',
      cancelText: '取消',
      alignCenter: true,
      footerStyle: { borderTop: 'solid 1px #f0f0f0' },
      onSuccess: () => {
        onSearch()
      }
    })
    return
  }

  detailsRef?.value?.openView(item, type)
}

onMounted(async () => {
  getPermissionInfo(() => {
    dataList.value = []
    getNodeList()
    onSearch()
  })
})

// 提前终止弹窗
const customTrigger = async (scope: any, col: any) => {
  const { baseInfoId } = scope
  const res = await request.get({
    url: `/api/offline/np/base/terminate/detail/${baseInfoId}`,
    params: {}
  })
  console.log(res)
  if (res) {
    const info: any = { ...res }
    info['terminatedUserList'] = [res.terminatedUser]
    openDialog({
      title: '流程结束',
      width: '600px',
      content: terminate,
      props: {
        baseInfoId,
        type: 'view',
        info
      },
      showConfirmFooter: false,
      // confirmText: '确定',
      // cancelText: '取消',
      alignCenter: true,
      footerStyle: { borderTop: 'solid 1px #f0f0f0' }
      // onSuccess: () => {
      //   onSearch()
      // }
    })
  }
}

setRouterInfo()

provide('OfflineNewForm', {
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
  viewDetails,
  customTrigger
})
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
