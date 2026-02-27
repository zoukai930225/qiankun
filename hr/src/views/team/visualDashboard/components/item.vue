<!--
 * @Date: 2025-10-10 11:47:52
-->
<!-- filepath: /Users/yachaozhang/Desktop/淘宝&learn/platform-front/src/views/team/visualDashboard/components/TableItem.vue -->
<template>
  <div
    class="task-block"
    @dblclick="handleDbClick"
    :style="{ marginLeft: isTop == true ? '0px' : '8px' }"
  >
    <div
      class="left-wapper"
      v-if="(task?.calendarState == 1 || task?.calendarState == 2) && isTop == true"
    >
      <img class="avator" :src="task?.operatorAvatar" />
      <!-- 名字只取三个字 竖向排列 -->
      <div class="name">
        <!-- {{ task?.operatorRealname }} -->
        <span v-for="(ch, i) in shortNameChars" :key="i">{{ ch }}</span>
      </div>
    </div>
    <div class="right-wapper">
      <div class="flex-row name-wapper">
        <img :src="formatStoreIconInner(task?.store)" class="img" alt="" />
        <span class="name">{{ task.goodsCode }}</span>
      </div>
      <div class="flex-row">
        <el-tooltip
          class="desc"
          effect="dark"
          :content="`${formarTwoType(task?.demandType, task?.secondDemandType)}`"
          placement="top"
        >
          <!-- 如果左边有头像 宽度设置50 没有头像宽度设置70 -->
          <span
            class="desc"
            :style="{
              width:
                (task?.calendarState == 1 || task?.calendarState == 2) && isTop == true
                  ? '55px'
                  : '70px'
            }"
          >
            {{ `${formarTwoType(task?.demandType, task?.secondDemandType)}` }}</span
          >
        </el-tooltip>
        <div
          class="type-desc"
          :class="formatClassBtnL(forOneType(task?.demandType)?.slice(0, 2))"
          >{{ forOneType(task?.demandType)?.slice(0, 2) }}</div
        >
      </div>
    </div>
    <div class="right-logo" :class="formatStatus(task?.calendarState)">
      {{ formatStatusInner(task?.calendarState) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formarTwoType } from '../common.js'
import { formatStoreIcon } from '../utils.js'
const props = defineProps<{
  task: {
    id: string
    goodsCode: string
    type: string
    demandType: string
    secondDemandType: string
    store: string
    operatorRealname: string
    operatorAvatar: string
    calendarState: number
  }
  isTop?: boolean
}>()

const emit = defineEmits(['dbClick'])

const handleDbClick = () => {
  emit('dbClick', props.task)
}

const formatStatus = (state) => {
  return {
    'state-ing': state == 1,
    'state-danger': state == 2,
    'state-finish': state == 3
  }
}

const formatStatusInner = (state) => {
  return {
    1: '进行中',
    2: '进行中',
    3: '已完成'
  }[state]
}

const formatClassBtnL = (value) => {
  return {
    xin: value == '新品',
    you: value == '优化',
    lin: value == '临时',
    nei: value == '内部'
  }
}

const formatStoreIconInner = (store) => {
  return formatStoreIcon(store)
}

const forOneType = (type) => {
  return demandTypeOne.value.find((item) => item.value == type)?.label
}

const demandTypeOne = ref([
  {
    label: '新品需求',
    value: 'newProduct'
  },
  {
    label: '优化需求',
    value: 'optimization'
  },
  {
    label: '临时需求',
    value: 'temporary'
  },
  {
    label: '内部需求',
    value: 'internal'
  }
])

// 新增：名字只取前三个字符并竖向排列（支持 emoji / 多字节字符）
const shortNameChars = computed(() => {
  const name = props.task?.operatorRealname || ''
  // 使用 Array.from 保证 unicode 正确分割
  return Array.from(name).slice(0, 3)
})
</script>

<style scoped lang="scss">
.task-block {
  width: 120px;
  height: 60px;
  border-radius: 4px;
  background: #f9fafd;
  border: 1px solid #e5e5e5;
  cursor: pointer;
  padding: 0;
  box-sizing: border-box;
  margin: 8px 8px 4px 8px;
  display: flex;
  flex-direction: row;
  position: relative;
  .right-logo {
    height: 11px;
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 8px;

    padding: 1px 2px;
    box-sizing: border-box;
  }
  .right-wapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 6px;
    box-sizing: border-box;
  }
  .left-wapper {
    width: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #c9d1e2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 0 5px;
    box-sizing: border-box;
    .avator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-top: 4px;
      margin-bottom: 1px;
    }
    .name {
      text-align: center;
      font-family: PingFang SC;
      font-size: 10px;
      font-weight: normal;
      line-height: 12px;
      letter-spacing: normal;
      color: #3d3d3d;
      span {
        display: block;
        width: 100%;
        height: 12px;
        line-height: 12px;
        overflow: hidden;
        text-overflow: clip;
      }
    }
  }
  .name-wapper {
    margin-bottom: 6px;
    .img {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }
  }

  .name {
    width: 88px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333333;
    font-size: 12px;
    font-weight: 500;
  }
  // 超出一行点点点
  .desc {
    width: 77px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333333;
    font-size: 10px;
    font-weight: normal;
    margin-right: 3px;
  }
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.type-desc {
  width: 30px;
  background: #d8e1f5;
  border-radius: 4px;
  font-weight: 400;
  font-size: 10px;
  color: #0064ff;
  text-align: center;
  font-style: normal;
  padding: 1px 3px;
  box-sizing: border-box;
  margin-right: 5px;
}
.xin {
  background: #defbff;
  color: #01bed4;
  border: 0.5px solid #04aa94;
}
.you {
  background: #fef9e0;
  color: #ff9f00;
  border: 0.5px solid #fbd432;
}
.lin {
  background: #e7def9;
  color: #843af8;
  border: 0.5px solid #843af8;
}
.nei {
  background: #d8e1f5;
  color: #0064ff;
  border: 0.5px solid #0064ff;
}

.state-ing {
  background: #ffe5c6;
  color: #f97f00;
}
.state-danger {
  background: #ffd5d9;
  color: #f33c51;
}
.state-finish {
  background: #ddf7e0;
  color: #008631;
}
</style>
