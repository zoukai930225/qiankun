<template>
  <div class="topSearch">
    <div class="topSearch-search">
      <el-input
        class="topSearch-search-input"
        :prefix-icon="Search"
        v-model="input"
        placeholder="请输入商品ID/商品名称/货品编码进行搜索"
        clearable
        @keyup.enter="handleQuery"
        @clear="handleQuery"
      />
    </div>
    <div class="topSearch-filter">
      <div class="title">热门搜索</div>
      <div class="topSearch-filter-list">
        <div
          class="item"
          v-for="(value, index) in list"
          :key="index"
          :class="{ itemSelect: value.code === selectCategory }"
          @click="categorySelect(value)"
          >{{ value.name }}</div
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import { Search } from '@element-plus/icons-vue'
const props = defineProps({
  list: propTypes.array.def([]),
  selectCategory: propTypes.string.def('')
})

const input = ref('')

const handleQuery = () => {
  emit('inputHandleQuery', input.value)
}

const categorySelect = (value: any) => {
  emit('selectCategory', value.code)
}

const emit = defineEmits(['selectCategory', 'inputHandleQuery'])
</script>

<style lang="scss" scoped>
.topSearch {
  display: flex;
  flex-direction: column;
  align-items: center;
  &-search {
    margin-left: auto;
    margin-right: auto;
    margin-top: 35px;
    margin-bottom: 20px;
    width: 52vw;
    height: 50px;

    :deep(.el-input__wrapper) {
      width: 52vw;
      height: 50px;
      background: #31313a;
      border-radius: 2px;
      box-shadow: none;
    }
    :deep(.el-input__inner) {
      color: #ffffff;
      font-size: 16px;
    }
  }
  &-filter {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 52vw;
    height: 30px;
    .title {
      font-size: 16px;
      color: #7f7f84;
      line-height: 22px;
    }
    &-list {
      margin-left: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: calc(52vw - 84px);
      font-size: 16px;
      color: #ffffff;
      line-height: 30px;
      .item {
        margin-left: 10px;
        margin-right: 10px;
        width: calc(80px);
        height: 30px;
        text-align: center;
        cursor: pointer;
      }
      .itemSelect {
        background: linear-gradient(90deg, #1564ff 0%, #7665ff 100%);
        border-radius: 8px;
      }
    }
  }
}
</style>
