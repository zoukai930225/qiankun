<template>
  <div class="row-center box">
    <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20"
      :disabled="!row.goodsId && !row.goods_id">
      <template #reference>
        <el-image class="goods-image" :src="row.goodsImg || getImgUrlById(row.goodsId)" fit="fill"
          v-if="row.goodsImg || row.goodsId">
          <template #error>
            <div class="image-slot">
              <el-icon :size="80"><Picture /></el-icon>
            </div>
          </template>
        </el-image>
        <el-avatar shape="square" :size="120" icon="Picture" v-else
          style="cursor: pointer;background-color: #E5E5E5;" />
      </template>
      <GoodCard :good="{
        materialName: row.goodsName || row.goods_name,
        materialId: row.goodsId || row.goods_id,
        channel: row.channel
      }" />
    </el-popover>
    <div class="info-box">
      <div class="row-center info-box-title">
        <img v-if="getImageUrl(row.channel)" class="channel-img" :src="getImageUrl(row.channel)" object-fit="contain" />
        <el-tooltip effect="dark" :content="row.goodsName" placement="top-start" :disabled="row.goodsName?.length < 18">
          <div class="text1 title" :class="{ 'title-line': getImageUrl(row.channel) }">
            {{ row.goodsName }}
          </div>
        </el-tooltip>
      </div>
      <div class="info-box-sub-title row-center mt15px">
        <div class="store">店铺</div>
        <div class="code">编码</div>
        <div class="num">售价</div>
      </div>
      <div class="info-box-sub-info row-center mt5px">
        <el-tooltip effect="dark" :content="row.storeName" placement="top-start" :disabled="row.storeName?.length < 14">
          <div class="store text1">{{ row.storeName }}</div>
        </el-tooltip>
        <el-tooltip effect="dark" :content="row.goodsCode" placement="top-start" :disabled="row.goodsCode?.length < 7">
          <div class="code text1">{{ row.goodsCode }}</div>
        </el-tooltip>

        <el-tooltip effect="dark" :content="numberFormateShow(row.sale)" placement="top-start"
          :disabled="numberFormateShow(row.sale)?.length < 11">
          <div class="num text1">{{ numberFormateShow(row.sale) || '-' }}</div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import GoodCard from '@/components/common/goods/goodCard.vue'
import { getImgUrlById, getImageUrl } from '@/utils/index'
import { numberFormateShow } from '@/utils/formatter'
defineProps({
  row: {
    type: Object as PropType<any>,
    requried: true
  }
})
</script>
<style lang="scss" scoped>
.box {
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  width: 460px;
  height: 122px;
}

.goods-image {
  width: 120px;
  height: 120px;
  cursor: pointer;
  border-radius: 4px 0px 0px 4px;
}

.info-box {
  height: 120px;
  width: 338px;

  &-title {
    height: 42px;
    border-bottom: 1px solid #E8E8E8;
  }

  &-sub-title {
    text-align: left;
    font-size: 14px;
    color: #666666;
  }

  &-sub-info {
    text-align: left;
    font-size: 14px;
    color: #333333;
  }

  .store {
    width: 130px;
    margin-right: 8px;
    margin-left: 10px;
  }

  .code {
    width: 68px;
    margin-right: 8px;
  }

  .num {
    width: 98px;
  }
}

.channel-img {
  width: 22px;
  margin: 0 10px;
}

.title-line {
  max-width: 286px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}
</style>