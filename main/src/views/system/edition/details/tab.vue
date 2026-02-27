<template>
    <div>
        <h2 class="title">更新日志</h2>
        <div style="display: flex;margin-top: 16px;">
            <el-scrollbar class="list" :height="height" always>
                <p v-for="item in list" :key="item.id" @click="open(item)"
                    :class="['list_item', selectValue.id === item.id ? 'isActive' : '']">{{ item.version }}
                </p>
            </el-scrollbar>
            <el-card class="card" shadow="never" v-loading="loading">
                <el-scrollbar :height="height - 8" always class="edition-scrollbar">
                    <span class="card_title">{{ selectValue.version }}</span>
                    <span class="card_time">{{ selectValue.releaseDate }}</span>
                    <div v-for="info in selectValue.modules">
                        <span class="card_name">{{ info.sortOrder }}.{{ info?.moduleName || '' }}</span>
                        <div v-for="value in info.updateContents" v-html="value" class="card_content" />
                    </div>
                    <el-backtop :right="45" :bottom="40" :target="`.edition-scrollbar .el-scrollbar__wrap`" />
                </el-scrollbar>
            </el-card>
        </div>

    </div>
</template>

<script lang="tsx">
export default { name: 'EditionDetailsTab' };
</script>

<script lang="tsx" setup>
import { DataItem } from "../page/config";
import request from '@/config/axios';

const selectValue = ref<any>({}), loading = ref<boolean>(false), list = ref<any>([]);

const height = computed(() => window.innerHeight - 175);

const getContent = (txt: any) => {
    return txt ? txt.split('\n') : [];
};

const getDetails = (id: string) => {
    loading.value = true;
    request.get({ url: `/api/sysVersionUpdate/get/${id}` }).then((res: any) => {
        selectValue.value = {
            ...new DataItem(), ...res, modules: res.modules.map((ms: any) => ({
                ...ms, updateContents: getContent(ms.updateContent)
            }))
        };
    }).finally(() => loading.value = false);
};

const open = (item: any) => {
    item.id !== selectValue.value.id && getDetails(item.id);
};

const initData = () => {
    request.get({ url: `/api/sysVersionUpdate/list`, params: { page: 1, size: 100 } }).then((res: any) => {
        list.value = res.records?.length ? [...res.records] : [];
        if (!!list.value?.length) {
            const index: number = list.value.findIndex((li: any) => li.id === selectValue.value.id);
            index === -1 && getDetails(list.value[0].id);
        }
    });
};

onMounted(() => {
    selectValue.value = {};
    initData();
});

onActivated(() => initData());

</script>
<style lang="scss" scoped>
.title {
    font-family: PingFang SC;
    color: #333;
    font-size: 18px;
    font-weight: 500;
}

.list {
    background: #fff;
    border-radius: 10px;
    border: 1px solid #E5E5E5;
    width: 158px;
    margin-right: 20px;
    padding: 16px 20px;

    &_item {
        border-radius: 10px;
        cursor: pointer;
        padding: 12px 16px;
    }

    .isActive {
        background: rgba(0, 100, 255, 0.1);
        color: var(--el-color-primary);

    }
}

.card {
    width: calc(100% - 220px);
    margin: 0;
    border-radius: 10px;
    position: relative;

    &_time {
        position: absolute;
        right: 20px;
        top: 3px;
        color: #666;
        font-family: PingFang SC;
        font-size: 16px;
    }

    &_title {
        display: inline-block;
        padding: 4px 16px;
        color: var(--el-color-primary);
        border-radius: 158px;
        padding: 4px 16px;
        background: rgba(0, 100, 255, 0.1);
        margin-bottom: 24px;
    }

    &_name {
        display: inline-block;
        font-family: PingFang SC;
        margin-bottom: 20px;
        font-size: 16px;
        font-weight: 500;
        color: #333;
    }

    &_content {
        color: #666;
        font-family: PingFang SC;
        font-size: 16px;
        margin-bottom: 20px;
    }
}
</style>
