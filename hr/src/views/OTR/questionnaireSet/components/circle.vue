<!--
 * @Date: 2024-10-25 10:45:40
-->
<template>
  <div class="circle-container">
    <svg :width="size" :height="size" xmlns="http://www.w3.org/2000/svg">
      <circle
        v-if="showBackground"
        :cx="radius"
        :cy="radius"
        :r="radius - strokeWidth / 2"
        :stroke="backgroundColor"
        :stroke-width="strokeWidth"
        fill="none"
        :transform="'rotate(-90,' + radius + ',' + radius + ')'"
      />

      <circle
        :cx="radius"
        :cy="radius"
        :r="radius - strokeWidth / 2"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference * (1 - percentage / 100)"
        :transform="'rotate(-90,' + radius + ',' + radius + ')'"
      />

      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="#6772aa"
        font-size="14"
      >
        {{ text }}
      </text>
    </svg>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  size: {
    type: Number,
    default: 100
  },
  strokeWidth: {
    type: Number,
    default: 10
  },
  strokeColor: {
    type: String,
    default: '#000'
  },
  backgroundColor: {
    type: String,
    default: '#FFFFFF'
  },
  progressColor: {
    type: String,
    default: 'blue'
  },
  percentage: {
    type: Number,
    default: 0.5
  },
  showBackground: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: '100'
  }
})

const radius = computed(() => {
  return props.size / 2
})

const circumference = computed(() => {
  return 2 * Math.PI * (radius.value - props.strokeWidth / 2)
})
</script>

<style scoped>
.circle-container {
  display: inline-block;
}
</style>
