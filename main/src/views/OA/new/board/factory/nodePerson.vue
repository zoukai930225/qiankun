<template>
  <el-popover :width="200">
    <template #reference>
      <div class="nodePerson" v-if="getPersonalAvatars().length > 0">
        <img
          class="nodePerson-avatar"
          v-for="(item, index) in getPersonalAvatars()"
          :style="{
            marginLeft: avatarMarginLeft(index)
          }"
          :key="index"
          :src="item"
        />
        <div class="nodePerson-name">{{ getPersonalInfo().name }}</div>
      </div>
    </template>
    <div class="userList">
      <commonUser v-for="user in userList" :key="user.userId" :data="user" :showBgColor="true" class="mt10px"/>
    </div>
  </el-popover>
  
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { handleJSONParse } from '@/views/OA/new/product/utils.js'
import commonUser from "@/views/OA/factory/components/commonUser.vue"
const props = defineProps({
  data: propTypes.object.def({})
})

const userList = computed(()=>{
  return handleJSONParse(props.data.assigneeUserList)
})

const getPersonalAvatars = () => {
  let personalAvatars = []
  if (props.data.assigneeUserList) {
    let assigneeUserList = handleJSONParse(props.data.assigneeUserList)
    personalAvatars = assigneeUserList.map((item: any) => item.userAvatarOrigin || '').splice(0,3)
  }
  return personalAvatars
}
const getPersonalInfo = () => {
  let personalInfo = {
    name: ''
  }
  if (props.data.assigneeUserList) {
    let assigneeUserList = handleJSONParse(props.data.assigneeUserList)
    if (assigneeUserList && assigneeUserList.length > 0) {
      personalInfo.name = assigneeUserList[0].userName || ''
      if (assigneeUserList.length > 1) {
        personalInfo.name = assigneeUserList[assigneeUserList.length - 1].userName || ''
      }
    }
  }
  return personalInfo
}
const avatarMarginLeft = (index: number) => {
  if (index > 0) {
    return '-11px'
  } else {
    return '0px'
  }
}
</script>
<style lang="scss" scoped>
.nodePerson {
  border-radius: 9px;
  background: #d5e2ff;
  box-sizing: border-box;
  height: 19px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &-avatar {
    width: 17px;
    height: 17px;
    border-radius: 50%;
  }
  &-avatar1 {
  }

  &-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 34px;
    font-size: 10px;
    color: #3d3d3d;
    padding-left: 2px;
    padding-right: 7px;
    line-height: 19px;
  }
}
.userList{
  margin: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  // gap: 4px;
}
</style>
