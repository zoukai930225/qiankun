import LineAvatar from "@/components/template/table/components/lineAvatar.vue";
import { PageItem, Screen } from '@/components/template/config/type';
import dayjs from "dayjs";
import SelectUser from "@/components/common/user/selectUserByDept.vue";
import { getIntDictOptions } from "@/utils/dict";
// 查询结构
export class SearchItem {
  customerName: string = '';
  category: string = '';
  groupName: string = '';
  questionDockingPersons?: Array<string> = [];
  questionDockingPersonName: string = '';
};

// 表格数据结构
export class DataItem {
  id: string = '';
  customerName: string = '';
  customerNameOld: string = '';
  category: string = '';
  group: string = '';
  groupName: string = '';
  groupNameOld: string = '';
  updatedAt: string = '';
  updatedId: string = '';
  questionDockingPerson: string = '';
  questionDockingPersonName: string = '';
  questionDockingPersonAvatar: string = '';
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { userInfo,grabCheck } = params;

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 查询配置(必配)
  const scheme = computed(() => ([
    { field: 'customerName', 
      label: ['旺旺名','(客服)'] ,
      componentProps:{
        placeholder:"请输入旺旺名(客服)",
        clearable:true
      }},
    { field: 'category', label: '组别' },
    { field: 'groupName', label: '所属分组' },
    { field: 'questionDockingPersonName', 
      label: ['问题对接','人'],
      // isCustom: true,
      // customRender: (_item) => <SelectUser  />,
      componentProps:{
        placeholder:"请输入问题对接人",
        clearable:true,
        // multiple:true
      }
    }
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
    { fun:'add',txt:'新增', type: 'primary',display:()=>!grabCheck('质检人员')},
    // { fun: 'board', txt: '数据看板', disabled: () => !dataList?.value?.length },
    // { fun: 'seal', txt: '数据封版', disabled: () => !userInfo.value.isHrbp },
    // { fun: 'solution', txt: '数据解封', disabled: () => !userInfo.value.isManagement },
    { fun: 'export', txt: '导出', type: 'primary', api: `/api/personnelGroup/export`, method: 'downloadPost', exportName: '人员组别配置' },
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'customerName', title: '旺旺名(客服)', minWidth: 120 },
    { field: 'category', title: '组别', minWidth: 120 },
    { field: 'groupName', title: '所属分组', minWidth: 120 },
    { field: 'questionDockingPerson', title: '问题对接人', minWidth: 110,  isCustom: true, customRender: (_item) => <LineAvatar user={{ name: _item.questionDockingPersonName, avatarOrigin: _item.questionDockingPersonAvatar }} /> },
    { field: 'updatedId', title: '操作人', minWidth: 110,  isCustom: true, customRender: (_item) => <LineAvatar user={{ name: _item.updatedName, avatarOrigin: _item.updatedAvatar }} /> },
    { field: 'updatedAt', title: '操作时间', minWidth: 120 },
    // { field: 'khzq', title: '考核周期', width: 100 },
    // { field: 'nl', title: '能力', width: 80, isCustom: true, customRender: (_item) => <LineTages txt={getDicInfo(_item.nl, 'label')} background={getDicInfo(_item.nl, 'background')} color={getDicInfo(_item.nl, 'color')} /> },
    // { field: 'ql', title: '潜力', width: 80, isCustom: true, customRender: (_item) => <LineTages txt={getDicInfo(_item.ql, 'label')} background={getDicInfo(_item.ql, 'background')} color={getDicInfo(_item.ql, 'color')} /> },
    // { field: 'jzg', title: '价值观', width: 80, isCustom: true, customRender: (_item) => <LineTages txt={getDicInfo(_item.jzg, 'label')} background={getDicInfo(_item.jzg, 'background')} color={getDicInfo(_item.jzg, 'color')} /> },
    // { field: 'sftbTxt', title: '填报状态', width: 90, isFormatter: true, formatter: (_item) => _item.sftb === 1 ? '已填报' : '未填报' },
    // { field: 'isStop', title: '封版状态', width: 90, isFormatter: true, formatter: (_item) => _item.isStop === 1 ? '已封版' : '未封版' },
    // { field: 'managerName', title: '直属上级', width: 110, isCustom: true, customRender: (_item) => <LineAvatar user={{ name: _item.managerName, avatarOrigin: _item.sjtx }} /> },
    // { field: 'hrName', title: 'HRBP', width: 110, isCustom: true, customRender: (_item) => <LineAvatar user={{ name: _item.hrName, avatarOrigin: _item.hrtx }} /> },
    // { field: 'remark', title: '备注', minWidth: 264 }
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'view', txt: '详情' },
    { fun: 'edit', txt: '编辑', reveal:()=>grabCheck('质检人员')},
    { fun:"delete",txt:"删除",type:"danger",reveal:()=>grabCheck('质检人员') }
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

