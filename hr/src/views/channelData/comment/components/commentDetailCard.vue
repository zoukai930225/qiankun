<template>
  <div class="conatiner">
    <el-avatar :src="row.userHeadPicurl" :size="40">
      <el-icon :size="30" color="#ffffff">
        <UserFilled />
      </el-icon>
    </el-avatar>
    <div class="conatiner-main">
      <div class="conatiner-main-firstLine row-center">
        <div class="row-center">
          <div class="title">{{ row.userNickName }}</div>
          <img :src="row.userTagIconPic" class="user-tag-icon ml-5px" object-fit="contain" style="width: 24px;" />
          <!-- <div class="row-center" style="position: relative;">
            <img src="@/assets/svgs/vip.svg" class="vip-icon" />
            <div class="vip-bg">1</div>
          </div> -->
        </div>
        <div class="row-center right-text">
          <el-icon :size="16" color="#999999">
            <ChatDotRound />
          </el-icon>
          <div class="ml5px mr15px">{{ row.commentCount }}</div>
          <img src="@/assets/svgs/zan.svg" class="zan-icon" />
          <div class="ml5px">{{ row.likeCount }}</div>
        </div>
      </div>
      <el-tooltip effect="dark" :content="row.skuValue" popper-style="max-width:240px;word-break:break-all"
        :disabled="infoDisabled">
        <div class="conatiner-main-secondLine text1">
          {{ row.feedbackDate + ' · ' + row.skuValue }}
        </div>
      </el-tooltip>
      <div class="comment-line">
        {{ row.feedback }}
      </div>
      <div class="comment-media">
        <el-image :style="`width:${width / 5 - 8}px;height:${width / 5 - 8}px;`" class="each" :src="value"
          :preview-src-list="row.pictures" show-progress fit="fill" preview-teleported
          v-for="(value, index) in row.pictures" :key="value" :initial-index="index" lazy />
        <div style="position: relative;" v-if="row.video">
          <video id="video" :style="`width:${width / 5 - 8}px;height:${width / 5 - 8}px;`" :src="row.video"
            style="object-fit: cover;border-radius:12px" />
          <div class="row-center video-icon"
            :style="`width:${width / 5 - 8}px;height:${width / 5 - 8}px;justify-content: center;`">
            <el-icon color="rgba(255,255,255,0.8)" :size="30" @click="showVideo" style="cursor: pointer;">
              <VideoPlay />
            </el-icon>
          </div>
        </div>
        <!-- <div class="each row-center video-box" :style="`width:${width / 5 - 8}px;height:${width / 5 - 8}px;`"
          @click="showVideo" v-if="row.video">
          <el-icon :size="(width / 5 - 8) * 0.7" color="#999999">
            <VideoCameraFilled />
          </el-icon>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  width: {
    type: Number,
    default: 452
  },
  row: {
    type: Object as any,
    requird: true
  }
})
const emit = defineEmits(['showVideo'])
function getLength(str: string, size = 14) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i].charCodeAt(0) > 255) {//字符编码大于255，说明是双字节字符
      length += 2;
    } else {
      length = length + 1.2;
    }
  }
  return length * (size / 2);
}

const infoDisabled = computed(() => {
  return getLength((props.row.feedbackDate + ' · ' + props.row.skuValue) || '') <= props.width - 3
})

const showVideo = () => {
  emit('showVideo', props.row)
}
</script>
<style lang="scss" scoped>
.conatiner {
  width: 100%;
  display: flex;

  &-main {
    margin-left: 10px;
    width: calc(100% - 50px);

    &-firstLine {
      justify-content: space-between;

      .title {
        color: #333;
      }

      .vip-icon {
        width: 14px;
        height: 14px;
        margin-left: 5px;
      }

      .vip-bg {
        position: absolute;
        margin-left: 12px;
        width: 25px;
        height: 14px;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        background-color: #F84D01;
        z-index: -1;
        font-size: 10px;
        line-height: 14px;
        color: #fff;
      }

      .right-text {
        font-size: 12px;
        color: #999999;
        line-height: 12px;

      }

      .zan-icon {
        width: 16px;
        height: 16px;
      }
    }

    &-secondLine {
      word-break: break-all;
      color: #999999;
      font-size: 12px;
      line-height: 16px;
      text-align: left;
    }

    .comment-line {
      word-break: break-all;
      color: #333;
      font-size: 14px;
      line-height: 20px;
      text-align: left;
      margin-top: 5px;
    }

    .comment-media {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 10px;
      margin-top: 10px;

      .each {
        border-radius: 12px;
      }
    }
  }

}

.video-box {
  cursor: pointer;
  justify-content: center;
  background-color: #dcdcdc;
}

.video-icon {
  cursor: pointer;
  position: absolute;
  font-weight: bold;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  border-radius: 12px;
}
</style>