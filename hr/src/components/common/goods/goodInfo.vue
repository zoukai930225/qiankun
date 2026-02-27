<template>
  <div class="row-center" @click="getUrlByTypeAndId(row.channel || 'TaoBao', row.goodsId)"
    style="margin-top: 0.208333vw; margin-bottom: 0.15625vw; cursor: pointer">
    <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20">
      <template #reference>
        <div class="goodImg">
          <img style="width: 2.395833vw; height: 2.395833vw; border-radius: 0.208333vw"
            :src="row?.goodsImage || row?.productImage || row?.productImage?.fileUrl || ''" />
        </div>
      </template>
      <GoodCard :good="{
        materialName: row?.goodsName || row?.goods_name || '',
        materialId: row.goodsId,
        goodsImage: row?.goodsImage || row?.productImage || row?.productImage?.fileUrl || '',
        channel: row.channel || ''
      }" />
    </el-popover>
    <div class="goodName">{{ row?.goodsName || row?.goods_name || '' }}</div>
  </div>
</template>

<script lang="ts">
export default { name: 'GoodInfo' };
</script>

<script lang="ts" setup>
import GoodCard from '@/components/common/goods/goodCard.vue';
import { getUrlByTypeAndId } from "@/utils";

const props = defineProps({ row: { type: Object, reuqired: true, default: () => { } } });

</script>
<style lang="scss" scoped>
.goodImg {
  width: 2.395833vw;
  height: 2.395833vw;
  border-radius: 0.104167vw;
  margin-right: 0.416667vw;
}

.goodName {
  width: calc(100% - 3.645833vw);
  font-size: 0.729167vw;
  color: #0064ff;
  line-height: 1.041667vw;
  white-space: normal;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
