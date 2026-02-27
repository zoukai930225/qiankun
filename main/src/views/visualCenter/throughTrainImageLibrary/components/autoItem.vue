<!--
 * @Date: 2025-06-20 17:55:54
-->
<template>
  <div>
    <div class="pic-box1 pos-relative">
      <!-- <div class="pos-absolute top-16px right-16px">
        <el-button type="primary">编辑</el-button>
      </div> -->
      <div class="flex-row titile-content" v-if="isAuto">
        <span class="title-desc" v-if="item.materialName"></span>
        <span v-if="item.materialName">{{ item.materialName }}</span>
      </div>
      <div class="pic-list">
        <div class="flex items-center" :class="{
          'img-wapper-container': !isAuto && item.dataList && item.dataList.length > 3
        }">
          <div class="picBox" v-for="(ite, index) in isAuto ? [item?.imageUrl] : item.dataList" :key="index"
            @click="openDialog(ite, item)">
            <div class="img-wapper">
              <img :src="isAuto ? ite : ite.imageUrl" alt="" />
              <div class="img-mask">
                <!-- 自动left -->
                <div class="icon-wapper" v-if="isAuto">
                  <img src="@/assets/imgs/web/zan-activity.png" v-if="item?.isGood == '1'"
                    @click.stop="handleBtn1(ite, item.id, '2')" class="img1" />
                  <img src="@/assets/imgs/web/zan-normal.png"
                    v-if="item?.isGood == '2' || !item?.isGood || item?.isGood == '0'"
                    @click.stop="handleBtn1(ite, item.id, '1')" class="img" />
                </div>
                <!-- 手动left -->
                <div class="icon-wapper" v-if="!isAuto">
                  <img src="@/assets/imgs/web/zan-activity.png" v-if="ite?.isGood == '1'"
                    @click.stop="handleBtn1(ite, ite.id, '2')" class="img1" />
                  <img src="@/assets/imgs/web/zan-normal.png"
                    v-if="ite?.isGood == '2' || !ite?.isGood || ite?.isGood == '0'"
                    @click.stop="handleBtn1(ite, ite.id, '1')" class="img" />
                </div>
                <!-- 自动right -->
                <div class="icon-wapper" v-if="isAuto">
                  <img src="@/assets/imgs/web/cai-activity.png" v-if="item?.isGood == '0'"
                    @click.stop="handleBtn2(ite, item.id, '2')" class="img1" />
                  <img src="@/assets/imgs/web/cai-normal.png"
                    v-if="item?.isGood == '2' || !item?.isGood || item?.isGood == '1'"
                    @click.stop="handleBtn2(ite, item.id, '0')" class="img" />
                </div>
                <!-- 手动right -->
                <div class="icon-wapper" v-if="!isAuto">
                  <img src="@/assets/imgs/web/cai-activity.png" v-if="ite?.isGood == '0'"
                    @click.stop="handleBtn2(ite, ite.id, '2')" class="img1" />
                  <img src="@/assets/imgs/web/cai-normal.png"
                    v-if="ite?.isGood == '2' || !ite?.isGood || ite?.isGood == '1'"
                    @click.stop="handleBtn2(ite, ite.id, '0')" class="img" />
                </div>
              </div>
            </div>
          </div>
          <div v-if="!isAuto && item.dataList && item.dataList.length == 2">
            <div class="picBox empty-one">
              <img src="@/assets/imgs/web/empty-one.png" class="img" alt="" />
              <span class="desc">暂无图片</span>
            </div>
          </div>
          <div v-if="!isAuto && item.dataList && item.dataList.length == 1">
            <div class="picBox empty-two">
              <img src="@/assets/imgs/web/empty-one.png" class="img" alt="" />
              <span class="desc">暂无图片</span>
            </div>
          </div>
        </div>
        <!--  自动抓取描述 -->
        <div class="content-desc" v-if="isAuto">
          <div class="desc-item mr-item">
            <span class="desc-title">7天点击量</span>
            <span class="desc-value">{{ item.sevenClick }}</span>
          </div>
          <div class="desc-item mr-item">
            <span class="desc-title">7天展现量</span>
            <span class="desc-value">{{ item.sevenAdPv }}</span>
          </div>
          <div class="desc-item mr-item">
            <span class="desc-title">7天测图点击率</span>
            <span class="desc-value">{{ item.clickRateSeven }}</span>
          </div>
          <div class="desc-item mr-item">
            <span class="desc-title">7天测图直接转换率</span>
            <span class="desc-value">{{ item.sevenDayDirectConversionRate }}</span>
          </div>
          <div class="desc-item mr-item">
            <span class="desc-title">15天点击量</span>
            <span class="desc-value">{{ item.fifteenClick }}</span>
          </div>
          <div class="desc-item mr-item">
            <span class="desc-title">15天展现量</span>
            <span class="desc-value">{{ item.fifteenAdPv }}</span>
          </div>
          <div class="desc-item mr-item">
            <span class="desc-title">15天测图点击率</span>
            <span class="desc-value">{{ item.clickRateFifteen }}</span>
          </div>
          <div class="desc-item mr-item">
            <span class="desc-title">15天测图直接转换率</span>
            <span class="desc-value">{{ item.fifteenDayDirectConversionRate }}</span>
          </div>
        </div>
        <!-- 手动抓取 -->
        <div class="manual flex-row" v-if="!isAuto" style="width: 40%">
          <div class="manual-desc"></div>
          <div class="manual" style="flex: 1">
            <div class="desc-item" style="padding-left: 0">
              <span class="desc-title">7天付费点击率</span>
              <span class="desc-value">
                {{ item.clickRateSeven ? item.clickRateSeven + '%' : '' }}
              </span>
            </div>
            <div class="desc-item">
              <span class="desc-title">7天付费转换率</span>
              <span class="desc-value">{{
                item.clickConversionRateSeven ? item.clickConversionRateSeven + '%' : ''
              }}</span>
            </div>
            <div class="desc-item" style="padding-left: 0">
              <span class="desc-title">15天付费点击率</span>
              <span class="desc-value">{{ item.clickRateFifteen }}</span>
            </div>
            <div class="desc-item">
              <span class="desc-title">15天付费转换率</span>
              <span class="desc-value">{{ item.clickConversionRateFifteen }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center mt-16px">
        <!-- 结论 -->
        <div class="text-#727e93 w-64px">
          结论
        </div>
        <div class="flex items-center ml-16px">
          <img v-if="item.conclusionType === '1'"
            style="width: 0.677083vw; height: 0.677083vw; margin-right: 0.520833vw" src="@/assets/imgs/web/success.png"
            alt="" />
          <img v-if="item.conclusionType === '2'" style="width: 0.625vw; height: 0.729167vw; margin-right: 0.520833vw"
            src="@/assets/imgs/web/error.png" alt="" />
          <img v-if="item.conclusionType === '3'"
            style="width: 0.729167vw; height: 0.729167vw; margin-right: 0.520833vw" src="@/assets/imgs/web/again.png"
            alt="" />
          <img v-if="item.conclusionType === '4'"
            style="width: 0.677083vw; height: 0.677083vw; margin-right: 0.520833vw" src="@/assets/imgs/web/stopYh.png"
            alt="" />
          <div v-if="item.conclusionType === '1'" style="font-weight: 600; color: #0064ff">优化成功</div>
          <div v-if="item.conclusionType === '2'" style="font-weight: 600; color: #eb3737">优化失败</div>
          <div v-if="item.conclusionType === '3'" style="font-weight: 600; color: #7070f5">继续优化</div>
          <div v-if="item.conclusionType === '4'" style="font-weight: 600; color: #ea5b25">停止优化</div>
          <div v-if="item.conclusion" class="conclusionTypeClass">
            <el-tooltip placement="left" :popper-append-to-body="false">
              {{ item.conclusion }}
              <template #content>
                <div style="width: 293px; padding: 12px; font-size: 14px">
                  {{ item.conclusion }}
                </div>
              </template>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="flex items-center mt-16px">
        <div class="flex items-center text-#727e93 w-64px whitespace-nowrap">
          测图目的
        </div>
        <suspend-txt :txt="item?.mappingPurpose || ''" class="ml-16px mr-10px" style="width: calc(100% - 82px);" />
        <!-- <div class="ml-16px overflow-hidden">
          <el-tooltip placement="top" :popper-append-to-body="false">
            <div class="truncate">{{ item?.mappingPurpose }}</div>
            <template #content>
              <div>{{ item?.mappingPurpose }}</div>
            </template>
          </el-tooltip>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SuspendTxt from "@/components/common/text/suspend.vue";
import { updateQualityAndImprove } from '@/api/gallery';
const message = useMessage() // 消息弹窗
// 外面传递 item 对象
const props = withDefaults(
  defineProps<{
    item: {
      clickRateSeven?: string
      clickConversionRateSeven?: string
      conclusionType: string
      conclusion?: string
      imageList: string[]
      isGood?: string // 0-待提升，1-优质，2-无标记
      dataList?: any[] // 自动抓取的图片列表
      imageUrl?: string
      sevenClick?: string
      sevenAdPv?: string
      sevenDayDirectDealCount?: string
      sevenDayDirectConversionRate?: string
      fifteenClick?: string
      fifteenAdPv?: string
      fifteenDayDirectDealCount?: string
      fifteenDayDirectConversionRate?: string
      sceneName?: string
      materialName?: string
      clickRateFifteen?: string
      clickConversionRateFifteen?: string
      id?: string,
      mappingPurpose?: string
    }
    isAuto?: boolean
  }>(),
  {
    isAuto: false
  }
)

const emit = defineEmits<{
  (e: 'picClick', payload: { url: string; item: any; isAuto: boolean }): void
  (e: 'updateSuccess'): void
}>()

const openDialog = (url?, item?) => {
  const midUrl = props.isAuto ? url : item.imageUrl
  emit('picClick', { url: midUrl, item: item, isAuto: props.isAuto })
}

const handleBtn1 = async (midMmg, id, flag) => {
  const img = props.isAuto ? midMmg : midMmg.imageUrl

  try {
    await message
      .confirm(`是否${flag == '2' ? '取消' : ''}选为优质推广案例？`, '系统提醒')
      .then(async () => {
        console.log('执行按钮1逻辑', img)
        await updateQualityAndImprove({
          id: id,
          isGood: flag
        })
        message.success('操作成功')
        emit('updateSuccess')
      })
      .catch(() => {
        console.log('取消执行', img)
      })
  } catch { }
}
const handleBtn2 = async (midMmg, id, flag) => {
  const img = props.isAuto ? midMmg : midMmg.imageUrl

  try {
    await message
      .confirm(`是否${flag == '2' ? '取消' : ''}选为待提升推广案例？`, '系统提醒')
      .then(async () => {
        console.log('执行按钮2逻辑', img, props.isAuto)

        await updateQualityAndImprove({
          id: id,
          isGood: flag // 0 待提升，2 无标记
        })
        message.success('操作成功')
        emit('updateSuccess')
      })
      .catch(() => {
        console.log('取消执行')
        console.log('取消执行', img)
      })
  } catch { }
}
</script>

<style scoped lang="scss">
.pic-box1 {
  // display: flex;
  // flex-wrap: wrap;
  // border-radius: 0vw 0vw 0.208333vw 0.208333vw;
  padding: 16px;
  box-sizing: border-box;
  border: 0.052083vw solid #ecf0fc;
  overflow: hidden;

  .conclusionTypeClass {
    flex: 1;
    margin-left: 1.25vw;
    margin-right: 1.041667vw;
    font-family: PingFang SC;
    font-size: 0.729167vw;
    font-weight: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #333333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .pic-list {
    width: 100%;
    // padding-bottom: 0.520833vw;
    display: flex;
    position: relative;

    .picBox {
      width: 158px;
      height: 188px;
      display: flex;

      border-radius: 4px;
      background: #e7e8eb;
      overflow: hidden;
      /* 确保图片被裁剪为圆角 */
      margin-bottom: 16px;
      flex-shrink: 0;
      margin-right: 16px;
      // &:not(:last-child) {

      // }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        /* 可选：确保图片填满容器且不变形 */
      }
    }

    .empty-one {
      width: 10vw;
      height: 9.652083vw;
      border-radius: 4px;
      background: #f7f7f7;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .img {
        width: 125.6px;
        height: 57.6px;
      }

      .desc {
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 3px;
        color: #9b9999;
      }
    }

    .empty-two {
      width: 20vw;
      height: 9.652083vw;
      border-radius: 4px;
      background: #f7f7f7;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .img {
        width: 125.6px;
        height: 57.6px;
      }

      .desc {
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 3px;
        color: #9b9999;
      }
    }

    .desc-item {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
      width: 9.166667vw;
      height: 4.852083vw;
      flex-wrap: wrap;
      padding-left: 3%;
      box-sizing: border-box;

      .desc-title {
        font-size: 0.729167vw;
        color: #727e93;
        margin-bottom: 0.608333vw;
      }

      .desc-value {
        font-size: 0.833333vw;
        color: #333333;
        font-weight: 600;
        height: 14px;
      }
    }

    .mr-item {
      margin-right: 25px;
    }

    .ml-item {
      margin-left: 0px;
    }

    .content-desc {
      flex: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .manual {
      background: white;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      flex: 1;
      position: absolute;
      right: -0.2vw;
      top: 0;

      .desc-item {
        width: 50%;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: center;
        height: 4.852083vw;
        padding-left: 5%;
        box-sizing: border-box;

        .desc-title {
          font-size: 0.729167vw;
          color: #727e93;
          margin-bottom: 0.608333vw;
        }

        .desc-value {
          font-size: 0.833333vw;
          color: #333333;
          font-weight: 600;
        }
      }
    }
  }
}

.manual-desc {
  width: 0.677vw;
  height: 9.652083vw;
  background: linear-gradient(90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.89) 54%,
      #ffffff 100%);
}

.flex-row {
  display: flex;
  align-items: center;
  margin-left: 0.833333vw;
  margin-right: 1.041667vw;
  font-size: 0.729167vw;
  color: #727e93;
}

.titile-content {
  margin-top: 0.520833vw;
  margin-bottom: 0.520833vw;

  span {
    margin-right: 0.833333vw;
    font-weight: 600;
    color: #333333;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: calc(100% - 2.5vw);
    /* 减去左右间距 */
  }

  .title-desc {
    width: 0.215vw;
    height: 0.625vw;
    background: blue;
    border-radius: 0.104167vw;
    margin-right: 0.320833vw;
    font-weight: normal;
    color: #727e93;
    flex-shrink: 0;
    /* 确保第一个span不缩小 */
  }
}

.result {
  margin-bottom: 0.520833vw;

  img {
    width: 0.625vw;
    height: 0.736458vw;
  }
}

.img-wapper {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;

  .img-mask {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3.63vh;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 2;
    gap: 12px;

    .icon-wapper {
      background: white;
      border-radius: 50%;
      margin-right: 0.5vw;
      width: 26px;
      height: 26px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;

      .img {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }

      .img1 {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
  }

  &:hover .img-mask {
    opacity: 1;
  }
}

.mask-btn {
  border: none;
  background: #409eff;
  color: #fff;
  border-radius: 4px;
  padding: 0.44vh 1.333vh;
  /* 4px 12px → vh */
  cursor: pointer;
  font-size: 1.333vh;
  /* 12px → vh */
  transition: background 0.2s;
}

.mask-btn:hover {
  background: #66b1ff;
}

.img-wapper-container {
  overflow-x: auto;
  // padding-right: 20px;
  box-sizing: border-box;
  width: 590px;
}
</style>
