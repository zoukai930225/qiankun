<template>
  <!-- 翻牌的外框 -->
  <div>
    <div class="flip down" ref="flipRef">
      <!-- 位于前面的纸牌 -->
      <div class="digital front" :class="'number' + frontNum" ref="frontNode"></div>
      <!-- 位于后面的纸牌 -->
      <div class="digital back" :class="'number' + backNum" ref="backNode"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  value: { type: Number, required: true }
})

const flipRef = ref(null)
const frontNode = ref(null)
const backNode = ref(null)

// 当前数字
var count = props.value
// 是否正在翻转（防止翻转未结束就进行下一次翻转）
var isFlipping = false

const frontNum = ref(count)
const backNum = ref(count)

watch(
  () => props.value,
  (newVal, oldVal) => {
    if (newVal === oldVal) return
    if (isFlipping) return
    // 设置前牌和后牌数字
    frontNum.value = oldVal
    backNum.value = newVal
    // 执行动画
    flipRef.value.setAttribute('class', 'flip down go')
    isFlipping = true
    setTimeout(() => {
      flipRef.value.setAttribute('class', 'flip down')
      isFlipping = false
      frontNum.value = newVal
      count = newVal
    }, 600)
  }
)
</script>

<style lang="scss" scoped>
.flip {
  display: inline-block;
  position: relative;
  width: 130px;
  height: 201px;
  line-height: 201px;
  border-radius: 10px;
  background: #fff;
  font-size: 175px;
  font-weight: bold;
  color: #d01c10;
  text-align: center;
  font-family: 'Helvetica Neue';
}

.flip .digital:before,
.flip .digital:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  background: white;
  overflow: hidden;
  box-sizing: border-box;
  // box-shadow: inset 0px 4px 0px 0px #c4b4b4;
}

.flip .digital:before {
  top: 0;
  bottom: 50%;
  border-radius: 10px 10px 0 0;
  border-bottom: solid 6px #d01c10;
}

.flip .digital:after {
  top: 50%;
  bottom: 0;
  border-radius: 0 0 10px 10px;
  line-height: 0;
}

/*向下翻*/
.flip.down .front:before {
  z-index: 3;
  background: linear-gradient(180deg, #edddde 0%, #fcf5f6 100%);
}

.flip.down .back:after {
  z-index: 2;
  transform-origin: 50% 0%;
  transform: perspective((800px)) rotateX(180deg);
}

.flip.down .front:after,
.flip.down .back:before {
  z-index: 1;
}

/*向上翻*/
.flip.up .front:after {
  z-index: 3;
  background: #ffffff;
  box-shadow: inset 0px 4px 3px 0px #6c3c35;
}

.flip.up .back:before {
  z-index: 2;
  transform-origin: 50% 100%;
  transform: perspective((800px)) rotateX(-180deg);
}

.flip.up .front:before,
.flip.up .back:after {
  z-index: 1;
}

//
.flip.down.go .front:before {
  transform-origin: 50% 100%;
  animation: frontFlipDown 0.6s ease-in-out both;
  box-shadow: 0 -2px 6px rgba(255, 255, 255, 0.3);
  backface-visibility: hidden;
}

.flip.down.go .back:after {
  animation: backFlipDown 0.6s ease-in-out both;
}

@keyframes frontFlipDown {
  0% {
    transform: perspective((800px)) rotateX(0deg);
  }

  100% {
    transform: perspective((800px)) rotateX(-180deg);
  }
}

@keyframes backFlipDown {
  0% {
    transform: perspective((800px)) rotateX(180deg);
  }

  100% {
    transform: perspective((800px)) rotateX(0deg);
  }
}
// 向下
.flip.up.go .front:after {
  transform-origin: 50% 0;
  animation: frontFlipUp 0.6s ease-in-out both;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.3);
  backface-visibility: hidden;
}

.flip.up.go .back:before {
  animation: backFlipUp 0.6s ease-in-out both;
}
@keyframes frontFlipUp {
  0% {
    transform: perspective((800px)) rotateX(0deg);
  }

  100% {
    transform: perspective((800px)) rotateX(180deg);
  }
}

@keyframes backFlipUp {
  0% {
    transform: perspective((800px)) rotateX(-180deg);
  }

  100% {
    transform: perspective((800px)) rotateX(0deg);
  }
}

.flip .number0:before,
.flip .number0:after {
  content: '0';
}

.flip .number1:before,
.flip .number1:after {
  content: '1';
}

.flip .number2:before,
.flip .number2:after {
  content: '2';
}

.flip .number3:before,
.flip .number3:after {
  content: '3';
}
.flip .number4:before,
.flip .number4:after {
  content: '4';
}
.flip .number5:before,
.flip .number5:after {
  content: '5';
}
.flip .number6:before,
.flip .number6:after {
  content: '6';
}
.flip .number7:before,
.flip .number7:after {
  content: '7';
}
.flip .number8:before,
.flip .number8:after {
  content: '8';
}
.flip .number9:before,
.flip .number9:after {
  content: '9';
}
</style>
