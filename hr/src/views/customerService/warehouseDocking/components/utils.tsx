export const tabsOptions = (role: string, tabValue: string | null = null) => {
  let list: any = [
    { label: '少发/错发', value: '1', nums: 'dockingCount' },
    { label: '退件寄错货', value: '2', nums: 'returnCount' },
    { label: '退货退款/换货', value: '3', nums: 'refundCount' }
  ];
  const no_needs: any = { label: '无需核对少发/错发', value: '4' };
  // const sarehouse: any = { label: '南昌云仓驳回', value: '5', nums: 'ncRejectedCount' };
  if (role.includes('客服仓库')) {
    list = [...list, no_needs];
  } else if (role.includes('南昌云仓处理人')) {
    list = [...list];
  } 
  const tar: any = list.find((li: any) => li.value === tabValue);
  return tabValue === null ? list : tar;
};

export const urlValue = (tabs: string, name: string = 'url') => {
  let urls: any = [
    { url: 'Docking', value: '1', del: 'csWarehouseDocking', export: 'csWarehouseDocking', add: '/api/csWarehouseDocking', update: '/api/csWarehouseDocking/editInfo', details: '/api/csWarehouseDocking/',csEdit:'/api/csWarehouseDocking/csEdit',queryInfo:'/api/csWarehouseDocking/queryOrderDetailInfo' },
    { url: 'DockingReturnSent', value: '2', del: 'csWarehouseDockingReturnSent/deleteById', export: 'csWarehouseDockingReturnSent', add: '/api/csWarehouseDockingReturnSent/add', update: '/api/csWarehouseDockingReturnSent/edit', details: '/api/csWarehouseDockingReturnSent/',csEdit:'/api/csWarehouseDockingReturnSent/csEdit',queryInfo:'/api/csWarehouseDockingReturnSent/queryOrderDetailInfo' },
    { url: 'DockingRefundSent', value: '3', del: 'csWarehouseDockingRefundSent/deleteById', export: 'csWarehouseDockingRefundSent', add: '/api/csWarehouseDockingRefundSent/add', update: '/api/csWarehouseDockingRefundSent/edit', details: '/api/csWarehouseDockingRefundSent/',csEdit:'/api/csWarehouseDockingRefundSent/csEdit',queryInfo:'/api/csWarehouseDockingRefundSent/queryOrderDetailInfo' },
    { url: 'DockingNoCheck', value: '4', del: 'csWarehouseDockingNoCheck/deleteById', export: 'csWarehouseDockingNoCheck', add: '/api/csWarehouseDockingNoCheck/add', details: '/api/csWarehouseDockingNoCheck/',csEdit:'/api/csWarehouseDockingNoCheck/csEdit',queryInfo:'/api/csWarehouseDockingNoCheck/queryOrderDetailInfo' },
    { url: 'NcRejected', value: '5', del: 'csWarehouseNcRejected/deleteById', export: 'csWarehouseNcRejected', add: '/api/csWarehouseNcRejected/add', update: '/api/csWarehouseNcRejected/edit', details: '/api/csWarehouseNcRejected/',csEdit:'/api/csWarehouseNcRejected/csEdit' }
  ];
  const tar: any = urls.find((us: any) => us.value === tabs);
  return tar && tar[name] ? tar[name] : '';
};