<template>
  <div class="bg" v-loading="loading">
    <div class="title">
      <div class="center">
        <div class="name">{{ title }}</div>
      </div>
      <div class="time"> 统计时间：{{ date }} </div>
    </div>
    <div class="content">
      <listItemBI :store-list="list" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import listItemBI from './components/listItemBI.vue'
import * as DataVApi from '@/api/dataV'

const title = ref('BI数据看板')
const date = ref('')
const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
date.value = `${yesterday.getFullYear()}年${yesterday.getMonth() + 1}月${yesterday.getDate()}日`

const list = ref<any[]>([])

const loading = ref(false)

// 获取数据
const getBIData = async () => {
  const data = await DataVApi.bigScreenBIcleanRecord().catch(() => {})
  list.value = data
}
// 每隔30秒请求一次接口
const timeInterval = 1000 * 30
window.setInterval(() => {
  setTimeout(() => {
    // 更新年份
    getBIData()
  }, 0)
}, timeInterval)

onMounted(async () => {
  loading.value = true
  await getBIData()
  loading.value = false
})
</script>

<style lang="scss" scoped>
.bg {
  background: #05133d;
  height: 100%;
  width: 100%;
  .title {
    height: 64px;
    background: linear-gradient(180deg, #03133c 0%, #0b2861 100%);
    box-sizing: border-box;
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: #1c4382;
    display: flex;
    align-items: center;
    .center {
      height: 78px;
      width: 408px;
      position: absolute;
      left: calc(50% - 204px);
      background-image: url('@/assets/imgs/dataV/bi/biBg.png');
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      .name {
        margin: 0 auto;
        font-family: Hiragino Sans CNS;
        font-size: 32px;
        font-weight: 600;
        line-height: normal;
        letter-spacing: 5.48px;
        color: #effaff;
        text-shadow: 0px 1px 2px rgba(80, 170, 255, 0.91);
      }
    }
    .time {
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: normal;
      color: #ffffff;
      position: absolute;
      right: 34px;
    }
  }
  .content {
    margin-top: 10px;
    padding: 10px;
  }
}
</style>
