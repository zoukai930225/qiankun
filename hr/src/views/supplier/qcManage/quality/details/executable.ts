import { executableVerification } from "@/components/template/config/index";
import { useRouteInfo } from "@/hooks/common/useRouteInfo";
import { useUserStore } from '@/store/modules/user';
import { useRole } from '@/hooks/common/useRole';
import request from '@/config/axios';

const { getPermissionInfo, grabCheck } = useRole('供应链');

const { getRouteInfo } = useRouteInfo();

export const executablePage = (name: string, route: any, router: any) => {
  route?.query?.type && executableVerification({
    add: () => getPermissionInfo(() => !grabCheck('QC权限') && router.push({ path: `/404` })),
    edit: async () => {
      const info: any = await request.get({ url: `/api/qcQualityInspectionReportInfo/${route.query.id}` });
      const user: any = useUserStore().user || {};
      info.createdId !== user.id && (router.push({ path: getRouteInfo(`${name}Details`), query: { ...route.query, type: 'view' } }))
    }, view: () => { }
  }, route.query.type as any)();
};

