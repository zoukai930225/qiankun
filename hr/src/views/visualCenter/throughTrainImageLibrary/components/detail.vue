<!--
 * @Date: 2025年5月14日16:37:15
-->
<template>
  <div class="detail-container">
    <!-- <div class="topZhanWei"> </div> -->
    <div class="dialog2-top">
      <div class="dialog2-top-left">
        <el-image class="Urlimg" :fit="'contain'" :src="detailData?.url || ''" :preview-src-list="currentIsAuto ? [detailData?.imageUrl] : detailData?.imageList || []
          " :initial-index="detailData?.currentIndex || 0" alt="" />
        <!-- 上一张 -->
        <img :src="leftButtonImg.normal" style="width: 33px; height: 33px" class="leftButton" alt="" @click="prevImage"
          @mouseenter="handleLeftHover(true)" @mouseleave="handleLeftHover(false)" />
        <!-- 下一张 -->
        <img :src="rightButtonImg.normal" style="width: 33px; height: 33px" class="rightButton" alt=""
          @click="nextImage" @mouseenter="handleRightHover(true)" @mouseleave="handleRightHover(false)" />
      </div>
      <div class="dialog2-top-right">
        <div class="dialog2-top-right-title">
          <img style="width: 12px; height: 12px; margin-right: 8px" src="@/assets/imgs/web/people.png" alt="" />
          人员
        </div>
        <div class="dialog2-top-right-list">
          <!-- 运营人员 -->
          <div style="display: flex; align-items: center">
            <div class="nameUser" style="width: 80px">运营</div>
            <div class="UserNameValue" style="
                max-width: calc(100% - 90px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              ">
              <el-tooltip placement="top">
                <span>{{
                  detailData.operationPersonnels?.map((p) => p.name).join('、') || '-'
                }}</span>
                <template #content>
                  <span style="white-space: normal">
                    <span v-for="(person, index) in detailData.operationPersonnels || []" :key="index">
                      {{ person.name }}
                      <span v-if="index < detailData.operationPersonnels?.length - 1">、</span>
                    </span>
                  </span>
                </template>
              </el-tooltip>
            </div>
          </div>

          <!-- 策划人员 -->
          <div style="display: flex; align-items: center">
            <div class="nameUser" style="width: 80px">策划</div>
            <div class="UserNameValue" style="
                max-width: calc(100% - 90px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              ">
              <el-tooltip placement="top">
                <span>{{
                  detailData.planningPersonnels?.map((p) => p.name).join('、') || '-'
                }}</span>
                <template #content>
                  <span style="white-space: normal">
                    <span v-for="(person, index) in detailData.planningPersonnels || []" :key="index">
                      {{ person.name }}
                      <span v-if="index < detailData.planningPersonnels?.length - 1">、</span>
                    </span>
                  </span>
                </template>
              </el-tooltip>
            </div>
          </div>

          <!-- 拍摄人员 -->
          <div style="display: flex; align-items: center">
            <div class="nameUser" style="width: 80px">拍摄</div>
            <div class="UserNameValue" style="
                max-width: calc(100% - 90px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              ">
              <el-tooltip placement="top">
                <span>{{detailData.cameraCrews?.map((p) => p.name).join('、') || '-'}}</span>
                <template #content>
                  <span style="white-space: normal">
                    <span v-for="(person, index) in detailData.cameraCrews || []" :key="index">
                      {{ person.name }}
                      <span v-if="index < detailData.cameraCrews?.length - 1">、</span>
                    </span>
                  </span>
                </template>
              </el-tooltip>
            </div>
          </div>

          <!-- 后期人员 -->
          <div style="display: flex; align-items: center">
            <div class="nameUser" style="width: 80px">后期</div>
            <div class="UserNameValue" style="
                max-width: calc(100% - 90px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              ">
              <el-tooltip placement="top">
                <span>{{
                  detailData.latePersonnels?.map((p) => p.name).join('、') || '-'
                }}</span>
                <template #content>
                  <span style="white-space: normal">
                    <span v-for="(person, index) in detailData.latePersonnels || []" :key="index">
                      {{ person.name }}
                      <span v-if="index < detailData.latePersonnels?.length - 1">、</span>
                    </span>
                  </span>
                </template>
              </el-tooltip>
            </div>
          </div>

          <!-- 设计人员 -->
          <div style="display: flex; align-items: center">
            <div class="nameUser" style="width: 80px">设计</div>
            <div class="UserNameValue" style="
                max-width: calc(100% - 90px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              ">
              <el-tooltip placement="top">
                <span>{{detailData.designers?.map((p) => p.name).join('、') || '-'}}</span>
                <template #content>
                  <span style="white-space: normal">
                    <span v-for="(person, index) in detailData.designers || []" :key="index">
                      {{ person.name }}
                      <span v-if="index < detailData.designers?.length - 1">、</span>
                    </span>
                  </span>
                </template>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog2-content">
      <div class="dialog2-content-left">
        <div class="dialog2-content-left-title">
          <img src="@/assets/imgs/web/fly2x.png" alt="" />
          推广信息
        </div>
        <div style="background-color: #fff">
          <div class="dialog2-content-left-xuqiu">
            <div class="dialog2-content-left-xuqiu-text" style="margin-left: 10px">需求方</div>
            <div class="dialog2-content-left-xuqiu-value" style="margin-left: 10px">
              <el-tooltip :content="detailData?.demandSide">
                {{ detailData?.demandSide }}
              </el-tooltip>
            </div>
            <div class="dialog2-content-left-xuqiu-value" v-if="!detailData?.demandSide" style="margin-left: 10px">-
            </div>
          </div>
          <div class="dialog2-content-left-xuqiu flex flex-col" style="height: 194px; margin-bottom: 0">
            <div class="dialog2-content-left-xuqiu-text" style="margin-left: 12px">测图目的</div>
            <div class="flex-1 h-0">
              <div class="dialog2-content-left-xuqiu-value cetumudi h-full" style="margin-left: 12px"
                v-if="detailData?.mappingPurpose">
                <el-tooltip>
                  <div class="whitespace-pre-wrap break-all">
                    {{ detailData?.mappingPurpose }}
                  </div>
                  <template #content>
                    <div>
                      {{ detailData?.mappingPurpose }}
                    </div>
                  </template>
                </el-tooltip>
              </div>
              <div class="dialog2-content-left-xuqiu-value cetumudi h-full" style="margin-left: 12px" v-else>
                -
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog2-content-right">
        <div class="dialog2-content-right-top">
          <div class="flex-row">
            <img src="@/assets/imgs/web/date_icon.png" alt="" />
            <div>测图时间</div>
            <div class="nameValue mapping-time">{{ filterTime(detailData?.mappingTime) }}</div>
          </div>
          <div v-if="showEdit" class="bianjiButoon" @click="handleEdit">编辑</div>
        </div>

        <div class="dialog2-content-right-content">
          <div class="dialog2-content-right-content-footer-top">
            <div style="color: #727e93">结论</div>
            <img v-if="detailData?.conclusionType === '1'" src="@/assets/imgs/web/success.png" alt="" />
            <img v-if="detailData?.conclusionType === '2'" src="@/assets/imgs/web/error.png" alt="" />
            <img v-if="detailData?.conclusionType === '3'" src="@/assets/imgs/web/again.png" alt="" />
            <img v-if="detailData?.conclusionType === '4'" src="@/assets/imgs/web/stopYh.png" alt="" />
            <div v-if="detailData?.conclusionType === '1'" style="
                color: #0064ff;
                font-family: PingFang SC;
                font-size: 14px;
                font-weight: 600;
              ">优化成功</div>
            <div v-if="detailData?.conclusionType === '2'" style="
                color: #eb3737;
                font-family: PingFang SC;
                font-size: 14px;
                font-weight: 600;
              ">优化失败</div>
            <div v-if="detailData?.conclusionType === '3'" style="
                color: #7070f5;
                font-family: PingFang SC;
                font-size: 14px;
                font-weight: 600;
              ">继续优化</div>
            <div v-if="detailData?.conclusionType === '4'" style="
                color: #ea5b25;
                font-family: PingFang SC;
                font-size: 14px;
                font-weight: 600;
              ">停止优化</div>
          </div>
          <Dialog2ListItem :dialog2Data="detailData" :isAuto="currentIsAuto" />
          <div class="dialog2-content-right-content-footer">
            <!-- <div class="dialog2-content-right-line"></div> -->
            <div class="dialog2-content-right-update">
              <div class="name" style="margin-left: 20px">更新人</div>
              <div class="nameValue" style="margin-left: 16px">
                <img style="
                    vertical-align: middle;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    margin-right: 8px;
                  " :src="detailData?.updatedAvatar || ''" alt="" />
                {{ detailData?.updatedName || '-' }}
              </div>
              <div class="name" style="margin-left: 42px; margin-right: 14px">更新时间</div>
              <div class="nameValue">{{ filterTime(detailData?.updatedAt) }}</div>
            </div>
            <div class="dialog2-content-right-content-footer-text">
              {{ detailData?.conclusion || '-' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog2-footerImgs">
      <div class="dialog2-footerImgs-Title">
        <img class="TitleImg" src="@/assets/imgs/web/uploadImg.png" alt="" />
        数据图上传
      </div>
      <div class="imgsUrl" v-if="detailData?.dataImages2">
        <div class="imgsUrlBox" v-for="(item, index) in detailData?.dataImages2 || []" :key="index"
          style="display: flex; flex-direction: column; align-items: center">
          <!-- 判断是否为图片 -->
          <template v-if="isImage(item.name || item.url)">
            <el-image class="img-item" :src="item.url" fit="cover" :preview-src-list="imageUrls"
              :initial-index="imageUrls.findIndex((url) => url === item.url)" />
            <el-link type="primary" :underline="false" class="img-link" :title="item.name">
              {{ item.name }}
            </el-link>
          </template>
          <template v-else>
            <img class="img-item" :src="getFileIcon(item.name || item.url)"
              @click="handleFile({ name: item.name, url: item.url })" style="cursor: pointer" />
            <el-link type="primary" :underline="false" class="img-link" :title="item.name"
              @click.prevent="handleFile({ name: item.name, url: item.url })">
              {{ item.name }}
            </el-link>
          </template>
        </div>
      </div>
      <div v-else class="imgsUrl2">
        <div style="display: flex; flex-direction: column; text-align: center; align-items: center">
          <img style="width: 157px; height: 72px" src="@/assets/imgs/web/noDataImgUrl.png" alt="" />
          <div class="nodata">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { isImage, isPPT, isExcel, isWord, microsoftOnlinePreviewUrl, getFileExtensionFromUrl } from '@/utils/file'
import Dialog2ListItem from './dialog2ListItem.vue'

// 引入文件类型图标
import fileExcel from '@/assets/imgs/excel.svg'
import filePdf from '@/assets/imgs/pdf.svg'
import fileDoc from '@/assets/imgs/doc.svg'
import filePpt from '@/assets/imgs/ppt.svg'

// 导入左按钮图片
import leftButtonNormal from '@/assets/imgs/web/leftButton.png'
import leftButtonHover from '@/assets/imgs/web/leftButton2.png'
import rightButtonNormal from '@/assets/imgs/web/rightButton.png'
import rightButtonHover from '@/assets/imgs/web/rightButton2.png'

// Props
interface Props {
  detailData?: any
  currentIsAuto?: boolean
  showEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  detailData: () => ({}),
  currentIsAuto: false,
  showEdit: true
})

// Emits
const emit = defineEmits(['edit', 'close'])

// 文件类型判断函数
function getFileIcon(urlOrName: string) {
  // 使用新的工具函数从URL或文件名中提取扩展名
  const ext = getFileExtensionFromUrl(urlOrName)

  if (['xls', 'xlsx'].includes(ext)) return fileExcel
  if (['pdf'].includes(ext)) return filePdf
  if (['doc', 'docx'].includes(ext)) return fileDoc
  if (['ppt', 'pptx'].includes(ext)) return filePpt
  // 其他类型可自定义默认图标
  return fileDoc
}

// 定义响应式数据
const leftButtonImg = ref({
  normal: leftButtonNormal, // 导入的图片模块
  hover: leftButtonHover,
  current: leftButtonNormal // 默认显示正常图片
})

const rightButtonImg = ref({
  normal: rightButtonNormal,
  hover: rightButtonHover,
  current: rightButtonNormal
})

// 左按钮鼠标状态处理（不影响原有 click 事件）
const handleLeftHover = (isHover: boolean) => {
  leftButtonImg.value.current = isHover ? leftButtonImg.value.hover : leftButtonImg.value.normal
}

// 右按钮鼠标状态处理（不影响原有 click 事件）
const handleRightHover = (isHover: boolean) => {
  rightButtonImg.value.current = isHover ? rightButtonImg.value.hover : rightButtonImg.value.normal
}

// 上一张图片
const prevImage = () => {
  const detailData = props.detailData
  if (detailData.currentIndex > 0) {
    detailData.currentIndex--
    detailData.url = detailData.imageList[detailData.currentIndex]
  }
}

// 下一张图片
const nextImage = () => {
  const detailData = props.detailData
  const maxIndex = detailData?.imageList?.length - 1
  if (detailData.currentIndex < maxIndex) {
    detailData.currentIndex++
    detailData.url = detailData.imageList[detailData.currentIndex]
  }
}

// 编辑按钮点击
const handleEdit = () => {
  emit('edit', props.detailData)
}

// 时间过滤器
const filterTime = (date) => {
  if (!date) {
    return ''
  }
  // 创建 Date 对象
  const dateObj = new Date(date)
  // 检查是否为有效的日期
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 处理文件点击事件
 * 如果是PPT、Excel、Word文档，则打开微软在线文档预览
 * 如果是文档类型，则打开微软在线文档预览
 * 否则打开文件下载链接
 * @param {Object} param0 文件名和url
 * @param {string} param0.name 文件名
 * @param {string} param0.url 文件url
 */
function handleFile({ name, url }: { name: string; url: string }) {
  const fileIdentifier = name || url
  if (isPPT(fileIdentifier) || isExcel(fileIdentifier) || isWord(fileIdentifier)) {
    window.open(microsoftOnlinePreviewUrl(url), '_blank')
  } else {
    window.open(url, '_blank')
  }
}

// 只保留图片类型的url
const imageUrls = computed(() =>
  props.detailData.dataImages2
    ? props.detailData.dataImages2.filter((i) => isImage(i.name || i.url)).map((i) => i.url)
    : []
)
</script>

<style lang="scss" scoped>
.detail-container {
  padding: 0 21px 20px 0;

  .topZhanWei {
    width: 398px;
    height: 54px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 10px;
  }

  .dialog2-top {
    display: flex;
    margin-bottom: 16px;

    .dialog2-top-left {
      // margin-left: 30px;
      margin-right: 16px;
      width: 180px;
      height: 220px;
      background: #f7f8fc;
      border-radius: 10px;
      position: relative;

      .Urlimg {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .leftButton,
      .rightButton {
        position: absolute;
        cursor: pointer;
        z-index: 1;
      }

      .leftButton {
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
      }

      .rightButton {
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .dialog2-top-right {
      flex: 1;
      border-radius: 8px;

      .dialog2-top-right-title {
        display: flex;
        padding-left: 30px;
        height: 32px;
        line-height: 32px;
        background: #f8f9fc;
        border-radius: 8px 8px 0 0;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        font-size: 14px;
        color: #3d3d3d;
        font-style: normal;
        place-items: center;
      }

      .dialog2-top-right-list {
        display: flex;
        flex-direction: column;

        >div {
          padding: 8px 16px;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }
        }

        .nameUser {
          color: #727e93;
          font-size: 14px;
        }

        .UserNameValue {
          color: #333;
          font-size: 14px;
        }
      }
    }
  }

  .dialog2-content {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;

    .dialog2-content-left {
      width: 300px;

      .dialog2-content-left-title {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        background: #f8f9fc;
        border-radius: 8px 8px 0 0;
        font-weight: 500;
        font-size: 14px;
        color: #3d3d3d;

        img {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }

      .dialog2-content-left-xuqiu {
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .dialog2-content-left-xuqiu-text {
          color: #727e93;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .dialog2-content-left-xuqiu-value {
          color: #333;
          font-size: 14px;

          &.cetumudi {
            max-height: 150px;
            overflow-y: auto;
          }
        }
      }
    }

    .dialog2-content-right {
      flex: 1;

      .dialog2-content-right-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #f8f9fc;
        border-radius: 8px 8px 0 0;

        .flex-row {
          display: flex;
          align-items: center;
          gap: 8px;

          img {
            width: 16px;
            height: 16px;
          }

          .nameValue {
            color: #333;
            font-weight: 500;
          }
        }

        .bianjiButoon {
          background: #409eff;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;

          &:hover {
            background: #66b1ff;
          }
        }
      }

      .dialog2-content-right-content {
        padding: 16px;

        .dialog2-content-right-content-footer-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;

          img {
            width: 16px;
            height: 16px;
          }
        }

        .dialog2-content-right-content-footer {
          .dialog2-content-right-update {
            display: flex;
            align-items: center;
            margin-bottom: 12px;

            .name {
              color: #727e93;
              font-size: 14px;
            }

            .nameValue {
              color: #333;
              font-size: 14px;
              display: flex;
              align-items: center;
            }
          }

          .dialog2-content-right-content-footer-text {
            color: #333;
            font-size: 14px;
            line-height: 1.6;
          }
        }
      }
    }
  }

  .dialog2-footerImgs {
    .dialog2-footerImgs-Title {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: #f8f9fc;
      border-radius: 8px 8px 0 0;
      font-weight: 500;
      font-size: 14px;
      color: #3d3d3d;

      .TitleImg {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }

    .imgsUrl {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding: 16px;

      .imgsUrlBox {
        .img-item {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .img-link {
          width: 80px;
          text-align: center;
          font-size: 12px !important;
          display: block;

          :deep(.el-link__inner) {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            display: block !important;
            width: 100% !important;
            max-width: 80px !important;
            line-height: 1.2 !important;
            text-align: center !important;
            box-sizing: border-box !important;
          }
        }
      }
    }

    .imgsUrl2 {
      padding: 40px;
      text-align: center;

      .nodata {
        color: #999;
        font-size: 14px;
        margin-top: 12px;
      }
    }
  }
}
</style>
