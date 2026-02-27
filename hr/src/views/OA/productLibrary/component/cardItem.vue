<template>
  <div class="card-item" @click="toDetail(item)">
    <el-image lazy :src="getUrl(item.productPicture) || empty" class="img" fit="contain"></el-image>
    <div class="info">
      <div class="name">{{ item.productName }}</div>
      <div class="code">商品编码：{{ item.productCode }}</div>
      <div class="tags">
        <template v-if="item.completeCategoryName">
          <div v-for="tag in getTags(item.completeCategoryName)" class="tag">{{ tag }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import empty from '@/assets/svgs/oa/empty.svg'
import { getUrl } from '../util'
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  }
})

const getTags = (name: string) => {
  if(!name) return '-'
  return name.split('>')
}

const emits = defineEmits(['detail'])
const toDetail = (item: any) => {
  emits('detail', item)
}
</script>

<style scoped lang="scss">
.card-item {
  min-width: 304px;
  width: calc(20% - 21px);
  height: 314px;
  border-radius: 10px;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  margin: 10.5px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    border: 1px solid rgba(104, 127, 243, 0.4);
    margin-top: -10px;
    box-shadow: 0px 4px 20px 0px rgba(67, 72, 94, 0.15);
  }
  .img {
    width: 100%;
    height: 190px;
    background: #fafafc;
  }
  .info {
    padding: 20px 20px 15px 20px;
    .name {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      margin-bottom: 10px;
      word-break: break-all;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .code {
      height: 20px;
      font-size: 14px;
      color: #666666;
      margin-bottom: 6px;
    }
    .tags {
      display: flex;
      align-items: center;
      .tag {
        font-size: 14px;
        padding: 8px 10px;
        background: #fff4c8;
        border-radius: 6px;
        color: #cd8200;
        margin-right: 10px;
        &:last-child {
          margin: 0;
        }
      }
    }
  }
}
</style>
