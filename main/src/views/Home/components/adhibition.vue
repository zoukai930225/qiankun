<template>
    <div class="home_page_card" style="position: relative;">
        <span class="home_page_title">我的应用</span>
        <span class="home_page_txt">业务系统统一入口！</span>
        <el-radio-group v-model="tabValue" class="tab_check">
            <el-radio-button label="业务应用" value="business" />
            <el-radio-button label="大屏服务" v-if="hasPermissionsJs(bigScreenPermissionList)" value="screen" />
        </el-radio-group>
        <ul class="home-list" v-if="hasPermissionsJs(myAppPermissionList) && tabValue === 'business'">
            <li v-for="(value, index) in myAppList" :key="index" v-hasPermi="[value.permission]" class="home-item-top"
                @click="myAppEnterClick(value)">
                <img class="home-item-top-img" :src="value.imgSrc" alt="" />
                <div class="home-item-top-title">{{ value.name }}
                    <el-icon class="home-item-top-to">
                        <ArrowRightBold />
                    </el-icon>
                </div>
            </li>
        </ul>
        <ul class="home-list" v-if="hasPermissionsJs(bigScreenPermissionList) && tabValue === 'screen'">
            <template v-for="(item, index) in bigScreenList">
                <li v-if="!item.permission || checkPermi([item.permission])" :key="index" @click="myAppEnterClick(item)"
                    class="home-item-top">
                    <img class="home-item-top-img" :src="item.imgSrc" alt="" />
                    <div class="home-item-top-title">{{ item.name }}
                        <el-icon class="home-item-top-to">
                            <ArrowRightBold />
                        </el-icon>
                    </div>
                </li>
            </template>
        </ul>
        <!-- 表单弹窗：添加/修改 -->
        <ImportDataDialog ref="formRef" />
        <!-- 店铺选择 -->
        <StoreRangePlus ref="storeRangeRef" v-model="store" v-model:show-dialog="isShowStoreRangePlus" just-dialog
            @change="onRangeUseSubmit" />
        <!-- 抽奖设置 -->
        <LotterySetting ref="lotterySetRef" />
    </div>
</template>

<script lang="ts">
export default { name: 'HomePageAdhibition' };
</script>

<script lang="ts" setup>
import ImportDataDialog from './importDataDialog.vue'
import LotterySetting from './lotterySetting.vue'
import BIImg from '@/assets/imgs/home/BIImg.png'
import biSystem from '@/assets/imgs/home/biSystem.png' //BI商业智能系统
import evaluation from '@/assets/imgs/home/evaluation.png'
import lottery from '@/assets/imgs/home/lottery.png'
import otrSystem from '@/assets/imgs/home/otrSystem.png' //人才盘点系统
import people from '@/assets/imgs/home/people.png' //人力资源看板
import popularize from '@/assets/imgs/home/popularize.svg' //推广字典对照
import prod from '@/assets/imgs/home/prod.png' //问题商品分析
import StoreImg from '@/assets/imgs/home/StoreImg.png'
import packageGalleryImg from '@/assets/imgs/packageGallery.svg'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { hasPermissionsJs, treeToArray } from '@/utils'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
import { userMessageStore } from '@/store/modules/userMessage'
import { checkPermi } from '@/utils/permission'

const useUserMessageStore = userMessageStore()

const formRef = ref(), { getRouteInfo } = useRouteInfo();

const store = ref(''), lotterySetRef = ref();

const router = useRouter(), storeRangeRef = ref(), isShowStoreRangePlus = ref(false);

const tabValue = ref<string>('business');

enum WorkbenchFunctionType {
    ProblemGoodsAnalysis = 'problemGoodsAnalysis', //问题商品分析
    NewGoodsBoard = 'newGoodsBoard', //新品看板
    LotterySetting = 'lotterySetting',
    MessageData = 'messageData' //消息提醒
}

const myAppList = ref([
    {
        name: '问题商品分析',
        permission: 'workbenches:problemGoodsAnalysis',
        path: '',
        functionType: WorkbenchFunctionType.ProblemGoodsAnalysis,
        imgSrc: prod,
        hover: false
    },
    {
        name: '包装库',
        permission: 'evaluation:index',
        path: '/admin/PRD/assetLibrary/packLibrary',
        functionType: '',
        imgSrc: packageGalleryImg
    },
    {
        name: '人力资源看板',
        permission: 'hrAdmin:resources:dashboard',
        path: '/admin/hrAdmin/resources/dashboard',
        functionType: '',
        imgSrc: people,
        hover: false
    },
    {
        name: 'BI商业智能系统',
        permission: 'biSystem:index',
        path: '/bi/channel/channelView',
        functionType: '',
        imgSrc: biSystem
    },
    {
        name: '人才盘点系统',
        permission: 'otrSystem:index',
        path: '/otr/index',
        functionType: '',
        imgSrc: otrSystem
    },
    {
        name: '推广字典对照',
        permission: 'popularize:index',
        path: '/admin/popularize/index',
        functionType: '',
        imgSrc: popularize,
        hover: false
    },
    {
        name: '飞书发送工具',
        permission: 'feishuSend:index',
        path: '/admin/feishuSend/index',
        functionType: '',
        imgSrc: popularize
    },
    {
        name: '评论分级维护',
        permission: 'evaluation:index',
        path: '/admin/cs/evaluateCategory',
        functionType: '',
        imgSrc: evaluation
    },
    {
        name: '年会抽奖配置',
        permission: 'workbenches:lotterySetting',
        path: '',
        functionType: WorkbenchFunctionType.LotterySetting,
        imgSrc: lottery,
        hover: false
    },
]);

const bigScreenList = ref([
    {
        // 淘宝、天猫、抖音、拼多多数据看板
        name: '全平台数据看板',
        permission: 'bigScreen:store:dataV',
        path: '/bigScreen/index',
        imgSrc: prod,
        hover: false,
        windowOpen: true
    },
    // {
    //   name: '小红书店铺数据看板',
    //   permission: 'bigScreen:xhs:dataV',
    //   path: '/bigScreen/xhs',
    //   imgSrc: biSystem,
    //   hover: false,
    //   windowOpen: true
    // },
    {
        name: '净利完成率排行',
        permission: 'bigScreen:teamPreview:dataV',
        path: '/bigScreen/teamPreview',
        imgSrc: people,
        hover: false,
        windowOpen: true
    },
    {
        name: '售前/后周月度数据',
        permission: 'bigScreen:saleRank:dataV',
        path: '/bigScreen/saleRank',
        imgSrc: popularize,
        hover: false,
        windowOpen: true
    },
    {
        name: '新品商品指标看板',
        permission: 'bigScreen:newGoodsBoard:dataV',
        path: '',
        functionType: WorkbenchFunctionType.NewGoodsBoard,
        imgSrc: otrSystem,
        hover: false,
        windowOpen: true
    },
    {
        name: '新品流程进度看板',
        permission: 'bigScreen:newGoodsProgressBoard:dataV',
        // path: '/bigScreen/newGoodProgressBoard',
        path: '/admin/PRD/new/progressBoard',
        imgSrc: otrSystem,
        hover: false,
        windowOpen: false
    },

    {
        name: '仓储大屏',
        permission: 'bigScreen:warehouseLargeScreen:dataV',
        path: '/bigScreen/warehouseLargeScreen',
        imgSrc: StoreImg,
        hover: false,
        windowOpen: true
    },

    {
        name: '仓储订单大屏',
        permission: 'bigScreen:warehouseOrderScreen:dataV',
        path: '/bigScreen/warehouseOrderScreen',
        imgSrc: StoreImg,
        hover: false,
        windowOpen: true
    },

    {
        name: '仓储智慧大屏',
        permission: '',
        path: '/screen/warehouse',
        imgSrc: StoreImg,
        hover: false,
        windowOpen: true
    },

    {
        name: 'BI数据看板',
        permission: 'bigScreen:BI:dataV',
        path: '/bigScreen/BILargeScreen',
        imgSrc: BIImg,
        hover: false,
        windowOpen: true
    },
    {
        name: '十亿倒计时',
        permission: 'bigScreen:countDown:dataV',
        path: '/bigScreen/countDown',
        imgSrc: BIImg,
        hover: false,
        windowOpen: true
    }
]);

const onRangeUseSubmit = (data) => {
    window.open(`${window.location.origin}/bigScreen/newGoodsBoard?store=${data}`)
};

const myAppPermissionList = computed(() => {
    return myAppList.value.map((item) => item.permission || '')
});

const bigScreenPermissionList = computed(() => {
    return bigScreenList.value.map((item) => item.permission || '')
});

const myAppEnterClick = (item: any) => {
    if (item.path) {
        if (item.windowOpen) {
            window.open(`${window.location.origin}${item.path}`)
            return
        }
        if (item.path === `/bi/channel/channelView`) {
            const { wsCache } = useCache()
            const menu: any = (wsCache.get(CACHE_KEY.USER)?.menus || []).find((ms: any) => ms?.name === 'BI系统');
            if (menu?.children?.length) {
                const list: any = treeToArray([{ ...menu }]).filter((ms: any) => ms.name !== 'BI系统' && ms.type === 2);
                if (list?.length) {
                    window.location.replace(`${window.location.origin}/bi${getRouteInfo(list[0].componentName)}`);
                } else {
                    window.location.replace(`${window.location.origin}${item.path}`)
                }
            } else {
                window.location.replace(`${window.location.origin}${item.path}`)
            }
            return
        }
        router.push({ path: item.path })
    } else {
        if (item.functionType === WorkbenchFunctionType.ProblemGoodsAnalysis) {
            // 问题商品分析
            formRef.value.open()
        } else if (item.functionType === WorkbenchFunctionType.NewGoodsBoard) {
            // 新品商品看板
            if (storeRangeRef.value) {
                isShowStoreRangePlus.value = true
            }
        } else if (item.functionType === WorkbenchFunctionType.LotterySetting) {
            lotterySetRef.value.open()
        } else if (item.functionType === WorkbenchFunctionType.MessageData) {
            useUserMessageStore.openVisible()
            useUserMessageStore.updateTabActiveName(item.messageType === 1 ? 'wait' : 'done')
        }
    }
}


</script>

<style lang="scss" scoped>
@use '../style.scss';

.tab_check {
    position: absolute;
    top: 24px;
    right: 20px
}

.home-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0;

    .home-item-top {
        width: calc(18% - 14.1px);
        margin: 16px 8px 0 8px;
        display: inline-flex;
        padding: 10px;
        list-style: none;
        height: 34px;
        border-radius: 6px;
        background-color: #fff;
        cursor: pointer;
        border: 1px solid #E5E5E5;

        &:hover {
            border: 1px solid #92ACF9;

            .home-item-top-to {
                color: #0064FF;
            }
        }

        &-img {
            width: 34px;
            height: 34px;
        }

        &-title {
            display: inline-block;
            width: calc(100% - 34px);
            height: 32px;
            line-height: 32px;
            vertical-align: top;
            margin-left: 10px;
            position: relative;

            .home-item-top-to {
                position: absolute;
                right: 0;
                top: 10px;
                color: #666;
            }
        }
    }
}
</style>
