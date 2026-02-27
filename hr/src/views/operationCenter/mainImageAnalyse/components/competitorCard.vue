<template>
  <div class="wrapper">
    <div class="title">
      <div class="label">
        <div>{{ index + 1 }}</div>
      </div>
      <div class="btn" v-if="isEdit">
        <el-icon class="icon" color="#0064FF" @click="handleEdit" size="16">
          <Edit />
        </el-icon>
        <img src="@/assets/imgs/oa/mainImg/del.svg" alt="" @click="handleDel" />
      </div>
    </div>
    <div class="content">
      <div class="top">
        <el-image class="mainPic" :src="competitorParams.mainImageInfo ? competitorParams.mainImageInfo?.fileUrl : ''"
          :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-teleported="true" :preview-src-list="[
            competitorParams.mainImageInfo ? competitorParams.mainImageInfo?.fileUrl : ''
          ]" fit="cover" />
        <div class="item">
          <div class="label">
            <img src="@/assets/imgs/oa/mainImg/icon1.svg" alt="" />
            <span>优势</span>
          </div>
          <s-text-area v-model="competitorParams.competitorAdvantage" :readonly="true" :resize="'none'"
            :disabled="!isEdit" />
        </div>
      </div>
      <div class="center item">
        <div class="label">
          <img src="@/assets/imgs/oa/mainImg/icon2.svg" alt="" />
          <span>可取之处</span>
        </div>
        <s-text-area v-model="competitorParams.competitorLearn" :readonly="true" :resize="'none'" :disabled="!isEdit" />
      </div>
      <div class="bottom item">
        <div class="label">
          <img src="@/assets/imgs/oa/mainImg/icon3.svg" alt="" />
          <span>竞品链接</span>
        </div>
        <s-text-area v-model="competitorParams.competitorUrl" :readonly="true" :resize="'none'" :disabled="!isEdit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
const message = useMessage() // 消息弹窗

const props = defineProps({
  forms: {
    type: Object as any,
    default: () => { }
  },
  index: {
    type: Number,
    default: 0
  },
  isEdit: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['delete', 'update'])

const competitorParams: any = computed({
  get: () => {
    return props.forms || {}
  },
  set: (val: {}) => { }
})

const handleEdit = () => {
  emit('update', 'competitor', props.forms.id)
}
const handleDel = () => {
  emit('delete', props.forms.id, 'competitor')
}

onMounted(() => { })

onUnmounted(() => { })
</script>

<style scoped lang="scss">
.wrapper {
  width: 423px;
  height: 273px;
  background: url('@/assets/imgs/oa/mainImg/cardBg1.png') no-repeat;
  border-radius: 4px;
  margin-bottom: 20px;

  .title {
    height: 28px;
    width: 100%;
    position: relative;

    .label {
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 16px;
      background: rgba(0, 100, 255, 0.28);
      border-radius: 4px 0px 4px 0px;
      display: flex;
      align-items: center;

      div {
        font-size: 10px;
        color: #fff;
        margin: 0 auto;
      }
    }

    .btn {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }

      img {
        cursor: pointer;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .content {
    margin: 0 18px 10px 14px;

    .item {
      .label {
        height: 17px;
        line-height: 17px;
        margin: 4px 0 2px;

        img {
          margin-right: 6px;
          margin-bottom: -2px;
        }

        span {
          color: #0064ff;
          font-size: 12px;
          font-family: AlibabaPuHuiTi_2_75_SemiBold;
        }
      }

      :deep(.el-textarea__inner, .el-input__wrapper) {
        background-color: #fff !important;
        box-shadow: none !important;
        border-radius: 2px;
        border: 1px solid #efeded;
      }
    }

    .top {
      display: flex;
      height: 78px;

      .mainPic {
        width: 78px;
        height: 78px;
        margin-right: 16px;
        border-radius: 5px;
        z-index: 999;
      }

      :deep(.el-textarea__inner) {
        width: 296px;
        height: 55px;
      }
    }

    .center {
      height: 71px;

      :deep(.el-textarea__inner) {
        width: 391px;
        height: 48px;
      }
    }

    .bottom {
      height: 71px;

      :deep(.el-textarea__inner) {
        width: 391px;
        height: 48px;
      }
    }
  }

  &:nth-child(1) {
    .title {
      .label {
        background: #ff6634;
      }
    }
  }

  &:nth-child(2) {
    .title {
      .label {
        background: #2bcc3a;
      }
    }
  }

  &:nth-child(3) {
    .title {
      .label {
        background: #ffcb33;
      }
    }
  }

  &:nth-child(4) {
    .title {
      .label {
        background: #33c0fe;
      }
    }
  }

  &:nth-child(5) {
    .title {
      .label {
        background: #0064ff;
      }
    }
  }

  .form {
    padding: 0 19px 24px 18px;
  }
}
</style>
