<template>
  <div v-if="list && list.length > 0" class="swFilterAddMore">
    <div
      class="swFilterAddMore-left"
      :style="{ borderRadius: list.length === 1 ? '4px' : '4px 0 0 4px' }"
      @click="clickLeftBtn"
    >
      <el-icon :size="16" color="#FFFFFF" class="swFilterAddMore-left-addIcon">
        <Plus v-if="['add', 'addOther'].includes(currentCode)" />
        <Download v-if="currentCode === 'import'" />
        <Upload v-if="['export', 'exportImg', 'exportExcel'].includes(currentCode)" />
        <Document v-if="['template', 'articleImport', 'maintenanceTasks'].includes(currentCode)" />
        <Refresh v-if="['syncData'].includes(currentCode)" />
        <DocumentCopy v-if="['copy'].includes(currentCode)" />
      </el-icon>
      <el-button
        class="swFilterAddMore-left-loading"
        v-if="loading"
        :loading="loading"
        type="text"
      />
      <div class="swFilterAddMore-left-addText" :style="{ width: addTextWidth }">{{
        currentLabel
      }}</div>
    </div>
    <el-popover
      v-if="list && list.length > 1"
      ref="newElPopperRef"
      placement="bottom"
      :width="123"
      trigger="hover"
      :show-arrow="false"
    >
      <template #reference>
        <div class="swFilterAddMore-right">
          <img
            class="swFilterAddMore-right-moreIcon"
            src="@/assets/imgs/common/filter_add_arrow.png"
          />
        </div>
      </template>
      <div class="moreDialog">
        <div style="height: 10px"></div>
        <div
          class="item"
          v-for="(value, index) in list"
          :key="index"
          :class="{ itemSelect: value.code === currentCode }"
          @click="addBtnClick(value)"
        >
          <div class="item-label" :class="{ 'item-labelSelect': value.code === currentCode }">{{
            value.label
          }}</div>
        </div>
        <div style="height: 2px"></div>
      </div>
    </el-popover>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  list: propTypes.array.def([]),
  currentCode: propTypes.string.def('add'),
  loading: propTypes.bool.def(false)
})

// code对应的类型
// add:新建 addOther 其他新增  template:模版下载 import:导入 export:导出 syncData 同步数据

const currentLabel = computed(() => {
  return props.list.find((item) => item.code === props.currentCode)?.label
})

const addTextWidth = computed(() => {
  if (props.currentCode === 'exportExcel') {
    return '67px'
  }
  const label = props.list.find((item) => item.code === props.currentCode)?.label
  return `${label.length * 14 + 2}px`
})

const newElPopperRef = ref()

const clickLeftBtn = () => {
  emit('addBtnClick', { code: props.currentCode })
}

const addBtnClick = (value) => {
  if (value) {
    emit('addBtnClick', value)
    newElPopperRef.value?.hide()
  }
}

const emit = defineEmits(['addBtnClick'])
</script>

<style lang="scss" scoped>
.swFilterAddMore {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 32px;
  font-size: 14px;
  color: #ffffff;
  line-height: 18px;
  background: rgba(255, 255, 255, 0.37);
  &-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 32px;
    background: #0064ff;
    border-radius: 4px 0px 0px 4px;
    cursor: pointer;
    width: auto;
    &-addIcon {
      margin-left: 10px;
      margin-right: 4px;
      width: 16px;
      height: 16px;
    }
    &-loading {
      background: transparent;
      width: 16px;
      height: 32px;
      margin-right: 4px;
      background-color: transparent;
      box-shadow: none;
      border: none; /* 去掉边框 */
    }
    &-addText {
      padding-right: 12px;
    }
  }
  &-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 0.5px;
    width: 26px;
    height: 32px;
    background: #0064ff;
    border-radius: 0px 4px 4px 0px;
    &-moreIcon {
      width: 10px;
      height: 6px;
    }
  }
  &-right:hover {
    background: #277bfd;
  }
}
.moreDialog {
  margin: -13px;
  margin-top: -18px;
  background: #ffffff;
  box-shadow: 0px 2px 18px 0px rgba(0, 31, 61, 0.08);
  border: 1px solid #ebebeb;
  border-radius: 4px;
  .item {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    height: 33px;
    font-size: 12px;
    color: #333333;
    line-height: 20px;
    &-label {
      color: #333333;
    }

    &-labelSelect {
      color: #0064ff;
    }
  }
  .itemSelect {
    background: #f3f4f7;
  }
}
:deep(.el-button.is-loading) {
  background: transparent;
}
:deep(.el-button.is-loading:before) {
  background: transparent;
}
:deep(.el-icon) {
  color: #fff;
}
</style>
