<template>
  <div class="customerServicePeopleItem">
    <img
      v-if="data.isLeader"
      class="leaderStar"
      src="@/assets/imgs/customerService/leader_star.png"
    />
    <div v-else class="leaderStar"></div>

    <div class="userInfo">
      <CustomerServicePeople :data="data" />
    </div>

    <el-tooltip
      effect="dark"
      :content="data.customerNickName ? data.customerNickName : `客服${data.name}`"
      placement="right"
    >
      <div class="serviceName text1">
        {{ data.customerNickName ? data.customerNickName : `客服${data.name}` }}
      </div>
    </el-tooltip>

    <div v-if="data.isLeader" class="leaderName">组长</div>
    <div v-else class="leaderName1">组长</div>
    <div class="delete edit" @click="editPersonInfo">
      <div class="delete-item">编辑 </div>
    </div>
    <div class="delete" @click="deletePersonInfo">
      <div class="delete-item">删除 </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import CustomerServicePeople from '@/views/customerService/components/people.vue'

const props = defineProps({
  index: propTypes.number.def(0),
  data: propTypes.object.def({ name: '', avatarOrigin: '' })
})

const editPersonInfo = () => {
  emit('editPersonInfo', props.data)
}
const deletePersonInfo = () => {
  emit('deletePersonInfo', props.index)
}

const emit = defineEmits(['deletePersonInfo', 'editPersonInfo']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.customerServicePeopleItem {
  display: flex;
  flex-direction: row;
  align-items: center;
  .leaderStar {
    margin-left: 12px;
    margin-right: 15px;
    width: 12px;
    height: 14px;
  }

  .userInfo {
    width: 80px;
  }
  .serviceName {
    width: 80px;
    margin-left: 15px;
    font-size: 14px;
    color: #333333;
  }
  .leaderName {
    padding-left: 10px;
    padding-right: 10px;
    color: #0064ff;
    line-height: 22px;
  }

  .leaderName1 {
    padding-left: 10px;
    margin-right: 10px;
    color: #0064ff;
    line-height: 22px;
    opacity: 0;
  }

  .delete {
    // width: 84px;
    margin-left: auto;
    margin-right: 20px;
    &-item {
      cursor: pointer;

      width: 48px;
      height: 25px;
      background: #ffeaea;
      border-radius: 13px;
      font-size: 12px;
      color: #eb3737;
      line-height: 25px;
      text-align: center;
    }
  }
  .edit {
    margin-right: 10px;
  }
}
</style>
