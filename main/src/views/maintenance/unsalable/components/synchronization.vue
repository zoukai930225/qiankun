<template>
  <el-badge :value="length" :hidden="!length" :offset="[-12, 0]" color="#EB3737">
    <el-button @click="btnClick()">待同步商品</el-button>
  </el-badge>
</template>

<script lang="ts">
export default { name: 'Synchronization' };
</script>

<script lang="ts" setup>
import { useRouteInfo } from "@/hooks/common/useRouteInfo";
import request from '@/config/axios';
import router from "@/router";

const { getRouteInfo } = useRouteInfo();

const length = ref<number>(0);

let timer: any = null;

const query: any = computed(() => router.currentRoute.value.query);

const btnClick = () => {
  router.push({ path: getRouteInfo('Synchronized') });
};


const getDataInfo = () => {
  request.get({ url: `/api/opUnsalableGoods/getNotSyncGoods` }).then((res: any) => {
    length.value = res.reduce((cur: any, item: any) => cur += (item?.count || 0), 0);
  });
};

const timerSet = () => {
  !!timer && (clearInterval(timer), timer = null);
  timer = setInterval(() => getDataInfo(), 10000)
};

onBeforeUnmount(() => {
  !!timer && (clearInterval(timer), timer = null);
});

watch(() => query.value, () => {
  if (query.value.operate === 'reLoad') {
    getDataInfo();
  }
}, { deep: true });

onMounted(() => {
  getDataInfo();
  // timerSet();
});

</script>

<style lang="scss" scoped></style>
