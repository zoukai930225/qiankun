<template>
  <div class="primary-card flex">
    <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20">
      <template #reference>
        <el-image class="w-158px h-158px" :src="item.goodsImage || getImgUrlById(item.goodsId)" fit="fill" />
      </template>
      <GoodCard
        :good="{ materialName: item.goodsName, materialId: item.goodsId, channel: item.channel || getChannelByStore(item.store || '') }" />
    </el-popover>
    <div class="desc flex-1 w-0 flex flex-col">
      <div class="desc-title flex items-center bg-[#F4F8FF] p-10px">
        <el-image class="w-22px h-22px" :src="getStoreIcon(item.channel || 'swTaobao')" fit="contain" />
        <h3 :title="item.goodsName"
          class="ml-10px flex-1 min-w-0 text-#333 text-16px font-500 whitespace-nowrap overflow-hidden text-ellipsis">{{
            item.goodsName }}</h3>
      </div>
      <ul class="desc-list grid grid-cols-[1.2fr_1fr_116px] gap-x-10px p-[10px_6px_0_6px] flex-1 content-between">
        <li class="desc-list-item" v-for="field in fields" :key="field.key">
          <div class="desc-list-item-name text-#666 font-14px whitespace-nowrap">{{
            field.name }}</div>
          <div class="desc-list-item-value text-#333 font-14px mt-6px font-500 flex items-center">
            <el-tooltip :content="infoShow(field, item)" placement="top" :disabled="setDisabled(field, item)">
              <span class="whitespace-nowrap overflow-hidden text-ellipsis inline-block max-w-114px">
                {{ infoShow(field, item) }}
              </span>
            </el-tooltip>
            <img v-if="item[field.key] && field.isCopy" :src="copySvg" class="w-12px h-12px ml-6px cursor-pointer"
              alt="copy" @click="copyText(String(item[field.key]))" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="tsx">
export default { name: 'GoodFiche' };
</script>

<script lang="tsx" setup>
import { getImgUrlById, getStoreIcon, getChannelByStore, getInfoLength } from '@/utils/index'
import copySvg from '@/assets/svgs/visualCenter/copy.svg';
import { copyText } from '@/utils/copyText';
import GoodCard from './goodCard.vue';
import dayjs from 'dayjs'

const props = defineProps({
  item: { type: Object, required: true },
  fields: { type: Array<any>, required: true, default: () => [] },
});

const infoShow = (field: any, item: any) => {
  return `${field?.format ? formatDate(item[field.key], field.format) : (item[field.key] || '-')}`
};

const setDisabled = (field: any, item: any) => {
  return getInfoLength(infoShow(field, item)) < (field?.length || Infinity);
};

const formatDate = (value: any, formatStr: string = 'YYYY-MM-DD') => {
  if (!value) return '-'
  return dayjs(value as any).isValid() ? dayjs(value as any).format(formatStr) : '-'
};

</script>
<style scoped lang="scss">
.primary-card {
  padding: 10px;
  height: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}
</style>
