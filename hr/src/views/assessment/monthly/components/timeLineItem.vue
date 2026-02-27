<template>
  <div class="record-item">
    <div class="top">
      <img src="~@/assets/imgs/common/pass-icon.png" style="width: 16px; height: 16px" />
      <LineAvatar class="avatar" :user="{ name: item?.name, avatarOrigin: item?.tx }" :size="16" />
      <div class="time">{{ item?.createdAt }}</div>
    </div>
    <div class="bottom">
      <div class="line" :style="index - 1 === 0 ? 'display: none' : ''"></div>
      <div class="item-content">
        <div class="item">
          <div class="key">能力：</div>
          <LineTages
            :txt="getDicInfo(dictInfo, item?.nl, 'label')"
            :background="getDicInfo(dictInfo, item?.nl, 'background')"
            :color="getDicInfo(dictInfo, item?.nl, 'color')"
          />
        </div>
        <div class="item">
          <div class="key">潜力：</div>
          <LineTages
            :txt="getDicInfo(dictInfo, item?.ql, 'label')"
            :background="getDicInfo(dictInfo, item?.ql, 'background')"
            :color="getDicInfo(dictInfo, item?.ql, 'color')"
          />
        </div>
        <div class="item">
          <div class="key">价值观：</div>
          <LineTages
            :txt="getDicInfo(dictInfo, item?.jzg, 'label')"
            :background="getDicInfo(dictInfo, item?.jzg, 'background')"
            :color="getDicInfo(dictInfo, item?.jzg, 'color')"
          />
        </div>
        <div class="item">
          <div class="key">团队中价值：</div>
          <LineTages
            :txt="getDicInfo(dictInfo, item?.tdzjz, 'label')"
            :background="getDicInfo(dictInfo, item?.tdzjz, 'background')"
            :color="getDicInfo(dictInfo, item?.tdzjz, 'color')"
          />
        </div>
        <div class="item">
          <div class="key"></div>
        </div>
      </div>
      <div class="remark">
        <div class="title">备注</div>
        <div :class="item.remark ? 'val' : 'val-none'">
          {{ item.remark || '-' }}
        </div>
      </div>
      <div style="color: #666666; font-size: 14px; padding: 10px 0" v-for="item in questions">
        <div style="padding: 5px 0">{{ item.label + item.desc }}</div>
        <div style="padding: 5px"
          >答案：{{ item.value ? (item.value === '0' ? '否' : '是') : '-' }}</div
        >
      </div>
      <div class="item-content" style="margin: 15px 0">
        <div class="item">
          <div class="key">主动性：</div>
          <LineTages
            :txt="getDicInfo(otherOptions, item?.zdx, 'label')"
            :background="getDicInfo(otherOptions, item?.zdx, 'background')"
            :color="getDicInfo(otherOptions, item?.zdx, 'color')"
          />
        </div>
        <div class="item">
          <div class="key">概念思维：</div>
          <LineTages
            :txt="getDicInfo(otherOptions, item?.gnsw, 'label')"
            :background="getDicInfo(otherOptions, item?.gnsw, 'background')"
            :color="getDicInfo(otherOptions, item?.gnsw, 'color')"
          />
        </div>
        <div class="item">
          <div class="key">影响力：</div>
          <LineTages
            :txt="getDicInfo(otherOptions, item?.yxl, 'label')"
            :background="getDicInfo(otherOptions, item?.yxl, 'background')"
            :color="getDicInfo(otherOptions, item?.yxl, 'color')"
          />
        </div>
        <div class="item">
          <div class="key">成就导向：</div>
          <LineTages
            :txt="getDicInfo(otherOptions, item?.cjdx, 'label')"
            :background="getDicInfo(otherOptions, item?.cjdx, 'background')"
            :color="getDicInfo(otherOptions, item?.cjdx, 'color')"
          />
        </div>
        <div class="item">
          <div class="key">坚韧性：</div>
          <LineTages
            :txt="getDicInfo(otherOptions, item?.jrx, 'label')"
            :background="getDicInfo(otherOptions, item?.jrx, 'background')"
            :color="getDicInfo(otherOptions, item?.jrx, 'color')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LineTages from '@/components/template/table/components/lineTage.vue'
import { otherOptions } from '../config/config'
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  index: {
    type: Number,
    default: 0
  },
  dictInfo: {
    type: Array,
    default: () => []
  }
})

const questions = computed(() => {
  if (props?.item?.questions) {
    return JSON.parse(props.item.questions)
  }
  return []
})

const getDicInfo = (dictInfo: any, value: any, name: string = 'color') => {
  const tar: any = dictInfo.find((dic: any) => dic.value === value)
  return tar && tar[name] ? tar[name] : ''
}
</script>

<style lang="scss" scoped>
// @use './styles.scss';

// .records-content {
// padding: 7px 5px;

.record-item {
  .top {
    display: flex;
    align-items: center;

    .avatar {
      margin-left: 20px;
    }

    .time {
      font-size: 12px;
      color: #8c8e90;
      margin-left: 10px;
    }
  }

  .bottom {
    padding: 11px 0 11px 37px;
    position: relative;

    .line {
      position: absolute;
      top: 2px;
      left: 7px;
      height: 98%;
      background: #d8dce5;
      width: 1px;
    }

    .item-content {
      // width: 378px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item {
        flex: 1;
        display: flex;
        align-items: center;
        // min-width: 105px;
        &:last-child {
          min-width: 120px;
        }

        .key {
          font-size: 14px;
          color: #666666;
        }
      }
    }

    .remark {
      display: flex;
      width: calc(100% - 10px);
      margin-top: 16px;

      .title {
        font-size: 14px;
        color: #666666;
        min-width: 40px;
        padding-top: 5.5px;
      }
      .val-none {
        flex: 1;
        padding: 3px 0px 8px 0px;
        color: #666666;
        line-height: 1.5;
      }

      .val {
        flex: 1;
        border: 1px solid #e5e5e5;
        box-sizing: border-box;
        background: #f8f8f9;
        padding: 8px 0px 8px 12px;
        border-radius: 4px;

        font-size: 14px;
        color: #666666;
        line-height: 1.5;
        max-height: 75px;
        overflow: auto;
      }
    }
  }
}

// }
</style>
