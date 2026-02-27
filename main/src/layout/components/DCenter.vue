<template>
    <div class="user-message" @click="open"
        :class="[{ 'user-message-max': page.total > 99, 'user-message-offset': page.total > 0 && page.total <= 99 }]">
        <el-badge :value="page.total" :max="99" class="item" :show-zero="false" color="#EB3737" :offset="[3, 2]">
            <img style="width: 18px; height: 18px" :src="file" fit="fill" />
        </el-badge>
        <div class="tips">下载中心</div>
        <SWDrawer v-model="visible" title="下载中心" @close="colse">
            <div class="content">
                <div class="btn-box">
                    <el-button type="primary" @click="getDataList">
                        刷新
                    </el-button>
                </div>
                <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="files"
                    :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable"
                    v-horizontal-scroll="'always'" border stripe>
                    <el-table-column label="文件名" prop="fileName" min-width="250"
                        :formatter="(row: any) => formatterValue(row, 'fileName', '-')" />
                    <el-table-column label="生成时间" prop="createdAt" min-width="180"
                        :formatter="(row: any) => formatTime(row.createdAt, 'yyyy-MM-dd HH:mm:ss')" />
                    <el-table-column label="状态" prop="status" min-width="150">
                        <template v-slot="{ row }">
                            <div class="row-center">
                                <el-tooltip :content="row.remark"
                                    :disabled="[1, 2].includes(Number(row.status)) || !row.remark"
                                    popper-style="max-width:300px;word-break:break-all">
                                    <div class="status-tag" :class="'status-tag-' + row.status">{{ Number(row.status)
                                        === 1 ?
                                        '生成中' : Number(row.status) === 2 ? '已生成' : '生成失败' }}
                                    </div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template #default="{ row }">
                            <el-button link type="primary" @click="handleDownload(row)" v-if="Number(row.status) === 2"
                                :loading="row.loading">下载</el-button>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <template #empty>
                        <div class="flex-column" style="align-items: center;">
                            <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt=""
                                object-fit="contain" />
                            <span>暂无数据</span>
                        </div>
                    </template>
                </el-table>
                <div class="pagination-wrapper">
                    <Pagination :total="page.total" v-model:page="page.page" v-model:limit="page.size"
                        @pagination="getDataList" />
                </div>
            </div>
            <template #footer>
                <el-button @click="colse" class="mr20px">关闭</el-button>
            </template>
        </SWDrawer>
    </div>
</template>

<script lang="ts" setup>
import { formatterValue, formatTime } from "@/utils";
import { downloadByUrl2 } from "@/utils/download";
import { useAppStore } from '@/store/modules/app';
import file from '@/assets/imgs/home/file.svg';
import { cloneDeep } from 'lodash-es';
import request from '@/config/axios';
import { debounce } from "lodash-es";

const appStore = useAppStore();

let timer: any = 0;

const visible = ref<boolean>(false), loading = ref<boolean>(false);

const files = ref<Array<any>>([]), page = ref<any>({ page: 1, size: 10, total: 0 });

const open = () => {
    visible.value = true;
    getDataList();
    timer && clearInterval(timer);
    timer = setInterval(() => { getDataList() }, 10000);
};

const getDataList = () => {
    loading.value = true;
    const params: any = cloneDeep({ ...page.value });
    delete params.total;
    request.get({ url: `/api/sysExportRecord/page`, params }).then((res: any) => {
        page.value.total = res?.total || 0;
        files.value = res?.records || [];
    }).finally(() => loading.value = false);
};

const colse = () => {
    visible.value = false;
    timer && clearInterval(timer);
};

const handleDownload = debounce(async (row: any) => {
    try {
        row.loading = true
        await downloadByUrl2(row.url, row.fileName)
    } catch (e) { } finally {
        row.loading = false
    }
}, 1000)

onUnmounted(() => {
    timer && clearTimeout(timer);
});

</script>

<style lang="scss" scoped>
.user-message {
    font-family: PingFang SC;
    font-size: 13px;
    height: 49px;
    color: #666666;
    text-align: center;

    &:hover {
        img {
            /* 将单色图标滤成接近 #0064FF 的蓝色 */
            filter: invert(26%) sepia(97%) saturate(4152%) hue-rotate(214deg) brightness(100%) contrast(101%);
        }
    }


    .item {
        margin: 0 auto;
        margin-top: 5px;
        height: 20px;
        line-height: 20px;
    }

    .tips {
        height: 20px;
        line-height: 20px;
        display: inline-block;

    }
}

.content {
    background-color: #fff;
    width: 100%;
    height: calc(100vh - 152px);
    border-radius: 20px;
    padding: 20px;
}

.btn-box {
    margin-bottom: 15px;
    float: right;
}

.status-tag {
    display: flex;
    height: 28px;
    border-radius: 100px;
    padding: 0 16px;
    font-size: 14px;
    justify-content: center;
    align-items: center;

    &-1 {
        background-color: rgba(0, 100, 255, 0.2);
        color: #0064FF;
    }

    &-2 {
        background-color: rgba(52, 155, 52, 0.2);
        color: #349B34;
    }

    &-3 {
        background-color: #E5E5E5;
        color: #666666;
    }

}
</style>