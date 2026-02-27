<!--
 * @Date: 2025-08-11 11:53:16
-->
<template>
  <div class="countdown">
    <div v-for="(num, idx) in numbers" :key="idx" class="digit">
      <div class="flip" :class="{ animate: animate }" @animationend="onAnimationEnd(idx)">
        <img :src="getImgSrc(prevNumbers[idx])" class="top" />
        <img :src="getImgSrc(num)" class="bottom" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const numbers = ref([1, 2, 3, 4, 5, 9, 0])
const prevNumbers = ref([...numbers.value])
const animate = ref(false)

function getImgSrc(num) {
  // 假设图片命名为 digit-0.png, digit-1.png ...
  return new URL(`../assets/digit-${num}.png`, import.meta.url).href
}

function randomNumbers() {
  return Array.from({ length: numbers.value.length }, () => Math.floor(Math.random() * 10))
}

function updateNumbers() {
  prevNumbers.value = [...numbers.value]
  numbers.value = randomNumbers()
  animate.value = true
}

function onAnimationEnd(idx) {
  if (idx === numbers.value.length - 1) {
    animate.value = false
  }
}

onMounted(() => {
  setInterval(updateNumbers, 1000)
})
</script>

<style scoped>
.countdown {
  display: flex;
  gap: 8px;
}
.digit {
  width: 60px;
  height: 120px;
  perspective: 400px;
  position: relative;
}
.flip {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.5s;
}
.flip.animate {
  animation: flipAnim 0.5s;
}
@keyframes flipAnim {
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}
.top,
.bottom {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  object-fit: contain;
}
</style>
