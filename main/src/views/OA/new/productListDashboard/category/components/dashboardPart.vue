<template>
  <div class="dashboard">
    <div class="content">
      <!-- <el-carousel
        class="dashboard"
        arrow="never"
        :loop="false"
        :autoplay="false"
        ref="carouselRef"
      >
        <el-carousel-item
          v-for="(ele, index) in splitArrayIntoGroups(data)"
          :key="index"
        > -->
        <div v-for="(ele, index) in splitArrayIntoGroups(data)"
          :key="index" class="dashboard" style="display: flex;align-items: center;">
          <div
            class="h100px content-item flex items-center font-size-14px justify-between relative cursor-pointer"
            :class="{ actived: item.categoryCode === activeCategory }"
            v-for="item in ele"
            :key="item.categoryCode"
          >
            <div class="ml-16px">
              <div class="lh-20px mb-13px lh-20px" style="font-size: 14px;">{{ item.categoryName }}</div>
              <!-- {{ item.type === 'percent' ? (item.value || 0) * 100 +'%' : getOutputValue(item.value || 0) }} -->
              <div class="fw-600 " style="font-size: 22px;">
                <transition-txt :currentKey="`${item.categoryCode}_${new Date().getTime()}`" :txt="item.type === 'percent' ? (item.value || 0) * 100 : item.value"></transition-txt>
                <span v-if=" item.type === 'percent'">%</span>
              </div>
            </div>
            <div class="mr-15px">
              <img :src="getUrl(item.icon)" style="width: 50px;height: 50px;">
              <!-- <el-progress
                v-if="item.type === 'percent'"
                type="circle"
                :percentage="+((item.value ?? 0) * 100).toFixed(2)"
                :width="65"
                :color="progressColor"
              />
              <div v-else>{{ item.value }}</div> -->
            </div>
          </div>
        </div>
        <!-- </el-carousel-item>
      </el-carousel> -->

      <!-- <div
        class="control-btn left-10px cursor-pointer"
        @mousedown="leftColor = '#0064ff'"
        @mouseup="leftColor = '#999'"
        @click="handleToPre"
      >
        <Icon icon="ep:arrow-left" :size="12" :color="leftColor" />
      </div>
      <div
        class="control-btn right-10px cursor-pointer"
        @mousedown="rightColor = '#0064ff'"
        @mouseup="rightColor = '#999'"
        @click="handleToNext"
      >
        <Icon icon="ep:arrow-right" :size="12" :color="rightColor" />
      </div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import sjl from '@/assets/svgs/oa/sjl.svg'
import zyzs from '@/assets/svgs/oa/zyzs.svg'
import zhcps from '@/assets/svgs/oa/zhcps.svg'
import sjjdcps from '@/assets/svgs/oa/sjjdcps.svg'
import zbjdcps from '@/assets/svgs/oa/zbjdcps.svg'
import xdjdcps from '@/assets/svgs/oa/xdjdcps.svg'
import { useDashboard } from '@/store/modules/oaNew'
import { CarouselInstance, ProgressFn } from 'element-plus'
import transitionTxt from './transitionTxt.vue'

defineProps<{
  data?: any
}>()
const imgMap = ref({sjl, zyzs,zhcps,sjjdcps,zbjdcps, xdjdcps})
const emit = defineEmits(['change'])

const dashboard = useDashboard()

const activeCategory = ref('')
const leftColor = ref('#999')
const rightColor = ref('#999')
const carouselRef = ref<CarouselInstance>()
const progressColor: ProgressFn = (percentage: number) => {
  switch (true) {
    case percentage <= 25:
      return '#B14FF7'
    case percentage <= 50:
      return '#FFA501'
    case percentage < 100:
      return '#0064FF'
    case percentage === 100:
      return '#349B34'
    default:
      return ''
  }
}

function handleToNext() {
  carouselRef.value?.next()
}
function handleToPre() {
  carouselRef.value?.prev()
}

/**
 * 将数组拆分为多个子数组，每个子数组最多7个元素
 * @param {Array} arr - 原数组
 * @returns {Array} 拆分后的二维数组
 */
function splitArrayIntoGroups(arr) {
  const result: any[] = []
  // 遍历原数组，每次步长为7
  for (let i = 0; i < arr?.length; i += 7) {
    // 从当前索引i开始，截取最多7个元素（不足7个则取剩余全部）
    let group: any[] = arr.slice(i, i + 7)
    result.push(group)
  }
  return result
}

const getUrl = (key: string) => {
  return imgMap.value[key]
}

function handleClickItem(item) {
  activeCategory.value = activeCategory.value === item.categoryCode ? '' : item.categoryCode
  emit('change', activeCategory.value)
}

onBeforeMount(() => {
  if (dashboard.categoryList.length === 0) {
    dashboard.getCategoryList()
  }
})
</script>
<style lang="less" scoped>
.dashboard {
  position: relative;
  // overflow: hidden;
  margin-top: 15px;

  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0px 2px 4px 0px rgba(0, 50, 125, 0.2781);
    background-color: #fff;
  }

  .content {
    width: 100%;
    height: max-content;
    // overflow: hidden;
    position: relative;
    box-sizing: border-box;

    .board {
      transition: all 0.5s;
    }

    &-item {
      flex: calc(1 / 6);
      height: 100px;
      margin-right: 20px;
      border-radius: 8px;
      opacity: 1;

      background: #ffffff;

      box-sizing: border-box;
      border: 1px solid #e5e5e5;
      position: relative;

      &:last-of-type {
        margin-right: 0;
      }

      &.actived {
        height: 100px;
        border-radius: 8px;
        opacity: 1;

        background: linear-gradient(179deg, #ffffff 1%, #f4f5fc 98%);

        box-sizing: border-box;
        border: 1px solid #0064ff;
        z-index: 20;

        &::after {
          content: '';
          display: block;
          width: 24px;
          height: 3px;
          background: url('@/assets/svgs/oa/dashboard_tip.svg');
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
        }
      }

      &:not(.actived):hover {
        .actived();
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(104, 127, 243, 0.2);
      }

      &:active {
        .actived();
        box-shadow: none;
        border: 1px solid #0064ff;
      }
    }
  }
}

:deep(.el-progress__text) {
  font-size: 16px !important;
}

:deep(.el-carousel__container) {
  height: 102px;
  padding: 6px 0;
}

:deep(.el-carousel__item) {
  display: flex;
  height: max-content;
  padding: 6px 0;

  &::after {
    content: '';
    display: block;
  }
}

:deep(.el-carousel__indicator) {
  display: none;
}
</style>
