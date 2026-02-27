<template>
  <el-popover placement="right" :width="248" trigger="hover" :show-arrow="false" :offset="20">
    <template #reference>
      <div>
        <img class="w-46px h-46px rounded-2px" :src="url" />
      </div>
    </template>
    <div class="image-preview-container">
      <div class="product-name line-clamp-2 cursor-pointer" :title="goodsName + ' (点击跳转商品链接)'"
        @click="handleProductClick">
        {{ goodsName }}</div>
      <img class="w-full object-fit-contain object-position-center product-image mt-10px" :src="url" />


      <!-- 商品信息显示 -->
      <div class="product-info mt-10px text-(12px #415A88)">
        <div class="flex items-center">
          <span class="mr-10px">商品编码:</span>
          <span>{{ goodsCode }}</span>
        </div>
        <div class="flex items-center mt-10px">
          <span class="mr-10px">商品ID:</span>
          <span class="mr-6px">{{ goodsId }}</span>
          <img src="@/assets/svgs/visualCenter/copy.svg" class="copy-icon cursor-pointer align-middle"
            @click="copyToClipboard(goodsId || '')" title="复制商品ID" alt="复制" />
        </div>
      </div>
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { getUrlByTypeAndId } from '@/utils'

const props = defineProps({
  url: String,
  // 商品信息
  goodsName: String,
  goodsCode: String,
  goodsId: String,
  groundingTime: String,
  // 渠道信息
  channel: {
    type: String,
    default: 'TaoBao'
  },
  // 是否显示商品信息
  showProductInfo: {
    type: Boolean,
    default: false
  }
})

// 点击商品名称跳转到商品链接
const handleProductClick = () => {
  if (props.goodsId && props.channel) {
    getUrlByTypeAndId(props.channel, props.goodsId)
  } else {
    ElMessage.warning('商品信息不完整，无法跳转')
  }
}

// 复制到剪贴板功能
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案：使用传统的复制方法
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      ElMessage.success('复制成功')
    } catch (fallbackErr) {
      ElMessage.error('复制失败')
    }
    document.body.removeChild(textArea)
  }
}
</script>
<style scoped lang="scss">
.image-preview-container {
  padding: 4px 6px;
}

.product-image {
  height: 172px;
  border-radius: 6px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0px;
  color: #0064FF;
  transition: all 0.2s ease;

  &:hover {
    color: #0052CC;
    text-decoration: underline;
    transform: scale(1.02);
  }
}

.copy-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  vertical-align: middle;
  display: inline-block;

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
}
</style>
