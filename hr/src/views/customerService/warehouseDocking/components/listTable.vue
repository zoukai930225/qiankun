<template>
  <el-table :key="`WarehouseDocking_${tabValue}`" ref="tableRef" class="SWCommonTable" :data="list" width="100%"
    v-loading="loading" v-horizontal-scroll="'always'" row-class-name="commonTableRow"
    :header-cell-style="appStore.headerCellStyle">
    <el-table-column v-for="col in columns" :key="col.id" :label="col.label" :prop="col.prop"
      :min-width="col?.minWidth || 120" :align="col?.align || 'left'" :fixed="col.fixed || false" show-overflow-tooltip
      :formatter="(row: any) => col?.isformatter ? col.formatter(row) : `${row[col.prop] || '-'}`">
      <template #default="{ row }">
        <component v-if="col.isComponent" :is="col.component(row)" :props="col.componentProps(row)" />
      </template>
    </el-table-column>
    <el-table-column label="操作" :show-overflow-tooltip="false" fixed="right" :width="140" align="center">
      <template #default="{ row }">
        <el-button type="primary" class="btn normal" @click.stop="detailsView({ ...row, typeValue: tabValue }, 'view')"
          link>
          详情
        </el-button>
        <el-button type="primary" class="btn normal" @click.stop="detailsView({ ...row, typeValue: tabValue }, 'edit')"
          link v-show="(grabChecks('仓处理人') && tabValue !== '4') || (grabChecks('退货退款换货处理人') && tabValue === '3')">
          {{ !row.isHandle ? '处理' : '编辑' }}
        </el-button>
        <el-button type="primary" class="btn normal"
          @click.stop="detailsView({ ...row, typeValue: tabValue }, 'editorKeFu')" link
          v-show="(grabChecks('客服仓库') || tabValue === '4') && row.registrar === userStore.user.id">
          编辑
        </el-button>
        <!-- <el-button type="danger" link @click="del(row)" v-if="grabChecks('客服仓库')">
          删除
        </el-button> -->
      </template>
    </el-table-column>
    <template #empty>
      <div class="empty-img">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <div>暂无数据</div>
      </div>
    </template>
  </el-table>
</template>
<script lang="tsx" setup>
import LineAvatar from '@/components/template/table/components/lineAvatar.vue';
import LineImage from "@/components/template/table/components/lineImage.vue";
import LineVideo from "@/components/template/table/components/lineVideo.vue";
import { getDictLabel, DICT_TYPE } from '@/utils/dict';
import { TabsProvideType, ColumnItem } from '../type';
import { useAppStore } from '@/store/modules/app';
import request from '@/config/axios';
import { urlValue } from './utils';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore()
const message = useMessage();

const appStore = useAppStore(), tableRef = ref();

const { tabValue, getDataList, detailsView, grabChecks } = inject('warehouse_docke_handle') as TabsProvideType;

const columns = computed(() => {
  let arr: Array<ColumnItem> = [];
  const warehouse: ColumnItem = new ColumnItem({ prop: 'warehouse', label: '所属仓库', isformatter: true, formatter: (row: any) => getDictLabel(DICT_TYPE.CS_WAREHOUSE_DOCKING_WAREHOUSE, row.warehouse) || '-' });
  const orderNo: ColumnItem = new ColumnItem({ prop: 'orderNo', label: '订单编号', minWidth: 220 });
  const issueType: ColumnItem = new ColumnItem({ prop: 'issueType', label: '问题类型', isformatter: true, formatter: (row: any) => getDictLabel(DICT_TYPE[tabValue.value === '1' ? 'CS_WAREHOUSE_DOCKING_ISSUE_TYPE' : 'CS_WAREHOUSE_DOCKING_REFUND_ISSUE_TYPE'], row.issueType) || '-' });
  const logisticsOrderNo: ColumnItem = new ColumnItem({ prop: 'logisticsOrderNo', label: '物流单号', minWidth: 220 });
  const courierWeight: ColumnItem = new ColumnItem({ prop: 'courierWeight', label: '快递重量(KG)' });
  const productCode: ColumnItem = new ColumnItem({ prop: 'productCode', label: `${tabValue.value === '4' ? '应发' : ''}产品编码`, minWidth: 220 });
  const productValue: ColumnItem = new ColumnItem({ prop: 'productValue', label: '产品价值(元)' });
  const registrarName: ColumnItem = new ColumnItem({ prop: 'registrarName', label: '登记人', isComponent: true, component: (row: any) => <LineAvatar user={row.registrarObj} /> });
  const registrationTime: ColumnItem = new ColumnItem({ prop: 'registrationTime', label: '登记时间', minWidth: 165 });
  const imagesUrls: ColumnItem = new ColumnItem({ prop: 'imagesUrls', label: '图片', isComponent: true, component: (row: any) => <LineImage urls={row.imagesUrls} /> });
  const csRemark: ColumnItem = new ColumnItem({ prop: 'csRemark', label: '备注(客服)', minWidth: 200 });
  const warningTime: ColumnItem = new ColumnItem({ prop: 'warningTime', label: '预警时间', minWidth: 165 });
  const handler: ColumnItem = new ColumnItem({ prop: 'handler', label: '处理人' });
  const warehouseIssueExistence: ColumnItem = new ColumnItem({ prop: 'warehouseIssueExistence', label: '问题是否存在', minWidth: 160, isformatter: true, formatter: (row: any) => row.warehouseIssueExistence === 1 ? '是' : row.warehouseIssueExistence === 0 ? '客服填写信息需完善' : row.warehouseIssueExistence === 2 ? '否' : '-' });
  const shippingVideoUrls: ColumnItem = new ColumnItem({ prop: 'shippingVideoUrls', label: '发货视频', isComponent: true, component: (row: any) => <LineVideo urls={row.shippingVideoUrls} /> });
  const whImageUrls: ColumnItem = new ColumnItem({ prop: 'whImageUrls', label: '图片(仓库)', isComponent: true, component: (row: any) => <LineImage urls={row.whImageUrls} /> });
  const whRemark: ColumnItem = new ColumnItem({ prop: 'whRemark', label: '备注(仓库)' });
  const wrongContent: ColumnItem = new ColumnItem({ prop: 'wrongContent', label: '寄错内容' });
  const isPay: ColumnItem = new ColumnItem({ prop: 'isPay', label: '是否支付转寄运费', minWidth: 160, isformatter: true, formatter: (row: any) => row.isPay === 1 ? '已支付' : row.isPay === 0 ? '未支付' : '-' });
  const returnAddress: ColumnItem = new ColumnItem({ prop: 'returnAddress', label: '转寄地址' });
  const returnLogisticsOrderNo: ColumnItem = new ColumnItem({ prop: 'returnLogisticsOrderNo', label: '寄回物流单号' });
  const warehouseOrderNo: ColumnItem = new ColumnItem({ prop: 'warehouseOrderNo', label: '仓库转寄单号' });
  const isHandle: ColumnItem = new ColumnItem({ prop: 'isHandle', label: '问题是否处理', isformatter: true, formatter: (row: any) => row.isHandle === 1 ? '已处理' : row.isHandle === 0 ? '未处理' : '-' });
  const sendLessProductCode: ColumnItem = new ColumnItem({ prop: 'sendLessProductCode', label: '少/错发产品编码', minWidth: 220 });
  const certificateUrls: ColumnItem = new ColumnItem({ prop: 'certificateUrls', label: '合格证图片', isComponent: true, component: (row: any) => <LineImage urls={row.certificateUrls} /> });
  const quantity: ColumnItem = new ColumnItem({ prop: 'quantity', label: '件数' });
  const financialLoss: ColumnItem = new ColumnItem({ prop: 'financialLoss', label: '资损' });
  const financialLossAmount: ColumnItem = new ColumnItem({ prop: 'financialLossAmount', label: '资损金额(元)' });
  const rejectOrderNumber: ColumnItem = new ColumnItem({ prop: 'rejectOrderNumber', label: '驳回出库单号' });
  switch (tabValue.value) {
    case '1': arr = [warehouse, orderNo, issueType, logisticsOrderNo, courierWeight, productCode, productValue, registrarName, registrationTime, imagesUrls, csRemark, warningTime, handler, warehouseIssueExistence, shippingVideoUrls, whImageUrls, whRemark]; break;
    case '2': arr = [warehouse, orderNo, logisticsOrderNo, wrongContent, imagesUrls, isPay, returnAddress, returnLogisticsOrderNo, csRemark, financialLoss, warningTime, registrarName, registrationTime, handler, warehouseOrderNo, whImageUrls, whRemark]; break;
    case '3': arr = [warehouse, orderNo, logisticsOrderNo, issueType, imagesUrls, csRemark, warningTime, registrarName, registrationTime, handler, isHandle, whImageUrls, whRemark]; break;
    case '4': arr = [warehouse, orderNo, productCode, sendLessProductCode, imagesUrls, certificateUrls, quantity, financialLossAmount, registrarName, registrationTime]; break;
    case '5': arr = [warehouse, rejectOrderNumber, csRemark, registrarName, registrationTime, handler, isHandle, whImageUrls, whRemark]; break;
    default: break;
  }
  return arr;
});

defineProps({
  list: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
});

const del = (row: any) => {
  message.confirm('确认删除这条数据吗？').then((ms: any) => {
    ms === 'confirm' && request.delete({ url: `/api/${urlValue(tabValue.value as string, 'del')}`, params: { id: row.id } }).then((res: any) => {
      res && (message.success('删除成功！'), getDataList())
    })
  }).catch(() => { });
};

</script>

<style lang="scss" scoped>
.el-table {
  :deep(.el-popper) {
    max-width: 400px !important;
    white-space: pre-wrap !important;
  }
}
</style>
