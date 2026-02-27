<template>
  <div class="flex items-center" >
    <commonUser  v-for="item in showList" :data="item" :key="item.userId"/>
    <el-popover
      placement="bottom-end"
      :show-arrow="false"
      :width="popList ? (95 * popList.length) : 360"
      trigger="hover"
      :offset="6"
      :disabled="!moreNumber"
    >
      <template #reference>
        <div class="num" v-show="moreNumber">
          {{ `+${moreNumber}` }}
        </div>
      </template>
      <div class="userList">
        <commonUser :data="item" v-for="item in popList"  :key="item.userId" class="mb10px"/>
      </div>
    </el-popover>
  </div>
  
</template>

<script lang="ts" setup>
import commonUser from './commonUser.vue';

const props = defineProps({
  personList: { 
    type: Array as any,
    default: () => [] 
  },
  showCount:{
    type:Number,
    default: 3
  }
})

const showList = computed(()=>{
  return props.personList?.slice(0,props.showCount)
})

const popList = computed(()=>{
  return props.personList?.slice(props.showCount)
})

const moreNumber = computed(()=>
{
  const num =  props.personList?.length - props.showCount
  return num > 0 ? num : 0
}
)

</script>
<style lang="scss" scoped>
.num{
  display: inline-flex;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: #ededed;
  border-radius: 2px;
  align-items: center;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  justify-content: center;
}
.userList{
  padding: 3px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
</style>
