<template>
  <div class="big">
    <div class="box">
      <div>
        <div
          v-if="props.isShowBack"
          class="backButton"
          @click="goBack"
          @mouseenter="changeImage(true)"
          @mouseleave="changeImage(false)"
        >
          <img :src="currentImage" alt="" />
          <span>返回</span>
        </div>
      </div>
      <div class="right-box">
        <!-- <div class="name">商品发布时间</div> -->
        <time-filter
          :label="'商品发布时间'"
          is-feedback
          :is-show-time="false"
          :is-tooltip="false"
          ref="filterRef"
          v-model="queryParams.pickerVModel"
          :swift-options="timeOptions"
          :map-options="mapOptions"
          @change="onDateChange"
          :layout="'自定义'"
        />
        <time-filter
          style="margin-left: 30px"
          :label="'车图更新时间'"
          is-feedback
          :is-show-time="false"
          :is-tooltip="false"
          ref="filterRef"
          v-model="queryParams.pickerVModel2"
          :swift-options="timeOptions"
          :map-options="mapOptions"
          @change="onDateChanges"
          :layout="'自定义'"
        />
        <!-- <div class="topDateFilter-bg">
          <div class="topDateFilter-bg-timeSelect" v-for="(value, index) in timeList" :key="index"
            :class="{ 'topDateFilter-bg-timeSelect-selected': selectIndex === index }" @click="timeSelectAction(value)">
            <div class="topDateFilter-bg-timeSelect-name">{{ value.name }}</div>
          </div>
        </div>
        <div class="hidden-date-picker">
          <el-date-picker v-if="selectType === 4" ref="dateDayPickRef1" v-model="queryParams.pickerVModel"
            class="BIDataPicker-date" value-format="YYYY-MM-DD" type="daterange" placeholder="请选择某一月"
            @change="dateClick" />
        </div> -->

        <!-- <div class="name name2">车图更新时间</div>
        <div class="topDateFilter-bg">
          <div class="topDateFilter-bg-timeSelect" v-for="(value, index) in timeList" :key="index"
            :class="{ 'topDateFilter-bg-timeSelect-selected': selectIndex2 === index }"
            @click="timeSelectAction2(value)">
            <div class="topDateFilter-bg-timeSelect-name">{{ value.name }}</div>
          </div> -->
        <!-- <el-tooltip
          effect="dark"
          content=""
          placement="bottom"
        >
      </el-tooltip> -->
        <!-- <el-icon class="topDateFilter-bg-tips" color="#606266">
          <Warning />
        </el-icon> -->
        <!-- <el-icon
          :color="dateChangePreIconColor2"
          style="margin-right: 6px; margin-left: 9.999994px; cursor: pointer"
          @click="arrowLeftClick2"
          ><ArrowLeft
        /></el-icon>
        <el-icon :color="dateChangeNextIconColor2" style="cursor: pointer" @click="arrowRightClick2"
          ><ArrowRight
        /></el-icon> -->
        <!-- </div>
        <div class="hidden-date-picker2">
          <el-date-picker v-if="selectType2 === 4" ref="dateDayPickRef2" v-model="queryParams.pickerVModel2"
            class="BIDataPicker-date" value-format="YYYY-MM-DD" type="daterange" placeholder="请选择某一月"
            @change="dateClick" />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TimeFilter from '~/time/timeFilter.vue'
import backImgHover from '@/assets/imgs/web/back_hover.png'
import backImg from '@/assets/imgs/web/back.png'
import { debounce } from 'lodash-es'

const props = defineProps({
  isShowBack: {
    type: Boolean,
    default: true
  }
})

const timeOptions = computed(() => [
  {
    label: '三个月',
    tips: '支持对三个月时间范围内的数据进行分析',
    isComponents: false,
    params: { type: 3, date: 1 },
    timeOffset: { type: 'month', mode: 'subtract', offset: 3 }
  },
  {
    label: '一个月',
    tips: '支持对一个月时间范围内的数据进行分析',
    isComponents: false,
    params: { type: 4, date: 2 },
    timeOffset: { type: 'month', mode: 'subtract', offset: 1 }
  },
  {
    label: '半个月内',
    tips: '支持对半个月内时间范围内的数据进行分析',
    isComponents: false,
    params: { type: 5, date: 3 },
    timeOffset: { type: 'day', mode: 'subtract', offset: 16 }
  }
])

const mapOptions = computed(() => [{ label: '自定义', params: { type: 6, date: 4 } }])

const selectType = ref(0)
const selectType2 = ref(0)
const queryParams = ref<any>({
  pickerVModel: '',
  pickerVModel2: ''
})

const currentImage = ref(backImg)
const emit = defineEmits(['updateTimeSelect'])
const selectIndex = ref()
const selectIndex2 = ref()
const dateDayPickRef1 = ref()
const dateDayPickRef2 = ref()
const timeList = ref([
  {
    name: '三个月',
    type: 3,
    date: 1
  },
  {
    name: '一个月',
    type: 4,
    date: 2
  },
  {
    name: '半个月内',
    type: 5,
    date: 3
  },
  {
    name: '自定义',
    type: 6,
    date: 4
  }
])
// 返回
const changeImage = (isHover) => {
  currentImage.value = isHover ? backImgHover : backImg
}
// 回退
const router = useRouter() // 路由对象
const goBack = () => {
  router.push({
    name: 'GalleryManage'
  })
}
// 左侧颜色
const dateChangePreIconColor = computed(() => {
  if (selectIndex.value - 1 >= 0) {
    return '#8C8C8C'
  }
  return 'rgba(140,140,140,0.5)'
})
const dateChangePreIconColor2 = computed(() => {
  if (selectIndex2.value - 1 >= 0) {
    return '#8C8C8C'
  }
  return 'rgba(140,140,140,0.5)'
})
// 右侧颜色
const dateChangeNextIconColor = computed(() => {
  if (selectIndex.value !== 3) {
    return '#8C8C8C'
  }
  return 'rgba(140,140,140,0.5)'
})
const dateChangeNextIconColor2 = computed(() => {
  if (selectIndex2.value !== 3) {
    return '#8C8C8C'
  }
  return 'rgba(140,140,140,0.5)'
})

const onDateChange = debounce(async (value: any, selectValue: any) => {
  if (value) {
    selectIndex.value = selectValue.params.date - 1
    emit('updateTimeSelect', {
      selectIndex: selectIndex.value,
      selectIndex2: selectIndex2.value,
      queryParams: queryParams.value
    })
  }
}, 500)

const onDateChanges = debounce(async (value: any, selectValue: any) => {
  console.log(value, selectValue)
  if (value) {
    selectIndex2.value = selectValue.params.date - 1
    emit('updateTimeSelect', {
      selectIndex: selectIndex.value,
      selectIndex2: selectIndex2.value,
      queryParams: queryParams.value
    })
  }
}, 500)

const timeSelectAction = (Type) => {
  selectIndex.value = Type.date - 1
  selectType.value = Type.date
  nextTick(() => {
    if (Type.date === 1 || Type.date === 2 || Type.date === 3) {
      emit('updateTimeSelect', {
        selectIndex: selectIndex.value,
        selectIndex2: selectIndex2.value,
        queryParams: queryParams.value
      })
    } else if (Type.date === 4) {
      dateDayPickRef1.value.focus()
    }
  })
}
const timeSelectAction2 = (Type) => {
  selectIndex2.value = Type.date - 1
  selectType2.value = Type.date
  console.log(selectType2.value, 'selectType2.value')
  nextTick(() => {
    if (Type.date === 1 || Type.date === 2 || Type.date === 3) {
      emit('updateTimeSelect', {
        selectIndex: selectIndex.value,
        selectIndex2: selectIndex2.value,
        queryParams: queryParams.value
      })
    } else if (Type.date === 4) {
      dateDayPickRef2.value.focus()
    }
  })
}

const arrowLeftClick = () => {
  if (selectIndex.value - 1 <= -1) {
    return
  }
  const Type = selectIndex.value - 1
  timeSelectAction(timeList.value[Type])
}
const arrowLeftClick2 = () => {
  if (selectIndex2.value - 1 <= -1) {
    return
  }
  const Type = selectIndex2.value - 1
  timeSelectAction2(timeList.value[Type])
}
const arrowRightClick = () => {
  if (selectIndex.value + 1 >= 4) {
    return
  }
  const Type = selectIndex.value + 1
  timeSelectAction(timeList.value[Type])
}
const arrowRightClick2 = () => {
  if (selectIndex2.value + 1 >= 4) {
    return
  }
  const Type = selectIndex2.value + 1
  timeSelectAction2(timeList.value[Type])
}

const dateClick = () => {
  emit('updateTimeSelect', {
    selectIndex: selectIndex.value,
    selectIndex2: selectIndex2.value,
    queryParams: queryParams.value
  })
}

const reset = () => {
  selectIndex.value = ''
  selectIndex2.value = ''
}

defineExpose({ reset })
</script>
<style lang="scss" scoped>
.big {
  width: 100%;
  // background-color: #fff;
  background: #f4f7fe;
  // padding: 20.000006px 69.999994px 0 69.999994px;
}

.box {
  height: 50.000006px;
  line-height: 50.000006px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  position: relative;
  border-radius: 8.000006px 8.000006px 0 0;
  padding-right: 20.000006px;

  .name {
    font-family: PingFang SC;
    font-size: 14.000006px;
    font-weight: normal;
    text-align: right;
    letter-spacing: normal;
    color: #666666;
  }

  .right-box {
    display: flex;
    align-items: center;
  }
}

.topDateFilter-bg {
  margin-left: 6px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  height: 32px;
  border-radius: 15px;
  background: #eef3fb;
  box-sizing: border-box;
}

.topDateFilter-bg-timeSelect {
  font-size: 12px;
  color: #606266;
  padding: 0 15px;
  box-sizing: border-box;
  border-radius: 15px;
  height: 32px;
  line-height: 32px;
  // padding-left: 9.999994px;
  // padding-right: 9.999994px;
  cursor: pointer;

  &-selected {
    color: #ffffff;
    background: #dee6fb;
    border-radius: 15px;
    font-size: 12px;
    color: #0064ff;
  }

  &-line {
    width: 15.999994px;
    height: 2.000006px;
    background: #ffffff;
    border-radius: 2.000006px;
  }
}

.hidden-date-picker {
  right: 450px;
  position: absolute;
  z-index: -99;
}

.hidden-date-picker2 {
  position: absolute;
  right: 0;
  z-index: -99;
}

.name2 {
  margin-left: 30px;
}

.backButton {
  // margin-right: 50vw;
  width: 81px;
  height: 32.000006px;
  border-radius: 4px;
  background: #0064ff;
  box-shadow: 0px 2.000006px 9.999994px 0px rgba(0, 0, 0, 0.13);
  font-family: PingFang SC;
  font-size: 12.96px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #fff;
  text-align: left;
  font-style: normal;
  line-height: 32.000006px;
  cursor: pointer;
  margin-left: 1.041667vw;

  img {
    width: 12px;
    height: 12px;
    margin-left: 15px;
    margin-right: 6px;
  }
}

// .backButton:hover {
//   cursor: pointer;
//   color: #fff;
//   border-radius: 4px;
//   background: #0064FF;
//   box-shadow: 0px 0px 8.000006px 0px rgba(0, 50, 125, 0.14);
// }
</style>
