import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import { Layout } from '@/utils/routerHelper';
import { cloneDeep } from 'lodash-es'

const { wsCache } = useCache();

const { t } = useI18n()

const treeToArray = (tree: any, ids: string = 'id', childName: string = 'children') => {
  return tree.reduce((res: any, item: any) => {
    let target: any = cloneDeep({ ...item });
    target.children = target[childName]?.length ? target[childName] : [];
    target.id = target[ids] || '';
    target.parentId = target.parentId || '';
    const child: any = target?.children?.length ? target.children.map((chl: any) => {
      let obj: any = cloneDeep({ ...chl });
      obj.children = obj[childName]?.length ? obj[childName] : [];
      obj.id = obj[ids] || '';
      obj.parentId = item[ids] || '';
      return { ...obj };
    }) : [];
    return res.concat(
      { ...target },
      item[childName]?.length ? treeToArray(child, ids, childName) : []
    );
  }, []);
}

// 生成详情静态路由集合，请勿私自添加 ！！！

let detailsList: AppRouteRecordRaw[] = [
  {
    path: '/admin/web/',
    component: Layout,
    name: '系统详情',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'version',
        component: () => import('@/views/system/edition/details/tab.vue'),
        name: 'EditionDetailsTab',
        meta: {
          title: '更新日志',
          keepAlive: false,
          noCache: false
        }
      }
    ]
  }
];

let detailsRouter: AppRouteRecordRaw[] = [
  {
    path: '/admin/details/',
    component: Layout,
    name: '详情',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'qualityDetails',
        component: () => import('@/views/supplier/qcManage/quality/details/index.vue'),
        name: 'QualityDetails',
        meta: {
          title: 'QC质检报告信息',
          noCache: false,
          hidden: true,
          canTo: true,
          keepAlive: true
        }
      },
      // <!-- INJECT_ROUTER -->
    ]
  }
];

const setDetailsRouter = () => {
  let remote: any = [];
  if (wsCache.get(CACHE_KEY.ROLE_ROUTERS)) {
    remote = [...new Set(treeToArray(wsCache.get(CACHE_KEY.ROLE_ROUTERS) as AppCustomRouteRecordRaw[]).map((rs: any) => rs.componentName))];
  }
  detailsRouter = [{ ...detailsRouter[0], children: detailsRouter[0].children?.filter((ci: any) => remote.includes(ci.name.replaceAll('Details', ''))) }];
  return [...detailsList, ...detailsRouter];
};

// 生成详情静态路由集合，请勿私自添加 ！！！

export default setDetailsRouter