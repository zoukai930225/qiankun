import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import { treeToArray } from '@/utils';
import router from '@/router';

export const useRouteInfo = () => {
  const routes: any = router.getRoutes();

  const { wsCache } = useCache();

  const getRouteInfo = (name: string, target: string | null = 'path') => {
    const tar: any = routes.find((rs: any) => rs.name === name);
    return target ? (tar && tar[target] ? tar[target] : null) : (tar || {});
  };

  const getRouteInfos = (value: string, label: string = 'name', target: string | null = 'path') => {
    const list: any = treeToArray((wsCache.get(CACHE_KEY.USER)?.menus || []));
    const menu: any = list.find((rs: any) => rs[label] === value);
    const tar: any = menu?.id ? routes.find((rs: any) => rs.name === menu.componentName) : null;
    return target ? (tar && tar[target] ? tar[target] : null) : (tar || {});
  };

  return { getRouteInfo, getRouteInfos }
}
