<!-- InitCard.vue -->
<template>
  <div class="init-card">
    <div class="card-title">
      <div class="init-card-title">{{ item.actName }}</div>
      <el-dropdown
        placement="bottom-end"
        v-if="item.status === 1 || item.status === 5 || item.bonusPoint !== 0"
      >
        <div>
          <img class="init-card-img" src="@/assets/imgs/otr/activitySet/moreFunction.svg" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-if="item.bonusPoint !== 0" @click.stop="goBonusPoint(item.id)"
              >加分项</el-dropdown-item
            >
            <el-dropdown-item
              v-if="item.status === 1 || item.status === 5"
              @click.stop="handleDelete(item)"
              >删除</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <div style="position: relative;" v-if="item.status === 1 || item.status === 5 || item.bonusPoint !== 0">
        <img
          class="init-card-img"
          src="@/assets/imgs/otr/activitySet/moreFunction.svg"
          @mouseover="open"
        />
        <div v-show="flag" class="openBox" @mouseleave="close">
          <div v-if="item.bonusPoint !== 0"  class="flagButton" @click.stop="goBonusPoint(item.id)">加分项</div>
          <div class="flagButton" v-if="item.status === 1 || item.status === 5" @click.stop="handleDelete(item)">删除</div>
        </div>
      </div> -->
    </div>
    <div class="init-card-content" :class="getClassName(item.status)">
      <div class="contentBox">
        <div class="title">盘点方案</div>
        <div class="text">{{ item.inventoryPlan }}</div>
      </div>
      <div class="contentBox">
        <div class="title">所属年度</div>
        <div class="text">
          <div class="text-box">{{ item.actYear }}</div>
        </div>
      </div>
      <div class="contentBox">
        <div class="title">活动时间</div>
        <div class="text">{{ item.beginTime }} - {{ item.endTime }}</div>
      </div>
      <div class="contentBox">
        <div class="title">盘点人数</div>
        <div class="text">{{ item.inventoryPerson + '人' }}</div>
      </div>
    </div>
    <div class="init-card-content2">
      <div class="btn mng" @click="functionClick">问卷管理</div>
      <div class="btn edit" @click="functionEdit">{{ item.status === 1 ? '编辑' : '查看' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const router = useRouter() // 路由对象

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const getClassName = (type) => {
  switch (type) {
    case 1: //'初始化'
      return ''
    case 2: //'评价中'
      return 'content2'
    case 3: //'问卷关闭'
      return 'content3'
    case 4: //'校准中'
      return 'content4'
    case 5: //'活动结束'
      return 'content5'
    default:
      return ''
  }
}

const flag = ref(false)

const open = () => {
  flag.value = true
}
const close = () => {
  flag.value = false
}
// 打开加分项
const goBonusPoint = (inventoryId) => {
  router.push({
    name: `BonusPoint`,
    query: { inventoryId: inventoryId }
  })
}
const emit = defineEmits(['delete-item', 'functionClick-item', 'click'])

// 子组件的 handleDelete 方法
const handleDelete = (item) => {
  // 触发自定义事件，并将 item 传递给父组件
  emit('delete-item', item)
}
const functionList = [
  {
    name: '问卷管理',
    code: 'questionnaireSet',
    permission: 'otr_question_manage',
    canClick: props.item.isSetWjgl == 1
  }
]

const functionClick = () => {
  emit('functionClick-item', 'questionnaireSet', props.item.id)
}

const functionEdit = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
/* 样式保持不变 */
.init-card {
  position: relative;
  width: 317px;
  height: 271px;
  margin: 0 18px;
  background-color: #fff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.18);
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 16px 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .card-title {
    width: 100%;
    height: 22px;
    line-height: 22px;
    display: flex;
    justify-content: space-between;
  }
  &-title {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 700;
    font-size: 16px;
    color: #333333;
    text-align: left;
    font-style: normal;
  }

  &-img {
    width: 21px;
    height: 4px;
    cursor: pointer;
  }

  &-content {
    width: 100%;
    height: 161px;
    background-image: url('@/assets/imgs/otr/schemeSet/initbgImg.png');
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;

    &.content2 {
      background-image: url('@/assets/imgs/otr/schemeSet/evaluateBgImg.png');
    }
    &.content3 {
      background-image: url('@/assets/imgs/otr/schemeSet/closeBgImg.png');
    }
    &.content4 {
      background-image: url('@/assets/imgs/otr/schemeSet/calibrateBgImg.png');
    }
    &.content5 {
      background-image: url('@/assets/imgs/otr/schemeSet/overBgImg.png');
    }

    .contentBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      padding: 0 10px;
      .title {
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #666;
        line-height: 17px;
        text-align: left;
        font-style: normal;
      }

      .text {
        // flex: 1;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 600;
        font-size: 14px;
        color: #333;
        text-align: right;
        font-style: normal;

        &-box {
          // width: 32.84px;
          padding: 4px 10px;
          height: 25px;
          color: #0064ff;
          background-color: #eef5ff;
          margin-left: auto;
        }
      }
    }
  }

  &-content2 {
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    .btn {
      height: 32px;
      line-height: 32px;
      padding: 0px 16px;
      border-radius: 4px;
      color: #0064ff;
      background: #ffffff;
      box-sizing: border-box;
      border: 1px solid #0064ff;
      text-align: center;
      cursor: pointer;
      &.edit {
        margin-left: 12px;
      }
      &:hover {
        opacity: 0.8;
        background-color: #eef5ff;
      }
    }
  }
}

.openBox {
  position: absolute;
  top: 15px;
  right: -20px;
  width: 84px;
  background-color: #fff;
  text-align: center;
  line-height: 33px;
  padding: 10px 0;
}

.flagButton {
  height: 33px;
  cursor: pointer;
}

.flagButton:hover {
  background-color: #f3f4f7;
}
</style>
