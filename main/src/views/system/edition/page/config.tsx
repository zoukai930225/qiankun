import { PageItem } from '@/components/template/config/type';

// 查询结构
export class SearchItem {
  version: string = '';
};

// 表格数据结构
export class DataItem {
  id: string = '';
  version: string = '';
  releaseDate: string = '';
  backImage: string = '';
  remark: string = '';
  attachmentUrl: string = '';
  modules: Array<ModuleItem> = [];
};

export class ModuleItem {
  moduleName: string = '';
  updateContent: string = '';
  sortOrder: number | null = null;
}

// 通用入参
export const usePage = () => {

  const route = useRoute();

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 查询配置(必配)
  const scheme = computed(() => ([{ field: 'version', label: '版本编号' }]));

  // 状态筛选(非必配)
  const screen = computed(() => ({}));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([{ fun: 'add', txt: '新增', type: 'primary' }]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'version', title: '版本编号', minWidth: 110, fixed: 'left' },
    { field: 'releaseDate', title: '发布日期', minWidth: 120 },
    { field: 'createdAt', title: '创建日期', minWidth: 155 },
    // { field: 'createdId', title: '创建人', minWidth: 120, isCustom: true, customRender: (_item) => <LineAvatar user={{ name: _item.createdName, avatarOrigin: _item.createdAvatarOrigin }} /> },
    { field: 'updatedAt', title: '更新日期', minWidth: 155 },
    // { field: 'updatedId', title: '更新人', minWidth: 110, isCustom: true, customRender: (_item) => <LineAvatar user={{ name: _item.updatedName, avatarOrigin: _item.updatedAvatarOrigin }} /> },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'edit', txt: '维护' },
    { fun: 'del', txt: '删除', method: 'post', isStreamline: true, type: 'danger', api: `/api/sysVersionUpdate/batchDelete` }
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

