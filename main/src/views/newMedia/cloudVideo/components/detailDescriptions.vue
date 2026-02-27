<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item label="商品ID" label-class-name="detail-label" class-name="detail-item">{{ data.goodsId || '-'
    }}</el-descriptions-item>
    <el-descriptions-item label="商品编码" label-class-name="detail-label" class-name="detail-item">{{ data.goodsCode || '-'
    }}</el-descriptions-item>
    <el-descriptions-item label="内容ID" label-class-name="detail-label" class-name="detail-item">{{ data.contentId || '-'
    }}</el-descriptions-item>
    <el-descriptions-item label="渠道" label-class-name="detail-label" class-name="detail-item">
      <div class="row-center">
        <img v-if="data.channelType && getImageUrl(data.channelType)" class="channel-img"
          :src="getImageUrl(data.channelType)" object-fit="contain" />
        <div>{{ getLable(channelList, data.channel) || '--' }}</div>
      </div>
    </el-descriptions-item>
    <!--逛逛-->
    <template v-if="Number(data.channel) === 1">
      <el-descriptions-item label="有效查看人数" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.ggValidViewPeople) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="有效查看次数" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.ggValidViewCount) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="新增粉丝数" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.ggNewFollowers) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="种草成交人数" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.ggZhongcaoPeopleCount) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="种草成交订单数" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.ggPurchaseOrders) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="种草成交金额" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.ggZhongcaoAmount) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="商品加购次数" label-class-name="detail-label" :span="2" class-name="detail-item">{{
        numberFormateShow(data.ggCartAddCount) || 0 }}</el-descriptions-item>
    </template>
    <!--超级短视频-->
    <template v-if="Number(data.channel) === 2">
      <el-descriptions-item label="花费" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.cdCost) || 0 }}</el-descriptions-item>
      <!-- <el-descriptions-item label="种草引导成交ROI" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.cdZhongcaoRoi) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="种草引导成交金额" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.cdZhongcaoAmount) || 0 }}</el-descriptions-item> -->
      <el-descriptions-item label="直接引导成交金额" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.cdDirectAmount) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="直接引导ROI" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.cdDirectAmountRoi) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="观看量" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.cdViewCount) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="新客触达成本" label-class-name="detail-label" class-name="detail-item">{{
        numberFormateShow(data.cdNewCustomerCost) || 0 }}</el-descriptions-item>
      <el-descriptions-item label="新客触达数" label-class-name="detail-label" :span="2" class-name="detail-item">{{
        numberFormateShow(data.cdNewCustomerCount) || 0 }}</el-descriptions-item>
    </template>
    <el-descriptions-item label="链接" label-class-name="detail-label" :span="2"
      class-name="detail-item detail-link"><span @click="handleLinkClick">{{
        getUrlByTypeAndId(data.channelType || 'TaoBao', data.goodsId, true)
      }}</span></el-descriptions-item>
    <el-descriptions-item label="商品名" label-class-name="detail-label" :span="2" class-name="detail-item">{{
      data.goodsName
      || '-' }}</el-descriptions-item>
    <el-descriptions-item label="类目" label-class-name="detail-label" :span="2" class-name="detail-item">{{
      getDictLabel(DICT_TYPE.STANDARD_CATEGORY, data.categoryId) || '-' }}</el-descriptions-item>
  </el-descriptions>
</template>
<script lang="ts" setup>
defineOptions({ name: 'DetailDescriptions' })
import { channelList, getLable } from '../common'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { numberFormateShow } from '@/utils/formatter'
import { propTypes } from '@/utils/propTypes'
import { getUrlByTypeAndId } from '@/utils/index'
import { getImageUrl } from "@/utils";
const props = defineProps({
  data: propTypes.object.def({}),
})

const handleLinkClick = () => {
  getUrlByTypeAndId(props.data.channelType || 'TaoBao', props.data.goodsId)
}
</script>
<style lang="scss" scoped>
:deep(.detail-label) {
  width: 180px;
  background: #F4F6FA !important;
  border: 1px solid #E5E5E5 !important;
  font-size: 14px !important;
  font-weight: normal !important;
  color: #666666 !important;
}

:deep(.detail-item) {
  color: #333333 !important;
  border: 1px solid #E5E5E5 !important;
  word-break: break-all;
}

:deep(.detail-link) {
  color: #0064FF !important;
  text-decoration: underline;
  cursor: pointer;
}

.channel-img {
  width: 20px;
  margin-right: 3px;
}
</style>