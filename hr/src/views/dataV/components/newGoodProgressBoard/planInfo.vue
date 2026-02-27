<template>
  <div class="planInfo" :class="{ planInfo1: Number(data.planType || '') === 1 || Number(data.planType || '') === 3 }">
    <div class="planInfo-title">企划</div>
    <img class="planInfo-avatar" :src="getPersonalInfo().avatarOrigin" />
    <div class="planInfo-name">{{ getPersonalInfo().name }}</div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { handleJSONParse } from '@/views/OA/new/product/utils.js'
const props = defineProps({
  data: propTypes.object.def({})
})

const getPersonalInfo = () => {
  let personalInfo = {
    avatarOrigin: '',
    name: ''
  }
  if (props.data.businessEnterpriseCreateList) {
    let businessEnterpriseCreateList = handleJSONParse(props.data.businessEnterpriseCreateList)
    if (businessEnterpriseCreateList && businessEnterpriseCreateList.length > 0) {
      personalInfo.avatarOrigin = businessEnterpriseCreateList[0].avatarOrigin || ''
      personalInfo.name = businessEnterpriseCreateList[0].name || ''
      if (businessEnterpriseCreateList.length > 1) {
        personalInfo.name = `${personalInfo.name}`
      }
    }
  }
  return personalInfo
}
</script>
<style lang="scss" scoped>
.planInfo {
  margin-top: 7px;
  border-radius: 4px;
  background: #defbff;
  box-sizing: border-box;
  height: 26px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &-title {
    padding-left: 6px;
    font-size: 10px;
    color: #666666;
  }

  &-avatar {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    margin-left: 7px;
    margin-right: 2px;
  }

  &-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 34px;
    font-size: 10px;
    color: #333333;
    line-height: 26px;
  }
}

.planInfo1 {
  background: #fdeff7;
}
</style>
