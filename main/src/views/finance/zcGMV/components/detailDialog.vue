<!--
 * @Date: 2025-03-19 11:44:58
-->
<template>
  <el-dialog v-model="dialogVisible" :before-close="handleClose" :show-close="false" width="750">
    <template #header="{ close }">
      <div class="my-header">
        <div class="flex-row" style="justify-content: space-between">
          <div class="flex-row">
            <div>明细图</div>
          </div>
          <img src="@/assets/imgs/hrAdmin/close.png" alt="" class="close" @click="close" />
        </div>
      </div>
    </template>
    <div class="content-wrapper">
      <div class="goodsInfo">
        <div class="store box">
          <div class="title">店铺名称</div>
          <div class="content">
            <img class="storeImg" :src="getImageUrl(goodsInfo.channel || '')" />
            <div>{{ goodsInfo.storeName }}</div>
          </div>
        </div>
        <div class="goodsName box">
          <div class="title">商品名称</div>
          <div class="content text2">
            {{ goodsInfo.goodsName }}
          </div>
        </div>
        <div class="goodsID box">
          <div class="title">商品ID</div>
          <div class="content">
            {{ goodsInfo.goodsId }}
          </div>
        </div>
      </div>

      <div class="dataContent">
        <div class="filterWrapper">
          <SWLayoutTableChange :layoutMode="layoutMode" @layout-mode-change="layoutModeChange" />
        </div>
        <div class="dataWrapper">
          <div class="layout" v-if="layoutMode === 1">
            <detailTable :loading="loading" :list="detailList" :channel="goodsInfo.channel" />
          </div>
          <div class="layout" v-if="layoutMode === 0">
            <detailChart :list="detailList" :channel="goodsInfo.channel" />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as zcGMVApi from '@/api/finance/zcGMV/index'
import { getImageUrl } from '@/utils'
import SWLayoutTableChange from '@/components/SWLayoutChange/src/SWLayoutTableChange.vue'
import detailTable from './detailTable.vue'
import detailChart from './detailChart.vue'
const dialogVisible = ref(false)

const handleClose = () => {
  dialogVisible.value = false
}
const layoutMode = ref(1) // 0 折线图模式  1 表格
const layoutModeChange = (mode: any) => {
  layoutMode.value = mode
}
const goodsInfo = ref<any>({})
const detailList = ref<any>([])
const loading = ref(false)
const open = (params) => {
  goodsInfo.value = params
  getDetail(params)
  layoutMode.value = 1
  dialogVisible.value = true
}

const getDetail = async (params) => {
  loading.value = true
  try {
    const { channel, goodsId, dataDate } = params
    const queryParams = { channel, goodsId, publicationDate: dataDate }
    const data = await zcGMVApi.getDetail(queryParams)
    detailList.value = data.chartData
  } finally {
    loading.value = false
  }
}

const emits = defineEmits(['success'])

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.content-wrapper {
  margin: 0 -16px;
  border-top: 1px solid #f0f0f0;
  padding: 11px 20px;
  box-sizing: border-box;
  background: #fff;
  .goodsInfo {
    height: 100px;
    background: #f2f6fc;
    padding: 16px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .box {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      .title {
        color: #666;
        margin-bottom: 10px;
      }
      .content {
        color: #333;
        font-weight: 600;
      }
    }
    .store {
      width: 28%;
      padding-right: 16px;
      .content {
        display: flex;
        align-items: center;
        .storeImg {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
    .goodsName {
      width: 40%;
      padding: 0 17px;
      border-left: 1px solid #e2eaf6;
      border-right: 1px solid #e2eaf6;
    }
    .goodsID {
      width: 30%;
      padding-left: 16px;
    }
  }
  .dataContent {
    margin-top: 16px;
    .dataWrapper {
      margin-top: 20px;
    }
  }
}
.close {
  width: 14px;
  height: 14px;
  cursor: pointer;
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
