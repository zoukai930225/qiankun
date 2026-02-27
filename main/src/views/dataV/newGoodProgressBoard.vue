<!-- 新品进度看板  -->
<template>
  <div class="bg">
    <GoodFilter
      v-if="!isBigScreen"
      ref="goodFilterRef"
      :select-tab="selectTab"
      @handle-searh="goodHandleSearch"
    />
    <GoodTab v-if="!isBigScreen" :select-tab="selectTab" @tab-click="tabClick" />
    <div style="height: 20px"></div>
    <div v-if="list && list.length > 0">
      <div v-if="!isBigScreen" class="goodNodeBg">
        <GoodNode
          v-for="(value, index) in list"
          :data="value"
          :key="index"
          :style="{ marginRight: index === list.length - 1 ? '0px' : '20px' }"
        />
      </div>
      <BigScreen v-else :list="list" />
    </div>
    <div
      v-if="requestDta && list && list.length == 0"
      style="margin-top: auto; margin-bottom: auto"
    >
      <div class="flex-column empty" style="align-items: center">
        <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GoodFilter from './components/newGoodProgressBoard/goodFilter.vue'
import GoodTab from './components/newGoodProgressBoard/goodTab.vue'

import GoodNode from './components/newGoodProgressBoard/node.vue'
import BigScreen from './components/newGoodProgressBoard/bigScreen.vue'

import * as NewGoodApi from '@/api/dataV/newGood'

const route = useRoute() // 路由

const isBigScreen = route.query.isBigScreen
const goodFilterRef = ref()
const selectTab = ref(isBigScreen ? route.query.planTemplate : 1)

const list = ref([])

const tabClick = (val: any) => {
  if (selectTab.value != val) {
    goodFilterRef.value?.resetQueryParams()
    searchParam.value = {}
  }
  selectTab.value = val
  getList()
}
const searchParam = ref({})
const goodHandleSearch = (val: any) => {
  console.log('商品筛选参数:', val)
  searchParam.value = val
  getList()
}
// 每隔10分钟请求一次接口
const reqTimeInterval = 1000 * 60 * 10
window.setInterval(() => {
  setTimeout(() => {
    getList()
  }, 0)
}, reqTimeInterval)

onMounted(() => {
  getList()
})

const requestDta = ref(false)
const loadingInstance = ref()

const getList = async () => {
  loadingInstance.value = ElLoading.service({ fullscreen: false, text: '数据加载中' })
  const data = await NewGoodApi.bigScreenNewGoodProgressBoard({
    ...searchParam.value,
    planTemplate: selectTab.value,
    templateName: '新品模板'
  }).catch((err) => {
    requestDta.value = true
    loadingInstance.value.close()
  })
  requestDta.value = true
  loadingInstance.value.close()
  list.value = data || []
}
</script>
<style lang="scss" scoped>
.bg {
  width: 100vw;
  height: 100vh;
  background: #f4f7fe;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .goodNodeBg {
    //    min-width: 1920px;
    // min-height: 1080px;
    margin-left: 16px;
    margin-right: 16px;
    height: calc(100vh - 163px - 52px);
    width: calc(100% - 32px);
    display: flex;
    flex-direction: row;
    overflow: auto;
    margin-bottom: 8px;
  }
}
</style>
