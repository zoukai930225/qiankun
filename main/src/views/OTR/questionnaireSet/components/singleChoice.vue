<!--
 * @Date: 2024-10-14 10:19:55
-->
<template>
  <div class="singleChoice">
    <div v-if="detail.name">
      <div class="progress">
        <Cycle
          :percentage="detail?.weight"
          :strokeColor="'#A7B1DD'"
          :size="34"
          :strokeWidth="5"
          :text="detail?.weight"
        />
      </div>
      <div class="title-wapper">
        <span class="title">{{ detail.name }}</span>
        <img src="@/assets/imgs/common/wenhao.png" class="icon" />
        <span
          class="desc"
          :style="{ width: `calc(100% - ${detail?.name?.length * 16}px - 70px)` }"
          >{{ detail.definition }}</span
        >
      </div>
      <div class="content">
        <div class="item" v-for="item in detail.programRankList" :key="item.id">
          <span class="item-title">（{{ item.minScore }}-{{ item.maxScore }}）{{ item.name }}</span>
          <span class="item-desc">{{ item.description }}</span>
        </div>
        <div class="choice-wapper">
          <div>
            <el-radio-group>
              <el-radio :value="0">0</el-radio>
              <el-radio :value="1">1</el-radio>
              <el-radio :value="2">2</el-radio>
              <el-radio :value="3">3</el-radio>
              <el-radio :value="4">4</el-radio>
              <el-radio :value="5">5</el-radio>
              <el-radio :value="6">6</el-radio>
              <el-radio :value="7">7</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="bottom-wapper">
        <div class="bottom-left">
          <span class="desc">在此题后加入新题</span>
          <div class="select-wapper">
            <span class="select-item select" @click.stop="inset('single')"
              ><img src="@/assets/imgs/otr/questionnaireSet/select.png" class="icon" /><span
                >选择题</span
              >
            </span>
            <div class="mid"></div>
            <span class="select-item edit-icon" @click.stop="inset('question')"
              ><img src="@/assets/imgs/otr/questionnaireSet/edit-icon.png" class="icon" /><span
                >填空题</span
              ></span
            >
          </div>
        </div>
        <div class="bottom-right">
          <div class="btn-item moveTop" @click.stop="handleClick('moveTop')"
            ><img src="@/assets/imgs/otr/questionnaireSet/moveTop.png" class="icon" />
            <span>置顶</span></div
          >
          <div class="btn-item moveBottom" @click.stop="handleClick('moveBottom')"
            ><img
              class="icon"
              src="@/assets/imgs/otr/questionnaireSet/moveBottom.png"
              alt=""
            /><span>置底</span></div
          >
          <div class="btn-item moveUp" @click.stop="handleClick('moveUp')"
            ><img class="icon" src="@/assets/imgs/otr/questionnaireSet/moveUp.png" alt="" /><span
              >上移</span
            ></div
          >
          <div class="btn-item moveDown" @click.stop="handleClick('moveDown')"
            ><img class="icon" src="@/assets/imgs/otr/questionnaireSet/moveDown.png" alt="" /><span
              >下移</span
            ></div
          >
          <div class="btn-item btn-del" @click.stop="handleClick('del')"
            ><img class="icon" src="@/assets/imgs/otr/questionnaireSet/btn-del.png" alt="" /><span
              >删除</span
            ></div
          >
        </div>
      </div>
    </div>
    <div v-else>
      <div class="btn-item btn-del empty-btn" @click.stop="handleClick('del')"
        ><img class="icon" src="@/assets/imgs/otr/questionnaireSet/btn-del.png" alt="" /><span
          >删除</span
        ></div
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import Cycle from './circle.vue'
const props = defineProps({
  detail: {
    type: Object,
    default: () => {}
  },
  currentIndex: {
    type: Number
  }
})
const emit = defineEmits(['btnClick', 'inset'])

const handleClick = (type) => {
  emit('btnClick', type, props.currentIndex)
}
//type single 单选题  question 填空题
const inset = (type) => {
  emit('inset', type, props.currentIndex)
}
</script>

<style lang="scss" scoped>
.singleChoice {
  min-height: 150px;
  cursor: pointer;
  width: 100%;
  background: linear-gradient(180deg, #f1f3fc 0%, #f7f9ff 100%);
  border-radius: 10px;
  padding: 12px 20px 18px 18px;
  box-sizing: border-box;
  position: relative;
  .progress {
    position: absolute;
    right: 19px;
    top: 5px;
  }
  .title-wapper {
    display: flex;
    flex-direction: row;
    // align-items: center;
    margin-bottom: 12px;
    .title {
      font-weight: 500;
      font-size: 16px;
      color: #333333;
    }
    .icon {
      width: 14px;
      height: 14px;
      margin: 3px 3px 0 20px;
    }

    .desc {
      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }
  }
  .content {
    width: 100%;
    padding: 18px 20px 15px 20px;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 10px;
    .item {
      display: flex;
      flex-direction: row;
      margin-top: 7px;
      margin-bottom: 7px;
      .item-title {
        font-weight: 400;
        font-size: 14px;
        color: #17c534;
        // margin-right: 20px;
        padding-right: 5px;
        width: 108px;
      }
      .item-desc {
        width: calc(100% - 113px);
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 21px;
      }
    }
    .choice-wapper {
      margin-top: 16px;
    }
  }
  .bottom-wapper {
    margin-top: 17px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .bottom-left {
      display: flex;
      flex-direction: row;
      .desc {
        line-height: 33px;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        margin-right: 20px;
      }
      .select-wapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        .select-item {
          font-weight: 400;
          font-size: 12px;
          color: #333333;
          .icon {
            width: 12px;
            height: 12px;
            margin-right: 7px;
          }
        }
        .select:hover img {
          content: url('@/assets/imgs/otr/questionnaireSet/select-activity.png');
        }
        .edit-icon:hover img {
          content: url('@/assets/imgs/otr/questionnaireSet/edit-icon-activity.png');
        }
        .select-item:hover span {
          color: #0064ff;
        }

        .mid {
          width: 1px;
          height: 11px;
          background: #d9d9d9;
          margin: 0 14px;
        }
      }
    }
  }
  .bottom-right {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .btn-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 63px;
    height: 31px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #c7c6cb;
    margin-left: 20px;
    .icon {
      width: 12px;
      height: 12px;
      margin-right: 3px;
    }
  }

  .moveTop:hover img {
    content: url('@/assets/imgs/otr/questionnaireSet/moveTopActivity.png');
  }
  .moveBottom:hover img {
    content: url('@/assets/imgs/otr/questionnaireSet/moveBottomActivity.png');
  }
  .moveUp:hover img {
    content: url('@/assets/imgs/otr/questionnaireSet/moveUpActivity.png');
  }
  .moveDown:hover img {
    content: url('@/assets/imgs/otr/questionnaireSet/moveDownActivity.png');
  }
  .btn-del:hover img {
    content: url('@/assets/imgs/otr/questionnaireSet/btn-del-activity.png');
  }

  .btn-item:hover span {
    font-weight: 400;
    color: #0064ff;
  }
  .btn-item:hover {
    border: 1px solid #0064ff;
  }

  .btn-del:hover span {
    font-weight: 400;
    color: #fb3830;
  }
  .btn-del:hover {
    border: 1px solid #fb3830;
  }
}
.empty-btn {
  position: absolute;
  bottom: 18px;
  right: 20px;
}
</style>
