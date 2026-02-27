<template>
  <div>
    <!-- <CardColor /> -->
    <div v-if="list.length > 0" class="box" ref="cardWrapperRef">
      <div
        class="boxSon"
        v-for="item in list"
        :key="item.id"
        :class="{ boxSon2: item.bonusPoint === 1 }"
      >
        <div class="boxCard" @click="openCardDetail(item.id)">
          <div class="top">
            <div class="title">{{ item.planTitle || '--' }}</div>
          </div>
          <div class="center">
            <div class="item">
              <div class="title">活动:</div>
              <!-- 弹窗反馈 显示具体的活动列表 -->
              <div class="value activityTitle flex">
                <el-text truncated @click.stop="openList(item.id)" v-if="item.activityTitle">{{
                  item.activityTitle
                }}</el-text>
                <span v-else>--</span>
              </div>
            </div>
            <div class="item">
              <div class="title">维度:</div>
              <div class="value" style="margin-left: -2px">
                <CardWeidu :list="item.dimensions" />
              </div>
            </div>
            <div class="item">
              <div class="title">加分项:</div>
              <div class="value result" :class="{ result2: item.bonusPoint === 1 }"
                ><div>{{ item.bonusPoint === 1 ? '已启用' : '未启用' }}</div></div
              >
            </div>
          </div>
          <div class="delete">
            <div class="btn" v-if="item.isUse === 0" @click.stop="deleteClick(item.id)">
              <div class="del">
                <img class="img" src="@/assets/imgs/otr/schemeSet/deletebin.svg" alt="" />
                <span>删除</span>
              </div>
            </div>
            <img v-if="item.isUse === 0" src="@/assets/imgs/otr/schemeSet/line.svg" alt="" />
            <div class="btn" @click.stop="copyCardDetail(item.id)">
              <div class="copy">
                <img class="img" src="@/assets/imgs/otr/schemeSet/filecopy.svg" alt="" />
                <span>复制</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无数据" />

    <!-- 新增/编辑 drawer-->
    <AddDrawer ref="addDrawerRef" @success="getList" />
    <!-- 活动名称列表弹窗 -->
    <activityListDialog ref="activityListRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { propTypes } from '@/utils/propTypes'
// import CardColor from './cardColor.vue'
import CardWeidu from './cardWeidu.vue'
import AddDrawer from './addDrawer.vue'

import activityListDialog from './activityListDialog.vue'
const activityListRef = ref()

const openList = (id) => {
  activityListRef.value?.open(id)
}

defineProps({
  list: {
    type: Array as any,
    default: () => []
  }
})

import * as OtrSchemeSetApi from '@/api/otr/schemeSet/index'

const message = useMessage() // 消息弹窗

// 打开卡片详情
const addDrawerRef = ref()
const openCardDetail = (id: string) => {
  // 点击查看页面
  addDrawerRef.value.open('view', id)
}
const copyCardDetail = (id: string) => {
  // 复制
  addDrawerRef.value.open('copy', id)
}
// 删除按钮点击
const deleteClick = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // // 发起删除
    await OtrSchemeSetApi.deleteData(id)
    message.success('删除成功')
    // 刷新列表
    getList()
  } catch {}
}

const getList = () => {
  emit('getList')
}

const emit = defineEmits(['getList'])

const cardWrapperRef = ref()
const rightSpace = ref(20)
const cloumnCount = ref(0)
const resizeHandler = () => {
  if (cardWrapperRef.value) {
    const width = cardWrapperRef.value?.clientWidth
    const itemWidth = 320
    cloumnCount.value = Math.floor(width / (itemWidth + 20))
    if (cloumnCount.value > 1) {
      rightSpace.value = Math.floor(
        (width - itemWidth * cloumnCount.value) / (cloumnCount.value - 1)
      )
      if (rightSpace.value > 150) {
        rightSpace.value = 0
      }
    } else {
      rightSpace.value = 20
    }
  }
}

onMounted(() => {
  window.addEventListener('resize', resizeHandler)
})
defineExpose({
  resizeHandler
})
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, 365px);
  // grid-gap:12px;
  margin-top: 30px;
  .boxSon {
    width: 365px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.04);
    margin-bottom: 16px;
    position: relative;
    &::before {
      width: 365px;
      height: 100%;
      content: '';
      position: absolute;
      top: -8px;
      box-sizing: border-box;
      border-radius: 16px;
      border-top: 8px solid #349b34;
    }
    &.boxSon2 {
      &::before {
        border-top: 8px solid #db6a0f;
      }
    }
    .boxCard {
      padding: 16px;
      padding-bottom: 0;
      box-sizing: border-box;
      position: relative;
      .top {
        height: 30px;
        position: relative;
        border-bottom: 1px solid #f0f0f0;
        .title {
          position: absolute;
          top: -4px;
          font-size: 18px;
          font-weight: 700;
          // line-height: 150%;
          text-transform: capitalize;
          letter-spacing: normal;
          color: #333333;
        }
      }
      .center {
        font-size: 14px;
        height: 127px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        .item {
          display: flex;
          align-items: center;
          .title {
            color: #666;
          }
          .value {
            margin-left: 8px;
            color: #333;
            &.activityTitle {
              width: 86%;
              cursor: pointer;
              :deep(.el-text) {
                &:hover {
                  color: #0064ff !important;
                }
              }
            }

            &.result {
              width: 52px;
              height: 22px;
              border-radius: 12px;
              background: rgba(52, 155, 52, 0.2);
              display: flex;
              align-items: center;
              div {
                font-size: 12px;
                color: #349b34;
                margin: auto;
              }
              &.result2 {
                background: rgba(219, 106, 15, 0.2);
                div {
                  color: #db6a0f;
                }
              }
            }
          }
        }
      }
      .delete {
        width: 100%;
        height: 20px;
        padding: 8px 0;
        border-top: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        cursor: pointer;
        .btn {
          flex-grow: 1;
          display: flex;
          &:hover {
            opacity: 0.8;
          }
          div {
            margin: auto;
            display: flex;
            align-items: center;

            .img {
              width: 14px;
              height: 14px;
            }
            span {
              font-size: 14px;
            }
            &.del {
              span {
                color: #eb3737;
              }
            }
            &.copy {
              span {
                color: #0064ff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
