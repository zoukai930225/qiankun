<template>
  <div class="dashboardOtherStatics">
    <div v-for="(value, index) in list" :key="index">
      <div
        class="item"
        :class="{ itemRight: index % 3 === 2, darkItem: modelType }"
        :style="{ width: pieChartWidth() }"
      >
        <OtherStaticSection :title="sectionTitle(value)" :modelType="modelType" />
        <OtherStaticsChart
          :ref="getOtherStaticsChartRef"
          class="item-chart"
          :company="selectCompany"
          :modelType="modelType"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import OtherStaticSection from './otherStaticSection.vue'
import OtherStaticsChart from './otherStaticsChart.vue'

import * as PersonRosterApi from '@/api/hrAdmin/personRoster'

const props = defineProps({
  title: propTypes.string.def(''),
  modelType: propTypes.bool.def(false),
  date: propTypes.array.def([])
})

let otherStaticsChartRefList = ref<HTMLElement[]>([])
const getOtherStaticsChartRef = (el: any) => {
  if (el) {
    otherStaticsChartRefList.value.push(el)
  }
}

const clientWidth = ref(window.document.documentElement.clientWidth)

const pieChartWidth = () => {
  if (clientWidth.value >= 1800) {
    return `calc((100vw - 310px) / 3)`
  } else {
    return `calc((100vw - 290px) / 2)`
  }
}

const resizeHandler = () => {
  clientWidth.value = window.document.documentElement.clientWidth
}

const sectionTitle = (value: any) => {
  return `${value.title}`
}

const selectCompany = ref('')
const list = ref<any[]>([])

const getList = async (company: string) => {
  if (!company) return
  selectCompany.value = company

  const params = {
    beginDate: props.date[0],
    endDate: props.date[1],
    company
  }
  const data = await PersonRosterApi.humanResourcesShape(params)
  console.log(data, '4444')
  if (data) {
    otherStaticsChartRefList.value = []
    list.value = data || []
  }
  setTimeout(() => {
    otherStaticsChartRefList.value?.forEach((item: any, index) => {
      item.handleReqData(list.value[index].list || [], list.value[index].title || '')
    })
  }, 30)
}

onMounted(() => {
  window.addEventListener('resize', resizeHandler)
  resizeHandler()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})

defineExpose({ getList })
</script>

<style lang="scss" scoped>
.dashboardOtherStatics {
  margin-top: 16px;
  width: calc(100vw - 250px);
  display: flex;
  flex-wrap: wrap;
  background: transparent;
  .item {
    // width: calc((100vw - 310px) / 3);
    // width: calc((100vw - 290px) / 2);
    // min-width: 536px;
    height: 400px;
    margin-right: 20px;
    margin-bottom: 16px;
    background: linear-gradient(270deg, #ffffff 0%, #ffffff 100%);
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    &-chart {
      margin-top: 62px;
      height: 234px;
      margin-right: 15px;
    }
  }
  .darkItem {
    background: #303030;
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 2px;
  }
  .itemRight {
    // margin-right: 0px;
  }
}
</style>
