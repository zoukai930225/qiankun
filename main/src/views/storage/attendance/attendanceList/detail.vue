<template>
  <div v-loading="loading">
    <el-row :gutter="28" class="header">
      <el-col :span="12">
        <el-card class="baseinfo">
          <div class="tip">
            <div class="tip-content">
              <div class="baseinfo-icon"></div>
              <b>基本信息</b>
            </div>
          </div>
          <el-form label-position="top" label-width="122" inline>
            <el-form-item label="姓名">{{ baseInfo?.userName }}</el-form-item>
            <el-form-item label="部门">{{ baseInfo?.departmentName }}</el-form-item>
            <el-form-item label="岗位">{{ baseInfo?.jobName }}</el-form-item>
            <el-form-item label="考勤周期">{{ period }}</el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="statistic">
          <div class="tip">
            <div class="tip-content">
              <div class="statistic-icon"></div>
              <b>异常统计</b>
            </div>
          </div>
          <div class="card">
            <div class="card-box" v-for="(item, index) in abnormalInfo" :key="index">
              <div class="card-item">
                <div class="content">
                  <div class="icon">
                    <img :src="item.src" alt="" />
                  </div>
                  <div class="info">
                    <div class="title">{{ item.title }}</div>
                    <div class="times">{{ item.times }}</div>
                  </div>
                </div>
              </div>
              <div v-if="index !== 2" class="line"></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="table-part" shadow="never">
      <div class="table-title">
        <div class="icon"></div>
        <b class="title">考勤信息</b>
      </div>
      <div class="table-content">
        <div class="table-header">
          <div class="table-column1 column">日期</div>
          <div class="table-column2 column">班次类型</div>
          <div class="table-column3 column">打卡记录</div>
          <div class="table-column4 column">考勤状态</div>
          <div class="table-column5 column">备注</div>
          <div class="table-column6 column">操作</div>
        </div>
        <div
          class="table-body"
          v-loading="loading"
          ref="tableBody"
          @scroll="onScrollTableBody($event)"
        >
          <div v-if="tableData.length">
            <el-card class="row" v-for="item in tableData" :key="item.attendanceSummaryId">
              <div class="table-column1 column">{{ item.attendanceDate }}</div>
              <div class="table-column2 column">{{ item.shiftType }}</div>
              <div class="table-column3 column">
                <div
                  class="checkInRecordVos-item"
                  v-for="(ele, index) in item.checkInRecordVos"
                  :key="index"
                >
                  <div class="dot">{{ index + 1 }}</div>
                  <span v-if="item.shiftType === '夜班'">当日&nbsp;</span>
                  <span class="time">
                    {{ ele.checkTimeStart }}
                    <img
                      v-if="!ele.checkTimeStart"
                      class="w100%"
                      src="@/assets/imgs/storage/attendance-empty-time.png"
                    />
                  </span>
                  <span>&nbsp;-&nbsp;</span>
                  <span v-if="item.shiftType === '夜班'">次日&nbsp;</span>
                  <span class="time"
                    >{{ ele.checkTimeEnd }}
                    <img
                      v-if="!ele.checkTimeEnd"
                      class="w100%"
                      src="@/assets/imgs/storage/attendance-empty-time.png"
                    />
                  </span>
                  <CheckInRecord class="status" :attendance-status="ele.attendanceStatus" />
                </div>
              </div>
              <div class="table-column4 column"
                ><AttendanceStatusTag :attendance-status-name="item.attendanceStatus!"
              /></div>
              <div class="table-column5 column remark">
                <el-tooltip placement="left">
                  <template #content>
                    <div class="remark-content">
                      {{ item.remark }}
                    </div>
                  </template>
                  <div>{{ item.remark }}</div>
                </el-tooltip>
              </div>
              <div class="table-column6 column">
                <el-button link type="primary" @click="onClickUpdateBtn(item)">
                  <div class="update-icon"> </div>
                  <span>变更</span>
                </el-button>
              </div>
            </el-card>
          </div>
          <div v-else class="el-table__empty-block">
            <span class="el-table__empty-text">
              <img src="@/assets/imgs/empty/empty1.png" alt="" />
              <div>暂无相关内容</div>
            </span>
          </div>
        </div>
        <div class="table-footer" :class="{ shadow: showShadow }" ref="tableFooter">
          <Pagination
            :total="total"
            v-model:page="queryParams.page"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </div>
    </el-card>
  </div>
  <update-detail-drawer
    v-model="isShowDrawer"
    :date="dailyDetailDate"
    @after-submit="getList"
    :user-id="queryParams.userId!"
  />
</template>
<script lang="ts" setup>
import UpdateDetailDrawer from './components/updateDetailDrawer.vue'
import { getAttendanceDetail } from '@/api/storage/attendance'
import AttendanceStatusTag from './components/attendanceStatus.vue'
import CheckInRecord from './components/checkInRecord.vue'
import LateIcon from '@/assets/imgs/storage/attendance-late.png'
import Early from '@/assets/imgs/storage/attendance-early.png'
import Lack from '@/assets/imgs/storage/attendance-lack.png'

const { params, query } = useRoute()

const loading = ref(false)
const total = ref(1)
const queryParams = reactive<StorageAttendance.GetUpdateDetailParams>({
  attendanceDateEnd: query.attendanceDateEnd as string,
  attendanceDateStart: query.attendanceDateStart as string,
  userId: params.id as string,
  page: 1,
  pageSize: 10
})
const baseInfo = ref<StorageAttendance.BaseInfo>({})
const isShowDrawer = ref(false)
const abnormalInfo = computed(() => [
  {
    title: '迟到 ( 次数 )',
    times: baseInfo.value.lateCount!,
    src: LateIcon
  },
  {
    title: '早退 ( 次数 )',
    times: baseInfo.value.earlyCount!,
    src: Early
  },
  {
    title: '缺卡 ( 次数 )',
    times: baseInfo.value.missingCardsCount!,
    src: Lack
  }
])
const tableData = ref<StorageAttendance.AttendanceDetailItem[]>([])
const dailyDetailDate = ref('')
const showShadow = ref(false)
const tableFooter = ref()
const tableBody = ref()

const period = computed(() => `${query.attendanceDateStart} 至 ${query.attendanceDateEnd}`)

async function getList() {
  loading.value = true
  try {
    const res = await getAttendanceDetail(queryParams)
    baseInfo.value = res.basicInfo
    tableData.value = res.page.records
    total.value = res.page.total
  } catch (error) {
  } finally {
    onScrollTableBody()
    loading.value = false
  }
}

function onClickUpdateBtn(row: StorageAttendance.AttendanceDetailItem) {
  isShowDrawer.value = true
  dailyDetailDate.value = row.attendanceDate!
}

/**
 * 动态显示或隐藏分页器的阴影
 */
async function onScrollTableBody(e?: any) {
  if (!e) {
    // 用于判断初始状态是否需要阴影
    await nextTick()
    if (tableBody.value.scrollHeight - tableBody.value.scrollTop !== 500) {
      showShadow.value = true
    } else {
      showShadow.value = false
    }
    return
  }

  if (e.target.scrollHeight - e.target.scrollTop !== 500) {
    showShadow.value = true
  } else {
    showShadow.value = false
  }
}

onMounted(async () => {
  await Promise.all([getList()])
})
</script>
<style lang="less" scoped>
.header {
  min-width: 1294px;
  flex-wrap: wrap;
}
.tip {
  width: 118px;
  height: 45px;
  background: url('@/assets/imgs/storage/attendance-tip.png');
  background-size: contain;
  margin-left: -38px;

  .tip-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    color: #fff;

    .icon {
      width: 13px;
      height: 13px;
      margin-right: 13px;
    }

    .baseinfo-icon {
      .icon();
      background: url('@/assets/imgs/storage/attendance-baseinfo-icon.png');
      background-size: contain;
    }

    .statistic-icon {
      .icon();
      background: url('@/assets/imgs/storage/attendance-statistic-icon.png');
      background-size: contain;
    }
  }
}
.baseinfo {
  min-width: 620px;
  background: url('@/assets/imgs/storage/attendance-card-bg1.png');

  .abnormal-list {
    display: flex;

    .abnormal {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      width: 150px;
      height: 150px;
      margin-right: 10px;
      border: 1px solid;
    }
  }
}
.statistic {
  min-width: 620px;

  .card {
    display: flex;
    height: 96px;
    margin-top: -30px;

    .card-box {
      display: flex;
      flex: 1;

      &:last-of-type {
        flex: 0;
      }
    }

    .card-item {
      flex: 1;
      display: flex;
      align-items: center;

      .content {
        display: flex;
        align-items: center;
        width: 202px;
        padding: 16px 20px;
        box-sizing: border-box;

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          margin: 0 20px 0 0;
          border-radius: 50%;
          background: #f3f5fb;

          img {
            width: 21px;
          }
        }

        .info {
          display: flex;
          flex-direction: column;
          height: 59px;
          font-size: 14px;
          color: #4f5470;
          line-height: 20px;
          text-align: left;
          font-style: normal;
          text-transform: none;

          .title {
            margin-top: 3px;
          }

          .times {
            margin-top: 16px;
            font-size: 20px;
            color: #000;
          }
        }
      }
      &:last-of-type {
        flex: 0;
        .line {
          display: none;
        }
      }
    }

    .line {
      flex: 1;
      width: 1px;
      margin: 24px auto;
      border-left: 1px solid #ebeef5;
      transform: translateX(50%);
    }
  }
}
.el-card {
  overflow: visible;
  background-color: #fff;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right bottom;
  border-radius: 8px;
  z-index: 0;

  :deep(.el-card__body) {
    padding: 12px 26px 0 26px;

    .el-form-item {
      margin-bottom: 12px;

      .el-form-item__label {
        margin-bottom: 14px;
        line-height: 20px;
      }

      .el-form-item__content {
        height: auto;
        line-height: 20px;
      }
    }
  }
}
.el-card:nth-of-type(2) {
  margin-top: 20px;
}
.table-part {
  --table-column1-width: 16%;
  --table-column2-width: 16%;
  --table-column3-width: 270px;
  --table-column4-width: 16%;
  --table-column5-width: 28%;
  --table-column6-width: 5%;

  min-width: 1268px;

  & > :deep(.el-card__body) {
    max-height: 800px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
    position: relative;
  }
  .table-title {
    display: flex;
    align-items: center;
    margin-left: 22px;
    margin-bottom: 12px;
    .icon {
      width: 14px;
      height: 14px;
      margin-right: 12px;
      background: url('@/assets/imgs/storage/attendance-detail-table.png');
      background-size: contain;
    }
    .title {
      line-height: 20px;
    }
  }

  .table-content {
    margin: 0 20px;
    background: linear-gradient(
      360deg,
      rgba(250, 252, 255, 0.19) 0%,
      rgba(242, 247, 255, 0.78) 36%,
      #ebf2ff 100%
    );

    & > div {
      padding-left: 14px;
      padding-right: 24px;
    }

    .column {
      padding-left: 21px;
      padding-right: 30px;
      line-height: 20px;
      justify-content: center;
      box-sizing: border-box;
    }

    .table-header {
      display: flex;
      padding-top: 16px;
      padding-bottom: 16px;
      font-size: 14px;
      color: #666;
    }

    .table-body {
      display: flex;
      flex-direction: column;
      max-height: 500px;
      overflow-y: scroll;
      overflow-x: hidden;
      font-size: 14px;
      margin-bottom: 50px;
      position: relative;
      z-index: 0;

      &::-webkit-scrollbar {
        display: none;
        width: 5px; /* 垂直滚动条宽度 */
        height: 5px; /* 水平滚动条高度 */
        position: absolute;
        top: 0;
        right: 0;
      }

      /* 滚动条轨道 */
      &::-webkit-scrollbar-track {
        background-color: #f1f1f1;
        border-radius: 5px;
      }
      /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
        background-color: #cacaca;
        border-radius: 5px;
      }
      /* 滚动条滑块悬停状态 */
      &::-webkit-scrollbar-thumb:hover {
        background-color: #e2e2e2;
      }
      /* 滚动条箭头 */
      &::-webkit-scrollbar-button {
        display: none; /* 隐藏箭头 */
      }

      .row {
        width: 100%;
        min-height: 91px;
        margin-top: 16px;
        border-radius: 4px;

        &:first-of-type {
          margin-top: 0;
        }

        &:last-of-type {
          margin-bottom: 16px;
        }

        :deep(.el-card__body) {
          display: flex;
          width: 100%;
          padding: 10px 0;
        }

        &:hover {
          // background-color: #e6e6e6;
        }
      }
    }

    .table-footer {
      height: 50px;
      width: 100%;
      padding: 0;
      background-color: #fff;
      position: absolute;
      bottom: -50px;
      left: 0;

      &.shadow {
        box-shadow:
          0 -6px 6px -1px rgba(0, 0, 0, 0.1),
          0 -2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      :deep(.el-pagination) {
        margin: 9px 20px;
      }
    }

    .update-icon {
      width: 13px;
      height: 13px;
      margin-right: 5px;
      background: url('@/assets/imgs/storage/attendance-update-btn.png');
      background-size: contain;
    }

    .table-column1 {
      width: var(--table-column1-width);
    }
    .table-column2 {
      width: var(--table-column2-width);
    }
    .table-column3 {
      width: var(--table-column3-width);
    }
    .table-column4 {
      width: var(--table-column4-width);
    }
    .table-column5 {
      width: var(--table-column5-width);
    }
    .table-column6 {
      width: var(--table-column6-width);
      text-align: center;
      white-space: nowrap;
    }
  }
}

.checkInRecordVos-item {
  display: flex;
  align-items: center;
  margin: 5px 0;
  white-space: nowrap;

  &:first-of-type {
    margin-top: 0;
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  .dot {
    width: 12px;
    height: 12px;
    margin-right: 8px;
    border-radius: 50%;
    line-height: 12px;
    font-size: 10px;
    text-align: center;
    color: #0064ff;
    background-color: rgba(0, 100, 255, 0.1);
  }

  .time {
    display: flex;
    width: 32px;
    font-size: 12px;
  }

  .status {
    margin-left: 16px;
  }
}

.remark {
  :deep(.el-tooltip__trigger) {
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
  }
}

.remark-content {
  max-width: 500px;
}
</style>
