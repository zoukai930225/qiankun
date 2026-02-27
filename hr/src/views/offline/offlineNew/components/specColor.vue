<template>
  <div class="fabricComposition">
    <div
      class="item"
      :class="{ itemDisable: forbidEdit }"
      v-for="(value, index) in list"
      :key="index"
    >
      <div class="item-text" :class="{ 'item-textDisable': forbidEdit }">{{ value }}</div>
      <img
        v-if="!forbidEdit"
        class="item-close"
        src="@/assets/imgs/oa/oa_design_close.png"
        @click="deleteClick(index)"
        alt=""
      />
    </div>
    <div v-if="!forbidEdit" class="item item1" @click="addClick">
      <img class="item-add" src="@/assets/imgs/oa/oa_design_add.png" alt="" />
      <div class="item-text item-text1"> {{ addText || '添加规格' }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  title: {
    type: String
  },
  addText: {
    type: String
  },
  forbidEdit: {
    type: Boolean,
    default: false
  }
})

const addClick = () => {
  if (props.forbidEdit) {
    return
  }
  emit('addClick')
}
const deleteClick = (index) => {
  if (props.forbidEdit) {
    return
  }
  emit('deleteClick', index)
}

const emit = defineEmits(['addClick', 'deleteClick'])
</script>

<style lang="scss" scoped>
.fabricComposition {
  display: flex;
  flex-wrap: wrap;
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 10px;
    height: 32px;
    background: rgba(0, 100, 255, 0.1);
    border-radius: 4px;
    border: 1px solid #0064ff;
    .item-add {
      margin-left: 12px;
      margin-right: -2px;
      width: 8px;
      height: 8px;
    }
    .item-text {
      padding-left: 10px;
      padding-right: 10px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #0064ff;
    }
    .item-text1 {
      color: #333333;
    }
    .item-textDisable {
      color: #333333;
    }
    .item-close {
      margin-left: -4px;
      margin-right: 12px;
      width: 8px;
      height: 8px;
      cursor: pointer;
    }
  }
  .item1 {
    background: #ffffff;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
  }
  .itemDisable {
    color: #333333;
    border-radius: 4px;
    background: #f8f8f9;
    box-sizing: border-box;
    /* 应用/边框 */
    border: 1px solid #e5e5e5;
  }
}
</style>
