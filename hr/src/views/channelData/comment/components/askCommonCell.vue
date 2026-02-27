<template>
  <div class="">
    <div class="row-center card-expand">
      <div class="row-center">
        <el-avatar :size="24" :src="item.answersUserLogo" />
        <div class="ml10px">{{ item.answersUserNick }}</div>
        <div class="user-tag" v-if="tagName(item) !== '已购'"
          :class="[{ 'user-tag-common': tagName(item) === '已购', 'user-tag-back': tagName(item) !== '已购' }]"
          style="margin-top: 0;">{{
            tagName(item) }}
        </div>
        <img :src="item.answersUserStarPic" class="ml-5px" object-fit="contain" style="width: 24px;" />
      </div>
      <div class="row-center right-text">
        <el-icon :size="16" color="#999999">
          <ChatDotRound />
        </el-icon>
        <div class="ml5px mr15px">{{ item.commentCount }}</div>
        <img src="@/assets/svgs/zan.svg" class="zan-icon" />
        <div class="ml5px">{{ item.likeCount }}</div>
      </div>
    </div>
    <div class="answer-content">{{ item.responseContent }}</div>
    <div class="answer-content row-center answer-time">
      <div>{{ item.responseTime }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  item: {
    type: Object as any,
    requird: true
  }
})

const tagName = (item: any) => {
  if (item.answererTagList) {
    return item.answererTagList.split(',')[0]
  }
  return '已购'
}
</script>
<style lang="scss" scoped>
.right-text {
  font-size: 12px;
  color: #999999;
  line-height: 12px;
}

.zan-icon {
  width: 16px;
  height: 16px;
}


.user-tag {
  font-size: 10px;
  line-height: 1;
  padding: 4px 6px;
  margin-left: 10px;

  &-common {
    background-color: #ffdeca;
    color: #FF6404;
  }

  &-back {
    background-color: #FEF2D7;
    color: #CD8200;
  }
}

.card-expand {
  padding: 5px 0;
  justify-content: space-between;
}

.answer-content {
  text-align: left;
  margin-left: 34px;
  max-width: calc(100% - 34px);
}

.answer-time {
  color: #999999;
  justify-content: space-between;
  font-size: 12px;
}
</style>