<!--
 * @Date: 2024-08-05 18:08:34
 标题
-->
<template>
  <div>
    <div class="title-wapper" :class="formatTitle">
      <div class="logo" :class="formatType"></div>
      <div class="title">{{ title }}</div>
      <slot name="expand"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'BaseTitle' })

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  recordType: {
    type: Number,
    default: -1
  },
  statusType: {
    type: Number,
    default: -1
  }
})

const typeTitleMap = {
  1: 'bgEndTitle', //指派
  2: 'bgSuccessTitle', //完成卡片 任务提交
  3: 'bgFinishTitle', //任务完成
  4: 'bgErrorTitle', //任务暂停
  5: 'bgCurrentTitle', //评论
  6: 'bgCancleStopTitle', //取消暂停卡片
  7: 'bgCancleShenhe', //审核
  8: 'bgCancleShenheR', //审核不通过
  10: 'bgStopShenheR' //终止
}

const formatTitle = computed(() => {
  return typeTitleMap[props.recordType] || 'base'
})

/**
 * @description: bg颜色映射 0、任务指派   1、完成卡片  2、任务回退卡片  3、完成任务卡片  4、任务终止卡片 7、审核
 * @return {*}
 */
const typeMap = {
  1: 'bgEnd', //指派
  2: 'bgSuccess', //完成卡片 任务提交
  4: 'bgCurrent', //任务暂停
  3: 'bgFinish', //任务完成
  5: 'bgError', //评论
  7: 'bgshenhe', //审核通过
  8: 'bgshenheR' //审核拒绝
}
const formatType = computed(() => {
  return typeMap[props.recordType] || 'bgSuccess'
})
</script>

<style scoped lang="scss">
.title-wapper {
  margin-top: 20px;
  border-radius: 8px 8px 0px 0px;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  .logo {
    width: 3px;
    height: 10px;
    margin-right: 7px;
    border-radius: 2px;
  }
  .bgEnd {
    background: #e99d40;
  }
  .bgCurrent {
    background: #d2780b;
  }
  .bgSuccess {
    background: #0567fe;
  }
  .bgError {
    background: #716fc9;
  }
  .bgFinish {
    background: #249301;
  }
  .bgshenhe {
    // background: #008fac;
    background: #249301;
  }
  .bgshenheR {
    background: #e41027;
  }

  .title {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    font-weight: bold;
  }
}

.bgEndTitle {
  background: #fff4e6;
  box-shadow: 0px 2px 13px 0px rgba(64, 35, 0, 0.23);
  border-radius: 8px 8px 0px 0px;
}
.bgSuccessTitle {
  background: linear-gradient(90deg, #e5efff 0%, #c2daff 100%);
  box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
  border-radius: 8px 8px 0px 0px;
}
.bgCurrentTitle {
  background: #e3e3fc;
  box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
  border-radius: 8px 8px 0px 0px;
}
.bgFinishTitle {
  border-radius: 4px 4px 0px 0px;
  background: linear-gradient(90deg, #e1f3dc 0%, #d4f7c9 100%);
}
.bgErrorTitle {
  background: #d9d9d9;
  border-radius: 8px 8px 0px 0px;
}
.bgStopTitle {
  background: #d9d9d9;
  border-radius: 8px 8px 0px 0px;
}

.bgCancleStopTitle {
  background: #b1e7b5;
  border-radius: 8px 8px 0px 0px;
}

.bgCancleShenhe {
  background: linear-gradient(90deg, #e1f3dc 0%, #d4f7c9 100%);
  box-shadow: 0px 2px 13px 0px rgba(11, 46, 0, 0.23);
  border-radius: 8px 8px 0px 0px;
}

.bgCancleShenheR {
  background: linear-gradient(90deg, #fed3d7 0%, #fed1d6 100%);
  border-radius: 8px 8px 0px 0px;
}
.bgStopShenheR {
  background: linear-gradient(90deg, #fed3d7 0%, #fed1d6 100%);
  border-radius: 8px 8px 0px 0px;
}

.base {
  padding-left: 0;
  padding-right: 0;
}
</style>
