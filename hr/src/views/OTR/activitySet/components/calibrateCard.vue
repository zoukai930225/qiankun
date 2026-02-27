<!-- InitCard.vue -->
<template>
  <div class="init-card">
    <div class="init-card-title">{{ props.item.actName }}</div>
    <img
      v-if="props.item.status === 1 || props.item.bonusPoint !== 0"
      class="init-card-img"
      src="@/assets/imgs/otr/schemeSet/zhankai_icon.png"
      alt=""
      @mouseover="zhankai"
    />
    <div v-show="falg" class="zhankaiBox" @mouseleave="likai">
      <div
        v-if="props.item.bonusPoint !== 0"
        class="falgButton"
        @click.stop="goBonusPoint(props.item.id)"
        >加分项</div
      >
      <div class="falgButton" v-if="props.item.status === 1" @click.stop="handleDelete(props.item)"
        >删除</div
      >
    </div>
    <div class="init-card-content">
      <div class="init-card-contentBox">
        <div class="init-card-content-title">盘点方案</div>
        <div class="init-card-content-text">{{ props.item.inventoryPlan }}</div>
      </div>
      <div class="init-card-contentBox">
        <div class="init-card-content-title">所属年度</div>
        <div class="init-card-content-text">
          <div class="init-card-content-text-box">{{ props.item.actYear }}</div>
        </div>
      </div>
      <div class="init-card-contentBox">
        <div class="init-card-content-title">活动时间</div>
        <div class="init-card-content-text"
          >{{ props.item.beginTime }} - {{ props.item.endTime }}</div
        >
      </div>
      <div class="init-card-contentBox">
        <div class="init-card-content-title">盘点人数</div>
        <div class="init-card-content-text">{{ props.item.inventoryPerson + '人' }}</div>
      </div>
    </div>
    <div class="init-card-content2">
      <div
        class="init-card-content2-box"
        @mouseover="hoverImage1"
        @mouseleave="resetImage1"
        @click.stop="functionClick(1)"
      >
        <img
          style="width: 13px; height: 13px"
          class="init-card-content2-box-wenjuanguanli"
          :src="currentImage1"
          alt=""
        />
        <div>问卷管理</div>
      </div>
      <div
        class="init-card-content2-box"
        @mouseover="hoverImage2"
        @mouseleave="resetImage2"
        @click.stop="functionClick(2)"
      >
        <img
          style="width: 13px; height: 13px"
          class="init-card-content2-box-jiugongge"
          :src="currentImage2"
          alt=""
        />
        <div>九宫格设置</div>
      </div>
      <div
        class="init-card-content2-box"
        @mouseover="hoverImage3"
        @mouseleave="resetImage3"
        @click.stop="functionClick(3)"
      >
        <img
          style="width: 13px; height: 13px"
          class="init-card-content2-box-pingjiaguanxi"
          :src="currentImage3"
          alt=""
        />
        <div>评价关系</div>
      </div>
      <div
        class="init-card-content2-box"
        @mouseover="hoverImage4"
        @mouseleave="resetImage4"
        @click.stop="functionClick(4)"
      >
        <img
          style="width: 13px; height: 13px"
          class="init-card-content2-box-pingjiayaoqing"
          :src="currentImage4"
          alt=""
        />
        <div>评价邀请</div>
      </div>
      <div
        class="init-card-content2-box"
        @mouseover="hoverImage5"
        @mouseleave="resetImage5"
        @click.stop="functionClick(5)"
      >
        <img
          style="width: 13px; height: 13px"
          class="init-card-content2-box-pandianjiaozhun"
          :src="currentImage5"
          alt=""
        />
        <div>盘点校准</div>
      </div>
      <div
        class="init-card-content2-box"
        @mouseover="hoverImage6"
        @mouseleave="resetImage6"
        @click.stop="functionClick(6)"
      >
        <img
          style="width: 13px; height: 13px"
          class="init-card-content2-box-pandianjieguo"
          :src="currentImage6"
          alt=""
        />
        <div>盘点结果</div>
      </div>
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
// 定义默认图片和悬停图片
const defaultImage1 = ref(
  new URL('@/assets/imgs/otr/schemeSet/wenjuanguanli.png', import.meta.url).href
)
const defaultImage2 = ref(
  new URL('@/assets/imgs/otr/schemeSet/jiugongge.png', import.meta.url).href
)
const defaultImage3 = ref(
  new URL('@/assets/imgs/otr/schemeSet/pingjiaguanxi.png', import.meta.url).href
)
const defaultImage4 = ref(
  new URL('@/assets/imgs/otr/schemeSet/pingjiayaoqing.png', import.meta.url).href
)
const defaultImage5 = ref(
  new URL('@/assets/imgs/otr/schemeSet/pandianjiaozhun.png', import.meta.url).href
)
const defaultImage6 = ref(
  new URL('@/assets/imgs/otr/schemeSet/pandianjieguo.png', import.meta.url).href
)

const falg = ref(false)
const currentImage1 = ref(defaultImage1.value)
const currentImage2 = ref(defaultImage2.value)
const currentImage3 = ref(defaultImage3.value)
const currentImage4 = ref(defaultImage4.value)
const currentImage5 = ref(defaultImage5.value)
const currentImage6 = ref(defaultImage6.value)

const hoverImagePath1 = ref(
  new URL('@/assets/imgs/otr/schemeSet/wenjuanguanliAtc.png', import.meta.url).href
)
const hoverImagePath2 = ref(
  new URL('@/assets/imgs/otr/schemeSet/jiugonggeAtc.png', import.meta.url).href
)
const hoverImagePath3 = ref(
  new URL('@/assets/imgs/otr/schemeSet/pingjiaguanxiAtc.png', import.meta.url).href
)
const hoverImagePath4 = ref(
  new URL('@/assets/imgs/otr/schemeSet/pingjiayaoqingAtc.png', import.meta.url).href
)
const hoverImagePath5 = ref(
  new URL('@/assets/imgs/otr/schemeSet/pandianjiaozhunAtc.png', import.meta.url).href
)
const hoverImagePath6 = ref(
  new URL('@/assets/imgs/otr/schemeSet/pandianjieguoAtc.png', import.meta.url).href
)

// 鼠标悬停时切换图片
const hoverImage1 = () => {
  currentImage1.value = hoverImagePath1.value
}
const hoverImage2 = () => {
  currentImage2.value = hoverImagePath2.value
}
const hoverImage3 = () => {
  currentImage3.value = hoverImagePath3.value
}
const hoverImage4 = () => {
  currentImage4.value = hoverImagePath4.value
}
const hoverImage5 = () => {
  currentImage5.value = hoverImagePath5.value
}
const hoverImage6 = () => {
  currentImage6.value = hoverImagePath6.value
}

// 鼠标离开时恢复默认图片
const resetImage1 = () => {
  currentImage1.value = defaultImage1.value
}
const resetImage2 = () => {
  currentImage2.value = defaultImage2.value
}
const resetImage3 = () => {
  currentImage3.value = defaultImage3.value
}
const resetImage4 = () => {
  currentImage4.value = defaultImage4.value
}
const resetImage5 = () => {
  currentImage5.value = defaultImage5.value
}
const resetImage6 = () => {
  currentImage6.value = defaultImage6.value
}

const zhankai = () => {
  if (props.item.status === 1 || props.item.bonusPoint !== 0) {
    falg.value = true
  }
}
const likai = () => {
  falg.value = false
}
// 打开加分项
const goBonusPoint = (inventoryId) => {
  router.push({
    name: `BonusPoint`,
    query: { inventoryId: inventoryId }
  })
}
const emit = defineEmits(['delete-item', 'functionClick-item'])

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
  },
  {
    name: '九宫格设置',
    code: 'nineGrid',
    permission: 'otr_nineSquare_set',
    canClick: props.item.isSetJggsz == 1
  },
  {
    name: '评价关系',
    code: 'evaReleation',
    permission: 'otr_evaluate_relationship',
    canClick: props.item.isSetPjgx == 1
  },
  {
    name: '评价邀请',
    code: 'evaInvite',
    permission: 'otr_evaluate_Invite',
    canClick: props.item.isSetPjyq == 1
  },
  {
    name: '盘点校准',
    code: 'InventoryCalibration',
    permission: 'otr_inventory_calibration',
    canClick: props.item.isSetPdjz == 1
  },
  {
    name: '盘点结果',
    code: 'inventoryResult',
    permission: 'otr_inventory_result',
    canClick: props.item.isSetPdjg == 1
  }
]

const functionClick = (index) => {
  console.log('jjjjj')
  emit('functionClick-item', functionList[index - 1], props.item.id)
}
</script>

<style lang="scss" scoped>
/* 样式保持不变 */

.boxCard {
  width: 357px;
  min-height: 810px;
  background: #f5f6f5;
  border-radius: 10px;
  border: 1px solid rgba(169, 201, 174, 0.34);
}

.init-button {
  width: 108px;
  height: 40px;
  background: #90e79b;
  border-radius: 4px;
  // opacity: 0.09;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
}

.init-button-text {
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 14px;
  line-height: 40px;
  font-style: normal;
  text-align: center;
  color: #0a6916;
}

.init-card {
  position: relative;
  width: 317px;
  height: 345px;
  margin-left: 11px;
  background-color: #fff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.18);
  border-radius: 10px;
  padding-top: 16px;
  margin-bottom: 20px;
}

.init-card-title {
  margin-left: 11px;
  height: 22px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  margin-bottom: 12px;
}

.init-card-img {
  top: 20px;
  right: 20px;
  position: absolute;
  width: 21px;
  height: 4px;
  cursor: pointer;
}

.init-card-content {
  width: 296px;
  height: 161px;
  margin-left: 11px;
  background-image: url('@/assets/imgs/otr/schemeSet/calibrateBgImg.png');
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
}

.init-card-content-title {
  width: 48px;
  height: 17px;
  line-height: 17px;
  margin-top: 12px;
  margin-left: 10px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #666666;
  line-height: 17px;
  text-align: left;
  font-style: normal;
}

.init-card-contentBox {
  flex: 1;
  display: flex;
}

.init-card-content-text {
  flex: 1;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  text-align: right;
  font-style: normal;
  padding-top: 10px;
  padding-right: 12px;
  padding-left: 29px;
}

.init-card-content-text-box {
  width: 32.84px;
  height: 25px;
  color: #0064ff;
  background-color: #eef5ff;
  padding-left: 8px;
  padding-right: 8px;
  line-height: 25px;
  margin-left: 148px;
}

.init-card-content2 {
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  margin-top: 10px;
}

.init-card-content2-box {
  width: 77px;
  height: 53px;
  text-align: center;
  cursor: pointer;
  // margin-bottom: 8px;
  // margin-top: 8px;
  padding-top: 12px;
}

.init-card-content2-box:hover {
  background-color: #f8f9fa;
  border-radius: 6%;
}
.init-card-content2-box:nth-child(2) {
  margin-left: 28px;
  margin-right: 28px;
}
.init-card-content2-box:nth-child(2n + 1) {
  margin-left: 28px;
  margin-right: 28px;
}
.init-card-content2-box:nth-child(1) {
  margin-left: 0;
  margin-right: 0;
}
.init-card-content2-box:nth-child(3) {
  margin-left: 0;
  margin-right: 0;
}

.zhankaiBox {
  position: absolute;
  top: 15px;
  right: -20px;
  width: 104px;
  background-color: #fff;
  text-align: center;
  line-height: 33px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.falgButton {
  height: 33px;
  cursor: pointer;
}

.falgButton:hover {
  background-color: #f3f4f7;
}
</style>
