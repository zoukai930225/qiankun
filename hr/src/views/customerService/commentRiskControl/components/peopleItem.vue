<template>
  <div class="customerServicePeopleItem">
    <div class="userInfo">
      <CustomerServicePeople :data="data" />
    </div>
    <div class="percentage">
      <el-input-number
        v-model="percentageData"
        :max="100"
        :min="0"
        :controls="false"
        placeholder="请输入"
      />
      <span>%</span>
    </div>

    <el-button type="danger" :icon="Delete" link class="delete" @click="deletePersonInfo">
      删除
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { propTypes } from '@/utils/propTypes'
import CustomerServicePeople from '@/views/customerService/components/people.vue'

const props = defineProps({
  index: propTypes.number.def(0),
  data: propTypes.object.def({ name: '', avatarOrigin: '' })
})
const percentageData = ref(0)

watch(
  () => percentageData.value,
  (v: number) => {
    emit('editPersonPer', v, props.index)
  }
)
watch(
  () => props.data.percentage,
  (v: string) => {
    percentageData.value = Number(v)
  },
  {
    deep: true,
    immediate: true
  }
)

const deletePersonInfo = () => {
  emit('deletePersonInfo', props.index)
}

const emit = defineEmits(['deletePersonInfo', 'editPersonInfo', 'editPersonPer']) // 定义 success 事件，用于操作成功后的回调
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

  .percentage {
    width: 200px;
    .el-input-number {
      :deep(.el-input__inner) {
        background: #fff;
      }
    }
    display: flex;
    span {
      align-self: center;
      margin-left: 4px;
    }
  }

  .delete {
    // width: 84px;
    margin-left: 6px;
    margin-right: 0;
    :deep(.el-icon) {
      margin-right: 10px;
    }
  }
}
</style>
