
import { PageItem, Screen } from '@/components/template/config/type';
// import dayjs from "dayjs";
import { ElCascader } from "element-plus";
import { getIntDictOptions, DICT_TYPE,getDictLabel } from '@/utils/dict';
import LineReveals from '@/components/template/table/components/lineReveals.vue'
// import SelectPeople from '@/components/template/table/components/lineStaffs.vue'
import SelectPeople from '@/components/common/user/selectUserByDept.vue'
// 查询结构
export class SearchItem {
  id?: string = '';
  categoryCode?: any;
  managerId: string = '';
  managerName?: string = '';
  process: string = '';
  role: string = '';
  category?: Array<string> = [];
  managers?: Array<any> = [];
};

// 表格数据结构
export class DataItem {
  id: string = '';
  categoryCode?: any;
  process: string = '';
  role: string = '';
  managerId: string = '';
  managers: Array<string> = [];
  category?: Array<string> = []
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { userInfo, categoryList } = params;


  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 级联配置
  const casProps = {
    label: 'categoryName',
    value: 'categoryCode',
    children: 'subCategories',
    checkStrictly: true
  }

  // 查询配置(必配)
  const scheme = computed(() => ([
    {
      field: 'role',
      label: '角色',
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.SYS_CATEGORY_MANAGER_ROLE),
      componentProps: { clearable: true }
    },
    {
      field: 'category',
      label: '品类',
      isCustom: true,
      customRender: (_item, _model) => (<ElCascader options={categoryList.value} props={casProps} separator=">"/>)
    },
    { field: 'managerId', 
      label: '负责人',
      isCustom: true,
      customRender: (_item, _model) => (<SelectPeople v-model={searchData.value.managerId} placeholder="请选择" multiple={false} showAvatarLable={true}/>)
     },
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({
    // ...new Screen({
    //   field: 'sftb',
    //   label: '填报状态:',
    //   options: [{ label: '已填报', value: 1 }, { label: '未填报', value: 0 }],
    //   props: {}
    // })
  }));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
    { fun: 'add', txt: '新增', type: 'primary', }
  ]));
  
  const renderCategory = (row:any)=>{
    if(row.secondCategory){
      if(row.thirdCategory){
        return `${row.firstCategory}/${row.secondCategory}/${row.thirdCategory}`
      }else{
        return `${row.firstCategory}/${row.secondCategory}`
      }
    }else{
      return `${row.firstCategory}`
    }
  }
  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'role', title: '角色',minWidth:200,isCustom: true,customRender:(_item)=>( <span>{ getDictLabel(DICT_TYPE.SYS_CATEGORY_MANAGER_ROLE,_item.role) || '-' }</span>) },
    { field: 'completeCategoryName', title: '品类',minWidth:400 },
    { field: 'managers', title: '负责人',minWidth:420,  isCustom: true, customRender: (_item) => (<LineReveals v-model:optionsList={_item.managers}  no-bg={true} tags="4"/>) },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    // { fun: 'view', txt: '详情' },
    { fun: 'edit', txt: '编辑', },
    { fun: 'delete', txt: '删除', type: 'danger' },
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

  return { dataList, searchData, loading, page, scheme, btns, column, screen, stateInfo, statistics, handleColumn, setRouterInfo }
}

