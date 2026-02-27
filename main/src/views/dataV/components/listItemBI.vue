<template>
  <ElScrollbar height="88vh" style="padding: 10px">
    <div class="list" v-for="item in storeList" :key="item.id">
      <div class="store item">
        <div class="text flex">
          <img :src="getLogoUrl(item.channel)" alt="" />
          <div style="margin-left: 10px">
            <div class="name">{{ item.storeName }}</div>
            <div
              class="status"
              :class="item.status === '0' ? '' : item.status === '1' ? 'pending' : 'solved'"
              >{{
                item.status === '0' ? '未执行' : item.status === '1' ? '执行中' : '执行结束'
              }}</div
            >
          </div>
        </div>
        <img
          :src="item.status === '0' ? biunSolved : item.status === '1' ? biPending : biSolved"
          alt=""
          style="width: 26px; height: 26px"
        />
      </div>
      <div class="order item">
        <div>
          <div class="title">订单(支付+发货)</div>
          <div class="num">{{ item.orderNum }}</div>
        </div>
        <div>
          <img :src="biline1" alt="" />
        </div>
        <div>
          <div class="title">账单(动账时间)</div>
          <div class="num">{{ item.billNum }}</div>
        </div>
        <div>
          <img :src="biline1" alt="" />
        </div>
        <div>
          <div class="title">退款单(退款时间)</div>
          <div class="num">{{ item.refundNum }}</div>
        </div>
      </div>
      <div class="profit item">
        <div style="margin-right: 26px">
          <div class="title">(账单)利润</div>
          <div class="num" :class="handleNumberStyle(item.lrzd)">{{
            handleNumberStr(Number(item.lrzd))
          }}</div>
        </div>
        <div>
          <div class="title"
            >较昨天
            <img
              :src="Number(item.lrzdJzr) > 0 ? biup : biDown"
              alt=""
              v-if="Number(item.lrzdJzr) !== 0"
          /></div>
          <div class="num" :class="handleNumberStyle(item.lrzdJzr)">{{
            handleNumberStr(Number(item.lrzdJzr))
          }}</div>
        </div>
        <div>
          <img :src="biline2" alt="" />
        </div>
        <div style="margin-right: 20px">
          <div class="title">(支付预估)利润</div>
          <div class="num" :class="handleNumberStyle(item.lrzfyg)">{{
            handleNumberStr(Number(item.lrzfyg))
          }}</div>
        </div>
        <div>
          <div class="title"
            >较昨天
            <img
              :src="Number(item.lrzfygJzr) > 0 ? biup : biDown"
              alt=""
              v-if="Number(item.lrzfygJzr) !== 0"
          /></div>
          <div class="num" :class="handleNumberStyle(item.lrzfygJzr)">{{
            handleNumberStr(Number(item.lrzfygJzr))
          }}</div>
        </div>
      </div>
      <div class="abnormal" :class="Number(item.errorNum) === 0 ? 'item' : 'err'">
        <img :src="Number(item.errorNum) === 0 ? binoerror : bierror" alt="" />
        <div>
          <div class="title">执行异常一级应用</div>
          <div class="num">数量：{{ item.errorNum }}</div>
        </div>
      </div>
    </div>
  </ElScrollbar>
</template>

<script lang="ts" setup>
import biSolved from '@/assets/imgs/dataV/bi/biSolved.svg'
import biPending from '@/assets/imgs/dataV/bi/biPending.svg'
import biunSolved from '@/assets/imgs/dataV/bi/biunSolved.svg'
import biup from '@/assets/imgs/dataV/bi/biup.svg'
import biDown from '@/assets/imgs/dataV/bi/biDown.svg'
import bierror from '@/assets/imgs/dataV/bi/bierror.svg'
import binoerror from '@/assets/imgs/dataV/bi/binoerror.svg'
import biline1 from '@/assets/imgs/dataV/bi/biline1.svg'
import biline2 from '@/assets/imgs/dataV/bi/biline2.svg'

import logo_pdd from '@/assets/imgs/common/logo/PDD.svg'
import logo_douyin from '@/assets/imgs/common/logo/DY.svg'
import logo_taobao from '@/assets/imgs/common/logo/TB.svg'
import logo_tmall from '@/assets/imgs/common/logo/TM.svg'
import logo_xhs from '@/assets/imgs/common/logo/XHS.svg'
import logo_kuaishou from '@/assets/imgs/common/logo/KS.svg'
import logo_wph from '@/assets/imgs/common/logo/WPH.svg'
import logo_dewu from '@/assets/imgs/common/logo/DW.svg'
import logo_wxxd from '@/assets/imgs/common/logo/WXXD.svg'
import logo_youzan from '@/assets/imgs/common/logo/YZ.svg'
import logo_jingdong from '@/assets/imgs/common/logo/JD.svg'

const getLogoUrl = (platformId: string) => {
  const imageUrls = {
    Pdd: logo_pdd,
    Douyin: logo_douyin,
    TaoBao: logo_taobao,
    Tmall: logo_tmall,
    XHS: logo_xhs,
    KuaiShou: logo_kuaishou,
    VIP: logo_wph,
    Dewu: logo_dewu,
    WeiXinStore: logo_wxxd,
    Youzan: logo_youzan,
    JD: logo_jingdong
  }

  return imageUrls[platformId] || ''
}

// 判断数字 正负或者零
const handleNumberStyle = (n: string | number) => {
  const num = Number(n)
  if (num === 0) {
    return ''
  } else if (num > 0) {
    return 'up'
  } else {
    return 'down'
  }
}

const handleNumberStr = (n: number) => {
  if (n > 0) {
    return '+' + n
  } else {
    return n
  }
}

const props = defineProps({
  storeList: {
    type: Array as any,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  justify-content: space-around;
  margin-bottom: 26px;
  .item {
    color: #fff;
    font-family: PingFang SC;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-radius: 8px;
    border: 1px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image:
      linear-gradient(to right, #071c4b, #071c4b),
      linear-gradient(
        90deg,
        #4f9af0 0%,
        rgba(79, 154, 240, 0.3) 29%,
        rgba(79, 154, 240, 0.3) 73%,
        #4f9af0 100%
      );
  }

  .store {
    width: 17vw;
    height: 86px;
    padding: 23px 16px;
    justify-content: space-between;
    img {
      width: 40px;
      height: 40px;
    }
    .name {
      font-size: 16px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0.48px;
    }
    .status {
      font-size: 14px;
      font-weight: normal;
      line-height: 23px;
      letter-spacing: 0.42px;
      color: #979797;

      &.pending {
        color: #f59e0b;
      }
      &.solved {
        color: #10b981;
      }
    }
  }
  .order {
    width: 32vw;
    height: 86px;
    padding: 20px 24px;
    justify-content: space-around;
    .title {
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0.42px;
      opacity: 0.6;
    }
    .num {
      font-size: 16px;
      font-weight: 500;
      line-height: 23px;
      letter-spacing: 0.48px;
    }
  }
  .profit {
    width: 29vw;
    height: 86px;
    padding: 20px 24px;
    justify-content: space-between;
    div {
      .title {
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0.42px;
        opacity: 0.6;
      }
      .num {
        font-size: 16px;
        font-weight: 500;
        line-height: 23px;
        letter-spacing: 0.48px;
        color: #fff;

        &.down {
          color: #ff6666;
        }
        &.up {
          color: #59f4c1;
        }
      }
    }
  }
  .abnormal {
    width: 14vw;
    height: 86px;
    padding: 23px 16px;
    justify-content: flex-start;
    .title {
      font-size: 16px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0.48px;
      opacity: 0.6;
    }
    .num {
      font-size: 16px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0.48px;
      opacity: 0.8;
    }
    img {
      width: 30px;
      height: 30px;
      margin-right: 20px;
    }
    &.err {
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      border-radius: 8px;
      background: rgba(255, 47, 47, 0.17);

      &::after {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 1px;
        border-radius: 8px;
        background: linear-gradient(
          90deg,
          #ff4141 0%,
          rgba(255, 65, 65, 0) 28%,
          rgba(255, 65, 65, 0) 73%,
          #ff4141 100%
        );
        -webkit-mask-image: linear-gradient(red, red), linear-gradient(red, red);
        -webkit-mask-clip: padding-box, content-box;
        -webkit-mask-composite: xor;
      }
      .title {
        color: #ff6666;
        opacity: 1;
      }
      .num {
        color: #ff6666;
        opacity: 1;
      }
    }
  }
}
</style>

<style scoped>
/* 定制滚动条整体样式 */
::-webkit-scrollbar {
  width: 0px;
  background: transparent !important;
  background-color: transparent !important;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: transparent !important;
  /* 设置滚动条轨道的背景色 */
}
</style>
