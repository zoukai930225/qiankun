<template>
    <div class="versions-message" @click="linkPage">
        <div class="border"> {{ version }}</div>
        <div class="tips">系统版本</div>
    </div>
</template>

<script lang="ts" setup>
import { useRouteInfo } from '@/hooks/common/useRouteInfo';
import { useUserStore } from '@/store/modules/user';
import request from '@/config/axios';
import router from '@/router';

const { getRouteInfo } = useRouteInfo();

const userStore = useUserStore();

const list = computed(() => userStore.getVersion);

const version = computed(() => list?.value?.length ? list.value[0]?.version : '1.0.0');

const initValue = () => {
    request.get({ url: `/api/sysVersionUpdate/list`, params: { page: 1, size: 20 } }).then((res: any) => {
        userStore.setVersion(res?.records || []);
    });
};

onMounted(() => initValue());

const linkPage = () => {
    router.push({ path: getRouteInfo('EditionDetailsTab') });
};
</script>

<style lang="scss" scoped>
.versions-message {
    font-family: PingFang SC;
    font-size: 13px;
    height: 49px;
    color: #666666;

    .border {
        margin-top: 5px;
        height: 20px;
        line-height: 20px;
        padding: 0 8px;
        display: inline-block;
        border-radius: 4px;
        border: 1px solid #E5E5E5;
        background: #F1F3F7;
    }

    .tips {
        height: 20px;
        line-height: 20px;
        display: inline-block;
        text-align: center;
    }
}
</style>