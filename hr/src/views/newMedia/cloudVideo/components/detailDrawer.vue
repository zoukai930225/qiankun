<template>
  <SWDrawer :width="drawerWidth" title="详情" v-model="drawerVisible" v-loading="drawerLoading" @closed="reset">
    <div ref="drawerContentRef">
      <div class="card-box">
        <div class="card-box-title row-center">
          <div class="card-box-title-border"></div>
          <div class="">视频数据信息</div>
        </div>
        <div class="row-center card-box-content">
          <div class="video-box">
            <div class="video-time">{{ videoTime }}</div>
            <div class="row-center video-bg">
              <video controls loop @mouseenter="beginPlay" @mouseleave="endPlay" id="video" v-if="detail.openVideoUrl"
                :style="{ width: `${videoWidth}px`, height: `${videoHeight}px` }" :src="detail.videoUrl" />
              <el-image :src="detail.coverUrl" fit="contain" style="width: 300px;height: 300px;cursor: pointer;"
                @click="openVideo" v-else />
            </div>
          </div>
          <div class="card-box-content-right">
            <div class="row-center">
              <div class="each-people row-center">
                <div class="each-people-title">编导</div>
                <LineAvatar :user="detail" name="directorName" image="directorHeadImg" v-if="detail.directorId"
                  style="font-size: 14px;" />
                <emptyTag v-else />
              </div>
              <div class="each-people row-center" style="justify-content: center;">
                <div class="each-people-title">剪辑</div>
                <LineAvatar :user="detail" name="editName" image="editHeadImg" v-if="detail.editId"
                  style="font-size: 14px;" />
                <emptyTag v-else />
              </div>
              <div class="each-people row-center" style="justify-content: flex-end;">
                <div class="each-people-title">投手</div>
                <LineAvatar :user="detail" name="contributorName" image="contributorHeadImg" v-if="detail.contributorId"
                  style="font-size: 14px;" />
                <emptyTag v-else />
              </div>
            </div>
            <div class="chart-box">
              <div class="row-center chart-box-top">
                <div>视频曲线图分析</div>
                <el-select style="width: 220px" v-model="selectType" placeholder="请选择" value-on-clear="" filterable
                  @change="handelChartType">
                  <el-option v-for="dict in getOptions()" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </div>

              <div class="flex-column" style="align-items: center;" v-if="JSON.stringify(chartData) === '{}'">
                <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" />
                <span class="empty-text">暂无数据</span>
              </div>
              <line-chart ref="lineChartRef" v-else :fieldCode="selectType" :data="chartData" />

            </div>
          </div>
        </div>
      </div>
      <div class="card-box" style="margin: 20px 0;">
        <div class="card-box-title row-center">
          <div class="card-box-title-border"></div>
          <div class="">基本信息</div>
        </div>
        <div class="card-box-content">
          <detail-descriptions :data="detail" />
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="close" style="margin-right: 20px;">取消</el-button>
    </template>
  </SWDrawer>
  <iframeVideo ref="iframeVideoRef" />
</template>
<script lang="ts" setup>
defineOptions({ name: 'DetailDrawer' })
import duration from 'dayjs/plugin/duration';
import LineAvatar from '@/components/template/table/components/lineAvatar.vue';
import LineChart from './lineChart.vue';
import DetailDescriptions from './detailDescriptions.vue';
import { useElementSize } from '@vueuse/core'
import { getDetailById, getDetailChartById } from '@/api/yunVideo/index'
import { chartSuperList, chartGuangList } from '../common'
import iframeVideo from './iframeVideo.vue';
import emptyTag from './emptyTag.vue';
import dayjs from 'dayjs'
dayjs.extend(duration);
const drawerVisible = ref(false)
const videoTime = ref<any>('00:00');
const videoWidth = ref(153);
const videoHeight = ref(300);
const video = ref<any>();
const selectType = ref<any>('')
const lineChartRef = ref<any>();
let interNum: any = 0

const initVideo = () => {
  if (interNum) {
    clearInterval(interNum)
  }
  if (video.value.duration) {
    dealVideo()
    return
  }
  interNum = setInterval(() => {
    if (!video.value.duration) return
    clearInterval(interNum)
    interNum = 0
    dealVideo()
  }, 200)

}

const dealVideo = () => {
  let timeLen: any = Math.floor(video.value.duration);
  if (timeLen < 3600) {
    videoTime.value = dayjs.duration(timeLen, 'seconds').format('mm:ss');
  } else {
    videoTime.value = dayjs.duration(timeLen, 'seconds').format('HH:mm:ss');
  }
  setVideoSize()
  setWidth()
}
//设置video的大小
const setVideoSize = () => {
  const height: number = video.value.videoHeight;
  const width: number = video.value.videoWidth;
  let flag: any = Number(height / width).toFixed(2);
  if (flag >= 1) {
    videoHeight.value = 300;
    videoWidth.value = 300 / flag;
  } else {
    videoHeight.value = 300 * flag;
    videoWidth.value = 300;
  }
}

const beginPlay = () => {
  if (!video.value) return;
  video.value.play();
}
const endPlay = () => {
  if (!video.value) return;
  video.value.pause();
}
const drawerWidth = ref(968)
const drawerLoading = ref(false)
const detail = ref<any>({});
const chartData = ref<any>({})
//打开弹框
const open = async (row: any) => {
  drawerVisible.value = true
  try {
    drawerLoading.value = true
    videoTime.value = '00:00'
    const res = await getDetailById({
      contentId: row.contentId,
      channel: row.channel,
      dataDateStart: row.dataDateStart,
      dataDateEnd: row.dataDateEnd
    });
    res.openVideoUrl = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm', '.m4v', '.3gp', '.mpeg/.mpg', '.rmvb', '.ts', '.vob'].includes('.' + res.videoUrl.split('.').pop())
    detail.value = res
    if (Number(detail.value.channel) === 1) {
      selectType.value = 'ggValidViewPeople'
    } else if (Number(detail.value.channel) === 2) {
      selectType.value = 'cdCost'
    }
    const data = await getDetailChartById({
      contentId: row.contentId,
      channel: row.channel,
      dataDateStart: row.dataDateStart,
      dataDateEnd: row.dataDateEnd
    });
    chartData.value = data
    nextTick(() => {
      if (detail.value.openVideoUrl) {
        video.value = document.getElementById('video');
        initVideo()
      }
      lineChartRef.value?.setChartOptions()
    })
  } catch (err) {

  } finally {
    drawerLoading.value = false
  }


}
const drawerContentRef = ref<any>();

const reset = () => {
  video.value = null;
  selectType.value = ''
  detail.value = {}
  chartData.value = {}
  if (interNum) {
    clearInterval(interNum)
  }
}

const close = () => {
  drawerVisible.value = false
  reset()
}
const setWidth = () => {
  const { height } = useElementSize(drawerContentRef);
  drawerWidth.value = height.value > window.innerHeight ? 978 : 968
}


const handelChartType = (val: any) => {
  nextTick(() => {
    lineChartRef.value?.setChartOptions()
  })
}

const getOptions = () => {
  if (JSON.stringify(detail.value) === '{}') {
    return []
  }
  //逛逛
  if (Number(detail.value.channel) === 1) {
    return chartGuangList
  } else if (Number(detail.value.channel) === 2) {
    return chartSuperList
  }
}
const iframeVideoRef = ref()
const openVideo = () => {
  // window.open(detail.value.videoUrl)
  iframeVideoRef.value.open(detail.value.videoUrl)
}

defineExpose({ open })
</script>
<style lang="scss" scoped>
.card-box {
  width: 100%;
  background: #FFFFFF;
  border-radius: 7px;

  &-title {
    width: 100%;
    height: 51px;
    border-bottom: 1px solid #F0F0F0;
    font-size: 14px;
    font-weight: 600;
    color: #333333;

    &-border {
      width: 3px;
      height: 10px;
      background: #0064FF;
      margin-right: 6px;
      margin-left: 20px;
    }
  }

  &-content {
    padding: 20px;
    width: calc(100% - 40px);

    .video-box {
      position: relative;
      width: 300px;
      height: 300px;
      border: 1px solid #E5E5E5;
      border-radius: 10px;
      background: #FAFAFC;

      video {
        object-fit: fill;
      }

      .video-time {
        position: absolute;
        margin-top: 10px;
        margin-left: 10px;
        background: #E8E8F1;
        border-radius: 2px;
        font-size: 10px;
        color: #999999;
        height: 18px;
        line-height: 18px;
        padding: 0 4px;
      }

      .video-bg {
        justify-content: center;
        height: 300px;
      }
    }

    &-right {
      width: 568px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 300px;
      margin-left: 20px;

      .each-people {
        width: 33.3%;
        margin-bottom: 10px;

        &-title {
          font-size: 14px;
          color: #666666;
          margin-right: 20px;
        }
      }

      .chart-box {
        width: 568px;
        height: 258px;
        border-radius: 10px;
        background: #FAFAFC;
        border: 1px solid #E5E5E5;

        &-top {
          justify-content: space-between;
          margin: 10px;
          width: calc(100% - 20px);
          font-size: 14px;
          color: #333333;
        }
      }
    }
  }
}

.empty-table {
  width: 200px;
  height: 127px;
}

.empty-text {
  font-size: 14px;
  color: #999999;
  margin-top: 10px;
}
</style>