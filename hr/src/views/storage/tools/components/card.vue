<template>
  <div class="card-box">
    <div class="cart-content">
      <div class="card-tip">
        <div class="card-tip-text">{{ tip }}</div>
      </div>
      <div class="card-icon">
        <div class="icon">
          <img src="@/assets/imgs/storage/icon.png" alt="" />
        </div>
      </div>
      <div class="card-title">
        <span class="text">{{ title }}</span>
        <div class="arrow">
          <div class="active-arrow"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  tip: string
  title: string
  icon: string
}>()
</script>
<style lang="less" scoped>
.card-box {
  width: 256px;
  height: 118px;
  margin-top: 20px;
  margin-right: 18px;
  background-image: url('@/assets/imgs/storage/card.png');
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 31, 72, 0.06);
  position: relative;
  overflow: hidden;
  box-sizing: content-box;
  cursor: pointer;

  .cart-content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 999;

    .card-tip {
      padding: 8px;
      border-radius: 0 0 0 10px;
      background-image: linear-gradient(46deg, rgba(90, 0, 255, 0.1), rgba(0, 70, 255, 0.1));
      background-size: contain;
      position: absolute;
      top: 0px;
      right: 0px;

      .card-tip-text {
        font-style: italic;
        color: #482dec;
        line-height: 1;
        text-align: center;
        font-size: 12px;
      }
    }
    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 40px;
      height: 40px;
      border: 1px solid #eaeaea;
      border-radius: 8px;

      position: absolute;
      top: 20px;
      left: 20px;

      .icon {
        width: 22px;
        height: 28px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: calc(100% - 40px);
      position: absolute;
      left: 20px;
      bottom: 20px;
      .text {
        line-height: 22px;
        color: #333;
      }
      .arrow {
        width: 16px;
        height: 12px;
        background-image: url('@/assets/imgs/storage/arrow.png');
        background-size: cover;
        // overflow: hidden;
      }
      .active-arrow {
        display: none;
        width: 16px;
        height: 12px;
        background-image: url('@/assets/imgs/storage/active_arrow.png');
        background-size: contain;
        background-repeat: no-repeat;
        transition: all 0.5s;
      }
    }
  }

  .active {
    border: 1px solid rgb(0, 70, 255);

    .card-tip {
      background-image: linear-gradient(46deg, rgb(90, 0, 255), rgb(0, 70, 255));
      background-size: contain;
      position: absolute;
      top: -1px;
      right: -1px;
      .card-tip-text {
        font-style: italic;
        color: aliceblue;
      }
    }
    .card-title {
      @keyframes arrow {
        0% {
          transform: translate(-100%, 0);
        }
        100% {
          transform: translate(0, 0);
        }
      }
      .arrow {
        background-image: none;
      }
      .active-arrow {
        display: block;
        animation: arrow 0.3s linear forwards;
      }
    }
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(150deg, rgba(0, 89, 255, 0.06), rgba(255, 255, 255, 0.06));
      position: absolute;
      top: 0;
      z-index: 1;
    }
  }

  &:hover {
    .active();
  }
}
</style>
