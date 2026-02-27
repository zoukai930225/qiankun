<template>
  <div class="big">
    <div class="box">
      <!-- <div
        class="backButton"
        @click="goBack"
        @mouseenter="changeImage(true)"
        @mouseleave="changeImage(false)"
      >
        <img :src="currentImage" alt="" />
        <div style="display: inline-block">返回</div>
      </div> -->
      <div><slot></slot></div>
      <div class="title-box">
        <div class="name">商品发布时间</div>
        <div class="topDateFilter-bg">
          <div
            class="topDateFilter-bg-timeSelect"
            v-for="(value, index) in timeList"
            :key="index"
            :class="{ 'topDateFilter-bg-timeSelect-selected': selectIndex === index }"
            @click="timeSelectAction(value)"
          >
            <div class="topDateFilter-bg-timeSelect-name">{{ value.name }}</div>
          </div>
          <!-- <el-tooltip
          effect="dark"
          content="自定义支持在可选时间范围内，对任意连续最多31天的数据进行分析"
          placement="bottom"
        >
      </el-tooltip> -->
          <!-- <el-icon class="topDateFilter-bg-tips" color="#606266">
          <Warning />
        </el-icon> -->
          <!-- <el-icon
          :color="dateChangePreIconColor"
          style="margin-right: 6px; margin-left: 10px; cursor: pointer"
          @click="arrowLeftClick"
          ><ArrowLeft
        /></el-icon>
        <el-icon :color="dateChangeNextIconColor" style="cursor: pointer" @click="arrowRightClick"
          ><ArrowRight
        /></el-icon> -->
        </div>
        <div class="hidden-date-picker">
          <el-date-picker
            v-if="selectType === 4"
            ref="dateDayPickRef1"
            v-model="queryParams.pickerVModel"
            class="BIDataPicker-date"
            value-format="YYYY-MM-DD"
            type="daterange"
            placeholder="请选择某一月"
            @change="dateClick"
          />
        </div>

        <div class="name name2">车图更新时间</div>
        <div class="topDateFilter-bg">
          <div
            class="topDateFilter-bg-timeSelect"
            v-for="(value, index) in timeList"
            :key="index"
            :class="{ 'topDateFilter-bg-timeSelect-selected': selectIndex2 === index }"
            @click="timeSelectAction2(value)"
          >
            <div class="topDateFilter-bg-timeSelect-name">{{ value.name }}</div>
          </div>
          <!-- <el-tooltip
          effect="dark"
          content="自定义支持在可选时间范围内，对任意连续最多31天的数据进行分析"
          placement="bottom"
        >
      </el-tooltip> -->
          <!-- <el-icon class="topDateFilter-bg-tips" color="#606266">
          <Warning />
        </el-icon> -->
          <!-- <el-icon :color="dateChangePreIconColor2" style="margin-right: 6px; margin-left: 10px; cursor: pointer"
          @click="arrowLeftClick2">
          <ArrowLeft />
        </el-icon>
        <el-icon :color="dateChangeNextIconColor2" style="cursor: pointer" @click="arrowRightClick2">
          <ArrowRight />
        </el-icon> -->
        </div>
        <div class="hidden-date-picker2">
          <el-date-picker
            v-if="selectType2 === 4"
            ref="dateDayPickRef2"
            v-model="queryParams.pickerVModel2"
            class="BIDataPicker-date"
            value-format="YYYY-MM-DD"
            type="daterange"
            placeholder="请选择某一月"
            @change="dateClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectType = ref(0)
const selectType2 = ref(0)
const queryParams = ref<any>({
  pickerVModel: '',
  pickerVModel2: ''
})
import backImg from '@/assets/imgs/web/back.png'
import backImgHover from '@/assets/imgs/web/back_hover.png'
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
  // background-color: #fff;
  background: #f4f7fe;
  border-bottom: 1px solid #f0f0f0;
  // padding: 20px 70px 0 70px;
}

.box {
  display: flex;
  background-color: #fff;
  position: relative;
  justify-content: space-between;
  align-items: center;
  border-radius: 8.000006px 8.000006px 0 0;
  padding: 0 20px;
  .title-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;
  }
  .name {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    text-align: right;
    letter-spacing: normal;
    color: #666666;
  }
}

.topDateFilter-bg {
  margin-left: 6px;
  // margin-top: 10px;
  padding-left: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 238px;
  height: 30px;
  background: #eef3fb;
  border-radius: 15px;
}

.topDateFilter-bg-timeSelect {
  font-size: 12px;
  color: #606266;
  line-height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;

  &-selected {
    color: #ffffff;
    background: #dee6fb;
    border-radius: 15px;
    font-size: 12px;
    color: #0064ff;
    line-height: 30px;
  }

  &-line {
    width: 16px;
    height: 2px;
    background: #ffffff;
    border-radius: 2px;
  }
}

.hidden-date-picker {
  right: 450px;
  position: absolute;
  z-index: -99;
}

.hidden-date-picker2 {
  position: absolute;
  z-index: -99;
}

.name2 {
  margin-left: 10px;
}

.backButton {
  margin-top: 8px;
  margin-left: 20px;
  margin-right: 808px;
  width: 81px;
  height: 32px;
  // background: linear-gradient(217deg, #383741 0%, #31313a 100%);
  background-color: #fff;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.13);
  border-radius: 30px;
  font-family: PingFang SC;
  font-size: 12.96px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #333333;
  text-align: left;
  font-style: normal;
  line-height: 32px;

  img {
    width: 16px;
    height: 15px;
    margin-left: 15px;
    margin-right: 6px;
  }
}

.backButton:hover {
  cursor: pointer;
  color: #666666;
  background: #ffffff;
  box-shadow: 0px 0px 8px 0px rgba(0, 50, 125, 0.14);
}
</style>
