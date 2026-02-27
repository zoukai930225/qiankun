<!--
 * @Date: 2025-06-20 17:55:54
-->
<template>
  <div class="title">
    <div class="left">
      <div v-if="!item.clickRateSeven || !item.clickConversionRateSeven">
        <el-tooltip :content="'缺失7天付费点击率/7天付费转换率数据'">
          <img
            style="width: 10px; height: 10px; margin-right: 4px"
            src="@/assets/imgs/web/need.png"
            alt=""
          />
        </el-tooltip>
      </div>
      <div class="versionDesc">推广版本 第{{ item.version }}版 ({{ desc }})</div>
      <div class="versionTime">
        <img src="@/assets/imgs/web/tuiTime.png" alt="" />
        <span>版本时间</span>
        <span class="time">{{ item.mappingTime }}</span>
      </div>
    </div>
    <div class="right">
      <div class="desc flex justify-between">
        <slot></slot>
        <slot name="desc-right"></slot>
        <img :src="delSvg" class="del" @click="handelDelete"/>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import delSvg from '@/assets/imgs/newMedia/del.svg'
import { deletePromotionImageVersion } from '@/api/gallery'
const message = useMessage()

// 外面传递 item 对象
const props = withDefaults(
  defineProps<{
    item: {
      clickRateSeven: number | null
      clickConversionRateSeven: number | null
      version: number
      mappingTime: string
      versionTime?: string
      goodsId?: string
    }
    desc?: string
    isAuto: boolean
  }>(),
  {
    isAuto: false
  }
)

const emits = defineEmits(['deleteSuccess'])
const handelDelete = async() => {
  await message.confirm('请确认是否删除？')
  await deletePromotionImageVersion({
    goodsId:props.item.goodsId,
    version:props.item.version
  })
  message.success('删除成功')
  emits('deleteSuccess')
}
</script>

<style scoped lang="scss">
.title{
  padding: 6px 10px;
  border-radius: 4px 4px 0 0;
  background: #f0f6ff;
  box-sizing: border-box;
  border: 1px solid #ecf0fc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left{
    display: flex;
    align-items: center;
    .versionDesc{
      margin-right: 4px;
      color: #333;
      font-weight: 600;
      font-size: 16px;
    }
    .versionTime{
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #666;
      margin-left: 10px;
      img{
        width: 14px;
        height: 14px;
        margin-right: 2px;
      }
      .time{
        margin-left: 3px;
      }
    }
  }
  .right{
    .del{
      width: 15px;
      height: 16px;
      margin-left: 10px;
      cursor: pointer;
      &:hover{
        opacity: .6;
      }
    }
  }
}
</style>
