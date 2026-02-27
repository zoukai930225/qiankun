<!--
 * @Date: 2024-06-07 14:17:38
-->
<script lang="ts" setup>
import { getTeleport } from '@antv/x6-vue-shape';
// 当前用户个人信息弹出drawer
import userInfoDrawer from '@/views/system/user/components/userInfoDrawer.vue'
import routerSearch from '@/components/RouterSearch/index.vue';
import { openDB, closeDB } from "@/architecture/precept/db";
import { useDictStoreWithOut } from '@/store/modules/dict';
import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import { printerData } from '@/store/modules/printer';
import { useUserStore } from '@/store/modules/user';
import { useAppStore } from '@/store/modules/app';
import { useDesign } from '@/hooks/web/useDesign';
import NMPrintSocket from '@/utils/Print.js';
import { setTheme } from '@/utils/theme';
import { isDark } from '@/utils/is';
import Socket from '@/utils/Socket';
import '@/styles/dialog.scss';
// import dayjs from 'dayjs';
import MessageDrawer from '@/layout/components/UserMessage/src/components/MessageDrawer.vue';
const printerDataStore = printerData()
import { UserNotification } from '@/layout/components/UserNotification'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

defineOptions({ name: 'APP' })

const isQiankun = !!qiankunWindow.__POWERED_BY_QIANKUN__

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('app')
const appStore = useAppStore()
const userStore = useUserStore()
const font = reactive({
  color: 'rgba(0, 0, 0, .07)'
})

const dictStore = useDictStoreWithOut()
const currentSize = computed(() => appStore.getCurrentSize)
const greyMode = computed(() => appStore.getGreyMode)
const { wsCache } = useCache()

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  let isDarkTheme = wsCache.get(CACHE_KEY.IS_DARK)
  if (isDarkTheme === null) {
    isDarkTheme = isDark()
    // 默认为非暗色主题
    isDarkTheme = false
  }
  appStore.setIsDark(isDarkTheme)
}
setDefaultTheme()

const initDBData = () => {
  openDB('architecture', ['query_scheme_meta', `user_message_table`, `user_message_table_error`], 2).then((db: any) => {
    appStore.initDbHelp(db);
  }).catch(() => {
    appStore.initDbHelp(null);
  });
};

const TeleportPlanContainer = getTeleport();

onMounted(() => {
  initDBData();
  // 获取所有字典
  dictStore.setDictMap(true)
  dictStore.setDesignFields(true)

  if (!isQiankun) {
    //这里准备连接打印机
    // 创建socket实例
    const socketData = new Socket(printerDataStore.printerSocket)
    socketData.open(
      (openBool) => {
        printerDataStore.printerState = openBool
      },
      (msg) => {
        if (msg.resultAck.callback != undefined) {
          const callbackName = msg.resultAck.callback.name
          const msgInfo = msg.resultAck.info
          printerDataStore.msgInfo = msgInfo
          if (callbackName == 'onCoverStatusChange') {
            //盒盖状态：0-闭合、1-打开
            console.log('盒盖状态', msgInfo.capStatus)
          } else if (callbackName == 'onElectricityChange') {
            //"power" : 0-4, // 电池电量等级（共5档）
            console.log('电池电量等级', msgInfo.power)
          }
        }
      }
    )
    // 创建打印实例
    printerDataStore.printerClass = new NMPrintSocket(socketData);
  }
  setTheme();
});

onUnmounted(() => {
  closeDB(appStore.dbHelp, () => {
    appStore.initDbHelp(null);
  });
});
</script>
<template>
  <!-- Qiankun 模式：不渲染水印和全局组件，由主应用提供 -->
  <template v-if="isQiankun">
    <ConfigGlobal :size="currentSize">
      <RouterView :class="[greyMode ? `${prefixCls}-grey-mode` : '', 'qiankun-app-root']" />
    </ConfigGlobal>
  </template>
  <!-- 独立运行模式 -->
  <template v-else>
    <el-watermark :font="font" :content="[userStore.user.realName || '', userStore?.user?.phone || '']"
      :z-index="9999999999999" class="watermark">
      <ConfigGlobal :size="currentSize">
        <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
        <routerSearch />

        <userInfoDrawer />
        <!-- 消息 -->
        <MessageDrawer />
        <!-- 消息卡片 -->
        <UserNotification />
      </ConfigGlobal>
    </el-watermark>
    <teleport-plan-container />
  </template>
</template>
<style lang="scss">
$prefix-cls: #{$namespace}-app;

.size {
  width: 100%;
  height: 100%;
}

.watermark {
  width: 100%;
  height: 100%;
}

html,
body {
  // font-family: 'SimSun', 'Microsoft YaHei', 'Noto Sans', Arial, sans-serif;
  font-family:
    PingFangSC,
    PingFang SC;
  @extend .size;

  padding: 0 !important;
  margin: 0;
  overflow: hidden;

  #app {
    @extend .size;
  }
}

.#{$prefix-cls}-grey-mode {
  filter: grayscale(100%);
}

.qiankun-app-root {
  width: 100%;
  height: 100%;
}
</style>
