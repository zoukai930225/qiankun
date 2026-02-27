<!--
 * @Date: 2025-04-24 10:27:01
-->
<template>
  <ContentWrap>
    <!-- 头部 -->
    <div class="header-wapper">
      <div class="time-wapper">
        <MonthSelect
          v-model="selectedMonth"
          wapperHeight="75px"
          wapperBackground="#F6F9FF"
          textMB="4px"
          @change="handleDateChange"
        />
      </div>
      <DescToolts :showTooltips="true" />
    </div>
    <!-- 排班 -->
    <div class="setting-wapper">
      <!-- 左边 -->
      <div class="left-wapper">
        <div class="item-header left-header">
          <span class="desc">月休</span>

          <el-input v-model="restDay" style="width: 50px; height: 27px" class="desc-value" />
          <span class="desc">天 </span>

          <span class="desc-button" @click="reset">重新生成</span>
        </div>
        <div class="people-wapper">
          <!-- 空页面 -->
          <div v-if="groupList?.length === 0" class="empty-wapper">
            <img
              src="@/assets/imgs/customerService/scheduling/empty.png"
              class="empty-img"
              alt=""
            />
            <span class="empty-desc">暂无数据</span>
          </div>
          <div
            v-for="(item, id) in groupList"
            :key="item.groupName"
            class="people-item"
            :style="{ background: formaGroupBg(id, 'bg') }"
          >
            <!-- <el-popover class="box-item" title="" placement="bottom-start">
              <template #reference>
                <div class="team-name"
                  ><span class="name-text">{{ item.groupName }}</span></div
                >
              </template>

              <template #default>
                <div class="popover-content"> 11111111 </div>
              </template>
            </el-popover> -->

            <div class="team-name"
              ><span class="name-text" :style="{ color: formaGroupBg(id, 'color') }">{{
                item.groupName
              }}</span></div
            >
            <div
              class="name-wapper"
              :style="{
                background: formaGroupBg(id, 'itemBg'),
                height: item.children.length * 60 - 10 + 'px'
              }"
            >
              <div v-for="it in item.children" :key="it.userName" class="name-item">
                <img :src="it.avatarOrigin" alt="" class="avator" />

                <el-popover class="box-item" title="" placement="right-start">
                  <template #reference>
                    <span class="name">{{ it.userName }}</span>
                  </template>
                  <template #default>
                    <div class="popover-content"> {{ it?.userRemark }} </div>
                  </template>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 中间 -->
      <div class="mid-wapper">
        <!--header  -->
        <div class="mid-header-wapper">
          <div class="mid-item-header">
            <div v-for="item in dataList" :key="item.date" class="mid-item">
              <span class="date">{{ item.date }}</span>
              <span class="desc">{{ item.weekday }}</span>
            </div>
          </div>
        </div>
        <!-- 内容 -->
        <div style="margin-top: 58px">
          <!-- 空页面 -->
          <div v-if="resultList?.length === 0" class="empty-wapper">
            <img
              src="@/assets/imgs/customerService/scheduling/empty.png"
              class="empty-img"
              alt=""
              style="width: 356px; height: 100%"
            />
            <span class="empty-desc">暂无数据</span>
          </div>

          <div
            class="mid-conent-item-wapper"
            v-if="resultList?.length"
            :style="{ width: dataList?.length * 87 + 'px' }"
          >
            <div
              v-for="(itemDate, idx) in dataList"
              :key="itemDate.date"
              style="display: flex; flex-direction: column"
            >
              <div v-for="(item, index) in resultList" :key="index" class="mid-conent-item">
                <div
                  class="item-content"
                  :style="{ background: formatBg(item?.schedulingJson[idx + 1]) }"
                >
                  <el-popover
                    :ref="'popoverRef' + index"
                    v-model:visible="popoverVisible[idx + 1 + item?.userName]"
                    class="box-item"
                    title=""
                    placement="right-start"
                    trigger="click"
                    width="62px !important"
                    :popper-style="{ minWidth: '62px', padding: '0', width: 'auto' }"
                  >
                    <template #reference>
                      <img
                        :src="formatItemUrl(item?.schedulingJson[idx + 1])"
                        class="icon-common"
                        @click="showItem(item, item?.schedulingJson[idx + 1])"
                      />
                    </template>
                    <!-- 设置单天排班 -->
                    <template #default>
                      <div style="width: 62px" class="popover-content">
                        <div
                          class="popover-item"
                          :class="{
                            'popover-activity': activityState === it.value
                          }"
                          v-for="it in popItem"
                          @click="settingScheduling(item, it.value, idx + 1)"
                          :key="it.value"
                          >{{ it.name }}</div
                        >
                      </div>
                    </template>
                  </el-popover>

                  {{ stateMap[item?.schedulingJson[idx + 1]] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右边 -->
      <div class="right-wapper">
        <div class="item-header right-header">
          <div v-for="item in rightHeaderList" class="item" :key="item">{{ item }}</div>
        </div>
        <div class="content-wapper">
          <!-- 空页面 -->
          <div v-if="resultList?.length === 0" class="empty-wapper">
            <img
              src="@/assets/imgs/customerService/scheduling/empty.png"
              class="empty-img"
              alt=""
            />
            <span class="empty-desc">暂无数据</span>
          </div>
          <div v-for="(item, index) in resultList" :key="index" class="item-content">
            <span class="item">{{ item.morningCount || '' }}</span>
            <span class="item">{{ item.noonCount || '' }}</span>
            <span class="item">{{ item.eveningCount || '' }}</span>
            <span class="item">{{ item.restCount || '' }}</span>
            <span class="item">{{ item.vocationCount || '' }}</span>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {
  autoScheduling,
  getAllScheduling,
  updateScheduling
} from '@/api/customerService/scheduling/index'
import DescToolts from '../components/descToolts.vue'
import MonthSelect from '../components/monthSelect.vue'
import { popItem, stateMap } from '../utils'
defineOptions({ name: 'SchedulingSetting' })
const message = useMessage()

// 定义状态
const restDay = ref(4) // 月休天数
const currentMonth = ref(new Date().getMonth()) // 当前月份
const currentYear = ref(new Date().getFullYear()) // 当前年份
const selectedMonth = ref()
const rightHeaderList = ref(['早', '中', '晚', '休', '假'])

const formatItemUrl = (state) => {
  return `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/${objUrl.value[state]}`
}

const objUrl = ref({
  MORNING: '485560199-zao-icon.png',
  EVENING: '460559430-EVENING.png',
  REST: '116358178-REST.png',
  NOON: '916567852-NOON.png',
  VOCATION: '19657866-VOCATION.png',
  TRAIN: '103735929-TRAIN.png'
})

const activityState = ref('') // 当前状态
// 当前操作项
const showItem = (item, state) => {
  activityState.value = state
  console.log(state, '当前操作项:', item)
}

const popoverVisible: any = ref({})
// 修改排班
/**
 * @description:
 * @param {*} item 当前操作row
 * @param {*} state 当前操作状态
 * @param {*} index 当前操作日期
 * @return {*}
 */
const settingScheduling = async (item, state, index) => {
  activityState.value = state
  await updateScheduling({
    dataDate: selectedMonth.value,
    userId: item.userId,
    day: index,
    shiftType: state
  })
  popoverVisible.value[index + item.userName] = false // 手动关闭对应的弹出框
  message.success('修改成功')
  initAllDataList() // 重新获取数据
}

const formatBg = (status: any) => {
  if (status === 'MORNING') {
    return '#CEF6E0'
  } else if (status === 'EVENING') {
    return '#E8E5FF'
  } else if (status === 'REST') {
    return '#FDF5A6'
  } else if (status === 'NOON') {
    return '#FFE8C4'
  } else if (status === 'VOCATION') {
    return '#FBD8EA'
  } else if (status === 'TRAIN') {
    return '#CDE1FF'
  } else if (status === 'NULL') {
    return '#ffffff'
  }
}

const groupArr = [
  {
    bg: '#CDE1FF',
    color: '#0064FF',
    itemBg: '#F7FAFF'
  },
  {
    bg: '#FFF5E5',
    color: '#FF6A00',
    itemBg: '#FFFDF9'
  },
  {
    bg: '#FFEEF8',
    color: '#DF007F',
    itemBg: '#FFF7FC'
  },
  {
    bg: '#EEFDF4',
    color: '#00A500',
    itemBg: '#FAFFFC'
  }
]

const formaGroupBg = (index, type) => {
  const idx = index % 4
  return groupArr[idx][type]
}

// 表头
const dataList = ref()

const reset = () => {
  ElMessageBox.confirm(
    `是否确定重置${currentMonth.value + 1}月的排班数据，重置后，您${currentMonth.value + 1}月的设置将无法找回！`,
    '系统提醒',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning'
    }
  )
    .then(async () => {
      await autoScheduling({
        dataDate: selectedMonth.value,
        restDay: restDay.value
      })
      message.success('重置成功')
      initAllDataList() // 重新获取数据
    })
    .catch(() => {
      console.log('取消执行')
    })
}

const initDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  // 获取当前月份的天数
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // 创建一个数组来存储结果
  const result: any = []

  // 添加当前月份的每一天，并标注对应的星期几
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }) // 获取星期几的缩写
    result.push({
      date: `${String(day)}`,
      weekday
    })
  }
  console.log('当前月份的每一天:', result)
  return result
}

// 日期变更 数据变化
const handleDateChange = () => {
  initAllDataList()
}

onMounted(() => {
  // 初始化月份
  const month = String(currentMonth.value + 1).padStart(2, '0') // 补零
  selectedMonth.value = `${currentYear.value}-${month}`
  dataList.value = initDate()

  initAllDataList()
})

// 人员分组
const groupList = ref() //人员2唯数组
const resultList = ref() // 1唯数组

// 获取所有原始数据
const initAllDataList = async () => {
  const params = {
    dataDate: selectedMonth.value
  }
  const res = await getAllScheduling(params)
  console.log(res, 'res111')
  if (res && res?.length > 0) {
    formatGroupList(res)
  } else {
    groupList.value = []
    resultList.value = []
  }
}

const formatGroupList = (arr) => {
  const obj = {}
  arr.forEach((item) => {
    const key = item.groupName
    if (!obj[key]) {
      obj[key] = []
    }
    obj[key].push(item)
  })
  // 人员数组
  groupList.value = Object.keys(obj).map((key) => {
    return {
      groupName: key,
      children: obj[key]
    }
  })
  // 数据
  console.log('分组后的数据groupList.value:', groupList.value)
  const result: any = []
  groupList.value.forEach((item) => {
    item.children.forEach((child) => {
      result.push({
        ...child,
        schedulingJson: JSON.parse(child.schedulingJson)
      })
    })
  })

  console.log('分组后的数据result:', result)
  resultList.value = result
}
</script>

<style lang="less" scoped>
.header-wapper {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  .time-wapper {
    width: 227px;
    height: 65px;
    margin-right: 20px;
  }
}
.setting-wapper {
  display: flex;
  flex-direction: row;
  .item-header {
    width: 100%;
    height: 48px;
  }
  .left-wapper {
    width: 230px;
    height: 100%;
    margin-right: 20px;

    .left-header {
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      line-height: 48px;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      background: #ffffff;
      box-sizing: border-box;
      border: 1px solid #d8d8d8;
      .desc {
        font-size: 14px;
        color: #999999;
      }
      .desc-value {
        width: 50px;
        height: 27px;
        line-height: 27px;
        text-align: center;
        border-radius: 4px;
        background: #eeeeee;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        margin: 0 3px;
      }
      .desc-button {
        width: 80px;
        height: 32px;
        /* 自动布局 */
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        background: #0064ff;
        cursor: pointer;
        color: white;
        font-size: 14px;
        margin-left: 20px;
      }
    }

    .people-wapper {
      min-height: 800px;
      .people-item {
        cursor: pointer;
        margin: 11px 0;
        background: pink;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 4px;
        overflow: hidden;
        .team-name {
          width: 54px;
          text-align: center; /* 水平居中 */
          cursor: pointer;
          .name-text {
            writing-mode: vertical-rl; /* 文字竖排，从右到左 */
            text-orientation: upright; /* 保持文字直立 */
            font-size: 14px;
            font-weight: 500;
            color: #0064ff;
          }
        }
        .name-wapper {
          padding: 6px 0;
          box-sizing: border-box;
          background: #f7faff;
          flex: 1;
          .name-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 24px;
            .avator {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              margin-right: 10px;
              margin-left: 14px;
            }
            .name {
              font-size: 14px;
              color: #333333;
              font-family: PingFang SC;
              margin-left: 10px;
            }
          }
          .name-item:last-child {
            margin-bottom: 0;
          }
        }
      }
      .people-item:first-child {
        margin-top: 18px;
      }
    }
  }
  .mid-wapper {
    flex: 1;
    overflow-x: scroll;
    // 兼容 Firefox
    scrollbar-width: auto;
    // 兼容 Chrome/Safari
    &::-webkit-scrollbar {
      height: 12px;
      background: #f0f0f0;
      display: block;
    }
    &::-webkit-scrollbar-thumb {
      background: #c0c4cc;
      border-radius: 6px;
    }
    position: relative;
    width: calc(
      100vw - var(--left-menu-min-width) - var(--app-content-padding) - var(--app-content-padding) -
        436px
    );
    .mid-header-wapper {
      margin-bottom: 10px;
      height: 48px;
      position: absolute;
      .mid-item-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
        background: #f6f9ff;
        .mid-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 87px;
          flex-shrink: 0; /* 防止压缩 */
          height: 100%;
          justify-content: space-around;
          .date {
            font-size: 14px;
            font-weight: 500;
            color: #0064ff;
          }
          .desc {
            font-size: 14px;
            color: #333333;
          }
        }
      }
    }
    .mid-conent-item-wapper {
      border-radius: 4px;
      background: #ffffff;
      border: 1px solid #cfdbf1;
      display: flex;
      flex-direction: row;
      border-right: none;
      overflow: hidden;
      .mid-conent-item {
        width: 86px;
        height: 59.38px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #cfdbf1;
        border-bottom: 1px solid rgba(207, 219, 241, 0.4);
        .item-content {
          width: 67px;
          height: 48px;
          border-radius: 2px;
          background: #cde1ff;
          text-align: center;
          line-height: 48px;
          font-size: 14px;
          color: #3d3d3d;
          position: relative;
          cursor: pointer;
          .icon-common {
            width: 12px;
            height: 12px;
            position: absolute;
            top: 4px;
            right: 6px;
            cursor: pointer;
          }
        }
      }
      .mid-conent-item:last-child {
        border-bottom: none;
      }
    }
  }
  .right-wapper {
    margin-left: 14px;
    width: 166px;
    height: 100%;

    .right-header {
      border-radius: 4px;
      background: #f0f0f0;
      display: flex;
      flex-direction: row;
      line-height: 48px;
      margin-bottom: 10px;
      .item {
        text-align: center;
        flex: 1;
        font-size: 14px;
        color: #333333;
      }
    }
    .content-wapper {
      min-height: 800px;
      border-radius: 4px;
      background: #fafcff;
      padding-top: 10px;
      box-sizing: border-box;
      padding-bottom: 10px;
      .item-content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        line-height: 20px;
        position: relative;
        padding: 10px 0;
        box-sizing: border-box;
        margin: 20px 0 10px 0;

        .line {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 0;
          height: 1px;
          background: #d8d8d8;
        }

        box-sizing: border-box;
        .item {
          text-align: center;
          flex: 1;
          font-size: 14px;
          color: #333333;
        }
      }
      .item-content:first-child {
        margin-top: 0;
      }
      .item-content:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.box-item {
  width: 62px !important;
}
.popover-content {
  padding: 6px;
  box-sizing: border-box;

  .popover-item {
    cursor: pointer;
    width: 50px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    margin-bottom: 4px;
    border-radius: 4px;
  }
  .popover-activity {
    background: #eaf2ff;
  }
}

.empty-wapper {
  margin-top: 243px;
  display: flex;
  flex-direction: column;

  align-items: center;
  .empty-img {
    width: 162px;
    height: 100%;
  }
  .empty-desc {
    margin-top: 10px;
    font-family: PingFang SC;
    font-size: 14px;
    color: #999999;
  }
}
:deep(.el-input__wrapper) {
  box-shadow: none;
  background: #eeeeee;
  border-radius: 4px;
  height: 27px;
  padding-left: 45%;
}
</style>
