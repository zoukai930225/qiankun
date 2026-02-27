<template>
  <SWDialog
    title="车图图库"
    width="80%"
    :border-radius="14"
    v-model="visible"
    :append-to-body="false"
  >
    <s-w-search-form :schema="searchFormSchema" search-button-align="left" @search="onSearch">
      <el-button type="primary" @click="onExport">导出</el-button>
    </s-w-search-form>
    <ul class="main-container flex-[1_0_auto] h-0 min-h-[70vh] overflow-x-hidden overflow-y-auto">
      <li v-for="k in 2" :key="k">
        <div class="header row-center">
          <img class="header-icon" :src="getImageUrl(currentData.masterImageInfo.channel)" />
          <el-tooltip
            class="box-item"
            effect="dark"
            content="点击跳转商品链接"
            placement="top-start"
          >
            <div
              class="header-name"
              @click="
                onGoodTitleClick(
                  currentData.masterImageInfo.channel,
                  currentData.masterImageInfo.goodsId
                )
              "
              >{{
                `${currentData.masterImageInfo.goodsCode}` +
                `(${currentData.masterImageInfo.goodsId})`
              }}</div
            >
          </el-tooltip>
          <div class="header-mainImg">主图</div>
        </div>
        <div class="flex">
          <!-- 主图 -->
          <div>
            <div class="main-image-wrapper">
              <img class="main-image" :src="currentData.masterImageInfo.imageUrl" />
            </div>
            <div class="chart-preview-bar">
              <img class="chart-icon" src="@/assets/imgs/web/zhexianatu2x.png" alt="" />
              <div class="chart-title">访客数曲线图</div>
              <div
                class="chart-enter-btn"
                @click="onLineChartClick(currentData.masterImageInfo.goodsId)"
                >进入</div
              >
            </div>
            <!-- 信息 -->
            <div class="info-section">
              <div class="info-card">
                <div class="info-header">
                  <img class="info-icon" src="@/assets/imgs/web/rightMessage.png" alt="" />
                  <div>信息</div>
                </div>
                <div class="info-labels">
                  <div style="margin-left: 10px">类目</div>
                  <div style="margin-left: 122px">编码</div>
                  <div style="margin-left: 118px">产品定位</div>
                </div>
                <div class="info-values">
                  <div
                    style="width: 7.8125vw; margin-left: 0.520833vw; font-weight: 600"
                    class="text-ellipsis"
                    >{{ currentData.masterImageInfo.category }}</div
                  >
                  <div style="width: 5.9375vw; font-weight: 600" class="text-ellipsis">{{
                    currentData.masterImageInfo.goodsCode
                  }}</div>
                  <div style="margin-left: 1.614583vw; font-weight: 600">
                    <el-tooltip placement="bottom-start" :popper-append-to-body="true">
                      <div
                        style="
                          width: 4.0625vw;
                          white-space: nowrap;
                          overflow: hidden;
                          text-overflow: ellipsis;
                        "
                        >{{ currentData.masterImageInfo.productPositioning }}</div
                      >
                      <template #content>
                        <div style="width: 293px; padding: 12px; font-size: 14px">
                          {{ currentData.masterImageInfo.productPositioning }}
                        </div>
                      </template>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div style="height: 0.625vw"></div>
              <div class="data-stats-card">
                <div style="height: 0.520833vw"></div>
                <div class="data-time-row">
                  <img class="time-icon" src="@/assets/imgs/web/blueTime.png" alt="" />
                  <div class="time-label">数据时间</div>
                  <div style="margin-right: 0.520833vw" class="time-value">截止</div>
                  <div class="time-value">{{ currentData.masterImageInfo.clickRateEndTime }}</div>
                </div>
                <div class="stats-content">
                  <div class="stats-labels">
                    <div style="margin-right: 2.916667vw">7天付费点击率</div>
                    <div style="margin-right: 2.083333vw">30天免费点击率</div>
                    <div>7天付费转换率</div>
                  </div>
                  <div class="stats-values">
                    <!-- 7天付费点击率 -->
                    <div
                      v-if="currentData.masterImageInfo.clickRateSeven"
                      style="width: 7.812501vw; font-weight: 600"
                      class="text-ellipsis"
                    >
                      {{ currentData.masterImageInfo.clickRateSeven }}
                    </div>
                    <div
                      v-else
                      style="width: 7.604167vw; font-weight: 600"
                      class="text-ellipsis loading-text"
                    >
                      <img
                        style="width: 1.041667vw; height: 1.041667vw; margin-right: 0.3125vw"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>
                    <!-- 30天免费点击率 -->
                    <div
                      v-if="currentData.masterImageInfo.clickRateThirty"
                      style="width: 7.291667vw; font-weight: 600"
                      class="text-ellipsis"
                    >
                      {{ currentData.masterImageInfo.clickRateThirty }}
                    </div>
                    <div
                      v-else
                      style="width: 7.291667vw; font-weight: 600"
                      class="text-ellipsis loading-text"
                    >
                      <img
                        style="width: 1.041667vw; height: 1.041667vw; margin-right: 0.3125vw"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>
                    <!-- 7天付费转换率 -->
                    <div
                      v-if="currentData.masterImageInfo.checkNormal === '2'"
                      style="flex: 1; font-weight: 600"
                      class="text-ellipsis"
                    >
                      {{ currentData.masterImageInfo.clickConversionRateSeven || '--' }}
                    </div>
                    <div
                      v-else
                      style="flex: 1; font-weight: 600"
                      class="text-ellipsis loading-text"
                    >
                      <img
                        style="width: 1.041667vw; height: 1.041667vw; margin-right: 0.3125vw"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>
                  </div>
                  <div class="stats-divider"></div>
                  <div class="stats-labels">
                    <div style="margin-right: 2.5vw">30天免费转换率</div>
                    <div style="margin-right: 3.958333vw">30天销量</div>
                    <div style="margin-left: 4px">累计销量</div>
                  </div>
                  <div class="stats-values">
                    <div
                      v-if="currentData.masterImageInfo.checkNormal === '2'"
                      style="width: 7.916667vw; font-weight: 600"
                      class="text-ellipsis"
                    >
                      {{ currentData.masterImageInfo.clickConversionRateThirty || '--' }}
                    </div>
                    <div
                      v-else
                      style="width: 7.916667vw; font-weight: 600"
                      class="text-ellipsis loading-text"
                    >
                      <img
                        style="width: 1.041667vw; height: 1.041667vw; margin-right: 0.3125vw"
                        src="@/assets/imgs/web/loading.gif"
                        alt=""
                      />抓取中
                    </div>

                    <div
                      style="width: 7.083333vw; font-weight: 600"
                      class="text-ellipsis loading-text"
                      >{{ currentData.masterImageInfo.salesVolumeThirty || '--' }}</div
                    >

                    <div style="flex: 1; font-weight: 600" class="text-ellipsis">{{
                      currentData.masterImageInfo.salesVolumeCumulative || '--'
                    }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 推广图 -->
          <div class="content-main" v-if="currentData.promotionImageList.length != 0">
            <div class="promotion-images-box" v-if="currentData.promotionImageList.length >= 1">
              <div
                v-for="(x, y) in currentData.promotionImageList"
                :key="y"
                style="margin-bottom: 18px"
              >
                <DetailTitleHeader :item="x" :desc="x.type == '1' ? '手动上传' : '自动上传'">
                  <div class="flex-column header-title-content" v-if="x.type == '2'">
                    <div class="title-desc"
                      ><span class="title-header">推广场景：</span>{{ x.sceneName }}</div
                    >
                  </div>
                  <template #desc-right>
                    <div class="flex-column header-title-content ml-16px" v-if="x.type == '2'">
                      <div class="title-desc">
                        <span class="title-header mr-16px">车图上传时间</span>
                        <span class="color-#666 font-400 text-14px">2025-07-25 10:00:00</span>
                      </div>
                    </div>
                  </template>
                </DetailTitleHeader>
                <!-- 手动 -->
                <AutoItem
                  :item="x"
                  @pic-click="handlePicClick"
                  @update-success="handleUpdateSuccess"
                  :isAuto="false"
                  v-if="x.type == '1'"
                />
                <!-- 自动 -->
                <div v-if="x.type == '2'">
                  <div v-for="it in x.dataList" :key="it.id">
                    <AutoItem
                      :item="it"
                      @pic-click="handlePicClick"
                      :isAuto="true"
                      @update-success="handleUpdateSuccess"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="promotion-images-box"
            v-if="currentData.promotionImageList.length === 0"
            style="width: 100%"
          >
            <div style="display: flex; flex-direction: column; align-items: center">
              <img
                style="margin-top: 200px; width: 356px; height: 226.11px"
                src="@/assets/imgs/web/NoChePic.png"
                alt=""
              />
              <div
                style="
                  margin-top: 20px;
                  font-family: PingFang SC;
                  font-size: 14px;
                  font-weight: normal;
                  line-height: normal;
                  letter-spacing: normal;
                  color: #999999;
                "
              >
                暂无相关数据</div
              >
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="mt-16px">
      <Pagination
        :total="data.total"
        v-model:page="searchParams.page"
        v-model:limit="searchParams.size"
        @pagination="onPagination"
      />
    </div>
  </SWDialog>
  <access-line-chart ref="accessLineChartRef" />
</template>
<script lang="ts" setup>
import AccessLineChart from '@/views/web/visualGallery/components/accessLineChart.vue'
import AutoItem from '@/views/web/visualGallery/components/detailDialogComponents/autoItem.vue'
import DetailTitleHeader from '@/views/web/visualGallery/components/detailDialogComponents/detailTitleHeader.vue'
import { getImageUrl, getUrlByTypeAndId } from '@/utils'
import { FormSchema } from '@/types/form'

// 分页展示五条

const searchParams: any = ref<any>({
  page: 1,
  size: 10
})

const data: any = ref<any>({
  total: 20,
  list: []
})

const onPagination = (data: any) => {
  console.log('onPagination', data)
}

const searchFormSchema: FormSchema[] = [
  {
    field: 'uploadTime',
    label: '车图上传时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD'
    }
  }
]
// 模拟数据，用于开发和测试
const mockData = {
  masterImageInfo: {
    imageUrl:
      'https://img.alicdn.com/imgextra/i2/O1CN01Kx7G0Q23pTp8nt0X5_!!6000000007311-2-tps-1080-1080.png',
    goodsId: '123456789',
    category: '女装/上衣/T恤',
    goodsCode: 'SP123456',
    productPositioning: '时尚休闲，适合18-25岁年轻女性，春夏季节穿着',
    clickRateEndTime: '2025-07-30',
    clickRateSeven: '5.23%',
    clickRateThirty: '4.87%',
    clickConversionRateSeven: '2.34%',
    clickConversionRateThirty: '2.15%',
    salesVolumeThirty: '1245',
    salesVolumeCumulative: '8796',
    checkNormal: '2',
    channel: 'Tmall'
  },
  promotionImageList: [
    {
      id: '1',
      type: '1', // 手动上传
      imageUrl:
        'https://img.alicdn.com/imgextra/i3/O1CN01rbvrct1aDDcHlh5ik_!!6000000003295-2-tps-800-800.png',
      uploadTime: '2025-07-28 10:23:45',
      mappingTime: '2025-07-28',
      uploadUser: '张三'
    },
    {
      id: '2',
      type: '2', // 自动上传
      sceneName: '春季新品推广',
      mappingTime: '2025-07-28',
      dataList: [
        {
          id: '21',
          imageUrl:
            'https://img.alicdn.com/imgextra/i4/O1CN01TYNL3J1JyqY2qFjKM_!!6000000001095-2-tps-800-800.png',
          uploadTime: '2025-07-26 15:34:22',
          sceneName: '春季新品推广'
        },
        {
          id: '22',
          imageUrl:
            'https://img.alicdn.com/imgextra/i1/O1CN01VDZ8Yr1YqcC8zy1E2_!!6000000003114-2-tps-800-800.png',
          uploadTime: '2025-07-25 09:12:56',
          sceneName: '春季新品推广'
        }
      ]
    }
  ]
}

// defineProps<{
//   data: any
// }>()

const currentData = ref(mockData) // 使用模拟数据
const visible = ref<boolean>(false)
const accessLineChartRef = ref()

function open() {
  visible.value = true
}

function close() {
  visible.value = false
}

function handleUpdateSuccess() {}

function onLineChartClick(id: string) {
  accessLineChartRef.value.open(id)
}

function handlePicClick() {
  console.log('handlePicClick')
}

const onGoodTitleClick = (channel, goodsId) => {
  getUrlByTypeAndId(channel || 'TaoBao', goodsId)
}

const onSearch = (data) => {
  console.log('onSearch', data)
}

const onExport = () => {}

defineExpose({
  open,
  close
})
</script>
<style lang="scss" scoped>
:deep(.el-dialog) {
  .el-dialog__body {
    display: flex;
    flex-direction: column;
  }
}
.main-container {
  .close-btn {
    position: absolute;
    top: 0.729167vw;
    right: 1.302083vw;
    width: 1.041667vw;
    height: 1.041667vw;
    cursor: pointer;
    z-index: 99;
  }
}

.main-image-wrapper {
  display: inline-block;
  position: relative;
  margin-top: 0.729167vw;
  margin-left: 1.5625vw;
  margin-right: 1.302083vw;
  width: 23.776042vw;
  height: 21.666667vw;
  border-radius: 0.445313vw;
  background: #f7f8fc;
  margin-bottom: 0.520833vw;

  .main-image {
    width: 100%;
    height: 100%;
    border-radius: 0.3125vw;
    object-fit: contain;
  }
}

.header {
  .header-mainImg {
    width: 2.083333vw;
    height: 1.145833vw;
    background: url('@/assets/imgs/web/MainPicBackground.png');
    background-size: 100% 100%;
    font-weight: 500;
    font-size: 0.625vw;
    color: #ffffff;
    line-height: 1.145833vw;
    text-align: center;
  }
}

.header-icon {
  margin-right: 1.145833vw;
  width: 1.041667vw;
  height: 1.041667vw;
  margin-left: 0.3125vw;
}

.header-name {
  cursor: pointer;
  font-weight: 600;
  padding-right: 0.9375vw;
  max-width: calc(83vh - 11.458333vw);

  &:hover {
    color: #0064ff;
  }
}

.chart-preview-bar {
  display: flex;
  width: 23.802083vw;
  height: 2.708333vw;
  border-radius: 0.208333vw;
  background: #f7f8fc;
  margin: 0vw 0vw 0vw 1.5625vw;
  align-items: center;

  .chart-icon {
    margin-left: 0.833333vw;
    width: 1.770833vw;
    height: 1.742708vw;
  }

  .chart-title {
    margin-left: 0.520833vw;
    font-family: PingFang SC;
    font-size: 0.729167vw;
    font-weight: 500;
    letter-spacing: normal;
    color: #333333;
  }

  .chart-enter-btn {
    margin-left: 12.291667vw;
    width: 3.125vw;
    height: 1.666667vw;
    border-radius: 0.104167vw;
    line-height: 1.666667vw;
    background: #0064ff;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
}

.info-section {
  margin-top: 0.625vw;
  margin-left: 1.5625vw;

  .info-card {
    width: 23.802083vw;
    height: 5.833333vw;
    border-radius: 0.208333vw;
    background: #f7f8fc;

    .info-header {
      height: 2.083333vw;
      line-height: 2.083333vw;
      display: flex;
      color: #333333;
      font-family: PingFang SC;
      font-size: 0.729167vw;
      font-weight: 500;
      align-content: center;
      place-items: center;

      .info-icon {
        margin-left: 0.729167vw;
        margin-right: 0.520833vw;
        width: 0.729167vw;
        height: 0.736458vw;
      }
    }
  }
}

.info-labels {
  margin: 0 0.520833vw;
  padding: 0.520833vw 0vw 0vw 0vw;
  display: flex;
  font-family: PingFang SC;
  font-size: 0.729167vw;
  font-weight: normal;
  letter-spacing: normal;
  color: #666666;
  background: #ffffff;
  height: 1.302083vw;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-text {
  display: flex;
  align-items: center;
}

.info-values {
  padding: 0vw 0vw 0.520833vw 0vw;
  margin: 0vw 0.520833vw;
  display: flex;
  font-family: PingFang SC;
  font-size: 0.729167vw;
  font-weight: 500;
  letter-spacing: normal;
  color: #333333;
  background: #ffffff;
}

.data-stats-card {
  width: 23.802083vw;
  height: 9.635417vw;
  border-radius: 0.208333vw;
  background: #f7f8fc;

  .data-time-row {
    display: flex;
    height: 1.041667vw;
    place-items: center;
    margin-bottom: 0.520833vw;

    .time-icon {
      margin: 0vw 0.520833vw 0vw 0.729167vw;
      width: 0.729167vw;
      height: 0.729167vw;
    }

    .time-label {
      margin-right: 11.458334vw;
      font-family: PingFang SC;
      font-size: 0.729167vw;
      font-weight: 500;
      letter-spacing: normal;
      color: #333333;
    }

    .time-value {
      font-size: 0.729167vw;
      color: #666666;
    }
  }

  .stats-content {
    margin: 0 0.729167vw;
    padding: 0 0.625vw;
    height: 7.083333vw;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .stats-labels {
      margin-top: 0.520833vw;
      display: flex;
      color: #727e93;
      font-family: PingFang SC;
      font-size: 0.729167vw;
    }

    .stats-values {
      margin-top: 0.520833vw;
      margin-bottom: 0.520833vw;
      display: flex;
      color: #333333;
      font-family: PingFang SC;
      font-size: 0.729167vw;
      font-weight: 500;
      align-items: center;
    }

    .stats-divider {
      border-bottom: 0.052083vw solid #f0f0f0;
    }
  }
}

.content-main {
  height: 41.777083vw;
  margin-top: 0.729167vw;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.promotion-images-box {
  .header-title-content {
    .title-desc {
      font-size: 0.83vw;
      font-weight: 400;
      color: #333333;
      font-weight: bold;

      .title-header {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 0.733333vw;
        color: #666666;
        text-align: left;
        font-style: normal;
      }
    }
  }
}

.flex-column {
  display: flex;
  flex-direction: column;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 0.3125vw;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d9e5;
  border-radius: 0.15625vw;
}
</style>
