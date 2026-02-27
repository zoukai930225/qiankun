<template>
    <div class="home_page_card" style="position: relative;">
        <span class="home_page_title">快捷功能</span>
        <span class="home_page_txt">自由编辑常用菜单，一键进入工作状态！</span>
        <el-button class="check_mode" type="primary" link @click="open">
            <img :src="management" class="svg-icon" alt="" /> 管理 </el-button>
        <div class="menus">
            <draggable v-if="!!menus?.length" v-model="menus" :group="{ name: 'menus', pull: true, put: true }"
                item-key="id" class="right_item_list" @change="submit(menus)">
                <template #item="{ element: ms }">
                    <div class="right_item_list_menus" @click="link(ms)">
                        <div class="right_item_list_menus_img">
                            <img :src="ms.icon || ms.menuIcon || menu" alt="" />
                        </div>
                        <span class="right_item_list_menus_txt">{{ ms.name || ms.menuName }}</span>
                    </div>
                </template>
            </draggable>
            <img v-else src="@/assets/svgs/home/empty.svg" alt="" class="empty">
        </div>
        <el-dialog v-model="visible" :show-close="false" :width="'860px'" append-to-body align-center
            :before-close="handleBeforeClose" @closed="closed" destroy-on-close>
            <template #header="{ close }">
                <slot name="header" :close="close" title="管理">
                    <div class="header_txt">管理</div>
                    <el-icon @click="close" class="header_close">
                        <CloseBold />
                    </el-icon>
                </slot>
            </template>
            <div class="body_list">
                <div class="left">
                    <el-select v-model="selectValue" :clearable="false" style="width: 360px;">
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <div class="scroll-container">
                        <draggable :list="leftMenus" :group="{ name: 'menus', pull: 'clone', put: false }" :sort="false"
                            item-key="id" :class="['left_item_list', !leftMenus?.length ? 'empty-left' : '']">
                            <template #item="{ element: ms }">
                                <div class="left_item_list_menus">
                                    <el-icon class="add_icon" color="var(--el-color-primary)" size="20"
                                        @click="addItem(ms)">
                                        <CirclePlusFilled />
                                    </el-icon>
                                    <div class="left_item_list_menus_img">
                                        <img :src="ms.icon || menu" alt="" />
                                    </div>
                                    <span class="left_item_list_menus_txt">{{ ms.name }}</span>
                                </div>
                            </template>
                        </draggable>
                    </div>
                </div>
                <div class="right">
                    <logo-label txt="已收藏" :isEdit="false" />
                    <div class="scroll-container">
                        <draggable v-model="dataValue" :group="{ name: 'menus', pull: true, put: true }" item-key="id"
                            :class="['right_item_list', !dataValue?.length ? 'empty-right' : '']" @item-add="itemAdd">
                            <template #item="{ element: ms }">
                                <div class="right_item_list_menus">
                                    <el-icon class="del_icon" color="#EB3737" size="20" @click="delItem(ms)">
                                        <CircleCloseFilled />
                                    </el-icon>
                                    <div class="right_item_list_menus_img">
                                        <img :src="ms.icon || ms.menuIcon || menu" alt="" />
                                    </div>
                                    <span class="right_item_list_menus_txt">{{ ms.name || ms.menuName }}</span>
                                </div>
                            </template>
                        </draggable>
                    </div>
                </div>
            </div>
            <div style="width: 100%;text-align: right;">
                <el-button type="primary" @click="submit(dataValue, () => initData())">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
export default { name: 'HomePageQuick' };
</script>

<script lang="ts" setup>
import LogoLabel from '@/components/common/label/logoLabel.vue';
import management from "@/assets/svgs/home/management.svg";
import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
import menu from "@/assets/svgs/home/menu.svg";
import draggable from 'vuedraggable';
import request from '@/config/axios';
import { treeToArray } from '@/utils';
import router from '@/router';

const { wsCache } = useCache(), message = useMessage(), { getRouteInfos } = useRouteInfo();

const visible = ref<boolean>(false), selectValue = ref<any>(), leftMenus = ref<any[]>([]), dataValue = ref<any>([]), menus = ref<any>([]);

const options = computed(() => (wsCache.get(CACHE_KEY.USER)?.menus || []).filter((ms: any) => !['/workbench', '/admin/popularize', '/admin/bigScreen', '/', '/admin/h5Board', '/otr'].includes(ms.path)));

const getMenu = (id: any, collectedIds: any[] = []) => {
    const item: any = options.value.find((ops: any) => ops.id === id);
    return item?.children?.length
        ? treeToArray(item.children).filter((cs: any) => cs.type === 2 && !!cs?.visible && !collectedIds.includes(cs.id))
        : [];
};

watch([selectValue, dataValue], ([newSelect, newCollected]) => {
    const collectedIds = newCollected.map((item: any) => item.id);
    leftMenus.value = getMenu(newSelect, collectedIds);
}, { immediate: true });

const initData = async (type: number = 0) => {
    const res: any = await request.get({ url: `/api/userFavoriteMenu/list` });
    if (type) {
        dataValue.value = (res?.length ? res : []).map((ms: any) => ({ ...ms, id: ms.menuId }));
    } else {
        menus.value = (res?.length ? res : []).map((ms: any) => ({ ...ms, id: ms.menuId }));
    }
};

const open = async () => {
    selectValue.value = options.value?.length ? options.value[0].id : '';
    getMenu(selectValue.value);
    await initData(1);
    visible.value = true;
};

const itemAdd = (e: any) => {
    const addedItem = e.added.element;
    dataValue.value.push(addedItem);
};

const addItem = (ms: any) => {
    const index: number = leftMenus.value.findIndex((ls: any) => ls.id === ms.id);
    leftMenus.value.splice(index, 1);
    dataValue.value.push(ms);
};

const link = (ms: any) => {
    if (getRouteInfos(ms.menuId, 'id')) {
        router.push({ path: getRouteInfos(ms.menuId, 'id') })
    } else {
        message.warning('菜单跳转异常,请联系管理员修正！');
    }
};

const delItem = (ms: any) => {
    dataValue.value = dataValue.value.filter((ds: any) => ds.id !== ms.id);
};

const closed = () => {
    visible.value = false
};

const handleBeforeClose = (done) => {
    done();
};

const submit = (list: Array<any>, fun: Function = () => { }) => {
    request.post({ url: `/api/userFavoriteMenu/save`, data: { menuList: list.map((ds: any) => ({ ...ds, menuId: ds.id })) } }).then(() => {
        message.success('操作成功');
        visible.value = false;
    }).finally(() => fun())
};

onMounted(() => {
    initData();
});

</script>

<style lang="scss" scoped>
@use '../style.scss';

.check_mode {
    position: absolute;
    right: 20px;
    top: 16px;
}

.menus {
    height: 460px;
    margin-top: 20px;
    overflow-y: auto;

    .empty {
        width: 300px;
        height: 280px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .right_item_list {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;

        &_menus {
            cursor: grab;
            margin: 0px 16px 20px 16px;

            &_txt {
                color: #242527;
                font-weight: 400;
                font-size: 14px;
                margin-top: 10px;
                white-space: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                word-wrap: break-word;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                width: 60px;
                display: block;
            }

            &_img {
                width: 32px;
                height: 32px;
                padding: 14px;
                background: #EBF0FF;
                border-radius: 8px;

                img {
                    width: 32px;
                    height: 32px;
                }
            }

        }
    }
}



.empty-left::before {
    content: url('@/assets/svgs/home/empty.svg');
    width: 300px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-110%, -50%);
}

.empty-right::before {
    content: url('@/assets/svgs/home/empty.svg');
    width: 300px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(25%, -50%);
}

.body_list {
    display: flex;
    height: 460px;

    .scroll-container {
        height: 400px;
        overflow-y: auto;
    }


    .left {
        padding: 20px 0 0 20px;
        display: inline-block;
        width: 468px;
        border-right: 1px solid #f0f0f0;

        .left_item_list {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;

            &_menus {
                position: relative;
                cursor: grab;
                outline: none;
                border: none;
                margin: 10px 16px 0 0;

                &_txt {
                    color: #242527;
                    font-weight: 400;
                    font-size: 14px;
                    margin-top: 10px;
                    white-space: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-wrap: break-word;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    width: 60px;
                    display: block;
                }

                &_img {
                    width: 32px;
                    height: 32px;
                    padding: 14px;
                    background: #EBF0FF;
                    border-radius: 8px;

                    img {
                        width: 32px;
                        height: 32px;
                    }
                }

            }
        }
    }

    .right {
        padding: 20px 0 0 20px;
        display: inline-block;
        width: 468px;

        .right_item_list {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;

            &_menus {
                position: relative;
                margin: 10px 16px 0 0;

                &_txt {
                    color: #242527;
                    font-weight: 400;
                    font-size: 14px;
                    margin-top: 10px;
                    white-space: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-wrap: break-word;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    width: 60px;
                    display: block;
                }

                &_img {
                    width: 32px;
                    height: 32px;
                    padding: 14px;
                    background: #EBF0FF;
                    border-radius: 8px;

                    img {
                        width: 32px;
                        height: 32px;
                    }
                }

            }
        }
    }
}

.header_txt {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

.header_close {
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 16px;
}

:deep() {
    .el-dialog {
        padding: 0;
    }

    .el-dialog__header {
        margin: 0px;
        position: relative;
        padding: 12px 20px;
        border-bottom: 1px solid #f0f0f0;
    }

    .el-dialog__body {
        padding: 15px !important;

        .el-form {
            .el-select {
                .el-select__wrapper.is-disabled {
                    .el-select__suffix {
                        display: none;
                    }
                }
            }
        }
    }
}

.del_icon {
    position: absolute;
    right: -8px;
    top: -8px;
    cursor: pointer;
}

.add_icon {
    position: absolute;
    right: -8px;
    top: -8px;
    cursor: pointer;
}
</style>
