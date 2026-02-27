<template>
  <div class="top-card"
    :class="[{ 'top-card-canselect': [3, 4].includes(data.iconType), 'top-card-selected': data.selected }]"
    @click="handleClick">
    <sapn class="each-tag" :class="`each-tag-${data.iconType}`">{{ data.title }}</sapn>
    <div class="row-center mt20px">
      <div :class="[`each-tag-${data.iconType}`]" class="row-center left-icon">
        <el-icon :size="30" v-if="data.iconType !== 2">
          <Document v-if="data.iconType === 1" />
          <Finished v-if="data.iconType === 3" />
          <Warning v-if="data.iconType === 4" />
        </el-icon>
        <Icon icon="ep:shop" :size="30" v-if="data.iconType === 2" />
      </div>
      <el-skeleton :rows="1" animated style="width: calc(100% - 80px);" class="ml15px" :loading="loading">
        <div class="top-card-value">{{ numberFormateShow(data.value) || 0 }}</div>
      </el-skeleton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { numberFormateShow } from '@/utils/formatter'
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      title: '',
      iconType: 1,
      value: 0,
      selected: false
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
});
const emiter = defineEmits(['click'])
const handleClick = () => {
  if (![3, 4].includes(props.data.iconType)) return
  emiter('click')
}
</script>
<style lang="scss" scoped>
.top-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 15px;

  &-canselect {
    cursor: pointer;

    &:hover {
      border-color: #0064FF;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    }
  }

  &:hover {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  }

  &-selected {
    border-color: #0064FF;
  }

  .each-tag {
    padding: 4px 16px;
    border-radius: 100px;
    font-size: 14px;
    line-height: 20px;
    color: #fff;

    &-1 {
      color: #0064FF;
      background-color: #CCE0FF;
    }

    &-2 {
      color: #8267C7;
      background-color: #dbd0f6;
    }

    &-3 {
      color: #349B34;
      background-color: #D6EBD6;
    }

    &-4 {
      color: #EB3737;
      background-color: #FFD9D9;
    }
  }

  &-value {
    font-size: 38px;
    margin-left: 15px;
  }
}

.left-icon {
  width: 60px;
  height: 60px;
  border-radius: 100px;
  justify-content: center;
}
</style>