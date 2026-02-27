<template>
  <ex-screen v-loading="loading" ref="screenRef">
    <section>
      <section-title-header>
        <span style="color: #3D3D3D;">仪表盘</span>
        <template #right>
          <div class="max-w-100% overflow-hidden">
            <time-filter v-model="dateRange" :layout="layout" :swift-options="timeSwiftOptions"
              :map-options="mapOptions" :default-value="defaultOption" :default-date="defaultRange" :is-tooltip="false"
              :is-show-time="true" show-str="统计时间" @change="initValue" :show-arrow="false" />
          </div>
        </template>
      </section-title-header>
      <el-divider style="margin: 16px 0;" />
      <qc-board-panel :info="dataValue" @pageTo="pageTo" />
    </section>
    <section class="mt-20px">
      <section-title-header>
        <span style="color: #3D3D3D;">数据汇总</span>
      </section-title-header>
      <div class="mt-15px list_card">
        <el-tabs v-model="activeTabs">
          <el-tab-pane label="工作内容" name="0" />
          <el-tab-pane label="核心工作进度" name="1" />
        </el-tabs>
        <qc-board-content v-show="activeTabs === '0'" ref="contentRef" :info="dataValue" :suppliers="supplierList"
          :role="getRole('QC权限')" :style="{ height: `${cardHeight}px` }" :height="cardHeight"
          @onSearch="(data: any) => onContentSearch(data, 'content')" />
        <qc-board-progress v-show="activeTabs === '1'" ref="progressRef" :info="dataValue" :suppliers="supplierList"
          :role="getRole('QC权限')" :style="{ height: `${cardHeight}px` }" :height="cardHeight"
          @onSearch="(data: any) => onContentSearch(data, 'progress')" />
      </div>
    </section>
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'QcBoard' }
</script>

<script lang="tsx" setup>
import { useRole } from "@/hooks/common/useRole";
import TimeFilter from '~/time/timeFilter.vue';
import QcBoardProgress from "./progress.vue";
import QcBoardContent from "./content.vue";
import QcBoardPanel from "./panel.vue";
import request from '@/config/axios';
import dayjs from 'dayjs';
import router from "@/router";
import { debounce } from "lodash-es";

class DataItem {
  num: Object = {};
  content: Array<any> = [];
  progress: Array<any> = [];
};

const { getPermissionInfo, getRole } = useRole('供应链');

const loading = ref<boolean>(false), layout = '自定义', dataValue = ref<DataItem>({ ...new DataItem() });

const today = dayjs().format('YYYY-MM-DD'), screenRef = ref(), supplierList = ref<any>([]), activeTabs = ref<string>('0'),yesterday = dayjs().subtract(1, 'd').format('YYYY-MM-DD');

const dateRange = ref<Array<string>>([yesterday, yesterday]), contentRef = ref(), progressRef = ref();

const defaultRange = ref<Array<string>>([yesterday, yesterday]);

const defaultOption = '自定义';

const timeSwiftOptions = [{
  label: '7天', tips: '最近7天数据', isComponents: false,
  timeOffset: { type: 'day', mode: 'subtract', offset: 6 },
  params: { preset: 'last7Days' }
}];

const cardHeight = computed(() => (screenRef?.value?.height || 500) - 346);

const mapOptions = computed(() => [
  {
    label: '自定义', disabledDate: (time: any, calendarValue: any) => {
      let success: boolean = false;
      if (!!calendarValue?.length) {
        const max: any = new Date(calendarValue[0]).getTime() + 30 * 86400000;
        const min: any = new Date(calendarValue[0]).getTime() - 30 * 86400000;
        const cur: any = new Date(time).getTime();
        success = cur > max || cur < min;
      }
      return success;
    }
  },
]);

const getSelectOptions = () => {
  request.post({ url: `/api/qcDailyReportInfo/selectSupplierList` }).then((res: any) => {
    if (res && res.length) {
      supplierList.value = res.map((sup: any) => ({
        label: sup.abbreviationCompany,
        value: sup.id,
        fullName: sup.fullCompany
      }))
    }
  });
};

const getDashboardStatistics = async (params: any) => {
  const res: any = await request.get({ url: `/api/qcDailyReportInfo/getDashboardStatistics`, params });
  dataValue.value.num = res || {};
};

const getContentList = async (params: any) => {
  const res: any = await request.post({ url: `/api/qcDailyReportInfo/getWorkContentList`, data: { ...params } });
  dataValue.value.content = res || [];

};

const getProgressList = async (params: any) => {
  const res: any = await request.post({ url: `/api/qcDailyReportInfo/getCoreWorkProgressList`, data: { ...params } });
  dataValue.value.progress = res || [];
};

const onContentSearch = debounce(async (data: any, type: string) => {
  loading.value = true;
  const params: any = {
    recordPeriodStart: dateRange.value[0], recordPeriodEnd: dateRange.value[1],
    supplier: data?.supplier?.length ? data.supplier.join(',') : '',
    fillPerson: data?.fillPerson?.length ? data.fillPerson.join(',') : ''
  };
  if (type === 'content') {
    await getContentList(params);
  } else {
    await getProgressList(params);
  }
  loading.value = false;
}, 1000);

const initValue = async () => {
  activeTabs.value = '0';
  contentRef?.value?.reset();
  progressRef?.value?.reset();
  loading.value = true;
  const params: any = { recordPeriodStart: dateRange.value[0], recordPeriodEnd: dateRange.value[1] };
  await getDashboardStatistics(params);
  await getContentList(params);
  await getProgressList(params);
  loading.value = false;
};

const pageTo = () => {
  router.push({ name: 'qcDailyReport', query: { dateRange: dateRange.value } })
};

onMounted(() => {
  getPermissionInfo(() => {
    getSelectOptions();
    initValue();
  });
});

</script>
<style lang="scss" scoped>
@use './styles.scss';

:deep() {
  .el-tabs__header {
    margin-bottom: 0px !important;
  }
}
</style>