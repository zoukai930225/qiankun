<template>
  <div>
    <el-drawer
      v-model="visible"
      v-if="visible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      :size="968"
      @close="handleCloseDrawer"
    >
      <div>
        <div class="drawerTitle"
          ><div>验厂考核</div
          ><div @click="handleCloseDrawer"
            ><el-icon><CloseBold /></el-icon
          ></div>
        </div>
        <div class="contain">
          <el-card>
            <div class="step">
              <div
                v-for="tab in tabList"
                :key="tab.id"
                :class="['step-item', current === tab.id ? 'step-item-active' : '']"
                @click="tabHandle(tab.id)"
              >
                <div class="step-item-head">
                  <div v-if="tabList.length > tab.id" class="step-line"></div>
                  <img class="icon" :src="tab.id !== current ? TabImg : TabActiveImg" />
                </div>
                <div class="text">{{ tab.name }}</div>
              </div>
            </div>
            <div class="score-body">
              <div class="score-head">
                <div class="score-head-label">
                  <img class="icon" :src="ScoreLabel" />
                  <div class="label">得分</div>
                </div>
                <div class="score-head-main">
                  <div class="count">{{ score }}</div>
                  <div class="label">/ 100 &nbsp;分</div>
                </div>
              </div>
              <div class="score-main">
                <el-table
                  class="SWCommonTable"
                  v-horizontal-scroll="'always'"
                  :data="list"
                  :show-overflow-tooltip="true"
                  row-class-name="commonTableRow"
                >
                  <el-table-column prop="title" :show-overflow-tooltip="true" label="项目" />
                  <el-table-column
                    prop="assessProject"
                    :show-overflow-tooltip="true"
                    label="题目"
                  />
                  <el-table-column
                    prop="projectTotalScore"
                    :show-overflow-tooltip="true"
                    label="满分"
                    width="100"
                  />
                  <el-table-column
                    prop="assessScore"
                    :show-overflow-tooltip="true"
                    label="得分"
                    width="100"
                  />
                  <el-table-column prop="remarks" :show-overflow-tooltip="true" label="备注" />
                </el-table>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="tsx" setup>
import { getAssessBySupplierId } from '@/api/supplier'
import TabImg from '@/assets/imgs/supplier/tab.png'
import TabActiveImg from '@/assets/imgs/supplier/tab-active.png'
import ScoreLabel from '@/assets/imgs/supplier/score.png'
defineOptions({ name: 'RateInfo' })
const visible = ref(false)
const curId = ref('')
const open = (id: string) => {
  visible.value = true
  curId.value = id
  getData()
}
const current = ref(1)
const tabList = ref([
  { id: 1, name: '初评' },
  { id: 2, name: '复评' },
  { id: 3, name: '终评' }
])
const tabHandle = (key: number) => {
  current.value = key
  getData()
}
const list = ref<any[]>([])
const score = ref('0')
// 获取信息
const getData = async () => {
  const res = await getAssessBySupplierId({ assessType: current.value, supplierId: curId.value })
  const { totalScore } = res
  list.value = setList(res['1']).concat(setList(res['2']), setList(res['3']))
  const { assessTotalScore } = totalScore
  score.value = convertData(assessTotalScore)
}
const setList = (obj: any) => {
  if (Reflect.ownKeys(obj).length) {
    return obj.list.map((item: any) => {
      return {
        ...item,
        title: obj.title
      }
    })
  } else {
    return []
  }
}
const convertData = (str: any) => {
  if (!str) {
    return 0
  }
  const num = Number(str) // 转换成数字
  return String(num).replace(/\.0$/, '') // 将数字转回字符串并去掉 .0
}
// 关闭
const handleCloseDrawer = () => {
  visible.value = false
}
defineExpose({
  open
})
onMounted(() => {})
</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';
.m-bot {
  margin-bottom: 20px;
}
.drawerTitle {
  display: flex;
  justify-content: space-between;
}
.drawer {
  background-color: #f6f6f6;
  .el-drawer__header {
    margin-bottom: 0;
    .el-drawer__title {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      font-style: normal;
    }
  }
}
.step {
  display: flex;
  width: 100%;
  justify-content: space-between;
  &-item {
    flex-basis: 50%;
    flex-shrink: 1;
    position: relative;
    cursor: pointer;
    &:last-child {
      flex-basis: auto;
      flex-grow: 0;
      flex-shrink: 0;
    }
    &-head {
      position: relative;
      width: 100%;
      .icon {
        width: 69px;
        height: 69px;
        position: relative;
        z-index: 99;
      }
      .step-line {
        position: absolute;
        width: 100%;
        left: 6px;
        right: -2px;
        height: 6px;
        top: 31px;
        z-index: 88;
        background-color: #ebf0f3;
      }
    }
    .text {
      padding-left: 15px;
    }
  }
}
.score-head {
  width: 260px;
  height: 110px;
  background-color: #f2f6fc;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 16px 18px;
  margin: 20px 0;
  &-label {
    display: flex;
    align-items: center;
    .icon {
      display: block;
      margin-right: 10px;
      width: 14px;
      height: 15px;
      // padding-top: 4px;
    }
  }
  &-main {
    display: flex;
    align-items: baseline;
    padding-top: 6px;
    .count {
      color: #0567fe;
      font-size: 42px;
      font-weight: 800;
      padding-right: 5px;
    }
    .label {
    }
  }
}
.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
