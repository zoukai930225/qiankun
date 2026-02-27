<template>
  <div>
    <div v-if="loading" class="loading-placeholder">
      <el-icon class="is-loading"><Loading /></el-icon>
      加载中...
    </div>
    <div v-else-if="boardList.length > 0" class="card-wrapper" id="card-wrapper">
      <div
        class="card"
        v-for="item in boardList"
        :key="item.id"
        :ref="(el) => setCardRef(item.id, el)"
        @click="handleCardClick(item.taskId, item.id)"
      >
        <div class="card-title" :style="getBoardStyle(item.boardColor, true)">
          {{ item.taskName || '--' }}
        </div>
        <div class="card-content">
          <div class="card-item-container">
            <div class="card-item-container-title">执行记录:</div>
            <div class="card-item-container-content">
              <div class="card-item-container-content-item">
                <div class="label">失败</div>
                <span>{{ item.failNumber }}次 </span>
              </div>
              <div class="card-item-container-content-item">
                <div class="label">失败已处理</div>
                <span>{{ item.handledNumber }}次</span>
              </div>
              <div class="card-item-container-content-item">
                <div class="label">失败未处理</div>
                <span>{{ item.untreatedNumber }}次</span>
              </div>
              <div class="card-item-container-content-item">
                <div class="label">告警</div>
                <span>{{ item.warningNumber || 0 }}次</span>
              </div>
            </div>
          </div>
          <div>
            <div class="card-item-container-title">最新记录:</div>
            <div class="card-item">
              <div>
                <img class="card-label-img" src="@/assets/imgs/dashboard/icon_2.png" alt="" />
                <span class="card-label">最新应用执行时间</span>
              </div>
              <div>
                <span class="card-value">{{ item.executeTime || '--' }}</span>
              </div>
            </div>
            <div class="card-item">
              <div>
                <img class="card-label-img" src="@/assets/imgs/dashboard/icon_3.png" alt="" />
                <span class="card-label">最新应用执行结果</span>
              </div>
              <div>
                <div class="card-value card-result" :style="getBoardStyle(item.boardColor)">
                  {{ item.executeResult || '--' }}
                </div>
              </div>
            </div>
            <div class="card-item">
              <div style="color: #666">
                今日是否存在自动重跑:
                <span style="color: #333">{{ item.isReExcute === '1' ? '是' : '否' }}</span>
              </div>
              <div
                style="display: flex; align-items: center"
                v-if="item.reExcuteRecordList && item.reExcuteRecordList.length > 0"
              >
                <el-popover placement="top-start" title="重跑结果" :width="400" trigger="hover">
                  <template #reference>
                    <div style="display: flex; align-items: center">
                      <span style="color: #666">重跑结果: </span>
                      <el-icon><Notification /></el-icon>
                    </div>
                  </template>
                  <div class="reExcuteRecordList">
                    <el-table :data="item.reExcuteRecordList" height="200px">
                      <el-table-column
                        prop="name"
                        label=""
                        label-width="0"
                        align="left"
                        min-width="200px"
                      />
                      <el-table-column prop="result" label="" label-width="0" align="right">
                        <template #default="scope">
                          <div
                            :style="{
                              color: scope.row.result === '重跑失败' ? '#E15A51' : '#1AAC2E'
                            }"
                          >
                            {{ scope.row.result }}
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-popover>
              </div>
              <div v-else style="color: #666">暂无</div>
            </div>
            <!-- <div class="card-item">
              <div style="color: #666">
                数据校验是否通过：<span style="color: #333">{{
                  item.isDataCheckPass == 1 ? '是' : '否'
                }}</span>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无数据" />

    <TeamComponent ref="TeamComponentRef" @success="handleDrawerClose" />

    <teleport :to="teleportTo">
      <div class="flex items-center gap-20px">
        <ul class="dashboard-count-list">
          <template v-for="(item, index) in list" :key="item.name">
            <li v-if="index < 4" class="dashboard-count-list-item" :class="item.className">
              <span class="dashboard-count-list-item-name">{{ item.name }}</span>
              <span class="dashboard-count-list-item-count">{{ item.count }}</span>
            </li>
          </template>
        </ul>
        <ul class="flex items-center dashboard-count-list dashboard-count-list-right">
          <li class="dashboard-count-list-item" :class="list[4].className">
            <span class="dashboard-count-list-item-name">{{ list[4].name }}</span>
            <span class="dashboard-count-list-item-count">{{ list[4].count }}</span>
          </li>
          <el-divider direction="vertical"></el-divider>
          <li class="dashboard-count-list-item" :class="list[5].className">
            <span class="dashboard-count-list-item-name">{{ list[5].name }}</span>
            <span class="dashboard-count-list-item-count">{{ list[5].count }}</span>
          </li>
        </ul>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineExpose } from 'vue'
// import DashboardForm from './dashboardForm.vue' // 未使用暂时注释
import TeamComponent from './TeamComponent.vue'
import * as DashboardApi from '@/api/dashboard'

const props = defineProps<{
  teleportTo: string
  initParams?: any
}>()

const list = ref<any[]>([
  {
    name: '数据校验未过',
    count: 0,
    className: 'primary'
  },
  {
    name: '失败',
    count: 0,
    className: 'danger'
  },
  {
    name: '告警',
    count: 0,
    className: 'warning'
  },
  {
    name: '未执行',
    count: 0,
    className: 'info'
  },
  {
    name: '总计',
    count: 0,
    className: 'total'
  },
  {
    name: '成功',
    count: 0,
    className: 'success'
  }
])

// 定义数据接口
interface ReExcuteRecord {
  name: string
  result: string
}

interface BoardItem {
  id: string | number
  taskId: string
  taskName: string
  boardColor: string
  failNumber: number
  handledNumber: number
  untreatedNumber: number
  warningNumber: number
  executeTime: string
  executeResult: string
  isReExcute: string
  reExcuteRecordList?: ReExcuteRecord[]
  isDataCheckPass: number
  // successNumber?: number // 如果需要可以解开
}

/** 添加/修改操作 */
// const DashboardFormRef = ref<any>(null)
// const openForm = (taskCode: string) => {
//   DashboardFormRef.value?.open(taskCode)
// }

// 打开查看任务组合弹窗
const cardRefs = ref<Record<string | number, any>>({})

const setCardRef = (id: string | number, el: any) => {
  if (el) {
    cardRefs.value[id] = el
  }
}

const handleCardClick = (taskId: string, itemId: string | number) => {
  const element = cardRefs.value[itemId]
  if (element) {
    const wrapper = document.getElementById('card-wrapper')
    const wrapperScrollTop = wrapper ? wrapper.scrollTop : 0
    openFormTeamComponent(taskId, wrapperScrollTop)
  }
}

const TeamComponentRef = ref<any>(null)
const openFormTeamComponent = (taskId: string, yPosition: number) => {
  TeamComponentRef.value?.open(taskId, yPosition)
}

// 提供 getQueryParams 方法，用于接收查询参数
const queryParams = ref<Record<string, any>>({})
const getQueryParams = async (data: Record<string, any>) => {
  queryParams.value = data
  await getList()
}
defineExpose({ getQueryParams })

// 查询列表
const boardList = ref<BoardItem[]>([])
const loading = ref(false)
const getList = async () => {
  loading.value = true
  try {
    const data = await DashboardApi.getDataBoardList(queryParams.value).catch(() => {})
    if (data) {
      const {
        dataBoardCardDtoList,
        blueCount,
        greenCount,
        greyCount,
        redCount,
        totalCount,
        yellowCount
      } = data
      if (Array.isArray(dataBoardCardDtoList)) {
        boardList.value = (dataBoardCardDtoList as BoardItem[]) || []
      }
      // 总数：totalCount  成功：greenCount   数据校验未过：blueCount   失败：redCount  告警：yellowCount  未执行：greyCount

      list.value[0].count = blueCount
      list.value[1].count = redCount
      list.value[2].count = yellowCount
      list.value[3].count = greyCount
      list.value[4].count = totalCount
      list.value[5].count = greenCount
    }
  } finally {
    loading.value = false
  }
}

const handleDrawerClose = async (yPosition: number) => {
  console.log('handleDrawerClose', yPosition)

  // await getList()
  // set(yPosition)
}

const set = (topPosition: number) => {
  const outEle = document.getElementById('card-wrapper')
  if (outEle) {
    outEle.scrollTo({ top: topPosition, behavior: 'smooth' })
  }
}

// 执行结果和标题的颜色区分
const getBoardStyle = (boardColor: string, isTitle: boolean = false) => {
  const colorMap: Record<string, string> = {
    红色: '#e10000',
    绿色: '#01983C',
    黄色: '#DA9E24',
    蓝色: '#0064ff'
  }
  const backgroundColorMap: Record<string, string> = {
    红色: '#e1000030',
    绿色: '#01983c30',
    黄色: '#da9e2430',
    蓝色: '#cce0ff30'
  }

  const titleBackgroundColorMap: Record<string, string> = {
    红色: '#E15A51',
    绿色: '#1AAC2E',
    黄色: '#EDB135',
    蓝色: 'var(--el-color-primary)'
  }

  // 使用解构和默认值来获取颜色
  const color = colorMap[boardColor] || '#666666'
  const backgroundColor = backgroundColorMap[boardColor] || '#c2c5c74d'
  const titleBackgroundColor = titleBackgroundColorMap[boardColor] || '#999F9E'

  // 构建返回的样式对象
  const style: Record<string, string> = {
    backgroundColor: isTitle ? titleBackgroundColor : backgroundColor
  }

  // 如果不是标题，则添加color属性
  if (!isTitle) {
    style.color = color
  }

  return style
}

onMounted(async () => {
  if (props.initParams) {
    queryParams.value = props.initParams
  }
  await getList()
})
</script>

<style lang="scss" scoped>
// 加载中的效果
.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 650px;
}

.card-wrapper {
  width: 100%;
  // min-width: 1570px;
  box-sizing: border-box;

  // --- 修改开始: 切换为 Grid 布局 ---
  display: grid;
  // 自动填充列，每列最小370px，剩余空间拉伸
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  // 行列间距统一为 20px
  gap: 20px;
  // 内容整体靠左对齐 (防止只有几个卡片时分散对齐)
  justify-content: start;
  // --- 修改结束 ---

  overflow: auto;
  max-height: 800px;
  padding-bottom: 20px; // 底部留白
}

.card {
  // --- 修改开始: 宽度调整 ---
  width: 100%; // 让卡片填满 Grid 分配的单元格宽度
  // --- 修改结束 ---

  cursor: pointer;
  background: linear-gradient(43deg, #ffffff 0%, #ffffff 63%, #ebf1fd 100%);
  box-shadow: 0px 2px 18px 0px rgba(0, 31, 61, 0.08);
  border-radius: 10px;

  &-title {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    border-radius: 10px 10px 0px 0px;
    padding: 14px 20px;
    box-sizing: border-box;
    font-family:
      PingFangSC,
      PingFang SC;
  }
  &-content {
    padding: 0 14px 0 14px;
    box-sizing: border-box;
    font-size: 14px;
  }
  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    &-container {
      // 执行记录:
      &-title {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        font-weight: bold;
      }
      &-content {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 4px;
        &-item {
          background-color: #eff1f5;
          border-radius: 4px;
          text-align: center;
          padding: 4px 2px;
          box-sizing: border-box;
          // max-width: 84px; // 已注释掉，配合外层卡片拉伸
          word-wrap: break-word;
          white-space: normal;
        }
      }
    }
  }
  &-result {
    height: 25px;
    padding: 0 8px;
    line-height: 25px;
    text-align: center;
    border-radius: 4px;
    font-size: 12px;
  }
  &-label {
    font-size: 14px;
    color: #666;
    &-img {
      vertical-align: middle;
      margin-right: 6px;
    }
  }
  &-value {
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }
}

.dashboard-count-list {
  display: flex;
  gap: 20px;
  &-right {
    gap: 0;
    .dashboard-count-list-item-count {
      padding: 0;
    }
  }
  &-item {
    display: flex;
    align-items: center;
    gap: 8px;
    &-name {
      font-size: 14px;
      color: #666666;
    }
    &-count {
      font-size: 14px;
      border-radius: 20px;
      padding: 5px 6px;
    }
    &.primary {
      .dashboard-count-list-item-count {
        background-color: #cce0ff;
        color: var(--el-color-primary);
      }
    }
    &.success {
      .dashboard-count-list-item-count {
        // background-color: #d6ebd6;
        color: #349b34;
      }
    }
    &.danger {
      .dashboard-count-list-item-count {
        background-color: rgba(235, 55, 55, 0.1);
        color: #eb3737;
      }
    }
    &.warning {
      .dashboard-count-list-item-count {
        background-color: rgba(218, 158, 36, 0.19);
        color: rgb(218, 158, 36);
      }
    }
    &.info {
      .dashboard-count-list-item-count {
        background-color: rgb(222, 223, 224);
        color: #333;
      }
    }
  }
}
</style>
