<template>
  <div class="peopleTotal">
    <div class="peopleTotal-list">
      <div v-for="(item, index) in otherList" :key="index">
        <div
          class="item"
          :class="{
            itemRight: index === otherList.length - 1,
            itemSelect: index === selectIndex,
            itemOne: index === 0,
            darkActivity: modelType && index === selectIndex,
            dartItem: modelType,
            [`dark-item-${index}`]: index != selectIndex && modelType
          }"
          @click="seePeopleDetail(index)"
        >
          <div class="itemSelectTop" v-if="index === selectIndex && !modelType"></div>
          <div class="itemSelectTopNormal" v-else></div>
          <div class="item-top">
            <img
              class="item-top-icon"
              :class="{
                'item-top-iconAll': index === 0
              }"
              :src="modelType ? item.darkIcon || item.icon : item.icon"
            />
            <div class="item-top-title" :class="modelType ? 'dark-item-top-title' : ''">{{
              item.title
            }}</div>
          </div>
          <div class="item-value" :class="modelType ? 'dark-item-value' : ''">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <PeopleDetailDialog ref="peopleDetailDialogRef" />
  </div>
</template>
<script lang="ts" setup>
import { numberFormateShow } from '@/utils/formatter'
import { propTypes } from '@/utils/propTypes'
import { onMounted, ref } from 'vue'
import PeopleDetailDialog from './peopleDetailDialog.vue'

import hrBashboardIcon1 from '@/assets/imgs/hrAdmin/hr_bashboard_icon_1.png'
import hrBashboardIcon2 from '@/assets/imgs/hrAdmin/hr_bashboard_icon_2.png'
import hrBashboardIcon3 from '@/assets/imgs/hrAdmin/hr_bashboard_icon_3.png'
import hrBashboardIcon4 from '@/assets/imgs/hrAdmin/hr_bashboard_icon_4.png'
import hrBashboardIcon0 from '@/assets/imgs/hrAdmin/hr_bashboard_icon_all.png'

import hrBashboardIcon1Dark from '@/assets/imgs/hrAdmin/hr_bashboard_icon_1-dark.png'
import hrBashboardIcon2Dark from '@/assets/imgs/hrAdmin/hr_bashboard_icon_2-dark.png'
import hrBashboardIcon3Dark from '@/assets/imgs/hrAdmin/hr_bashboard_icon_3-dark.png'
import hrBashboardIcon4Dark from '@/assets/imgs/hrAdmin/hr_bashboard_icon_4-dark.png'
import hrBashboardIcon0Dark from '@/assets/imgs/hrAdmin/hr_bashboard_icon_all-dark.png'

import * as PersonRosterApi from '@/api/hrAdmin/personRoster'

const getToday = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const end = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  return end
}

const props = defineProps({
  icon: propTypes.any.def(),
  title: propTypes.string.def(''),
  value: propTypes.string.def(''), // 这里有一个 value prop
  modelType: propTypes.bool.def(false),
  date: propTypes.string.def('')
})

const list = ref([])
const otherList = ref<any[]>([])
const selectIndex = ref(0)

watch(
  () => props.date,
  (value) => {
    if (value) {
      getList()
    }
  }
)

const getList = async () => {
  const time = props.date ? props.date : getToday()
  const data = await PersonRosterApi.humanResourcesStatisticsIncumbency(time)

  if (data) {
    list.value = data || []
  }
  handleStaticsData()
  if (otherList.value.length > 0) {
    emit('selectCompany', otherList.value[selectIndex.value].name)
  }
}

const handleStaticsData = () => {
  otherList.value = []
  list.value.forEach((item) => {
    let icon = hrBashboardIcon0
    let darkIcon = hrBashboardIcon0Dark
    let title = ''
    let index = 0
    let company = item.name
    if (item.name === 'ALL') {
      icon = hrBashboardIcon0
      darkIcon = hrBashboardIcon0Dark
      title = '总在职人数'
      index = 0
      company = 'ALL'
    } else if (item.name === 'SecretWorld') {
      icon = hrBashboardIcon3
      darkIcon = hrBashboardIcon3Dark
      title = '杭州'
      index = 1
    } else if (item.name === 'ShiXia') {
      icon = hrBashboardIcon2
      darkIcon = hrBashboardIcon2Dark
      title = '新乡'
      index = 2
    } else if (item.name === 'KeFan') {
      icon = hrBashboardIcon1
      darkIcon = hrBashboardIcon1Dark
      title = '义乌'
      index = 3
    } else if (item.name === 'ZhouWen') {
      icon = hrBashboardIcon4
      darkIcon = hrBashboardIcon4Dark
      title = '芜湖'
      index = 4
    }
    otherList.value[index] = {
      title,
      name: company,
      icon: icon,
      darkIcon: darkIcon,
      value: numberFormateShow(item.number)
    }
  })
}

const peopleDetailDialogRef = ref()

const seePeopleDetail = (index) => {
  if (selectIndex.value !== index) {
    emit('selectCompany', otherList.value[index].name)
  } else {
    peopleDetailDialogRef.value.open('online', { company: otherList.value[index].name })
  }
  selectIndex.value = index
}

const emit = defineEmits(['selectCompany'])

onMounted(() => {
  // getList()
})
</script>

<style lang="scss" scoped>
.peopleTotal {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  z-index: 99;

  &-title {
    font-size: 16px;
    color: #333333;
    line-height: 22px;
  }
  &-list {
    width: calc(100vw - 270px);
    display: flex;
    flex-wrap: wrap;
    .item {
      flex: 1;
      width: calc(25vw - 330px / 4);
      height: 140px;
      margin-right: 20px;
      background: #f9f9f9;
      box-shadow: 0px 0px 20px 2px #d8e4fa;
      border-radius: 6px;
      cursor: pointer;
      &-top {
        margin-left: 30px;
        padding-top: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        &-icon {
          width: 16px;
          height: 18px;
        }
        &-iconAll {
          width: 18px;
          height: 14px;
        }
        &-title {
          padding-left: 14px;
          font-weight: 500;
          font-size: 16px;
          color: #666666;
        }
        .dark-item-top-title {
          color: #f7cd9b;
        }
      }
      &-value {
        margin-left: 30px;
        padding-top: 20px;
        font-weight: 500;
        font-size: 40px;
        color: #333333;
        line-height: 56px;
      }
      .dark-item-value {
        color: #f7cd9b;
      }
    }
    .itemOne {
      margin-right: calc(75vw - 330px / 4 - 120px);
      margin-bottom: 20px;
    }
    .itemRight {
      margin-right: 0px;
    }
    .itemSelect {
      background: #fff;
    }
    .itemSelectTop {
      width: calc(100%);
      height: 6px;
      background: #0064ff;
      border-radius: 6px;
    }
    .itemSelectTopNormal {
      height: 6px;
      background: transparent;
      border-radius: 6px;
    }
  }
}
.darkActivity {
  background: url('@/assets/imgs/hrAdmin/activity-item.png') no-repeat !important;
  background-size: 100% 100% !important;
}
.dartItem {
  box-shadow: none !important;
}
.dark-item-0 {
  background: url('@/assets/imgs/hrAdmin/all.png') no-repeat !important;
  background-size: 100% 100% !important;
}
.dark-item-1 {
  background: url('@/assets/imgs/hrAdmin/dark-item-1.png') no-repeat !important;
  background-size: 100% 100% !important;
}
.dark-item-2 {
  background: url('@/assets/imgs/hrAdmin/dark-item-2.png') no-repeat !important;
  background-size: 100% 100% !important;
}
.dark-item-3 {
  background: url('@/assets/imgs/hrAdmin/dark-item-3.png') no-repeat !important;
  background-size: 100% 100% !important;
}
.dark-item-4 {
  background: url('@/assets/imgs/hrAdmin/dark-item-4.png') no-repeat !important;
  background-size: 100% 100% !important;
}
</style>
