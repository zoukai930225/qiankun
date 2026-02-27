import { PageItem, Screen } from '@/components/template/config/type';
import DirectorsCell from "@/views/dutyRight/channel/components/directorsCell.vue";
import DirectorsTimeCell from "@/views/dutyRight/channel/components/directorsTimeCell.vue";
import StoreCascader from "@/components/BIStoreCascader/src/storeCascader.vue"
import StoreCell from '@/views/dutyRight/store/components/storeCell.vue';
import SelectPeople from "../../components/selectPeople.vue"
import CategoryCascader from '../../components/categoryCascader.vue';
import { ElTooltip } from 'element-plus';
// 查询结构
export class SearchItem {
  validFlag: Array<number> = [1];
  store: Array<any> = [];
  hasDirector: string = '';
  directorId: Array<any> = [];
  categroy: Array<any> = [];
  categroyType: number = 1;
};

/**
 * 责权管理责任人入参
 *
 * OpDutyAuthorityManageDirectorDto
 */
export interface OpDutyAuthorityManageDirectorDto {
  /**
   * 负责人id
   */
  directorId: string;
  /**
   * 结束时间
   */
  endTime?: string | null;
  /**
   * 开始时间
   */
  startTime: string;
  [property: string]: any;
}
// 表格数据结构
export class DataItem {
  id: string | undefined = undefined;;
  /**
    * 业务主键
    */
  bizIds?: string[];
  /**
   * 业务类型;0-渠道,1-店铺,2-类目,3-商品
   */
  bizType: number = 2;
  /**
   * 批量保存类目责权，完整类目名称
   */
  completeCategoryNames: any[] = [];
  /**
   * 负责人id
   */
  directors: OpDutyAuthorityManageDirectorDto[] = [];
  /**
   * 类目批量店铺
   */
  stores: string[] = [];
  role?: number | null = null;
  loading?: boolean = false;
  isEdit?: boolean = false;
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { userInfo, channelCode } = params;
  const defalutStoreValue = ref<any[]>(['', ''])

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 查询配置(必配)
  const scheme = computed(() => ([
    {
      field: 'store', label: '店铺', width: 220, isCustom: true, customRender: () =>
        <StoreCascader onChange={(val, node) => storeChange(val, node)}
          clear={false} onCreated={handleCreated} filterChannel={['TaoBao', 'Tmall', 'Pdd', 'Douyin']} popperAppendToBody />
    },
    {
      field: 'categroyType', label: '类目类型', width: 220,
      component: 'Select',
      options: [{ label: '电商类目', value: 1 }],
      componentProps: {
        clearable: false,
      },
    },
    {
      field: 'categroy', label: '类目', width: 220, isCustom: true, customRender: () =>
        <CategoryCascader cascaderProps={{ checkStrictly: true }} disabledChannel={true}
          channelCode={channelCode.value} />
    },
    {
      field: 'hasDirector',
      label: ['是否有责', '任人'],
      component: 'Select',
      width: 220,
      options: [{ label: '是', value: 1 },
      { label: '否', value: 0 }],
      componentProps: {
        clearable: true,
        valueOnClear: '',
        placeholder: '请选择',
      },
    },
    {
      field: 'directorId', label: '负责人', width: 220, isCustom: true, customRender: () => <SelectPeople
        multiple={false} />
    },
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({
    ...new Screen({
      field: 'validFlag',
      label: '生效状态:',
      options: [{ label: '只看生效', value: 1 }],
      props: {
      }
    })
  }));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
    { fun: 'multipleAdd', txt: '批量添加' },
    { fun: 'multipleRemove', txt: '批量移除' },
    { fun: 'log', txt: '操作日志' },
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    {
      field: 'category', title: '类目', width: 150, minWidth: 150, fixed: 'left', isCustom: true, customRender: (_item) => <ElTooltip content={_item.completeCategoryName} placement="top">{_item.category}</ElTooltip>
    },
    { field: 'level', title: '类目等级', width: 100, isFormatter: true, formatter: (row: any) => row.level == 1 ? '一级' : row.level == 2 ? '二级' : row.level == 3 ? '三级' : '四级' },
    { field: 'storeName', title: '店铺', width: 180, isCustom: true, customRender: (_item) => <StoreCell row={_item} channelName="channel" /> },
    { field: 'directorVos', title: '当前负责人', width: 240, isCustom: true, customRender: (_item) => <DirectorsCell row={_item} maxNums={2} /> },
    { field: 'directorVos', title: '当前责权时间', width: 480, minWidth: 480, isCustom: true, customRender: (_item) => <DirectorsTimeCell row={_item} maxNums={2} /> },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'set', txt: '设置', display: (item) => item.channelCode && item.storeCode },
  ]));

  const setRouterInfo = () => {
    let params: Object = {};
    const param: any = route.params;
    const query: any = route.query;
    Object.keys(param).forEach(key => {
      params[key] = param[key];
    });
    Object.keys(query).forEach(key => {
      params[key] = query[key];
    });
    if (Object.keys(params).length !== 0) {
      searchData.value = { ...searchData.value, ...params };
      const newUrl = window.location.href.replace(/\?.*$/, '');
      history.replaceState({}, '', newUrl)
    };
  };
  const storeChange = (val: any[], node: any[]) => {
    console.log(val, node)
    if (Array.isArray(node) && node?.length > 0 && node[0]) {
      if (searchData.value?.categroy?.length > 0 && !node[0].pathLabels[0].includes(searchData.value.categroy[0])) {
        searchData.value.categroy = []
      }
    }
  }

  const handleCreated = async (options: any[]) => {
    console.log("handleCreated", options)
    let defalutValue = ['', ''] as any[]
    options.map(item => {
      if (Array.isArray(item.storeList) && item.storeList.length > 0 && !defalutValue[1]) {
        item.storeList.map(typeList => {
          if (!defalutValue[1]) {
            defalutValue[1] = typeList.storeCode
            defalutValue[0] = item.storeCode
          }
        })
      }
    })
    defalutStoreValue.value = defalutValue
    searchData.value.store = defalutValue
  }
  return { dataList, searchData, loading, page, scheme, btns, column, screen, stateInfo, statistics, handleColumn, setRouterInfo, defalutStoreValue }
}

