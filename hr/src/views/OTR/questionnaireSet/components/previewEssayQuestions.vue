<!--
 * @Date: 2024-10-14 10:19:55
-->
<template>
  <div class="essayQuestions" :class="whiteBg ? 'whiteBg' : 'otherBg'">
    <div class="title-wapper">
      <div class="title">{{ detail?.otrProgramDto?.name || detail?.name }}:
        {{ detail?.otrProgramDto?.definition || detail?.definition }}</div>
    </div>
    <div v-if="!review">
      <div class="content" v-for="(item, index) in answerList" :key="index">
        <div class="item flex-row">
          <span class="desc"></span>
          <span class="item-desc">{{ isSpecial ? '分数' : item.name }}</span>
        </div>
        <div class="choice-wapper">
          <div>
            <s-text-area placeholder="1.请输入内容" v-model="item.inputValue" style="margin-bottom: 16px"
              @change="handleChange" />
            <s-text-area placeholder="2.请输入内容" v-model="item.inputValueTwo" @change="handleChange" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- 预览 -->
      <!-- <div class="tiankong-desc">请给出被评价人在工作中最突出的两个优点？</div> -->
      <div class="content">
        <div class="item flex-row">
          <span class="desc"></span>
          <span class="item-desc">被评价人1</span>
        </div>
        <div class="choice-wapper">
          <div>
            <el-input placeholder="1.请输入内容" style="margin-bottom: 16px" @change="handleChange" />
            <el-input placeholder="2.请输入内容" @change="handleChange" />
          </div>
        </div>
      </div>
      <div class="content">
        <div class="item flex-row">
          <span class="desc"></span>
          <span class="item-desc">被评价人2</span>
        </div>
        <div class="choice-wapper">
          <div>
            <el-input placeholder="1.请输入内容" style="margin-bottom: 16px" @change="handleChange" />
            <el-input placeholder="2.请输入内容" @change="handleChange" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { cloneDeep } from 'lodash-es'
const props = defineProps({
  detail: {
    type: Object,
    default: () => { }
  },

  currentIndex: {
    type: Number,
    default: 0
  },
  whiteBg: {
    type: Boolean,
    default: false
  },
  review: {
    type: Boolean,
    default: false
  },
  isSpecial: {
    type: Boolean,
    default: false
  }
})

const detailInfo = ref()
const answerList = ref()
watch(
  () => props.detail,
  (newValue) => {
    detailInfo.value = newValue
    answerList.value = cloneDeep(newValue.appraiseeList)
  },
  {
    deep: true,
    immediate: true
  }
)

const emit = defineEmits(['change'])
const handleChange = () => {
  detailInfo.value.appraiseeList = answerList.value
  emit('change', props.currentIndex, detailInfo.value)
}
</script>

<style lang="scss" scoped>
.otherBg {
  background: linear-gradient(180deg, #f1f3fc 0%, #f7f9ff 100%);
  cursor: pointer;

  .content {
    padding: 18px 20px 15px 20px;
  }
}

.whiteBg {
  background: white;
}

.essayQuestions {
  width: 100%;
  border-radius: 10px;
  padding: 12px 20px 12px 18px;
  box-sizing: border-box;

  .title-wapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 12px;

    .title {
      font-weight: 500;
      font-size: 14px;
      color: #333333;
    }
  }

  .content {
    margin-bottom: 18px;
    width: 100%;
    // padding: 18px 20px 15px 20px;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 10px;

    .item {
      align-items: center;

      .item-desc {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }

      .desc {
        display: block;
        width: 3px;
        height: 10px;
        background: #0064ff;
        margin-right: 6px;
      }
    }

    .choice-wapper {
      margin-top: 16px;
    }
  }
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  // background: #f3f4f7;
  border: 0.5px solid #e5e5e5;
  border-radius: 4px;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.tiankong-desc {
  font-weight: 500;
  font-size: 14px;
  color: #333333;
  margin-bottom: 5px;
}
</style>
