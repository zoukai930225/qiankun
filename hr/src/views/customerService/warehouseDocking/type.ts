import { v4 as uuidv4 } from 'uuid';
export class DataItem {
    typeValue: string;
    warehouse: string;
    rejectOrderNumber: string;
    orderNo: string;
    issueType: string;
    logisticsOrderNo: string;
    wrongContent: string;
    isPay: number | null;
    returnLogisticsOrderNo: string;
    financialLoss: string;
    courierWeight: number | null;
    productCode: string;
    sendLessProductCode: string;
    quantity: number | null;
    financialLossAmount: number | null;
    productValue: number | null;
    handler: string;
    warningTime: Array<any>;
    returnAddress: string;
    csRemark: string;
    warehouseIssueExistence: number | null;
    formIsHandle: string | null;
    warehouseOrderNo: string;
    whRemark: string;
    id: string | null;
    type: string;
    isHandle: number | null;
    imagesUrls: string;
    certificateUrls: string;
    shippingVideoUrls: string;
    whImageUrls: string;
    constructor(data: any = {}) {
        this.typeValue = data?.typeValue || '';
        this.warehouse = data?.warehouse || '';
        this.rejectOrderNumber = data?.rejectOrderNumber || '';
        this.orderNo = data?.orderNo || '';
        this.issueType = data?.issueType || '';
        this.logisticsOrderNo = data?.logisticsOrderNo || '';
        this.wrongContent = data?.wrongContent || '';
        this.isPay = !!data?.isPay ? data.isPay : (data.isPay === 0 ? 0 : null);
        this.returnLogisticsOrderNo = data?.returnLogisticsOrderNo || '';
        this.financialLoss = data?.financialLoss || '';
        this.courierWeight = !!data?.courierWeight ? data.courierWeight : (data.courierWeight === 0 ? 0 : null);
        this.productCode = data?.productCode || '';
        this.sendLessProductCode = data?.sendLessProductCode || '';
        this.quantity = !!data?.quantity ? data.quantity : (data.quantity === 0 ? 0 : null);
        this.financialLossAmount = !!data?.financialLossAmount ? data.financialLossAmount : (data.financialLossAmount === 0 ? 0 : null);
        this.productValue = !!data?.productValue ? data.productValue : (data.productValue === 0 ? 0 : null);
        this.handler = data?.handler || '';
        this.warningTime = data?.warningTime || [];
        this.returnAddress = data?.returnAddress || '';
        this.csRemark = data?.csRemark || '';
        this.warehouseIssueExistence = !!data?.warehouseIssueExistence ? data.warehouseIssueExistence : (data.warehouseIssueExistence === 0 ? 0 : null);
        this.formIsHandle = !!data?.formIsHandle ? data.formIsHandle : (data.formIsHandle === 0 ? 0 : null);
        this.warehouseOrderNo = data?.warehouseOrderNo || '';
        this.whRemark = data?.whRemark || '';
        this.id = data?.id || '';
        this.type = data?.type || '';
        this.isHandle = !!data?.isHandle ? data.isHandle : (data.isHandle === 0 ? 0 : null);
        this.imagesUrls = data?.imagesUrls || '';
        this.certificateUrls = data?.certificateUrls || '';
        this.shippingVideoUrls = data?.shippingVideoUrls || '';
        this.whImageUrls = data?.whImageUrls || '';
    }
}


export interface TabsProvideType {
    tabValue: Ref<String>;
    permissionList: Ref<Array<any>>;
    roleList: Ref<Array<any>>;
    getDataList: () => void;
    getRole: (name: string) => void;
    detailsView: (row: any, type: string) => void;
    grabChecks: (name: string) => Boolean;
}

export class SearchItem {
    warehouse: Array<string> = [];
    orderNo: string = '';
    issueType: Array<string> = [];
    sendLessProductCode: string = '';
    productCode: string = '';
    logisticsOrderNo: string = '';
    registrar: Array<string> = [];
    handler: string = '';
    warehouseIssueExistence: string = '';
    isHandle: number | null = null;
    registrationTime: Array<string> = [];
    isPay: number | null = null;
    rejectOrderNumber: string = '';
}

export class Count {
    dockingCount: number = 0;
    ncRejectedCount: number = 0;
    refundCount: number = 0;
    returnCount: number = 0;
}

export class ColumnItem {
    prop: string;
    label: string;
    id: string;
    minWidth: number;
    isformatter: boolean;
    formatter: Function;
    align: string;
    fixed: string | boolean;
    isComponent: boolean;
    component: any;
    componentProps: Function;
    constructor(data: any = {}) {
        this.prop = data?.prop || '';
        this.label = data?.label || '';
        this.id = data?.id || uuidv4();
        this.minWidth = data?.minWidth || 120;
        this.isformatter = data?.isformatter || false;
        this.formatter = data?.formatter ? data?.formatter : () => { };
        this.align = data?.align || '';
        this.fixed = data?.fixed || false;
        this.isComponent = data?.isComponent || false;
        this.component = data?.component || null;
        this.componentProps = data?.componentProps ? data.componentProps : () => { };
    }
}

export class Page {
    total: number = 0;
    size: number = 10;
    page: number = 1;
}