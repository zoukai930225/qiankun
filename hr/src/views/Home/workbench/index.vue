<template>
  <div>
    <div class="home-title">亲爱的，{{ realName }}</div>
    <!-- 背景图 -->
    <div class="home-bg">
      <img :src="workBenchImg ? workBenchImg : default_bg" alt="" />
      <div class="home-bg-text">
        <div> {{ firstLine }} </div>
        <div>{{ secondLine }}</div>
      </div>
    </div>
    <div class="home-title">我的事项</div>

    <ul class="home-list">
      <li v-for="(value, index) in messageList" :key="index" @mouseenter="handleMouseOver(index, 'message')"
        @mouseleave="handleMouseOut(index, 'message')" @click="myAppEnterClick(value)">
        <div class="home-item-top">
          <div class="message-tag" v-if="value.messageType === 1 && useUserMessageStore.getCount > 0">{{
            useUserMessageStore.getCount > 99 ? '99 +' : useUserMessageStore.getCount }}</div>
          <img :src="value.imgSrc" alt="" />
          <div class="home-item-top-title">{{ value.name }}</div>
        </div>
        <div class="home-item-bottom">
          <div class="home-item-bottom-title">进入</div>
        </div>
        <div v-if="value.hover" class="home-item-bottomHover">
          <div class="home-item-bottomHover-title">进入</div>
          <img src="@/assets/imgs/home/arrow.svg" alt="" />
        </div>
      </li>
    </ul>
    <div class="home-title">我的应用</div>

    <ul class="home-list" v-if="hasPermissionsJs(myAppPermissionList)">
      <li v-for="(value, index) in myAppList" :key="index" v-hasPermi="[value.permission]"
        @mouseenter="handleMouseOver(index, 'myApp')" @mouseleave="handleMouseOut(index, 'myApp')"
        @click="myAppEnterClick(value)">
        <div class="home-item-top">
          <img :src="value.imgSrc" alt="" />
          <div class="home-item-top-title">{{ value.name }}</div>
        </div>
        <div class="home-item-bottom">
          <div class="home-item-bottom-title">进入</div>
        </div>
        <div v-if="value.hover" class="home-item-bottomHover">
          <div class="home-item-bottomHover-title">进入</div>
          <img src="@/assets/imgs/home/arrow.svg" alt="" />
        </div>
      </li>
    </ul>
    <div v-if="!hasPermissionsJs(myAppPermissionList)" class="home-empty">
      <img src="@/assets/imgs/home/empty.png" alt="" />
      <div class="home-empty-text">暂无相关内容</div>
    </div>
    <div v-if="hasPermissionsJs(bigScreenPermissionList)">
      <div class="home-title">大屏展示</div>

      <ul class="home-list">
        <template v-for="(item, index) in bigScreenList">
          <li v-if="!item.permission || checkPermi([item.permission])" :key="index"
            @mouseenter="handleMouseOver(index, 'bigScreen')" @mouseleave="handleMouseOut(index, 'bigScreen')"
            @click="myAppEnterClick(item)">
            <div class="home-item-top">
              <img :src="item.imgSrc" alt="" />
              <div class="home-item-top-title">{{ item.name }}</div>
            </div>
            <div class="home-item-bottom">
              <div class="home-item-bottom-title">进入</div>
            </div>
            <div v-if="item.hover" class="home-item-bottomHover">
              <div class="home-item-bottomHover-title">进入</div>
              <img src="@/assets/imgs/home/arrow.svg" alt="" />
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
  <!-- 表单弹窗：添加/修改 -->
  <ImportDataDialog ref="formRef" />
  <!-- 店铺选择 -->
  <StoreRangePlus ref="storeRangeRef" v-model="store" v-model:show-dialog="isShowStoreRangePlus" just-dialog
    @change="onRangeUseSubmit" />
  <!-- 抽奖设置 -->
  <LotterySetting ref="lotterySetRef" />
</template>

<script lang="ts" setup>
import * as HometApi from '@/api/home'
import BIImg from '@/assets/imgs/home/BIImg.png'
import biSystem from '@/assets/imgs/home/biSystem.png' //BI商业智能系统
import default_bg from '@/assets/imgs/home/default_bg.png'
import evaluation from '@/assets/imgs/home/evaluation.png'
import lottery from '@/assets/imgs/home/lottery.png'
import otrSystem from '@/assets/imgs/home/otrSystem.png' //人才盘点系统
import people from '@/assets/imgs/home/people.png' //人力资源看板
import popularize from '@/assets/imgs/home/popularize.svg' //推广字典对照
import prod from '@/assets/imgs/home/prod.png' //问题商品分析
import StoreImg from '@/assets/imgs/home/StoreImg.png'
import packageGalleryImg from '@/assets/imgs/packageGallery.svg'
import { useUserStore } from '@/store/modules/user'
import ImportDataDialog from './components/importDataDialog.vue'
import LotterySetting from './components/lotterySetting.vue'
import waitMessage from '@/assets/imgs/home/wait-message.svg'
import readMessage from '@/assets/imgs/home/read-message.svg'
import { userMessageStore } from '@/store/modules/userMessage'
import { checkPermi } from '@/utils/permission'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

const useUserMessageStore = userMessageStore()
import { hasPermissionsJs, treeToArray } from '@/utils'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
const userStore = useUserStore()
const router = useRouter() // 路由对象
const realName = computed(() => userStore.user.realName || '')

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
])

const bigScreenList = ref([
  {
    name: '淘宝、天猫、抖音、拼多多数据看板',
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
    name: '售前售后周月度数据',
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
])

const messageList = ref([
  {
    name: '待处理',
    permission: '',
    path: '',
    functionType: WorkbenchFunctionType.MessageData,
    imgSrc: waitMessage,
    hover: false,
    windowOpen: true,
    messageType: 1
  },
  {
    name: '已处理',
    permission: '',
    path: '',
    functionType: WorkbenchFunctionType.MessageData,
    imgSrc: readMessage,
    hover: false,
    windowOpen: true,
    messageType: 2
  }
])

const myAppPermissionList = computed(() => {
  return myAppList.value.map((item) => item.permission || '')
})

const bigScreenPermissionList = computed(() => {
  console.log('bigScreenList1', bigScreenList.value)
  return bigScreenList.value.map((item) => item.permission || '')
})

const isShowStoreRangePlus = ref(false)
const store = ref('')

// 获取背景图
const workBenchImg = ref('')
const getBg = async () => {
  const data = await HometApi.getWorkBenchImg()
  workBenchImg.value = data
}

// 获取第一行文字
const firstLine = ref('')
const getFirstLine = async () => {
  const data = await HometApi.getFirstLine()
  firstLine.value = data
}

// 获取第二行文字
const secondLine = ref('')
const getSecondLine = async () => {
  const data = await HometApi.getSecondLine()
  secondLine.value = data
}

/** 导入操作 */
const formRef = ref()
const lotterySetRef = ref()

const { getRouteInfo } = useRouteInfo();
// 店铺选择
const storeRangeRef = ref()
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

const onRangeUseSubmit = (data) => {
  window.open(`${window.location.origin}/bigScreen/newGoodsBoard?store=${data}`)
}

// 鼠标移入
const handleMouseOver = (index, type) => {
  if (type === 'myApp') {
    if (index < myAppList.value.length) {
      myAppList.value[index].hover = true
    }
  } else if (type === 'bigScreen') {
    if (index < bigScreenList.value.length) {
      bigScreenList.value[index].hover = true
    }
  } else if (type === 'message') {
    if (index < messageList.value.length) {
      messageList.value[index].hover = true
    }
  }
}

// 鼠标移除
const handleMouseOut = (index, type) => {
  if (type === 'myApp') {
    if (index < myAppList.value.length) {
      myAppList.value[index].hover = false
    }
  } else if (type === 'bigScreen') {
    if (index < bigScreenList.value.length) {
      bigScreenList.value[index].hover = false
    }
  } else if (type === 'message') {
    if (index < messageList.value.length) {
      messageList.value[index].hover = false
    }
  }
}

onMounted(() => {
  getBg()
  getFirstLine()
  getSecondLine()
  // useUserMessageStore.getMessageCount()
})

watch(
  () => router.currentRoute.value.path,
  () => {
    // console.log('路由变化',val)
    useUserMessageStore.getMessageCount()
  }
)
</script>

<style lang="scss" scoped>
.home-title {
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 18px;
  color: #6e7398;
  line-height: 25px;
  margin-bottom: 20px;
}

.home-bg {
  width: 100%;
  margin-bottom: 20px;
  position: relative;

  img {
    width: calc(100%);
    height: 246px;
    border-radius: 8px;
  }

  &-text {
    position: absolute;
    left: 72px;
    top: 50%;
    transform: translateY(-50%);

    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: bold;
    font-size: 28px;
    color: #2362b3;
    line-height: 50px;
    letter-spacing: 3px;
    text-align: left;
  }
}

.home-list {
  padding: 0;
  display: flex;
  flex-wrap: wrap;

  // display: grid;
  // grid-template-columns: repeat(6, 1fr);
  // grid-gap: 20px; /* 列间距 */
  // grid-row-gap: 26px; /* 行间距 */
  li {
    flex: 1;
    list-style: none;
    width: 256px;
    min-width: 250px;
    max-width: 256px;
    height: 138px;
    border-radius: 8px;
    background-color: #fff;
    cursor: pointer;
    position: relative;
    margin-right: 20px;
    margin-bottom: 26px;

    &:hover {
      background-image: url(@/assets/imgs/home/item_bg.png);
      background-repeat: no-repeat;
      background-size: contain;
    }

    // &:hover .home-item-bottom {
    //   background-color: #2266fd;
    //   color: #fff;
    // }
    .home-item-top {
      display: flex;
      align-items: center;
      padding: 28px 24px;
      box-sizing: border-box;

      img {
        width: 42px;
        height: 42px;
        margin-right: 22px;
      }

      &-title {
        font-size: 16px;
        color: #333333;
        font-weight: bold;
        font-family:
          PingFangSC,
          PingFang SC;
      }
    }

    .home-item-bottom {
      width: 100%;
      position: absolute;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 38px;
      line-height: 38px;
      border-radius: 0 0 8px 8px;
      border-top: 1px solid #e7e8f1;
      color: #666;
      padding: 0 30px;
      box-sizing: border-box;
      font-size: 14px;
    }

    .home-item-bottomHover {
      width: 100%;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 38px;
      line-height: 38px;
      border-radius: 0 0 8px 8px;
      border-top: 1px solid #e7e8f1;
      color: #fff;
      padding: 0 30px;
      box-sizing: border-box;
      font-size: 14px;
      // background-color: #33a3f8;
      background-color: #4d69db;
      position: absolute;
      /* 设置定位 */
      // left: -100%;
      /* 初始位置在左侧 */

      animation: home-item-bottomHover 0.5s forwards;
    }

    @keyframes home-item-bottomHover {
      from {
        width: 110px;
      }

      to {
        width: 100%;
      }
    }
  }
}

.home-empty {
  width: 315px;
  position: relative;
  left: 45%;
  transform: translateX(-50%);
  font-size: 14px;
  color: #999999;

  &-text {
    text-align: center;
    transform: translateX(50px);
    margin-top: 20px;
  }
}

.message-tag {
  position: absolute;
  right: 0;
  top: 0;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 8px;
  font-size: 12px;
  color: #fff;
  padding: 0 6px;
  height: 17px;
  line-height: 17px;
  background-color: #eb3737;
  font-weight: 500;
}
</style>
