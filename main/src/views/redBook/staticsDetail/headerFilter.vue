<template>
  <div class="headerFilter">
    <div class="headerFilter-info">
      <div class="headerFilter-info-link">文章链接:</div>
      <a
        :href="decodeURIComponent(param['link'] || '')"
        target="_blank"
        class="linkText underlineText"
      >
        小红书文章链接
      </a>
    </div>
    <div
      class="headerFilter-month"
      :class="{ 'headerFilter-select': staticMode === 0 }"
      @click="changeStaticMode(0)"
      >按天统计</div
    >
    <div
      class="headerFilter-day"
      :class="{ 'headerFilter-select': staticMode === 1 }"
      @click="changeStaticMode(1)"
      >按时段统计</div
    >
    <div class="headerFilter-date"> 选择日期 </div>
    <div class="headerFilter-dateSelect">
      <el-date-picker
        v-if="staticMode === 0"
        type="month"
        class="!w-140px"
        v-model="selectMonth"
        value-format="YYYY-MM"
        placeholder="请选择月份"
        @change="dateFilterComplete"
      />
      <el-date-picker
        v-if="staticMode === 1"
        class="!w-140px"
        v-model="selectDate"
        value-format="YYYY-MM-DD"
        placeholder="请选择日期"
        @change="dateFilterComplete"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineOptions({ name: 'HeaderFilter' })

defineProps({
  param: propTypes.object.def({})
})

// 统计模式 0: 按天 1: 按时段
const staticMode = ref(0)

const selectMonth = ref('')
const selectDate = ref('')

// 切换统计模式
const changeStaticMode = (mode: number) => {
  staticMode.value = mode
  dateFilterComplete()
}

//日期筛选完成
const dateFilterComplete = () => {
  if (staticMode.value === 0) {
    emit('dateFilter', staticMode.value, selectMonth.value)
  } else if (staticMode.value === 1) {
    emit('dateFilter', staticMode.value, selectDate.value)
  }
}

const emit = defineEmits(['dateFilter']) // 定义 success 事件，用于操作成功后的回调

defineExpose({})

/** 初始化 **/
onMounted(() => {})
</script>

<style lang="scss" scoped>
.headerFilter {
  margin-left: 20px;
  margin-right: 20px;
  padding-top: 25px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-size: 14px;
  align-items: center;
  color: #333333;
  line-height: 22px;
  &-info {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    align-items: center;
    margin-right: auto;
    &-link {
      padding-right: 10px;
    }
  }
  &-month {
    padding-right: 16px;
    cursor: pointer;
  }

  &-day {
    padding-right: 16px;
    cursor: pointer;
  }

  &-date {
    padding-right: 8px;
  }
  &-select {
    color: #126efe;
  }
}
</style>
