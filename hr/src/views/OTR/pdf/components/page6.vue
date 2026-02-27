<template>
  <div class="PdfPage6">
    <div class="row" ref="pdfPage6Ref">
      <img class="topIcon" src="@/assets/imgs/otr/pdf/page2_top.png" />
      <div class="column">
        <div class="descTitle">评价与建议</div>
        <div class="descSubTitle">EVALUATION AND SUGGE</div>
        <span class="otherTitle" v-if="onlyShowMyself"
          >本部分呈现您在同事、上级及自己眼中的优点与待提升之处，帮助您了解他人视角中的个人形象，借助反馈实现自我成长。</span
        >
        <span v-else class="otherTitle"
          >该部分是在同事、上级以及您自己心中，<span style="color: #f30303"
            >最重要的两个优点和两个待提升的点</span
          >，通过这些内容，可以了解您在同事心目中的形象，利用他们对您的期望和建议来提升自己。</span
        >
        <div class="title1" v-if="onlyShowMyself">突出优点</div>

        <div v-else class="title1">您的两个优点</div>

        <div v-if="onlyShowMyself" class="page6BgMySelf">
          <div style="display: flex; flex-direction: row; height: auto">
            <div class="leftItem" ref="leftItemRef">
              <div class="leftItem-top"> 他人评价</div>
              <div class="leftItem-content">
                <EvaluationList1
                  class="eavluationLeft"
                  :list="ydList1"
                  color="#232323"
                  dotColor="#0098f3"
                />
              </div>
            </div>
            <div class="rightItem" ref="rightItemRef" :style="{ height: `${leftItemHeight}` }">
              <div class="rightItem-top"> 自我评价</div>
              <div class="rightItem-content">
                <EvaluationList1
                  class="eavluationLeft"
                  :list="ydList2"
                  color="#232323"
                  dotColor="#6470D0"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- :style="{ height: `${otherRightHeight1}` }" -->
        <div v-else class="page6Bg1">
          <div class="btnBlue" style="margin-left: 22px; margin-top: 9px"
            >{{ onlyShowMyself ? '他人评价' : '直接上级' }}
          </div>
          <div class="btnBlue" style="margin-left: 428px; margin-top: -28px">{{
            onlyShowMyself ? '意见' : '同事/下级'
          }}</div>
          <div class="blueBg">
            <div class="selfBtn">自我评价</div>
            <EvaluationList
              class="eavluationCenter"
              :list="ydList2"
              color="#FFFFFF"
              dotColor="#FFFFFF"
            />
          </div>
          <div ref="eavluationLeft1Ref">
            <EvaluationList
              class="eavluationLeft"
              :list="ydList1"
              color="#232323"
              dotColor="#004AFF"
            />
          </div>

          <div
            style="
              /* position: absolute;
              top: 50px; */
              margin-left: 353px;
              margin-right: 16px;
              width: 171px;
            "
            :style="{ marginTop: `${eavluationLeft1Height}` }"
          >
            <div ref="eavluationRight1Ref">
              <EvaluationList
                class="eavluationRight"
                :list="ydList3"
                color="#232323"
                dotColor="#004AFF"
              />
            </div>
          </div>
        </div>

        <div class="title2" style="color: #004aff" v-if="onlyShowMyself">待提升点</div>

        <div v-else class="title2">您的两个待提升点</div>

        <div v-if="onlyShowMyself" class="page6BgMySelf">
          <div style="display: flex; flex-direction: row">
            <div class="leftItem" ref="leftItem1Ref">
              <div
                class="leftItem-top"
                style="background: linear-gradient(119deg, #f95c5d 0%, #f30303 100%)"
              >
                他人评价</div
              >
              <div class="leftItem-content1">
                <EvaluationList1
                  class="eavluationLeft"
                  :list="dtsList1"
                  color="#232323"
                  dotColor="#F52828"
                />
              </div>
            </div>
            <div class="rightItem" ref="rightItem1Ref" :style="{ height: `${leftItemHeight1}` }">
              <div class="rightItem-top" style="background: #e57541"> 自我评价</div>
              <div class="rightItem-content">
                <EvaluationList1
                  class="eavluationLeft"
                  :list="dtsList2"
                  color="#232323"
                  dotColor="#E57541"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- :style="{ height: `${otherRightHeight2}` }" -->
        <div v-else class="page6Bg2">
          <div class="btnBlue" style="margin-left: 22px; margin-top: 9px">{{
            onlyShowMyself ? '他人评价' : '直接上级'
          }}</div>
          <div class="btnBlue" style="margin-left: 428px; margin-top: -28px">{{
            onlyShowMyself ? '意见' : '同事/下级'
          }}</div>
          <div class="blueBg">
            <div class="selfBtn">自我评价</div>
            <EvaluationList
              class="eavluationCenter"
              :list="dtsList2"
              color="#FFFFFF"
              dotColor="#FFFFFF"
            />
          </div>
          <div ref="eavluationLeft2Ref">
            <EvaluationList
              class="eavluationLeft"
              :list="dtsList1"
              color="#232323"
              dotColor="#F30303"
            />
          </div>

          <div
            style="
              /* position: absolute;
              top: 50px; */
              margin-left: 353px;
              margin-right: 16px;
              width: 171px;
            "
            :style="{ marginTop: `${eavluationLeft2Height}` }"
          >
            <div ref="eavluationRight2Ref">
              <EvaluationList
                class="eavluationRight"
                :list="dtsList3"
                color="#232323"
                dotColor="#F30303"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EvaluationList from './evaluationList.vue'
import EvaluationList1 from './evaluationList1.vue'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  data: propTypes.object.def({}),
  onlyShowMyself: propTypes.bool.def(false)
})

const pdfPage6Ref = ref()
const page6Height = ref(842)
const leftItemRef = ref()
const rightItemRef = ref()

const leftItem1Ref = ref()
const rightItem1Ref = ref()

const leftItemHeight = ref()
const leftItemHeight1 = ref()

const eavluationRight1Ref = ref()
const eavluationRight2Ref = ref()
const otherRightHeight1 = ref()
const eavluationRight1 = ref()

const otherRightHeight1Value = ref()

const otherRightHeight2 = ref()

const eavluationLeft1Ref = ref()
const eavluationLeft2Ref = ref()
const eavluationLeft1Height = ref('')
const eavluationLeft2Height = ref('')

setTimeout(() => {
  if (props.onlyShowMyself) {
    getLeftItemHeight()
    getLeftItemHeight1()
  } else {
    getOtherRightHeight1()
    getOtherRightHeight2()
  }
}, 30)

const emits = defineEmits(['updatePage6Height'])

const getLeftItemHeight = () => {
  const height = leftItemRef.value?.clientHeight
  page6Height.value = pdfPage6Ref.value?.clientHeight || 842
  emits('updatePage6Height', page6Height.value)
  console.log('获取第6页的高度:111', pdfPage6Ref.value?.clientHeight)
  console.log('getLeftItemHeight', height)
  leftItemHeight.value = height && height > 0 ? `${height}px` : ''
}

const getLeftItemHeight1 = () => {
  const height = leftItem1Ref.value?.clientHeight
  console.log('getLeftItemHeight', height)
  leftItemHeight1.value = height && height > 0 ? `${height}px` : ''
}

const getOtherRightHeight1 = () => {
  const height = eavluationRight1Ref.value?.clientHeight
  const heightLeft = eavluationLeft1Ref.value?.clientHeight
  page6Height.value = pdfPage6Ref.value?.clientHeight || 842
  emits('updatePage6Height', page6Height.value)
  console.log('获取第6页的高度:2222', pdfPage6Ref.value?.clientHeight)

  console.log('getOtherRightHeight1', eavluationLeft1Ref.value?.clientHeight)
  let height2 = height
  if (heightLeft > height) {
    height2 = heightLeft + 6
  }
  eavluationRight1.value = height
  eavluationLeft1Height.value = `${-heightLeft}px`
  otherRightHeight1.value = height2 && height2 > 0 ? `${height2 + 50}px` : ''
  otherRightHeight1Value.value = height2 && height2 > 0 ? `${height2}` : '400'
}

const getOtherRightHeight2 = () => {
  const height = eavluationRight2Ref.value?.clientHeight
  const heightLeft = eavluationLeft2Ref.value?.clientHeight
  let height2 = height
  if (heightLeft > height) {
    height2 = heightLeft + 6
  }
  eavluationLeft2Height.value = `${-heightLeft}px`
  otherRightHeight2.value = height2 && height2 > 0 ? `${height2 + 50}px` : ''
}

const ydList1 = ref([])
const ydList2 = ref([])
const ydList3 = ref([])

const dtsList1 = ref([])
const dtsList2 = ref([])
const dtsList3 = ref([])

const handleEvluationData = () => {
  ydList1.value = []
  ydList2.value = []
  ydList3.value = []

  dtsList1.value = []
  dtsList2.value = []
  dtsList3.value = []

  const minCharLen = 2

  props.data.scores &&
    props.data.scores.forEach((item) => {
      const weidu = item['维度']
      if (weidu === '本人') {
        const ydList = item['优点']
        const tsdList = item['提升点']
        ydList.forEach((item1) => {
          if (item1 && item1 !== '无' && item1 !== '-' && item1.length > minCharLen) {
            ydList2.value.push(item1)
          }
        })
        tsdList.forEach((item2) => {
          if (item2 && item2 !== '无' && item2 !== '-' && item2.length > minCharLen) {
            dtsList2.value.push(item2)
          }
        })
      } else if (weidu === '直接上级') {
        const ydList = item['优点']
        const tsdList = item['提升点']
        if (props.onlyShowMyself) {
          ydList.forEach((item1) => {
            if (item1 && item1 !== '无' && item1 !== '-' && item1.length > minCharLen) {
              ydList1.value.push(item1)
            }
          })
          tsdList.forEach((item2) => {
            if (item2 && item2 !== '无' && item2 !== '-' && item2.length > minCharLen) {
              dtsList1.value.push(item2)
            }
          })
        } else {
          ydList.forEach((item1) => {
            if (item1 && item1 !== '无' && item1 !== '-' && item1.length > minCharLen) {
              ydList1.value.push(item1)
            }
          })
          tsdList.forEach((item2) => {
            if (item2 && item2 !== '无' && item2 !== '-' && item2.length > minCharLen) {
              dtsList1.value.push(item2)
            }
          })
        }
      } else if (weidu === '同事') {
        const ydList = item['优点']
        const tsdList = item['提升点']
        if (props.onlyShowMyself) {
          ydList.forEach((item1) => {
            if (item1 && item1 !== '无' && item1 !== '-' && item1.length > minCharLen) {
              ydList1.value.push(item1)
            }
          })
          tsdList.forEach((item2) => {
            if (item2 && item2 !== '无' && item2 !== '-' && item2.length > minCharLen) {
              dtsList1.value.push(item2)
            }
          })
        } else {
          ydList.forEach((item1) => {
            if (item1 && item1 !== '无' && item1 !== '-' && item1.length > minCharLen) {
              ydList3.value.push(item1)
            }
          })
          tsdList.forEach((item2) => {
            if (item2 && item2 !== '无' && item2 !== '-' && item2.length > minCharLen) {
              dtsList3.value.push(item2)
            }
          })
        }
      } else if (weidu === '下级') {
        const ydList = item['优点']
        const tsdList = item['提升点']
        if (props.onlyShowMyself) {
          ydList.forEach((item1) => {
            if (item1 && item1 !== '无' && item1 !== '-' && item1.length > minCharLen) {
              ydList1.value.push(item1)
            }
          })
          tsdList.forEach((item2) => {
            if (item2 && item2 !== '无' && item2 !== '-' && item2.length > minCharLen) {
              dtsList1.value.push(item2)
            }
          })
        } else {
          ydList.forEach((item1) => {
            if (item1 && item1 !== '无' && item1 !== '-' && item1.length > minCharLen) {
              ydList3.value.push(item1)
            }
          })
          tsdList.forEach((item2) => {
            if (item2 && item2 !== '无' && item2 !== '-' && item2.length > minCharLen) {
              dtsList3.value.push(item2)
            }
          })
        }
      }
    })
  if (props.onlyShowMyself) {
    if (props.data.otrCalibrationView) {
      if (props.data.otrCalibrationView.advantagesWork) {
        ydList3.value.push(props.data.otrCalibrationView.advantagesWork)
      }
      if (props.data.otrCalibrationView.improvementWork) {
        dtsList3.value.push(props.data.otrCalibrationView.improvementWork)
      }
    }
  }
  console.log('待提升点:', dtsList1)
}

onMounted(() => {
  handleEvluationData()
})
</script>

<style lang="scss" scoped>
.PdfPage6 {
  background-image: url('@/assets/imgs/otr/pdf/page2_bg.png');
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background: #e9f2fb;

  .row {
    display: flex;
    flex-direction: row;

    .topIcon {
      margin-top: 24px;
      margin-left: 14px;
      width: 23px;
      height: 27px;
    }

    .column {
      margin-left: 13px;
      margin-top: 17px;
      display: flex;
      flex-direction: column;

      .descTitle {
        font-weight: 500;
        font-size: 30px;
        color: #232323;
      }

      .descSubTitle {
        font-weight: 400;
        font-size: 12px;
        color: #666666;
      }

      .otherTitle {
        margin-top: 17px;
        font-weight: 400;
        width: 517px;
        font-size: 17px;
        color: #232323;
        line-height: 22px;
        margin-bottom: 16px;
      }

      .title1 {
        font-weight: 500;
        font-size: 17px;
        color: #004aff;
      }

      .title2 {
        margin-top: 21px;
        font-weight: 500;
        font-size: 17px;
        color: #f30303;
      }
    }
  }
}

.page6Bg1 {
  // background-image: url('@/assets/imgs/otr/pdf/page6_item_bg.png');
  width: 540px;
  min-height: 360px;
  // height: 299px;
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  margin-left: -12px;
  margin-top: 15px;
  background: #fdfdfd;
  border-radius: 16px 16px 16px 16px;
  box-sizing: border-box;
  border: 0px solid #ffffff;
  //display: flex;
  //flex-direction: row;
  // position: relative;

  .btnBlue {
    width: 90px;
    height: 28px;
    background: linear-gradient(119deg, #00b7ff 0%, #0057db 100%);
    box-shadow: 0px 1 5px 0px rgba(0, 26, 66, 0.3);
    border-radius: 14px;
    font-weight: 500;
    font-size: 12px;
    color: #ffffff;
    line-height: 28px;
    text-align: center;
  }

  .blueBg {
    // position: absolute;
    // top: 0px;
    margin-left: 198px;
    margin-top: 10px;
    background-image: url('@/assets/imgs/otr/pdf/page6_item_bg_blue.png');
    width: 144px;
    height: 299px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    .selfBtn {
      margin-top: 12px;
      width: 90px;
      height: 28px;
      background: #ffffff;
      border-radius: 14px;
      font-weight: 500;
      font-size: 12px;
      color: #0054d3;
      line-height: 28px;
      text-align: center;
    }
    .eavluationCenter {
      // position: absolute;
      // top: 52px;
      margin-top: 16px;
      margin-left: 16px;
      margin-right: 16px;
      width: 120px;
    }
  }

  .eavluationLeft {
    margin-left: 22px;
    margin-right: 16px;
    width: 160px;
    margin-top: -299px;
  }

  .eavluationRight {
    width: 171px;
  }
}

.page6Bg2 {
  // background-image: url('@/assets/imgs/otr/pdf/page6_item_bg.png');
  width: 540px;
  min-height: 360px;
  // min-height: 277px;
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  margin-left: -12px;
  margin-top: 11px;
  background: #fdfdfd;
  border-radius: 16px 16px 16px 16px;
  box-sizing: border-box;
  border: 0px solid #ffffff;
  // position: relative;

  .btnBlue {
    width: 90px;
    height: 28px;
    background: linear-gradient(119deg, #f95c5d 0%, #f30303 100%);
    box-shadow: 0px 1 5px 0px rgba(0, 26, 66, 0.3);
    border-radius: 14px;
    font-weight: 500;
    font-size: 12px;
    color: #ffffff;
    line-height: 28px;
    text-align: center;
  }

  .blueBg {
    // position: absolute;
    // top: 0px;
    margin-left: 198px;
    margin-top: 10px;
    background-image: url('@/assets/imgs/otr/pdf/page6_item_bg_red.png');
    width: 144px;
    height: 299px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;

    .selfBtn {
      margin-top: 12px;
      width: 90px;
      height: 28px;
      background: #ffffff;
      border-radius: 14px;
      font-weight: 500;
      font-size: 12px;
      color: #f40b0b;
      line-height: 28px;
      text-align: center;
    }
    .eavluationCenter {
      // position: absolute;
      // top: 52px;
      margin-top: 16px;
      margin-left: 16px;
      margin-right: 16px;
      width: 120px;
    }
  }

  .eavluationLeft {
    margin-left: 22px;
    margin-right: 16px;
    width: 160px;
    margin-top: -299px;
  }

  .eavluationRight {
    width: 171px;
  }
}

.page6BgMySelf {
  margin-top: 17px;
  margin-left: -12px;
  width: 540px;
  background: #fdfdfd;
  border-radius: 16px 16px 16px 16px;
  box-sizing: border-box;
  border: 0px solid #ffffff;

  .leftItem {
    margin: 10px 7px;
    width: 331px;
    display: flex;
    flex-direction: column;
    min-height: 232px;

    &-top {
      width: 333px;
      height: 38px;
      background: linear-gradient(119deg, #00b7ff 0%, #0057db 100%);
      border-radius: 5px 5px 0px 0px;
      font-weight: 700;
      font-size: 12px;
      color: #ffffff;
      line-height: 38px;
      text-align: center;
    }

    &-content {
      border-radius: 0px 0px 5px 5px;
      border: 1px solid #d9d9d9;
      width: 331px;
      min-height: 194px;

      .eavluationLeft {
        margin-top: 7px;
        margin-bottom: 7px;
        margin-left: 12px;
        margin-right: 12px;
      }
    }

    &-content1 {
      border-radius: 0px 0px 5px 5px;
      border: 1px solid #d9d9d9;
      width: 331px;
      min-height: 194px;

      .eavluationLeft {
        margin-top: 7px;
        margin-bottom: 7px;
        margin-left: 12px;
        margin-right: 12px;
      }
    }
  }

  .rightItem {
    margin: 10px 7px;
    margin-left: 3px;
    width: 184px;

    &-top {
      width: 186px;
      height: 38px;
      background: #6470d0;
      border-radius: 5px 5px 0px 0px;
      font-weight: 700;
      font-size: 12px;
      color: #ffffff;
      line-height: 38px;
      text-align: center;
    }

    &-content {
      border-radius: 0px 0px 5px 5px;
      border: 1px solid #d9d9d9;
      width: 184px;
      min-height: 194px;
      height: calc(100% - 38px);

      .eavluationLeft {
        margin-top: 7px;
        margin-bottom: 7px;
        margin-left: 12px;
        margin-right: 12px;
      }
    }
  }
}
</style>
