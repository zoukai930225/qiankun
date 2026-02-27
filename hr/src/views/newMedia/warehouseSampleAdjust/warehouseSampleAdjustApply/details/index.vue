<template>
  <scheme-details ref="detailsRef" name="Warehousesampleadjustapply" width="936">
    <template #card>
      <!-- <div> 详情内容区(外围卡片样式无需书写) </div> -->
      <el-card shadow="never">
        <template #header>
          <div clsss="row-center" style="display: flex;align-items: center;">
            <div style="width: 3px;height: 10px;background: #0064FF;"></div>
            <div style="font-size: 14px;font-weight: 600;color: #333333;margin-left: 6px;">基本信息</div>
          </div>
        </template>
        <el-descriptions border :column="2" :model="dataValue" label-width="110">
          <el-descriptions-item label="申请人">
            <LineAvatar :user="{ name: dataValue.applyUserName, avatarOrigin: dataValue.applyUserAvatarOrigin }" />
          </el-descriptions-item>
          <el-descriptions-item label="申请日期">
            {{ dataValue.applyDate || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="店铺" :span="2">
            {{ dataValue.storeName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="样品款号" :span="2">
            <view class="" style="height: 125px;overflow: auto;display: block;">
               {{ dataValue.sampleItemCode || '-' }}
            </view>
          </el-descriptions-item>
          <el-descriptions-item label="申请用途" >
            {{ dataValue.applyPurposeValue || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="归还日期">
            {{ dataValue.dueDate || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="是否需要归还">
            {{ dataValue.isDueText || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="是否已经归还">
            {{ dataValue.isBeenReturn === null? '-' : Number(dataValue.isBeenReturn) === 1? '是': '否' }}
          </el-descriptions-item>
          <el-descriptions-item label="邮寄省市区">
            {{ dataValue.pca || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="邮寄信息" :span="2">
            {{ dataValue.mailingAddress || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="快递公司" :span="2">
            {{ dataValue.expressCompanyValue || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            {{ dataValue.remark || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="原始单号">
            {{ dataValue.originalOrderNumber || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="快递单号">
            {{ dataValue.trackingNo || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="附件">
            <transfer v-model="dataValue.filePaths" disabled style="width: 650px"></transfer>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- <el-card class="auditLogs mt20px" shadow="never">
        <template #header>
          <div clsss="row-center" style="display: flex;align-items: center;">
            <div style="width: 3px;height: 10px;background: #0064FF;"></div>
            <div style="font-size: 14px;font-weight: 600;color: #333333;margin-left: 6px;">订单明细</div>
          </div>
        </template>
        <el-table :header-cell-style="{ color: '#333', backgroundColor: '#F2F6FC' }"
          style="width: 100%;" show-overflow-tooltip :max-height="400" :data="dataValue.orderDetails" border ref="tableRef">
          <el-table-column :prop="col.field" :label="col.title" min-width="140"  v-for="col in columns"/>
        </el-table>
      </el-card> -->
      <el-card class="auditLogs mt20px" shadow="never">
        <template #header>
          <div clsss="row-center" style="display: flex;align-items: center;">
            <div style="width: 3px;height: 10px;background: #0064FF;"></div>
            <div style="font-size: 14px;font-weight: 600;color: #333333;margin-left: 6px;">审核记录</div>
          </div>
        </template>
        <Timeline :auditLogs="dataValue.approvalRecordList" v-if="dataValue.approvalRecordList?.length" />
        <div v-if="!dataValue.approvalRecordList || dataValue.approvalRecordList.length === 0" style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
          <img class="mt30px" src="@/assets/imgs/empty/empty1.png" alt="" />
          <div class="mb24px">暂无相关内容</div>
        </div>
      </el-card>
      
    </template>
    <template #button>
      <!-- <div> 按钮操作区 </div> -->
      <!-- 
        <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button> -->
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'WarehousesampleadjustapplyDetails' };
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../page/config";
import request from '@/config/axios';
import LineAvatar from "@/components/template/table/components/lineAvatar.vue";
import Timeline from '../components/timeline.vue';
import { columns} from './orderDetailTableConfig'

const message = useMessage();

const { onSearch } = inject(`WarehousesampleadjustapplyForm`) as FromProvideType;

const detailsRef = ref<any>(), formRef = ref(),orderDetail = ref<any>([]), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => viewType.value === 'view' ? '详情' : '编辑');

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    dataValue.value = { ...new DataItem(), ...item };
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
    viewType.value = type;
    if (item.id) {
      request.get({ url: `/api/warehouseSampleAdjustApply/${item.id}` }).then((res: any) => {
        dataValue.value = res
      })
    }
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
    });
  });
};

// 通用表单校验
const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue();
  valid && submit();
};

// 实际提交（防抖）
const submit = debounce(async () => {
  // loading.value = true;
  // request.post({ url: `/api/employeeMonthlyAssessment/update`, data: dataValue.value }).then(() => {
  //   message.success('操作成功');
  //   detailsRef?.value?.closed();
  //   onSearch();
  // }).finally(() => {
  //   loading.value = false;
  // });
}, 500);

defineExpose({ openView });

provide('WarehousesampleadjustapplyDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';

:deep(.card_info) {
  overflow: auto !important;
  background-color: transparent;

  .el-card__body {
    padding: 0;
  }

  .el-card {

    border: none;

    .el-card__header {
      padding: 16px 20px;
      border-bottom: solid 1px #F0F0F0;
    }

    .el-card__body {
      padding: 20px;
    }
  }
}

:deep(.el-descriptions__table) {
  .el-descriptions__label {
    width: 174px !important;
    // line-height: 45px;
    padding: 12px 16px !important;
    font-size: 14px;
    color: #666666;
    background: #F4F6FA;
    font-weight: normal;
  }

  .el-descriptions__content {
    font-size: 14px;
    color: #333333;
    vertical-align: middle;
    min-width: 254px;
    word-break: break-all;
    max-height: 10px;
  }
}
</style>
