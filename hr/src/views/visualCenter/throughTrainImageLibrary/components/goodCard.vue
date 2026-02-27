<template>
  <div class="goodCard">
    <div class="goodCard-bg">
      <div class="goodCard-bg-name" @click="clickGoodCard">{{ good.materialName }}</div>
      <div class="goodCard-bg-img" @click="clickGoodCard">
        <img
          style="
            width: 320px;
            height: 320px;
            border-radius: 4px;
            object-fit: contain;
            object-position: center;
          "
          :src="good.goodsImage || getImgUrlById(good.materialId)"
        />
      </div>
      <div class="goodCard-bg-goodId-text mt-14px">商品编码: {{ good.goodsCode }}</div>
      <div class="goodCard-bg-goodId">
        <div class="goodCard-bg-goodId-text">商品ID: {{ good.materialId }}</div>
        <img
          class="goodCard-bg-goodId-copy"
          src="@/assets/imgs/common/copy.png"
          alt=""
          @click="copyGoodId"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { getImgUrlById, getUrlByTypeAndId } from '@/utils/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  good: propTypes.object.def({})
})

const clickGoodCard = () => {
  if (props.good.materialId) {
    getUrlByTypeAndId(props.good.channel || 'TaoBao', props.good.materialId)
  }
}

const copyGoodId = async () => {
  try {
    if (props.good.materialId) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(props.good.materialId)
        message.success('复制成功')
      } else {
        // 创建text area
        let textArea = document.createElement('textarea')
        textArea.value = props.good.materialId
        textArea.style.position = 'absolute'
        textArea.style.opacity = '0'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise((res, rej) => {
          // 执行复制命令并移除文本框
          document.execCommand('copy') ? res(null) : rej()
          textArea.remove()
          message.success('复制成功')
        })
      }
    }
  } catch (err) {
    message.success('复制失败')
  }
}
</script>

<style scoped lang="scss">
.goodCard {
  margin: -15px;
  cursor: pointer;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 7px 2px rgba(0, 14, 53, 0.28);
  &-bg {
    display: flex;
    flex-direction: column;
    padding: 16px;

    &-name {
      white-space: normal;
      overflow: hidden;
      font-weight: 500;
      font-size: 14px;
      color: #2f8df5;
      line-height: 20px;
    }
    &-img {
      margin-top: 15px;
      width: 320px;
      height: 320px;
      border-radius: 4px;
    }
    &-goodId {
      margin-top: 14px;
      display: flex;
      flex-direction: row;
      align-items: center;
      &-text {
        font-size: 12px;
        color: #666666;
        line-height: 17px;
      }
      &-copy {
        cursor: pointer;
        margin-left: 10px;
        width: 12px;
        height: 12px;
      }
    }
  }
}
</style>
