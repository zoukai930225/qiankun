import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import StoreTreeCascader from '@/components/StoreTreeCascader/src/StoreTreeCascader.vue'
import SWSelectPeople from '@/views/OA/new/plan/components/selectPeople.vue'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'
import ListPersonShow from '@/views/OA/new/develop/components/listPersonShow.vue'
import SearchTime from '@/components/common/time/search.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import dayjs from 'dayjs'
import LineTxt from '@/components/template/table/components/lineTxt.vue'
import LineChannel from '@/components/template/table/components/lineChannel.vue'
import LineTage from '@/components/template/table/components/lineTage.vue'
import DetailNumTable from '../components/detailNumTable.vue'
import AuditDetail from '../components/auditDetail.vue'
import { ElDatePicker, ElImage, ElPopover } from 'element-plus'
import { formatCustomDate } from '../utils'
import LineImage from '@/components/template/table/components/lineImage.vue'

// 查询结构
export class SearchItem {
  // khzq: string = dayjs().add(-1, 'month').format('YYYY-MM')
}

// 表格数据结构
export class DataItem {
  id: string = ''
  newProgress: string = ''
}

export const detaultPlaceholderMap = {
  0: '请输入',
  1: '请输入',
  2: '请选择',
  3: '请选择',
  4: '请选择',
  5: '请选择',
  6: '',
  8: '请选择人员'
}

const months = [
  { label: '1月', value: '1' },
  { label: '2月', value: '2' },
  { label: '3月', value: '3' },
  { label: '4月', value: '4' },
  { label: '5月', value: '5' },
  { label: '6月', value: '6' },
  { label: '7月', value: '7' },
  { label: '8月', value: '8' },
  { label: '9月', value: '9' },
  { label: '10月', value: '10' },
  { label: '11月', value: '11' },
  { label: '12月', value: '12' }
]

const handleJSONParse = (str) => {
  try {
    if (Array.isArray(str)) {
      return str
    }
    if (str !== '') {
      return JSON.parse(str)
    }
  } catch (error) {
    return []
  }
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const {
    userInfo,
    configList,
    getDicList,
    tableMinWidth,
    getBackgroundColor,
    getPlanColor,
    geTypeName,
    handlePlanProgress,
    permissions,
    changeTime,
    saveSelectPeople
  } = params

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({}),
    timeRef = ref()

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  //([{ field: 'name', label: '姓名' }])
  // 查询配置(必配)
  const scheme = computed(() => {
    const list: any[] = []
    configList.value.forEach((sl) => {
      if (sl.searchDisplay && sl.state === 1) {
        let label = sl.name
        if (label.length > 4) {
          label = [label.substring(0, 4), label.substring(4, label.length)]
        }
        let select = {}
        if ((sl.type === 2 && sl.code !== 'category') || (sl.type === 3 && sl.options)) {
          select = {
            component: 'Select',
            componentProps: {
              placeholder: sl.placeholder,
              options: sl.options,
              clearable: true
            }
          }
        }
        if ((sl.type === 2 && sl.code !== 'category') || (sl.type === 3 && sl.dictCode)) {
          select = {
            component: 'Select',
            componentProps: {
              placeholder: sl.placeholder,
              options: getDicList(sl.dictCode),
              clearable: true
            }
          }
        }
        // 选择年
        if (sl.code === 'year') {
          select = {
            component: 'DatePicker',
            componentProps: {
              type: 'year',
              placeholder: sl.placeholder,
              clearable: true
            }
          }
        }
        // 选择月
        if (sl.code === 'month') {
          select = {
            component: 'Select',
            options: months,
            componentProps: {
              placeholder: sl.placeholder,
              clearable: true
            }
          }
        }
        list.push({
          field: sl.type === 8 ? `${sl.code}List` : sl.code,
          label: label,
          componentProps: {
            placeholder: sl.placeholder || detaultPlaceholderMap[sl.type]
          },
          ...select,
          isCustom:
            sl.type === 9 ||
            sl.type === 8 ||
            (sl.type === 2 && sl.code === 'category') ||
            sl.code === 'planListDate',
          customRender: (_item: any) => {
            // if (sl.code === 'year') {
            //   return (
            //     <ElDatePicker
            //       // style="width: 200px"
            //       v-model={searchData.value[sl.code]}
            //       type="year"
            //       placeholder="请选择年度"
            //     />
            //   )
            // }
            if (sl.code === 'planListDate') {
              return (
                <SearchTime
                  v-model={searchData.value[sl.code]}
                  style="width: 200px"
                  placeholder={sl.placeholder || '请选择计划上架日期'}
                  layout="'日,周,月'"
                  onChange={(val) => changeTime(val, sl.code)}
                />
              )
            }
            if (sl.type === 2 && sl.code === 'category') {
              return <CategorySelect v-model={searchData.value[sl.code]} />
            }
            if (sl.type === 8) {
              return (
                <SWSelectPeople
                  isEdit={true}
                  multiple={false}
                  v-model:modelValue={searchData.value[`${sl.code}List`]}
                  type="operate"
                  placeholder="请选择人员"
                  deptCode="NEW_PRODUCT_QH_PERSONNEL"
                  style="width: 240px !important;"
                  onSelectPeopleChange={() => saveSelectPeople(searchData.value, sl.code)}
                />
              )
            }
            if (sl.type === 9) {
              return <StoreTreeCascader v-model={searchData.value[sl.code]}></StoreTreeCascader>
            }
          }
        })
      }
    })
    return list
  })

  // 状态筛选(非必配)
  const screen = computed(() => ({
    // ...new Screen({
    //   field: 'sftb',
    //   label: '填报状态:',
    //   options: [{ label: '已填报', value: 1 }, { label: '未填报', value: 0 }],
    //   props: {}
    // })
  }))

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => [
    {
      fun: 'add',
      txt: '新增',
      type: 'primary',
      display: () => !permissions.includes('oa:newPlan:add')
    },
    {
      fun: 'separatedEmployee',
      txt: '离职人员交接',
      type: 'primary',
      display: () => !permissions.includes('oa:newPlan:separatedEmployee')
    }
  ])

  // 表格配置(非必配)
  const column = computed(() => {
    const list: any[] = []
    configList.value.forEach((field) => {
      if (field.listDisplay && field.state === 1) {
        list.push({
          field: field.code,
          title: field.name,
          width: tableMinWidth(field),
          sort: field.supportSort,
          isCustom: true,
          customRender: (_item) => {
            if (['planType', 'productType', 'planProductType'].includes(field.code)) {
              return (
                <LineTage
                  txt={geTypeName(field.code, _item[field.code])}
                  background={getBackgroundColor(field.code, _item[field.code])}
                  color={getPlanColor(field.code, _item[field.code])}
                ></LineTage>
              )
            }
            if (['status', 'planTemplate', 'isCore'].includes(field.code)) {
              return <span>{geTypeName(field.code, _item[field.code])}</span>
            }
            switch (field.code) {
              case 'planName':
                return (
                  <LineTxt
                    name="Newplan"
                    info={{ scope: _item }}
                    txt={_item[field.code]}
                    isCopy={true}
                    isClick={true}
                    class="linkColor"
                    style="color: #0064ff;"
                  ></LineTxt>
                )
              case 'store':
                return (
                  <LineChannel
                    channel={_item?.channel}
                    storeName={_item?.storeName || _item[field.code]}
                  ></LineChannel>
                )
              case 'detailNum':
                // if (_item?.details?.length > 0) {
                return (
                  <ElPopover
                    placement="right"
                    width="485"
                    trigger="hover"
                    disabled={_item?.details?.length > 0}
                    v-slots={{
                      reference: () => <span class="linkColor"> {_item[field.code]}</span>,
                      default: () => <DetailNumTable data={_item.details}></DetailNumTable>
                    }}
                  ></ElPopover>
                )
              // }
              // return
              case 'planOrderDate':
                return <span>{formatCustomDate(_item[field.code], 'yyyy-MM-dd')}</span>
              case 'examineInfos':
                return (
                  <ElPopover
                    width="420"
                    trigger="hover"
                    v-slots={{
                      reference: () => <span class="linkColor"> 查看</span>,
                      default: () => (
                        <AuditDetail list={handleJSONParse(_item.examineInfos) || []} />
                      )
                    }}
                  ></ElPopover>
                )
              case 'progressBoard':
                return (
                  <span class="linkColor" onClick={handlePlanProgress(_item)}>
                    {' '}
                    查看
                  </span>
                )
              case 'customWarn':
                if (_item?.newProgress === '1') {
                  return (
                    <div class="messageWarn">
                      <div class="messageWarn-text">新进度！</div>
                    </div>
                  )
                }
                return <span />
              case 'submitPerson':
                return <ListPersonShow list={handleJSONParse(_item.submitPersonList) || []} />
              case 'operateManageId':
                return <ListPersonShow list={handleJSONParse(_item.operateManages) || []} />
              case 'productDiagramReference':
                return (
                  // <LineImage urls={_item[field.code] || ''} width={100} height={100}></LineImage>
                  <ElImage
                    style="width: 36px;height: 36px;z-index: 999;"
                    previewTeleported={true}
                    src={
                      _item[field.code]
                        ? `${_item[field.code]}&?x-oss-process=image/quality,q_50`
                        : ''
                    }
                    previewSrcList={[_item[field.code] || '']}
                    fit="contain"
                  ></ElImage>
                )
              default:
                if (field.type === 2) {
                  return (
                    <LineTxt
                      txt={_item?.options.find((item) => item.code === _item[field.code])?.value}
                    ></LineTxt>
                  )
                }
                return <LineTxt txt={`${_item[field.code]}`}></LineTxt>
            }
          }
        })
      }
    })
    return list
  })

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'audit', txt: '审核', reveal: (_item) => _item.displayAuditButton },
    { fun: 'view', txt: '详情', reveal: (_item) => _item.displayDetailButton },
    { fun: 'edit', txt: '编辑', reveal: (_item) => _item.displayEditButton },
    { fun: 'delete', txt: '删除', type: 'danger', reveal: (_item) => _item.displayDeleteButton },
    { fun: 'recycle', txt: '商企回收', reveal: (_item) => _item.displayRecycleButton },
    { fun: 'design', txt: '设计图库', reveal: (_item) => _item.displayDesignButton },
    { fun: 'copy', txt: '企划复制' }
  ])

  const setRouterInfo = () => {
    let params: Object = {}
    const param: any = route.params
    const query: any = route.query
    Object.keys(param).forEach((key) => {
      params[key] = param[key]
    })
    Object.keys(query).forEach((key) => {
      params[key] = query[key]
    })
    if (Object.keys(params).length !== 0) {
      searchData.value = { ...searchData.value, ...params }
      const newUrl = window.location.href.replace(/\?.*$/, '')
      history.replaceState({}, '', newUrl)
    }
  }

  return {
    dataList,
    searchData,
    loading,
    page,
    scheme,
    btns,
    column,
    screen,
    stateInfo,
    statistics,
    handleColumn,
    setRouterInfo
  }
}
