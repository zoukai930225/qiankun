<template>
  <div class="dashboard" :class="modelType ? 'dark-bg' : ''">
    <!-- <img class="dashboard-bg" :src="bgImg()" mode="heightFix" /> -->
    <div class="dashboard-other">
      <div class="flex-row" style="margin-bottom: 10px">
        <el-switch v-model="modelType" size="large" style="--el-switch-on-color: #5d432a" />
        <span
          class="model-desc"
          :style="{
            color: modelType ? '#FFD7A4' : '#333333'
          }"
          >深色模式</span
        >
      </div>
      <div class="top-bg">
        <!-- 背景颜色 -->
        <!-- prettier-ignore -->
        <div
          class="bg-postion"
          :style="{
            backgroundImage: `url(${topBg})`,
            backgroundSize: '100% auto',
            backgroundRepeat: 'no-repeat',
            }">
        </div>

        <DashboardSection
          title="期末在职人数"
          :icon="hrBashboardPeopleIcon"
          :modelType="modelType"
          :darkIcon="hrBashboardPeopleIconDark"
        >
          <slot>
            <div class="time-wapper">
              <div class="flex-row">
                <span class="icon" :class="modelType ? 'dark-icon' : 'light-icon'"></span>
                <span class="label" :class="modelType ? 'dark-label' : 'light-label'">日期</span>
              </div>
              <!-- prettier-ignore -->
              <el-date-picker
                style="width: 280px"
                :style="{
                  background: `${modelType?'#020101':''}`,
                  border: `${modelType?'1px solid #FFD7A4':''}`,}"
                v-model="timeValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                value-format="YYYY-MM-DD"
                @change="timeChange"
                :disabled-date="disabledDate" 
              />
            </div>
          </slot>
        </DashboardSection>
        <PeopleTotal
          @select-company="selectCompany"
          :modelType="modelType"
          :date="timeValue && timeValue[1]"
        />
      </div>

      <DashboardSection
        style="margin-top: 30px"
        title="人力资源分布看板"
        :icon="hrBashboardStaticsIcon"
        :darkIcon="hrBashboardStaticsIconDark"
        :modelType="modelType"
      />
      <div class="flex-row" style="margin-top: 20px">
        <div
          style="width: 35%; height: 553px; background: white; margin-right: 20px"
          :style="{
            background: modelType ? '#303030' : '#fff'
          }"
        >
          <OnJobStatics ref="onJobStaticsRef" :date="timeValue" :modelType="modelType" />
        </div>
        <div
          style="width: 63%; background: white; height: 553px"
          :style="{
            background: modelType ? '#303030' : '#fff'
          }"
        >
          <!-- 各部门入离职情况 -->
          <TotalStaticsInfo
            ref="totalStaticsInfoRef"
            :timeValue="timeValue"
            :modelType="modelType"
            :date="timeValue"
          />
        </div>
      </div>

      <!-- 下面圆环 -->
      <DashboardOtherStatics
        ref="dashboardOtherStaticsRef"
        :modelType="modelType"
        :date="timeValue"
      />
      <PeopleDetailDialog ref="peopleDetailDialogRef" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import hrBashboardPeopleIconDark from '@/assets/imgs/hrAdmin/hr_bashboard_people-dark.png'
import hrBashboardPeopleIcon from '@/assets/imgs/hrAdmin/hr_bashboard_people.png'
import { onMounted, ref } from 'vue'
import DashboardOtherStatics from './components/dashboardOtherStatics.vue'
import DashboardSection from './components/dashboardSection.vue'
import OnJobStatics from './components/onJobStatics.vue'
import PeopleDetailDialog from './components/peopleDetailDialog.vue'

import PeopleTotal from './components/peopleTotal.vue'
import TotalStaticsInfo from './components/totalStaticsInfo.vue'

import hrBashboardStaticsIconDark from '@/assets/imgs/hrAdmin/hr_bashboard_statics-dark.png'
import hrBashboardStaticsIcon from '@/assets/imgs/hrAdmin/hr_bashboard_statics.png'

import darkTopBg from '@/assets/imgs/hrAdmin/dark-top-bg.png'
import lightTopBg from '@/assets/imgs/hrAdmin/light-top-bg.png'

import hrAminHangzhouBg from '@/assets/imgs/hrAdmin/hrAmin_hangzhou.png'
import hrAminKeFanBg from '@/assets/imgs/hrAdmin/hrAmin_keFan.png'
import hrAminShixiaBg from '@/assets/imgs/hrAdmin/hrAmin_shiXia.png'
import hrAminZhouWenBg from '@/assets/imgs/hrAdmin/hrAmin_zhouWen.png'

import hrAminHangzhouBgDark from '@/assets/imgs/hrAdmin/hrAmin_hangzhou-darkbg.png'
import hrAminKeFanBgDark from '@/assets/imgs/hrAdmin/hrAmin_keFan-dark.png'
import hrAminShixiaBgDark from '@/assets/imgs/hrAdmin/hrAmin_shiXia-dark.png'
import hrAminZhouWenBgDark from '@/assets/imgs/hrAdmin/hrAmin_zhouWen-dark.png'

defineOptions({ name: 'HrDashboard' })

const onJobStaticsRef = ref()
const totalStaticsInfoRef = ref()
const dashboardOtherStaticsRef = ref()
const modelType = ref(false) //主题色
const timeValue = ref() //时间搜索

/** 查询列表 */
const getList = async () => {
  onJobStaticsRef.value.queryIncumbencyByDept(currentCompany.value)
  totalStaticsInfoRef.value.queryOnboardResignate(currentCompany.value)
  dashboardOtherStaticsRef.value.getList(currentCompany.value)
}

const topBg = computed(() => {
  return modelType.value ? darkBgImg() : bgImg()
})

const bgImg = () => {
  if (currentCompany.value === 'ALL') {
    return lightTopBg
  } else if (currentCompany.value === 'SecretWorld') {
    return hrAminHangzhouBg
  } else if (currentCompany.value === 'ShiXia') {
    return hrAminShixiaBg
  } else if (currentCompany.value === 'KeFan') {
    return hrAminKeFanBg
  } else if (currentCompany.value === 'ZhouWen') {
    return hrAminZhouWenBg
  }
  return lightTopBg
}

const darkBgImg = () => {
  if (currentCompany.value === 'ALL') {
    return darkTopBg
  } else if (currentCompany.value === 'SecretWorld') {
    return hrAminHangzhouBgDark
  } else if (currentCompany.value === 'ShiXia') {
    return hrAminShixiaBgDark
  } else if (currentCompany.value === 'KeFan') {
    return hrAminKeFanBgDark
  } else if (currentCompany.value === 'ZhouWen') {
    return hrAminZhouWenBgDark
  }
  return darkTopBg
}

// 禁用日期
const today = computed(() => new Date().toISOString().split('T')[0])
const disabledDate = (dateStr) => {
  const selectedDate = new Date(dateStr)
  return selectedDate > new Date(today.value)
}

/** 初始化 **/
onMounted(() => {
  initData()
  getList()
})

const timeChange = () => {
  getList()
}

//初始化日期
const initData = () => {
  //开始日期 默认当月的第一天   结束日期 默认当前日期
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const start = `${year}-${month < 10 ? '0' + month : month}-01`
  const end = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
  timeValue.value = [start, end]
}

const currentCompany = ref('')
const peopleDetailDialogRef = ref()
const selectCompany = (company: string) => {
  currentCompany.value = company
  getList()
}
</script>

<style lang="scss" scoped>
.dashboard {
  min-width: 1200px;
  padding: 0px 20px;
  box-sizing: border-box;
  position: relative;
  &-bg {
    right: 0px;
    position: absolute;
    height: 174px;
    z-index: 1;
  }
  &-other {
    position: relative;
    z-index: 10;
  }
  :deep(.adminScrollBar) {
    margin-top: 200px !important;
  }
}
:deep(.adminScrollBar) {
  margin-top: 200px;
}
.adminScrollBar {
  margin-top: 200px;
}
// :deep(.v-layout-content-scrollbar) {
//   margin-top: 0px !important;
// }
.adminScrollBar {
  margin-top: 200px;
}
</style>

<style scoped>
:deep(.adminScrollBar) {
  margin-top: 200px !important;
}

.model-desc {
  font-weight: 500;
  font-size: 18px;
  color: #333333;
  line-height: 25px;
  text-align: center;
  font-style: normal;
  margin-left: 15px;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.top-bg {
  position: relative;
  .bg-postion {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    height: 180px;
    width: 100%;
  }
}
.time-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  .icon {
    width: 6px;
    height: 16px;
    border-radius: 3px;
    margin-right: 5px;
  }
  .dark-icon {
    background: #ffd7a4;
  }
  .light-icon {
    background: #0064ff;
  }
  .label {
    margin-right: 10px;
    font-weight: 500;
    font-size: 16px;

    line-height: 20px;
    text-align: center;
    font-style: normal;
  }
  .dark-label {
    color: #ffd7a4;
  }
  .light-label {
    color: #0064ff;
  }
}
.dark-bg {
  background: url('@/assets/imgs/hrAdmin/bg.png') no-repeat;
  background-size: 100% 100%;
}
</style>
