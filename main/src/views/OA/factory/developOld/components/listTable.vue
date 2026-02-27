<template>
  <el-table class="SWCommonTable" :data="[...list]" width="100%" v-loading="loading" v-horizontal-scroll="'always'"
    row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle">
    <el-table-column label="货品编码" prop="productCode" min-width="120">
      <template #default="{ row }">
        {{ row.productCode || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="二开原因" prop="secondaryDevReason" min-width="180">
      <template #default="{ row }">
        <el-popover placement="bottom-start" :show-arrow="false" :width="260" trigger="hover" :offset="6"
          :content="row.secondaryDevReason">
          <template #reference>
            <span class="text1">{{ row.secondaryDevReason || '' }}</span>
          </template>
        </el-popover>

      </template>
    </el-table-column>
    <el-table-column label="系列" prop="series" min-width="120">
      <template #default="{ row }">
        {{ row.series || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="品类" prop="categoryName" min-width="180">
      <template #default="{ row }">
        <!-- {{ categoryList.find((el:any)=>el.code === row.category)?.name || '-' }} -->
        {{ row.categoryName || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="版师" prop="patternMakerList" min-width="320">
      <template #default="{ row }">
        <line-staff :key="'patternMaker' + id" v-model="row.patternMakerList" :code="'NEW_PRODUCT_DEPT_DEVELOP'"
          @save="(list: any) => patternMakerSave(list, row, 'patternMaker', 'patternMakerIds')"
          :disabled="!(grabCheck('二开产研主管') && row.status === 2)"
          :placeholder="row.patternMakerList?.length ? '-' : '请选择版师'" />
      </template>
    </el-table-column>
    <el-table-column label="设计师/买手" prop="designerList" min-width="320">
      <template #default="{ row }">
        <line-staff :key="'designer' + id" v-model="row.designerList" :code="'NEW_PRODUCT_DEPT_DEVELOP'"
          @save="(list: any) => patternMakerSave(list, row, 'designer', 'designerIds')"
          :disabled="!(grabCheck('二开产研主管') && row.status === 2)"
          :placeholder="row.designerList?.length ? '-' : '请选择设计师/买手'" />
      </template>
    </el-table-column>
    <el-table-column label="选供专员" prop="chosenSupplierStaffList" min-width="320">
      <template #default="{ row }">
        <line-staff :key="'chosenSupplier' + id" v-model="row.chosenSupplierStaffList" :code="'NEW_PRODUCT_DEPT_SUPPLY'"
          @save="(list: any) => patternMakerSave(list, row, 'supplyStaff', 'supplyStaffIds')"
          :disabled="!(grabCheck('二开供应链主管') || grabCheck('二开企划负责人'))"
          :placeholder="row.patternMakerList?.length ? '-' : '请选择选供专员'" />
      </template>
    </el-table-column>

    <el-table-column label="更新时间" prop="updatedAt" min-width="220">
      <template #default="{ row }">
        {{ row.updatedAt || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="供应商数" prop="supplierList" width="100" align="right">
      <template #default="{ row }">
        <el-popover placement="left" :show-arrow="false" :width="560" trigger="hover" :offset="6"
          :disabled="!row.supplierList?.length">
          <template #reference>
            <span :class="[row.supplierList?.length ? 'linkText' : '']">{{ row.supplierList?.length }}</span>
          </template>
          <supplierCount :list="row.supplierList" />
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="二开发起时间" prop="supplierList" width="160" align="left"
      :formatter="(row: any) => formatTime(row.createdAt, 'yyyy-MM-dd') || '-'"></el-table-column>
    <el-table-column label="审核详情" prop="supplierList" width="100" header-align="left">
      <template #default="{ row }">
        <el-popover :width="420" trigger="hover">
          <AuditDetail :list="row.fsAuditHistories || []" />
          <template #reference>
            <div class="row-center">
              <span class="linkColor">查看</span>
            </div>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="操作" :show-overflow-tooltip="false" fixed="right" width="220" align="left">
      <template #default="{ row }">
        <el-button v-if="row.showSupplierInfoBtn" type="primary" class="btn normal"
          @click.stop="emits('clickBtn', isDetails(row) ? 'supplierInfo' : 'supplier', row.id)" link>
          供应商信息
        </el-button>
        <el-button v-if="row.showExamBtn" link type="primary" @click="emits('clickBtn', 'audit', row.id, row)">
          审核</el-button>
        <el-button type="primary" class="btn normal" @click.stop="emits('clickBtn', 'edit', row.id, row)" link
          v-if="row.showEditBtn">
          编辑
        </el-button>
        <el-button type="danger" link @click.stop="emits('clickBtn', 'delete', row.id)" v-if="row.showDeleteBtn">
          删除
        </el-button>
        <!-- <el-button type="primary" class="btn normal" @click.stop="emits('clickBtn', 'supplierInfo', row.id)" link
          v-if="row.showSupplierInfoBtn">
          供应商信息
        </el-button> -->
        <el-button type="primary" class="btn normal" @click.stop="emits('clickBtn', 'progress', row)" link
          v-if="row.showSampleProgressBtn">
          打样进度
        </el-button>
        <el-button type="primary" class="btn normal" @click.stop="emits('clickBtn', 'recycle', row)" link
          v-if="row.showSampleProgressBtn">
          回收
        </el-button>
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
<script lang="ts" setup>
import LineStaff from '@/components/template/table/components/lineStaff.vue';
import { useCategoryList, } from '@/views/OA/factory/hooks';
import { useUserStore } from '@/store/modules/user';
import { useAppStore } from '@/store/modules/app';
import supplierCount from './supplierCount.vue';
import { TabsProvideType } from "../type";
import request from '@/config/axios';
import AuditDetail from './auditDetail.vue';
import { formatTime } from '@/utils';
import { showSuppliers } from '@/api/supplier/assessmentConfiguration';

const { getList, grabCheck } = inject('factory_develop_handle') as TabsProvideType;

const { initSelectData } = useCategoryList();

const userStore = useUserStore();

const appStore = useAppStore();

const message = useMessage()

defineProps({
  list: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['clickBtn'])

const patternMakerSave = (list: any, row: any, url: string, name: string) => {
  let data: any = { fsTaskId: row.id };
  data[name] = list.map((li: any) => li.userId);
  request.post({ url: `/workflow-api/api/workflow/business/factorySecondary/devTask/${url}/assign`, data }).then((res: any) => {
    res && message.success('操作成功');
  }).finally(() => {
    getList();
  });
};

const isDetails = (row: any) => {
  return !row.chosenSupplierStaffList.map((si: any) => si.userId).join(',').includes(userStore.user.id);
};

onMounted(() => {
  initSelectData()
})
</script>

<style lang="scss" scoped>
.el-table {
  :deep(.el-popper) {
    max-width: 400px !important;
    white-space: pre-wrap !important;
  }
}

.linkColor {
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #0064ff;
}

.linkText {
  color: #0064ff;

  &:hover {
    opacity: .6;
  }
}
</style>
