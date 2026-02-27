<!--
 * @Date: 2025-04-16 08:36:03
-->
<template>
  <ContentWrap>
    <div class="flex poster">
      <div class="flex-column">
        <div class="img-wapper" ref="imgWrapper">
          <img src="@/assets/imgs/system/tools/logo1.png" class="logo" alt="" />
          <img src="@/assets/imgs/system/tools/daojishi.png" alt="" class="daojishi" />
          <img src="@/assets/imgs/system/tools/shenyu.png" alt="" class="shengyu" />
          <div class="solo"> 10亿解锁休假升级 </div>
          <img src="@/assets/imgs/system/tools/yi.png" alt="" class="yi" />
          <img src="@/assets/imgs/system/tools/desc1.png" alt="" class="desc1" />
          <img src="@/assets/imgs/system/tools/desc2.png" alt="" class="desc2" />
          <span class="target">
            <!-- 遍历数字字符串，动态生成图片 -->
            <img
              v-for="(digit, index) in targetDigits"
              :key="index"
              :src="getDigitImageUrl(digit)"
              alt="digit"
              class="digit-image"
              :class="{ 'dian-image': digit == '.' }"
            />
          </span>
        </div>
        <el-button
          @click="handleUpdateOss(0)"
          style="margin-top: 20px"
          type="primary"
          :loading="loading[0]"
        >
          一键发送（十亿）</el-button
        >
      </div>
      <div class="flex-column">
        <div class="img-wapper" ref="imgWrapper_douyin">
          <img src="@/assets/imgs/system/tools/logo1.png" class="logo" alt="" />
          <img src="@/assets/imgs/system/tools/daojishi_douyin.png" alt="" class="daojishi" />
          <img src="@/assets/imgs/system/tools/shenyu.png" alt="" class="shengyu" />
          <!-- <div class="solo">  </div> -->
          <img src="@/assets/imgs/system/tools/yi.png" alt="" class="yi" />
          <img src="@/assets/imgs/system/tools/desc1_douyin.png" alt="" class="desc1" />
          <img src="@/assets/imgs/system/tools/desc2.png" alt="" class="desc2" />
          <span class="target">
            <!-- 遍历数字字符串，动态生成图片 -->
            <img
              v-for="(digit, index) in targetNumber_douyin"
              :key="index"
              :src="getDigitImageUrl(digit)"
              alt="digit"
              class="digit-image"
              :class="{ 'dian-image': digit == '.' }"
            />
          </span>
        </div>
        <el-button
          @click="handleUpdateOss(1)"
          style="margin-top: 20px"
          type="primary"
          :loading="loading[1]"
        >
          一键发送（抖音五亿）</el-button
        >
      </div>
      <!-- all -->
      <div class="flex-column">
        <div class="img-wapper img-wapper-all" ref="imgWrapper_all">
          <img src="@/assets/imgs/system/tools/logo1.png" class="logo" alt="" />
          <!-- <img src="@/assets/imgs/system/tools/quanli.png" class="quanli postiton" alt="" /> -->
          <!-- <img src="@/assets/imgs/system/tools/desc-all.png" class="desc-all postiton" alt="" /> -->
          <img src="@/assets/imgs/system/tools/huizong-bg.png" class="huizong-bg postiton" alt="" />
          <img
            src="@/assets/imgs/system/tools/huizong-title.png"
            class="huizong-title postiton"
            alt=""
          />
          <div class="all-wapper postiton flex-row">
            <div class="flex-row">
              <!-- 遍历数字字符串，动态生成图片 -->
              <img
                v-for="(digit, index) in allDetails.all"
                :key="index"
                :src="getDigitImageUrl(digit)"
                alt="digit"
                class="digit-image-all"
                :class="{ 'dian-image-all': digit == '.' }"
              />
            </div>
            <img src="@/assets/imgs/system/tools/all-yi.png" alt="" class="all-yi" />
          </div>
          <img
            src="@/assets/imgs/system/tools/taobao-title-bg.png"
            class="taobao-title-bg postiton"
            alt=""
          />
          <div class="taobao-wapper postiton flex-row">
            <div class="flex-row">
              <!-- 遍历数字字符串，动态生成图片 -->
              <img
                v-for="(digit, index) in allDetails?.taobao"
                :key="index"
                :src="getDigitImageUrl(digit)"
                alt="digit"
                class="digit-image-taobao"
                :class="{ 'dian-image-taobao': digit == '.' }"
              />
            </div>
            <img src="@/assets/imgs/system/tools/all-yi.png" alt="" class="taobao-yi" />
          </div>
          <img
            src="@/assets/imgs/system/tools/tianmao-title-bg-1.png"
            class="tianmiao-title-bg postiton"
            alt=""
          />
          <div class="taobao-wapper tianmao-wapper postiton flex-row">
            <div class="flex-row">
              <!-- 遍历数字字符串，动态生成图片 -->
              <img
                v-for="(digit, index) in allDetails?.tmall"
                :key="index"
                :src="getDigitImageUrl(digit)"
                alt="digit"
                class="digit-image-taobao"
                :class="{ 'dian-image-taobao': digit == '.' }"
              />
            </div>
            <img src="@/assets/imgs/system/tools/all-yi.png" alt="" class="taobao-yi" />
          </div>
          <img
            src="@/assets/imgs/system/tools/pdd-title-bg.png"
            class="pdd-title-bg postiton"
            alt=""
          />
          <div class="taobao-wapper pdd-wapper tianmao-wapper postiton flex-row">
            <div class="flex-row">
              <!-- 遍历数字字符串，动态生成图片 -->
              <img
                v-for="(digit, index) in allDetails?.pdd"
                :key="index"
                :src="getDigitImageUrl(digit)"
                alt="digit"
                class="digit-image-taobao"
                :class="{ 'dian-image-taobao': digit == '.' }"
              />
            </div>
            <img src="@/assets/imgs/system/tools/all-yi.png" alt="" class="taobao-yi" />
          </div>
          <img src="@/assets/imgs/system/tools/end.png" class="end postiton" alt="" />
        </div>
        <el-button
          style="margin-top: 20px"
          type="primary"
          :loading="loading[2]"
          @click="handleUpdateOss(2)"
        >
          一键发送（全部）</el-button
        >
      </div>
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
defineOptions({ name: 'TenMillion' })
import {
  getNewTenBillion,
  getTargetNumber_Douyin,
  getTargetNumberOther,
  updateFile,
  updateFile_Douyin,
  updateFileAll
} from '@/api/system/tools/index'
// import { downloadBlob } from '@/utils/download' // 本地测试
import html2canvas from 'html2canvas'
const message = useMessage() // 消息弹窗

const baseImgUrl = 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/'
const loading = ref([false, false, false])

// 数字图片的 URL 映射
const digitImageUrls = {
  '0': '913769390-0.png',
  '1': '393801215-1.png',
  '2': '303365022-2.png',
  '3': '995057460-3.png',
  '4': '935779817-4.png',
  '5': '842858326-5.png',
  '6': '544855710-6.png',
  '7': '680027321-7.png',
  '8': '817914186-8.png',
  '9': '196823409-9.png',
  '.': '820816610-dian2.png' // 小数点图片
}

// 计算属性：将字符串数字拆分为单个字符数组
const targetDigits = computed(() => targetNumber.value.split(''))

// 根据数字获取对应的图片 URL
const getDigitImageUrl = (digit: string) => {
  return `${baseImgUrl}${digitImageUrls[digit]}`
}

// 引用 img-wapper 的 DOM
const imgWrapper = ref<HTMLDivElement | null>(null)
const imgWrapper_douyin = ref<HTMLDivElement | null>(null)
const imgWrapper_all = ref<HTMLDivElement | null>(null)

const typeMap = {
  0: imgWrapper,
  1: imgWrapper_douyin,
  2: imgWrapper_all
}

// 点击按钮生成图片并上传到 OSS
const handleUpdateOss = async (type: 0 | 1 | 2) => {
  await initData()
  const img = typeMap[type].value
  if (!img) return

  try {
    loading.value[type] = true
    // 使用 html2canvas 将 DOM 转换为图片
    const canvas = await html2canvas(img, {
      useCORS: true, // 允许跨域加载图片
      backgroundColor: null, // 保持透明背景
      scale: 2, // 放大2倍
      dpi: 30 // 设置DPI为30
    })

    // 将 canvas 转换为 Blob
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), 'image/png', 0.9)
    )

    // 测试调用下载函数
    // downloadBlob(blob, 'canvas.png'); //本地测试效果

    if (blob) {
      // 上传到 OSS
      const formData = new FormData()
      formData.append('file', blob, 'target-image.png') // 文件名为 target-image.png
      formData.append('bussinessCode', 'BILLION') // 添加业务参数

      const uploadMap = {
        0: updateFile,
        1: updateFile_Douyin,
        2: updateFileAll
      }

      const upload = uploadMap[type] // 根据类型选择对应的上传函数

      const response = await upload(formData) // 调用上传接口
      console.log('上传成功:', response)
      message.success('图片更新成功')
      loading.value[type] = false
    } else {
      loading.value[type] = false
      console.error('生成图片失败')
    }
  } catch (error) {
    loading.value[type] = false
    console.error('生成图片或上传失败:', error)
  }
}

onMounted(() => {
  initData()
})

const targetNumber = ref('0.00')
const targetNumber_douyin = ref('0.00')
const allDetails = ref<{
  all: string
  pdd: string
  taobao: string
  tmall: string
}>({
  all: '0.00',
  pdd: '0.00',
  taobao: '0.00',
  tmall: '0.00'
})

const initData = async () => {
  const res = await getNewTenBillion() // 获取十亿数据
  const res_douyin = await getTargetNumber_Douyin() // 获取抖音数据
  const all = await getTargetNumberOther() // 获取全部数据
  allDetails.value = all || {
    all: '0.00',
    pdd: '0.00',
    taobao: '0.00',
    tmall: '0.00'
  }
  targetNumber.value = res
  targetNumber_douyin.value = res_douyin
}
</script>

<style lang="less" scoped>
.img-wapper {
  width: 320px;
  height: 568px;
  margin: 0 auto;
  background: url('@/assets/imgs/system/tools/shiyi.png') no-repeat center center;
  background-size: cover;
  position: relative;

  .logo {
    position: absolute;
    top: 20px;
    left: 10px;
    width: 100px;
    height: auto;
  }

  .daojishi {
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 250px;
    height: auto;
  }

  .shengyu {
    position: absolute;
    top: 220px;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 160px;
    height: auto;
  }

  .solo {
    position: absolute;
    top: 135px;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: #fff;
    font-weight: bold;
    text-align: center;

    border-radius: 159px;
    background: linear-gradient(90deg, #c30f01 0%, #fa0d02 100%);
    box-sizing: border-box;
    border: 1px solid #ffe6c8;
    padding: 3px 10px;
    box-sizing: border-box;

    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffca95;
  }

  .target {
    position: absolute;
    top: 53%;
    left: 47%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;

    .digit-image {
      width: 54px;
      /* 设置数字图片的宽度 */
      height: auto;
      /* 保持图片比例 */
      margin: 0 1px;
      /* 数字之间的间距 */
    }

    .dian-image {
      width: 30px;
      /* 设置小数点图片的宽度 */
      height: auto;
      /* 保持图片比例 */
      margin-top: 60px;
    }
  }

  .yi {
    position: absolute;
    top: 58%;
    right: 2px;
    transform: translate(-50%, -50%);
    width: 26px;
    height: auto;
  }

  .desc1 {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 140px;
    height: auto;
    margin-bottom: 5px;
  }

  .desc2 {
    position: absolute;
    bottom: 7%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 290px;
    height: auto;
  }
}

.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poster {
  justify-content: space-around;
  align-items: flex-start;
}

.img-wapper-all {
  width: 320px;
  height: 1147px;
  margin: 0 auto;
  background: url('@/assets/imgs/system/tools/all.png') no-repeat center center;
  background-size: cover;
  position: relative;

  .quanli {
    width: 68px;
    top: 259px;
  }

  .desc-all {
    width: 232px;
    top: 290px;
  }

  .huizong-bg {
    width: 291px;
    top: 260px;
  }

  .huizong-title {
    width: 133px;
    top: 300px;
  }

  .taobao-title-bg {
    width: 100%;
    top: 490px;
  }

  .tianmiao-title-bg {
    width: 100%;
    top: 670px;
  }

  .pdd-title-bg {
    width: 100%;
    top: 840px;
  }

  .all-wapper {
    width: 194px;
    height: 118px;
    top: 330px;

    .digit-image-all {
      width: 40px;
    }

    .dian-image-all {
      width: 20px;
      height: auto;
      /* 保持图片比例 */
      margin-top: 40px;
      margin-left: 5px;
    }

    .all-yi {
      width: 33px;
      margin-top: 30px;
    }
  }

  .taobao-wapper {
    width: 870px;
    height: 118px;
    top: 550px;

    .digit-image-taobao {
      width: 30px;
      /* 设置数字图片的宽度 */
      height: auto;
      /* 保持图片比例 */
      margin: 0 0px;
      /* 数字之间的间距 */
    }

    .dian-image-taobao {
      width: 14px;
      /* 设置小数点图片的宽度 */
      height: auto;
      /* 保持图片比例 */
      margin-top: 50px;
    }

    .taobao-yi {
      width: 22px;
      margin-top: 26px;
      margin-left: 13px;
    }
  }

  .tianmao-wapper {
    top: 720px;
  }

  .pdd-wapper {
    top: 890px;
  }

  .postiton {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .end {
    width: 300px;
    top: 1000px;
    left: 48.5%;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
