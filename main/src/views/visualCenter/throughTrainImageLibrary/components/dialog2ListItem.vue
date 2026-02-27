<!--
 * @Date: 2025-06-20 17:55:54
-->
<template>
  <div>
    <!-- 手动上传 -->
    <div class="dialog2-content-right-content-body" v-if="!isAuto">
      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/sevendayclick_icon.png" />
          7天付费点击率
        </div>
        <div class="dialog2-content-right-content-item-value">
          {{ dialog2Data.clickRateSeven ? dialog2Data.clickRateSeven + '%' : '' }}
        </div>
      </div>
      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/sevendayZhuan_icon.png" />
          7天付费转化率
          <el-tooltip :content="'直接转换率=直接成交笔数÷点击量'">
            <img style="width: 0.729167vw; height: 0.729167vw; margin-left: 0.3125vw"
              src="@/assets/imgs/web/questionLine2x.png" />
          </el-tooltip>
        </div>
        <div class="dialog2-content-right-content-item-value">
          {{
            dialog2Data.clickConversionRateSeven ? dialog2Data.clickConversionRateSeven + '%' : ''
          }}
        </div>
      </div>
      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/15click_icon.png" />
          15天付费点击率
        </div>
        <div class="dialog2-content-right-content-item-value2">
          {{ dialog2Data.clickRateFifteen ? dialog2Data.clickRateFifteen + '%' : '' }}
        </div>
      </div>
      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/15dayZhuan_icon.png" />
          15天付费转化率
          <el-tooltip :content="'直接转换率=直接成交笔数÷点击量'">
            <img style="width: 0.729167vw; height: 0.729167vw; margin-left: 0.3125vw"
              src="@/assets/imgs/web/questionLine2x.png" />
          </el-tooltip>
        </div>
        <div class="dialog2-content-right-content-item-value2">
          {{
            dialog2Data.clickConversionRateFifteen
              ? dialog2Data.clickConversionRateFifteen + '%'
              : ''
          }}
        </div>
      </div>
    </div>
    <!-- 自动抓取 -->
    <div class="dialog2-content-right-content-body" v-if="isAuto">
      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/sevendayclick_icon.png" />
          7天点击量
        </div>
        <div class="dialog2-content-right-content-item-value">
          {{ dialog2Data.sevenClick }}
        </div>
      </div>

      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/sevendayclick_icon.png" />
          7天展现量
          <!-- <el-tooltip>
            <img
              style="width: 0.729167vw; height: 0.729167vw; margin-left: 0.3125vw"
              src="@/assets/imgs/web/questionLine2x.png"
            />
          </el-tooltip> -->
        </div>
        <div class="dialog2-content-right-content-item-value">
          {{ dialog2Data.sevenAdPv }}
        </div>
      </div>

      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/sevendayclick_icon.png" />
          7天直接成交笔数
          <!-- <el-tooltip
            content="图片抓取到的第一天，至第7天的直接成交笔数累加，不足7天，每天累加，超过7天，只统计到第7天  页面中不展示该数据"
          >
            <img
              style="width: 0.729167vw; height: 0.729167vw; margin-left: 0.3125vw"
              src="@/assets/imgs/web/questionLine2x.png"
              alt=""
            />
          </el-tooltip> -->
        </div>
        <div class="dialog2-content-right-content-item-value">
          {{ dialog2Data.sevenDayDirectDealCount }}
        </div>
      </div>

      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/sevendayclick_icon.png" />
          7天测图点击率
          <el-tooltip content="7天点击量/7天展现量">
            <img style="width: 0.729167vw; height: 0.729167vw; margin-left: 0.3125vw"
              src="@/assets/imgs/web/questionLine2x.png" alt="" />
          </el-tooltip>
        </div>
        <div class="dialog2-content-right-content-item-value">
          {{ dialog2Data.clickRateSeven }}
        </div>
      </div>
      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/sevendayclick_icon.png" />
          7天测图直接转换率
          <el-tooltip content="7天直接成交笔数/7天点击量">
            <img style="width: 0.729167vw; height: 0.729167vw; margin-left: 0.3125vw"
              src="@/assets/imgs/web/questionLine2x.png" alt="" />
          </el-tooltip>
        </div>
        <div class="dialog2-content-right-content-item-value">
          {{ dialog2Data.sevenDayDirectConversionRate }}
        </div>
      </div>

      <!-- 15 -->

      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/15click_icon.png" />
          15天点击量
        </div>
        <div class="dialog2-content-right-content-item-value2">
          {{ dialog2Data.fifteenClick }}
        </div>
      </div>

      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/15click_icon.png" />
          15天展现量
          <!-- <el-tooltip>
            <img
              style="width: 0.729167vw; height: 0.729167vw; margin-left: 0.3125vw"
              src="@/assets/imgs/web/questionLine2x.png"
            />
          </el-tooltip> -->
        </div>
        <div class="dialog2-content-right-content-item-value2">
          {{ dialog2Data.fifteenAdPv }}
        </div>
      </div>

      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/15click_icon.png" />
          15天直接成交笔数
        </div>
        <div class="dialog2-content-right-content-item-value2">
          {{ dialog2Data.fifteenDayDirectDealCount }}
        </div>
      </div>

      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/15dayZhuan_icon.png" />
          15天测图点击率
          <el-tooltip content="15天点击量/15天展现量">
            <img style="width: 0.729167vw; height: 0.729167vw; margin-left: 0.3125vw"
              src="@/assets/imgs/web/questionLine2x.png" />
          </el-tooltip>
        </div>
        <div class="dialog2-content-right-content-item-value2">
          {{ dialog2Data.clickRateFifteen }}
        </div>
      </div>
      <div class="dialog2-content-right-content-item">
        <div class="dialog2-content-right-content-item-top">
          <img class="dialog2-content-right-content-item-top-img1" src="@/assets/imgs/web/15dayZhuan_icon.png" />
          15天测图直接转换率
          <el-tooltip content="15天直接成交笔数/15天点击量">
            <img style="width: 0.729167vw; height: 0.729167vw; margin-left: 0.3125vw"
              src="@/assets/imgs/web/questionLine2x.png" />
          </el-tooltip>
        </div>
        <div class="dialog2-content-right-content-item-value2">
          {{ dialog2Data.fifteenDayDirectConversionRate }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    dialog2Data: {
      clickRateSeven?: string
      clickConversionRateSeven?: string
      clickRateFifteen?: string
      clickConversionRateFifteen?: string
      sevenClick?: string
      sevenAdPv?: string
      sevenDayDirectDealCount?: string
      sevenDayDirectConversionRate?: string
      fifteenClick?: string
      fifteenAdPv?: string
      fifteenDayDirectDealCount?: string
      fifteenDayDirectConversionRate?: string
    }
    isAuto?: boolean
  }>(),
  {
    isAuto: true
  }
)
</script>

<style scoped lang="scss">
.dialog2-content-right-content-body {
  display: flex;
  flex-wrap: wrap;
  padding-left: 0.833333vw;
  box-sizing: border-box;

  .dialog2-content-right-content-item {
    margin-bottom: 0.520833vw;
    width: 9.789583vw;
    height: 3.541667vw;
    background: #f0f6ff;
    border-radius: 0.3125vw;
    margin-right: 1.09375vw;

    .dialog2-content-right-content-item-top {
      margin-top: 0.260417vw;
      display: flex;
      height: 1.5625vw;
      line-height: 1.5625vw;
      vertical-align: middle;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 0.729167vw;
      color: #666666;
      align-items: center;
      text-align: center;
      justify-content: center;

      .dialog2-content-right-content-item-top-img1 {
        margin-left: 0.3125vw;
        margin-right: 0.3125vw;
        width: 18px;
        height: 18px;
      }

      .dialog2-content-right-content-item-top-img2 {
        margin-left: 0.15625vw;
        margin-top: 0.520833vw;
        width: 0.304167vw;
        height: 0.392708vw;
      }
    }

    .dialog2-content-right-content-item-value {
      font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: bold;
      font-size: 1.145833vw;
      color: #0064ff;
      font-style: normal;
      text-align: center;
    }

    .dialog2-content-right-content-item-value2 {
      font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: bold;
      font-size: 1.145833vw;
      color: #ff7b49;
      text-align: center;
      font-style: normal;
    }
  }

  .dialog2-content-right-content-item:nth-child(5n) {
    // margin-right: 0;
  }
}
</style>
