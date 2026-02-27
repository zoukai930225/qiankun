<template>
  <div class="conatiner">
    <div class="row-center each-card">
      <el-avatar :size="24" style="background-color: #FF6404;">问</el-avatar>
      <div class="each-info each-title">{{ row.questionName }}</div>
    </div>
    <template v-if="row.questionList?.length > 0">
      <div class="row-center each-card" v-show="!row.expand">
        <el-avatar :size="24" :src="row.questionList[0].answersUserLogo" />
        <div class="user-tag"
          :class="[{ 'user-tag-common': tagName(row.questionList[0]) === '已购', 'user-tag-back': tagName(row.questionList[0]) !== '已购' }]">
          {{
            tagName(row.questionList[0]) }}
        </div>
        <div class="each-info">{{ row.questionList[0].responseContent }}</div>
      </div>
      <AskCommonCell :item="row.questionList[0]" v-show="row.expand" />
    </template>
    <el-collapse-transition>
      <div v-show="row.expand">
        <template v-for="(item, index) in row.questionList">
          <AskCommonCell :item="item" v-if="index > 0" />
        </template>
      </div>
    </el-collapse-transition>
    <div class="row-center expand-box" v-if="row.questionList.length > 0" @click="toggleExpand">
      <template v-if="!row.expand">
        <span class="mr5px">查看全部回答</span><el-icon>
          <ArrowDown />
        </el-icon>
      </template>
      <template v-else>
        <span class="mr5px">收起</span><el-icon>
          <ArrowUp />
        </el-icon>
      </template>
    </div>

  </div>
</template>
<script lang="ts" setup>
import AskCommonCell from './askCommonCell.vue'
const props = defineProps({
  row: {
    type: Object as any,
    requird: true
  }
})
const emit = defineEmits(['toggleExpand'])
const tagName = (item: any) => {
  if (item.answererTagList) {
    return item.answererTagList.split(',')[0]
  }
  return '已购'
}

const toggleExpand = () => {
  emit('toggleExpand', props.row)
}
</script>
<style lang="scss" scoped>
.conatiner {
  width: 100%;

  .each-card {
    padding: 5px 0;
    align-items: flex-start;
  }

  .each-info {
    margin-left: 10px;
    max-width: calc(100% - 90px);
    word-break: break-all;
    font-size: 14px;
    color: #333;
    line-height: 24px;
    text-align: left;
  }

  .each-title {
    font-weight: bold;
    line-height: 24px;
    max-width: calc(100% - 34px);
    margin-left: 10px;
  }

  .user-tag {
    font-size: 10px;
    line-height: 1;
    padding: 4px 6px;
    margin-left: 10px;
    margin-top: 3px;

    &-common {
      background-color: #ffdeca;
      color: #FF6404;
    }

    &-back {
      background-color: #FEF2D7;
      color: #CD8200;
    }
  }

  .expand-box {
    color: #999999;
    margin-left: 34px;
    cursor: pointer;
  }

}
</style>