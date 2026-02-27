<!--
 * @Date: 2024-06-26 16:16:02
-->
<template>
  <div class="wrapper">
    <!-- 手机正文 -->
    <div v-if="showMobile" class="phone-content">
      <!-- 问卷标题 -->
      <div class="title">
        <img src="@/assets/imgs/questionnaire/h5title.png" alt="" />
      </div>
      <!-- 引导页 -->
      <div class="guide">
        <div class="guide-content" v-if="currentType == 1">
          <div class="content-title">
            <div class="btn"><span>内容</span></div>
            <span class="countDown">{{ countDown }}</span>
          </div>
          <div v-html="leadContent"></div>
        </div>
        <!-- 问卷页 -->
        <div class="guide-content" v-if="currentType == 2">
          <div
            v-for="(item, index) in userInfo?.resultInfos"
            :key="item.id"
            class="question-content"
          >
            <PreviewSingleChoice
              :key="item.id"
              v-if="item.otrProgramDto.type == 0"
              :detail="item"
              :currentIndex="index"
              @change="handleChange"
              :whiteBg="true"
              :isSpecial="isSpecialType"
            />
            <PreviewEssayQuestions
              v-if="item.otrProgramDto.type == 1"
              :detail="item"
              :currentIndex="index"
              @change="handleChange"
              :whiteBg="true"
              :isSpecial="isSpecialType"
            />
          </div>
          <div class="flex-row btn-wapper" v-if="!isSpecialType">
            <el-button @click="submit(1)" :color="'#0064FF'">提交</el-button>
            <!-- <el-button @click="submit(2)">暂存</el-button> -->
          </div>
        </div>
        <!-- 结束页 -->
        <div v-if="currentType == 3 && !isSpecialType" class="guide-content">
          <div class="flex-column">
            <div class="end-icon">
              <img src="@/assets/imgs/questionnaire/end-icon.png" alt="" />
            </div>
            <div class="content-info">
              <div class="line1">非常感谢您花时间参与我们的问卷调查</div>
              <div class="line2"
                >您的反馈对我们的研究非常重要，我们真诚地感谢您付出的时间和努力。</div
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- pc正文 -->
    <div v-if="showMobile == false" class="pc-content">
      <div class="title">
        <img src="@/assets/imgs/questionnaire/pctitle.png" alt="" />
      </div>
      <!-- 引导页 -->
      <div class="pc-content-guid">
        <div class="pc-content-guid-content" v-if="currentType == 1">
          <div class="content-title">
            <img src="@/assets/imgs/questionnaire/title.svg" alt="" />
            <span class="countDown">{{ countDown }}</span>
          </div>
          <div v-html="leadContent"></div>
        </div>
        <div class="pc-content-guid-content" v-if="currentType == 2">
          <div
            class="content-pc"
            v-for="(item, index) in userInfo?.resultInfos"
            :key="item.id"
            style="margin-bottom: 16px"
          >
            <div>
              <PreviewSingleChoice
                v-if="item.otrProgramDto.type == 0"
                :detail="item"
                :currentIndex="index"
                @change="handleChange"
                :whiteBg="true"
              />
              <PreviewEssayQuestions
                v-if="item.otrProgramDto.type == 1"
                :detail="item"
                :currentIndex="index"
                @change="handleChange"
                :whiteBg="true"
              />
            </div>
          </div>
          <div class="flex-row btn-wapper">
            <el-button @click="submit(1)" type="primary" :color="'#0064FF'">提交</el-button>
          </div>
        </div>
        <div class="pc-content-guid-content" v-if="currentType == 3">
          <div class="flex-column">
            <div class="end-icon-pc">
              <img src="@/assets/imgs/questionnaire/end-icon.png" alt="" />
            </div>
            <div class="content-info-pc">
              <div class="line1">非常感谢您花时间参与我们的问卷调查</div>
              <div class="line2"
                >您的反馈对我们的研究非常重要，我们真诚地感谢您付出的时间和努力。</div
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  queryByCode,
  getSurveyById,
  saveInvitation,
  getByCode
} from '@/api/otr/questionnaireSet/index'
import PreviewSingleChoice from '@/views/OTR/questionnaireSet/components/previewSingleChoice.vue'
import PreviewEssayQuestions from '@/views/OTR/questionnaireSet/components/previewEssayQuestions.vue'
const message = useMessage() // 消息弹窗

const code = ref()
const userInfo = ref()
const showMobile = ref()
const currentType = ref(1) // 1引导页 2正文 3结束页面

const countDown = ref(5)
const timer = ref()

const phone = ref()

const isSpecialType = computed(() => {
  return code.value.includes('NIANHUI')
})
const isResend = ref(false)
onMounted(async () => {
  const route = useRoute()
  // 定制化code 8888888
  code.value = route.query.code

  // 当前问卷是否为作废评价后重新发送
  isResend.value = route.query.isResend

  if (isSpecialType.value) {
    phone.value = route.query.phone
  }
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: '问卷努力加载中'
  })
  await initBase()
  // await getLocal()
  initList()
  detectDevice()
  loadingInstance.close()

  if (userInfo.value.status == '1') {
    currentType.value = 3
  } else {
    timer.value = setInterval(() => {
      if (countDown.value > 0) {
        countDown.value--
      } else {
        clearInterval(timer.value)
        currentType.value = 2
      }
    }, 1000)
  }
})

const handleChange = (index, item) => {
  userInfo.value.resultInfos[index] = item
}

// 提交
const submit = async (type) => {
  const arr: any = []
  userInfo.value.resultInfos.forEach((item) => {
    item.appraiseeList.forEach((ite) => {
      arr.push({
        programId: ite.programId,
        appraiseeId: ite.userId,
        choiceValue: ite.choiceValue,
        inputValue: ite.inputValue,
        inputValueTwo: ite.inputValueTwo
      })
    })
  })

  console.log(arr)

  // 判断如果是提交的话需要校验参数是否完整
  if (type == 1) {
    const flag = arr.every(
      (item) => item.choiceValue || (item.inputValue.trim() && item.inputValueTwo.trim())
    )

    if (!flag) {
      message.error('请填写完毕之后在提交问卷')
      return
    }
  }

  const params = {
    type,
    code: code.value,
    detailList: arr,
    phone: isSpecialType.value ? phone.value : undefined
  }

  if (isResend.value) {
    params.isResend = isResend.value
  }

  await saveInvitation(params)
  //下一步
  currentType.value = 3
}

const detectDevice = () => {
  var isMobile = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
  if (isMobile) {
    showMobile.value = true
  } else {
    showMobile.value = false
  }
}

window.addEventListener('resize', () => {
  // 重新检测设备类型
  detectDevice()
})

// 获取所有new
const initBase = async () => {
  try {
    const params = {
      code: code.value,
      phone: isSpecialType.value ? phone.value : undefined
    }
    if (isResend.value) {
      params.isResend = isResend.value
    }
    const res = await queryByCode(params)
    let list = res.resultInfos.map((item) => {
      const arr = item.appraiseeList.map((it) => {
        return {
          ...it,
          choiceValue: '',
          inputValue: '',
          inputValueTwo: '',
          qiestionId: item.otrProgramDto.id
        }
      })
      return {
        ...item,
        appraiseeList: arr
      }
    })
    userInfo.value = {
      ...res,
      resultInfos: list
    }
  } catch (error) {}
}

const detail = ref()
// 获取题目
const leadContent = ref()
const initList = async () => {
  const id = isSpecialType.value ? 'NIANHUI' : 123
  const res = await getSurveyById(id)
  countDown.value = res.leadStopTime || 5
  leadContent.value = res.leadContent || ''
}
</script>

<style lang="scss" scoped>
.wrapper {
  .phone-content {
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    background: #4757e0;
    .title {
      width: 100%;
      height: 235px;
      background: url('@/assets/imgs/questionnaire/h5-bg.png') no-repeat;
      background-size: cover;
      img {
        width: 375px;
        height: 160px;
      }
    }
    .guide {
      margin-top: -75px;
      position: relative;
      width: 100%;
      padding: 16px;
      padding-top: 0;
      box-sizing: border-box;
      .guide-content {
        width: 100%;
        min-height: calc(100vh - 200px);
        border-radius: 4px;
        background: white;
        position: relative;
        padding: 16px 12px;
        box-sizing: border-box;
        .content-title {
          height: 31px;
          display: flex;
          position: relative;
          .btn {
            width: 28px;
            height: 24px;
            line-height: 24px;
            padding: 5px 34px;
            margin: auto;
            background: linear-gradient(180deg, #0064ff 0%, #6967fe 100%);
            border-radius: 24px;
            span {
              display: inline-block;
              margin: auto;
              color: #fff;
              font-size: 14px;
            }
          }
          .countDown {
            position: absolute;
            right: 20px;
            top: 0;
            font-size: 16px;
            width: 37px;
            height: 37px;
            line-height: 37px;
            border-radius: 50%;
            background-color: #599aff;
            text-align: center;
            font-weight: 500;
            color: #fff;
          }
        }

        .flex-column {
          margin-top: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .end-icon {
            height: 190px;
            background: url('@/assets/imgs/questionnaire/round.png') no-repeat;
            background-size: 190px 190px;
            display: flex;
            align-items: center;
            img {
              width: 190px;
              height: 140px;
            }
          }
          .content-info {
            width: 300px;
            min-height: 121px;
            background: url('@/assets/imgs/questionnaire/end-content.png');
            background-size: 100% 100%;
            padding: 30px;
            box-sizing: border-box;
            word-break: break-all;
            .line1 {
              font-weight: 600;
              font-size: 14px;
              color: #333;
              margin-bottom: 10px;
            }
            .line2 {
              font-weight: 400;
              font-size: 13px;
              color: #333;
            }
          }
        }
      }
    }
  }

  .pc-content {
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    background: #4757e0;
    .title {
      width: 100%;
      height: 493px;
      background: url('@/assets/imgs/questionnaire/pcbg.png') no-repeat;
      background-size: cover;
      text-align: center;
      img {
        width: 698px;
        height: 158px;
      }
    }
    &-guid {
      margin-top: -335px;
      width: 100%;
      padding: 0 179px 163px 221px;
      box-sizing: border-box;
      &-content {
        padding: 16px 50px;
        border-radius: 8px;
        background: #ffffff;
        min-height: calc(100vh - 400px);
        .content-title {
          display: flex;
          position: relative;
          height: 42px;
          img {
            width: 109px;
            height: 46px;
            margin: auto;
          }
          .countDown {
            position: absolute;
            right: 20px;
            top: 0;
            font-size: 16px;
            width: 37px;
            height: 37px;
            line-height: 37px;
            border-radius: 50%;
            background-color: #599aff;
            text-align: center;
            font-weight: 500;
            color: #fff;
          }
        }

        .flex-column {
          margin-top: 46px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .end-icon-pc {
            height: 270px;
            background: url('@/assets/imgs/questionnaire/round.png') no-repeat;
            background-size: 270px 270px;
            display: flex;
            align-items: center;
            img {
              width: 270px;
              height: 200px;
            }
          }
          .content-info-pc {
            width: 500px;
            min-height: 121px;
            margin-top: 30px;
            background: url('@/assets/imgs/questionnaire/end-content.png');
            background-size: 100% 100%;
            padding: 30px;
            box-sizing: border-box;
            word-break: break-all;
            .line1 {
              font-weight: 600;
              font-size: 14px;
              color: #333;
              margin-bottom: 10px;
            }
            .line2 {
              font-weight: 400;
              font-size: 13px;
              color: #333;
            }
          }
        }
      }
    }
  }
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  // justify-content: end;
  justify-content: center;
  margin-top: 20px;
}
.special-btn-wapper {
  position: fixed;
  width: 100%;
  height: 60px;
  bottom: 0;
  left: 0;
  background: #ffffff;
  padding: 10px 15px;
  box-sizing: border-box;
  .btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #0064ff;
    border-radius: 8px;
    color: white;
    text-align: center;
  }
}

.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
