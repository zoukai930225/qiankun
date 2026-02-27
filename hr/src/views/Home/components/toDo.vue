<template>
    <div class="home_page_card" style="position: relative;">
        <span class="home_page_title">待办中心
            <span style="color:#EB3737;margin-left: 2px;">({{ numFormatt(maxNum || 0) }})</span>
            <el-icon class="refresh" @click="refresh" :style="{ transform: `rotate(${rotateDeg}deg)` }">
                <Refresh />
            </el-icon>
        </span>
        <span class="home_page_txt">快速查阅我的待办！</span>
        <el-select class="check_mode" v-model="typeValue" placeholder="点击切换待办类型" style="width: 200px">
            <el-option v-for="item in [{ todoTypeName: '全部', todoTypeCode: 'all', todoCount: maxNum }, ...options]"
                :key="item.todoTypeCode" :label="item.todoTypeName" :value="item.todoTypeCode"
                style="position: relative;">
                <!-- <span style="float: left">{{ item.todoTypeName }}</span>
                <span class="nums">
                    {{ numFormatt(item.todoCount || 0) }}
                </span> -->
            </el-option>
        </el-select>
        <div class="scroll-container">
            <div v-if="listInfo.length">
                <div v-for="li in listInfo" :key="li.todoTypeCode" class="scroll-container-card">
                    <div class="title">
                        <div class="name">{{ li.todoTypeName }}</div>
                        <div class="num-line">{{ numFormatt(li.todoCount || 0) }}</div>
                    </div>
                    <div v-for="(rs, index) in (li?.todoMattersVOList || [])">
                        <div :class="['step_desc', !index ? 'step_desc_top' : '']" @click="open(rs)">
                            <img :src="rs?.icon || todo" alt="" class="step_desc_icon">
                            <div class="step_desc_body">
                                <div class="step_desc_body_title">{{ rs.todoMatterName }}</div>
                                <div class="step_desc_body_num">待办数量 <span class="step_desc_body_num_icon">{{
                                    numFormatt(rs?.todoCount || 0) }}</span>
                                </div>
                            </div>
                            <el-button type="primary" link> 查看 </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <img v-else src="@/assets/svgs/home/clear.svg" alt="" class="empty">
        </div>
    </div>
</template>

<script lang="ts">
export default { name: 'HomePageToDo' };
</script>

<script lang="ts" setup>
import { useRouteInfo } from '@/hooks/common/useRouteInfo';
import todo from "@/assets/svgs/home/todo.svg";
import request from '@/config/axios';
import router from '@/router';

let timer: any = null;

const rotateDeg = ref<number>(0);

const typeValue = ref<any>('all'), options = ref<Array<any>>([]), message = useMessage(), { getRouteInfos } = useRouteInfo();

const listInfo = computed(() => typeValue.value === 'all' ? options.value : options.value.filter((ops: any) => ops.todoTypeCode === typeValue.value));

const maxNum = computed(() => options.value.reduce((max: any, item: any) => max + (item.todoCount || 0), 0));

const numFormatt = (num: any) => num > 99 ? '99+' : num;

const initData = async () => {
    const res: any = await request.get({ url: `/api/todo/list` });
    options.value = res?.length ? res : [];
};

const open = (item: any) => {
    if (getRouteInfos(item.jumpResourcesMenuId, 'id')) {
        router.push({ path: getRouteInfos(item.jumpResourcesMenuId, 'id'), query: item.link });
    } else {
        message.warning('菜单跳转异常,请联系管理员修正！');
    }
};

const refresh = () => {
    rotateDeg.value += 360;
    initData();
    timer && clearInterval(timer);
    timer = setInterval(() => {
        initData();
    }, 60000);
};

onMounted(() => refresh());

onUnmounted(() => {
    timer && clearInterval(timer);
})

</script>

<style lang="scss" scoped>
@use '../style.scss';

.check_mode {
    position: absolute;
    right: 20px;
    top: 24px;
}

.nums {
    display: inline-block;
    height: 18px;
    margin: 8px 0;
    line-height: 18px;
    padding: 1px 6px;
    border-radius: 8px;
    position: absolute;
    right: 10px;
    background-color: #EB3737;
    color: #fff;
}

.scroll-container {
    margin-top: 20px;
    height: 460px;
    overflow-y: auto;
    position: relative;

    .empty {
        width: 300px;
        height: 280px;
        position: absolute;
        top: 198px;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &-card {
        border: 1px solid #EBEEF5;
        background: #FDFDFF;
        padding: 16px 16px 0 16px;
        border-radius: 6px;
        margin-bottom: 20px;

        .title {
            font-family: PingFang SC;
            margin-bottom: 10px;

            .name {
                display: inline-block;
                color: #333333;
                font-size: 16px;
                font-weight: 500;
            }

            .num-line {
                text-align: center;
                font-size: 13px;
                padding: 2px 8px;
                font-weight: 500;
                display: inline-block;
                border-radius: 20px;
                margin-left: 10px;
                color: #EB3737;
                background: rgba(235, 55, 55, 0.1);
            }
        }
    }
}

.refresh {
    cursor: pointer;
    position: absolute;
    margin: 2px 8px;
    transition: transform 0.5s;
}

.point {
    display: inline-block;
    background: #B2C6FD;
    width: 15px;
    height: 15px;
    border-radius: 50%;
}



.custom-steps {
    :deep() {
        .el-step__line {
            background-color: #E5E5E5 !important;
        }

        .el-step {
            position: relative;

            .el-step__head {
                position: absolute;
                top: 35px;

                .el-step__line {
                    height: 80px;
                }
            }

            .el-step__main {
                margin-left: 25px;
            }
        }
    }
}

.step_desc_top {
    border-top: none !important;
}

.step_desc {
    width: 100%;
    height: 66px;
    display: flex;
    border-top: 1px solid #E5E5E5;
    cursor: pointer;

    // &:hover {
    //     background: #F8F8F9;
    // }

    &_icon {
        width: 34px;
        height: 34px;
        border-radius: 8px;
        margin: 16px 14px 16px 0;
    }

    &_body {
        width: calc(100% - 80px);
        margin: 14px 0;

        &_title {
            display: block;
            width: 100%;
            color: #333333;
            font-size: 14px;
            font-weight: 500;
            font-family: PingFang SC;
            margin-bottom: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &_num {
            color: #666666;
            font-size: 14px;
            font-weight: normal;

            &_icon {
                text-align: center;
                display: inline-block;
                font-size: 13px;
                padding: 2px 8px;
                font-weight: 500;
                margin-left: 8px;
                background: #eb37371a;
                border-radius: 20px;
                color: #EB3737;
            }
        }
    }
}
</style>
