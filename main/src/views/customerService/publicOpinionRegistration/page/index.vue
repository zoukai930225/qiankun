<template>
  <ex-screen class="public-opinion-registration-page">
    <query-scheme
      :scheme="scheme"
      v-model="searchData"
      name="PublicOpinionRegistration"
      :show-expand="true"
    />
    <scheme-table
      :btn-list="btns"
      :handle-column="handleColumn"
      :screen="screen"
      name="PublicOpinionRegistration"
      :column="column"
      :table-data="dataList"
      :list-name="'舆情问题登记'"
    />
    <publicOpinionRegistration-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'PublicOpinionRegistration' }
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type'
import PublicOpinionRegistrationDetails from '../details/index.vue'
import { usePage, SearchItem } from './config'
import request from '@/config/axios'
import { useRole } from '@/hooks/common/useRole'
import { useUserStore } from '@/store/modules/user'
import { cloneDeep } from 'lodash-es'
import router from '@/router'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
const { getRouteInfo } = useRouteInfo()
const { roleList, getPermissionInfo, grabCheck } = useRole('客服')
const detailsRef = ref<any>()
const message = useMessage()
const userAuth = ref<Record<string, boolean>>({
  isAdd: false,
  isBoard: false,
  isEdit: false,
  isKsProcess: false,
  isGgProcess: false,
  isDelete: false
})

// 质检人员选项（TODO: 需要从接口获取）
const qualityInspectorOptions = ref<any[]>([])

// 舆情类型树（TODO: 需要从接口获取）
const opinionTypeTree = ref<any[]>([])
const dictDataList = ref<Record<string, any[]>>({})
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
  qualityInspectorOptions,
  opinionTypeTree,
  roleList,
  dictDataList,
  userAuth: toRef(userAuth, 'value')
})

// 处理请求数据
const setParamsData = () => {
  const params: any = cloneDeep({
    ...searchData.value,
    page: page.value.page,
    size: page.value.size,
    registerDateStart: searchData.value.registrationDate?.[0],
    registerDateEnd: searchData.value.registrationDate?.[1],
    publishDateStart: searchData.value.publishDate?.[0],
    publishDateEnd: searchData.value.publishDate?.[1],
    registrant: searchData.value.registrantIds?.join(','),
    publishPlatform: searchData.value.publishPlatforms?.join(','),
    status: searchData.value.status?.join(','),
    disposalResult: searchData.value.disposalResult?.join(','),
    productCategory: searchData.value.productCategory?.join(','),
    productCode: searchData.value.productCode?.join(','),
    opinionType: searchData.value.opinionType.filter((item: any) => item.length === 1).join(','),
    secondaryCategory: searchData.value.opinionType
      .filter((item: any) => item.length === 2)
      .map((item: any) => item[1])
      .join(',')
  })
  delete params.registrantIds
  delete params.publishPlatforms
  delete params.opinionType
  delete params.publishDate
  delete params.registrationDate
  return params
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  console.log(params, 'params')
  loading.value = true
  request
    .get({ url: `/api/publicOpinionInfo/list`, params: params })
    .then((res: any) => {
      dataList.value = res.records?.length ? res.records : []
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

// 状态筛选查询（获取状态统计信息）
const getStateInfo = () => {
  const params: any = setParamsData()
  delete params.status
  request.get({ url: `/api/publicOpinionInfo/listStatistics`, params: params }).then((res: any) => {
    res && (stateInfo.value = { ...res })
  })
}

// 按钮回调
const onButtonClick = (_btn: BtnItem) => {
  // 处理其他自定义按钮（如数据看板等）
  if (_btn.fun === 'board') {
    router.push({ path: getRouteInfo('publicSentimentDataBoard') })
  }
}

// 操作列回调
const viewDetails = async (type: string, item?: any) => {
  const user: any = useUserStore().user || {}
  if (type === 'delete') {
    await message.confirm('是否确认删除此数据?')
    request.delete({ url: '/api/publicOpinionInfo/delete/' + item.id }).then(() => {
      message.success('删除成功')
      onSearch()
    })
  } else if (type === 'receive') {
    // 领取操作
    await message.confirm('确认领取此问题?')
    const msg = JSON.parse(item.followUpCustomers).find(
      (f_item: any) => f_item.userId === user.userNo
    )
    request
      .post({
        url: '/api/publicOpinionInfo/receivePublicOpinionInfo',
        data: {
          id: item.id,
          followUpCustomerId: msg.userId,
          followUpCustomerName: msg.realName,
          followUpCustomerAvatar: msg.avatarOrigin
        }
      })
      .then(() => {
        message.success('领取成功')
        onSearch()
      })
  } else if (type === 'serviceHandle') {
    // 客服处理操作 - 打开抽屉进行客服处理
    detailsRef?.value?.openView(item, 'service')
  } else if (type === 'prHandle') {
    // 公关处理操作 - 打开抽屉进行公关处理
    detailsRef?.value?.openView(item, 'pr')
  } else {
    // view 或 edit
    detailsRef?.value?.openView(item, type)
  }
}
const getDictDataList = async () => {
  const allCode = [
    'pi_publishing_platform',
    'pi_publishing_type',
    'pi_product_type',
    'pi_disposal_result',
    'pi_status',
    'pi_risk_level'
  ]
  const allRequest = allCode.map((code) =>
    request.get({ url: `/api/dict/list?page=1&size=99&name=&type=2&pCode=${code}&company=` })
  )
  const allRes = await Promise.all(allRequest)
  allRes.forEach((item, index) => {
    dictDataList.value[allCode[index]] = item.data.map((_i: any) => ({
      label: _i.name,
      value: _i.code
    }))
  })
}

onMounted(async () => {
  await getPermissionInfo().then(() => {
    userAuth.value = {
      isAdd: grabCheck('质检人员'),
      isBoard: grabCheck('质检人员') || grabCheck('客诉请求') || grabCheck('舆情公关'),
      isEdit: grabCheck('质检人员'),
      isKsProcess: grabCheck('客诉请求'),
      isGgProcess: grabCheck('舆情公关'),
      isDelete: grabCheck('质检人员')
    }
  })
  // 获取下拉选项数据
  await getDictDataList()
  // 正式接口调用（暂时注释）
  onSearch()
})

setRouterInfo()

provide('PublicOpinionRegistrationForm', {
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
  dictDataList,
  roleList: toRef(roleList, 'value')
})
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
